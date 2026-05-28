import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Loader2, Users, BookOpen, GraduationCap, UserCheck, Search, Building, MapPin, Mail, Phone, Trash2, Plus, Download, Printer, KeyRound, ShieldAlert, Copy } from "lucide-react";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  course_name?: string;
  status?: string;
  city?: string;
  state?: string;
  enrollment_date?: string;
  student_id?: string;
  password_changed_at?: string | null;
  login_password?: string | null;
}

const StudentManagementContent = () => {
  const {
    data: studentProfiles,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<StudentProfile>({ 
    tableName: 'student_profiles',
    orderBy: { column: 'enrollment_date', ascending: false }
  });

  // Disable auto notifications to prevent unwanted toasts
  useAdminRealTime({
    tableName: 'student_profiles',
    onUpdate: () => {},
    onInsert: () => {},
    onDelete: () => {}
  });

  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reissuing, setReissuing] = useState<string | null>(null);
  const [newCred, setNewCred] = useState<{ name: string; student_id: string; password: string } | null>(null);

  // Filtered students based on search and franchise
  const filteredStudents = studentProfiles.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.phone && student.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.course_name && student.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.state && student.state.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Add franchise filtering logic here if needed
    return matchesSearch;
  });

  // Calculate statistics
  const totalStudents = studentProfiles.length;
  const activeStudents = studentProfiles.filter(s => s.status === 'active').length;
  const uniqueCourses = [...new Set(studentProfiles.filter(s => s.course_name).map(s => s.course_name))].length;
  const recentEnrollments = studentProfiles.filter(student => {
    if (!student.enrollment_date) return false;
    const enrollmentDate = new Date(student.enrollment_date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return enrollmentDate >= sevenDaysAgo;
  }).length;

  const handleEdit = (studentId: string) => {
    // Open edit form (no notifications)
  };

  const handleIssueNewPassword = async (student: StudentProfile) => {
    if (!student.student_id) {
      toast.error("This student has no Student ID — cannot issue a new password.");
      return;
    }
    if (!confirm(`Generate a new login password for ${student.full_name}? Their previous password will stop working immediately.`)) return;
    setReissuing(student.id);
    try {
      const { data, error } = await supabase.functions.invoke("provision-student-auth", {
        body: { student_id: student.student_id, issue_new: true },
      });
      if (error) throw error;
      const password = (data as any)?.password;
      if (!password) throw new Error("No password returned");
      setNewCred({ name: student.full_name, student_id: student.student_id, password });
      await refresh();
      toast.success("New password issued.");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to issue new password");
    } finally {
      setReissuing(null);
    }
  };

  const handleDelete = async (studentId: string) => {
    try {
      await deleteItem(studentId);
      // silent success (no notification)
    } catch (error) {
      // silent error
      console.error('Failed to delete student', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-none bg-background flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading student management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <span>Student Management</span>
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
                <p className="text-secondary-foreground/80 text-sm font-medium">Available Courses</p>
                <p className="text-3xl font-bold">{uniqueCourses}</p>
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
                <BookOpen className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Franchise Selection and Actions */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/20 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <span>Franchise & Actions</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-lg">
              <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
                <SelectTrigger className="border-2 border-gray-400 h-12">
                  <SelectValue placeholder="Select Franchise Institute Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ictc">Institute of Computer Training Centre, Numaish Chauraha, Hardoi</SelectItem>
                  <SelectItem value="ravi">Ravi Kumar Gupta</SelectItem>
                  <SelectItem value="azamgarh">Azamgarh Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4" />
                <span>Add New Student</span>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button variant="outline" className="border-gray-400 hover:bg-gray-50 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
                <Printer className="h-4 w-4" />
                <span>Print Report</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Management Table */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>Student Records ({filteredStudents.length} students)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/90 border-background/20 focus:border-background focus:ring-background/20"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">S.No</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Actions</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Student Name</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Email</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Phone</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Course</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Location</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Status</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Enrollment Date</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Login Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No students found matching your search." : "No students registered yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className={`${index % 2 === 0 ? "bg-accent/10" : "bg-background"} hover:bg-accent/20 transition-colors`}>
                      <TableCell className="text-center p-4 border-r border-border font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student.id)}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIssueNewPassword(student)}
                            disabled={reissuing === student.id}
                            title="Issue a new login password"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 p-2 rounded-lg transition-colors"
                          >
                            {reissuing === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{student.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="h-4 w-4 text-accent" />
                          <span className="text-foreground">{student.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4 text-secondary" />
                          <span className="text-foreground">{student.phone || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{student.course_name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {student.city && student.state ? `${student.city}, ${student.state}` : student.state || student.city || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          student.status === 'active' 
                            ? 'bg-accent/20 text-accent-foreground' 
                            : 'bg-secondary/20 text-secondary-foreground'
                        }`}>
                          {student.status || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <span className="text-foreground">
                          {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        {student.password_changed_at ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                              <ShieldAlert className="h-3 w-3" />
                              Changed by student
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              on {new Date(student.password_changed_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : student.login_password ? (
                          <code className="px-2 py-1 text-xs rounded bg-muted text-foreground font-mono">
                            {student.login_password}
                          </code>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!newCred} onOpenChange={(o) => !o && setNewCred(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New password issued</DialogTitle>
            <DialogDescription>
              Share these credentials with {newCred?.name}. The previous password no longer works.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted">
              <div>
                <div className="text-xs text-muted-foreground">Student ID</div>
                <div className="font-mono font-semibold">{newCred?.student_id}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newCred?.student_id) navigator.clipboard.writeText(newCred.student_id);
                  toast.success("Student ID copied");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted">
              <div>
                <div className="text-xs text-muted-foreground">New password</div>
                <div className="font-mono font-semibold">{newCred?.password}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newCred?.password) navigator.clipboard.writeText(newCred.password);
                  toast.success("Password copied");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setNewCred(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagementContent;