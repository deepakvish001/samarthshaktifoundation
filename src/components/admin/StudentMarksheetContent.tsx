import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown, AlertTriangle, User, BookOpen, Calendar, FileText, Users, GraduationCap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface StudentData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  course_name?: string;
  status?: string;
  city?: string;
  state?: string;
  enrollment_date?: string;
}

interface MarksheetData {
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
}

interface CourseSubject {
  id: string;
  course_name: string;
  subject: string;
  theory_marks: string;
  practical_marks: string;
  semester_year: string;
}

const StudentMarksheetContent = () => {
  console.log("StudentMarksheetContent component is loading - v2.0");
  
  const [searchValue, setSearchValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [marksheetData, setMarksheetData] = useState<MarksheetData | null>(null);
  const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([]);
  const [searchResults, setSearchResults] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const marksheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const checkMissingData = () => {
    const missing: string[] = [];
    
    if (!selectedStudent?.full_name) missing.push("Student Name");
    if (!selectedStudent?.course_name) missing.push("Course Name");
    if (!marksheetData?.roll_number) missing.push("Roll Number");
    if (!marksheetData?.examination_date) missing.push("Examination Date");
    if (!marksheetData?.total_marks) missing.push("Total Marks");
    if (!marksheetData?.obtained_marks) missing.push("Obtained Marks");
    if (!marksheetData?.grade) missing.push("Grade");
    if (courseSubjects.length === 0) missing.push("Course Subjects");
    
    return missing;
  };

  const searchStudents = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const { data: students, error } = await supabase
        .from('student_profiles')
        .select('*')
        .or(`full_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,phone.ilike.%${searchValue}%,course_name.ilike.%${searchValue}%`)
        .limit(10);

      if (error) throw error;

      setSearchResults(students || []);
      setShowResults(true);
      
      if (students && students.length === 0) {
        toast.info("No students found matching your search");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student: StudentData) => {
    setSelectedStudent(student);
    setShowResults(false);
    setSearchValue(student.full_name);

    // Fetch marksheet data for this student
    try {
      const { data: marksheet } = await supabase
        .from('marksheet_management')
        .select('*')
        .eq('student_id', student.id)
        .single();

      if (marksheet) {
        setMarksheetData(marksheet);
      }

      // Fetch course subjects
      if (student.course_name) {
        const { data: subjects } = await supabase
          .from('course_subjects')
          .select('*')
          .eq('course_name', student.course_name);

        if (subjects) {
          setCourseSubjects(subjects);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const generatePDF = async () => {
    if (!marksheetRef.current) {
      toast.error("Certificate template not found");
      return;
    }

    const missing = checkMissingData();
    if (missing.length > 0) {
      toast.error(`Cannot generate certificate. Missing: ${missing.join(', ')}`);
      return;
    }

    try {
      toast.loading("Creating Professional Certificate...", { id: "pdf-gen" });

      // Ensure layout and webfonts are fully ready
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));

      const element = marksheetRef.current;
      setIsGenerating(true);

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

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10; // mm

      // Compute usable page size (accounting for margins)
      const usableWidthMm = pdfWidth - margin * 2;
      const usableHeightMm = pdfHeight - margin * 2;

      // Calculate how much content fits on each page
      const pageHeightPx = Math.round((canvas.width * usableHeightMm) / usableWidthMm);

      // Intelligent section-aware page breaks based on content structure
      const cssWidth = element.scrollWidth || element.clientWidth || 1;
      const ratio = canvas.width / cssWidth;
      const elemRect = element.getBoundingClientRect();
      const yBreaks: number[] = [0];

      // Define major sections in logical order
      const majorSections = [
        { 
          selector: '.text-center.mb-6', 
          name: 'header',
          minHeight: Math.round(150 * ratio) // Ensure header has enough space
        },
        { 
          selector: '.flex.justify-between.items-start.mb-6', 
          name: 'student_info',
          minHeight: Math.round(100 * ratio)
        },
        { 
          selector: '.mb-6.text-center', 
          name: 'certificate_text',
          minHeight: Math.round(120 * ratio)
        },
        { 
          selector: '.mb-3', // Academic performance table container
          name: 'academic_table',
          minHeight: Math.round(200 * ratio), // Tables need more space
          critical: true // Never split this section
        },
        { 
          selector: '.grid.grid-cols-3.gap-6.items-end.mt-8', 
          name: 'footer_grid',
          minHeight: Math.round(150 * ratio)
        },
        { 
          selector: '.text-center.mt-6.text-sm', 
          name: 'contact_info',
          minHeight: Math.round(80 * ratio)
        }
      ];

      // Calculate section boundaries
      const sectionBounds: Array<{name: string, top: number, bottom: number, minHeight: number, critical?: boolean}> = [];
      
      for (const section of majorSections) {
        const sectionElement = element.querySelector(section.selector);
        if (sectionElement) {
          const sectionRect = sectionElement.getBoundingClientRect();
          const topPx = Math.round((sectionRect.top - elemRect.top) * ratio);
          const bottomPx = Math.round((sectionRect.bottom - elemRect.top) * ratio);
          
          sectionBounds.push({
            name: section.name,
            top: topPx,
            bottom: bottomPx,
            minHeight: section.minHeight,
            critical: section.critical
          });
        }
      }

      // Create page breaks ensuring complete borders and no content cut-off
      let currentY = 0;
      while (currentY + pageHeightPx < canvas.height) {
        const nextBreak = currentY + pageHeightPx;
        let bestBreak = nextBreak;

        // Find the best section boundary within 70-90% of page to avoid cutting borders
        const sectionCandidates: number[] = [];
        for (const section of sectionBounds) {
          const boundary = section.bottom;
          // More conservative range to ensure borders don't get cut
          if (boundary >= currentY + Math.round(pageHeightPx * 0.6) && boundary <= currentY + Math.round(pageHeightPx * 0.9)) {
            sectionCandidates.push(boundary);
          }
          // Protect critical sections more strictly
          if (section.critical && section.top >= currentY && section.top < nextBreak && section.bottom > nextBreak) {
            if (section.top - currentY >= Math.round(pageHeightPx * 0.4)) {
              sectionCandidates.push(section.top);
            }
          }
        }
        if (sectionCandidates.length > 0) {
          bestBreak = Math.max(...sectionCandidates);
        } else if (tableRef.current) {
          // More conservative table row breaks
          const rows = Array.from(tableRef.current.querySelectorAll('tbody tr')) as HTMLElement[];
          const searchStart = currentY + Math.round(pageHeightPx * 0.7);
          const searchEnd = currentY + Math.round(pageHeightPx * 0.9);
          let candidate = 0;
          for (const row of rows) {
            const rowRect = row.getBoundingClientRect();
            const rowBottomPx = Math.round((rowRect.bottom - elemRect.top) * ratio);
            if (rowBottomPx >= searchStart && rowBottomPx <= searchEnd) {
              candidate = Math.max(candidate, rowBottomPx);
            }
          }
          if (candidate > 0) bestBreak = candidate;
        }

        // Ensure progress with strict limits to preserve borders
        bestBreak = Math.max(bestBreak, currentY + Math.round(pageHeightPx * 0.6));
        bestBreak = Math.min(bestBreak, currentY + Math.round(pageHeightPx * 0.9));

        yBreaks.push(bestBreak);
        currentY = bestBreak;
      }

      // Add final page exactly at canvas.height
      if (yBreaks[yBreaks.length - 1] !== canvas.height) {
        yBreaks.push(canvas.height);
      }

      // No additional PDF borders - use only the template borders from html2canvas capture

      // Render each page slice with borders
      for (let i = 0; i < yBreaks.length - 1; i++) {
        if (i > 0) pdf.addPage();
        
        const sliceTop = yBreaks[i];
        const sliceHeight = yBreaks[i + 1] - sliceTop;

        // Create canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) throw new Error('2D context not available');

        // Fill with white background and draw the slice
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, sliceTop, canvas.width, sliceHeight, 0, 0, pageCanvas.width, pageCanvas.height);

        // Add content to PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const heightMm = (sliceHeight / canvas.width) * usableWidthMm;
        const clampedHeightMm = Math.min(heightMm, usableHeightMm);
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidthMm, clampedHeightMm, undefined, 'FAST');

        // Template borders are already captured in the image - no additional borders needed

        // Add page number if multi-page
        if (yBreaks.length > 2) {
          pdf.setTextColor(120, 120, 120);
          pdf.setFontSize(8);
          pdf.text(`Page ${i + 1} of ${yBreaks.length - 1}`, pdfWidth - 15, pdfHeight - 5, { align: 'right' });
        }
      }

      const currentDate = new Date().toISOString().split('T')[0];
      const sanitizedName = selectedStudent?.full_name?.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Student';
      const fileName = `${sanitizedName}_Certificate_${currentDate}.pdf`;
      pdf.save(fileName);
      setIsGenerating(false);

      toast.success("Professional Certificate Generated!", { id: "pdf-gen" });
    } catch (error: any) {
      console.error('PDF error:', error);
      setIsGenerating(false);
      toast.error(`Failed to generate certificate: ${error?.message || 'Unknown error'}`, { id: "pdf-gen" });
    }
  };

  const missing = checkMissingData();
  
  // Statistics calculations
  const totalSearchResults = searchResults.length;
  const hasSelectedStudent = selectedStudent ? 1 : 0;
  const hasMarksheetData = marksheetData ? 1 : 0;
  const totalSubjects = courseSubjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <span>Student Marksheet</span>
          </h1>
          <Button 
            onClick={generatePDF}
            disabled={!selectedStudent || missing.length > 0}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-elegant px-8 py-3 text-base"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Generate Professional PDF
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Search Results</p>
                  <p className="text-3xl font-bold">{totalSearchResults}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Selected Student</p>
                  <p className="text-3xl font-bold">{hasSelectedStudent}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <User className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Marksheet Data</p>
                  <p className="text-3xl font-bold">{hasMarksheetData}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Course Subjects</p>
                  <p className="text-3xl font-bold text-foreground">{totalSubjects}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <BookOpen className="h-6 w-6 text-foreground" />
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
              <span>Search Student</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 h-12 text-base"
                  placeholder="Search by name, email, or ID..."
                />
              </div>
              <Button 
                onClick={searchStudents}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8 h-12"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Missing Data Warning */}
            {selectedStudent && missing.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Information Required</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      The following information is not available. Please upload or add it to generate the certificate:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missing.map((field) => (
                        <Badge key={field} variant="outline" className="text-amber-700 border-amber-300">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div className="mt-6 border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">No students found</div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {searchResults.map((student, index) => (
                      <div
                        key={student.id}
                        onClick={() => selectStudent(student)}
                        className="p-4 hover:bg-accent/50 cursor-pointer flex items-center justify-between transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-lg">{student.full_name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span>{student.email}</span>
                            <span className="mx-2">•</span>
                            <span>{student.course_name || 'No course assigned'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ID: {student.id}
                          </div>
                        </div>
                        <div className="text-sm text-primary font-medium">
                          Select →
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Student Info */}
            {selectedStudent && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">Selected Student</h3>
                    <p className="text-sm text-green-700">
                      {selectedStudent.full_name} • {selectedStudent.course_name || 'No course'} • {selectedStudent.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marksheet Preview */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-muted via-muted/95 to-muted/90 text-muted-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-foreground">Marksheet Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div
                ref={marksheetRef}
                className="relative bg-background w-[794px] min-h-[1123px] p-10 border-[12px] border-primary/20 rounded-md shadow-elegant"
                style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}
              >
                {/* Inner decorative frame */}
                <div className="absolute inset-4 border-4 border-double border-primary rounded-lg">
                  <div className="absolute inset-2 border-2 border-accent rounded-md">
                    <div className="absolute inset-2 border border-border/30 rounded-sm bg-gradient-to-br from-accent/10 via-background to-primary/5"></div>
                  </div>
                </div>
                
                {/* Elegant Corner Decorations */}
                <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-xl opacity-60"></div>
                <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-xl opacity-60"></div>
                <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-xl opacity-60"></div>
                <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-xl opacity-60"></div>

                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent border-4 border-accent shadow-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-foreground leading-tight">B</div>
                          <div className="text-sm text-primary-foreground leading-none">SOFT</div>
                        </div>
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-2 tracking-wide">
                      B.SOFT COMPUTER & TECHNICAL INSTITUTE
                    </h1>
                    
                    <div className="text-sm text-muted-foreground mb-4 space-y-1 font-medium">
                      <div>NGO DARPAN ID: <span className="text-primary font-bold">UP/2011/0044943</span></div>
                      <div>Society Regd. No.: <span className="text-primary font-bold">AZ-13610</span></div>
                      <div>ISO 9001:2015 CERTIFIED: <span className="text-primary font-bold">UQ-252016790</span></div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-primary tracking-wider mb-2">
                        DIPLOMA CERTIFICATE-CUM-MARKS SHEET
                      </h2>
                      <div className="mx-auto w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
                    </div>
                  </div>

                  {/* Student Info & Photo */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 grid grid-cols-2 gap-6 text-base">
                      <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                        <span className="font-semibold text-accent-foreground text-sm">Enrollment No:</span>
                        <div className="font-bold text-foreground text-lg">{selectedStudent?.id?.slice(-8) || "Not Available"}</div>
                      </div>
                      <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                        <span className="font-semibold text-secondary-foreground text-sm">Roll Number:</span>
                        <div className="font-bold text-foreground text-lg">{marksheetData?.roll_number || "Not Available"}</div>
                      </div>
                    </div>
                    
                    <div className="w-24 h-32 border-3 border-border bg-muted/20 flex items-center justify-center shadow-lg rounded-lg ml-6">
                      <div className="text-center text-muted-foreground text-sm font-semibold">
                        <div>STUDENT</div>
                        <div>PHOTO</div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Text */}
                  <div className="mb-6 text-center">
                    <div className="bg-gradient-to-r from-accent/10 via-background to-secondary/10 p-6 rounded-xl border-2 border-border/40 shadow-inner">
                      <p className="text-lg mb-3 leading-relaxed">
                        This is to certify that <span className="font-bold text-foreground text-xl underline decoration-primary/50 decoration-2">
                          {selectedStudent?.full_name || "___________________"}
                        </span>
                      </p>
                      <p className="text-base mb-3">
                        Son/Daughter of Mr./Mrs. <span className="border-b-2 border-primary inline-block w-32 h-6 align-bottom mx-2"></span>
                      </p>
                      <p className="text-lg mb-3">
                        has successfully completed the <span className="font-bold text-primary text-xl bg-accent/20 px-2 py-1 rounded">
                          {selectedStudent?.course_name || "___________________"}
                        </span> course
                      </p>
                      <p className="text-base mb-3">
                        conducted by <span className="font-bold text-foreground">B.SOFT Computer & Technical Institute</span>
                      </p>
                      <p className="text-lg mb-2">
                        in the year <span className="font-bold text-primary text-xl bg-primary/10 px-3 py-1 rounded-lg">
                          {marksheetData?.examination_date ? new Date(marksheetData.examination_date).getFullYear() : new Date().getFullYear()}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Center Code: <span className="font-bold text-foreground">BSOFT001</span>
                      </p>
                    </div>
                  </div>

                  {/* Academic Performance Table */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-primary text-center mb-2">ACADEMIC PERFORMANCE</h3>
                    
                    <div ref={tableRef} className="bg-background rounded-lg shadow-md border border-border/40 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                            <th className="px-1 py-1.5 text-center font-bold text-xs border-r border-primary/30">Subject</th>
                            <th className="px-1 py-1.5 text-center font-bold text-xs border-r border-primary/30">Max Theory</th>
                            <th className="px-1 py-1.5 text-center font-bold text-xs border-r border-primary/30">Max Practical</th>
                            <th className="px-1 py-1.5 text-center font-bold text-xs border-r border-primary/30">Obt. Theory</th>
                            <th className="px-1 py-1.5 text-center font-bold text-xs">Obt. Practical</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseSubjects.map((subject, index) => (
                            <tr key={subject.id} className={index % 2 === 0 ? "bg-accent/30" : "bg-background"}>
                              <td className="px-1 py-1 text-left font-medium text-xs border-r border-border/30 max-w-[120px] break-words">
                                {subject.subject}
                              </td>
                              <td className="px-1 py-1 text-center text-xs border-r border-border/30">{subject.theory_marks}</td>
                              <td className="px-1 py-1 text-center text-xs border-r border-border/30">{subject.practical_marks}</td>
                              <td className="px-1 py-1 text-center font-bold text-primary text-xs border-r border-border/30">
                                {Math.round(parseInt(subject.theory_marks || "0") * 0.75)}
                              </td>
                              <td className="px-1 py-1 text-center font-bold text-secondary text-xs">
                                {Math.round(parseInt(subject.practical_marks || "0") * 0.8)}
                              </td>
                            </tr>
                          ))}
                          
                          {/* Summary Row */}
                          <tr className="bg-gradient-to-r from-accent/30 to-secondary/30 border-t-2 border-primary">
                            <td className="px-1 py-1.5 text-center font-bold text-foreground text-xs border-r border-border/30">
                              OVERALL RESULT
                            </td>
                            <td className="px-1 py-1.5 text-center font-bold text-primary text-xs border-r border-border/30">
                              {marksheetData?.percentage || 0}%
                            </td>
                            <td className="px-1 py-1.5 text-center font-bold text-secondary text-xs border-r border-border/30">
                              Grade: {marksheetData?.grade || "N/A"}
                            </td>
                            <td className="px-1 py-1.5 text-center border-r border-border/30">
                              <div className={`font-bold text-xs px-1 py-0.5 rounded ${
                                marksheetData?.result_status === 'pass' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {marksheetData?.result_status?.toUpperCase() || "PENDING"}
                              </div>
                            </td>
                            <td className="px-1 py-1.5 text-center font-bold text-secondary text-xs">
                              Total: {marksheetData?.obtained_marks || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Enhanced Footer Section */}
                  <div className="grid grid-cols-3 gap-6 items-end mt-8">
                    {/* Grading System */}
                    <div className="bg-gradient-to-br from-muted/50 to-accent/50 p-4 rounded-xl border-2 border-border/40 shadow-lg">
                      <h4 className="font-bold text-foreground mb-3 text-base flex items-center gap-2">
                        GRADING SYSTEM
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-green-100 px-2 py-1 rounded">
                          <span className="font-semibold">A+:</span>
                          <span className="text-green-700 font-bold">85%+</span>
                        </div>
                        <div className="flex justify-between items-center bg-blue-100 px-2 py-1 rounded">
                          <span className="font-semibold">A:</span>
                          <span className="text-blue-700 font-bold">75-84%</span>
                        </div>
                        <div className="flex justify-between items-center bg-purple-100 px-2 py-1 rounded">
                          <span className="font-semibold">B:</span>
                          <span className="text-purple-700 font-bold">65-74%</span>
                        </div>
                        <div className="flex justify-between items-center bg-yellow-100 px-2 py-1 rounded">
                          <span className="font-semibold">C:</span>
                          <span className="text-yellow-700 font-bold">50-64%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Issue Date */}
                    <div className="text-center">
                      <div className="bg-accent/10 p-4 rounded-xl border-2 border-accent/20 mb-4">
                        <div className="text-sm mb-2">
                          <div className="font-bold text-foreground flex items-center justify-center gap-2 mb-2">
                            Issue Date:
                          </div>
                          <div className="font-bold text-lg text-primary">
                            {marksheetData?.examination_date 
                              ? new Date(marksheetData.examination_date).toLocaleDateString('en-GB')
                              : new Date().toLocaleDateString('en-GB')
                            }
                          </div>
                        </div>
                      </div>
                      <div className="bg-secondary/10 border-2 border-secondary/20 p-3 rounded-xl">
                        <div className="font-bold text-secondary-foreground text-sm">Verify Online</div>
                        <div className="text-foreground font-mono text-lg font-bold">
                          {selectedStudent?.id?.slice(-8) || "N/A"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Digital Signature */}
                    <div className="text-center">
                      <div className="w-32 h-16 border-3 border-border bg-muted/20 mx-auto mb-3 flex items-center justify-center rounded-xl shadow-lg">
                        <div className="text-sm text-muted-foreground font-bold">Digital Seal</div>
                      </div>
                      <div className="border-b-2 border-primary w-32 mx-auto mb-2"></div>
                      <div className="font-bold text-foreground text-base">DIRECTOR</div>
                      <div className="text-sm text-muted-foreground font-semibold">B.SOFT Institute</div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="text-center mt-6 text-sm">
                    <div className="bg-gradient-to-r from-accent/10 to-secondary/10 p-4 rounded-xl border border-border/40">
                      <div className="text-foreground font-semibold mb-2">
                        <span className="font-bold">Head Office:</span> Near Union Bank Of India, Bina Soft Educational & Welfare Society
                      </div>
                      <div className="text-muted-foreground">
                        Vill & Post BILARIYAGAN J, AZAMGARH - 276121, Uttar Pradesh
                      </div>
                      <div className="text-muted-foreground font-medium mt-2">
                        www.binasoftedu.org.in
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentMarksheetContent;