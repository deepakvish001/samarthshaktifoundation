import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, UserCheck, FileText, Users, GraduationCap, Calendar, Award, Building, MapPin, Phone, Mail, CreditCard, User, FileDown, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import indiaEmblem from "@/assets/india-emblem.png";
import nabardLogo from "@/assets/nabard-logo.png";

type StudentData = {
  id: string;
  student_id: string;
  student_name: string;
  student_father_name: string;
  student_mother_name: string;
  course_name: string;
  center_code: string;
  center_name: string;
  student_photo_url?: string;
  place?: string;
};

const StudentRegPrintContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchResults, setSearchResults] = useState<StudentData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const registrationFormRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student ID or name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Search in alot_numbers table for detailed student information
      const { data: alotData, error: alotError } = await supabase
        .from('alot_numbers')
        .select('*')
        .or(`student_id.ilike.%${searchValue}%,student_name.ilike.%${searchValue}%`);

      if (alotError) {
        throw alotError;
      }

      // Transform data to our StudentData type
      const transformedResults: StudentData[] = (alotData || []).map(item => ({
        id: item.id,
        student_id: item.student_id,
        student_name: item.student_name,
        student_father_name: item.student_father_name,
        student_mother_name: item.student_mother_name,
        course_name: item.course_name,
        center_code: item.center_code,
        center_name: item.center_name,
        student_photo_url: item.student_photo_url,
        place: item.place
      }));

      setSearchResults(transformedResults);
      setShowSearchResults(true);
      setLoading(false);

      if (transformedResults.length > 0) {
        toast({
          title: "Success",
          description: `Found ${transformedResults.length} student(s)`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No students found with the given criteria",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to search students. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setShowSearchResults(false);
    toast({
      title: "Student Selected",
      description: `Selected ${student.student_name} for registration form`,
    });
  };


  const generateProfessionalPDF = async () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please search and select a student first",
        variant: "destructive"
      });
      return;
    }

    if (!registrationFormRef.current) {
      toast({
        title: "Error",
        description: "Registration form template not found",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      toast({
        title: "Generating PDF",
        description: "Creating Professional Registration Form PDF...",
      });

      // Ensure layout and webfonts are fully ready
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));

      const element = registrationFormRef.current;

      // High-DPI capture for crisp text
      const canvas = await html2canvas(element, {
        scale: Math.min(3, window.devicePixelRatio * 2),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 12000,
        scrollX: 0,
        scrollY: 0,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Captured canvas has zero size');
      }

      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4', 
        compress: true 
      });
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const usableWidthMm = pdfWidth - margin * 2;
      const usableHeightMm = pdfHeight - margin * 2;

      // Calculate how to fit the content
      const imgData = canvas.toDataURL('image/png');
      const aspectRatio = canvas.height / canvas.width;
      const heightMm = usableWidthMm * aspectRatio;

      if (heightMm <= usableHeightMm) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', margin, margin, usableWidthMm, heightMm, undefined, 'FAST');
      } else {
        // Multi-page handling
        const pageHeightPx = Math.round((canvas.width * usableHeightMm) / usableWidthMm);
        let currentY = 0;
        let pageNumber = 1;

        while (currentY < canvas.height) {
          if (pageNumber > 1) pdf.addPage();
          
          const sliceHeight = Math.min(pageHeightPx, canvas.height - currentY);
          
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext('2d');
          if (!ctx) throw new Error('2D context not available');

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, currentY, canvas.width, sliceHeight, 0, 0, pageCanvas.width, pageCanvas.height);

          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageHeightMm = (sliceHeight / canvas.width) * usableWidthMm;
          pdf.addImage(pageImgData, 'PNG', margin, margin, usableWidthMm, pageHeightMm, undefined, 'FAST');

          // Add page number
          pdf.setTextColor(120, 120, 120);
          pdf.setFontSize(8);
          pdf.text(`Page ${pageNumber}`, pdfWidth - 15, pdfHeight - 5, { align: 'right' });

          currentY += sliceHeight;
          pageNumber++;
        }
      }

      const currentDate = new Date().toISOString().split('T')[0];
      const sanitizedName = selectedStudent.student_name?.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Student';
      const fileName = `${sanitizedName}_RegistrationForm_${currentDate}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Professional Registration Form PDF generated successfully!",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: `Failed to generate PDF: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Mock statistics data
  const stats = {
    totalRegistrations: 1247,
    thisMonth: 89,
    verified: 1198,
    pending: 49
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
            <span>Student Registration Print</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Registrations</p>
                  <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
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
                  <p className="text-accent-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold">{stats.thisMonth}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Verified Students</p>
                  <p className="text-3xl font-bold">{stats.verified}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Action Controls */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-6">
                <a href="/admin" className="text-primary hover:text-primary/80 font-medium flex items-center space-x-2 transition-colors">
                  <Building className="h-4 w-4" />
                  <span>Home</span>
                </a>
                <div className="flex items-center space-x-4">
                  <span className="text-foreground font-medium flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Students List</span>
                  </span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-10 w-64 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter Student ID or Name"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={generateProfessionalPDF}
                  disabled={!selectedStudent || isGeneratingPDF}
                  className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white px-6 py-2 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-accent via-accent/95 to-accent/90 text-accent-foreground p-6">
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-5 w-5" />
                </div>
                <span>Search Results ({searchResults.length} found)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((student) => (
                  <Card key={student.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-border/40 hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-primary" />
                          <p className="font-semibold text-foreground">{student.student_name}</p>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><span className="font-medium">ID:</span> {student.student_id}</p>
                          <p><span className="font-medium">Course:</span> {student.course_name}</p>
                          <p><span className="font-medium">Center:</span> {student.center_name}</p>
                        </div>
                        <Button 
                          onClick={() => handleSelectStudent(student)}
                          className="w-full mt-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                          size="sm"
                        >
                          Select Student
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Print Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span>B SOFT Computer & Technical Institute</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Registration Form
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Preview panel (screen) */}
            {selectedStudent && (
              <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <span>Selected Student Information</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <p className="text-foreground">{selectedStudent.student_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">ID:</span>
                    <p className="text-foreground">{selectedStudent.student_id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Course:</span>
                    <p className="text-foreground">{selectedStudent.course_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Center:</span>
                    <p className="text-foreground">{selectedStudent.center_name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* A4 Certificate Canvas (captured to PDF) */}
            <div
              ref={registrationFormRef}
              className="relative mx-auto bg-background w-[794px] min-h-[1123px] p-10 border-[12px] border-primary/20 rounded-md shadow-elegant"
            >
              {/* Inner frame */}
              <div className="absolute inset-4 border-2 border-border/60 rounded-md pointer-events-none" />

              {/* Watermark */}
              <img
                src={nabardLogo}
                alt="Institute watermark logo"
                className="absolute inset-0 m-auto opacity-5 w-[420px] h-[420px] object-contain pointer-events-none"
              />

              {/* Header */}
              <div className="relative flex items-start justify-between">
                <img src={indiaEmblem} alt="National emblem" className="h-16 w-auto opacity-90" />
                <div className="text-center flex-1 px-4">
                  <h1 className="text-2xl font-extrabold text-foreground">B SOFT Computer & Technical Institute</h1>
                  <p className="text-sm text-muted-foreground">
                    Near Union Bank Of India Bina Soft Educational & Welfare Society Vill & Post BILARIYAGAN J, AZAMGARH-276121
                  </p>
                  <p className="text-xs text-muted-foreground">Email: infobinasoft@gmail.com</p>
                </div>
                <div className="h-24 w-20 border-2 border-border/60 rounded-sm overflow-hidden bg-muted/20">
                  {selectedStudent?.student_photo_url ? (
                    <img
                      src={selectedStudent.student_photo_url}
                      alt={`${selectedStudent.student_name} photo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">Photo</div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold tracking-wide text-primary uppercase">Registration Certificate</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  This certifies that the student details below are registered with the institute.
                </p>
              </div>

              {/* Details */}
              <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-5 text-sm">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Student Name</p>
                  <p className="border-b border-border/60 py-2 font-semibold">{selectedStudent?.student_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Student ID</p>
                  <p className="border-b border-border/60 py-2 font-semibold">{selectedStudent?.student_id || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Course</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.course_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Study Center Code</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.center_code || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Father's Name</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.student_father_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Mother's Name</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.student_mother_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Center Name</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.center_name || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Place</p>
                  <p className="border-b border-border/60 py-2">{selectedStudent?.place || "-"}</p>
                </div>
              </div>

              {/* Verification strip */}
              <div className="mt-8 grid grid-cols-3 gap-4 items-end">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Issued Date</p>
                  <p className="border-b border-border/60 py-2">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Verification Code</p>
                  <p className="border border-border/60 rounded px-3 py-2 font-mono text-center">
                    REG-{new Date().getFullYear()}-{(selectedStudent?.student_id || "").toString().replace(/[^A-Z0-9]/gi, "").toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground font-medium">Authorized Signatory</p>
                  <div className="border-b border-border/60 h-10"></div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="border-b border-border/60 h-12 mb-2"></div>
                  <p className="text-sm font-medium">Student Signature</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-border/60 h-12 mb-2"></div>
                  <p className="text-sm font-medium">Parent/Guardian Signature</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-border/60 h-12 mb-2"></div>
                  <p className="text-sm font-medium">Institute Seal & Signature</p>
                </div>
              </div>

              <div className="mt-8 text-[10px] text-muted-foreground text-center">
                This document is computer generated and does not require a physical signature.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegPrintContent;