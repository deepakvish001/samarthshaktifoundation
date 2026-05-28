import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { Loader2, UserCheck, UserX, Users, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  attendance_date: string;
  status: string;
  session_type: string;
  marked_by?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  course_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const StudentAttendanceContent = () => {
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);

  const { data: attendanceData, create: createAttendance } = useOptimisticCrud<AttendanceRecord>({
    tableName: 'attendance_management',
    orderBy: { column: 'created_at', ascending: false }
  });

  const { data: students, loading } = useOptimisticCrud<StudentProfile>({
    tableName: 'student_profiles',
    orderBy: { column: 'full_name', ascending: true }
  });

  // Enable real-time updates
  useAdminRealTime({
    tableName: 'attendance_management'
  });

  useAdminRealTime({
    tableName: 'student_profiles'
  });

  // Filter students based on course selection
  useEffect(() => {
    let filtered = students;

    if (selectedCourse) {
      filtered = filtered.filter(student => 
        student.course_name?.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedCourse]);

  const markAttendance = async (student: StudentProfile, status: 'present' | 'absent') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await createAttendance({
        student_id: student.id,
        student_name: student.full_name,
        course_name: student.course_name || 'Not specified',
        attendance_date: today,
        status,
        session_type: 'theory',
        marked_by: 'Admin',
        remarks: `Marked ${status} on ${new Date().toLocaleDateString()}`
      });

      toast.success(`${student.full_name} marked as ${status}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const handleSearch = () => {
    toast.success(`Found ${filteredStudents.length} students`);
  };

  // Calculate statistics
  const todayAttendance = attendanceData.filter(a => 
    new Date(a.attendance_date).toDateString() === new Date().toDateString()
  );
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const totalStudents = filteredStudents.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
            <span>Student Attendance Management</span>
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
                  <p className="text-accent-foreground/80 text-sm font-medium">Present Today</p>
                  <p className="text-3xl font-bold">{presentToday}</p>
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">Absent Today</p>
                  <p className="text-3xl font-bold">{absentToday}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <UserX className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Attendance Rate</p>
                  <p className="text-3xl font-bold text-foreground">{attendanceRate}%</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <span>Search & Filter Students</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise ID</label>
                <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select Franchise ID" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="franchise1" className="hover:bg-accent/50">Franchise 001</SelectItem>
                    <SelectItem value="franchise2" className="hover:bg-accent/50">Franchise 002</SelectItem>
                    <SelectItem value="franchise3" className="hover:bg-accent/50">Franchise 003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="course1" className="hover:bg-accent/50">Computer Basics</SelectItem>
                    <SelectItem value="course2" className="hover:bg-accent/50">Advanced Computer Course</SelectItem>
                    <SelectItem value="course3" className="hover:bg-accent/50">Programming Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  Search Students
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                <span>Mark Attendance ({filteredStudents.length} students)</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {students?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-500">No students match the selected criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                          <div className="flex items-center justify-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Actions
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Student Name
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Course
                          </div>
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Student ID
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr 
                          key={student.id}
                          className={`border-b border-border/20 hover:bg-accent/10 transition-colors ${
                            index % 2 === 0 ? 'bg-background/30' : 'bg-background/50'
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                onClick={() => markAttendance(student, 'present')}
                                size="sm"
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Present
                              </Button>
                              <Button
                                onClick={() => markAttendance(student, 'absent')}
                                size="sm"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md"
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Absent
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{student.full_name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{student.course_name || 'Not assigned'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm text-muted-foreground">{student.id}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <span>Today's Attendance Summary</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-700 mb-2">{presentToday}</div>
                <div className="text-sm font-medium text-green-600">Students Present</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="text-3xl font-bold text-red-700 mb-2">{absentToday}</div>
                <div className="text-sm font-medium text-red-600">Students Absent</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-700 mb-2">{attendanceRate}%</div>
                <div className="text-sm font-medium text-blue-600">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendanceContent;