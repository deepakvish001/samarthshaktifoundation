import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import StudentPicker from "@/components/admin/shared/StudentPicker";
import { validateStudentSelection } from "@/components/admin/shared/validateStudentSelection";
import { Loader2, Edit, Trash2, Search, Filter, FileText, Users, Award, BarChart3, CheckCircle, Plus, BookOpen, Calendar, Hash, Upload, Image as ImageIcon } from "lucide-react";

interface AlotNumber {
  id: string;
  student_id: string;
  course_name: string;
  theory_max_marks?: string;
  practical_max_marks?: string;
  obtain_theory_marks?: string;
  obtain_practical_marks?: string;
  student_name?: string;
  student_father_name?: string;
  student_mother_name?: string;
  course_examination_date?: string;
  center_name?: string;
  center_code?: string;
  issue_date?: string;
  place?: string;
  student_photo_url?: string;
  director_signature_url?: string;
  subjects?: AlotSubject[];
}

interface AlotSubject {
  name: string;
  theory: string;
  practical: string;
}

const AlotNumberContent = () => {
  const {
    data: alotNumbers,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<AlotNumber>({ 
    tableName: 'alot_numbers',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'alot_numbers'
  });

  const [formData, setFormData] = useState({
    studentsId: "",
    courseName: "",
    theoryMaxMarks: "",
    practicalMaxMarks: "",
    obtainTheoryMarks: "",
    obtainPracticalMarks: "",
    studentName: "",
    studentFatherName: "",
    studentMotherName: "",
    courseExaminationDate: "",
    centerName: "",
    centerCode: "",
    issueDate: "",
    place: "",
    studentPhoto: null as File | null,
    directorSignature: null as File | null
  });

  const [editingAlot, setEditingAlot] = useState<AlotNumber | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [subjects, setSubjects] = useState<AlotSubject[]>([]);
  const [subjectDraft, setSubjectDraft] = useState<AlotSubject>({ name: "", theory: "", practical: "" });

  const SUBJECT_OPTIONS = [
    "Fundamental",
    "MS Office",
    "Internet",
    "Accounting Tally",
    "Photoshop",
    "Page Maker",
    "Corel Draw",
    "HTML",
    "C & C++",
    "Visual Basic",
  ];

  const addSubject = () => {
    if (!subjectDraft.name) {
      toast.error("Please select a subject first");
      return;
    }
    if (subjects.some((s) => s.name === subjectDraft.name)) {
      toast.error(`"${subjectDraft.name}" is already added`);
      return;
    }
    setSubjects((prev) => [...prev, subjectDraft]);
    setSubjectDraft({ name: "", theory: "", practical: "" });
  };
  const removeSubject = (i: number) =>
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, field: keyof AlotSubject, value: string) =>
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  const subjectTotal = (s: AlotSubject) =>
    (Number(s.theory) || 0) + (Number(s.practical) || 0);
  const grandTotal = subjects.reduce((sum, s) => sum + subjectTotal(s), 0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    if (!formData.studentsId || !formData.courseName || !formData.studentName) {
      toast.error("Please fill in required fields");
      return;
    }

    const check = await validateStudentSelection({
      studentId: formData.studentsId,
      expectedCourse: formData.courseName,
    });
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    try {
      if (editingAlot) {
        await update(editingAlot.id, {
          student_id: formData.studentsId,
          course_name: formData.courseName,
          theory_max_marks: formData.theoryMaxMarks,
          practical_max_marks: formData.practicalMaxMarks,
          obtain_theory_marks: formData.obtainTheoryMarks,
          obtain_practical_marks: formData.obtainPracticalMarks,
          student_name: formData.studentName,
          student_father_name: formData.studentFatherName,
          student_mother_name: formData.studentMotherName,
          course_examination_date: formData.courseExaminationDate,
          center_name: formData.centerName,
          center_code: formData.centerCode,
          issue_date: formData.issueDate,
          place: formData.place,
          student_photo_url: formData.studentPhoto ? formData.studentPhoto.name : undefined,
          director_signature_url: formData.directorSignature ? formData.directorSignature.name : undefined,
          subjects: subjects as any,
        });
        toast.success("Alot number updated successfully!");
      } else {
        await create({
          student_id: formData.studentsId,
          course_name: formData.courseName,
          theory_max_marks: formData.theoryMaxMarks,
          practical_max_marks: formData.practicalMaxMarks,
          obtain_theory_marks: formData.obtainTheoryMarks,
          obtain_practical_marks: formData.obtainPracticalMarks,
          student_name: formData.studentName,
          student_father_name: formData.studentFatherName,
          student_mother_name: formData.studentMotherName,
          course_examination_date: formData.courseExaminationDate,
          center_name: formData.centerName,
          center_code: formData.centerCode,
          issue_date: formData.issueDate,
          place: formData.place,
          student_photo_url: formData.studentPhoto ? formData.studentPhoto.name : null,
          director_signature_url: formData.directorSignature ? formData.directorSignature.name : null,
          subjects: subjects as any,
        });
        toast.success("Alot number created successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingAlot ? 'update' : 'create'} alot number`);
    }
  };

  const handleEdit = (alot: AlotNumber) => {
    setEditingAlot(alot);
    setSubjects(Array.isArray(alot.subjects) ? alot.subjects : []);
    setFormData({
      studentsId: alot.student_id,
      courseName: alot.course_name,
      theoryMaxMarks: alot.theory_max_marks || "",
      practicalMaxMarks: alot.practical_max_marks || "",
      obtainTheoryMarks: alot.obtain_theory_marks || "",
      obtainPracticalMarks: alot.obtain_practical_marks || "",
      studentName: alot.student_name || "",
      studentFatherName: alot.student_father_name || "",
      studentMotherName: alot.student_mother_name || "",
      courseExaminationDate: alot.course_examination_date || "",
      centerName: alot.center_name || "",
      centerCode: alot.center_code || "",
      issueDate: alot.issue_date || "",
      place: alot.place || "",
      studentPhoto: null,
      directorSignature: null
    });
  };

  const handleReset = () => {
    setEditingAlot(null);
    setSubjects([]);
    setFormData({
      studentsId: "",
      courseName: "",
      theoryMaxMarks: "",
      practicalMaxMarks: "",
      obtainTheoryMarks: "",
      obtainPracticalMarks: "",
      studentName: "",
      studentFatherName: "",
      studentMotherName: "",
      courseExaminationDate: "",
      centerName: "",
      centerCode: "",
      issueDate: "",
      place: "",
      studentPhoto: null,
      directorSignature: null
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alot number?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Alot number deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete alot number");
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = alotNumbers || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.center_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCourse !== "all") {
      filtered = filtered.filter(item => item.course_name === filterCourse);
    }

    return filtered;
  }, [alotNumbers, searchTerm, filterCourse]);

  const courseCategories = [
    "ADCA",
    "DCA", 
    "PGDCA",
    "DCHN"
  ];

  // Statistics calculations
  const stats = useMemo(() => {
    const total = alotNumbers?.length || 0;
    const thisMonth = alotNumbers?.filter(item => {
      const itemDate = new Date(item.issue_date || "");
      const currentMonth = new Date().getMonth();
      return itemDate.getMonth() === currentMonth;
    }).length || 0;
    const withPhotos = alotNumbers?.filter(item => item.student_photo_url).length || 0;
    const filteredResults = filteredData.length;

    return { total, thisMonth, withPhotos, filteredResults };
  }, [alotNumbers, filteredData]);

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading alot numbers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Hash className="h-8 w-8 text-primary" />
            </div>
            <span>Alot Number Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
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
                  <p className="text-secondary-foreground/80 text-sm font-medium">With Photos</p>
                  <p className="text-3xl font-bold">{stats.withPhotos}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <ImageIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold text-foreground">{stats.filteredResults}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Filter className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Plus className="h-6 w-6" />
              </div>
              <span>{editingAlot ? 'Edit Alot Number' : 'Add New Alot Number'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Registered Student
                </label>
                <StudentPicker
                  value={formData.studentsId}
                  onSelect={(s) => {
                    setFormData((prev) => ({
                      ...prev,
                      studentsId: s.student_id || prev.studentsId,
                      studentName: s.full_name || prev.studentName,
                      studentFatherName: s.father_name || prev.studentFatherName,
                      studentMotherName: s.mother_name || prev.studentMotherName,
                      courseName: s.course_name || prev.courseName,
                      centerName: s.study_center || prev.centerName,
                    }));
                  }}
                  className="w-full"
                />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Picking a student auto-fills ID, Name, Father/Mother Name, Course, and Center.
                </p>
              </div>
              {/* Student ID and Course Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Student ID *</label>
                  <Input
                    value={formData.studentsId}
                    onChange={(e) => handleInputChange('studentsId', e.target.value)}
                    className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Enter Student ID"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Course Name *</label>
                  <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                    <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select Course Name" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/40">
                      <SelectItem value="ADCA" className="hover:bg-accent/50">Advance Diploma In Computer Application(ADCA)</SelectItem>
                      <SelectItem value="DCA" className="hover:bg-accent/50">Diploma in Computer Application (DCA)</SelectItem>
                      <SelectItem value="PGDCA" className="hover:bg-accent/50">Post Graduate Diploma in Computer Application (PGDCA)</SelectItem>
                      <SelectItem value="DCHN" className="hover:bg-accent/50">Diploma in Computer Hardware and Networking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Marks Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Marks Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Theory Max Marks</label>
                    <Input
                      value={formData.theoryMaxMarks}
                      onChange={(e) => handleInputChange('theoryMaxMarks', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Theory Max Marks"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Practical Max Marks</label>
                    <Input
                      value={formData.practicalMaxMarks}
                      onChange={(e) => handleInputChange('practicalMaxMarks', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Practical Max Marks"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Obtain Theory Marks</label>
                    <Input
                      value={formData.obtainTheoryMarks}
                      onChange={(e) => handleInputChange('obtainTheoryMarks', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Obtain Theory Marks"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Obtain Practical Marks</label>
                    <Input
                      value={formData.obtainPracticalMarks}
                      onChange={(e) => handleInputChange('obtainPracticalMarks', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Obtain Practical Marks"
                    />
                  </div>
                </div>
              </div>

              {/* Subjects Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Subjects
                </h3>

                {/* Picker row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="md:col-span-5">
                    <label className="text-xs font-medium text-foreground mb-1 block">Subject</label>
                    <Select
                      value={subjectDraft.name}
                      onValueChange={(v) => setSubjectDraft((d) => ({ ...d, name: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {SUBJECT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt}
                            value={opt}
                            disabled={subjects.some((s) => s.name === opt)}
                          >
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-foreground mb-1 block">Theory Marks</label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={subjectDraft.theory}
                      onChange={(e) => setSubjectDraft((d) => ({ ...d, theory: e.target.value }))}
                      placeholder="Theory"
                      className="bg-background"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-foreground mb-1 block">Practical Marks</label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={subjectDraft.practical}
                      onChange={(e) => setSubjectDraft((d) => ({ ...d, practical: e.target.value }))}
                      placeholder="Practical"
                      className="bg-background"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      onClick={addSubject}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      title="Add subject"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {subjects.length === 0 ? (
                  <div className="border border-dashed border-border/60 rounded-lg p-6 text-center text-sm text-muted-foreground">
                    No subjects added. Pick a subject above, fill marks, then click the + button.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="hidden md:grid md:grid-cols-12 gap-3 text-xs font-medium text-muted-foreground px-2">
                      <div className="md:col-span-5">Subject Name</div>
                      <div className="md:col-span-2">Theory Marks</div>
                      <div className="md:col-span-2">Practical Marks</div>
                      <div className="md:col-span-2">Total</div>
                      <div className="md:col-span-1 text-right">Action</div>
                    </div>
                    {subjects.map((s, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-lg border border-border/40 bg-background"
                      >
                        <div className="md:col-span-5">
                          <div className="h-10 flex items-center px-3 rounded-md bg-muted/50 border border-border/40 font-medium text-foreground">
                            {s.name}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={s.theory}
                            onChange={(e) => updateSubject(i, "theory", e.target.value)}
                            placeholder="Theory"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={s.practical}
                            onChange={(e) => updateSubject(i, "practical", e.target.value)}
                            placeholder="Practical"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <div className="h-10 flex items-center px-3 rounded-md bg-primary/5 border border-primary/20 font-semibold text-foreground">
                            {subjectTotal(s)}
                          </div>
                        </div>
                        <div className="md:col-span-1 flex md:justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubject(i)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold">
                        Grand Total: {grandTotal}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Student Name *</label>
                    <Input
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Student Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Father Name</label>
                    <Input
                      value={formData.studentFatherName}
                      onChange={(e) => handleInputChange('studentFatherName', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Student Father Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mother Name</label>
                    <Input
                      value={formData.studentMotherName}
                      onChange={(e) => handleInputChange('studentMotherName', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Student Mother Name"
                    />
                  </div>
                </div>
              </div>

              {/* Center & Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Center & Date Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Examination Date</label>
                    <Input
                      type="date"
                      value={formData.courseExaminationDate}
                      onChange={(e) => handleInputChange('courseExaminationDate', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Center Name</label>
                    <Input
                      value={formData.centerName}
                      onChange={(e) => handleInputChange('centerName', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Center Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Center Code</label>
                    <Input
                      value={formData.centerCode}
                      onChange={(e) => handleInputChange('centerCode', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Center Code"
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Place</label>
                    <Input
                      value={formData.place}
                      onChange={(e) => handleInputChange('place', e.target.value)}
                      className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Place"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">File Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Student Photo</label>
                    <div className="border border-border/40 rounded-lg p-4 bg-background">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('studentPhoto', e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button variant="outline" className="border-border/40 hover:bg-accent/20">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Photo
                          </Button>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {formData.studentPhoto ? formData.studentPhoto.name : "No file chosen"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Director Signature */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Director Signature</label>
                    <div className="border border-border/40 rounded-lg p-4 bg-background">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('directorSignature', e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button variant="outline" className="border-border/40 hover:bg-accent/20">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Signature
                          </Button>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {formData.directorSignature ? formData.directorSignature.name : "No file chosen"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-8 border-t border-border/20">
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
                >
                  {editingAlot ? 'Update Alot Number' : 'Create Alot Number'}
                </Button>
                
                {editingAlot && (
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-border/40 hover:bg-accent/20 px-8"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by student name, ID, or center..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Courses</SelectItem>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Hash className="h-6 w-6" />
                </div>
                <span>Alot Number Records ({filteredData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {alotNumbers?.length || 0}
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Student ID
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Student Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Course
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Theory
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Practical
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" />
                          Center
                        </div>
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Issue Date
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-muted-foreground bg-background/30">
                          <div className="flex flex-col items-center space-y-3">
                            <Hash className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-lg font-medium">No alot numbers found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((alot, index) => (
                        <tr 
                          key={alot.id} 
                          className={`hover:bg-accent/20 transition-colors ${
                            index % 2 === 0 ? "bg-background" : "bg-accent/5"
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(alot)}
                                className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(alot.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-foreground font-medium">
                            {alot.student_id}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-foreground font-medium">
                            {alot.student_name || 'N/A'}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md text-sm font-medium">
                              {alot.course_name}
                            </span>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground">
                            <span className="text-primary font-medium">
                              {alot.obtain_theory_marks || '0'}/{alot.theory_max_marks || '0'}
                            </span>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground">
                            <span className="text-secondary font-medium">
                              {alot.obtain_practical_marks || '0'}/{alot.practical_max_marks || '0'}
                            </span>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground">
                            {alot.center_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-center text-foreground">
                            {alot.issue_date || 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
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

export default AlotNumberContent;