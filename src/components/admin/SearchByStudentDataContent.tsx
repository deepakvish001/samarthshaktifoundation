import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, UserCheck, GraduationCap, Phone, Mail, MapPin, Calendar, FileText, User, Award, Eye } from "lucide-react";

const SearchByStudentDataContent = () => {
  const { toast } = useToast();
  
  const [studentId, setStudentId] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Sample comprehensive student data based on the screenshots
  const sampleStudentData = [
    {
      id: 1,
      applicant_name: "Mr./श्री Vivek",
      father_name: "Mr./श्री गगगजग",
      mother: "Mrs./श्रीमती gytytgfgff",
      gender: "Male",
      dob: "03/05/1990",
      category: "NULL",
      occupation: "NULL",
      phone_std: "+918840908715",
      mobile: "+918840908715",
      email: "technical@gmail.com",
      address: "Hardoi",
      city_name: "Hardoi",
      state: "Uttar Pradesh",
      district: "Hardoi",
      pincode: "221090",
      qualification: "B.A.",
      passing_year: "2009",
      applied_as: "Student",
      course_category: "Computer Course",
      course_name: "Diploma in Computer Application (DCA)",
      course_fees: "14500",
      franchise_center_name: "Institute of Computer Training Centre, Numaish Chauraha, Hardoi",
      franchise_id: "UP/HDI/ICTC/0002",
      aadhar_number: "543456456646565654",
      photo: "~/Offer_pic/P.jpg",
      signature: "~/Offer_pic/S.jpg",
      thumb_impression: "~/Offer_pic/T.jpg",
      student_id: "TCI/HDI/ADCA/1",
      student_password: "58741",
      approve: false,
      status: "NULL",
      payment: "NULL"
    },
    {
      id: 2,
      applicant_name: "Mr./श्री VIVEK YADAV",
      father_name: "Mr./श्री NA",
      mother: "Mrs./श्रीमती NA",
      gender: "Male",
      dob: "12/07/2020",
      category: "General/सामान्य",
      occupation: "20/10/1997",
      phone_std: "",
      mobile: "+919690283407",
      email: "AS@GMAIL.COM",
      address: "LUCKNOW",
      city_name: "LUCKNOW",
      state: "UP",
      district: "Azamgarh",
      pincode: "223223",
      qualification: "Other",
      passing_year: "2029",
      applied_as: "",
      course_category: "12 Month",
      course_name: "Diploma in Computer Application",
      course_fees: "6000",
      franchise_center_name: "Ravi Kumar Gupta",
      franchise_id: "SM11101",
      aadhar_number: "343546546534355645",
      photo: "~/Offer_pic/599-5990202_rm-clipart copy.jpg",
      signature: "",
      thumb_impression: "",
      student_id: "",
      student_password: "",
      approve: false,
      status: "",
      payment: ""
    },
    {
      id: 3,
      applicant_name: "Mr./ Aurangzeb Ahmad",
      father_name: "Mr./ Ajaj Ahmad",
      mother: "Mrs./ Farzana",
      gender: "Male",
      dob: "09/07/1998",
      category: "General/सामान्य",
      occupation: "20/09/2020",
      phone_std: "",
      mobile: "+919794224055",
      email: "sr920111@gmail.com",
      address: "bachhuapar",
      city_name: "azamgarh",
      state: "Uttar Pradesh",
      district: "",
      pincode: "276141",
      qualification: "10th Pass",
      passing_year: "2010",
      applied_as: "",
      course_category: "",
      course_name: "Diploma in Computer Hardware and Networking",
      course_fees: "15000",
      franchise_center_name: "",
      franchise_id: "SM11101",
      aadhar_number: "539177029237",
      photo: "~/Offer_pic/",
      signature: "~/Offer_pic/",
      thumb_impression: "~/Offer_pic/",
      student_id: "",
      student_password: "",
      approve: false,
      status: "",
      payment: ""
    }
  ];

  const handleSearch = () => {
    if (!studentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Student ID to search",
        variant: "destructive"
      });
      return;
    }

    // Simulate search - in real app this would be an API call
    const results = sampleStudentData.filter(student => 
      student.id.toString().includes(studentId) || 
      student.student_id.includes(studentId) ||
      student.applicant_name.toLowerCase().includes(studentId.toLowerCase())
    );

    if (results.length === 0) {
      // If no exact match, show all sample data for demo
      setSearchResults(sampleStudentData);
    } else {
      setSearchResults(results);
    }
    
    setShowResults(true);
    
    toast({
      title: "Search Complete",
      description: `Found ${results.length || sampleStudentData.length} student record(s)`,
      variant: "default"
    });
  };

  const handleApprovalChange = (studentId: number, approved: boolean) => {
    setSearchResults(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, approve: approved }
          : student
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <span>Search By Student Data</span>
          </h1>
        </div>

        {/* Home Link */}
        <div className="flex items-center gap-2">
          <a href="/admin" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors">
            <Eye className="h-4 w-4" />
            Home
          </a>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{sampleStudentData.length}</p>
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
                  <p className="text-accent-foreground/80 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold">{sampleStudentData.filter(s => s.approve).length}</p>
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">Courses</p>
                  <p className="text-3xl font-bold">{new Set(sampleStudentData.map(s => s.course_name)).size}</p>
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
                  <p className="text-muted-foreground/80 text-sm font-medium">Search Results</p>
                  <p className="text-3xl font-bold text-foreground">{showResults ? searchResults.length : 0}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Search className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Search className="h-6 w-6" />
              </div>
              <span>Student Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">
                  Student ID
                </label>
              </div>
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID, Name, or Number"
                    className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        {showResults && (
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Search Results ({searchResults.length} students found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg bg-background/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[3000px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[50px]">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            ID
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[180px]">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Applicant Name
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[150px]">Father Name</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[150px]">Mother Name</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[80px]">Gender</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            DOB
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">Category</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">Occupation</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            Phone STD
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            Mobile
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[200px]">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Address
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">City</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[100px]">State</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[100px]">District</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[100px]">Pincode</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            Qualification
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[130px]">Passing Year</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">Applied As</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[150px]">Course Category</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[220px]">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Course Name
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[120px]">Course Fees</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[280px]">Franchise Center</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">Franchise ID</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[170px]">Aadhar Number</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[220px]">Photo</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">Signature</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[160px]">Thumb Impression</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[140px]">Student ID</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[160px]">Student Password</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-center min-w-[100px]">
                          <div className="flex items-center justify-center gap-1">
                            <UserCheck className="h-4 w-4" />
                            Approve
                          </div>
                        </th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[100px]">Status</th>
                        <th className="border border-border px-3 py-3 text-sm font-semibold text-left min-w-[100px]">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((student, index) => (
                        <tr key={student.id} className={`${index % 2 === 0 ? "bg-background/80" : "bg-accent/5"} hover:bg-accent/20 transition-colors duration-200 border-b border-border/30`}>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-medium">{student.id}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-medium text-primary">{student.applicant_name}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.father_name}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.mother}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.gender}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.dob}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.category}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.occupation}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.phone_std}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-medium text-blue-600">{student.mobile}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm text-blue-600">{student.email}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.address}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.city_name}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.state}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.district}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.pincode}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-medium">{student.qualification}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.passing_year}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.applied_as}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.course_category}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-medium text-green-600">{student.course_name}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-bold text-orange-600">₹{student.course_fees}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.franchise_center_name}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-mono">{student.franchise_id}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-mono">{student.aadhar_number}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm text-muted-foreground">{student.photo}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm text-muted-foreground">{student.signature}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm text-muted-foreground">{student.thumb_impression}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-mono">{student.student_id}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm font-mono">{student.student_password}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-center">
                            <Checkbox
                              checked={student.approve}
                              onCheckedChange={(checked) => handleApprovalChange(student.id, checked as boolean)}
                              className="w-5 h-5"
                            />
                          </td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.status}</td>
                          <td className="border-r border-border/30 px-3 py-3 text-sm">{student.payment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!showResults && (
          <Card className="shadow-lg border-0 bg-card/30 backdrop-blur">
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Search</h3>
              <p className="text-muted-foreground">Enter a Student ID, Name, or any identifier and click Search to find student records</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchByStudentDataContent;