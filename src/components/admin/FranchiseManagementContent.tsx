import { useState } from "react";
import { Edit, Plus, Trash2, Building2, RefreshCw, Loader2, Users, TrendingUp, Calendar, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { toast } from "sonner";
import { AdminPresenceIndicator } from "./AdminPresenceIndicator";

interface Franchise {
  id: string;
  franchise_id: string;
  password: string;
  center_name: string;
  mobile: string;
  email: string;
  center_head: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const FranchiseManagementContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [formData, setFormData] = useState({
    franchiseId: "",
    password: "",
    centerName: "",
    mobile: "",
    email: "",
    centerHead: "",
    status: "active" as "active" | "inactive"
  });
  const [formLoading, setFormLoading] = useState(false);

  const { data: franchises, loading, create, update, delete: deleteFranchise } = useOptimisticCrud<Franchise>({
    tableName: 'franchises',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'franchises'
  });

  // Statistics calculations
  const totalFranchises = franchises.length;
  const activeFranchises = franchises.filter(f => f.status === 'active').length;
  const inactiveFranchises = franchises.filter(f => f.status === 'inactive').length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthFranchises = franchises.filter(f => 
    f.created_at && f.created_at.slice(0, 7) === currentMonth
  ).length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      franchiseId: "",
      password: "",
      centerName: "",
      mobile: "",
      email: "",
      centerHead: "",
      status: "active"
    });
    setEditingFranchise(null);
  };

  const openEditDialog = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    setFormData({
      franchiseId: franchise.franchise_id,
      password: franchise.password,
      centerName: franchise.center_name,
      mobile: franchise.mobile,
      email: franchise.email,
      centerHead: franchise.center_head,
      status: franchise.status
    });
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    if (!formData.franchiseId.trim()) {
      toast.error("Franchise ID is required");
      return false;
    }
    if (!formData.centerName.trim()) {
      toast.error("Center name is required");
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Valid email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const franchiseData = {
        franchise_id: formData.franchiseId,
        password: formData.password,
        center_name: formData.centerName,
        mobile: formData.mobile,
        email: formData.email,
        center_head: formData.centerHead,
        status: formData.status
      };

      if (editingFranchise) {
        await update(editingFranchise.id, franchiseData);
        toast.success("🎉 Franchise updated instantly!");
      } else {
        await create(franchiseData);
        toast.success("🎉 Franchise added instantly!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled by hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this franchise?")) return;
    
    try {
      await deleteFranchise(id);
      toast.success("🗑️ Franchise deleted instantly!");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading franchise data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <span>Franchise Management</span>
          </h1>
          <AdminPresenceIndicator />
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Franchises</p>
                  <p className="text-3xl font-bold">{totalFranchises}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Active Franchises</p>
                  <p className="text-3xl font-bold">{activeFranchises}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Inactive Franchises</p>
                  <p className="text-3xl font-bold">{inactiveFranchises}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-foreground">{thisMonthFranchises}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Franchise Management Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <span>Franchise Directory</span>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="bg-background/20 text-primary-foreground border-background/30 hover:bg-background/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Franchise
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingFranchise ? "Edit Franchise" : "Add New Franchise"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Franchise ID *</label>
                        <Input
                          value={formData.franchiseId}
                          onChange={(e) => handleInputChange('franchiseId', e.target.value)}
                          placeholder="Enter franchise ID"
                          disabled={formLoading}
                          className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <Input
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter password"
                          disabled={formLoading}
                          className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Center Name *</label>
                      <Input
                        value={formData.centerName}
                        onChange={(e) => handleInputChange('centerName', e.target.value)}
                        placeholder="Enter center name"
                        disabled={formLoading}
                        className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Mobile *</label>
                        <Input
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          placeholder="Enter mobile number"
                          disabled={formLoading}
                          className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter email"
                          disabled={formLoading}
                          className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Center Head</label>
                      <Input
                        value={formData.centerHead}
                        onChange={(e) => handleInputChange('centerHead', e.target.value)}
                        placeholder="Enter center head name"
                        disabled={formLoading}
                        className="mt-1 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t border-border/20">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)} 
                        disabled={formLoading}
                        className="border-border/40 hover:bg-accent/20"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        disabled={formLoading} 
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                      >
                        {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {editingFranchise ? "Update" : "Create"} Franchise
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Franchise ID
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Center Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Contact
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Center Head
                        </div>
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Status
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {franchises.map((franchise, index) => (
                      <tr 
                        key={franchise.id} 
                        className={`border-b border-border/20 transition-colors hover:bg-accent/30 ${
                          index % 2 === 0 ? "bg-background" : "bg-accent/10"
                        }`}
                      >
                        <td className="border-r border-border/20 px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(franchise)}
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10 hover:text-primary/80"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(franchise.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 font-medium text-foreground">
                          {franchise.franchise_id}
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 font-medium text-foreground">
                          {franchise.center_name}
                        </td>
                        <td className="border-r border-border/20 px-6 py-4">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center text-muted-foreground">
                              <span className="text-xs mr-1">📞</span>
                              {franchise.mobile}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <span className="text-xs mr-1">✉️</span>
                              {franchise.email}
                            </div>
                          </div>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 font-medium text-foreground">
                          {franchise.center_head}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            variant={franchise.status === 'active' ? 'default' : 'secondary'}
                            className={franchise.status === 'active' 
                              ? 'bg-accent text-accent-foreground hover:bg-accent/80' 
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }
                          >
                            {franchise.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {franchises.length === 0 && (
                <div className="text-center py-12 bg-background">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Building2 className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">No franchises found</h3>
                      <p className="text-muted-foreground">Get started by creating your first franchise.</p>
                    </div>
                    <Button 
                      onClick={() => {resetForm(); setIsDialogOpen(true);}} 
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Franchise
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseManagementContent;