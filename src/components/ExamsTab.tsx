import { useState } from 'react';
import { Subject, Exam } from '../types/study';
import { Calendar, Clock, AlertCircle, CheckCircle2, BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface ExamsTabProps {
  subjects: Subject[];
}

export function ExamsTab({ subjects }: ExamsTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Get all exams with subject info
  const allExams = subjects.flatMap((subject) =>
    subject.exams.map((exam) => {
      const totalLectures = subject.lectures.length;
      const completedLectures = subject.lectures.filter((l) => l.status === 'completed').length;
      
      // Calculate preparation based on coverage
      let preparationPercentage = 0;
      if (exam.includedLectures && exam.includedLectures.length > 0) {
        // Specific lectures included
        const includedCompleted = subject.lectures.filter(
          (l) => exam.includedLectures?.includes(l.id) && l.status === 'completed'
        ).length;
        preparationPercentage = (includedCompleted / exam.includedLectures.length) * 100;
      } else if (exam.coveragePercentage) {
        // Partial coverage percentage
        const expectedLectures = Math.ceil(totalLectures * (exam.coveragePercentage / 100));
        preparationPercentage = expectedLectures > 0 ? (completedLectures / expectedLectures) * 100 : 0;
      } else {
        // Full curriculum
        preparationPercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
      }

      const daysUntil = Math.ceil(
        (new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...exam,
        subjectName: subject.name,
        subjectColor: subject.color,
        preparationPercentage: Math.min(preparationPercentage, 100),
        daysUntil,
        isPast: new Date(exam.date) < new Date(),
        isUpcoming: new Date(exam.date) >= new Date(),
        totalLectures,
        completedLectures,
        includedLectureCount: exam.includedLectures?.length || 
                             (exam.coveragePercentage ? Math.ceil(totalLectures * (exam.coveragePercentage / 100)) : totalLectures),
      };
    })
  );

  // Filter exams
  const filteredExams = allExams.filter((exam) => {
    if (selectedFilter === 'upcoming') return exam.isUpcoming;
    if (selectedFilter === 'past') return exam.isPast;
    return true;
  });

  // Sort exams by date
  const sortedExams = [...filteredExams].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return selectedFilter === 'past' ? dateB - dateA : dateA - dateB;
  });

  // Get urgent exams (within 7 days)
  const urgentExams = allExams.filter(
    (exam) => exam.isUpcoming && exam.daysUntil <= 7 && exam.daysUntil >= 0
  );

  // Calculate overall preparation
  const upcomingExams = allExams.filter((e) => e.isUpcoming);
  const avgPreparation = upcomingExams.length > 0
    ? upcomingExams.reduce((sum, e) => sum + e.preparationPercentage, 0) / upcomingExams.length
    : 0;

  const wellPrepared = upcomingExams.filter((e) => e.preparationPercentage >= 80).length;
  const needsWork = upcomingExams.filter((e) => e.preparationPercentage < 50).length;

  const getPreparationStatus = (percentage: number) => {
    if (percentage >= 80) return { label: 'Well Prepared', color: 'text-green-300', bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-300/30' };
    if (percentage >= 50) return { label: 'In Progress', color: 'text-yellow-300', bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-300/30' };
    return { label: 'Needs Work', color: 'text-red-300', bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-300/30' };
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'from-red-500/20 to-orange-500/20 border-red-400/40';
    if (days <= 7) return 'from-orange-500/20 to-yellow-500/20 border-orange-400/40';
    return 'from-blue-500/20 to-purple-500/20 border-blue-400/40';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/30 animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-20" />
        <div className="relative z-10">
          <h2 className="text-3xl text-white mb-2 gradient-text flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-300 animate-pulse-glow" />
            Exam Preparation Tracker
          </h2>
          <p className="text-white/80 text-lg">
            Monitor your preparation status and upcoming exams
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-item glass-card rounded-2xl p-6 border border-blue-400/30 hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-300/30 animate-pulse-glow">
                <Calendar className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Upcoming</p>
                <p className="text-3xl text-white">{upcomingExams.length}</p>
              </div>
            </div>
            <p className="text-xs text-white/60">Exams scheduled</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-purple-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-300/30 animate-pulse-glow">
                <Target className="h-6 w-6 text-purple-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Avg Preparation</p>
                <p className="text-3xl text-white">{avgPreparation.toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-xs text-white/60">Overall readiness</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-green-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-300/30 animate-pulse-glow">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Well Prepared</p>
                <p className="text-3xl text-white">{wellPrepared}</p>
              </div>
            </div>
            <p className="text-xs text-white/60">80%+ readiness</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-red-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 backdrop-blur-sm border border-red-300/30 animate-pulse-glow">
                <AlertCircle className="h-6 w-6 text-red-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Needs Focus</p>
                <p className="text-3xl text-white">{needsWork}</p>
              </div>
            </div>
            <p className="text-xs text-white/60">Below 50% ready</p>
          </div>
        </div>
      </div>

      {/* Urgent Exams Alert */}
      {urgentExams.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-red-400/40 animate-pulse-glow bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-300/30 animate-pulse-glow">
              <AlertCircle className="h-6 w-6 text-red-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-white mb-2">⚠️ Urgent: Exams Within 7 Days</h3>
              <div className="space-y-2">
                {urgentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between text-white/90 bg-white/5 p-3 rounded-xl border border-white/10">
                    <span>{exam.subjectName} - {exam.name}</span>
                    <span className="text-red-300">
                      {exam.daysUntil === 0 ? 'Today!' : exam.daysUntil === 1 ? 'Tomorrow' : `In ${exam.daysUntil} days`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-3 animate-slideInLeft">
        <Button
          onClick={() => setSelectedFilter('upcoming')}
          className={`transition-all ${
            selectedFilter === 'upcoming'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Upcoming ({upcomingExams.length})
        </Button>
        <Button
          onClick={() => setSelectedFilter('past')}
          className={`transition-all ${
            selectedFilter === 'past'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Past ({allExams.filter((e) => e.isPast).length})
        </Button>
        <Button
          onClick={() => setSelectedFilter('all')}
          className={`transition-all ${
            selectedFilter === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          All ({allExams.length})
        </Button>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {sortedExams.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 border border-white/20 text-center animate-scaleIn">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center animate-float border border-purple-300/30">
              <Calendar className="h-10 w-10 text-white/60" />
            </div>
            <p className="text-white/70 text-lg mb-2">No {selectedFilter} exams</p>
            <p className="text-white/50">Add exams from the Subjects tab to track your preparation</p>
          </div>
        ) : (
          sortedExams.map((exam, index) => {
            const status = getPreparationStatus(exam.preparationPercentage);
            const isUrgent = exam.isUpcoming && exam.daysUntil <= 7;
            
            return (
              <div
                key={exam.id}
                className={`stagger-item glass-card rounded-2xl p-6 border backdrop-blur-sm hover-lift ${
                  exam.isPast ? 'opacity-75' : ''
                } ${isUrgent && !exam.isPast ? getUrgencyColor(exam.daysUntil) : 'border-white/20'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-1.5 h-20 rounded-full shadow-lg animate-pulse-glow"
                        style={{ backgroundColor: exam.subjectColor }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl text-white">{exam.name}</h3>
                          {exam.isPast && exam.score !== undefined && (
                            <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-300/30">
                              {exam.score}/{exam.totalScore}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 text-lg mb-1">{exam.subjectName}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(exam.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {exam.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {exam.isUpcoming && (
                        <div className={`text-sm px-3 py-1 rounded-full border mb-2 inline-block ${
                          exam.daysUntil <= 3 
                            ? 'bg-red-500/20 text-red-300 border-red-300/30 animate-pulse-glow' 
                            : exam.daysUntil <= 7
                            ? 'bg-orange-500/20 text-orange-300 border-orange-300/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-300/30'
                        }`}>
                          {exam.daysUntil === 0 ? '🔥 Today!' : 
                           exam.daysUntil === 1 ? '⚡ Tomorrow' : 
                           `📅 In ${exam.daysUntil} days`}
                        </div>
                      )}
                    </div>
                  </div>

                  {exam.isUpcoming && (
                    <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-white/70" />
                          <span className="text-white/90">Preparation Status</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${status.bg} border ${status.border}`}>
                          <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse-glow`} />
                          <span className={`text-sm ${status.color}`}>{status.label}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <span>
                            {exam.completedLectures} of {exam.includedLectureCount} lectures completed
                            {exam.coveragePercentage && exam.coveragePercentage < 100 && (
                              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-300/30">
                                {exam.coveragePercentage}% coverage
                              </span>
                            )}
                          </span>
                          <span className="text-white">{exam.preparationPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={exam.preparationPercentage} className="h-3" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        </div>
                      </div>

                      {exam.preparationPercentage < 100 && (
                        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-300/20 rounded-lg p-3">
                          <TrendingUp className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-200">
                            {exam.preparationPercentage < 50 
                              ? `Focus on completing ${exam.includedLectureCount - exam.completedLectures} more lectures to be well-prepared!`
                              : exam.preparationPercentage < 80
                              ? `You're making good progress! ${exam.includedLectureCount - exam.completedLectures} lectures left.`
                              : `Almost there! Just ${exam.includedLectureCount - exam.completedLectures} more lectures to go.`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
