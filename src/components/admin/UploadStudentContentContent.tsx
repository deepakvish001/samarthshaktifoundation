import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Calendar, 
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  Search
} from "lucide-react";

interface StudentContent {
  id: string;
  title: string;
  date: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'uploaded';
}

const UploadStudentContentContent = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    file: null as File | null
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample uploaded content data
  const [uploadedContent] = useState<StudentContent[]>([
    {
      id: "1",
      title: "Computer Fundamentals Assignment",
      date: "2024-01-15",
      fileName: "computer_fundamentals.pdf",
      fileSize: "2.5 MB",
      uploadedAt: "2024-01-15T10:30:00Z",
      status: "approved"
    },
    {
      id: "2", 
      title: "Programming Basics Lab Work",
      date: "2024-01-20",
      fileName: "programming_lab.docx",
      fileSize: "1.8 MB",
      uploadedAt: "2024-01-20T14:15:00Z",
      status: "pending"
    },
    {
      id: "3",
      title: "Database Design Project",
      date: "2024-01-25",
      fileName: "database_project.zip",
      fileSize: "5.2 MB",
      uploadedAt: "2024-01-25T09:45:00Z",
      status: "uploaded"
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Student content uploaded successfully!",
      variant: "default"
    });

    // Reset form
    setFormData({
      title: "",
      date: "",
      file: null
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit",
      description: `Edit content ID: ${id}`,
      variant: "default"
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Delete",
      description: `Delete content ID: ${id}`,
      variant: "destructive"
    });
  };

  // Filter and search functionality
  const filteredContent = useMemo(() => {
    let filtered = uploadedContent;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    return filtered;
  }, [uploadedContent, searchTerm, statusFilter]);

  // Statistics calculations
  const totalUploads = uploadedContent.length;
  const approvedCount = uploadedContent.filter(item => item.status === 'approved').length;
  const pendingCount = uploadedContent.filter(item => item.status === 'pending').length;
  const uploadedCount = uploadedContent.filter(item => item.status === 'uploaded').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Uploaded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <span>Upload Student Content</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Uploads</p>
                  <p className="text-3xl font-bold">{totalUploads}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold">{approvedCount}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Recently Uploaded</p>
                  <p className="text-3xl font-bold text-foreground">{uploadedCount}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Upload className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Plus className="h-6 w-6" />
              </div>
              <span>Upload New Content</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title*</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter content title"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date*</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2 md:col-span-2">
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
                      {formData.file ? formData.file.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-12 py-3 text-base"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Content
              </Button>
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
                  placeholder="Search by title or filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-border/40 bg-background rounded-md focus:border-primary/50 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <span>Uploaded Content ({filteredContent.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {totalUploads}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[250px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Title
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">File Name</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[100px]">Size</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">Uploaded At</th>
                      <th className="px-6 py-4 text-sm font-bold text-left min-w-[120px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-accent/30" : "bg-background"} hover:bg-accent/50 transition-colors`}>
                        <td className="border-t border-border/30 px-6 py-3">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item.id)}
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm font-medium text-foreground">{item.title}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.date}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.fileName}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.fileSize}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="border-t border-border/30 px-6 py-3">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadStudentContentContent;