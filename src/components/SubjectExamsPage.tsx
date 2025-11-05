import { Subject, Exam } from '../types/study';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, Clock, Award, Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface SubjectExamsPageProps {
  subject: Subject;
  onBack: () => void;
  onAddExam: (subjectId: string, exam: Omit<Exam, 'id'>) => void;
  onUpdateExam: (subjectId: string, examId: string, updates: Partial<Exam>) => void;
  onDeleteExam: (subjectId: string, examId: string) => void;
}

export function SubjectExamsPage({
  subject,
  onBack,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
}: SubjectExamsPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getExamStatus = (exam: Exam) => {
    const days = getDaysUntil(exam.date);
    if (days < 0) return 'past';
    if (days === 0) return 'today';
    if (days <= 7) return 'urgent';
    if (days <= 14) return 'soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'past':
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      case 'today':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'urgent':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'soon':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MIDTERM':
        return <Target className="h-5 w-5" />;
      case 'FINAL_MCQ':
      case 'FINAL_ESSAY':
      case 'FINAL':
        return <Award className="h-5 w-5" />;
      case 'OSCE':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  // Calculate overall readiness
  const completedLectures = subject.lectures.filter(l => l.status === 'completed').length;
  const totalLectures = subject.lectures.length;
  const overallProgress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  const upcomingExams = subject.exams
    .filter(e => getDaysUntil(e.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastExams = subject.exams
    .filter(e => getDaysUntil(e.date) < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalMarks = subject.gradeDistribution?.total || subject.exams.reduce((sum, e) => sum + e.totalScore, 0);
  const earnedMarks = subject.exams
    .filter(e => e.score !== undefined)
    .reduce((sum, e) => sum + (e.score || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 animate-scaleIn">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>

        <div className="flex items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: subject.color }}
          >
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl text-white mb-2 gradient-text">{subject.name} - Exams</h1>
            <p className="text-white/60 mb-4">
              Track your exam schedule and monitor your preparation
            </p>
            
            {/* Grade Distribution */}
            {subject.gradeDistribution && (
              <div className="flex flex-wrap gap-2">
                {subject.gradeDistribution.midterm > 0 && (
                  <span className="px-3 py-1 text-sm bg-teal-500/20 text-teal-300 rounded-lg border border-teal-400/30">
                    Midterm: {subject.gradeDistribution.midterm} marks
                  </span>
                )}
                {subject.gradeDistribution.finalMCQ > 0 && (
                  <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
                    MCQ: {subject.gradeDistribution.finalMCQ} marks
                  </span>
                )}
                {subject.gradeDistribution.finalEssay > 0 && (
                  <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-lg border border-purple-400/30">
                    Essay: {subject.gradeDistribution.finalEssay} marks
                  </span>
                )}
                {subject.gradeDistribution.osce > 0 && (
                  <span className="px-3 py-1 text-sm bg-pink-500/20 text-pink-300 rounded-lg border border-pink-400/30">
                    OSCE: {subject.gradeDistribution.osce} marks
                  </span>
                )}
                {subject.gradeDistribution.activity > 0 && (
                  <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-400/30">
                    Activity: {subject.gradeDistribution.activity} marks
                  </span>
                )}
                <span className="px-3 py-1 text-sm bg-white/20 text-white rounded-lg border border-white/30 font-bold">
                  Total: {subject.gradeDistribution.total} marks
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Readiness Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 border border-white/20 animate-slideInLeft">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
            <div>
              <p className="text-sm text-white/60">Overall Readiness</p>
              <p className="text-3xl text-white">{overallProgress.toFixed(0)}%</p>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <Calendar className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-white/60">Upcoming Exams</p>
              <p className="text-3xl text-white">{upcomingExams.length}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">
            {upcomingExams.length > 0 
              ? `Next in ${getDaysUntil(upcomingExams[0].date)} days` 
              : 'No upcoming exams'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
              <Award className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-white/60">Score Progress</p>
              <p className="text-3xl text-white">{earnedMarks}/{totalMarks}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">
            {((earnedMarks / totalMarks) * 100).toFixed(1)}% of total marks
          </p>
        </div>
      </div>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-white/20 animate-slideInUp">
          <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-300" />
            Upcoming Exams
          </h2>
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => {
              const status = getExamStatus(exam);
              const daysUntil = getDaysUntil(exam.date);
              
              return (
                <div
                  key={exam.id}
                  className="stagger-item p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="p-3 rounded-xl"
                        style={{ 
                          backgroundColor: `${subject.color}20`,
                          borderColor: `${subject.color}40`,
                          border: '1px solid'
                        }}
                      >
                        {getTypeIcon(exam.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white text-lg">{exam.name}</h3>
                          <Badge className={`${getStatusColor(status)} border text-xs`}>
                            {daysUntil === 0 ? 'TODAY' : `${daysUntil} days`}
                          </Badge>
                          {exam.multiDay && (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                              Multi-Day
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60 mb-2">{formatDate(exam.date)}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exam.time}
                          </span>
                          {exam.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exam.duration}
                            </span>
                          )}
                          {exam.location && (
                            <span className="text-xs bg-white/10 px-2 py-1 rounded">
                              {exam.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-white mb-1">{exam.totalScore}</div>
                      <div className="text-xs text-white/50">marks</div>
                    </div>
                  </div>

                  {status === 'urgent' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-400/30">
                      <AlertCircle className="h-4 w-4 text-red-300" />
                      <p className="text-xs text-red-300">
                        Exam is approaching! Make sure you're prepared.
                      </p>
                    </div>
                  )}

                  {exam.multiDay && exam.endDate && (
                    <div className="mt-3 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-400/30">
                      <p className="text-xs text-purple-300">
                        Runs from {formatDate(exam.date)} to {formatDate(exam.endDate)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-white/20 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-300" />
            Completed Exams
          </h2>
          <div className="space-y-3">
            {pastExams.map((exam, index) => (
              <div
                key={exam.id}
                className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${subject.color}20`,
                        borderColor: `${subject.color}40`,
                        border: '1px solid'
                      }}
                    >
                      {getTypeIcon(exam.type)}
                    </div>
                    <div>
                      <h3 className="text-white">{exam.name}</h3>
                      <p className="text-xs text-white/50">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {exam.score !== undefined ? (
                      <div>
                        <p className="text-lg text-white">
                          {exam.score}/{exam.totalScore}
                        </p>
                        <p className="text-xs text-white/50">
                          {((exam.score / exam.totalScore) * 100).toFixed(1)}%
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-white/50">Not graded</p>
                        <p className="text-xs text-white/40">Out of {exam.totalScore}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
