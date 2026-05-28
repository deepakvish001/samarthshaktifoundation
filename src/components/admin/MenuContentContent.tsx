import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Menu, Upload, Edit, Trash2, Loader2, Search, Filter, BookOpen, Calendar, FileText, Download, Plus, GraduationCap, Users, Target, TrendingUp, Star, Award, Book, Video, Image, Presentation, Sheet, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface MenuContent {
  id: string;
  course: string;
  upload_file_title: string;
  course_file?: string;
  date: string;
  notes?: string;
}

const MenuContentContent = () => {
  const {
    data: menuItems,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<MenuContent>({ tableName: 'menu_content' });

  useAdminRealTime({
    tableName: 'menu_content'
  });

  const [formData, setFormData] = useState({
    course: "",
    uploadFileTitle: "",
    uploadFile: null as File | null,
    date: new Date().toLocaleDateString('en-GB'),
    writeNote: ""
  });
  const [editingItem, setEditingItem] = useState<MenuContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const courses = [
    "PGDCA - Post Graduate Diploma in Computer Application",
    "BCA - Bachelor of Computer Applications", 
    "MCA - Master of Computer Applications",
    "DCA - Diploma in Computer Application",
    "ADCA - Advanced Diploma in Computer Application",
    "O Level - NIELIT O Level",
    "CCC - Course on Computer Concepts",
    "DCHN - Diploma in Computer Hardware & Networking",
    "Web Development",
    "Digital Marketing",
    "Graphic Design",
    "Data Entry Operations"
  ];

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('uploadFile', file);
    }
  };

  const handleUpload = async () => {
    if (!formData.course || !formData.uploadFileTitle.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        await update(editingItem.id, {
          course: formData.course,
          upload_file_title: formData.uploadFileTitle.trim(),
          course_file: formData.uploadFile ? formData.uploadFile.name : editingItem.course_file,
          date: formData.date,
          notes: formData.writeNote
        });
        toast.success("Menu content updated successfully!");
        setEditingItem(null);
      } else {
        // Create new item
        const newMenuItem = {
          course: formData.course,
          upload_file_title: formData.uploadFileTitle.trim(),
          course_file: formData.uploadFile ? formData.uploadFile.name : "",
          date: formData.date,
          notes: formData.writeNote
        };
        await create(newMenuItem);
        toast.success("Menu content uploaded successfully!");
      }
      
      // Reset form
      setFormData({
        course: "",
        uploadFileTitle: "",
        uploadFile: null,
        date: new Date().toLocaleDateString('en-GB'),
        writeNote: ""
      });

      // Reset file input
      const fileInput = document.getElementById('menu-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(editingItem ? "Failed to update menu content" : "Failed to upload menu content");
    }
  };

  const handleEdit = (item: MenuContent) => {
    setEditingItem(item);
    setFormData({
      course: item.course,
      uploadFileTitle: item.upload_file_title,
      uploadFile: null, // Reset file selection
      date: item.date,
      writeNote: item.notes || ""
    });
  };

  const handleReset = () => {
    setFormData({
      course: "",
      uploadFileTitle: "",
      uploadFile: null,
      date: new Date().toLocaleDateString('en-GB'),
      writeNote: ""
    });
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Menu item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  // Filter and search functionality
  const filteredMenuItems = useMemo(() => {
    let filtered = menuItems || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.upload_file_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(item => 
        item.course.toLowerCase().includes(courseFilter.toLowerCase())
      );
    }

    return filtered;
  }, [menuItems, searchTerm, courseFilter]);

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileIcon className="h-5 w-5 text-muted-foreground" />;
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <Sheet className="h-5 w-5 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="h-5 w-5 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'mp4':
      case 'avi':
        return <Video className="h-5 w-5 text-pink-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCourseIcon = (courseName: string) => {
    const course = courseName.toLowerCase();
    if (course.includes('pgdca') || course.includes('mca') || course.includes('bca')) {
      return <GraduationCap className="h-5 w-5 text-blue-500" />;
    }
    if (course.includes('dca') || course.includes('adca')) {
      return <Book className="h-5 w-5 text-green-500" />;
    }
    if (course.includes('o level') || course.includes('ccc')) {
      return <Award className="h-5 w-5 text-purple-500" />;
    }
    if (course.includes('web') || course.includes('digital') || course.includes('graphic')) {
      return <Target className="h-5 w-5 text-orange-500" />;
    }
    return <BookOpen className="h-5 w-5 text-primary" />;
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading menu content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Content</p>
                <p className="text-3xl font-bold text-primary">{menuItems?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">All learning materials</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">With Files</p>
                <p className="text-3xl font-bold text-green-600">
                  {menuItems?.filter(item => item.course_file).length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Downloadable resources</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold text-purple-600">
                  {menuItems?.filter(item => {
                    const itemDate = new Date(item.date.split('/').reverse().join('-'));
                    const currentMonth = new Date().getMonth();
                    return itemDate.getMonth() === currentMonth;
                  }).length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Recent additions</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Filtered Results</p>
                <p className="text-3xl font-bold text-orange-600">{filteredMenuItems.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Current search results</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Filter className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Menu Content Form */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Menu className="h-6 w-6 text-white" />
              </div>
              {editingItem ? 'Edit Menu Content' : 'Add New Menu Content'}
              {editingItem && (
                <Badge className="ml-auto bg-white/20 text-white border border-white/30">
                  Editing Mode
                </Badge>
              )}
            </CardTitle>
            <p className="text-primary-foreground/80 mt-2">
              Manage course content and learning materials
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Course & Title Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <GraduationCap className="h-4 w-4" />
                <span>Course Information</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Course <span className="text-destructive">*</span>
                  </label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                    <SelectTrigger className="h-12 border-2 border-border hover:border-primary focus:border-primary transition-all duration-200">
                      <div className="flex items-center gap-2">
                        {formData.course && getCourseIcon(formData.course)}
                        <SelectValue placeholder="Select Course" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-2 border-border">
                      {courses.map((course) => (
                        <SelectItem key={course} value={course} className="hover:bg-primary/5">
                          <div className="flex items-center gap-2">
                            {getCourseIcon(course)}
                            <span>{course}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Upload File Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.uploadFileTitle}
                    onChange={(e) => handleInputChange('uploadFileTitle', e.target.value)}
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Enter descriptive file title"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <Upload className="h-4 w-4" />
                <span>File Upload</span>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/20 hover:border-primary/50 transition-all duration-200">
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative">
                    <input
                      id="menu-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.avi"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      className="h-12 px-6 border-2 border-border hover:border-primary/30 hover:bg-primary/5 font-semibold transition-all duration-200"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  <div className="flex-1">
                    {formData.uploadFile ? (
                      <div className="flex items-center gap-2 bg-background rounded-lg p-3 border border-border">
                        {getFileIcon(formData.uploadFile.name)}
                        <span className="text-sm font-medium text-foreground">
                          {formData.uploadFile.name}
                        </span>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {(formData.uploadFile.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-medium">No file chosen</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50">
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Badge>
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                    <FileText className="h-3 w-3 mr-1" />
                    DOC/DOCX
                  </Badge>
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                    <Presentation className="h-3 w-3 mr-1" />
                    PPT/PPTX
                  </Badge>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                    <Sheet className="h-3 w-3 mr-1" />
                    XLS/XLSX
                  </Badge>
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                    <Image className="h-3 w-3 mr-1" />
                    Images
                  </Badge>
                  <Badge variant="outline" className="text-xs text-pink-600 border-pink-200 bg-pink-50">
                    <Video className="h-3 w-3 mr-1" />
                    Videos
                  </Badge>
                </div>
              </div>
            </div>

            {/* Date & Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <Calendar className="h-4 w-4" />
                <span>Additional Information</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </label>
                  <Input
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Notes
                  </label>
                  <Textarea
                    value={formData.writeNote}
                    onChange={(e) => handleInputChange('writeNote', e.target.value)}
                    className="min-h-[80px] border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Add additional notes or description..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              {editingItem && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all duration-200"
                >
                  Cancel Edit
                </Button>
              )}
              <Button
                onClick={handleUpload}
                className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingItem ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Update Content
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Content
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search content by title, course, or notes..."
                  className="pl-10 h-11 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-64 h-11 border-2 border-border focus:border-primary">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    <div className="flex items-center gap-2">
                      {getCourseIcon(course)}
                      <span className="truncate">{course}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Content Table */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span>Menu Content Library</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              {filteredMenuItems.length} content item{filteredMenuItems.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No menu content found</p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                {searchTerm || courseFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first content item to get started"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary border-b-2 border-primary">
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4 min-w-[120px]">Actions</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Course</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Content Title</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">File</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Date</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenuItems.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-primary/5 transition-colors border-b border-border`}
                    >
                      <TableCell className="border-r border-border p-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <div className="flex items-center gap-2">
                          {getCourseIcon(item.course)}
                          <span className="font-medium text-foreground text-sm">{item.course}</span>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <span className="font-semibold text-foreground">{item.upload_file_title}</span>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        {item.course_file ? (
                          <div className="flex items-center justify-center gap-2">
                            {getFileIcon(item.course_file)}
                            <span className="text-sm text-muted-foreground font-medium">{item.course_file}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No file</span>
                        )}
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{item.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        {item.notes ? (
                          <span className="text-sm text-muted-foreground line-clamp-2">{item.notes}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">No notes</span>
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

export default MenuContentContent;