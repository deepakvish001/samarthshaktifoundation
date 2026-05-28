import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { Loader2, Shield, Users, UserCheck, GraduationCap, Phone, Mail, MapPin, Calendar, FileText, User, Award, Trash2, CheckCircle, XCircle } from "lucide-react";
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

const VerificationContent = () => {
  const { data: students, loading, delete: deleteItem } = useOptimisticCrud<StudentProfile>({
    tableName: 'student_profiles',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Disable real-time updates to prevent false notifications
  // useAdminRealTime({
  //   tableName: 'student_profiles'
  // });

  const handleDelete = async (studentId: string) => {
    try {
      await deleteItem(studentId);
      toast.success('Student record deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete student record');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading student records...</span>
        </div>
      </div>
    );
  }

  const referenceNumber = Math.random().toString().substr(2, 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">Student Verification</h1>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Students</p>
                <p className="text-2xl font-bold">{students.filter(s => s.status === 'active').length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-purple-100 text-sm font-medium">Enrolled Courses</p>
                <p className="text-2xl font-bold">{new Set(students.filter(s => s.course_name).map(s => s.course_name)).size}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-200" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-orange-100 text-sm font-medium">Verification Status</p>
                <p className="text-2xl font-bold">{referenceNumber}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-200" />
            </CardContent>
          </Card>
        </div>

        {/* Verification Table */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Student Records ({students.length} students)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg bg-background/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[100px]">
                        <div className="flex items-center gap-1">
                          <Trash2 className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[100px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          State
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[100px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          City
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[180px]">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Student Name
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[200px]">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[140px]">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Phone
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[280px]">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Course Name
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[120px]">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Status
                        </div>
                      </th>
                      <th className="border border-border px-4 py-3 text-sm font-semibold text-left min-w-[140px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Enrollment Date
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="border border-border px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <XCircle className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">No Student Records Found</h3>
                              <p className="text-muted-foreground">No students are currently registered in the system</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student, index) => (
                        <tr key={student.id} className={index % 2 === 0 ? "bg-background hover:bg-accent/30" : "bg-accent/10 hover:bg-accent/40"}>
                          <td className="border border-border px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                          <td className="border border-border px-4 py-3 text-sm">{student.state || '-'}</td>
                          <td className="border border-border px-4 py-3 text-sm">{student.city || '-'}</td>
                          <td className="border border-border px-4 py-3 text-sm font-medium text-primary">{student.full_name}</td>
                          <td className="border border-border px-4 py-3 text-sm text-blue-600">{student.email}</td>
                          <td className="border border-border px-4 py-3 text-sm font-medium">{student.phone || '-'}</td>
                          <td className="border border-border px-4 py-3 text-sm font-medium text-green-600">{student.course_name || 'Not assigned'}</td>
                          <td className="border border-border px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {student.status === 'active' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-500" />
                              )}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                student.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {student.status}
                              </span>
                            </div>
                          </td>
                          <td className="border border-border px-4 py-3 text-sm">
                            {new Date(student.enrollment_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Number Footer */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg border-0">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-90">Verification Reference Number</p>
                <p className="text-2xl font-bold tracking-wider">{referenceNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationContent;