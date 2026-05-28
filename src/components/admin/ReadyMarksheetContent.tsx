import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { Loader2, FileText, Users, Calendar, TrendingUp, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

interface MarksheetRecord {
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
  created_at: string;
  updated_at: string;
}

const ReadyMarksheetContent = () => {
  const { data: marksheetData, loading, delete: deleteItem } = useOptimisticCrud<MarksheetRecord>({
    tableName: 'marksheet_management',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Enable real-time updates
  useAdminRealTime({
    tableName: 'marksheet_management'
  });

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterResult, setFilterResult] = useState("all");

  // Filter and search logic
  const filteredData = useMemo(() => {
    return marksheetData.filter(item => {
      const matchesSearch = 
        item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = filterGrade === "all" || item.grade === filterGrade;
      const matchesResult = filterResult === "all" || item.result_status === filterResult;
      
      return matchesSearch && matchesGrade && matchesResult;
    });
  }, [marksheetData, searchTerm, filterGrade, filterResult]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = marksheetData.length;
    const passed = marksheetData.filter(item => item.result_status === 'pass').length;
    const thisMonth = marksheetData.filter(item => {
      const itemDate = new Date(item.created_at);
      const now = new Date();
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }).length;
    const averagePercentage = total > 0 ? 
      Math.round(marksheetData.reduce((sum, item) => sum + item.percentage, 0) / total) : 0;

    return { total, passed, thisMonth, averagePercentage };
  }, [marksheetData]);

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success('Marksheet record deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete marksheet record');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground font-medium">Loading marksheet records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ready Marksheets</h1>
              <p className="text-white/80 text-sm">Manage and view all student marksheet records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Marksheets</CardTitle>
                <FileText className="h-4 w-4 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <FileText className="h-16 w-16" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white overflow-hidden relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Passed Students</CardTitle>
                <Users className="h-4 w-4 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passed}</div>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <Users className="h-16 w-16" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">This Month</CardTitle>
                <Calendar className="h-4 w-4 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <Calendar className="h-16 w-16" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white overflow-hidden relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Avg. Percentage</CardTitle>
                <TrendingUp className="h-4 w-4 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averagePercentage}%</div>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <TrendingUp className="h-16 w-16" />
            </div>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Marksheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Filter by Grade</label>
                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger className="bg-white/50 border-border/50">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Filter by Result</label>
                <Select value={filterResult} onValueChange={setFilterResult}>
                  <SelectTrigger className="bg-white/50 border-border/50">
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Marksheet Records
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredData.length} of {marksheetData.length})
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-b border-border/50">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Student ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Student Name</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Roll Number</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Exam Date</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Total Marks</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Obtained</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Percentage</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Grade</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <FileText className="h-12 w-12 text-muted-foreground/30" />
                          <p className="text-muted-foreground font-medium">No marksheet records found</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm || filterGrade !== "all" || filterResult !== "all" 
                              ? "Try adjusting your search or filter criteria"
                              : "Start by adding some marksheet records"
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-primary/5 transition-colors ${
                          index % 2 === 0 ? "bg-background/50" : "bg-white/30"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Loader2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">{item.student_id}</td>
                        <td className="px-4 py-4 text-sm text-foreground">{item.student_name}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{item.course_name}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{item.roll_number}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {new Date(item.examination_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">{item.total_marks}</td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">{item.obtained_marks}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-foreground">{item.percentage}%</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                            {item.grade}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.result_status === 'pass' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.result_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReadyMarksheetContent;