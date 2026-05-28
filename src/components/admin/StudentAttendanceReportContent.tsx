import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { Loader2, FileBarChart, Calendar, Users, Filter, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
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

const StudentAttendanceReportContent = () => {
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);

  const { data: attendanceData, loading } = useOptimisticCrud<AttendanceRecord>({
    tableName: 'attendance_management',
    orderBy: { column: 'attendance_date', ascending: false }
  });

  // Enable real-time updates
  useAdminRealTime({
    tableName: 'attendance_management'
  });

  // Filter attendance data based on filters
  useEffect(() => {
    let filtered = attendanceData;

    if (selectedCourse) {
      filtered = filtered.filter(record => 
        record.course_name.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.attendance_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });
    }

    setFilteredAttendance(filtered);
  }, [attendanceData, selectedCourse, startDate, endDate]);

  const handleSearch = () => {
    toast.success(`Found ${filteredAttendance.length} attendance records`);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(r => r.status === 'present').length;
    const absent = filteredAttendance.filter(r => r.status === 'absent').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, attendanceRate };
  }, [filteredAttendance]);

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading attendance reports...</p>
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
              <FileBarChart className="h-8 w-8 text-primary" />
            </div>
            <span>Student Attendance Reports</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{statistics.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileBarChart className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Present</p>
                  <p className="text-3xl font-bold">{statistics.present}</p>
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">Absent</p>
                  <p className="text-3xl font-bold">{statistics.absent}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Attendance Rate</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.attendanceRate}%</p>
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
                <Filter className="h-6 w-6" />
              </div>
              <span>Filter Attendance Reports</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise ID</label>
                <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select Franchise" />
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
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  Search Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                <span>Attendance Records ({filteredAttendance.length} records)</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {attendanceData?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {filteredAttendance.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileBarChart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                <p className="text-gray-500">No attendance records match the selected criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Student ID
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
                            <FileBarChart className="h-4 w-4" />
                            Course
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Status
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Session Type
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Marked By
                          </div>
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <FileBarChart className="h-4 w-4" />
                            Remarks
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((record, index) => (
                        <tr 
                          key={record.id}
                          className={`border-b border-border/20 hover:bg-accent/10 transition-colors ${
                            index % 2 === 0 ? 'bg-background/30' : 'bg-background/50'
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-mono text-sm text-muted-foreground">{record.student_id}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{record.student_name}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{record.course_name}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">
                              {new Date(record.attendance_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <Badge 
                              className={`${
                                record.status === 'present' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : record.status === 'absent'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`}
                            >
                              {record.status}
                            </Badge>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{record.session_type}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{record.marked_by || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-foreground truncate max-w-[150px]" title={record.remarks || '-'}>
                              {record.remarks || '-'}
                            </div>
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

        {/* Summary Statistics */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span>Report Summary</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-700 mb-2">{statistics.total}</div>
                <div className="text-sm font-medium text-blue-600">Total Records</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-700 mb-2">{statistics.present}</div>
                <div className="text-sm font-medium text-green-600">Present Records</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="text-3xl font-bold text-red-700 mb-2">{statistics.absent}</div>
                <div className="text-sm font-medium text-red-600">Absent Records</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-700 mb-2">{statistics.attendanceRate}%</div>
                <div className="text-sm font-medium text-purple-600">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendanceReportContent;