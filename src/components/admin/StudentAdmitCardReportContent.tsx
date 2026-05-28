import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Users, 
  Calendar, 
  GraduationCap,
  Edit,
  Trash2,
  Download,
  Printer,
  FileSpreadsheet
} from "lucide-react";

const StudentAdmitCardReportContent = () => {
  const { toast } = useToast();

  // Sample student admit card report data
  const [reportData] = useState([
    {
      id: 1,
      course: "ADCA",
      rollNumber: "20040",
      studentName: "Mr./श्रीGUPTESHWAR SINGH",
      motherName: "Mrs./श्रीमतीSHASHI PRABHA SINGH",
      fatherName: "Mr./श्रीRAVINDRA SINGH",
      examCenterCode: "",
      pwd: "",
      examCenterAddress: "",
      examDate: "",
      batch: "",
      reportingTime: "",
      gateClosingTime: "",
      examStartTime: "",
      examDuration: "",
      photo: "~/Offer_pic/"
    },
    {
      id: 2,
      course: "ADCA",
      rollNumber: "20043",
      studentName: "Mr./श्रीChote Lal Kumar",
      motherName: "Mrs./श्रीमतीDharmi Devi",
      fatherName: "Mr./श्रीVijay Prasad",
      examCenterCode: "SM11101",
      pwd: "",
      examCenterAddress: "Jiyanpur",
      examDate: "11/06/2019",
      batch: "M004",
      reportingTime: "10:00",
      gateClosingTime: "10:30",
      examStartTime: "11:00",
      examDuration: "90 Minute",
      photo: "~/Offer_pic/chotalal.jpg"
    }
  ]);

  // Statistics calculations
  const totalAdmitCards = reportData.length;
  const completedCards = reportData.filter(card => card.examDate && card.examCenterCode).length;
  const pendingCards = totalAdmitCards - completedCards;
  const activeCourses = [...new Set(reportData.map(card => card.course))].length;

  const handleEdit = (id: number) => {
    toast({
      title: "Edit",
      description: `Edit student admit card report ID: ${id}`,
      variant: "default"
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Delete",
      description: `Delete student admit card report ID: ${id}`,
      variant: "destructive"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Report",
      description: "Admit card report exported successfully",
      variant: "default"
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Report",
      description: "Printing admit card report...",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <span>Student Admit Card Report</span>
          </h1>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm" className="border-border/40 hover:bg-accent/20">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm" className="border-border/40 hover:bg-accent/20">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Admit Cards</p>
                  <p className="text-3xl font-bold">{totalAdmitCards}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Completed Cards</p>
                  <p className="text-3xl font-bold">{completedCards}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Pending Cards</p>
                  <p className="text-3xl font-bold">{pendingCards}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Courses */}
          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-foreground">{activeCourses}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <GraduationCap className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <span>Admit Card Records ({totalAdmitCards})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Completed: {completedCards} / Total: {totalAdmitCards}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[100px]">Course</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[140px]">Roll Number</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[220px]">Student Name</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[220px]">Mother's Name</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[220px]">Father's Name</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">Center Code</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[80px]">PWD</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[220px]">Center Address</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[140px]">Exam Date</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[100px]">Batch</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[140px]">Reporting Time</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[140px]">Gate Closing</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[140px]">Exam Start</th>
                      <th className="px-6 py-4 text-sm font-bold text-left min-w-[140px]">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-accent/30" : "bg-background"} hover:bg-accent/50 transition-colors`}>
                        <td className="border-t border-border/30 px-6 py-3">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item.id)}
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-t border-border/30 px-6 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {item.course}
                          </Badge>
                        </td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm font-medium text-foreground">{item.rollNumber}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-foreground">{item.studentName}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.motherName}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.fatherName}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-foreground">{item.examCenterCode || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.pwd || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.examCenterAddress || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-foreground">{item.examDate || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.batch || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.reportingTime || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.gateClosingTime || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.examStartTime || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{item.examDuration || "-"}</td>
                      </tr>
                    ))}
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

export default StudentAdmitCardReportContent;