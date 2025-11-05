import { Subject } from '../types/study';
import { Button } from './ui/button';
import { ArrowLeft, BookOpen, Calendar, Clock, Target, TrendingUp, ChevronRight, Award, AlertCircle } from 'lucide-react';
import { Stethoscope, Eye, Ear, BarChart3 } from 'lucide-react';

// Icon mapping
const ICON_MAP: { [key: string]: any } = {
  'Stethoscope': Stethoscope,
  'Eye': Eye,
  'Ear': Ear,
  'BarChart3': BarChart3,
};

interface SubjectOverviewProps {
  subject: Subject;
  onBack: () => void;
  onViewLectures: () => void;
  onViewExams: () => void;
  onDeleteSubject: (subjectId: string) => void;
}

export function SubjectOverview({
  subject,
  onBack,
  onViewLectures,
  onViewExams,
  onDeleteSubject,
}: SubjectOverviewProps) {
  const SubjectIcon = subject.icon ? ICON_MAP[subject.icon] : BookOpen;
  
  const completedLectures = subject.lectures.filter((l) => l.status === 'completed').length;
  const totalLectures = subject.lectures.length;
  const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
  const totalTime = subject.lectures.reduce((sum, l) => sum + l.timeSpent, 0);
  
  const upcomingExams = subject.exams.filter((e) => new Date(e.date) >= new Date());
  const completedExams = subject.exams.filter((e) => new Date(e.date) < new Date());
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const daysUntilNextExam = upcomingExams.length > 0
    ? Math.ceil((new Date(upcomingExams[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate exam readiness
  const calculateReadiness = () => {
    if (upcomingExams.length === 0) return null;
    
    const nextExam = upcomingExams[0];
    let coveredLectures = 0;
    
    if (nextExam.includedLectures && nextExam.includedLectures.length > 0) {
      coveredLectures = nextExam.includedLectures.filter(lectureId =>
        subject.lectures.find(l => l.id === lectureId && l.status === 'completed')
      ).length;
      return Math.round((coveredLectures / nextExam.includedLectures.length) * 100);
    } else if (nextExam.coveragePercentage) {
      const targetLectures = Math.ceil((totalLectures * nextExam.coveragePercentage) / 100);
      return Math.round((completedLectures / targetLectures) * 100);
    } else {
      return Math.round(progress);
    }
  };

  const readiness = calculateReadiness();

  const getReadinessColor = (value: number) => {
    if (value >= 80) return 'from-green-500 to-emerald-600';
    if (value >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getReadinessStatus = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 50) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              if (confirm('Are you sure you want to delete this subject?')) {
                onDeleteSubject(subject.id);
                onBack();
              }
            }}
            className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
          >
            Delete Subject
          </Button>
        </div>

        <div className="flex items-start gap-6">
          <div
            className="w-24 h-24 rounded-2xl shadow-2xl flex items-center justify-center animate-pulse-glow"
            style={{ backgroundColor: subject.color }}
          >
            <SubjectIcon className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl text-white mb-2 gradient-text">{subject.name}</h1>
            {subject.fullName && (
              <p className="text-lg text-white/60 mb-4">{subject.fullName}</p>
            )}
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {subject.type && (
                <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
                  {subject.type}
                </span>
              )}
              {subject.difficulty && (
                <span className={`px-3 py-1 text-sm rounded-lg border ${
                  subject.difficulty === 'HIGH' 
                    ? 'bg-red-500/20 text-red-300 border-red-400/30'
                    : subject.difficulty === 'MEDIUM_HIGH'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                }`}>
                  Difficulty: {subject.difficulty}
                </span>
              )}
              {subject.priority && (
                <span className={`px-3 py-1 text-sm rounded-lg border ${
                  subject.priority === 'URGENT' 
                    ? 'bg-red-500/20 text-red-300 border-red-400/30'
                    : subject.priority === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                }`}>
                  Priority: {subject.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/20 animate-slideInLeft">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
              <BookOpen className="h-5 w-5 text-teal-300" />
            </div>
            <div>
              <p className="text-2xl text-white">{totalLectures}</p>
              <p className="text-xs text-white/60">Total Items</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Target className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <p className="text-2xl text-white">{completedLectures}</p>
              <p className="text-xs text-white/60">Completed</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <p className="text-2xl text-white">{formatTime(totalTime)}</p>
              <p className="text-xs text-white/60">Study Time</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
              <Calendar className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <p className="text-2xl text-white">{subject.exams.length}</p>
              <p className="text-xs text-white/60">Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cards - Lectures and Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lectures Card */}
        <div 
          onClick={onViewLectures}
          className="glass-card rounded-3xl p-8 border-2 border-blue-400/40 hover:border-blue-400/60 cursor-pointer hover-lift group relative overflow-hidden transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
                <BookOpen className="h-8 w-8 text-blue-300" />
              </div>
              <ChevronRight className="h-6 w-6 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-2xl text-white mb-2">Lectures & Content</h2>
            <p className="text-white/60 mb-6">
              Explore and track your learning materials organized by categories
            </p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Overall Progress</span>
                <span className="text-sm text-white font-medium">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Categories Preview */}
            {subject.lectureClassification && (
              <div>
                <p className="text-sm text-white/70 mb-3">Categories ({Object.keys(subject.lectureClassification).length})</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(subject.lectureClassification).slice(0, 4).map(([category, items]) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-200 rounded-lg border border-blue-400/30"
                    >
                      {category} ({items.length})
                    </span>
                  ))}
                  {Object.keys(subject.lectureClassification).length > 4 && (
                    <span className="px-3 py-1 text-xs bg-white/10 text-white/60 rounded-lg border border-white/10">
                      +{Object.keys(subject.lectureClassification).length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-blue-300">
              <span className="text-sm">View all lectures</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Exams Card */}
        <div 
          onClick={onViewExams}
          className="glass-card rounded-3xl p-8 border-2 border-pink-400/40 hover:border-pink-400/60 cursor-pointer hover-lift group relative overflow-hidden transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/30">
                <Calendar className="h-8 w-8 text-pink-300" />
              </div>
              <ChevronRight className="h-6 w-6 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-2xl text-white mb-2">Exams & Readiness</h2>
            <p className="text-white/60 mb-6">
              Track your exam schedule and preparation status
            </p>

            {/* Readiness Indicator */}
            {readiness !== null && daysUntilNextExam !== null && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-white/70">Next Exam Readiness</p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {upcomingExams[0].name} - in {daysUntilNextExam} day{daysUntilNextExam !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-white">{readiness}%</p>
                    <p className="text-xs text-white/60">{getReadinessStatus(readiness)}</p>
                  </div>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getReadinessColor(readiness)} rounded-full transition-all duration-500`}
                    style={{ width: `${readiness}%` }}
                  />
                </div>
              </div>
            )}

            {/* Exam Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-400/20">
                <p className="text-2xl text-white">{upcomingExams.length}</p>
                <p className="text-xs text-white/60">Upcoming</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                <p className="text-2xl text-white">{completedExams.length}</p>
                <p className="text-xs text-white/60">Completed</p>
              </div>
            </div>

            {daysUntilNextExam !== null && daysUntilNextExam <= 7 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-400/30 mb-4">
                <AlertCircle className="h-4 w-4 text-red-300" />
                <p className="text-xs text-red-300">
                  Exam approaching soon! Prepare now.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-pink-300">
              <span className="text-sm">Manage exams</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-slideInUp">
        <h2 className="text-2xl text-white mb-6">Subject Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subject.weight && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-yellow-300" />
                <p className="text-xs text-white/50">Weight</p>
              </div>
              <p className="text-xl text-white">{subject.weight} marks</p>
            </div>
          )}
          {subject.midtermDate && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-teal-300" />
                <p className="text-xs text-white/50">Midterm Date</p>
              </div>
              <p className="text-white">{new Date(subject.midtermDate).toLocaleDateString()}</p>
            </div>
          )}
          {subject.finalDate && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-pink-300" />
                <p className="text-xs text-white/50">Final Date</p>
              </div>
              <p className="text-white">{new Date(subject.finalDate).toLocaleDateString()}</p>
            </div>
          )}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <p className="text-xs text-white/50">Completion Rate</p>
            </div>
            <p className="text-xl text-white">{progress.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
