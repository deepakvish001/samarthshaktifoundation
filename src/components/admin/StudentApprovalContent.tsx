import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { AdminPresenceIndicator } from "@/components/admin/AdminPresenceIndicator";
import { Loader2, Users, CheckCircle, Clock, Search, UserCheck, Download, Mail, Phone, GraduationCap, MapPin, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  course_name?: string;
  city?: string;
  state?: string;
  status: string;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

const StudentApprovalContent = () => {
  const { 
    data: students, 
    loading, 
    update,
    delete: deleteItem,
    create,
    refresh 
  } = useOptimisticCrud<StudentProfile>({
    tableName: 'student_profiles',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Disable real-time notifications to prevent duplicates
  useAdminRealTime({
    tableName: 'student_profiles',
    onUpdate: () => {}, // Disable auto notifications
    onInsert: () => {},
    onDelete: () => {}
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Filtered students based on search
  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.phone && student.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.course_name && student.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.state && student.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalStudents = students.length;
  const approvedStudents = students.filter(s => s.status === 'active').length;
  const pendingStudents = students.filter(s => s.status === 'pending').length;
  const recentApplications = students.filter(student => {
    const enrollmentDate = new Date(student.enrollment_date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return enrollmentDate >= sevenDaysAgo;
  }).length;

  const handleApprovalChange = async (student: StudentProfile, approved: boolean) => {
    try {
      const newStatus = approved ? 'active' : 'pending';
      await update(student.id, {
        ...student,
        status: newStatus
      });

      // No notifications - silent approval/unapproval
    } catch (error) {
      toast.error('Failed to update student approval status');
    }
  };

  const handleBulkApproval = async () => {
    const approvedStudents = students.filter(s => s.status === 'active');
    
    if (approvedStudents.length === 0) {
      toast.error('No approved students to process');
      return;
    }

    try {
      // Here you could implement bulk processing logic
      toast.success(`Processing ${approvedStudents.length} approved students`);
    } catch (error) {
      toast.error('Failed to process bulk approval');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-none bg-background flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading student approvals...</p>
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
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <span>Student Approval Management</span>
        </h1>
        <AdminPresenceIndicator 
          currentSection="student-approval" 
          showSectionUsers={true}
          showOnlineCount={true}
        />
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Applications</p>
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
                <p className="text-accent-foreground/80 text-sm font-medium">Approved Students</p>
                <p className="text-3xl font-bold">{approvedStudents}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">Pending Approval</p>
                <p className="text-3xl font-bold">{pendingStudents}</p>
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
                <p className="text-muted-foreground/80 text-sm font-medium">Recent Applications</p>
                <p className="text-3xl font-bold text-foreground">{recentApplications}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons Card */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/20 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleBulkApproval}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Process Approved Students ({approvedStudents})</span>
            </Button>
            <Button 
              variant="outline"
              className="border-gray-400 hover:bg-gray-50 flex items-center space-x-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export List</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Management Table */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>Student Approval Management ({filteredStudents.length} students)</span>
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
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Approve</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Student Name</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Email</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Phone</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Course Name</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Location</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Status</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Enrollment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No students found matching your search." : "No student profiles found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className={`${index % 2 === 0 ? "bg-accent/10" : "bg-background"} hover:bg-accent/20 transition-colors`}>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={student.status === 'active'}
                            onCheckedChange={(checked) => handleApprovalChange(student, checked as boolean)}
                            className={`w-6 h-6 border-2 transition-all duration-200 ${
                              student.status === 'active'
                                ? 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white'
                                : 'bg-white border-gray-300 hover:border-gray-400'
                            }`}
                          />
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
                          <span className="text-foreground">{student.phone || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{student.course_name || 'Not assigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {student.city && student.state ? `${student.city}, ${student.state}` : student.state || student.city || '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          student.status === 'active' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status === 'active' ? 'Approved' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{new Date(student.enrollment_date).toLocaleDateString()}</span>
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

export default StudentApprovalContent;