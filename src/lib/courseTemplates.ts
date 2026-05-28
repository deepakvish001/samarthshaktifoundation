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