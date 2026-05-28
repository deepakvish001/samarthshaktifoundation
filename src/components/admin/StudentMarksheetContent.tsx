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
  student_id: string;
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
        .or(`student_id.ilike.%${searchValue}%,full_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,phone.ilike.%${searchValue}%,course_name.ilike.%${searchValue}%`)
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

    // Reset previous data
    setMarksheetData(null);
    setCourseSubjects([]);

    try {
      // 1) Try existing marksheet_management row (search by SSF-style student_id text)
      const { data: marksheet } = await supabase
        .from('marksheet_management')
        .select('*')
        .eq('student_id', student.student_id)
        .maybeSingle();

      if (marksheet) {
        setMarksheetData(marksheet as any);
      }

      // 2) Try course_subjects (master list)
      let subjectsList: CourseSubject[] = [];
      if (student.course_name) {
        const { data: subjects } = await supabase
          .from('course_subjects')
          .select('*')
          .eq('course_name', student.course_name);
        if (subjects && subjects.length > 0) {
          subjectsList = subjects as CourseSubject[];
        }
      }

      // 3) Fall back to alot_numbers (latest row for this student)
      const { data: alotRows } = await supabase
        .from('alot_numbers')
        .select('*')
        .eq('student_id', student.student_id)
        .order('created_at', { ascending: false })
        .limit(1);
      const alot = alotRows && alotRows.length > 0 ? alotRows[0] : null;

      if (alot) {
        const alotSubjects: any[] = Array.isArray((alot as any).subjects)
          ? (alot as any).subjects
          : [];

        // Derive course subjects from alot if master list is empty
        if (subjectsList.length === 0 && alotSubjects.length > 0) {
          subjectsList = alotSubjects.map((s: any, idx: number) => ({
            id: `${alot.id}-${idx}`,
            course_name: alot.course_name || student.course_name || "",
            subject: s.name || "",
            theory_marks: String(s.theoryMax || ""),
            practical_marks: String(s.practicalMax || ""),
            semester_year: "",
          }));
        }

        // Derive marksheet data if missing
        if (!marksheet) {
          const totalMax = alotSubjects.reduce(
            (sum, s: any) => sum + (Number(s.theoryMax) || 0) + (Number(s.practicalMax) || 0),
            0
          );
          const totalObt = alotSubjects.reduce(
            (sum, s: any) => sum + (Number(s.theory) || 0) + (Number(s.practical) || 0),
            0
          );
          const percentage = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
          const grade =
            percentage >= 80 ? "A+" :
            percentage >= 70 ? "A" :
            percentage >= 60 ? "B" :
            percentage >= 50 ? "C" :
            percentage >= 40 ? "D" : "F";
          const resultStatus = percentage >= 40 ? "pass" : "fail";

          setMarksheetData({
            id: alot.id,
            student_id: alot.student_id,
            student_name: alot.student_name || student.full_name,
            course_name: alot.course_name || student.course_name || "",
            roll_number: alot.student_id,
            examination_date: alot.course_examination_date || alot.issue_date || "",
            total_marks: totalMax,
            obtained_marks: totalObt,
            percentage: Math.round(percentage * 100) / 100,
            grade,
            result_status: resultStatus,
          } as MarksheetData);
        }
      }

      setCourseSubjects(subjectsList);
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
                className="relative bg-white w-[794px] min-h-[1123px] shadow-elegant"
                style={{ transform: 'scale(0.8)', transformOrigin: 'top center', fontFamily: "'Times New Roman', Times, serif", color: '#111' }}
              >
                <div style={{ padding: '28px 40px', borderTop: '1px solid #555' }}>
                  {/* Top Logo */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                    <img src="/favicon.png" alt="logo" crossOrigin="anonymous" style={{ width: 70, height: 70, objectFit: 'contain' }} />
                  </div>

                  {/* Enroll + Sl No row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Enroll. Number</div>
                      <div>{selectedStudent?.student_id || selectedStudent?.id?.slice(-8) || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>Sl. No.</div>
                      <div>{marksheetData?.roll_number || marksheetData?.id?.slice(0, 10).toUpperCase() || '—'}</div>
                    </div>
                  </div>

                  {/* Institute Title */}
                  <h1 style={{ textAlign: 'center', color: '#1d4ed8', fontWeight: 800, fontSize: 32, margin: '4px 0 6px', letterSpacing: 0.5 }}>
                    SAMARTH SHAKTI FOUNDATION
                  </h1>
                  <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 13, color: '#111', marginBottom: 6 }}>
                    A Unit of Nesan Computer And Technical Institute
                  </div>

                  {/* Reg lines */}
                  <div style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.6 }}>
                    <div>Registered Under Societies Registration Act, 1860 Regd. No. <span style={{ color: '#dc2626', fontWeight: 700 }}>UP/2019/BAL/10760</span></div>
                    <div>MSME Reg. No. : <span style={{ color: '#dc2626', fontWeight: 700 }}>BAL/10760/2019-20</span></div>
                    <div>ISO 9001:2015 CERTIFIED / No. <span style={{ color: '#dc2626', fontWeight: 700 }}>SSF-2024-CERT</span></div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#c026d3', fontWeight: 700, fontSize: 13, margin: '10px 0 4px' }}>
                    (Awarded to Under the Management)
                  </div>

                  <div style={{ textAlign: 'center', margin: '8px 0 4px' }}>
                    <span style={{ color: '#0891b2', fontWeight: 700, fontSize: 16, textDecoration: 'underline' }}>
                      {selectedStudent?.course_name || '___________________'}
                    </span>
                  </div>

                  <h2 style={{ textAlign: 'center', color: '#dc2626', fontSize: 22, fontWeight: 700, margin: '6px 0 10px' }}>
                    CERTIFICATE-CUM-MARKS SHEET
                  </h2>

                  {/* Photo on the right + certify body */}
                  <div style={{ position: 'relative', minHeight: 130 }}>
                    <div style={{ position: 'absolute', right: 0, top: -120, width: 110, height: 130, border: '1px solid #333', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#6b7280' }}>
                      STUDENT PHOTO
                    </div>

                    <div style={{ fontSize: 14, lineHeight: 1.9, paddingRight: 130 }}>
                      <div>
                        This is to certify that according to organization{' '}
                        <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Mr./श्री {selectedStudent?.full_name || '___________________'}</span>
                      </div>
                      <div>
                        Son/Daughter of Mr. <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Mr./श्री ____________________</span> and Mrs. <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Mrs./श्रीमती ____________________</span>
                      </div>
                      <div>
                        has passed one year <span style={{ fontWeight: 700 }}>{selectedStudent?.course_name || '___________________'}</span> Course examination held in{' '}
                        <span style={{ fontWeight: 700, textDecoration: 'underline' }}>
                          {marksheetData?.examination_date ? new Date(marksheetData.examination_date).toLocaleDateString('en-GB') : '__/__/____'}
                        </span>
                      </div>
                      <div>
                        from <span style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>Samarth Shakti Foundation</span>
                      </div>
                      <div>
                        Center Code: <span style={{ fontWeight: 700, textDecoration: 'underline' }}>SSF/AZM/0001</span> . His/Her grading in Individual Papers are given below.
                      </div>
                    </div>
                  </div>

                  <h3 style={{ textAlign: 'center', color: '#1d4ed8', fontWeight: 700, fontSize: 16, margin: '10px 0 6px' }}>
                    GRADES AWARDED
                  </h3>

                  {/* Marks table */}
                  <div ref={tableRef}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1.5px solid #111' }}>
                      <thead>
                        <tr style={{ background: '#fff' }}>
                          <th style={mthCell}>Subjects</th>
                          <th style={mthCell}>Max.Theory Marks</th>
                          <th style={mthCell}>Max.Practical Marks</th>
                          <th style={mthCell}>Obtain Theory Marks.</th>
                          <th style={mthCell}>Obtain Practical Marks.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseSubjects.length === 0 ? (
                          <tr><td colSpan={5} style={{ ...mtdCell, padding: 14, color: '#6b7280' }}>No subjects added for this course.</td></tr>
                        ) : courseSubjects.map((subject) => {
                          const theoryMax = parseInt(subject.theory_marks || '0') || 0;
                          const pracMax = parseInt(subject.practical_marks || '0') || 0;
                          const overallMax = courseSubjects.reduce((s, x) => s + (parseInt(x.theory_marks||'0')||0) + (parseInt(x.practical_marks||'0')||0), 0);
                          const ratio = overallMax > 0 && marksheetData?.obtained_marks ? marksheetData.obtained_marks / overallMax : 0.8;
                          return (
                            <tr key={subject.id}>
                              <td style={{ ...mtdCell, textAlign: 'left', paddingLeft: 8 }}>{subject.subject}</td>
                              <td style={mtdCell}>{theoryMax || '—'}</td>
                              <td style={mtdCell}>{pracMax || '—'}</td>
                              <td style={mtdCell}>{theoryMax ? Math.round(theoryMax * ratio) : '—'}</td>
                              <td style={mtdCell}>{pracMax ? Math.round(pracMax * ratio) : '—'}</td>
                            </tr>
                          );
                        })}
                        {(() => {
                          const theoryMaxTotal = courseSubjects.reduce((s, x) => s + (parseInt(x.theory_marks||'0')||0), 0);
                          const pracMaxTotal = courseSubjects.reduce((s, x) => s + (parseInt(x.practical_marks||'0')||0), 0);
                          const overallMax = theoryMaxTotal + pracMaxTotal;
                          const ratio = overallMax > 0 && marksheetData?.obtained_marks ? marksheetData.obtained_marks / overallMax : 0;
                          const theoryObt = Math.round(theoryMaxTotal * ratio);
                          const pracObt = Math.round(pracMaxTotal * ratio);
                          const grandMax = marksheetData?.total_marks || overallMax;
                          const grandObt = marksheetData?.obtained_marks || (theoryObt + pracObt);
                          const pct = marksheetData?.percentage ?? (grandMax ? (grandObt / grandMax) * 100 : 0);
                          return (
                            <>
                              <tr style={{ fontWeight: 700 }}>
                                <td style={{ ...mtdCell, textAlign: 'center' }}>Total</td>
                                <td style={mtdCell}>{theoryMaxTotal}</td>
                                <td style={mtdCell}>{pracMaxTotal}</td>
                                <td style={mtdCell}>{theoryObt}</td>
                                <td style={mtdCell}>{pracObt}</td>
                              </tr>
                              <tr style={{ fontWeight: 700 }}>
                                <td style={{ ...mtdCell, textAlign: 'center' }}>Grand Total</td>
                                <td style={mtdCell} colSpan={2}>{grandMax}</td>
                                <td style={mtdCell} colSpan={2}>{grandObt}</td>
                              </tr>
                              <tr style={{ fontWeight: 700 }}>
                                <td style={{ ...mtdCell, textAlign: 'center' }}>Percentage (%)</td>
                                <td style={{ ...mtdCell, color: '#dc2626' }} colSpan={4}>{pct.toFixed(1)} %</td>
                              </tr>
                              <tr style={{ fontWeight: 700 }}>
                                <td style={{ ...mtdCell, textAlign: 'center' }}>Grade</td>
                                <td style={{ ...mtdCell, color: '#dc2626' }} colSpan={4}>{marksheetData?.grade || '—'}</td>
                              </tr>
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>LEGEND OF GRADES</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', fontSize: 12, marginTop: 6, rowGap: 4, columnGap: 30, paddingLeft: 12 }}>
                      <div>S &nbsp;: 85% &amp; Above</div>
                      <div>A &nbsp;: 75%-84%</div>
                      <div>B &nbsp;: 65%-74%</div>
                      <div>C &nbsp;: 55%-64%</div>
                      <div>D &nbsp;: 50%-54%</div>
                      <div>F &nbsp;: Less than 50% - Fail</div>
                    </div>
                  </div>

                  {/* Signature row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30, fontSize: 13 }}>
                    <div>
                      <div><b>Issue Date :</b> {marksheetData?.examination_date ? new Date(marksheetData.examination_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</div>
                      <div style={{ marginTop: 6 }}><b>Place :</b> AZAMGARH</div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 11, color: '#374151' }}>
                      <div style={{ width: 90, height: 90, border: '1px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>QR</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontStyle: 'italic', marginBottom: 4 }}>Digitally signed by</div>
                      <div style={{ borderTop: '1px solid #111', paddingTop: 4, minWidth: 160, fontWeight: 700 }}>SECRETARY/DIRECTOR</div>
                    </div>
                  </div>

                  {/* Footer notes */}
                  <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#374151' }}>
                    This Diploma may be Verified at <span style={{ color: '#1d4ed8' }}>www.samarthshaktifoundation.org</span> using the diploma holder's enrollment number
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 4, fontSize: 11, fontWeight: 700 }}>
                    Head Office Address - Samarth Shakti Foundation, AZAMGARH - 276121, Uttar Pradesh
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