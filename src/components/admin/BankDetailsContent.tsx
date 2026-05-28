import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Edit, 
  Trash2, 
  Loader2, 
  Search, 
  Building2, 
  TrendingUp, 
  FileText, 
  Plus, 
  Filter,
  DollarSign,
  MapPin,
  Hash,
  Upload,
  Camera,
  Shield,
  Activity,
  Users,
  Banknote,
  Building,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface BankDetails {
  id: string;
  bank_name: string;
  account_number: string;
  branch_name: string;
  ifsc_code: string;
  micr_code: string;
  bank_photo_url?: string;
}

const BankDetailsContent = () => {
  const {
    data: bankDetails,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<BankDetails>({ tableName: 'bank_details' });

  useAdminRealTime({
    tableName: 'bank_details'
  });

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    branchName: "",
    ifscCode: "",
    micrCode: "",
    bankPhoto: null as File | null
  });
  const [editingBank, setEditingBank] = useState<BankDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");

  // Statistics
  const stats = useMemo(() => {
    const totalBanks = bankDetails.length;
    const uniqueBanks = new Set(bankDetails.map(b => b.bank_name)).size;
    const publicBanks = bankDetails.filter(b => 
      b.bank_name.toLowerCase().includes('state bank') || 
      b.bank_name.toLowerCase().includes('punjab national') ||
      b.bank_name.toLowerCase().includes('bank of baroda') ||
      b.bank_name.toLowerCase().includes('canara bank') ||
      b.bank_name.toLowerCase().includes('union bank') ||
      b.bank_name.toLowerCase().includes('central bank') ||
      b.bank_name.toLowerCase().includes('indian bank') ||
      b.bank_name.toLowerCase().includes('bank of maharashtra')
    ).length;
    const privateBanks = totalBanks - publicBanks;
    
    return { totalBanks, uniqueBanks, publicBanks, privateBanks };
  }, [bankDetails]);

  // Filtered data
  const filteredBankDetails = useMemo(() => {
    return bankDetails.filter(bank => {
      const matchesSearch = 
        bank.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.account_number.includes(searchTerm) ||
        bank.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.ifsc_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.micr_code.includes(searchTerm);

      const matchesFilter = bankFilter === "all" || 
        (bankFilter === "public" && (
          bank.bank_name.toLowerCase().includes('state bank') || 
          bank.bank_name.toLowerCase().includes('punjab national') ||
          bank.bank_name.toLowerCase().includes('bank of baroda') ||
          bank.bank_name.toLowerCase().includes('canara bank') ||
          bank.bank_name.toLowerCase().includes('union bank') ||
          bank.bank_name.toLowerCase().includes('central bank') ||
          bank.bank_name.toLowerCase().includes('indian bank') ||
          bank.bank_name.toLowerCase().includes('bank of maharashtra')
        )) ||
        (bankFilter === "private" && !(
          bank.bank_name.toLowerCase().includes('state bank') || 
          bank.bank_name.toLowerCase().includes('punjab national') ||
          bank.bank_name.toLowerCase().includes('bank of baroda') ||
          bank.bank_name.toLowerCase().includes('canara bank') ||
          bank.bank_name.toLowerCase().includes('union bank') ||
          bank.bank_name.toLowerCase().includes('central bank') ||
          bank.bank_name.toLowerCase().includes('indian bank') ||
          bank.bank_name.toLowerCase().includes('bank of maharashtra')
        ));

      return matchesSearch && matchesFilter;
    });
  }, [bankDetails, searchTerm, bankFilter]);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('bankPhoto', file);
    }
  };

  const handleSubmit = async () => {
    if (editingBank) {
      await handleUpdate();
      return;
    }

    if (!formData.bankName.trim() || !formData.accountNumber.trim() || !formData.branchName.trim() || 
        !formData.ifscCode.trim() || !formData.micrCode.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bankPhotoUrl = formData.bankPhoto ? URL.createObjectURL(formData.bankPhoto) : "";

    try {
      const newBankDetail = {
        bank_name: formData.bankName.trim(),
        account_number: formData.accountNumber.trim(),
        branch_name: formData.branchName.trim(),
        ifsc_code: formData.ifscCode.trim(),
        micr_code: formData.micrCode.trim(),
        bank_photo_url: bankPhotoUrl
      };
      await create(newBankDetail);
      toast.success("Bank details added successfully!");
      handleReset();
    } catch (error) {
      toast.error("Failed to add bank details");
    }
  };

  const handleUpdate = async () => {
    if (!editingBank) return;
    
    if (!formData.bankName.trim() || !formData.accountNumber.trim() || !formData.branchName.trim() || 
        !formData.ifscCode.trim() || !formData.micrCode.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bankPhotoUrl = formData.bankPhoto ? URL.createObjectURL(formData.bankPhoto) : editingBank.bank_photo_url;

    try {
      await update(editingBank.id, {
        bank_name: formData.bankName.trim(),
        account_number: formData.accountNumber.trim(),
        branch_name: formData.branchName.trim(),
        ifsc_code: formData.ifscCode.trim(),
        micr_code: formData.micrCode.trim(),
        bank_photo_url: bankPhotoUrl
      });
      toast.success("Bank details updated successfully!");
      setEditingBank(null);
      handleReset();
    } catch (error) {
      toast.error("Failed to update bank details");
    }
  };

  const handleEdit = (bank: BankDetails) => {
    setEditingBank(bank);
    setFormData({
      bankName: bank.bank_name,
      accountNumber: bank.account_number,
      branchName: bank.branch_name,
      ifscCode: bank.ifsc_code,
      micrCode: bank.micr_code,
      bankPhoto: null // Reset photo selection
    });
  };

  const handleReset = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      branchName: "",
      ifscCode: "",
      micrCode: "",
      bankPhoto: null
    });
    setEditingBank(null);
    
    // Reset file input
    const fileInput = document.getElementById('bank-photo-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank detail?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Bank details deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete bank details");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading bank details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Banks</p>
                <p className="text-3xl font-bold text-primary">{stats.totalBanks}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Unique Banks</p>
                <p className="text-3xl font-bold text-green-600">{stats.uniqueBanks}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Public Banks</p>
                <p className="text-3xl font-bold text-purple-600">{stats.publicBanks}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Private Banks</p>
                <p className="text-3xl font-bold text-orange-600">{stats.privateBanks}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Bank Details Form */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              {editingBank ? "Update Bank Details" : "Add New Bank Details"}
              {editingBank && (
                <Badge className="ml-auto bg-white/20 text-white border border-white/30">
                  Editing Mode
                </Badge>
              )}
            </CardTitle>
            <p className="text-primary-foreground/80 mt-2">
              {editingBank ? "Modify existing bank information" : "Enter comprehensive bank details for registration"}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Bank Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <Banknote className="h-4 w-4" />
                <span>Bank Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Bank Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Enter bank name (e.g., State Bank of India)"
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Account Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Branch Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <MapPin className="h-4 w-4" />
                <span>Branch Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Branch Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.branchName}
                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                    placeholder="Enter branch name"
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    IFSC Code <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    placeholder="Enter IFSC code (e.g., SBIN0001234)"
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    MICR Code <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.micrCode}
                    onChange={(e) => handleInputChange('micrCode', e.target.value)}
                    placeholder="Enter MICR code"
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <Camera className="h-4 w-4" />
                <span>Bank Photo (Optional)</span>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/20 hover:border-primary/50 transition-all duration-200">
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative">
                    <input
                      id="bank-photo-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      className="h-12 px-6 border-2 border-border hover:border-primary/30 hover:bg-primary/5 font-semibold transition-all duration-200"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Choose Photo
                    </Button>
                  </div>
                  <div className="flex-1">
                    {formData.bankPhoto ? (
                      <div className="flex items-center gap-2 bg-background rounded-lg p-3 border border-border">
                        <Camera className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {formData.bankPhoto.name}
                        </span>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {(formData.bankPhoto.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-medium">No photo chosen</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Form
              </Button>
              <Button
                onClick={handleSubmit}
                className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingBank ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Update Bank Details
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Bank Details
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card className="shadow-lg border border-border bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search banks, account numbers, IFSC codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={bankFilter} onValueChange={setBankFilter}>
                <SelectTrigger className="w-[200px] h-12 border-2 border-border focus:border-primary">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      All Banks
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      Public Banks
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      Private Banks
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refresh()}
                className="h-12 border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details Table */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span>Bank Details Records</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              {filteredBankDetails.length} bank record{filteredBankDetails.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredBankDetails.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No bank details found</p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                {searchTerm || bankFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first bank details to get started"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary border-b-2 border-primary">
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4 min-w-[120px]">Actions</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Bank Name</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Account Number</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Branch</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">IFSC Code</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">MICR Code</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Photo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBankDetails.map((bank, index) => (
                    <TableRow 
                      key={bank.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-primary/5 transition-colors border-b border-border`}
                    >
                      <TableCell className="border-r border-border p-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(bank)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(bank.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">{bank.bank_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <span className="font-mono text-sm font-medium text-foreground">{bank.account_number}</span>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <span className="text-foreground font-medium">{bank.branch_name}</span>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <span className="font-mono text-sm font-medium text-foreground">{bank.ifsc_code}</span>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <span className="font-mono text-sm font-medium text-foreground">{bank.micr_code}</span>
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        {bank.bank_photo_url ? (
                          <div className="flex justify-center">
                            <img 
                              src={bank.bank_photo_url} 
                              alt={bank.bank_name}
                              className="w-12 h-12 object-cover rounded-lg border border-border shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-12 h-12 bg-muted rounded-lg border border-border flex items-center justify-center">
                              <Camera className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
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

export default BankDetailsContent;