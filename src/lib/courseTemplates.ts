export interface SubjectDef {
  name: string;
  theoryMax: number;
  practicalMax: number;
}

export interface CourseTemplate {
  code: string;
  fullName: string;
  duration: string;
  certificateTitle: string;
  subjects: SubjectDef[];
  passingTheoryPct: number;
  passingPracticalPct: number;
}

export const COURSE_TEMPLATES: Record<string, CourseTemplate> = {
  ADCA: {
    code: "ADCA",
    fullName: "Advance Diploma in Computer Application",
    duration: "1 Year",
    certificateTitle: "Advance Diploma in Computer Application (ADCA)",
    passingTheoryPct: 33,
    passingPracticalPct: 50,
    subjects: [
      { name: "Fundamentals of Computer", theoryMax: 70, practicalMax: 30 },
      { name: "MS Office (Word, Excel, PowerPoint)", theoryMax: 70, practicalMax: 30 },
      { name: "Operating System (Windows)", theoryMax: 70, practicalMax: 30 },
      { name: "Internet & E-mail", theoryMax: 70, practicalMax: 30 },
      { name: "DBMS (MS Access / SQL)", theoryMax: 70, practicalMax: 30 },
      { name: "Tally with GST", theoryMax: 70, practicalMax: 30 },
      { name: "HTML & Web Designing", theoryMax: 70, practicalMax: 30 },
      { name: "Programming in C", theoryMax: 70, practicalMax: 30 },
    ],
  },
  DCA: {
    code: "DCA",
    fullName: "Diploma in Computer Application",
    duration: "6 Months",
    certificateTitle: "Diploma in Computer Application (DCA)",
    passingTheoryPct: 33,
    passingPracticalPct: 50,
    subjects: [
      { name: "Fundamentals of Computer", theoryMax: 70, practicalMax: 30 },
      { name: "MS Office (Word, Excel, PowerPoint)", theoryMax: 70, practicalMax: 30 },
      { name: "Operating System (Windows)", theoryMax: 70, practicalMax: 30 },
      { name: "Internet & E-mail", theoryMax: 70, practicalMax: 30 },
      { name: "Tally with GST", theoryMax: 70, practicalMax: 30 },
    ],
  },
  TYPING: {
    code: "TYPING",
    fullName: "Certificate in Typing (English & Hindi)",
    duration: "3 Months",
    certificateTitle: "Certificate in Typing",
    passingTheoryPct: 40,
    passingPracticalPct: 40,
    subjects: [
      { name: "English Typing", theoryMax: 0, practicalMax: 100 },
      { name: "Hindi Typing", theoryMax: 0, practicalMax: 100 },
      { name: "Typing Theory", theoryMax: 50, practicalMax: 0 },
      { name: "Practical Speed Test", theoryMax: 0, practicalMax: 50 },
    ],
  },
  PGDCA: {
    code: "PGDCA",
    fullName: "Post Graduate Diploma in Computer Application",
    duration: "1 Year",
    certificateTitle: "Post Graduate Diploma in Computer Application (PGDCA)",
    passingTheoryPct: 33,
    passingPracticalPct: 50,
    subjects: [
      { name: "Computer Fundamentals & OS", theoryMax: 70, practicalMax: 30 },
      { name: "Advanced MS Office", theoryMax: 70, practicalMax: 30 },
      { name: "DBMS with SQL", theoryMax: 70, practicalMax: 30 },
      { name: "Web Technology (HTML/CSS/JS)", theoryMax: 70, practicalMax: 30 },
      { name: "Programming in C / C++", theoryMax: 70, practicalMax: 30 },
      { name: "Tally ERP with GST", theoryMax: 70, practicalMax: 30 },
      { name: "Project Work", theoryMax: 0, practicalMax: 100 },
    ],
  },
  BCA: {
    code: "BCA",
    fullName: "Bachelor of Computer Application",
    duration: "3 Years",
    certificateTitle: "Bachelor of Computer Application (BCA)",
    passingTheoryPct: 33,
    passingPracticalPct: 50,
    subjects: [
      { name: "Programming in C", theoryMax: 70, practicalMax: 30 },
      { name: "Data Structures", theoryMax: 70, practicalMax: 30 },
      { name: "DBMS", theoryMax: 70, practicalMax: 30 },
      { name: "Operating Systems", theoryMax: 70, practicalMax: 30 },
      { name: "Web Development", theoryMax: 70, practicalMax: 30 },
      { name: "Software Engineering", theoryMax: 70, practicalMax: 30 },
      { name: "Project Work", theoryMax: 0, practicalMax: 100 },
    ],
  },
  MCA: {
    code: "MCA",
    fullName: "Master of Computer Application",
    duration: "2 Years",
    certificateTitle: "Master of Computer Application (MCA)",
    passingTheoryPct: 40,
    passingPracticalPct: 50,
    subjects: [
      { name: "Advanced Programming (Java)", theoryMax: 70, practicalMax: 30 },
      { name: "Advanced DBMS", theoryMax: 70, practicalMax: 30 },
      { name: "Computer Networks", theoryMax: 70, practicalMax: 30 },
      { name: "Software Engineering", theoryMax: 70, practicalMax: 30 },
      { name: "Cloud Computing", theoryMax: 70, practicalMax: 30 },
      { name: "AI & Machine Learning", theoryMax: 70, practicalMax: 30 },
      { name: "Major Project", theoryMax: 0, practicalMax: 100 },
    ],
  },
  TALLY: {
    code: "TALLY",
    fullName: "Certificate in Tally ERP with GST",
    duration: "3 Months",
    certificateTitle: "Certificate in Tally ERP with GST",
    passingTheoryPct: 40,
    passingPracticalPct: 40,
    subjects: [
      { name: "Accounting Fundamentals", theoryMax: 50, practicalMax: 50 },
      { name: "Tally Basics & Vouchers", theoryMax: 50, practicalMax: 50 },
      { name: "Inventory Management", theoryMax: 50, practicalMax: 50 },
      { name: "GST in Tally", theoryMax: 50, practicalMax: 50 },
      { name: "Reports & Finalization", theoryMax: 0, practicalMax: 100 },
    ],
  },
  ENG: {
    code: "ENG",
    fullName: "Certificate in Spoken English",
    duration: "3 Months",
    certificateTitle: "Certificate in Spoken English",
    passingTheoryPct: 40,
    passingPracticalPct: 40,
    subjects: [
      { name: "Grammar & Vocabulary", theoryMax: 70, practicalMax: 30 },
      { name: "Reading & Writing", theoryMax: 70, practicalMax: 30 },
      { name: "Listening Skills", theoryMax: 50, practicalMax: 50 },
      { name: "Speaking & Presentation", theoryMax: 0, practicalMax: 100 },
    ],
  },
};

export const COURSE_LIST = Object.values(COURSE_TEMPLATES);

export const calcGrade = (pct: number): string => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
};

export const subjectTotal = (s: SubjectDef) => s.theoryMax + s.practicalMax;
export const courseTotalMax = (c: CourseTemplate) =>
  c.subjects.reduce((sum, s) => sum + subjectTotal(s), 0);