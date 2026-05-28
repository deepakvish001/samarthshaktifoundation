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
import { Loader2, Edit, Trash2, Search, Filter, BookOpen, Calendar, Image as ImageIcon, Users, FileText, Upload } from "lucide-react";

interface StudentData {
  id: string;
  title: string;
  details: string;
  course_category: string;
  photo_url?: string;
  publish_date: string;
}

const StudentDataContent = () => {
  const {
    data: studentDataItems,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<StudentData>({ 
    tableName: 'student_data',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Disable real-time updates to prevent false notifications
  // useAdminRealTime({
  //   tableName: 'student_data'
  // });
  
  const [formData, setFormData] = useState({
    titleOfData: "",
    detailsOfData: "",
    detailsOfCourses: "Advance Diploma In Computer Application(ADCA)",
    photoFile: null as File | null,
    dateOfPublish: ""
  });

  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, photoFile: file }));
  };

  const handleSubmit = async () => {
    if (!formData.titleOfData || !formData.detailsOfData) {
      toast.error("Please fill in required fields");
      return;
    }

    const studentDataItem = {
      title: formData.titleOfData,
      details: formData.detailsOfData,
      course_category: formData.detailsOfCourses,
      photo_url: formData.photoFile ? URL.createObjectURL(formData.photoFile) : "",
      publish_date: formData.dateOfPublish || new Date().toLocaleDateString()
    };

    try {
      if (editingStudent) {
        await update(editingStudent.id, studentDataItem);
        toast.success("Student data updated successfully!");
      } else {
        await create(studentDataItem);
        toast.success("Student data submitted successfully!");
      }
      
      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingStudent ? 'update' : 'submit'} student data`);
    }
  };

  const handleEdit = (student: StudentData) => {
    setEditingStudent(student);
    setFormData({
      titleOfData: student.title,
      detailsOfData: student.details,
      detailsOfCourses: student.course_category,
      photoFile: null,
      dateOfPublish: student.publish_date
    });
  };

  const handleReset = () => {
    setEditingStudent(null);
    setFormData({
      titleOfData: "",
      detailsOfData: "",
      detailsOfCourses: "Advance Diploma In Computer Application(ADCA)",
      photoFile: null,
      dateOfPublish: ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Student data deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete student data");
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = studentDataItems || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(item => item.course_category === filterCategory);
    }

    return filtered;
  }, [studentDataItems, searchTerm, filterCategory]);

  const courseCategories = [
    "Advance Diploma In Computer Application(ADCA)",
    "Diploma in Computer Application (DCA)", 
    "Post Graduate Diploma in Computer Application (PGDCA)",
    "Diploma in Computer Hardware and Networking"
  ];

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading student data...</p>
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
              <Users className="h-8 w-8 text-primary" />
            </div>
            <span>Student Data Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{studentDataItems?.length || 0}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold">
                    {studentDataItems?.filter(item => {
                      const itemDate = new Date(item.publish_date);
                      const currentMonth = new Date().getMonth();
                      return itemDate.getMonth() === currentMonth;
                    }).length || 0}
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">With Photos</p>
                  <p className="text-3xl font-bold">
                    {studentDataItems?.filter(item => item.photo_url).length || 0}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <ImageIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold text-foreground">{filteredData.length}</p>
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
                <FileText className="h-6 w-6" />
              </div>
              <span>{editingStudent ? 'Edit Student Data' : 'Add New Student Data'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Of Data */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title Of Data*</label>
                <Input
                  value={formData.titleOfData}
                  onChange={(e) => handleInputChange('titleOfData', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter title of the data"
                />
              </div>

              {/* Course Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Category*</label>
                <Select value={formData.detailsOfCourses} onValueChange={(value) => handleInputChange('detailsOfCourses', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Details of Data */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Details of Data*</label>
                <Textarea
                  value={formData.detailsOfData}
                  onChange={(e) => handleInputChange('detailsOfData', e.target.value)}
                  className="min-h-[100px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Enter detailed description of the student data"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Photo Upload</label>
                <div className="border border-border/40 rounded-lg p-4 bg-background">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="border-border/40 hover:bg-accent/20">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formData.photoFile ? formData.photoFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date of Publish */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Publish</label>
                <Input
                  type="date"
                  value={formData.dateOfPublish}
                  onChange={(e) => handleInputChange('dateOfPublish', e.target.value)}
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
                {editingStudent ? 'Update Data' : 'Submit Data'}
              </Button>
              
              {editingStudent && (
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
                  placeholder="Search by title or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Categories</SelectItem>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                        {category.split('(')[0].trim()}
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
                  <Users className="h-6 w-6" />
                </div>
                <span>Student Data Records ({filteredData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {studentDataItems?.length || 0}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Title
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[300px]">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Details
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Category
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Photo
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-background/80" : "bg-accent/5"} hover:bg-accent/20 transition-colors duration-200 border-b border-border/30`}>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="text-primary hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Edit Data"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Delete Data"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="font-semibold text-foreground">{item.title}</div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {item.details}
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                            {item.course_category.split('(')[0].trim()}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-sm text-muted-foreground">{item.publish_date}</div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-xs text-muted-foreground">
                            {item.photo_url ? (
                              <Badge className="bg-accent/20 text-accent-foreground">
                                Has Photo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-muted text-muted-foreground">
                                No Photo
                              </Badge>
                            )}
                          </div>
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

export default StudentDataContent;