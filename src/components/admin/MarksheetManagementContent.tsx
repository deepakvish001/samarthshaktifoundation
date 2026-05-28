import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import StudentPicker from "@/components/admin/shared/StudentPicker";
import { validateStudentSelection } from "@/components/admin/shared/validateStudentSelection";
import { Loader2, Edit, Trash2, Search, Filter, FileText, Calculator, TrendingUp, Users, Award, BarChart3, CheckCircle, Plus, BookOpen } from "lucide-react";

interface MarksheetManagement {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  roll_number: string;
  examination_date: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  result_status: string;
  marksheet_url?: string;
}

const MarksheetManagementContent = () => {
  const {
    data: marksheets,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<MarksheetManagement>({ 
    tableName: 'marksheet_management',
    orderBy: { column: 'examination_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'marksheet_management'
  });

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    courseName: "",
    rollNumber: "",
    examinationDate: "",
    totalMarks: "",
    obtainedMarks: "",
    grade: "",
    resultStatus: "pass"
  });

  const [editingMarksheet, setEditingMarksheet] = useState<MarksheetManagement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePercentage = (obtained: number, total: number) => {
    return total > 0 ? Math.round((obtained / total) * 100 * 100) / 100 : 0;
  };

  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "F";
  };

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.studentName || !formData.courseName || !formData.rollNumber || !formData.totalMarks || !formData.obtainedMarks) {
      toast.error("Please fill in all required fields");
      return;
    }

    const check = await validateStudentSelection({
      studentId: formData.studentId,
      expectedCourse: formData.courseName,
    });
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    const totalMarks = parseInt(formData.totalMarks);
    const obtainedMarks = parseInt(formData.obtainedMarks);
    
    if (obtainedMarks > totalMarks) {
      toast.error("Obtained marks cannot be greater than total marks");
      return;
    }

    const percentage = calculatePercentage(obtainedMarks, totalMarks);
    const autoGrade = calculateGrade(percentage);

    try {
      if (editingMarksheet) {
        await update(editingMarksheet.id, {
          student_id: formData.studentId,
          student_name: formData.studentName,
          course_name: formData.courseName,
          roll_number: formData.rollNumber,
          examination_date: formData.examinationDate,
          total_marks: totalMarks,
          obtained_marks: obtainedMarks,
          percentage: percentage,
          grade: formData.grade || autoGrade,
          result_status: formData.resultStatus
        });
        toast.success("Marksheet updated successfully!");
      } else {
        await create({
          student_id: formData.studentId,
          student_name: formData.studentName,
          course_name: formData.courseName,
          roll_number: formData.rollNumber,
          examination_date: formData.examinationDate,
          total_marks: totalMarks,
          obtained_marks: obtainedMarks,
          percentage: percentage,
          grade: formData.grade || autoGrade,
          result_status: formData.resultStatus
        });
        toast.success("Marksheet created successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingMarksheet ? 'update' : 'create'} marksheet`);
    }
  };

  const handleEdit = (marksheet: MarksheetManagement) => {
    setEditingMarksheet(marksheet);
    setFormData({
      studentId: marksheet.student_id,
      studentName: marksheet.student_name,
      courseName: marksheet.course_name,
      rollNumber: marksheet.roll_number,
      examinationDate: marksheet.examination_date,
      totalMarks: marksheet.total_marks.toString(),
      obtainedMarks: marksheet.obtained_marks.toString(),
      grade: marksheet.grade,
      resultStatus: marksheet.result_status
    });
  };

  const handleReset = () => {
    setEditingMarksheet(null);
    setFormData({
      studentId: "",
      studentName: "",
      courseName: "",
      rollNumber: "",
      examinationDate: "",
      totalMarks: "",
      obtainedMarks: "",
      grade: "",
      resultStatus: "pass"
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this marksheet?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Marksheet deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete marksheet");
    }
  };

  // Filter and search functionality
  const filteredMarksheets = useMemo(() => {
    return marksheets.filter(marksheet => {
      const matchesSearch = 
        marksheet.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marksheet.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marksheet.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === "all" || filterCourse === "" || marksheet.course_name === filterCourse;
      
      return matchesSearch && matchesCourse;
    });
  }, [marksheets, searchTerm, filterCourse]);

  // Statistics calculations
  const stats = useMemo(() => {
    const total = marksheets.length;
    const passed = marksheets.filter(m => m.result_status === 'pass').length;
    const averagePercentage = marksheets.length > 0 
      ? marksheets.reduce((sum, m) => sum + m.percentage, 0) / marksheets.length 
      : 0;
    const highPerformers = marksheets.filter(m => m.percentage >= 80).length;

    return { total, passed, averagePercentage, highPerformers };
  }, [marksheets]);

  const courseCategories = [
    "ADCA",
    "DCA", 
    "PGDCA",
    "BCA",
    "MCA"
  ];

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading marksheets...</p>
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <span>Marksheet Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Marksheets</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Passed Students</p>
                  <p className="text-3xl font-bold">{stats.passed}</p>
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">Average Percentage</p>
                  <p className="text-3xl font-bold">{stats.averagePercentage.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">High Performers</p>
                  <p className="text-3xl font-bold text-foreground">{stats.highPerformers}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6 text-foreground" />
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
                <Plus className="h-6 w-6" />
              </div>
              <span>{editingMarksheet ? 'Edit Marksheet' : 'Add New Marksheet'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Registered Student
              </label>
              <StudentPicker
                value={formData.studentId}
                onSelect={(s) => {
                  setFormData((prev) => ({
                    ...prev,
                    studentId: s.student_id || prev.studentId,
                    studentName: s.full_name || prev.studentName,
                    courseName: s.course_name || prev.courseName,
                  }));
                }}
                className="w-full"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Picking a student auto-fills ID, Name and Course. Roll number and marks below remain manual.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student ID *</label>
                <Input
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student Name *</label>
                <Input
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Name *</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Roll Number *</label>
                <Input
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter roll number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Examination Date *</label>
                <Input
                  type="date"
                  value={formData.examinationDate}
                  onChange={(e) => handleInputChange('examinationDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Total Marks *</label>
                <Input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter total marks"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Obtained Marks *</label>
                <Input
                  type="number"
                  value={formData.obtainedMarks}
                  onChange={(e) => handleInputChange('obtainedMarks', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter obtained marks"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Grade (Auto-calculated)</label>
                <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Auto-calculated" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="A+" className="hover:bg-accent/50">A+</SelectItem>
                    <SelectItem value="A" className="hover:bg-accent/50">A</SelectItem>
                    <SelectItem value="B+" className="hover:bg-accent/50">B+</SelectItem>
                    <SelectItem value="B" className="hover:bg-accent/50">B</SelectItem>
                    <SelectItem value="C" className="hover:bg-accent/50">C</SelectItem>
                    <SelectItem value="F" className="hover:bg-accent/50">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Result Status</label>
                <Select value={formData.resultStatus} onValueChange={(value) => handleInputChange('resultStatus', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select result status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="pass" className="hover:bg-accent/50">Pass</SelectItem>
                    <SelectItem value="fail" className="hover:bg-accent/50">Fail</SelectItem>
                    <SelectItem value="pending" className="hover:bg-accent/50">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Show calculated percentage */}
            {formData.totalMarks && formData.obtainedMarks && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/20">
                <div className="flex items-center space-x-4">
                  <Calculator className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Calculated Percentage: <span className="text-primary font-bold">{calculatePercentage(parseInt(formData.obtainedMarks), parseInt(formData.totalMarks))}%</span>
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Suggested Grade: <span className="text-secondary font-bold">{calculateGrade(calculatePercentage(parseInt(formData.obtainedMarks), parseInt(formData.totalMarks)))}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingMarksheet ? 'Update Marksheet' : 'Create Marksheet'}
              </Button>
              
              {editingMarksheet && (
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
                  placeholder="Search by student name, ID, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Courses</SelectItem>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                        {category}
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
                  <BarChart3 className="h-6 w-6" />
                </div>
                <span>Marksheet Records ({filteredMarksheets.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {marksheets.length}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Course
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" />
                          Roll No.
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Total
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Obtained
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Percentage
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[80px]">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="h-4 w-4" />
                          Grade
                        </div>
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Result
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarksheets.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-muted-foreground bg-background/30">
                          <div className="flex flex-col items-center space-y-3">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-lg font-medium">No marksheets found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredMarksheets.map((marksheet, index) => (
                        <tr 
                          key={marksheet.id} 
                          className={`hover:bg-accent/20 transition-colors ${
                            index % 2 === 0 ? "bg-background" : "bg-accent/5"
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(marksheet)}
                                className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(marksheet.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-foreground font-medium">
                            {marksheet.student_id}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-foreground font-medium">
                            {marksheet.student_name}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md text-sm font-medium">
                              {marksheet.course_name}
                            </span>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            {marksheet.roll_number}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-primary font-bold">
                            {marksheet.total_marks}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-secondary font-bold">
                            {marksheet.obtained_marks}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                              marksheet.percentage >= 80 ? 'bg-green-100 text-green-800' :
                              marksheet.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                              marksheet.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {marksheet.percentage}%
                            </span>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                              marksheet.grade === 'A+' || marksheet.grade === 'A' ? 'bg-green-100 text-green-800' :
                              marksheet.grade === 'B+' || marksheet.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              marksheet.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {marksheet.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              marksheet.result_status === 'pass' ? 'bg-green-100 text-green-800' :
                              marksheet.result_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {marksheet.result_status}
                            </span>
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
      </div>
    </div>
  );
};

export default MarksheetManagementContent;