import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Edit, Trash2, Loader2, DollarSign, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface ClassFees {
  id: string;
  course_type: string;
  board_university?: string;
  course_name: string;
  student_cv?: string;
  duration?: string;
  fees_entry: string;
}

const ClassFeesContent = () => {
  const {
    data: classFees,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<ClassFees>({ 
    tableName: 'class_fees',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'class_fees'
  });

  const [courseType, setCourseType] = useState("Computer Courses");
  const [boardUniversity, setBoardUniversity] = useState("");
  const [courseName, setCourseName] = useState("");
  const [studentCV, setStudentCV] = useState("");
  const [duration, setDuration] = useState("");
  const [feesEntry, setFeesEntry] = useState("");
  const [editingItem, setEditingItem] = useState<ClassFees | null>(null);

  const handleReset = () => {
    setCourseType("Computer Courses");
    setBoardUniversity("");
    setCourseName("");
    setStudentCV("");
    setDuration("");
    setFeesEntry("");
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!courseType || !courseName || !feesEntry) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const feeData = {
        course_type: courseType,
        board_university: boardUniversity || null,
        course_name: courseName,
        student_cv: studentCV || null,
        duration: duration || null,
        fees_entry: feesEntry
      };

      if (editingItem) {
        await update(editingItem.id, feeData);
        toast.success("Class fees updated successfully!");
      } else {
        await create(feeData);
        toast.success("Class fees added successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingItem ? 'update' : 'add'} class fees`);
    }
  };

  const handleEdit = (fee: ClassFees) => {
    setEditingItem(fee);
    setCourseType(fee.course_type);
    setBoardUniversity(fee.board_university || "");
    setCourseName(fee.course_name);
    setStudentCV(fee.student_cv || "");
    setDuration(fee.duration || "");
    setFeesEntry(fee.fees_entry);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fees record?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Class fees deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete class fees");
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = classFees?.length || 0;
    const totalRevenue = classFees?.reduce((sum, fee) => {
      const amount = parseFloat(fee.fees_entry) || 0;
      return sum + amount;
    }, 0) || 0;
    const avgFees = total > 0 ? Math.round(totalRevenue / total) : 0;
    const courseTypes = new Set(classFees?.map(fee => fee.course_type)).size;
    
    return { total, totalRevenue, avgFees, courseTypes };
  }, [classFees]);

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading class fees data...</p>
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
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <span>Class Fees Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold">{statistics.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{statistics.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Average Fees</p>
                  <p className="text-3xl font-bold">₹{statistics.avgFees.toLocaleString()}</p>
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
                  <p className="text-muted-foreground/80 text-sm font-medium">Course Types</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.courseTypes}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <GraduationCap className="h-6 w-6 text-foreground" />
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
                <GraduationCap className="h-6 w-6" />
              </div>
              <span>{editingItem ? 'Edit Class Fees' : 'Add New Class Fees'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Course Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Type*</label>
                <Select value={courseType} onValueChange={setCourseType}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="Computer Courses" className="hover:bg-accent/50">Computer Courses</SelectItem>
                    <SelectItem value="Programming Courses" className="hover:bg-accent/50">Programming Courses</SelectItem>
                    <SelectItem value="Web Development" className="hover:bg-accent/50">Web Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Board or University */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Board or University</label>
                  <Input
                    type="text"
                    value={boardUniversity}
                    onChange={(e) => setBoardUniversity(e.target.value)}
                    className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Enter board/university"
                  />
                </div>

                {/* Course Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Course Name*</label>
                  <Select value={courseName} onValueChange={setCourseName}>
                    <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/40">
                      <SelectItem value="basic-computer" className="hover:bg-accent/50">Basic Computer Course</SelectItem>
                      <SelectItem value="advanced-computer" className="hover:bg-accent/50">Advanced Computer Course</SelectItem>
                      <SelectItem value="programming" className="hover:bg-accent/50">Programming Fundamentals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student CV */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Student CV</label>
                  <Input
                    type="text"
                    value={studentCV}
                    onChange={(e) => setStudentCV(e.target.value)}
                    className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Enter student CV"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration</label>
                  <Input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Enter duration"
                  />
                </div>

                {/* Fees Entry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Fees Entry*</label>
                  <Input
                    type="number"
                    value={feesEntry}
                    onChange={(e) => setFeesEntry(e.target.value)}
                    className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Enter fees amount"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-8 border-t border-border/20">
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
                >
                  {editingItem ? 'Update Fees' : 'Add Fees'}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-border/40 hover:bg-accent/20 px-8"
                >
                  {editingItem ? 'Cancel Edit' : 'Reset'}
                </Button>
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
                  <DollarSign className="h-6 w-6" />
                </div>
                <span>Class Fees Records ({classFees?.length || 0})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total Revenue: ₹{statistics.totalRevenue.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {classFees?.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Fees Records Found</h3>
                <p className="text-gray-500">Start by adding your first class fees record.</p>
              </div>
            ) : (
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
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Course Type
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Board/University
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Course Name
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Student CV
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Duration
                          </div>
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-right min-w-[120px]">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4" />
                            Fees Entry
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classFees?.map((fee, index) => (
                        <tr 
                          key={fee.id}
                          className={`border-b border-border/20 hover:bg-accent/10 transition-colors ${
                            index % 2 === 0 ? 'bg-background/30' : 'bg-background/50'
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                onClick={() => handleEdit(fee)}
                                size="sm"
                                variant="ghost"
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(fee.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{fee.course_type}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{fee.board_university || "N/A"}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{fee.course_name}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{fee.student_cv || "N/A"}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{fee.duration || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-bold text-green-600">
                              ₹{parseFloat(fee.fees_entry).toLocaleString()}
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
      </div>
    </div>
  );
};

export default ClassFeesContent;