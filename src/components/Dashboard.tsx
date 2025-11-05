import { useState } from 'react';
import { Card } from './ui/card';
import { Subject } from '../types/study';
import { Clock, BookOpen, Target, TrendingUp, Calendar, AlertCircle, Award, Sparkles, Stethoscope, Eye, Ear, BarChart3, RefreshCw } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

// Icon mapping
const ICON_MAP: { [key: string]: any } = {
  'Stethoscope': Stethoscope,
  'Eye': Eye,
  'Ear': Ear,
  'BarChart3': BarChart3,
};

interface DashboardProps {
  subjects: Subject[];
  userName?: string;
  onResetData?: () => void;
}

export function Dashboard({ subjects, userName, onResetData }: DashboardProps) {
  const totalTime = subjects.reduce(
    (acc, subject) =>
      acc + subject.lectures.reduce((sum, lecture) => sum + lecture.timeSpent, 0),
    0
  );

  const totalLectures = subjects.reduce((acc, subject) => acc + subject.lectures.length, 0);
  const completedLectures = subjects.reduce(
    (acc, subject) => acc + subject.lectures.filter((l) => l.status === 'completed').length,
    0
  );
  const completionRate = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  const upcomingExams = subjects
    .flatMap((subject) =>
      subject.exams.map((exam) => ({
        ...exam,
        subjectName: subject.name,
        subjectColor: subject.color,
      }))
    )
    .filter((exam) => new Date(exam.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const attendanceWarnings = subjects.filter((subject) => {
    const totalAbsent = subject.attendanceRecords
      .filter((r) => r.status === 'absent')
      .reduce((sum, r) => sum + r.hours, 0);
    return subject.allowedAbsenceHours > 0 && totalAbsent >= subject.allowedAbsenceHours * 0.8;
  });

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
      {/* Info Alert for Fresh Data */}
      {subjects.length > 0 && subjects[0].lectures.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-teal-400/30 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 animate-scaleIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-500/30 flex items-center justify-center border border-teal-400/30">
              <Sparkles className="h-5 w-5 text-teal-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">All Subjects Loaded Successfully!</h3>
              <p className="text-white/70 text-sm">
                {subjects.length} subjects ready with {subjects.reduce((sum, s) => sum + s.lectures.length, 0)} learning items and {subjects.reduce((sum, s) => sum + s.exams.length, 0)} scheduled exams. Your surgical training command center is operational!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="glass-card rounded-3xl p-8 border border-teal-400/30 animate-scaleIn relative overflow-hidden shadow-2xl shadow-teal-500/10">
        <div className="absolute inset-0 animate-shimmer opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl text-white mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-teal-300 animate-pulse-glow" />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
                Welcome Back{userName ? `, ${userName}` : ', Surgeon'}!
              </span>
            </h1>
            <p className="text-white/70 text-lg tracking-wide">
              Your surgical operations training command center
            </p>
          </div>
          <div className="flex items-center gap-4">
            {onResetData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/30 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white text-xl">Reset All Data?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                      This will reload all subjects with fresh lecture data and exams. Your study progress, attendance, and grades will be cleared. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onResetData}
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0"
                    >
                      Reset Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="text-right">
              <p className="text-white/60 text-sm tracking-wide">Today</p>
              <p className="text-white text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-teal-400/60 hover-lift group relative overflow-hidden shadow-2xl shadow-teal-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/40 to-cyan-600/40 backdrop-blur-sm border-2 border-teal-300/50 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/50">
                <Clock className="h-7 w-7 text-teal-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1 tracking-wide">Total Study Time</p>
                <p className="text-4xl text-white drop-shadow-lg">{formatTime(totalTime)}</p>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-teal-500/50 to-cyan-600/50 rounded-full shadow-lg" />
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-emerald-400/60 hover-lift group relative overflow-hidden shadow-2xl shadow-emerald-500/30" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/40 to-green-600/40 backdrop-blur-sm border-2 border-emerald-300/50 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/50">
                <BookOpen className="h-7 w-7 text-emerald-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1 tracking-wide">Subjects</p>
                <p className="text-4xl text-white drop-shadow-lg">{subjects.length}</p>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-emerald-500/50 to-green-600/50 rounded-full shadow-lg" />
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-cyan-400/60 hover-lift group relative overflow-hidden shadow-2xl shadow-cyan-500/30" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-blue-600/40 backdrop-blur-sm border-2 border-cyan-300/50 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                <Target className="h-7 w-7 text-cyan-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1 tracking-wide">Lectures Completed</p>
                <p className="text-4xl text-white drop-shadow-lg">
                  {completedLectures}/{totalLectures}
                </p>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-cyan-500/50 to-blue-600/50 rounded-full shadow-lg" />
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-blue-400/60 hover-lift group relative overflow-hidden shadow-2xl shadow-blue-500/30" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/40 to-indigo-600/40 backdrop-blur-sm border-2 border-blue-300/50 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
                <TrendingUp className="h-7 w-7 text-blue-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1 tracking-wide">Progress</p>
                <p className="text-4xl text-white drop-shadow-lg">{completionRate.toFixed(0)}%</p>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Subject Progress Overview */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-slideInRight">
        <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
          <Award className="h-6 w-6 text-yellow-300 animate-pulse-glow" />
          Subject Progress
        </h2>
        <div className="space-y-6">
          {subjects.length === 0 ? (
            <div className="text-center py-16 animate-scaleIn">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
                <BookOpen className="h-10 w-10 text-white/40" />
              </div>
              <p className="text-white/60 text-lg">No subjects yet</p>
              <p className="text-white/40 text-sm">Add your first subject to get started!</p>
            </div>
          ) : (
            subjects.map((subject, index) => {
              const completed = subject.lectures.filter((l) => l.status === 'completed').length;
              const total = subject.lectures.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;

              const SubjectIcon = subject.icon ? ICON_MAP[subject.icon] : BookOpen;
              
              return (
                <div 
                  key={subject.id} 
                  className="stagger-item space-y-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all border border-white/10 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center animate-pulse-glow"
                        style={{ backgroundColor: subject.color }}
                      >
                        <SubjectIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-white text-lg">{subject.name}</span>
                        {subject.fullName && (
                          <p className="text-xs text-white/40">{subject.fullName}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/10 group-hover:bg-white/15 transition-all">
                      {completed}/{total} lectures • {formatTime(
                        subject.lectures.reduce((sum, l) => sum + l.timeSpent, 0)
                      )}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2.5" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed Subject Breakdown */}
      <div className="glass-card rounded-3xl p-8 border border-purple-400/30 animate-scaleIn">
        <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-purple-300 animate-pulse-glow" />
          Subject Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const SubjectIcon = subject.icon ? ICON_MAP[subject.icon] : BookOpen;
            const completed = subject.lectures.filter((l) => l.status === 'completed').length;
            const total = subject.lectures.length;
            const categories = subject.lectureClassification 
              ? Object.keys(subject.lectureClassification).length 
              : 0;
            
            return (
              <div
                key={subject.id}
                className="stagger-item glass-card rounded-2xl p-5 border border-white/20 hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: subject.color }}
                  >
                    <SubjectIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white">{subject.name}</h3>
                    {subject.fullName && (
                      <p className="text-[10px] text-white/40 mt-0.5">{subject.fullName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Total Items</span>
                    <span className="text-white font-medium">{total}</span>
                  </div>
                  {categories > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Categories</span>
                      <span className="text-white font-medium">{categories}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Completed</span>
                    <span className="text-green-300 font-medium">{completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Exams</span>
                    <span className="text-pink-300 font-medium">{subject.exams.length}</span>
                  </div>
                  
                  {subject.lectureClassification && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50 mb-2">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(subject.lectureClassification).slice(0, 3).map((cat, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/10"
                          >
                            {cat.length > 12 ? cat.substring(0, 12) + '...' : cat}
                          </span>
                        ))}
                        {Object.keys(subject.lectureClassification).length > 3 && (
                          <span className="text-[9px] px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/10">
                            +{Object.keys(subject.lectureClassification).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="glass-card rounded-3xl p-8 border border-pink-400/30 animate-slideInLeft">
          <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-pink-300 animate-pulse-glow" />
            Upcoming Exams
          </h2>
          <div className="space-y-4">
            {upcomingExams.length === 0 ? (
              <div className="text-center py-12 animate-scaleIn">
                <Calendar className="h-12 w-12 text-white/20 mx-auto mb-3 animate-float" />
                <p className="text-white/50">No upcoming exams scheduled</p>
              </div>
            ) : (
              upcomingExams.map((exam, index) => (
                <div
                  key={exam.id}
                  className="stagger-item flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-300/20 hover:from-pink-500/20 hover:to-purple-500/20 transition-all group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-1.5 h-16 rounded-full shadow-lg animate-pulse-glow"
                      style={{ backgroundColor: exam.subjectColor }}
                    />
                    <div>
                      <p className="text-white text-lg">{exam.name}</p>
                      <p className="text-white/60 text-sm">{exam.subjectName}</p>
                    </div>
                  </div>
                  <div className="text-right bg-white/10 px-4 py-2 rounded-xl border border-white/10 group-hover:bg-white/15 transition-all">
                    <p className="text-white text-sm">{new Date(exam.date).toLocaleDateString()}</p>
                    <p className="text-white/60 text-xs">{exam.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendance Warnings */}
        <div className="glass-card rounded-3xl p-8 border border-red-400/30 animate-slideInRight">
          <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-300 animate-pulse-glow" />
            Attendance Alerts
          </h2>
          <div className="space-y-4">
            {attendanceWarnings.length === 0 ? (
              <div className="text-center py-12 animate-scaleIn">
                <div className="w-16 h-16 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-green-300/30 animate-pulse-glow">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-white/50">All attendance looks good!</p>
              </div>
            ) : (
              attendanceWarnings.map((subject, index) => {
                const totalAbsent = subject.attendanceRecords
                  .filter((r) => r.status === 'absent')
                  .reduce((sum, r) => sum + r.hours, 0);
                const percentage = (totalAbsent / subject.allowedAbsenceHours) * 100;

                return (
                  <div
                    key={subject.id}
                    className="stagger-item flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-300/20 backdrop-blur-sm hover:from-red-500/20 hover:to-orange-500/20 transition-all"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-red-500/20 border border-red-300/30 animate-pulse-glow">
                        <AlertCircle className="h-5 w-5 text-red-300" />
                      </div>
                      <div>
                        <p className="text-white">{subject.name}</p>
                        <p className="text-white/60 text-sm">
                          {totalAbsent}h / {subject.allowedAbsenceHours}h absent
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl gradient-text">{percentage.toFixed(0)}%</p>
                      <p className="text-xs text-white/60">Used</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
