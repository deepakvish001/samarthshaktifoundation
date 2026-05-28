import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, BookOpen, Users, GraduationCap, Award, Search, Filter, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const EditCRTContent = () => {
  // Sample edit CRT data based on screenshots
  const [crtData] = useState([
    {
      id: 77,
      studentId: "20041",
      coursename: "ADCA",
      semYear: "12 Month",
      subject: "C & C++",
      theoryMarks: "50",
      practicalMarks: "50",
      obtainTheoryMarks: "27",
      obtainPracticalMarks: "31",
      issueDate: "25/05/2017",
      place: "BILARIYAGAN J",
      studentName: "Mr./श्री RAHUL SINGH",
      studentFname: "Mr./श्री RADHESHYAM SINGH",
      studentMname: "Mrs./श्रीमती PUSHPA SINGH",
      studentVerificationNo: "BSOFT30061",
      examinationDate: "13/03/2017",
      centerName: "Bina Soft Educational and Welfare Society",
      centerCode: "SM11101",
      photo: "~/Offer_pic/IMG-20200208-WA0005.jpg",
      directSign: "~/Offer_pic/signature.jpg"
    },
    {
      id: 80,
      studentId: "20041",
      coursename: "ADCA",
      semYear: "12 Month",
      subject: "Page Maker",
      theoryMarks: "50",
      practicalMarks: "50",
      obtainTheoryMarks: "23",
      obtainPracticalMarks: "34",
      issueDate: "25/05/2017",
      place: "BILARIYAGAN J",
      studentName: "Mr./श्री RAHUL SINGH",
      studentFname: "Mr./श्री RADHESHYAM SINGH",
      studentMname: "Mrs./श्रीमती PUSHPA SINGH",
      studentVerificationNo: "BSOFT30061",
      examinationDate: "13/03/2017",
      centerName: "Bina Soft Educational and Welfare Society",
      centerCode: "SM11101",
      photo: "~/Offer_pic/IMG-20200208-WA0005.jpg",
      directSign: "~/Offer_pic/signature.jpg"
    },
    {
      id: 82,
      studentId: "20041",
      coursename: "ADCA",
      semYear: "12 Month",
      subject: "Corel Draw",
      theoryMarks: "50",
      practicalMarks: "50",
      obtainTheoryMarks: "29",
      obtainPracticalMarks: "26",
      issueDate: "25/05/2017",
      place: "BILARIYAGAN J",
      studentName: "Mr./श्री RAHUL SINGH",
      studentFname: "Mr./श्री RADHESHYAM SINGH",
      studentMname: "Mrs./श्रीमती PUSHPA SINGH",
      studentVerificationNo: "BSOFT30061",
      examinationDate: "13/03/2017",
      centerName: "Bina Soft Educational and Welfare Society",
      centerCode: "SM11101",
      photo: "~/Offer_pic/IMG-20200208-WA0005.jpg",
      directSign: "~/Offer_pic/signature.jpg"
    },
    {
      id: 83,
      studentId: "20047",
      coursename: "ADCA",
      semYear: "12 Month",
      subject: "Fundamental (DOS)",
      theoryMarks: "50",
      practicalMarks: "50",
      obtainTheoryMarks: "45",
      obtainPracticalMarks: "48",
      issueDate: "25/05/2017",
      place: "BILARIYAGAN J",
      studentName: "Mr./श्री SHIVAM SINGH",
      studentFname: "Mr./श्री ARVIND SINGH",
      studentMname: "Mrs./श्रीमती MAMATA SINGH",
      studentVerificationNo: "BSOFT30083",
      examinationDate: "13/03/2017",
      centerName: "Bina Soft Educational and Welfare Society",
      centerCode: "SM11101",
      photo: "~/Offer_pic/IMG-20200907-WA0022 (1).jpg",
      directSign: "~/Offer_pic/signature.jpg"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  // Filter and search logic
  const filteredData = useMemo(() => {
    return crtData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentVerificationNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === "all" || item.coursename === filterCourse;
      
      return matchesSearch && matchesCourse;
    });
  }, [crtData, searchTerm, filterCourse]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalRecords = crtData.length;
    const uniqueStudents = new Set(crtData.map(item => item.studentId)).size;
    const uniqueCourses = new Set(crtData.map(item => item.coursename)).size;
    const uniqueSubjects = new Set(crtData.map(item => item.subject)).size;
    const avgTheoryMarks = crtData.reduce((sum, item) => sum + parseInt(item.obtainTheoryMarks), 0) / crtData.length;

    return {
      total: totalRecords,
      students: uniqueStudents,
      courses: uniqueCourses,
      subjects: uniqueSubjects,
      avgTheory: Math.round(avgTheoryMarks),
      filtered: filteredData.length
    };
  }, [crtData, filteredData]);

  const handleEdit = (id: number) => {
    toast.success(`Edit CRT record ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    toast.error(`Delete CRT record ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Edit className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Edit CRT Records
            </h1>
            <p className="text-muted-foreground mt-1">Manage and edit Certificate and Result Transcript records</p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Records</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Students</p>
                  <p className="text-2xl font-bold text-green-900">{stats.students}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Courses</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.courses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Subjects</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.subjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-700">Avg Theory</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.avgTheory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-pink-700">Filtered</p>
                  <p className="text-2xl font-bold text-pink-900">{stats.filtered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="bg-background/95 backdrop-blur-sm border border-primary/10 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 bg-background border-input"
                placeholder="Search by student name, ID, subject, or verification number..."
              />
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="ADCA">ADCA</SelectItem>
                  <SelectItem value="DCA">DCA</SelectItem>
                  <SelectItem value="PGDCA">PGDCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="bg-background/95 backdrop-blur-sm border border-primary/10 shadow-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90">
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[120px]">Actions</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[80px]">ID</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Student ID</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Course</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Duration</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[120px]">Subject</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Theory Max</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Practical Max</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[120px]">Theory Obtained</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[120px]">Practical Obtained</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Issue Date</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Place</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[200px]">Student Name</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[120px]">Verification No</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[100px]">Exam Date</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20 min-w-[200px]">Center Name</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Center Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={17} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center space-y-2">
                          <Edit className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-lg font-medium">No CRT records found</p>
                          <p className="text-sm">
                            {searchTerm || filterCourse !== "all" 
                              ? "Try adjusting your search or filter criteria" 
                              : "No CRT records available"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                      >
                        <TableCell className="text-center p-4 border-r border-border">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item.id)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.id}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.studentId}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.coursename}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.semYear}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.subject}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.theoryMarks}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.practicalMarks}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border text-green-600">{item.obtainTheoryMarks}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border text-green-600">{item.obtainPracticalMarks}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.issueDate}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.place}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.studentName}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.studentVerificationNo}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.examinationDate}</TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">{item.centerName}</TableCell>
                        <TableCell className="text-center p-4 font-medium">{item.centerCode}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCRTContent;