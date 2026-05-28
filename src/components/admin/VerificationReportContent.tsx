import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, FileText, Users, GraduationCap, Award, MapPin, User, Calendar, Image, FileCheck, Download, Printer, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerificationReportContent = () => {
  const { toast } = useToast();

  // Sample student verification report data based on the screenshot
  const [students] = useState([
    {
      id: 1,
      state: "Delhi",
      district: "PHASE1",
      centerCode: "123",
      enrollmentNo: "455",
      dob: "12/12/2018",
      name: "VIVEK",
      courseName: "Diploma in Computer Application",
      photo: "~/Offer_pic/adchn.jpg",
      certificate: "~/Offer_pic/alison_courseware_intro_599.jpg",
      marksheet: "~/Offer_pic/refrigeration-and-air-conditioning.jpg"
    },
    {
      id: 2,
      state: "Uttar Pradesh",
      district: "Azamgarh",
      centerCode: "",
      enrollmentNo: "",
      dob: "",
      name: "",
      courseName: "ADCA",
      photo: "~/Offer_pic/",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/"
    },
    {
      id: 3,
      state: "Uttar Pradesh",
      district: "Mau",
      centerCode: "SM11101",
      enrollmentNo: "20070",
      dob: "12/08/2007",
      name: "Vineet Pandey",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/VINEET PANDEY.jpg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/vineet pandey adca.pdf"
    },
    {
      id: 4,
      state: "Uttar Pradesh",
      district: "Mau",
      centerCode: "SM11101",
      enrollmentNo: "20051",
      dob: "07/07/1998",
      name: "Km Jyoti",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/jyoti photo.jpg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/jyoti marksheet.pdf"
    },
    {
      id: 5,
      state: "0",
      district: "Azamgarh",
      centerCode: "SM11101",
      enrollmentNo: "20072",
      dob: "",
      name: "Ranvijay Yadav",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/"
    },
    {
      id: 6,
      state: "Uttar Pradesh",
      district: "Mau",
      centerCode: "SM11101",
      enrollmentNo: "20074",
      dob: "14/03/2002",
      name: "ADITYA KUMAR",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/ADITYA.jpeg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/ar.pdf"
    },
    {
      id: 7,
      state: "Uttar Pradesh",
      district: "AMBEDAKAR NAGAR",
      centerCode: "SM11101",
      enrollmentNo: "BSOFT300375",
      dob: "05/07/1988",
      name: "SURABHI SINGH",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/SURABHI SINGH.jpeg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/SURABHI.pdf"
    },
    {
      id: 8,
      state: "Uttar Pradesh",
      district: "Azamgarh",
      centerCode: "SM11101",
      enrollmentNo: "20085",
      dob: "12/11/2000",
      name: "Shrinath Yadav",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/shrinath.jpeg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/shrinath.pdf"
    },
    {
      id: 9,
      state: "Uttar Pradesh",
      district: "Mau",
      centerCode: "SM11101",
      enrollmentNo: "20098",
      dob: "03/01/2005",
      name: "BAJARANGI RAJBHAR",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/bajrangi.jpeg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/"
    },
    {
      id: 10,
      state: "Uttar Pradesh",
      district: "Mau",
      centerCode: "SM11101",
      enrollmentNo: "200104",
      dob: "02/02/2003",
      name: "ROSHAN RAJBHAR",
      courseName: "Advance Diploma In Computer Application (ADCA)",
      photo: "~/Offer_pic/roshan rajbhar.jpeg",
      certificate: "~/Offer_pic/",
      marksheet: "~/Offer_pic/ROSHAN.pdf"
    }
  ]);

  const handleEdit = (studentId: number) => {
    toast({
      title: "Edit Student",
      description: `Opening edit form for student ID ${studentId}`,
      variant: "default"
    });
  };

  const handleDelete = (studentId: number) => {
    toast({
      title: "Delete Student",
      description: `Delete action for student ID ${studentId}`,
      variant: "destructive"
    });
  };

  const referenceNumber = "1234567";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <span>Verification Report</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
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
                  <p className="text-accent-foreground/80 text-sm font-medium">Verified Students</p>
                  <p className="text-3xl font-bold">{students.filter(s => s.enrollmentNo && s.name).length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Courses</p>
                  <p className="text-3xl font-bold">{new Set(students.map(s => s.courseName)).size}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Districts</p>
                  <p className="text-3xl font-bold text-foreground">{new Set(students.map(s => s.district)).size}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <MapPin className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Report Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <span>Student Verification Report ({students.length} records)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[1800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          State
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          District
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[140px]">Center Code</th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[150px]">Enrollment No</th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          DOB
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[160px]">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Student Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[300px]">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Course Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Photo
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4" />
                          Certificate
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-4 py-4 text-sm font-bold text-left min-w-[250px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Marksheet
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={`${index % 2 === 0 ? "bg-background/80" : "bg-accent/5"} hover:bg-accent/20 transition-colors duration-200 border-b border-border/30`}>
                        <td className="border-r border-border/30 px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="font-medium text-primary">{student.state}</span>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student.id)}
                              className="text-primary hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Edit Student"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Delete Student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm font-medium">{student.district}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm font-mono">{student.centerCode}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm font-mono text-blue-600">{student.enrollmentNo}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm">{student.dob}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm font-medium text-green-600">{student.name}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm">{student.courseName}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm text-muted-foreground break-all">{student.photo}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm text-muted-foreground break-all">{student.certificate}</td>
                        <td className="border-r border-border/30 px-4 py-4 text-sm text-muted-foreground break-all">{student.marksheet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Number Footer */}
        <Card className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-elegant border-0">
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-background/20 rounded-full">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/80 font-medium">Report Reference Number</p>
                <p className="text-3xl font-bold tracking-wider mt-1">{referenceNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-6 py-3">
                <Share className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="border-border/40 hover:bg-accent/20 shadow-md px-6 py-3">
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
              <Button variant="outline" className="border-border/40 hover:bg-accent/20 shadow-md px-6 py-3">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationReportContent;