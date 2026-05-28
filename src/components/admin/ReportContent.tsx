import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, Search, Download, Edit, Trash2, Loader2, BarChart3, BookOpen, CheckCircle, Filter, Award } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { downloadSavedPdf } from "@/lib/reportPdfGenerator";

interface CertificateMarksheet {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  certificate_url?: string;
  marksheet_url?: string;
  issue_date: string;
  status: 'issued' | 'pending' | 'verified';
}

const ReportContent = () => {
  const {
    data: reports,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<CertificateMarksheet>({ 
    tableName: 'certificate_management',
    orderBy: { column: 'issue_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'certificate_management'
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter and search logic
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = !searchTerm || 
        report.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.course_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || report.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, filterStatus]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const verifiedReports = reports.filter(r => r.status === 'verified').length;
    const issuedReports = reports.filter(r => r.status === 'issued').length;
    const uniqueCourses = new Set(reports.map(r => r.course_name)).size;

    return {
      total: totalReports,
      verified: verifiedReports,
      issued: issuedReports,
      courses: uniqueCourses,
      filtered: filteredReports.length
    };
  }, [reports, filteredReports]);

  const handleDownloadCert = async (report: CertificateMarksheet) => {
    if (!report.certificate_url) return;
    const t = toast.loading("Downloading certificate...");
    try {
      const safe = (report.student_name || report.student_id).replace(/[^a-z0-9]+/gi, "_");
      await downloadSavedPdf(report.certificate_url, `${safe}_Certificate.pdf`);
      toast.success("Certificate downloaded", { id: t });
    } catch (e: any) {
      toast.error(e?.message || "Download failed", { id: t });
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 p-6">
        <Card className="bg-background/95 backdrop-blur-sm border border-primary/10 shadow-2xl">
          <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading certificate and marksheet data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <FileSearch className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Certificate & Marksheet Reports
            </h1>
            <p className="text-muted-foreground mt-1">Manage and track certificate and marksheet records</p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Verified</p>
                  <p className="text-2xl font-bold text-green-900">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Issued</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.issued}</p>
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
                  <p className="text-sm font-medium text-purple-700">Courses</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.courses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-700">Filtered Results</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.filtered}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 bg-background border-input"
                  placeholder="Search by student name, ID, or course..."
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="bg-background/95 backdrop-blur-sm border border-primary/10 shadow-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90">
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Actions</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Student ID</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Student Name</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Course</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Issue Date</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Status</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center space-y-2">
                          <FileSearch className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-lg font-medium">No reports found</p>
                          <p className="text-sm">
                            {searchTerm || filterStatus !== "all" 
                              ? "Try adjusting your search or filter criteria" 
                              : "No certificate/marksheet records available"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report, index) => (
                      <TableRow 
                        key={report.id} 
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                      >
                        <TableCell className="text-center p-4 border-r border-border">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">
                          {report.student_id}
                        </TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">
                          {report.student_name}
                        </TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">
                          {report.course_name}
                        </TableCell>
                        <TableCell className="text-center p-4 font-medium border-r border-border">
                          {new Date(report.issue_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center p-4 border-r border-border">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === 'issued' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            report.status === 'verified' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center p-4">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {report.certificate_url ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadCert(report)}
                                className="border-green-300 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Award className="h-4 w-4 mr-1" />
                                Download Certificate
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not generated</span>
                            )}
                          </div>
                        </TableCell>
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

export default ReportContent;