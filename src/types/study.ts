export type LectureStatus = 'not-started' | 'in-progress' | 'completed' | 'review';

export interface Lecture {
  id: string;
  name: string;
  category?: string; // For grouping lectures by category (e.g., "Community", "Psychiatry", "EAR", etc.)
  status: LectureStatus;
  timeSpent: number; // in minutes
  pomodoroSessions: PomodoroSession[];
}

export interface PomodoroSession {
  id: string;
  lectureId: string;
  duration: number; // in minutes
  notes: string;
  completedAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  type: 'MIDTERM' | 'FINAL_MCQ' | 'FINAL_ESSAY' | 'OSCE' | 'ACTIVITY' | 'FINAL';
  date: string;
  time: string;
  duration?: string; // e.g., "40 minutes", "2 hours"
  score?: number;
  totalScore: number;
  includedLectures?: string[]; // IDs of lectures included in this exam
  coveragePercentage?: number; // Percentage of curriculum covered (0-100)
  location?: string;
  multiDay?: boolean; // For OSCE exams
  endDate?: string; // For multi-day exams
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
  hours: number; // hours of class
}

// New comprehensive subject types for medical subjects
export interface Branch {
  name: string;
  type: string;
  lectures?: number;
  practicals?: number;
  color: string;
}

export interface Chapter {
  name: string;
  lectures: string[];
  color: string;
}

export interface AnatomicalRegion {
  region: string;
  type: string;
  lectures: number;
  color: string;
  topics: string[];
}

export interface Category {
  category: string;
  type: string;
  lectures: number;
  color: string;
  topics: string[];
}

export interface ClinicalInfo {
  totalSessions?: number;
  sessions?: number;
  skills?: string[];
  practicals?: string[];
}

export interface SubjectClassification {
  branches?: Branch[];
  chapters?: Chapter[];
  anatomicalRegions?: AnatomicalRegion[];
  categories?: Category[];
  clinical?: ClinicalInfo;
}

export interface GradeDistribution {
  midterm: number;
  finalMCQ: number;
  finalEssay: number;
  osce: number;
  activity: number;
  total: number;
}

export interface Subject {
  id: string;
  name: string;
  fullName?: string;
  color: string;
  icon?: string; // lucide icon name
  type?: string; // MAJOR, SPECIALTY, RESEARCH_METHODOLOGY
  difficulty?: string; // HIGH, MEDIUM, MEDIUM_HIGH
  priority?: string; // URGENT, HIGH, MEDIUM
  totalLectures?: number;
  midtermDate?: string;
  finalDate?: string;
  weight?: number; // marks (deprecated - use gradeDistribution.total)
  gradeDistribution?: GradeDistribution;
  classification?: SubjectClassification;
  midtermContent?: string[] | { [key: string]: string[] };
  lectureClassification?: { [category: string]: string[] }; // New format: category -> lectures array
  examDates?: { midterm: string; final: string };
  lectures: Lecture[];
  exams: Exam[];
  allowedAbsenceHours: number; // total allowed absence hours
  attendanceRecords: AttendanceRecord[];
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  day: string; // Monday, Tuesday, etc.
  startTime: string;
  endTime: string;
}

export interface SemesterGrade {
  id: string;
  semester: number; // 1-10
  score: number;
  maxScore: number;
  year: string;
  subjects: SubjectGrade[];
}

export interface SubjectGrade {
  id: string;
  name: string;
  score: number;
  maxScore: number;
}

export interface StudyData {
  subjects: Subject[];
  schedule: ScheduleEntry[];
  totalTimeSpent: number; // in minutes
  semesterGrades: SemesterGrade[];
  currentSemester: number;
}
