import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Edit, Trash2, Loader2, Plus, Search, Calendar, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { AdminPresenceIndicator } from "@/components/admin/AdminPresenceIndicator";
import StudentPicker from "@/components/admin/shared/StudentPicker";
import { validateStudentSelection } from "@/components/admin/shared/validateStudentSelection";

interface CertificateManagement {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  certificate_number: string;
  issue_date: string;
  completion_date?: string;
  grade?: string;
  certificate_type: string;
  status: string;
  certificate_url?: string;
}

const CertificateManagementContent = () => {
  const {
    data: certificates,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<CertificateManagement>({ 
    tableName: 'certificate_management',
    orderBy: { column: 'issue_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'certificate_management'
  });

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    courseName: "",
    certificateNumber: "",
    issueDate: "",
    completionDate: "",
    grade: "",
    certificateType: "course_completion",
    status: "active"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [editingCertificate, setEditingCertificate] = useState<CertificateManagement | null>(null);

  const handleEdit = (certificate: CertificateManagement) => {
    setEditingCertificate(certificate);
    setFormData({
      studentId: certificate.student_id,
      studentName: certificate.student_name,
      courseName: certificate.course_name,
      certificateNumber: certificate.certificate_number,
      issueDate: certificate.issue_date,
      completionDate: certificate.completion_date || "",
      grade: certificate.grade || "",
      certificateType: certificate.certificate_type,
      status: certificate.status
    });
  };

  const handleUpdate = async () => {
    if (!editingCertificate) return;
    
    if (!formData.studentId || !formData.studentName || !formData.courseName || !formData.certificateNumber) {
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

    try {
      await update(editingCertificate.id, {
        student_id: formData.studentId,
        student_name: formData.studentName,
        course_name: formData.courseName,
        certificate_number: formData.certificateNumber,
        issue_date: formData.issueDate,
        completion_date: formData.completionDate || null,
        grade: formData.grade || null,
        certificate_type: formData.certificateType,
        status: formData.status
      });

      setEditingCertificate(null);
      handleReset();
      toast.success("Certificate updated successfully!");
    } catch (error) {
      toast.error("Failed to update certificate");
    }
  };

  const handleSubmit = async () => {
    if (editingCertificate) {
      await handleUpdate();
      return;
    }

    if (!formData.studentId || !formData.studentName || !formData.courseName || !formData.certificateNumber) {
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

    try {
      await create({
        student_id: formData.studentId,
        student_name: formData.studentName,
        course_name: formData.courseName,
        certificate_number: formData.certificateNumber,
        issue_date: formData.issueDate,
        completion_date: formData.completionDate || null,
        grade: formData.grade || null,
        certificate_type: formData.certificateType,
        status: formData.status
      });

      handleReset();
      toast.success("Certificate created successfully!");
    } catch (error) {
      toast.error("Failed to create certificate");
    }
  };

  const handleReset = () => {
    setFormData({
      studentId: "",
      studentName: "",
      courseName: "",
      certificateNumber: "",
      issueDate: "",
      completionDate: "",
      grade: "",
      certificateType: "course_completion",
      status: "active"
    });
    setEditingCertificate(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete certificate");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Statistics calculations
  const totalCertificates = certificates?.length || 0;
  const activeCertificates = certificates?.filter(cert => cert.status === 'active').length || 0;
  const pendingCertificates = certificates?.filter(cert => cert.status === 'pending').length || 0;
  const thisMonthCertificates = certificates?.filter(cert => {
    const certDate = new Date(cert.issue_date);
    const currentMonth = new Date().getMonth();
    return certDate.getMonth() === currentMonth;
  }).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <span>Certificate Management</span>
          </h1>
          <AdminPresenceIndicator 
            currentSection="certificate-management" 
            showSectionUsers={true}
          />
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Certificates</p>
                  <p className="text-3xl font-bold">{totalCertificates}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Active Certificates</p>
                  <p className="text-3xl font-bold">{activeCertificates}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Pending Certificates</p>
                  <p className="text-3xl font-bold">{pendingCertificates}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-foreground">{thisMonthCertificates}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Certificate Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Plus className="h-6 w-6" />
              </div>
              <span>{editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}</span>
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
                Picking a student auto-fills ID, Name and Course. You can still override below.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student ID*</label>
                <Input
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student Name*</label>
                <Input
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Name*</label>
                <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="ADCA" className="hover:bg-accent/50">ADCA</SelectItem>
                    <SelectItem value="DCA" className="hover:bg-accent/50">DCA</SelectItem>
                    <SelectItem value="PGDCA" className="hover:bg-accent/50">PGDCA</SelectItem>
                    <SelectItem value="BCA" className="hover:bg-accent/50">BCA</SelectItem>
                    <SelectItem value="MCA" className="hover:bg-accent/50">MCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Certificate Number*</label>
                <Input
                  value={formData.certificateNumber}
                  onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter certificate number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Issue Date</label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Completion Date</label>
                <Input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => handleInputChange('completionDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Grade</label>
                <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="A+" className="hover:bg-accent/50">A+</SelectItem>
                    <SelectItem value="A" className="hover:bg-accent/50">A</SelectItem>
                    <SelectItem value="B+" className="hover:bg-accent/50">B+</SelectItem>
                    <SelectItem value="B" className="hover:bg-accent/50">B</SelectItem>
                    <SelectItem value="C" className="hover:bg-accent/50">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Certificate Type</label>
                <Select value={formData.certificateType} onValueChange={(value) => handleInputChange('certificateType', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="course_completion" className="hover:bg-accent/50">Course Completion</SelectItem>
                    <SelectItem value="excellence" className="hover:bg-accent/50">Excellence</SelectItem>
                    <SelectItem value="participation" className="hover:bg-accent/50">Participation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="active" className="hover:bg-accent/50">Active</SelectItem>
                    <SelectItem value="inactive" className="hover:bg-accent/50">Inactive</SelectItem>
                    <SelectItem value="pending" className="hover:bg-accent/50">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                <Plus className="h-5 w-5 mr-2" />
                {editingCertificate ? "Update Certificate" : "Create Certificate"}
              </Button>
              {editingCertificate && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-border/40 hover:bg-accent/20 px-8"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificates Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Award className="h-6 w-6" />
                </div>
                <span>Certificate Records ({totalCertificates})</span>
              </div>
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">Student ID</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">Student Name</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">Course</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">Certificate No.</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">Issue Date</th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[80px]">Grade</th>
                      <th className="px-6 py-4 text-sm font-bold text-left min-w-[100px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates?.map((certificate, index) => (
                      <tr key={certificate.id} className={`${index % 2 === 0 ? "bg-accent/30" : "bg-background"} hover:bg-accent/50 transition-colors`}>
                        <td className="border-t border-border/30 px-6 py-3">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(certificate)}
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(certificate.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm font-medium text-foreground">{certificate.student_id}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-foreground">{certificate.student_name}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{certificate.course_name}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{certificate.certificate_number}</td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">
                          {certificate.issue_date ? new Date(certificate.issue_date).toLocaleDateString() : "-"}
                        </td>
                        <td className="border-t border-border/30 px-6 py-3 text-sm text-muted-foreground">{certificate.grade || "-"}</td>
                        <td className="border-t border-border/30 px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            certificate.status === 'active' ? 'bg-green-100 text-green-800' :
                            certificate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {certificate.status}
                          </span>
                        </td>
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

export default CertificateManagementContent;