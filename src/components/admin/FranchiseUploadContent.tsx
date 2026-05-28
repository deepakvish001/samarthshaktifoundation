import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { Loader2, Edit, Trash2, Search, Filter, Upload, Calendar, FileText, Building, Download, CloudUpload } from "lucide-react";

interface FranchiseUpload {
  id: string;
  center_code: string;
  message: string;
  upload_date: string;
  file_name?: string;
  file_url?: string;
  upload_type: string;
  status: string;
}

const FranchiseUploadContent = () => {
  const {
    data: franchiseUploads,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<FranchiseUpload>({ 
    tableName: 'franchise_uploads',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const [formData, setFormData] = useState({
    centerCode: "",
    message: "",
    uploadType: "document",
    uploadFile: null as File | null,
    uploadDate: ""
  });

  const [editingUpload, setEditingUpload] = useState<FranchiseUpload | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast: useToastHook } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, uploadFile: file }));
  };

  const handleSubmit = async () => {
    if (!formData.centerCode || !formData.message) {
      toast.error("Please fill in required fields");
      return;
    }

    const uploadItem = {
      center_code: formData.centerCode,
      message: formData.message,
      upload_type: formData.uploadType,
      file_name: formData.uploadFile?.name || "",
      file_url: formData.uploadFile ? URL.createObjectURL(formData.uploadFile) : "",
      upload_date: formData.uploadDate || new Date().toISOString().split('T')[0],
      status: "pending"
    };

    try {
      if (editingUpload) {
        await update(editingUpload.id, uploadItem);
        toast.success("Upload updated successfully!");
      } else {
        await create(uploadItem);
        toast.success("Upload submitted successfully!");
      }
      
      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingUpload ? 'update' : 'submit'} upload`);
    }
  };

  const handleEdit = (upload: FranchiseUpload) => {
    setEditingUpload(upload);
    setFormData({
      centerCode: upload.center_code,
      message: upload.message,
      uploadType: upload.upload_type,
      uploadFile: null,
      uploadDate: upload.upload_date
    });
  };

  const handleReset = () => {
    setEditingUpload(null);
    setFormData({
      centerCode: "",
      message: "",
      uploadType: "document",
      uploadFile: null,
      uploadDate: ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Upload deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete upload");
    }
  };

  const handleDownload = (upload: FranchiseUpload) => {
    if (upload.file_url) {
      const link = document.createElement('a');
      link.href = upload.file_url;
      link.download = upload.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } else {
      toast.error("No file available for download");
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = franchiseUploads || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.center_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.upload_type === filterType);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    return filtered;
  }, [franchiseUploads, searchTerm, filterType, filterStatus]);

  const uploadTypes = ["document", "image", "certificate", "report"];
  const statusTypes = ["pending", "approved", "rejected"];

  // Sample data for demonstration
  const sampleData: FranchiseUpload[] = [
    {
      id: "1",
      center_code: "FR001",
      message: "Monthly franchise report submission",
      upload_date: "2024-01-15",
      file_name: "January_Report.pdf",
      file_url: "#",
      upload_type: "report",
      status: "approved"
    },
    {
      id: "2", 
      center_code: "FR002",
      message: "Certificate verification documents",
      upload_date: "2024-01-14",
      file_name: "Certificates.zip",
      file_url: "#",
      upload_type: "certificate",
      status: "pending"
    },
    {
      id: "3",
      center_code: "FR003",
      message: "Infrastructure photos for approval",
      upload_date: "2024-01-13",
      file_name: "Infrastructure_Photos.zip",
      file_url: "#",
      upload_type: "image",
      status: "approved"
    }
  ];

  const displayData = franchiseUploads?.length ? filteredData : sampleData.filter(item => {
    let filtered = true;
    
    if (searchTerm) {
      filtered = filtered && (
        item.center_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered && item.upload_type === filterType;
    }
    
    if (filterStatus !== "all") {
      filtered = filtered && item.status === filterStatus;
    }
    
    return filtered;
  });

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading franchise uploads...</p>
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
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <span>Franchise Upload Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Uploads</p>
                  <p className="text-3xl font-bold">{displayData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'approved').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold text-foreground">{displayData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Filter className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <CloudUpload className="h-6 w-6" />
              </div>
              <span>{editingUpload ? 'Edit Upload' : 'Add New Upload'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Center Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Center Code*</label>
                <Input
                  value={formData.centerCode}
                  onChange={(e) => handleInputChange('centerCode', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter center code (e.g., FR001)"
                />
              </div>

              {/* Upload Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload Type*</label>
                <Select value={formData.uploadType} onValueChange={(value) => handleInputChange('uploadType', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {uploadTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Message*</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[100px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Enter message or description for the upload"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File Upload</label>
                <div className="border border-border/40 rounded-lg p-4 bg-background">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="border-border/40 hover:bg-accent/20">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formData.uploadFile ? formData.uploadFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload Date</label>
                <Input
                  type="date"
                  value={formData.uploadDate}
                  onChange={(e) => handleInputChange('uploadDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingUpload ? 'Update Upload' : 'Submit Upload'}
              </Button>
              
              {editingUpload && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-border/40 hover:bg-accent/20 px-8"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by center code or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Types</SelectItem>
                    {uploadTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Status</SelectItem>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status} className="hover:bg-accent/50 capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Building className="h-6 w-6" />
                </div>
                <span>Upload Records ({displayData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {displayData.length}
              </Badge>
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Center Code
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[300px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Message
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Type
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-accent/10 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-background/50" : "bg-accent/5"
                        }`}
                      >
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(item)}
                              className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 h-auto hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono">
                            {item.center_code}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-foreground font-medium truncate" title={item.message}>
                              {item.message}
                            </p>
                            {item.file_name && (
                              <p className="text-muted-foreground text-sm truncate" title={item.file_name}>
                                📎 {item.file_name}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <div className="text-sm">
                            <p className="text-foreground font-medium">
                              {new Date(item.upload_date).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(item.upload_date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Badge 
                            variant="secondary" 
                            className="bg-secondary/20 text-secondary-foreground border-secondary/30 capitalize"
                          >
                            {item.upload_type}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Badge 
                            variant={item.status === 'approved' ? 'default' : item.status === 'pending' ? 'secondary' : 'destructive'}
                            className={`capitalize ${
                              item.status === 'approved' 
                                ? 'bg-green-100 text-green-800 border-green-300' 
                                : item.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(item)}
                            className="p-2 h-auto hover:bg-accent/20 transition-all duration-200 text-primary hover:text-primary/80"
                            disabled={!item.file_url}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {displayData.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-muted/20 rounded-full">
                      <CloudUpload className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No uploads found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterType !== "all" || filterStatus !== "all" 
                          ? "Try adjusting your search or filter criteria" 
                          : "Start by adding your first franchise upload"}
                      </p>
                    </div>
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

export default FranchiseUploadContent;