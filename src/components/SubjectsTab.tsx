import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Subject } from '../types/study';
import { ChevronRight, Plus, Clock, BookOpen, Calendar, Stethoscope, Eye, Ear, BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import { AddSubjectDialog } from './AddSubjectDialog';
import { SubjectDetail } from './SubjectDetail';
import { SubjectOverview } from './SubjectOverview';
import { SubjectLecturesPage } from './SubjectLecturesPage';
import { SubjectExamsPage } from './SubjectExamsPage';
import { Lecture } from '../types/study';

// Icon mapping
const ICON_MAP: { [key: string]: any } = {
  'Stethoscope': Stethoscope,
  'Eye': Eye,
  'Ear': Ear,
  'BarChart3': BarChart3,
};

interface SubjectsTabProps {
  subjects: Subject[];
  onAddSubject: (name: string, color: string, allowedAbsenceHours: number) => void;
  onDeleteSubject: (subjectId: string) => void;
  onUpdateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  onAddLecture: (subjectId: string, lectureName: string) => void;
  onUpdateLectureStatus: (subjectId: string, lectureId: string, status: any) => void;
  onDeleteLecture: (subjectId: string, lectureId: string) => void;
  onAddPomodoroTime: (subjectId: string, lectureId: string, duration: number, notes: string) => void;
  onAddExam: (subjectId: string, exam: any) => void;
  onUpdateExam: (subjectId: string, examId: string, updates: any) => void;
  onDeleteExam: (subjectId: string, examId: string) => void;
}

export function SubjectsTab({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubject,
  onAddLecture,
  onUpdateLectureStatus,
  onDeleteLecture,
  onAddPomodoroTime,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
}: SubjectsTabProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'lectures' | 'exams'>('overview');
  const [activePomodoroLecture, setActivePomodoroLecture] = useState<Lecture | null>(null);

  // New navigation flow
  if (selectedSubject) {
    if (currentView === 'lectures') {
      return (
        <SubjectLecturesPage
          subject={selectedSubject}
          onBack={() => setCurrentView('overview')}
          onAddLecture={onAddLecture}
          onUpdateLectureStatus={onUpdateLectureStatus}
          onDeleteLecture={onDeleteLecture}
          onAddPomodoroTime={onAddPomodoroTime}
          onStartPomodoro={setActivePomodoroLecture}
        />
      );
    }

    if (currentView === 'exams') {
      return (
        <SubjectExamsPage
          subject={selectedSubject}
          onBack={() => setCurrentView('overview')}
          onAddExam={onAddExam}
          onUpdateExam={onUpdateExam}
          onDeleteExam={onDeleteExam}
        />
      );
    }

    return (
      <SubjectOverview
        subject={selectedSubject}
        onBack={() => {
          setSelectedSubject(null);
          setCurrentView('overview');
        }}
        onViewLectures={() => setCurrentView('lectures')}
        onViewExams={() => setCurrentView('exams')}
        onDeleteSubject={onDeleteSubject}
      />
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl text-white mb-2 gradient-text">Your Subjects</h2>
            <p className="text-white/60">
              Manage your subjects, lectures, and exams
            </p>
          </div>
          <AddSubjectDialog onAddSubject={onAddSubject} />
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 border border-white/20 text-center animate-scaleIn">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-purple-300/30 animate-float">
              <Plus className="h-12 w-12 text-white/60" />
            </div>
            <div>
              <h3 className="text-2xl text-white mb-3 gradient-text">No subjects yet</h3>
              <p className="text-white/60 mb-6">
                Start by adding your first subject to track your academic progress
              </p>
              <AddSubjectDialog onAddSubject={onAddSubject} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const totalLectures = subject.lectures.length;
            const completedLectures = subject.lectures.filter((l) => l.status === 'completed').length;
            const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
            const totalTime = subject.lectures.reduce((sum, l) => sum + l.timeSpent, 0);
            const upcomingExams = subject.exams.filter(
              (e) => new Date(e.date) >= new Date()
            ).length;

            const SubjectIcon = subject.icon ? ICON_MAP[subject.icon] : BookOpen;
            const daysUntilMidterm = subject.midtermDate 
              ? Math.ceil((new Date(subject.midtermDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={subject.id}
                className="stagger-item glass-card rounded-2xl p-6 border border-white/20 cursor-pointer hover-lift group relative overflow-hidden"
                onClick={() => setSelectedSubject(subject)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-5 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center animate-pulse-glow"
                        style={{ backgroundColor: subject.color }}
                      >
                        <SubjectIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl text-white">{subject.name}</h3>
                        {subject.fullName && (
                          <p className="text-xs text-white/50 mt-0.5">{subject.fullName}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {/* Metadata badges */}
                  {(subject.type || subject.difficulty || subject.priority) && (
                    <div className="flex flex-wrap gap-2">
                      {subject.type && (
                        <span className="px-2 py-1 text-[10px] bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
                          {subject.type}
                        </span>
                      )}
                      {subject.difficulty && (
                        <span className={`px-2 py-1 text-[10px] rounded-lg border ${
                          subject.difficulty === 'HIGH' 
                            ? 'bg-red-500/20 text-red-300 border-red-400/30'
                            : subject.difficulty === 'MEDIUM_HIGH'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                        }`}>
                          {subject.difficulty}
                        </span>
                      )}
                      {subject.priority && (
                        <span className={`px-2 py-1 text-[10px] rounded-lg border ${
                          subject.priority === 'URGENT' 
                            ? 'bg-red-500/20 text-red-300 border-red-400/30'
                            : subject.priority === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                        }`}>
                          {subject.priority}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Midterm countdown */}
                  {daysUntilMidterm !== null && daysUntilMidterm >= 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-teal-500/10 rounded-lg border border-teal-400/30">
                      <AlertCircle className="h-4 w-4 text-teal-300" />
                      <p className="text-xs text-teal-300">
                        Midterm in <span className="font-bold">{daysUntilMidterm}</span> day{daysUntilMidterm !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>Progress</span>
                      <span className="gradient-text">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-2" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-3 border border-purple-300/20 hover:border-purple-300/40 transition-all">
                      <div className="flex items-center gap-2 text-white/60 mb-1">
                        <BookOpen className="h-3 w-3 text-purple-300" />
                        <p className="text-xs">Total Lectures</p>
                      </div>
                      <p className="text-white text-lg">
                        {subject.totalLectures || totalLectures}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-3 border border-pink-300/20 hover:border-pink-300/40 transition-all">
                      <div className="flex items-center gap-2 text-white/60 mb-1">
                        <TrendingUp className="h-3 w-3 text-pink-300" />
                        <p className="text-xs">Weight</p>
                      </div>
                      <p className="text-white text-lg">{subject.weight || '-'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl p-3 border border-orange-300/20 hover:border-orange-300/40 transition-all">
                      <div className="flex items-center gap-2 text-white/60 mb-1">
                        <Clock className="h-3 w-3 text-orange-300" />
                        <p className="text-xs">Study Time</p>
                      </div>
                      <p className="text-white text-lg">{formatTime(totalTime)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-3 border border-green-300/20 hover:border-green-300/40 transition-all">
                      <div className="flex items-center gap-2 text-white/60 mb-1">
                        <Calendar className="h-3 w-3 text-green-300" />
                        <p className="text-xs">Exams</p>
                      </div>
                      <p className="text-white text-lg">{subject.exams.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
