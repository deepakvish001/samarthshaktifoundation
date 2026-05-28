import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Trash2, Plus, Search, Loader2, UserCheck, GraduationCap, Calendar, TrendingUp, BookOpen, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  course_name?: string;
  enrollment_date?: string;
  status: 'active' | 'inactive' | 'graduated';
  city?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}

const StudentManagementRealTime = () => {
  const {
    data: students,
    loading,
    create,
    update,
    delete: deleteStudent
  } = useOptimisticCrud<StudentProfile>({ 
    tableName: 'student_profiles',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Disable auto notifications to prevent duplicate notifications
  useAdminRealTime({
    tableName: 'student_profiles',
    onUpdate: () => {}, // Disable auto notifications
    onInsert: () => {},
    onDelete: () => {}
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseName: "",
    city: "",
    state: "",
    status: "active" as "active" | "inactive" | "graduated"
  });
  const [formLoading, setFormLoading] = useState(false);

  const courses = [
    "PGDCA - Post Graduate Diploma in Computer Applications",
    "BCA - Bachelor of Computer Applications", 
    "MCA - Master of Computer Applications",
    "DCA - Diploma in Computer Applications",
    "ADCA - Advanced Diploma in Computer Applications",
    "O Level - NIELIT O Level",
    "CCC - Course on Computer Concepts",
    "Tally ERP",
    "Digital Marketing",
    "Web Development"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm) ||
      student.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const graduatedStudents = students.filter(s => s.status === 'graduated').length;
  const inactiveStudents = students.filter(s => s.status === 'inactive').length;
  const uniqueCourses = [...new Set(students.filter(s => s.course_name).map(s => s.course_name))].length;
  const recentEnrollments = students.filter(student => {
    if (!student.enrollment_date) return false;
    const enrollmentDate = new Date(student.enrollment_date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return enrollmentDate >= sevenDaysAgo;
  }).length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      courseName: "",
      city: "",
      state: "",
      status: "active"
    });
    setEditingStudent(null);
  };

  const openEditDialog = (student: StudentProfile) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.full_name,
      email: student.email,
      phone: student.phone || "",
      courseName: student.course_name || "",
      city: student.city || "",
      state: student.state || "",
      status: student.status
    });
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
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
      const studentData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        course_name: formData.courseName || null,
        city: formData.city || null,
        state: formData.state || null,
        status: formData.status,
        ...(editingStudent ? {} : { enrollment_date: new Date().toISOString() })
      };

      if (editingStudent) {
        await update(editingStudent.id, studentData);
        toast.success("🎉 Student updated successfully!");
      } else {
        await create(studentData);
        toast.success("🎉 Student added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(`Failed to save student: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this student?")) return;

    try {
      await deleteStudent(studentId);
      toast.success("🗑️ Student deleted successfully!");
    } catch (error: any) {
      toast.error(`Failed to delete student: ${error.message}`);
    }
  };

  const handleStatusUpdate = async (studentId: string, newStatus: "active" | "inactive" | "graduated") => {
    try {
      await update(studentId, { status: newStatus });
      const emoji = newStatus === 'active' ? '✅' : newStatus === 'graduated' ? '🎓' : '⏸️';
      toast.success(`${emoji} Student status updated to ${newStatus}!`);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <span>Real-Time Student Management</span>
        </h1>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Active Students</p>
                <p className="text-3xl font-bold">{activeStudents}</p>
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
                <p className="text-secondary-foreground/80 text-sm font-medium">Graduated Students</p>
                <p className="text-3xl font-bold">{graduatedStudents}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-medium">Recent Enrollments</p>
                <p className="text-3xl font-bold text-foreground">{recentEnrollments}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <span>Student Management</span>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Real-time
              </Badge>
            </CardTitle>
            <div className="flex space-x-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={resetForm} 
                    className="bg-background/20 text-primary-foreground border-background/30 hover:bg-background/30 backdrop-blur-sm shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl shadow-elegant border-0">
                  <DialogHeader className="pb-6 border-b border-border/20">
                    <DialogTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span>{editingStudent ? "Edit Student" : "Add New Student"}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name *</label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter full name"
                          disabled={formLoading}
                          className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter email"
                          disabled={formLoading}
                          className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                          disabled={formLoading}
                          className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Course</label>
                        <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                          <SelectTrigger disabled={formLoading} className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border/40">
                            {courses.map((course) => (
                              <SelectItem key={course} value={course} className="hover:bg-accent/50">
                                {course}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">City</label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Enter city"
                          disabled={formLoading}
                          className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">State</label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                          <SelectTrigger disabled={formLoading} className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border/40">
                            {states.map((state) => (
                              <SelectItem key={state} value={state} className="hover:bg-accent/50">
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "graduated") => handleInputChange('status', value)}>
                        <SelectTrigger disabled={formLoading} className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/40">
                          <SelectItem value="active" className="hover:bg-accent/50">Active</SelectItem>
                          <SelectItem value="inactive" className="hover:bg-accent/50">Inactive</SelectItem>
                          <SelectItem value="graduated" className="hover:bg-accent/50">Graduated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-6 border-t border-border/20">
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
                        {editingStudent ? "Update" : "Create"} Student
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background border-border/40 focus:border-primary/50 focus:ring-primary/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                <SelectItem value="all" className="hover:bg-accent/50">All Status</SelectItem>
                <SelectItem value="active" className="hover:bg-accent/50">Active</SelectItem>
                <SelectItem value="inactive" className="hover:bg-accent/50">Inactive</SelectItem>
                <SelectItem value="graduated" className="hover:bg-accent/50">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end space-x-2">
              <Badge variant="outline" className="text-muted-foreground border-border/40">
                {filteredStudents.length} of {students.length} students
              </Badge>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Student Details</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Contact</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Course</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Location</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Status</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4 border-r border-primary/30">Enrollment</TableHead>
                  <TableHead className="text-primary-foreground font-bold py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center space-y-4">
                        <Users className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">
                          {searchTerm || statusFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "Add your first student to get started"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow 
                      key={student.id} 
                      className={`${index % 2 === 0 ? "bg-accent/10" : "bg-background"} hover:bg-accent/20 transition-colors duration-200`}
                    >
                      <TableCell className="p-4 border-r border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.full_name}</p>
                            <p className="text-sm text-muted-foreground">ID: {student.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-accent" />
                            <span className="text-sm text-foreground">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-secondary" />
                              <span className="text-sm text-foreground">{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {student.course_name || "Not assigned"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {student.city && student.state 
                              ? `${student.city}, ${student.state}` 
                              : student.state || student.city || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <Select
                          value={student.status}
                          onValueChange={(newStatus: "active" | "inactive" | "graduated") => 
                            handleStatusUpdate(student.id, newStatus)
                          }
                        >
                          <SelectTrigger className={`w-32 border-0 ${
                            student.status === 'active' 
                              ? 'bg-accent/20 text-accent-foreground hover:bg-accent/30' 
                              : student.status === 'graduated'
                              ? 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30'
                              : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">✅ Active</SelectItem>
                            <SelectItem value="inactive">⏸️ Inactive</SelectItem>
                            <SelectItem value="graduated">🎓 Graduated</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <span className="text-sm text-foreground">
                          {student.enrollment_date 
                            ? new Date(student.enrollment_date).toLocaleDateString() 
                            : "Not available"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(student)}
                            className="text-primary hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagementRealTime;