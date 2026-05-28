import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { Loader2, UserPlus, Search, Users, Calendar, MapPin, GraduationCap, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LookupItem {
  id: string;
  name: string;
  is_active?: boolean;
  sort_order?: number;
}

interface StudentProfile {
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

interface Course {
  id: string;
  course_name: string;
  course_sort_name: string;
  duration: string;
  fees: string;
  category: string;
  status: 'active' | 'inactive';
}

interface StateData {
  id: string;
  city_id: number;
  city_name: string;
  created_date?: string;
}

interface DistrictData {
  id: string;
  site_id: number;
  city_id: number;
  site_name: string;
  created_date?: string;
}

const StudentRegistrationContent = () => {
  const {
    data: studentProfiles,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<StudentProfile>({ tableName: 'student_profiles' });

  // Fetch course master data
  const {
    data: courses,
    loading: coursesLoading
  } = useOptimisticCrud<Course>({ tableName: 'course_master' });

  // Fetch state master data
  const {
    data: states,
    loading: statesLoading
  } = useOptimisticCrud<StateData>({ tableName: 'state_master' });

  // Fetch district master data
  const {
    data: districts,
    loading: districtsLoading
  } = useOptimisticCrud<DistrictData>({ tableName: 'district_master' });

  // Fetch admin-managed lookup tables
  const { data: studyCenters } = useOptimisticCrud<LookupItem>({ tableName: 'study_centers' });
  const { data: titles } = useOptimisticCrud<LookupItem>({ tableName: 'titles' });
  const { data: genders } = useOptimisticCrud<LookupItem>({ tableName: 'genders' });
  const { data: casteCategories } = useOptimisticCrud<LookupItem>({ tableName: 'caste_categories' });
  const { data: qualifications } = useOptimisticCrud<LookupItem>({ tableName: 'qualifications' });

  useAdminRealTime({
    tableName: 'student_profiles'
  });

  useAdminRealTime({
    tableName: 'course_master'
  });

  useAdminRealTime({
    tableName: 'state_master'
  });

  useAdminRealTime({
    tableName: 'district_master'
  });
  useAdminRealTime({ tableName: 'study_centers' });
  useAdminRealTime({ tableName: 'titles' });
  useAdminRealTime({ tableName: 'genders' });
  useAdminRealTime({ tableName: 'caste_categories' });
  useAdminRealTime({ tableName: 'qualifications' });
  
  // Form state
  const [formData, setFormData] = useState({
    courseCategory: "",
    courseName: "",
    courseFees: "",
    studyCenter: "",
    titleApplicant: "",
    titleFather: "",
    titleMother: "",
    applicantName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dateOfBirth: "",
    category: "",
    registrationDate: "",
    mobile: "",
    email: "",
    fullAddress: "",
    cityName: "",
    state: "",
    district: "",
    pinCode: "",
    qualification: "",
    yearOfPassing: "",
    aadharNumber: "",
    studentId: "",
    password: "",
    declaration: false
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique course categories from course master
  const courseCategories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.filter(c => c.status === 'active').map(c => c.category))];
    return uniqueCategories.sort();
  }, [courses]);

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!formData.courseCategory) return [];
    return courses.filter(c => c.category === formData.courseCategory && c.status === 'active');
  }, [courses, formData.courseCategory]);

  // Filter districts by selected state
  const filteredDistricts = useMemo(() => {
    if (!formData.state) return [];
    const selectedState = states.find(s => s.id === formData.state);
    if (!selectedState) return [];
    return districts.filter(d => d.city_id === selectedState.city_id);
  }, [districts, states, formData.state]);

  // Get selected course details
  const selectedCourse = useMemo(() => {
    return courses.find(c => c.course_name === formData.courseName);
  }, [courses, formData.courseName]);

  // Filtered students based on search
  const filteredStudents = studentProfiles.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.phone && student.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.course_name && student.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.state && student.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalStudents = studentProfiles.length;
  const activeStudents = studentProfiles.filter(student => student.status === 'active').length;
  const recentStudents = studentProfiles.filter(student => {
    if (!student.enrollment_date) return false;
    const enrollmentDate = new Date(student.enrollment_date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return enrollmentDate >= threeDaysAgo;
  }).length;
  const uniqueCourses = [...new Set(studentProfiles.filter(s => s.course_name).map(s => s.course_name))].length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If course category changes, reset course name and fees
      if (field === 'courseCategory') {
        newData.courseName = "";
        newData.courseFees = "";
      }
      
      // If course name changes, auto-fill fees
      if (field === 'courseName') {
        const course = courses.find(c => c.course_name === value);
        if (course) {
          newData.courseFees = course.fees;
        }
      }

      // If state changes, reset district
      if (field === 'state') {
        newData.district = "";
      }
      
      return newData;
    });
  };

  const initialFormState = {
    courseCategory: "",
    courseName: "",
    courseFees: "",
    studyCenter: "",
    titleApplicant: "",
    titleFather: "",
    titleMother: "",
    applicantName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dateOfBirth: "",
    category: "",
    registrationDate: "",
    mobile: "",
    email: "",
    fullAddress: "",
    cityName: "",
    state: "",
    district: "",
    pinCode: "",
    qualification: "",
    yearOfPassing: "",
    aadharNumber: "",
    studentId: "",
    password: "",
    declaration: false,
  };

  const parseDOB = (s: string): string | null => {
    if (!s) return null;
    // Accept dd/MM/yyyy or yyyy-MM-dd
    const slash = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (slash) return `${slash[3]}-${slash[2]}-${slash[1]}`;
    const iso = s.match(/^\d{4}-\d{2}-\d{2}$/);
    if (iso) return s;
    return null;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let p = "";
    for (let i = 0; i < 8; i++) p += chars[Math.floor(Math.random() * chars.length)];
    return p;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!formData.declaration) {
      toast.error("Please accept the declaration to proceed");
      return;
    }
    if (!formData.applicantName || !formData.email || !formData.mobile) {
      toast.error("Please fill in Applicant Name, Email and Mobile");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Resolve State/District UUIDs -> names so downstream pages show readable text
      const stateName =
        states.find((s) => s.id === formData.state)?.city_name || formData.state;
      const districtName =
        districts.find((d) => d.id === formData.district)?.site_name || formData.district;

      // 2. Student ID — auto-generate if admin left it blank
      let studentId = formData.studentId.trim();
      if (!studentId) {
        const { data: gen, error: genErr } = await (supabase as any).rpc("generate_student_id");
        if (genErr || !gen) {
          // Fallback if RPC fails
          studentId = `SSF-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
        } else {
          studentId = gen as string;
        }
      }

      // 3. Upload photo (optional)
      let photoUrl: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const path = `students/${studentId}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, photoFile, { upsert: true, contentType: photoFile.type });
        if (upErr) {
          toast.error(`Photo upload failed: ${upErr.message}`);
        } else {
          const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
          photoUrl = pub.publicUrl;
        }
      }

      // 4. Password — auto-generate if blank
      const password = formData.password.trim() || generatePassword();

      // 5. Build full payload — every form field is persisted
      const studentData: any = {
        student_id: studentId,
        full_name: formData.applicantName,
        email: formData.email,
        phone: formData.mobile,
        title: formData.titleApplicant || null,
        father_name: formData.fatherName || null,
        mother_name: formData.motherName || null,
        gender: formData.gender || null,
        date_of_birth: parseDOB(formData.dateOfBirth),
        caste_category: formData.category || null,
        registration_date: parseDOB(formData.registrationDate) || new Date().toISOString().slice(0, 10),
        address: formData.fullAddress || null,
        city: formData.cityName || null,
        state: stateName || null,
        district: districtName || null,
        pin_code: formData.pinCode || null,
        qualification: formData.qualification || null,
        year_of_passing: formData.yearOfPassing || null,
        aadhar_number: formData.aadharNumber || null,
        study_center: formData.studyCenter || null,
        course_category: formData.courseCategory || null,
        course_name: formData.courseName || null,
        course_fees: formData.courseFees || null,
        photo_url: photoUrl,
        login_password: password,
        status: "active",
        enrollment_date: new Date().toISOString(),
      };

      await create(studentData);

      toast.success(`Student registered! ID: ${studentId}`, { duration: 6000 });
      setFormData(initialFormState);
      setPhotoFile(null);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Failed to register student: ${error?.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || coursesLoading || statesLoading || districtsLoading) {
    return (
      <div className="w-full max-w-none bg-background flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading student registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
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
                <p className="text-3xl font-bold">{activeStudents}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <UserPlus className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">Recent Students</p>
                <p className="text-3xl font-bold">{recentStudents}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-medium">Available Courses</p>
                <p className="text-3xl font-bold text-foreground">{uniqueCourses}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <GraduationCap className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Registration Form */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/20 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <span>Student Registration Form</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-0 border-2 border-border">
        {/* Examination Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Examination Details / परीक्षा विवरण
          </div>
          
          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Applied for Examination / जिस परीक्षा के लिए आवेदन किया*
              </div>
              <div className="col-span-3 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                <Select value={formData.courseCategory} onValueChange={(value) => handleInputChange('courseCategory', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="--------Select Course Category--------" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {courseCategories.length > 0 ? (
                      courseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                <Select 
                  value={formData.courseName} 
                  onValueChange={(value) => handleInputChange('courseName', value)}
                  disabled={!formData.courseCategory || filteredCourses.length === 0}
                >
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="-------Select Course Name-------" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => (
                        <SelectItem key={course.id} value={course.course_name}>
                          {course.course_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {formData.courseCategory ? "No courses in this category" : "Select category first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 px-3 py-2 flex items-center bg-blue-50">
                <span className="text-xs text-gray-700 font-medium">
                  Fee : Rs/ {formData.courseFees ? `₹${formData.courseFees}` : '---'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Examination Location / परीक्षा केंद्र *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Select value={formData.studyCenter} onValueChange={(value) => handleInputChange('studyCenter', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="-----Select Study Center-----" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {studyCenters.filter((c) => c.is_active !== false).length > 0 ? (
                      studyCenters
                        .filter((c) => c.is_active !== false)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-data" disabled>No study centers — add via Master</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Applicant's Personal Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Applicant's Personal Details /आवेदक का व्यक्तिगत विवरण
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Applicant's Full Name / आवेदक का पूरा नाम *
              </div>
              <div className="col-span-2 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                <Select value={formData.titleApplicant} onValueChange={(v) => handleInputChange('titleApplicant', v)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {titles.length > 0 ? (
                      titles.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)
                    ) : (
                      <SelectItem value="no-data" disabled>No titles</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-7 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Father's Name / पिता का नाम *
              </div>
              <div className="col-span-2 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-blue-50">
                <Select value={formData.titleFather} onValueChange={(v) => handleInputChange('titleFather', v)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {titles.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-7 px-3 py-2 flex items-center bg-white">
                <Input
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Mother's Name / माता का नाम *
              </div>
              <div className="col-span-2 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                <Select value={formData.titleMother} onValueChange={(v) => handleInputChange('titleMother', v)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {titles.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-7 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Gender / लिंग*
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400 max-w-xs">
                    <SelectValue placeholder="Select One" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {genders.length > 0 ? (
                      genders.map((g) => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)
                    ) : (
                      <SelectItem value="no-data" disabled>No genders configured</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Date of Birth / जन्म दिनांक *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400 max-w-xs"
                  placeholder="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-blue-50">
                Category / वर्ग*
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400 max-w-xs">
                    <SelectValue placeholder="Select One" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {casteCategories.length > 0 ? (
                      casteCategories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)
                    ) : (
                      <SelectItem value="no-data" disabled>No categories configured</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Date Of Registration *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  type="text"
                  value={formData.registrationDate}
                  onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400 max-w-xs"
                  placeholder="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Contact Details / संपर्क विवरण
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Mobile / मोबाइल *
              </div>
              <div className="col-span-2 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-blue-50">
                <Select>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="+91" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-7 px-3 py-2 flex items-center bg-white">
                <Input
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Email / ईमेल पता *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Address Details / पता विवरण
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Full Address / पता *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                City Name / शहर का नाम *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Input
                  value={formData.cityName}
                  onChange={(e) => handleInputChange('cityName', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-blue-50">
                State / राज्य *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="-------------Select State--------------" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {states.length > 0 ? (
                      states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.city_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>No states available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                District / जिला *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Select 
                  value={formData.district} 
                  onValueChange={(value) => handleInputChange('district', value)}
                  disabled={!formData.state || filteredDistricts.length === 0}
                >
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="-------------Select Distt--------------" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.site_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {formData.state ? "No districts in this state" : "Select state first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Pin Code / पिन कोड *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Input
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Educational/Qualification Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Educational / Qualification Details / शैक्षिक / योग्यता का विवरण
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-blue-50">
                Highest Educational Qualification / उच्चतम शैक्षिक योग्यता *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <Select value={formData.qualification} onValueChange={(value) => handleInputChange('qualification', value)}>
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                    <SelectValue placeholder="Select One" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {qualifications.length > 0 ? (
                      qualifications.map((q) => <SelectItem key={q.id} value={q.name}>{q.name}</SelectItem>)
                    ) : (
                      <SelectItem value="no-data" disabled>No qualifications configured</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Year of Passing / उत्तीर्ण वर्ष *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  value={formData.yearOfPassing}
                  onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                  placeholder="yyyy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identification Details */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Identification Details / पहचान की सूचना
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                Aadhar Card Number / आधार कार्ड संख्या*
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                <Input
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                Upload Photo / फोटो अपलोड *
              </div>
              <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="text-xs border-2 border-gray-400 bg-white p-1 rounded"
                />
                {photoFile && (
                  <span className="ml-3 text-xs text-green-700">{photoFile.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-600">
            <div className="grid grid-cols-12 min-h-[45px] border-collapse">
              <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-blue-50">
                Student ID & Password
              </div>
              <div className="col-span-4 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                <Input
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder="Auto-generated (SSF-YYYY-NNNN) — leave blank or override"
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
              <div className="col-span-5 px-3 py-2 flex items-center bg-white">
                <Input
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Auto-generated — leave blank or override"
                  className="h-8 text-xs border-2 border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="border-collapse">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
            Declaration
          </div>
          <div className="p-4 bg-gray-50 flex justify-between items-center border-2 border-gray-600 border-t-0">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="declaration"
                checked={formData.declaration}
                onCheckedChange={(checked) => handleInputChange('declaration', checked as string)}
              />
              <label htmlFor="declaration" className="text-sm text-gray-700 font-medium">
                * I, hereby declare that the particulars submitted by me in the Student Reg.
              </label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-2 text-sm border-2 border-black"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Now"
              )}
            </Button>
          </div>
        </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Student Management Table */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>Student Management ({filteredStudents.length} students)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/90 border-background/20 focus:border-background focus:ring-background/20"
                />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Name</TableHead>
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Email</TableHead>
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Phone</TableHead>
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Course</TableHead>
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Location</TableHead>
                  <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Status</TableHead>
                  <TableHead className="text-white font-bold text-center py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No students found matching your search." : "No students registered yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className={`${index % 2 === 0 ? "bg-blue-50/50" : "bg-white"} hover:bg-blue-100/50 transition-colors`}>
                      <TableCell className="p-4 border-r border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-800">{student.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{student.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4 text-purple-600" />
                          <span className="text-gray-700">{student.phone || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-orange-600" />
                          <span className="text-gray-700">{student.course_name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          <span className="text-gray-700">
                            {student.city && student.state ? `${student.city}, ${student.state}` : student.state || student.city || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(student.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
  );
};

export default StudentRegistrationContent;