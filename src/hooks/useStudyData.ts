import { useState, useEffect } from 'react';
import { Subject, Lecture, PomodoroSession, Exam, AttendanceRecord, ScheduleEntry, LectureStatus, SemesterGrade, SubjectGrade } from '../types/study';
import { INITIAL_SUBJECTS } from '../data/initialSubjects';
import { generateLecturesFromClassification } from '../utils/generateLectures';
import { generateExamsFromDates } from '../utils/generateExams';

const STORAGE_KEY = 'study-tracker-data';
const DATA_VERSION = '4.0'; // v4.0: Complete exam schedules, grade distributions, and enhanced structure

const initializeSubjects = (): Subject[] => {
  return INITIAL_SUBJECTS.map(subj => {
    const lectures = generateLecturesFromClassification(subj);
    
    return {
      ...subj,
      id: crypto.randomUUID(),
      lectures,
      exams: generateExamsFromDates(subj, lectures),
      attendanceRecords: [],
    };
  });
};

export function useStudyData() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>([]);
  const [currentSemester, setCurrentSemester] = useState<number>(9);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        
        // Check version and migrate if needed
        if (data.version !== DATA_VERSION) {
          console.log('Data version mismatch, reinitializing subjects...');
          const freshSubjects = initializeSubjects();
          setSubjects(freshSubjects);
          setSchedule([]);
          setSemesterGrades([]);
          setCurrentSemester(9);
        } else {
          setSubjects(data.subjects || []);
          setSchedule(data.schedule || []);
          setSemesterGrades(data.semesterGrades || []);
          setCurrentSemester(data.currentSemester || 9);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Reinitialize on error
        setSubjects(initializeSubjects());
      }
    } else {
      // Initialize with default subjects if no data exists
      setSubjects(initializeSubjects());
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      version: DATA_VERSION,
      subjects, 
      schedule, 
      semesterGrades, 
      currentSemester 
    }));
  }, [subjects, schedule, semesterGrades, currentSemester]);

  const addSubject = (name: string, color: string, allowedAbsenceHours: number = 0) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      color,
      lectures: [],
      exams: [],
      allowedAbsenceHours,
      attendanceRecords: [],
    };
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter((s) => s.id !== subjectId));
    setSchedule(schedule.filter((s) => s.subjectId !== subjectId));
  };

  const updateSubject = (subjectId: string, updates: Partial<Subject>) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId ? { ...subject, ...updates } : subject
      )
    );
  };

  const addLecture = (subjectId: string, lectureName: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          const newLecture: Lecture = {
            id: crypto.randomUUID(),
            name: lectureName,
            status: 'not-started',
            timeSpent: 0,
            pomodoroSessions: [],
          };
          return {
            ...subject,
            lectures: [...subject.lectures, newLecture],
          };
        }
        return subject;
      })
    );
  };

  const updateLectureStatus = (subjectId: string, lectureId: string, status: LectureStatus) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            lectures: subject.lectures.map((lecture) =>
              lecture.id === lectureId ? { ...lecture, status } : lecture
            ),
          };
        }
        return subject;
      })
    );
  };

  const deleteLecture = (subjectId: string, lectureId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            lectures: subject.lectures.filter((l) => l.id !== lectureId),
          };
        }
        return subject;
      })
    );
  };

  const addPomodoroTime = (subjectId: string, lectureId: string, duration: number, notes: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            lectures: subject.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                const newSession: PomodoroSession = {
                  id: crypto.randomUUID(),
                  lectureId,
                  duration,
                  notes,
                  completedAt: new Date(),
                };
                return {
                  ...lecture,
                  timeSpent: lecture.timeSpent + duration,
                  pomodoroSessions: [...lecture.pomodoroSessions, newSession],
                };
              }
              return lecture;
            }),
          };
        }
        return subject;
      })
    );
  };

  const addExam = (subjectId: string, exam: Omit<Exam, 'id'>) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          const newExam: Exam = {
            id: crypto.randomUUID(),
            ...exam,
          };
          return {
            ...subject,
            exams: [...subject.exams, newExam],
          };
        }
        return subject;
      })
    );
  };

  const updateExam = (subjectId: string, examId: string, updates: Partial<Exam>) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            exams: subject.exams.map((exam) =>
              exam.id === examId ? { ...exam, ...updates } : exam
            ),
          };
        }
        return subject;
      })
    );
  };

  const deleteExam = (subjectId: string, examId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            exams: subject.exams.filter((e) => e.id !== examId),
          };
        }
        return subject;
      })
    );
  };

  const addAttendance = (subjectId: string, record: Omit<AttendanceRecord, 'id'>) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          const newRecord: AttendanceRecord = {
            id: crypto.randomUUID(),
            ...record,
          };
          return {
            ...subject,
            attendanceRecords: [...subject.attendanceRecords, newRecord],
          };
        }
        return subject;
      })
    );
  };

  const deleteAttendance = (subjectId: string, recordId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            attendanceRecords: subject.attendanceRecords.filter((r) => r.id !== recordId),
          };
        }
        return subject;
      })
    );
  };

  const addScheduleEntry = (entry: Omit<ScheduleEntry, 'id'>) => {
    const newEntry: ScheduleEntry = {
      id: crypto.randomUUID(),
      ...entry,
    };
    setSchedule([...schedule, newEntry]);
  };

  const deleteScheduleEntry = (entryId: string) => {
    setSchedule(schedule.filter((e) => e.id !== entryId));
  };

  const clearSchedule = () => {
    setSchedule([]);
  };

  const addSemesterGrade = (grade: Omit<SemesterGrade, 'id'>) => {
    const newGrade: SemesterGrade = {
      id: crypto.randomUUID(),
      ...grade,
    };
    setSemesterGrades([...semesterGrades, newGrade]);
  };

  const updateSemesterGrade = (gradeId: string, updates: Partial<SemesterGrade>) => {
    setSemesterGrades(
      semesterGrades.map((grade) =>
        grade.id === gradeId ? { ...grade, ...updates } : grade
      )
    );
  };

  const deleteSemesterGrade = (gradeId: string) => {
    setSemesterGrades(semesterGrades.filter((g) => g.id !== gradeId));
  };

  const updateCurrentSemester = (semester: number) => {
    setCurrentSemester(semester);
  };

  const resetData = () => {
    const freshSubjects = initializeSubjects();
    setSubjects(freshSubjects);
    setSchedule([]);
    setSemesterGrades([]);
    setCurrentSemester(9);
  };

  return {
    subjects,
    schedule,
    semesterGrades,
    currentSemester,
    addSubject,
    deleteSubject,
    updateSubject,
    addLecture,
    updateLectureStatus,
    deleteLecture,
    addPomodoroTime,
    addExam,
    updateExam,
    deleteExam,
    addAttendance,
    deleteAttendance,
    addScheduleEntry,
    deleteScheduleEntry,
    clearSchedule,
    addSemesterGrade,
    updateSemesterGrade,
    deleteSemesterGrade,
    updateCurrentSemester,
    resetData,
  };
}
