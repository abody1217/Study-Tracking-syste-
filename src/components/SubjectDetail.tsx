import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Subject, Lecture, LectureStatus, Exam } from '../types/study';
import { ArrowLeft, Plus, Timer, Trash2, Calendar, Award, BookOpen, List, Stethoscope, Eye, Ear, BarChart3 } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SubjectClassificationView } from './SubjectClassificationView';
import { GroupedLecturesView } from './GroupedLecturesView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Icon mapping
const ICON_MAP: { [key: string]: any } = {
  'Stethoscope': Stethoscope,
  'Eye': Eye,
  'Ear': Ear,
  'BarChart3': BarChart3,
};

interface SubjectDetailProps {
  subject: Subject;
  onBack: () => void;
  onDeleteSubject: (subjectId: string) => void;
  onUpdateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  onAddLecture: (subjectId: string, lectureName: string) => void;
  onUpdateLectureStatus: (subjectId: string, lectureId: string, status: LectureStatus) => void;
  onDeleteLecture: (subjectId: string, lectureId: string) => void;
  onAddPomodoroTime: (subjectId: string, lectureId: string, duration: number, notes: string) => void;
  onAddExam: (subjectId: string, exam: Omit<Exam, 'id'>) => void;
  onUpdateExam: (subjectId: string, examId: string, updates: Partial<Exam>) => void;
  onDeleteExam: (subjectId: string, examId: string) => void;
}

