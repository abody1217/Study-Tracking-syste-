import { useState } from 'react';
import { Subject, Lecture } from '../types/study';
import { Button } from './ui/button';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { GroupedLecturesView } from './GroupedLecturesView';

interface SubjectLecturesPageProps {
  subject: Subject;
  onBack: () => void;
  onAddLecture: (subjectId: string, lectureName: string) => void;
  onUpdateLectureStatus: (subjectId: string, lectureId: string, status: any) => void;
  onDeleteLecture: (subjectId: string, lectureId: string) => void;
  onAddPomodoroTime: (subjectId: string, lectureId: string, duration: number, notes: string) => void;
  onStartPomodoro: (lecture: Lecture) => void;
}

export function SubjectLecturesPage({
  subject,
  onBack,
  onAddLecture,
  onUpdateLectureStatus,
  onDeleteLecture,
  onStartPomodoro,
}: SubjectLecturesPageProps) {
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [lectureName, setLectureName] = useState('');

  const handleAddLecture = () => {
    if (lectureName.trim()) {
      onAddLecture(subject.id, lectureName);
      setLectureName('');
      setShowAddLecture(false);
    }
  };

  const completedLectures = subject.lectures.filter((l) => l.status === 'completed').length;
  const totalLectures = subject.lectures.length;
  const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  // Helper to check if lecture is in midterm content
  const isInMidtermContent = (lectureName: string): boolean => {
    if (!subject.midtermContent) return false;
    
    if (Array.isArray(subject.midtermContent)) {
      return subject.midtermContent.some(topic => 
        lectureName.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(lectureName.toLowerCase())
      );
    } else {
      const allTopics = Object.values(subject.midtermContent).flat();
      return allTopics.some(topic => 
        lectureName.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(lectureName.toLowerCase())
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-scaleIn">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <Button 
            onClick={() => setShowAddLecture(true)} 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: subject.color }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl text-white mb-1 gradient-text">{subject.name} - Lectures</h1>
            <p className="text-white/60">
              {completedLectures} of {totalLectures} completed • {progress.toFixed(0)}% progress
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Lecture Form */}
      {showAddLecture && (
        <div className="glass-card rounded-2xl p-6 border border-white/20 animate-slideIn">
          <h3 className="text-white mb-4">Add New Lecture</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              placeholder="Enter lecture name"
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-blue-400/50 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAddLecture()}
              autoFocus
            />
            <Button 
              onClick={handleAddLecture} 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
            >
              Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAddLecture(false)} 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Lectures List */}
      {subject.lectures.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 border border-white/20 text-center animate-scaleIn">
          <BookOpen className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl text-white mb-2">No lectures yet</h3>
          <p className="text-white/50 mb-6">Add your first lecture to start tracking your progress</p>
          <Button 
            onClick={() => setShowAddLecture(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        </div>
      ) : subject.lectureClassification ? (
        <GroupedLecturesView
          lectures={subject.lectures}
          subjectId={subject.id}
          onUpdateLectureStatus={onUpdateLectureStatus}
          onDeleteLecture={onDeleteLecture}
          onStartPomodoro={onStartPomodoro}
          isInMidtermContent={isInMidtermContent}
        />
      ) : (
        <div className="glass-card rounded-3xl p-8 border border-white/20">
          <p className="text-white/60 text-center">
            Lectures are not yet organized into categories for this subject.
          </p>
        </div>
      )}
    </div>
  );
}
