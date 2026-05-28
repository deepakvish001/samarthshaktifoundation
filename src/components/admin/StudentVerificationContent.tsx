import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Edit, Trash2, Loader2, Plus, Search, Filter, CheckCircle, XCircle, Clock, Users, FileCheck, AlertCircle, User, MapPin, GraduationCap, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface StudentVerification {
  id: string;
  state: string;
  district: string;
  center_code: string;
  enrollment_no: string;
  student_name: string;
  father_name: string;
  course_name: string;
  rank_or_marks?: string;
  course_duration?: string;
  date_of_birth?: string;
  admission_date?: string;
  photo_url?: string;
  marksheet_url?: string;
  certificate_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verification_date?: string;
}

const StudentVerificationContent = () => {
  const {
    data: verifications,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<StudentVerification>({ 
    tableName: 'student_verifications',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'student_verifications'
  });
  
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    centerCode: "",
    enrollmentNo: "",
    studentName: "",
    fatherName: "",
    courseName: "",
    rankOrMarks: "",
    courseDuration: "",
    dateOfBirth: "",
    admissionDate: "",
    photoFile: null as File | null,
    marksheetFile: null as File | null,
    certificateFile: null as File | null
  });

  const [editingVerification, setEditingVerification] = useState<StudentVerification | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['state', 'district', 'centerCode', 'enrollmentNo', 'studentName', 'fatherName', 'courseName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingVerification) {
        await update(editingVerification.id, {
          state: formData.state,
          district: formData.district,
          center_code: formData.centerCode,
          enrollment_no: formData.enrollmentNo,
          student_name: formData.studentName,
          father_name: formData.fatherName,
          course_name: formData.courseName,
          rank_or_marks: formData.rankOrMarks || undefined,
          course_duration: formData.courseDuration || undefined,
          date_of_birth: formData.dateOfBirth || undefined,
          admission_date: formData.admissionDate || undefined,
          photo_url: formData.photoFile ? formData.photoFile.name : undefined,
          marksheet_url: formData.marksheetFile ? formData.marksheetFile.name : undefined,
          certificate_url: formData.certificateFile ? formData.certificateFile.name : undefined
        });
        toast.success("Verification updated successfully!");
      } else {
        await create({
          state: formData.state,
          district: formData.district,
          center_code: formData.centerCode,
          enrollment_no: formData.enrollmentNo,
          student_name: formData.studentName,
          father_name: formData.fatherName,
          course_name: formData.courseName,
          rank_or_marks: formData.rankOrMarks || null,
          course_duration: formData.courseDuration || null,
          date_of_birth: formData.dateOfBirth || null,
          admission_date: formData.admissionDate || null,
          photo_url: formData.photoFile ? formData.photoFile.name : null,
          marksheet_url: formData.marksheetFile ? formData.marksheetFile.name : null,
          certificate_url: formData.certificateFile ? formData.certificateFile.name : null,
          status: 'pending'
        });
        toast.success("Student verification submitted successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingVerification ? 'update' : 'submit'} verification`);
    }
  };

  const handleEdit = (verification: StudentVerification) => {
    setEditingVerification(verification);
    setFormData({
      state: verification.state,
      district: verification.district,
      centerCode: verification.center_code,
      enrollmentNo: verification.enrollment_no,
      studentName: verification.student_name,
      fatherName: verification.father_name,
      courseName: verification.course_name,
      rankOrMarks: verification.rank_or_marks || "",
      courseDuration: verification.course_duration || "",
      dateOfBirth: verification.date_of_birth || "",
      admissionDate: verification.admission_date || "",
      photoFile: null,
      marksheetFile: null,
      certificateFile: null
    });
  };

  const handleReset = () => {
    setEditingVerification(null);
    setFormData({
      state: "",
      district: "",
      centerCode: "",
      enrollmentNo: "",
      studentName: "",
      fatherName: "",
      courseName: "",
      rankOrMarks: "",
      courseDuration: "",
      dateOfBirth: "",
      admissionDate: "",
      photoFile: null,
      marksheetFile: null,
      certificateFile: null
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this verification?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Verification deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete verification");
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      await update(id, {
        status: status,
        verified_by: status !== 'pending' ? 'Admin' : undefined,
        verification_date: status !== 'pending' ? new Date().toISOString() : undefined
      });
      toast.success(`Verification status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Filter and search functionality
  const filteredVerifications = useMemo(() => {
    let filtered = verifications || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.enrollment_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    return filtered;
  }, [verifications, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading verifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Student Verification Portal</h1>
              <p className="text-primary-foreground/80">Verify and manage student credentials efficiently</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-lg font-semibold mb-2">New Verification</h3>
              <p className="text-blue-100 text-sm">Submit a new student verification request</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-lg font-semibold mb-2">Search Records</h3>
              <p className="text-green-100 text-sm">Find and verify existing student records</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-purple-200" />
              <h3 className="text-lg font-semibold mb-2">Bulk Verify</h3>
              <p className="text-purple-100 text-sm">Process multiple verifications at once</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="bg-card/50 backdrop-blur border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{verifications?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{verifications?.filter(v => v.status === 'verified').length || 0}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{verifications?.filter(v => v.status === 'pending').length || 0}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{verifications?.filter(v => v.status === 'rejected').length || 0}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Verification Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {editingVerification ? 'Edit Verification Request' : 'Student Verification Form'}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Complete all sections to submit your verification request</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Step 1 of 3</div>
                <div className="w-32 h-2 bg-muted rounded-full mt-1">
                  <div className="w-1/3 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-primary/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Student Full Name
                    </label>
                    <Input
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      placeholder="Enter student's complete name"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">As per official documents</div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Father's Name
                    </label>
                    <Input
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      placeholder="Enter father's complete name"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-green-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Location & Center Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      State
                    </label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl">
                        <SelectItem value="Uttar Pradesh">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            Uttar Pradesh
                          </div>
                        </SelectItem>
                        <SelectItem value="Bihar">Bihar</SelectItem>
                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      District
                    </label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                      <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm">
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl">
                        <SelectItem value="Azamgarh">Azamgarh</SelectItem>
                        <SelectItem value="Mau">Mau</SelectItem>
                        <SelectItem value="Baliya">Baliya</SelectItem>
                        <SelectItem value="Hardoi">Hardoi</SelectItem>
                        <SelectItem value="Lucknow">Lucknow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Training Center Code
                    </label>
                    <Input
                      value={formData.centerCode}
                      onChange={(e) => handleInputChange('centerCode', e.target.value)}
                      placeholder="e.g., SM11101"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Check with your training center</div>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-purple-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Academic Credentials</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Enrollment Number
                    </label>
                    <Input
                      value={formData.enrollmentNo}
                      onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                      placeholder="Enter enrollment number"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Course Program
                    </label>
                    <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                      <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm">
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl">
                        <SelectItem value="Diploma in Computer Application (DCA)">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                            DCA - Diploma in Computer Application
                          </div>
                        </SelectItem>
                        <SelectItem value="Advance Diploma in Computer Application (ADCA)">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                            ADCA - Advanced Diploma in Computer Application
                          </div>
                        </SelectItem>
                        <SelectItem value="Post Graduate Diploma in Computer Application (PGDCA)">PGDCA - Post Graduate Diploma</SelectItem>
                        <SelectItem value="Diploma in Computer Hardware and Networking">Hardware & Networking</SelectItem>
                        <SelectItem value="Web Design & Development">Web Design & Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Course Duration
                    </label>
                    <Input
                      value={formData.courseDuration}
                      onChange={(e) => handleInputChange('courseDuration', e.target.value)}
                      placeholder="e.g., 1 Year, 6 Months"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Performance/Marks
                    </label>
                    <Input
                      value={formData.rankOrMarks}
                      onChange={(e) => handleInputChange('rankOrMarks', e.target.value)}
                      placeholder="e.g., First Class, 85%, A Grade"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Admission Date
                    </label>
                    <Input
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-orange-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Document Attachments</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">Optional</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Student Photo</label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">Upload Photo</div>
                        <div className="text-xs text-muted-foreground">JPG, PNG (Max 2MB)</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Certificate/Marksheet</label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <FileCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-sm text-muted-foreground">Upload Document</div>
                        <div className="text-xs text-muted-foreground">PDF, JPG (Max 5MB)</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">ID Proof</label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-sm text-muted-foreground">Upload ID</div>
                        <div className="text-xs text-muted-foreground">Aadhar, PAN, Passport</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  All information will be securely stored and verified
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="border-2 hover:bg-accent/50 px-6 py-3 h-12 hover-scale"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  {editingVerification && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-2 hover:bg-red-50 text-red-600 border-red-200 px-6 py-3 h-12 hover-scale"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Edit
                    </Button>
                  )}

                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 h-12 shadow-lg hover-scale"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    {editingVerification ? 'Update Verification' : 'Submit for Verification'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Search and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Quick Search */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-fade-in">
            <CardHeader className="border-b border-border bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">Advanced Verification Lookup</span>
                  <p className="text-sm text-muted-foreground font-normal">Search and verify student credentials instantly</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search by enrollment number, student name, or center code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-14 text-base shadow-sm"
                  />
                  <Button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 bg-gradient-to-r from-primary to-primary/80 hover-scale"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-xl">
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          All Status
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Pending Review
                        </div>
                      </SelectItem>
                      <SelectItem value="verified">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Verified ✓
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Rejected ✗
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 shadow-sm">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Course Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-xl">
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="dca">DCA</SelectItem>
                      <SelectItem value="adca">ADCA</SelectItem>
                      <SelectItem value="pgdca">PGDCA</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 shadow-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-xl">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                      <SelectItem value="bihar">Bihar</SelectItem>
                      <SelectItem value="mp">Madhya Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-2 hover-scale">
                    <Clock className="h-3 w-3 mr-1" />
                    Recent
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 hover-scale">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 hover-scale">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 hover-scale">
                    <FileText className="h-3 w-3 mr-1" />
                    Export Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activities */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-fade-in">
            <CardHeader className="border-b border-border bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold">Live Activity Feed</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Real-time updates</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredVerifications.slice(0, 5).map((verification, index) => (
                  <div key={verification.id} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md hover-scale cursor-pointer animate-fade-in ${
                    verification.status === 'verified' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                    verification.status === 'rejected' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                    'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-foreground">{verification.student_name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{verification.enrollment_no}</div>
                        <div className="text-xs text-muted-foreground">{verification.course_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {verification.district}, {verification.state}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(verification.status)}
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                            verification.status === 'verified' ? 'bg-green-100 text-green-700' :
                            verification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {verification.status}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs hover-scale"
                          onClick={() => handleEdit(verification)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Quick Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredVerifications.length === 0 && (
                  <div className="text-center py-8 space-y-3">
                    <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">No Activity Yet</h3>
                      <p className="text-sm text-muted-foreground">Recent verification requests will appear here</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover-scale">
                      <Plus className="h-3 w-3 mr-1" />
                      Create First Request
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Records Summary */}
        {filteredVerifications.length > 0 && (
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <span>Verification Records ({filteredVerifications.length})</span>
                </div>
                <Button variant="outline" className="border-2 hover-scale">
                  <FileText className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredVerifications.map((verification, index) => (
                  <div key={verification.id} className={`p-6 rounded-xl border-2 transition-all hover:shadow-md hover-scale ${
                    verification.status === 'verified' ? 'bg-green-50 border-green-200' :
                    verification.status === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold text-lg text-foreground">{verification.student_name}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(verification.status)}
                            {getStatusBadge(verification.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Enrollment:</span>
                            <div className="font-mono font-medium text-blue-600">{verification.enrollment_no}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Course:</span>
                            <div className="font-medium text-green-600">{verification.course_name}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div className="font-medium">{verification.state}, {verification.district}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Center:</span>
                            <div className="font-mono">{verification.center_code}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(verification)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={verification.status}
                          onValueChange={(value) => handleStatusChange(verification.id, value as any)}
                        >
                          <SelectTrigger className="w-32 border-2 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border shadow-xl">
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-yellow-600" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="verified">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                Verified
                              </div>
                            </SelectItem>
                            <SelectItem value="rejected">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-3 w-3 text-red-600" />
                                Rejected
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(verification.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentVerificationContent;