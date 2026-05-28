import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Edit, Trash2, Loader2, Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface PaymentMode {
  id: string;
  mode_name: string;
  description?: string;
  is_active: boolean;
  processing_fee: number;
  gateway_details?: any;
}

const PaymentModeManagementContent = () => {
  const {
    data: paymentModes,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<PaymentMode>({ 
    tableName: 'payment_modes',
    orderBy: { column: 'mode_name', ascending: true }
  });

  useAdminRealTime({
    tableName: 'payment_modes'
  });

  const [formData, setFormData] = useState({
    modeName: "",
    description: "",
    isActive: true,
    processingFee: "",
    gatewayDetails: ""
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.modeName.trim()) {
      toast.error("Please enter payment mode name");
      return;
    }

    let gatewayDetailsJson = null;
    if (formData.gatewayDetails.trim()) {
      try {
        gatewayDetailsJson = JSON.parse(formData.gatewayDetails);
      } catch (error) {
        toast.error("Invalid JSON format for gateway details");
        return;
      }
    }

    try {
      const paymentModeData = {
        mode_name: formData.modeName,
        description: formData.description || null,
        is_active: formData.isActive,
        processing_fee: parseFloat(formData.processingFee) || 0,
        gateway_details: gatewayDetailsJson
      };

      if (editingId) {
        await update(editingId, paymentModeData);
        toast.success("Payment mode updated successfully!");
        setEditingId(null);
      } else {
        await create(paymentModeData);
        toast.success("Payment mode created successfully!");
      }

      // Reset form
      setFormData({
        modeName: "",
        description: "",
        isActive: true,
        processingFee: "",
        gatewayDetails: ""
      });
    } catch (error) {
      toast.error(editingId ? "Failed to update payment mode" : "Failed to create payment mode");
    }
  };

  const handleEdit = (paymentMode: PaymentMode) => {
    setFormData({
      modeName: paymentMode.mode_name,
      description: paymentMode.description || "",
      isActive: paymentMode.is_active,
      processingFee: paymentMode.processing_fee.toString(),
      gatewayDetails: paymentMode.gateway_details ? JSON.stringify(paymentMode.gateway_details, null, 2) : ""
    });
    setEditingId(paymentMode.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      modeName: "",
      description: "",
      isActive: true,
      processingFee: "",
      gatewayDetails: ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment mode?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Payment mode deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete payment mode");
    }
  };

  const handleToggleStatus = async (paymentMode: PaymentMode) => {
    try {
      await update(paymentMode.id, {
        ...paymentMode,
        is_active: !paymentMode.is_active
      });
      toast.success(`Payment mode ${!paymentMode.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update payment mode status");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading payment modes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add/Edit Payment Mode Form */}
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="p-8 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-rose-600 flex items-center space-x-3">
            <div className="p-2 bg-rose-500 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span>{editingId ? 'Edit Payment Mode' : 'Add Payment Mode'}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Mode Name *</label>
              <Input
                value={formData.modeName}
                onChange={(e) => handleInputChange('modeName', e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                placeholder="e.g., Credit Card, PayPal, Bank Transfer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Processing Fee (₹)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.processingFee}
                onChange={(e) => handleInputChange('processingFee', e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white resize-none"
                placeholder="Enter description for this payment mode"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Gateway Details (JSON)</label>
              <Textarea
                value={formData.gatewayDetails}
                onChange={(e) => handleInputChange('gatewayDetails', e.target.value)}
                className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white resize-none font-mono text-sm"
                placeholder='{"api_key": "your_key", "endpoint": "https://api.gateway.com", "version": "v1"}'
              />
              <p className="text-xs text-gray-500">Enter gateway configuration as valid JSON (optional)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <span className="text-sm text-gray-600">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex space-x-4">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold px-8 py-3 rounded shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {editingId ? <Settings className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              {editingId ? 'Update Payment Mode' : 'Create Payment Mode'}
            </Button>
            
            {editingId && (
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modes Table */}
      <Card className="shadow-2xl border-2 border-gray-600 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-rose-600 hover:bg-rose-600">
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Actions</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Name</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Description</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Processing Fee</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Status</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Gateway Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentModes.map((mode, index) => (
                <TableRow key={mode.id} className={index % 2 === 0 ? "bg-rose-50" : "bg-white"}>
                  <TableCell className="border-2 border-gray-600 p-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(mode)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(mode.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {mode.mode_name}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {mode.description || "-"}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    ₹{mode.processing_fee.toFixed(2)}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Switch
                        checked={mode.is_active}
                        onCheckedChange={() => handleToggleStatus(mode)}
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mode.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {mode.gateway_details ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          toast.info("Gateway Details", {
                            description: JSON.stringify(mode.gateway_details, null, 2),
                            duration: 5000
                          });
                        }}
                      >
                        View Details
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModeManagementContent;