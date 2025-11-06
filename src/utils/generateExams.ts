import { Subject, Exam, Lecture } from '../types/study';

export function generateExamsFromDates(
  subject: Omit<Subject, 'id' | 'lectures' | 'exams' | 'attendanceRecords'>, 
  lectures: Lecture[]
): Exam[] {
  const exams: Exam[] = [];

  // Add midterm exam
  if (subject.midtermDate) {
    const midtermTopics = subject.midtermContent 
      ? (Array.isArray(subject.midtermContent) 
          ? subject.midtermContent 
          : Object.values(subject.midtermContent).flat())
      : [];
    
    // Find lecture IDs that match midterm content
    const midtermLectureIds = lectures
      .filter(lecture => {
        return midtermTopics.some(topic => 
          lecture.name.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(lecture.name.toLowerCase())
        );
      })
      .map(l => l.id);
    
    exams.push({
      id: crypto.randomUUID(),
      name: '📋 Midterm / Continuous Exam',
      type: 'MIDTERM',
      date: subject.midtermDate,
      time: '09:00',
      totalScore: subject.gradeDistribution?.midterm || 100,
      includedLectures: midtermLectureIds,
      coveragePercentage: midtermTopics.length > 0 
        ? Math.round((midtermTopics.length / (subject.totalLectures || lectures.length)) * 100)
        : 50,
    });
  }

  // Add final exam
  if (subject.finalDate) {
    exams.push({
      id: crypto.randomUUID(),
      name: '🎓 Final Exam',
      type: 'FINAL',
      date: subject.finalDate,
      time: '09:00',
      totalScore: subject.gradeDistribution?.finalMCQ || subject.gradeDistribution?.finalEssay || 100,
      includedLectures: lectures.map(l => l.id), // All lectures for final
      coveragePercentage: 100,
    });
  }

  return exams;
}
