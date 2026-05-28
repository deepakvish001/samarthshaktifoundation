import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { 
  Building2, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw, 
  Loader2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Star,
  Filter
} from "lucide-react";

interface HeadOffice {
  id: string;
  name: string | null;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_primary: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const HeadOfficeContent = () => {
  const {
    data: headOffices,
    loading,
    create,
    update,
    delete: deleteItem
  } = useOptimisticCrud<HeadOffice>({ 
    tableName: 'head_offices',
    orderBy: { column: 'created_at', ascending: false }
  });


  useAdminRealTime({
    tableName: 'head_offices'
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<HeadOffice | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isPrimary: false,
    status: "active" as "active" | "inactive"
  });
  const [formLoading, setFormLoading] = useState(false);

  // Filter head offices
  const filteredOffices = headOffices.filter(office => {
    const matchesSearch = 
      office.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.phone.includes(searchTerm) ||
      office.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || office.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isPrimary: false,
      status: "active"
    });
    setEditingOffice(null);
  };

  const openEditDialog = (office: HeadOffice) => {
    setEditingOffice(office);
    setFormData({
      name: office.name || "",
      address: office.address,
      phone: office.phone,
      email: office.email,
      website: office.website || "",
      city: office.city || "",
      state: office.state || "",
      postalCode: office.postal_code || "",
      country: office.country || "India",
      isPrimary: office.is_primary,
      status: office.status
    });
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const officeData = {
        name: formData.name || null,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postalCode || null,
        country: formData.country,
        is_primary: formData.isPrimary,
        status: formData.status
      };

      if (editingOffice) {
        await update(editingOffice.id, officeData);
        toast.success("Head office updated successfully!");
      } else {
        await create(officeData);
        toast.success("Head office added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(`Failed to save head office: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (officeId: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this head office?")) return;

    try {
      await deleteItem(officeId);
      toast.success("Head office deleted successfully!");
    } catch (error: any) {
      toast.error(`Failed to delete head office: ${error.message}`);
    }
  };

  const handleStatusToggle = async (officeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await update(officeId, { status: newStatus });
      toast.success(`Head office status updated to ${newStatus}!`);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading head office data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with controls */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span>Head Office Management</span>
              </CardTitle>
              <div className="flex space-x-3">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={resetForm}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm flex items-center space-x-2 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Head Office</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-primary/20">
                    <DialogHeader className="border-b border-border pb-4">
                      <DialogTitle className="flex items-center space-x-2 text-xl font-bold text-foreground">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <span>{editingOffice ? "Edit Head Office" : "Add New Head Office"}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                      {/* Basic Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                          <Building2 className="h-4 w-4" />
                          <span>Basic Information</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-foreground">Office Name</label>
                            <Input
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter office name"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground">
                              Email <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter email address"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-foreground">
                            Address <span className="text-destructive">*</span>
                          </label>
                          <Textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter full address"
                            className="mt-1 min-h-[100px] border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            disabled={formLoading}
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                          <Phone className="h-4 w-4" />
                          <span>Contact Information</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-foreground">
                              Phone <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter phone number"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground">Website</label>
                            <Input
                              value={formData.website}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              placeholder="Enter website URL"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location Information Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                          <MapPin className="h-4 w-4" />
                          <span>Location Information</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-foreground">City</label>
                            <Input
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="Enter city"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground">State</label>
                            <Input
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              placeholder="Enter state"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground">Postal Code</label>
                            <Input
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              placeholder="Enter postal code"
                              disabled={formLoading}
                              className="mt-1 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Settings Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                          <Globe className="h-4 w-4" />
                          <span>Settings</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-foreground">Country</label>
                            <Select 
                              value={formData.country} 
                              onValueChange={(value) => handleInputChange('country', value)}
                            >
                              <SelectTrigger disabled={formLoading} className="mt-1 h-11 border-2 border-border focus:border-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="USA">USA</SelectItem>
                                <SelectItem value="UK">UK</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground">Status</label>
                            <Select 
                              value={formData.status} 
                              onValueChange={(value) => handleInputChange('status', value)}
                            >
                              <SelectTrigger disabled={formLoading} className="mt-1 h-11 border-2 border-border focus:border-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-3 pt-6">
                            <input
                              type="checkbox"
                              id="isPrimary"
                              checked={formData.isPrimary}
                              onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
                              className="h-4 w-4 rounded border-2 border-border text-primary focus:ring-primary"
                              disabled={formLoading}
                            />
                            <label htmlFor="isPrimary" className="text-sm font-semibold text-foreground flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>Primary Office</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={formLoading}
                          className="h-11 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all duration-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={formLoading}
                          className="h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {formLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="h-4 w-4" />
                              <span>{editingOffice ? "Update" : "Add"} Office</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-primary-foreground/80 mt-2">
              Manage head office locations and contact information
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search head offices..."
                  className="pl-10 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-11 border-2 border-border focus:border-primary">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Offices</p>
                  <p className="text-2xl font-bold text-primary">{headOffices.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary/60" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{headOffices.filter(o => o.status === 'active').length}</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary</p>
                  <p className="text-2xl font-bold text-yellow-600">{headOffices.filter(o => o.is_primary).length}</p>
                </div>
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">{headOffices.filter(o => o.status === 'inactive').length}</p>
                </div>
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Head Office Management Table */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span>Head Office Records</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              {filteredOffices.length} office{filteredOffices.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOffices.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No head offices found</p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first head office to get started"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary border-b-2 border-primary">
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4 min-w-[120px]">Actions</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Office Details</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Contact Info</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Location</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Status</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffices.map((office, index) => (
                    <TableRow 
                      key={office.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-primary/5 transition-colors border-b border-border`}
                    >
                      <TableCell className="border-r border-border p-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(office)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(office.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{office.name || "Unnamed Office"}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{office.address}</p>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground font-medium">{office.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground truncate">{office.email}</span>
                          </div>
                          {office.website && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              <span className="text-primary hover:underline cursor-pointer truncate">{office.website}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <div className="text-sm space-y-1">
                          {office.city && <p className="text-foreground font-medium">{office.city}</p>}
                          {office.state && <p className="text-muted-foreground">{office.state}</p>}
                          {office.postal_code && <p className="text-muted-foreground">{office.postal_code}</p>}
                          {office.country && <p className="text-muted-foreground">{office.country}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(office.id, office.status)}
                          className="p-0 h-auto"
                        >
                          <Badge 
                            className={office.status === 'active' 
                              ? "bg-green-500/10 text-green-700 border border-green-200 hover:bg-green-500/20" 
                              : "bg-red-500/10 text-red-700 border border-red-200 hover:bg-red-500/20"
                            }
                          >
                            {office.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        {office.is_primary ? (
                          <Badge className="bg-yellow-500/10 text-yellow-700 border border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Regular
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadOfficeContent;