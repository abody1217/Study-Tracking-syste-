import { Lecture, LectureStatus } from '../types/study';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Timer, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useState } from 'react';

interface GroupedLecturesViewProps {
  lectures: Lecture[];
  subjectId: string;
  onUpdateLectureStatus: (subjectId: string, lectureId: string, status: LectureStatus) => void;
  onDeleteLecture: (subjectId: string, lectureId: string) => void;
  onStartPomodoro: (lecture: Lecture) => void;
  isInMidtermContent?: (lectureName: string) => boolean;
}

export function GroupedLecturesView({
  lectures,
  subjectId,
  onUpdateLectureStatus,
  onDeleteLecture,
  onStartPomodoro,
  isInMidtermContent,
}: GroupedLecturesViewProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Group lectures by category
  const groupedLectures = lectures.reduce((acc, lecture) => {
    const category = lecture.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lecture);
    return acc;
  }, {} as Record<string, Lecture[]>);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStatusColor = (status: LectureStatus) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-500/20 text-gray-200 border-gray-400/20';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/20';
      case 'completed':
        return 'bg-green-500/20 text-green-200 border-green-400/20';
      case 'review':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/20';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-400/20';
    }
  };

  const getStatusLabel = (status: LectureStatus) => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'review':
        return 'Review';
      default:
        return status;
    }
  };

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const getCategoryStats = (categoryLectures: Lecture[]) => {
    const completed = categoryLectures.filter(l => l.status === 'completed').length;
    const total = categoryLectures.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalTime = categoryLectures.reduce((sum, l) => sum + l.timeSpent, 0);
    return { completed, total, percentage, totalTime };
  };

  const getCategoryColor = (categoryName: string): string => {
    // Predefined colors for common categories
    const categoryColors: Record<string, string> = {
      'Community': '#14b8a6',
      'Psychiatry': '#8b5cf6',
      'Gynecology': '#ec4899',
      'Geriatrics': '#f59e0b',
      'Internal Medicine': '#3b82f6',
      'Pediatrics': '#10b981',
      'Forensic': '#ef4444',
      'Orthopedics': '#6366f1',
      'Pharmacology': '#06b6d4',
      'Dermatology': '#f97316',
      'Clinical Sessions': '#a855f7',
      'Theoretical Lectures': '#06b6d4',
      'EAR': '#14b8a6',
      'NOSE': '#3b82f6',
      'THROAT': '#8b5cf6',
      'Foundational': '#f59e0b',
      'Core Lectures': '#3b82f6',
    };
    
    return categoryColors[categoryName] || '#6366f1';
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedLectures).map(([category, categoryLectures]) => {
        const stats = getCategoryStats(categoryLectures);
        const isCollapsed = collapsedCategories.has(category);
        const categoryColor = getCategoryColor(category);

        return (
          <div key={category} className="glass-card rounded-2xl border border-white/20 overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColor }}
                />
                <div className="text-left flex-1">
                  <h3 className="text-white text-lg flex items-center gap-2">
                    {category}
                    <span className="text-xs text-white/50">({stats.total} items)</span>
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {stats.completed}/{stats.total} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(stats.totalTime)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <div className="text-2xl text-white">{stats.percentage}%</div>
                  <div className="text-xs text-white/50">Progress</div>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-white/60" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-white/60" />
                )}
              </div>
            </button>

            {/* Progress Bar */}
            {!isCollapsed && (
              <div className="px-5 pb-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.percentage}%`,
                      backgroundColor: categoryColor
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lectures List */}
            {!isCollapsed && (
              <div className="px-5 pb-5 space-y-2">
                {categoryLectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {lecture.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-300 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-white/30 flex-shrink-0" />
                          )}
                          <p className="text-white">{lecture.name}</p>
                          {isInMidtermContent && isInMidtermContent(lecture.name) && (
                            <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 text-[10px] px-2 py-0">
                              MIDTERM
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60 ml-6">
                          {formatTime(lecture.timeSpent)} • {lecture.pomodoroSessions.length} sessions
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStartPomodoro(lecture)}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/20 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30"
                        >
                          <Timer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteLecture(subjectId, lecture.id)}
                          className="text-red-200 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap ml-6">
                      <span className="text-sm text-white/70">Status:</span>
                      <Select
                        value={lecture.status}
                        onValueChange={(value) =>
                          onUpdateLectureStatus(subjectId, lecture.id, value as LectureStatus)
                        }
                      >
                        <SelectTrigger className="w-[140px] h-8 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20 text-white">
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge className={`${getStatusColor(lecture.status)} border`}>
                        {getStatusLabel(lecture.status)}
                      </Badge>
                    </div>
                    {lecture.pomodoroSessions.length > 0 && (
                      <details className="text-sm mt-3 ml-6">
                        <summary className="cursor-pointer text-white/60 hover:text-white/80 transition-colors">
                          View session notes ({lecture.pomodoroSessions.length})
                        </summary>
                        <div className="mt-3 space-y-2">
                          {lecture.pomodoroSessions.map((session) => (
                            <div key={session.id} className="border-l-2 border-purple-400/30 pl-4 py-2 bg-white/5 rounded-r-lg">
                              <p className="text-xs text-white/50 mb-1">
                                {new Date(session.completedAt).toLocaleDateString()} • {session.duration}min
                              </p>
                              {session.notes && <p className="text-white/80">{session.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
