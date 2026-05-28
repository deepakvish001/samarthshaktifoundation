import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2, 
  Search, 
  RefreshCw, 
  Activity, 
  Calendar, 
  DollarSign, 
  Hash, 
  Globe, 
  BarChart3,
  TrendingUp,
  Filter,
  GraduationCap,
  Clock,
  IndianRupee,
  Users,
  Award,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface Course {
  id: string;
  course_name: string;
  course_sort_name: string;
  duration: string;
  fees: string;
  category: string;
  status: 'active' | 'inactive';
}

const CourseMasterContent = () => {
  const {
    data: courses,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<Course>({ tableName: 'course_master' });

  useAdminRealTime({
    tableName: 'course_master'
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    courseCategory: "",
    courseName: "",
    courseSortName: "",
    courseDuration: "",
    fees: "",
    status: "active" as "active" | "inactive"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const courseCategories = [
    { value: "3-month", label: "3 Month" },
    { value: "6-month", label: "6 Month" },
    { value: "12-month", label: "12 Month" },
    { value: "1-year", label: "1 Year" },
    { value: "certification", label: "Certification" },
    { value: "diploma", label: "Diploma" }
  ];

  // Statistics calculation
  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter(course => course.status === 'active').length;
    const inactive = total - active;
    const avgFees = courses.reduce((sum, course) => sum + parseFloat(course.fees || '0'), 0) / (total || 1);
    
    const categoryStats = courses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularCategory = Object.entries(categoryStats).reduce((max, [category, count]) => {
      return count > max.count ? { category, count } : max;
    }, { category: "N/A", count: 0 });
    
    return {
      total,
      active,
      inactive,
      avgFees: Math.round(avgFees),
      mostPopularCategory: mostPopularCategory.category
    };
  }, [courses]);

  // Filtered data
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_sort_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.duration.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || course.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, searchTerm, statusFilter, categoryFilter]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      courseCategory: "",
      courseName: "",
      courseSortName: "",
      courseDuration: "",
      fees: "",
      status: "active"
    });
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseCategory: courseCategories.find(cat => cat.label === course.category)?.value || course.category,
      courseName: course.course_name,
      courseSortName: course.course_sort_name,
      courseDuration: course.duration,
      fees: course.fees,
      status: course.status
    });
  };

  const validateForm = () => {
    if (!formData.courseCategory) {
      toast.error("Please select a course category");
      return false;
    }
    if (!formData.courseName.trim()) {
      toast.error("Course name is required");
      return false;
    }
    if (!formData.courseSortName.trim()) {
      toast.error("Course sort name is required");
      return false;
    }
    if (!formData.courseDuration.trim()) {
      toast.error("Course duration is required");
      return false;
    }
    if (!formData.fees.trim()) {
      toast.error("Fees is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const courseData = {
        course_name: formData.courseName,
        course_sort_name: formData.courseSortName,
        duration: formData.courseDuration,
        fees: formData.fees,
        category: courseCategories.find(cat => cat.value === formData.courseCategory)?.label || formData.courseCategory,
        status: formData.status
      };

      if (editingCourse) {
        await update(editingCourse.id, courseData);
        toast.success("Course updated successfully!");
      } else {
        await create(courseData);
        toast.success("Course added successfully!");
      }

      resetForm();
    } catch (error) {
      toast.error(editingCourse ? "Failed to update course" : "Failed to add course");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this course?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading course data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Course Master Management</h1>
              <p className="text-primary-foreground/80">Manage academic programs and course information</p>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-xs text-blue-200 mt-1">All programs</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                  <p className="text-xs text-green-200 mt-1">Currently available</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Average Fees</p>
                  <p className="text-3xl font-bold">₹{stats.avgFees.toLocaleString()}</p>
                  <p className="text-xs text-purple-200 mt-1">Course pricing</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <IndianRupee className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Top Category</p>
                  <p className="text-lg font-bold truncate">{stats.mostPopularCategory}</p>
                  <p className="text-xs text-orange-200 mt-1">Popular choice</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Master Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {editingCourse ? 'Edit Course Details' : 'Course Registration Form'}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Manage academic programs and course information</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Course Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-primary/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Course Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Course Category */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Category *
                    </label>
                    <Select value={formData.courseCategory} onValueChange={(value) => handleInputChange('courseCategory', value)} disabled={formLoading}>
                      <SelectTrigger className="border-2 border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-purple-500" />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">Choose the course category</div>
                  </div>

                  {/* Course Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Name *
                    </label>
                    <Input
                      value={formData.courseName}
                      onChange={(e) => handleInputChange('courseName', e.target.value)}
                      placeholder="Enter course name"
                      disabled={formLoading}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Full name of the course</div>
                  </div>

                  {/* Course Sort Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Sort Name *
                    </label>
                    <Input
                      value={formData.courseSortName}
                      onChange={(e) => handleInputChange('courseSortName', e.target.value)}
                      placeholder="Enter short name"
                      disabled={formLoading}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Abbreviated course name</div>
                  </div>

                  {/* Course Duration */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Duration *
                    </label>
                    <Input
                      value={formData.courseDuration}
                      onChange={(e) => handleInputChange('courseDuration', e.target.value)}
                      placeholder="e.g., 6 months"
                      disabled={formLoading}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Duration of the course</div>
                  </div>

                  {/* Fees */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Fees *
                    </label>
                    <Input
                      value={formData.fees}
                      onChange={(e) => handleInputChange('fees', e.target.value)}
                      placeholder="Enter fees amount"
                      disabled={formLoading}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Course fee in rupees</div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Course Status
                    </label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)} disabled={formLoading}>
                      <SelectTrigger className="border-2 border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-green-500" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-500" />
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">Course availability status</div>
                  </div>
                </div>
              </div>

              {/* Submit and Reset Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button 
                  onClick={handleSubmit}
                  disabled={formLoading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                  size="lg"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingCourse ? 'Updating...' : 'Adding...'}
                    </>
                  ) : editingCourse ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Course
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm} size="lg" disabled={formLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Search & Filter Courses</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses by name, category, duration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-2 border-border/80 focus:border-primary">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        All Status
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px] border-2 border-border/80 focus:border-primary">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        All Categories
                      </div>
                    </SelectItem>
                    {courseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.label}>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh()}
                  className="border-2 border-border/80 hover:border-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Master Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Course Master Registry
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    Complete course database with {filteredCourses.length} programs
                  </p>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {filteredCourses.length} of {courses.length} courses
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-muted rounded-full">
                    <GraduationCap className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchTerm ? "No courses found" : "No courses available"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm 
                        ? "Try adjusting your search criteria or filters" 
                        : "Start by adding your first course using the form above"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-b-2 border-border">
                      <TableHead className="w-[120px] font-semibold text-foreground">Actions</TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-foreground">Course Name</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Short Name</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Duration</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Fees</TableHead>
                      <TableHead className="min-w-[140px] font-semibold text-foreground">Category</TableHead>
                      <TableHead className="w-[100px] font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course, index) => (
                      <TableRow 
                        key={course.id} 
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(course)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit course"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(course.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-foreground">{course.course_name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-sm">{course.course_sort_name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm">{course.duration}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium">₹{parseFloat(course.fees).toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm">{course.category}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant={course.status === 'active' ? "default" : "secondary"}
                            className={`${
                              course.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-orange-100 text-orange-800 border-orange-200'
                            }`}
                          >
                            {course.status}
                          </Badge>
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
    </div>
  );
};

export default CourseMasterContent;