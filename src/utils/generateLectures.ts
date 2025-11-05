import { Subject, Lecture } from '../types/study';

export function generateLecturesFromClassification(subject: Omit<Subject, 'id' | 'lectures' | 'exams' | 'attendanceRecords'>): Lecture[] {
  const lectures: Lecture[] = [];

  // New approach: use lectureClassification
  if (subject.lectureClassification) {
    Object.entries(subject.lectureClassification).forEach(([category, topics]) => {
      if (Array.isArray(topics)) {
        topics.forEach(topic => {
          lectures.push({
            id: crypto.randomUUID(),
            name: topic,
            category: category, // Store the category for grouping
            status: 'not-started' as const,
            timeSpent: 0,
            pomodoroSessions: [],
          });
        });
      }
    });
    return lectures;
  }

  // Legacy support: For FMIMC and EBM - use midtermContent as lecture list
  if (Array.isArray(subject.midtermContent)) {
    return subject.midtermContent.map((topic, index) => ({
      id: crypto.randomUUID(),
      name: topic,
      status: 'not-started' as const,
      timeSpent: 0,
      pomodoroSessions: [],
    }));
  }

  // Legacy support: For OPTH - use chapters
  if (subject.classification?.chapters) {
    subject.classification.chapters.forEach(chapter => {
      chapter.lectures.forEach(lectureName => {
        lectures.push({
          id: crypto.randomUUID(),
          name: lectureName,
          status: 'not-started' as const,
          timeSpent: 0,
          pomodoroSessions: [],
        });
      });
    });
    return lectures;
  }

  // Legacy support: For ENT - use anatomical regions with topics
  if (subject.classification?.anatomicalRegions) {
    subject.classification.anatomicalRegions.forEach(region => {
      region.topics.forEach(topic => {
        lectures.push({
          id: crypto.randomUUID(),
          name: `${region.region}: ${topic}`,
          status: 'not-started' as const,
          timeSpent: 0,
          pomodoroSessions: [],
        });
      });
    });
    return lectures;
  }

  // Legacy support: For other subjects with categories
  if (subject.classification?.categories) {
    subject.classification.categories.forEach(category => {
      category.topics.forEach(topic => {
        lectures.push({
          id: crypto.randomUUID(),
          name: topic,
          status: 'not-started' as const,
          timeSpent: 0,
          pomodoroSessions: [],
        });
      });
    });
    return lectures;
  }

  return lectures;
}