export function SubjectDetail({
  subject,
  onBack,
  onDeleteSubject,
  onAddLecture,
  onUpdateLectureStatus,
  onDeleteLecture,
  onAddPomodoroTime,
  onAddExam,
  onDeleteExam,
}: SubjectDetailProps) {
  const [activePomodoroLecture, setActivePomodoroLecture] = useState<Lecture | null>(null);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [lectureName, setLectureName] = useState('');
  const [showAddExam, setShowAddExam] = useState(false);
  const [examForm, setExamForm] = useState({
    name: '',
    date: '',
    time: '',
    score: '',
    totalScore: '',
    coverageType: 'full', // 'full', 'percentage', 'specific'
    coveragePercentage: '',
    selectedLectures: [] as string[],
  });

  const handleAddLecture = () => {
    if (lectureName.trim()) {
      onAddLecture(subject.id, lectureName);
      setLectureName('');
      setShowAddLecture(false);
    }
  };

  const handleAddExam = () => {
    if (examForm.name && examForm.date && examForm.time) {
      const examData: any = {
        name: examForm.name,
        date: examForm.date,
        time: examForm.time,
        score: examForm.score ? parseFloat(examForm.score) : undefined,
        totalScore: examForm.totalScore ? parseFloat(examForm.totalScore) : undefined,
      };

      if (examForm.coverageType === 'percentage' && examForm.coveragePercentage) {
        examData.coveragePercentage = parseFloat(examForm.coveragePercentage);
      } else if (examForm.coverageType === 'specific' && examForm.selectedLectures.length > 0) {
        examData.includedLectures = examForm.selectedLectures;
      }

      onAddExam(subject.id, examData);
      setExamForm({ 
        name: '', 
        date: '', 
        time: '', 
        score: '', 
        totalScore: '',
        coverageType: 'full',
        coveragePercentage: '',
        selectedLectures: [],
      });
      setShowAddExam(false);
    }
  };

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

  const [activeTab, setActiveTab] = useState('overview');
  const SubjectIcon = subject.icon ? ICON_MAP[subject.icon] : BookOpen;
  
  const totalTime = subject.lectures.reduce((sum, l) => sum + l.timeSpent, 0);
  const completedLectures = subject.lectures.filter((l) => l.status === 'completed').length;
  const progress =
    subject.lectures.length > 0 ? (completedLectures / subject.lectures.length) * 100 : 0;
  
  // Helper to check if lecture is in midterm content
  const isInMidtermContent = (lectureName: string): boolean => {
    if (!subject.midtermContent) return false;
    
    if (Array.isArray(subject.midtermContent)) {
      return subject.midtermContent.some(topic => 
        lectureName.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(lectureName.toLowerCase())
      );
    } else {
      // For ENT with object structure
      const allTopics = Object.values(subject.midtermContent).flat();
      return allTopics.some(topic => 
        lectureName.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(lectureName.toLowerCase())
      );
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: subject.color }}
                >
                  <SubjectIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl text-white">{subject.name}</h1>
                  {subject.fullName && (
                    <p className="text-sm text-white/50 mt-1">{subject.fullName}</p>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm('Are you sure you want to delete this subject?')) {
                  onDeleteSubject(subject.id);
                  onBack();
                }
              }}
              className="bg-red-500/20 border border-red-300/20 text-red-200 hover:bg-red-500/30"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Subject
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/20">
                <Timer className="h-5 w-5 text-blue-300" />
              </div>
              <p className="text-sm text-white/60">Total Study Time</p>
            </div>
            <p className="text-3xl text-white">{formatTime(totalTime)}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-300/20">
                <BookOpen className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-sm text-white/60">Lectures Progress</p>
            </div>
            <p className="text-3xl text-white">
              {completedLectures}/{subject.lectures.length}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-300/20">
                <Award className="h-5 w-5 text-purple-300" />
              </div>
              <p className="text-sm text-white/60">Completion Rate</p>
            </div>
            <p className="text-3xl text-white">{progress.toFixed(0)}%</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-2 border border-white/20">
          <Progress value={progress} className="h-4" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass-card border border-white/20 p-1 grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:text-white text-white/60">
              <List className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lectures" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white text-white/60">
              <BookOpen className="h-4 w-4 mr-2" />
              Lectures & Exams
            </TabsTrigger>
            <TabsTrigger value="classification" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/30 data-[state=active]:to-rose-500/30 data-[state=active]:text-white text-white/60">
              <SubjectIcon className="h-4 w-4 mr-2" />
              Classification
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="glass-card rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl text-white mb-6 gradient-text">Subject Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subject.fullName && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Full Name</p>
                    <p className="text-white">{subject.fullName}</p>
                  </div>
                )}
                {subject.type && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Type</p>
                    <p className="text-white">{subject.type}</p>
                  </div>
                )}
                {subject.difficulty && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Difficulty</p>
                    <p className="text-white">{subject.difficulty}</p>
                  </div>
                )}
                {subject.priority && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Priority</p>
                    <p className="text-white">{subject.priority}</p>
                  </div>
                )}
                {subject.totalLectures && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Total Lectures</p>
                    <p className="text-2xl text-white">{subject.totalLectures}</p>
                  </div>
                )}
                {(subject.weight || subject.gradeDistribution?.total) && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Total Marks</p>
                    <p className="text-2xl text-white">{subject.gradeDistribution?.total || subject.weight}</p>
                  </div>
                )}
                {subject.midtermDate && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Midterm Date</p>
                    <p className="text-white">{new Date(subject.midtermDate).toLocaleDateString()}</p>
                  </div>
                )}
                {subject.finalDate && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Final Date</p>
                    <p className="text-white">{new Date(subject.finalDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Lectures & Exams Tab */}
          <TabsContent value="lectures" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lectures Section */}
              <div className="glass-card rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-300" />
                Lectures
              </h2>
              <Button 
                onClick={() => setShowAddLecture(true)} 
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lecture
              </Button>
            </div>

            {showAddLecture && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={lectureName}
                  onChange={(e) => setLectureName(e.target.value)}
                  placeholder="Lecture name"
                  className="flex-1 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLecture()}
                  autoFocus
                />
                <Button onClick={handleAddLecture} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">Add</Button>
                <Button variant="outline" onClick={() => setShowAddLecture(false)} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Cancel
                </Button>
              </div>
            )}

            <div className="max-h-[600px] overflow-y-auto">
              {subject.lectures.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No lectures yet. Add your first lecture!</p>
                </div>
              ) : subject.lectureClassification ? (
                <GroupedLecturesView
                  lectures={subject.lectures}
                  subjectId={subject.id}
                  onUpdateLectureStatus={onUpdateLectureStatus}
                  onDeleteLecture={onDeleteLecture}
                  onStartPomodoro={setActivePomodoroLecture}
                  isInMidtermContent={isInMidtermContent}
                />
              ) : (
                <div className="space-y-3">
                  {subject.lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white text-lg">{lecture.name}</p>
                          {isInMidtermContent(lecture.name) && (
                            <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 text-[10px] px-2 py-0">
                              MIDTERM
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60">
                          {formatTime(lecture.timeSpent)} • {lecture.pomodoroSessions.length}{' '}
                          sessions
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActivePomodoroLecture(lecture)}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/20 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30"
                        >
                          <Timer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteLecture(subject.id, lecture.id)}
                          className="text-red-200 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-white/70">Status:</span>
                      <Select
                        value={lecture.status}
                        onValueChange={(value) =>
                          onUpdateLectureStatus(subject.id, lecture.id, value as LectureStatus)
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
                      <details className="text-sm">
                        <summary className="cursor-pointer text-white/60 hover:text-white/80 transition-colors">
                          View session notes ({lecture.pomodoroSessions.length})
                        </summary>
                        <div className="mt-3 space-y-3 pl-4">
                          {lecture.pomodoroSessions.map((session) => (
                            <div key={session.id} className="border-l-2 border-purple-400/30 pl-4 py-2 bg-white/5 rounded-r-lg">
                              <p className="text-xs text-white/50 mb-1">
                                {new Date(session.completedAt).toLocaleDateString()} •{' '}
                                {session.duration}min
                              </p>
                              {session.notes && (
                                <p className="text-sm text-white/80">{session.notes}</p>
                              )}
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
          </div>

          {/* Exams Section */}
          <div className="glass-card rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white flex items-center gap-2">
                <Calendar className="h-6 w-6 text-pink-300" />
                Exams
              </h2>
              <Dialog open={showAddExam} onOpenChange={setShowAddExam}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exam
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Exam</DialogTitle>
                    <DialogDescription className="text-white/60">Schedule an exam for {subject.name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white">Exam Name</label>
                      <input
                        type="text"
                        value={examForm.name}
                        onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 mt-1"
                        placeholder="e.g., Midterm Exam"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-white">Date</label>
                        <input
                          type="date"
                          value={examForm.date}
                          onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white">Time</label>
                        <input
                          type="time"
                          value={examForm.time}
                          onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-white">Your Score (optional)</label>
                        <input
                          type="number"
                          value={examForm.score}
                          onChange={(e) => setExamForm({ ...examForm, score: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white">Total Score (optional)</label>
                        <input
                          type="number"
                          value={examForm.totalScore}
                          onChange={(e) =>
                            setExamForm({ ...examForm, totalScore: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 mt-1"
                          placeholder="100"
                        />
                      </div>
                    </div>

                    {/* Curriculum Coverage */}
                    <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <label className="text-sm text-white">Curriculum Coverage</label>
                      <Select value={examForm.coverageType} onValueChange={(value) => setExamForm({ ...examForm, coverageType: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20 text-white">
                          <SelectItem value="full">Full Curriculum (All Lectures)</SelectItem>
                          <SelectItem value="percentage">Partial Coverage (%)</SelectItem>
                          <SelectItem value="specific">Select Specific Lectures</SelectItem>
                        </SelectContent>
                      </Select>

                      {examForm.coverageType === 'percentage' && (
                        <div>
                          <label className="text-xs text-white/70">Coverage Percentage</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={examForm.coveragePercentage}
                            onChange={(e) => setExamForm({ ...examForm, coveragePercentage: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 mt-1"
                            placeholder="e.g., 60 for 60% of curriculum"
                          />
                        </div>
                      )}

                      {examForm.coverageType === 'specific' && (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          <label className="text-xs text-white/70">Select Lectures</label>
                          {subject.lectures.map((lecture) => (
                            <label key={lecture.id} className="flex items-center gap-2 text-white/90 hover:bg-white/5 p-2 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={examForm.selectedLectures.includes(lecture.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setExamForm({
                                      ...examForm,
                                      selectedLectures: [...examForm.selectedLectures, lecture.id],
                                    });
                                  } else {
                                    setExamForm({
                                      ...examForm,
                                      selectedLectures: examForm.selectedLectures.filter((id) => id !== lecture.id),
                                    });
                                  }
                                }}
                                className="rounded border-white/20"
                              />
                              <span className="text-sm">{lecture.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button onClick={handleAddExam} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0">
                      Add Exam
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {subject.exams.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No exams scheduled yet</p>
                </div>
              ) : (
                subject.exams
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((exam) => {
                    const isPast = new Date(exam.date) < new Date();
                    return (
                      <div
                        key={exam.id}
                        className={`p-5 rounded-2xl space-y-3 border ${
                          isPast 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-300/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-lg mb-1">{exam.name}</p>
                            <p className="text-sm text-white/60">
                              {new Date(exam.date).toLocaleDateString()} • {exam.time}
                            </p>
                            {exam.coveragePercentage !== undefined && (
                              <div className="mt-2">
                                <span className="text-xs text-white/50">Coverage: </span>
                                <span className="text-xs text-teal-300">{exam.coveragePercentage}%</span>
                              </div>
                            )}
                            {exam.includedLectures && exam.includedLectures.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-white/50">
                                  Includes {exam.includedLectures.length} lecture{exam.includedLectures.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExam(subject.id, exam.id)}
                            className="text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {exam.score !== undefined && exam.totalScore && (
                          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-300/20 rounded-lg p-3">
                            <Award className="h-5 w-5 text-yellow-300" />
                            <span className="text-white">
                              Score: {exam.score}/{exam.totalScore} (
                              {((exam.score / exam.totalScore) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
            </div>
          </TabsContent>

          {/* Classification Tab */}
          <TabsContent value="classification" className="mt-6">
            <SubjectClassificationView subject={subject} />
          </TabsContent>
        </Tabs>
      </div>

      {activePomodoroLecture && (
        <PomodoroTimer
          lectureName={activePomodoroLecture.name}
          onComplete={(duration, notes) => {
            onAddPomodoroTime(subject.id, activePomodoroLecture.id, duration, notes);
          }}
          onClose={() => setActivePomodoroLecture(null)}
        />
      )}
    </>
  );
}
