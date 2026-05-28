import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2, Loader2, Search, Users, UserCheck, UserX, CalendarClock, TrendingUp, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface AttendanceManagement {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late';
  session_type: string;
  remarks?: string;
  marked_by?: string;
}

const AttendanceManagementContent = () => {
  const {
    data: attendanceData,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<AttendanceManagement>({ 
    tableName: 'attendance_management',
    orderBy: { column: 'attendance_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'attendance_management'
  });

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    courseName: "",
    attendanceDate: new Date().toISOString().split('T')[0],
    status: "present" as 'present' | 'absent' | 'late',
    sessionType: "theory",
    remarks: "",
    markedBy: ""
  });

  const [editingAttendance, setEditingAttendance] = useState<AttendanceManagement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.studentName || !formData.courseName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingAttendance) {
        await update(editingAttendance.id, {
          student_id: formData.studentId,
          student_name: formData.studentName,
          course_name: formData.courseName,
          attendance_date: formData.attendanceDate,
          status: formData.status,
          session_type: formData.sessionType,
          remarks: formData.remarks || undefined,
          marked_by: formData.markedBy || undefined
        });
        toast.success("Attendance updated successfully!");
      } else {
        await create({
          student_id: formData.studentId,
          student_name: formData.studentName,
          course_name: formData.courseName,
          attendance_date: formData.attendanceDate,
          status: formData.status,
          session_type: formData.sessionType,
          remarks: formData.remarks || null,
          marked_by: formData.markedBy || null
        });
        toast.success("Attendance marked successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingAttendance ? 'update' : 'mark'} attendance`);
    }
  };

  const handleEdit = (record: AttendanceManagement) => {
    setEditingAttendance(record);
    setFormData({
      studentId: record.student_id,
      studentName: record.student_name,
      courseName: record.course_name,
      attendanceDate: record.attendance_date,
      status: record.status,
      sessionType: record.session_type,
      remarks: record.remarks || "",
      markedBy: record.marked_by || ""
    });
  };

  const handleReset = () => {
    setEditingAttendance(null);
    setFormData({
      studentId: "",
      studentName: "",
      courseName: "",
      attendanceDate: new Date().toISOString().split('T')[0],
      status: "present",
      sessionType: "theory",
      remarks: "",
      markedBy: ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Attendance record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete attendance record");
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = attendanceData || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    return filtered;
  }, [attendanceData, searchTerm, filterStatus]);

  const courseCategories = ["ADCA", "DCA", "PGDCA", "BCA", "MCA"];

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading attendance data...</p>
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
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <span>Attendance Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{attendanceData?.length || 0}</p>
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
                  <p className="text-3xl font-bold">
                    {attendanceData?.filter(record => {
                      const recordDate = new Date(record.attendance_date).toDateString();
                      const today = new Date().toDateString();
                      return recordDate === today && record.status === 'present';
                    }).length || 0}
                  </p>
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">Absent Today</p>
                  <p className="text-3xl font-bold">
                    {attendanceData?.filter(record => {
                      const recordDate = new Date(record.attendance_date).toDateString();
                      const today = new Date().toDateString();
                      return recordDate === today && record.status === 'absent';
                    }).length || 0}
                  </p>
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
                <Calendar className="h-6 w-6" />
              </div>
              <span>{editingAttendance ? 'Edit Attendance Record' : 'Mark New Attendance'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student ID*</label>
                <Input
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student ID"
                />
              </div>

              {/* Student Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student Name*</label>
                <Input
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student name"
                />
              </div>

              {/* Course Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Name*</label>
                <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select course" />
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

              {/* Attendance Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Attendance Date*</label>
                <Input
                  type="date"
                  value={formData.attendanceDate}
                  onChange={(e) => handleInputChange('attendanceDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status*</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="present" className="hover:bg-accent/50">Present</SelectItem>
                    <SelectItem value="absent" className="hover:bg-accent/50">Absent</SelectItem>
                    <SelectItem value="late" className="hover:bg-accent/50">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Session Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Session Type</label>
                <Select value={formData.sessionType} onValueChange={(value) => handleInputChange('sessionType', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="theory" className="hover:bg-accent/50">Theory</SelectItem>
                    <SelectItem value="practical" className="hover:bg-accent/50">Practical</SelectItem>
                    <SelectItem value="both" className="hover:bg-accent/50">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Remarks</label>
                <Input
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Optional remarks"
                />
              </div>

              {/* Marked By */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Marked By</label>
                <Input
                  value={formData.markedBy}
                  onChange={(e) => handleInputChange('markedBy', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Teacher/Admin name"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingAttendance ? 'Update Attendance' : 'Mark Attendance'}
              </Button>
              
              {editingAttendance && (
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
                  placeholder="Search by student name, ID, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Status</SelectItem>
                    <SelectItem value="present" className="hover:bg-accent/50">Present</SelectItem>
                    <SelectItem value="absent" className="hover:bg-accent/50">Absent</SelectItem>
                    <SelectItem value="late" className="hover:bg-accent/50">Late</SelectItem>
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
                  <Clock className="h-6 w-6" />
                </div>
                <span>Attendance Records ({filteredData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {attendanceData?.length || 0}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        Course
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[100px]">
                        Session
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[100px]">
                        Status
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        Remarks
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        Marked By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((record, index) => (
                      <tr key={record.id} className={`${index % 2 === 0 ? 'bg-background' : 'bg-accent/5'} hover:bg-primary/5 transition-all duration-200`}>
                        <td className="border-r border-border/20 px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              onClick={() => handleEdit(record)}
                              size="sm"
                              className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all duration-200 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(record.id)}
                              size="sm"
                              variant="destructive"
                              className="bg-gradient-to-r from-destructive to-destructive/80 hover:shadow-lg transition-all duration-200 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 text-foreground font-medium">
                          {new Date(record.attendance_date).toLocaleDateString()}
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 font-semibold text-primary">
                          {record.student_id}
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 font-semibold text-foreground">
                          {record.student_name}
                        </td>
                        <td className="border-r border-border/20 px-6 py-4">
                          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                            {record.course_name}
                          </Badge>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {record.session_type}
                          </Badge>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4">
                          <Badge 
                            className={`capitalize ${
                              record.status === 'present' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : record.status === 'absent'
                                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            }`}
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="border-r border-border/20 px-6 py-4 text-muted-foreground max-w-[200px] truncate" title={record.remarks || 'No remarks'}>
                          {record.remarks || 'No remarks'}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {record.marked_by || 'Not specified'}
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center space-y-3">
                            <Clock className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                              <h3 className="text-lg font-semibold">No attendance records found</h3>
                              <p className="text-sm">Try adjusting your search filters or add new attendance records.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
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

export default AttendanceManagementContent;