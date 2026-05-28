import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Users, GraduationCap, Calendar, Award, Building, MapPin, Phone, Mail, CreditCard, User, Upload, Trash2, Save, Plus } from "lucide-react";
import StudentPicker from "@/components/admin/shared/StudentPicker";
import { validateStudentSelection } from "@/components/admin/shared/validateStudentSelection";

const MakeStudentAdmitCardContent = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    course: "",
    studentRollNumber: "",
    studentName: "",
    studentMotherName: "",
    studentFatherName: "",
    examCentreCode: "",
    pwd: "",
    examCentreAddress: "",
    examDate: "",
    batch: "",
    reportingTime: "",
    gateClosingTime: "",
    examStartTime: "",
    examDuration: "",
    studentPhoto: null as File | null,
    importantNotice: "",
    instructionsNotice: ""
  });

  // Sample student data
  const [studentData] = useState([
    {
      id: 1,
      course: "ADCA",
      rollNumber: "20040",
      studentName: "Mr./श्रीGUPTESHWAR SINGH",
      motherName: "Mrs./श्रीमतीSHASHI PRABHA SINGH",
      fatherName: "Mr./श्रीRAVINDRA SINGH",
      examCentreCode: "",
      pwd: "",
      examCentreAddress: "",
      examDate: "",
      batch: "",
      reportingTime: "",
      gateClosingTime: "",
      examStartTime: "",
      examDuration: "",
      studentPhoto: ""
    },
    {
      id: 2,
      course: "ADCA",
      rollNumber: "20043",
      studentName: "Mr./श्रीChote Lal Kumar",
      motherName: "Mrs./श्रीमतीDharmi Devi",
      fatherName: "Mr./श्रीVijay Prasad",
      examCentreCode: "SM11101",
      pwd: "",
      examCentreAddress: "Jiyanpur",
      examDate: "11/06/2019",
      batch: "M004",
      reportingTime: "10:00",
      gateClosingTime: "10:30",
      examStartTime: "11:00",
      examDuration: "90 Minute",
      studentPhoto: "/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png"
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, studentPhoto: file }));
  };

  const handleSubmit = async () => {
    if (!formData.studentRollNumber || !formData.studentName || !formData.course) {
      toast({
        title: "Missing fields",
        description: "Please pick a student and ensure Name and Course are filled.",
        variant: "destructive",
      });
      return;
    }

    const check = await validateStudentSelection({
      studentId: formData.studentRollNumber,
      expectedCourse: formData.course,
    });
    if (!check.ok) {
      toast({
        title: "Validation failed",
        description: check.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Student admit card data submitted successfully!",
      variant: "default"
    });

    // Reset form
    setFormData({
      course: "",
      studentRollNumber: "",
      studentName: "",
      studentMotherName: "",
      studentFatherName: "",
      examCentreCode: "",
      pwd: "",
      examCentreAddress: "",
      examDate: "",
      batch: "",
      reportingTime: "",
      gateClosingTime: "",
      examStartTime: "",
      examDuration: "",
      studentPhoto: null,
      importantNotice: "",
      instructionsNotice: ""
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Delete",
      description: `Delete student admit card ID: ${id}`,
      variant: "destructive"
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
            <span>Make Student Admit Card</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Admit Cards</p>
                  <p className="text-3xl font-bold">{studentData.length}</p>
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
                  <p className="text-accent-foreground/80 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold">{studentData.filter(s => s.course).length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Exam Centers</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Building className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground">3</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Plus className="h-6 w-6" />
                </div>
                <span>Create New Admit Card</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Form Entry
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Student Information */}
              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Student Information</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Course</span>
                    </label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                      <SelectTrigger className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                        <SelectValue placeholder="Select Course Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADCA">Advance Diploma In Computer Application (ADCA)</SelectItem>
                        <SelectItem value="DCA">Diploma in Computer Application (DCA)</SelectItem>
                        <SelectItem value="PGDCA">Post Graduate Diploma in Computer Application (PGDCA)</SelectItem>
                        <SelectItem value="DCHN">Diploma in Computer Hardware and Networking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select Registered Student (auto-fills Name, Father, Mother, Course, Exam Centre)
                    </label>
                    <StudentPicker
                      value={formData.studentRollNumber}
                      onSelect={(s) => {
                        setFormData((prev) => ({
                          ...prev,
                          studentRollNumber: s.student_id || prev.studentRollNumber,
                          studentName: s.full_name || prev.studentName,
                          studentFatherName: s.father_name || prev.studentFatherName,
                          studentMotherName: s.mother_name || prev.studentMotherName,
                          course: s.course_name || prev.course,
                          examCentreAddress: s.study_center || prev.examCentreAddress,
                        }));
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Student Roll Number</span>
                    </label>
                    <Input
                      value={formData.studentRollNumber}
                      onChange={(e) => handleInputChange('studentRollNumber', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter student roll number"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span>Student Name</span>
                    </label>
                    <Input
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter student full name"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span>Mother's Name</span>
                    </label>
                    <Input
                      value={formData.studentMotherName}
                      onChange={(e) => handleInputChange('studentMotherName', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter mother's name"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span>Father's Name</span>
                    </label>
                    <Input
                      value={formData.studentFatherName}
                      onChange={(e) => handleInputChange('studentFatherName', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter father's name"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Exam Information */}
              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <span>Examination Details</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <Building className="h-4 w-4" />
                      <span>Exam Centre Code</span>
                    </label>
                    <Input
                      value={formData.examCentreCode}
                      onChange={(e) => handleInputChange('examCentreCode', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter exam center code"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <Award className="h-4 w-4" />
                      <span>PWD Status</span>
                    </label>
                    <Input
                      value={formData.pwd}
                      onChange={(e) => handleInputChange('pwd', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter PWD status (if applicable)"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>Exam Centre Address</span>
                    </label>
                    <Input
                      value={formData.examCentreAddress}
                      onChange={(e) => handleInputChange('examCentreAddress', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter exam center address"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Exam Date</span>
                    </label>
                    <Input
                      value={formData.examDate}
                      onChange={(e) => handleInputChange('examDate', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="DD/MM/YYYY"
                      type="date"
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span>Batch</span>
                    </label>
                    <Input
                      value={formData.batch}
                      onChange={(e) => handleInputChange('batch', e.target.value)}
                      className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter batch number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Schedule Section */}
            <div className="mt-8 border-t border-border/40 pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Time Schedule</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Reporting Time</label>
                  <Input
                    value={formData.reportingTime}
                    onChange={(e) => handleInputChange('reportingTime', e.target.value)}
                    className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="HH:MM"
                    type="time"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Gate Closing Time</label>
                  <Input
                    value={formData.gateClosingTime}
                    onChange={(e) => handleInputChange('gateClosingTime', e.target.value)}
                    className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="HH:MM"
                    type="time"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Exam Start Time</label>
                  <Input
                    value={formData.examStartTime}
                    onChange={(e) => handleInputChange('examStartTime', e.target.value)}
                    className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="HH:MM"
                    type="time"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Exam Duration</label>
                  <Input
                    value={formData.examDuration}
                    onChange={(e) => handleInputChange('examDuration', e.target.value)}
                    className="w-full h-12 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                    placeholder="e.g., 90 Minutes"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mt-8 border-t border-border/40 pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>Student Photo Upload</span>
              </h3>
              
              <div className="border-2 border-dashed border-border/40 bg-accent/10 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-center">
                  <label className="cursor-pointer flex flex-col items-center space-y-2">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Choose Student Photo</span>
                    <span className="text-xs text-muted-foreground">
                      {formData.studentPhoto ? formData.studentPhoto.name : "No file chosen"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Notices Section */}
            <div className="mt-8 border-t border-border/40 pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Notices & Instructions</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Important Notice</label>
                  <Textarea
                    value={formData.importantNotice}
                    onChange={(e) => handleInputChange('importantNotice', e.target.value)}
                    className="w-full h-32 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                    placeholder="Enter important notice for students..."
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Instructions Notice</label>
                  <Textarea
                    value={formData.instructionsNotice}
                    onChange={(e) => handleInputChange('instructionsNotice', e.target.value)}
                    className="w-full h-32 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                    placeholder="Enter exam instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-8 border-t border-border/40 text-center">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-2" />
                Submit Admit Card Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 text-secondary-foreground p-6">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Users className="h-5 w-5" />
              </div>
              <span>Existing Admit Cards ({studentData.length})</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/40">
                    <th className="text-left p-4 font-semibold text-foreground min-w-[100px]">Actions</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[100px]">Course</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Roll Number</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[180px]">Student Name</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[160px]">Mother's Name</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[160px]">Father's Name</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Center Code</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[80px]">PWD</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[180px]">Center Address</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Exam Date</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[100px]">Batch</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Reporting Time</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Gate Closing</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Exam Start</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[120px]">Duration</th>
                    <th className="text-left p-4 font-semibold text-foreground min-w-[100px]">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((item, index) => (
                    <tr key={item.id} className={`border-b border-border/20 hover:bg-accent/10 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-medium">
                          {item.course}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-foreground">{item.rollNumber}</td>
                      <td className="p-4 text-foreground">{item.studentName}</td>
                      <td className="p-4 text-muted-foreground">{item.motherName}</td>
                      <td className="p-4 text-muted-foreground">{item.fatherName}</td>
                      <td className="p-4 text-muted-foreground">{item.examCentreCode || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.pwd || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.examCentreAddress || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.examDate || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.batch || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.reportingTime || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.gateClosingTime || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.examStartTime || "-"}</td>
                      <td className="p-4 text-muted-foreground">{item.examDuration || "-"}</td>
                      <td className="p-4">
                        <div className="w-16 h-12 border border-border/40 bg-muted/20 rounded overflow-hidden">
                          {item.studentPhoto ? (
                            <img 
                              src={item.studentPhoto} 
                              alt="Student" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MakeStudentAdmitCardContent;