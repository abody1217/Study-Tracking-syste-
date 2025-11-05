import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { SemesterGrade, SubjectGrade } from '../types/study';
import { TrendingUp, Award, Target, BarChart3, Plus, Trash2, Edit, GraduationCap, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface GradesTabProps {
  semesterGrades: SemesterGrade[];
  currentSemester: number;
  onAddSemesterGrade: (grade: Omit<SemesterGrade, 'id'>) => void;
  onUpdateSemesterGrade: (gradeId: string, updates: Partial<SemesterGrade>) => void;
  onDeleteSemesterGrade: (gradeId: string) => void;
  onUpdateCurrentSemester: (semester: number) => void;
}

export function GradesTab({
  semesterGrades,
  currentSemester,
  onAddSemesterGrade,
  onUpdateSemesterGrade,
  onDeleteSemesterGrade,
  onUpdateCurrentSemester,
}: GradesTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<SemesterGrade | null>(null);
  const [semesterNumber, setSemesterNumber] = useState('');
  const [year, setYear] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [subjectGrades, setSubjectGrades] = useState<SubjectGrade[]>([]);

  const handleAddSubjectGrade = () => {
    const newSubject: SubjectGrade = {
      id: crypto.randomUUID(),
      name: '',
      score: 0,
      maxScore: 100,
    };
    setSubjectGrades([...subjectGrades, newSubject]);
  };

  const handleUpdateSubjectGrade = (id: string, field: keyof SubjectGrade, value: any) => {
    setSubjectGrades(
      subjectGrades.map((sg) =>
        sg.id === id ? { ...sg, [field]: value } : sg
      )
    );
  };

  const handleRemoveSubjectGrade = (id: string) => {
    setSubjectGrades(subjectGrades.filter((sg) => sg.id !== id));
  };

  const handleSubmit = () => {
    if (!semesterNumber || !year || !totalScore || !maxScore) return;

    const gradeData = {
      semester: parseInt(semesterNumber),
      year,
      score: parseFloat(totalScore),
      maxScore: parseFloat(maxScore),
      subjects: subjectGrades.filter((sg) => sg.name.trim() !== ''),
    };

    if (editingGrade) {
      onUpdateSemesterGrade(editingGrade.id, gradeData);
    } else {
      onAddSemesterGrade(gradeData);
    }

    resetForm();
  };

  const resetForm = () => {
    setSemesterNumber('');
    setYear('');
    setTotalScore('');
    setMaxScore('');
    setSubjectGrades([]);
    setEditingGrade(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (grade: SemesterGrade) => {
    setEditingGrade(grade);
    setSemesterNumber(grade.semester.toString());
    setYear(grade.year);
    setTotalScore(grade.score.toString());
    setMaxScore(grade.maxScore.toString());
    setSubjectGrades(grade.subjects);
    setIsAddDialogOpen(true);
  };

  // Calculate cumulative stats
  const totalCumulativeScore = semesterGrades.reduce((sum, g) => sum + g.score, 0);
  const totalCumulativeMax = semesterGrades.reduce((sum, g) => sum + g.maxScore, 0);
  const cumulativePercentage = totalCumulativeMax > 0 ? (totalCumulativeScore / totalCumulativeMax) * 100 : 0;
  const averagePerSemester = semesterGrades.length > 0 ? cumulativePercentage / semesterGrades.length : 0;

  // Sort semesters
  const sortedGrades = [...semesterGrades].sort((a, b) => a.semester - b.semester);

  // Calculate trend
  const lastThree = sortedGrades.slice(-3);
  const trend = lastThree.length >= 2 
    ? ((lastThree[lastThree.length - 1].score / lastThree[lastThree.length - 1].maxScore) - 
       (lastThree[0].score / lastThree[0].maxScore)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/30 animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl text-white mb-2 gradient-text flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-300 animate-pulse-glow" />
              Medical School Grades
            </h2>
            <p className="text-white/80 text-lg">
              Track your journey through all 10 semesters • Currently in Semester {currentSemester}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Semester
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900/95 border-white/30 text-white backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">
                  {editingGrade ? 'Edit' : 'Add'} Semester Grade
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/90">Semester Number</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={semesterNumber}
                      onChange={(e) => setSemesterNumber(e.target.value)}
                      placeholder="1-10"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Academic Year</Label>
                    <Input
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2023-2024"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/90">Total Score</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={totalScore}
                      onChange={(e) => setTotalScore(e.target.value)}
                      placeholder="e.g., 450"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Max Score</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                      placeholder="e.g., 500"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/90">Subject Breakdown (Optional)</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddSubjectGrade}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subject
                    </Button>
                  </div>
                  
                  {subjectGrades.map((sg) => (
                    <div key={sg.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Input
                          value={sg.name}
                          onChange={(e) => handleUpdateSubjectGrade(sg.id, 'name', e.target.value)}
                          placeholder="Subject name"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={sg.score}
                          onChange={(e) => handleUpdateSubjectGrade(sg.id, 'score', parseFloat(e.target.value) || 0)}
                          placeholder="Score"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={sg.maxScore}
                          onChange={(e) => handleUpdateSubjectGrade(sg.id, 'maxScore', parseFloat(e.target.value) || 100)}
                          placeholder="Max"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSubjectGrade(sg.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {editingGrade ? 'Update' : 'Add'} Semester
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-item glass-card rounded-2xl p-6 border border-purple-400/30 hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-sm border border-purple-300/30 animate-pulse-glow">
                <Trophy className="h-6 w-6 text-purple-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Cumulative</p>
                <p className="text-3xl text-white">{cumulativePercentage.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-white/60">{totalCumulativeScore.toFixed(1)} / {totalCumulativeMax.toFixed(1)} points</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-green-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-300/30 animate-pulse-glow">
                <Target className="h-6 w-6 text-green-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Average</p>
                <p className="text-3xl text-white">{averagePerSemester.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-white/60">Per semester</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-orange-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-600/20 backdrop-blur-sm border border-orange-300/30 animate-pulse-glow">
                <BarChart3 className="h-6 w-6 text-orange-300" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Semesters</p>
                <p className="text-3xl text-white">{semesterGrades.length}/10</p>
              </div>
            </div>
            <p className="text-xs text-white/60">Completed</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border border-pink-400/30 hover-lift relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl backdrop-blur-sm border animate-pulse-glow ${
                trend >= 0 
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-300/30' 
                  : 'bg-gradient-to-br from-red-500/20 to-orange-600/20 border-red-300/30'
              }`}>
                <TrendingUp className={`h-6 w-6 ${trend >= 0 ? 'text-green-300' : 'text-red-300'}`} />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80 mb-1">Trend</p>
                <p className={`text-3xl text-white ${trend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-white/60">Last 3 semesters</p>
          </div>
        </div>
      </div>

      {/* Semester List */}
      <div className="glass-card rounded-3xl p-8 border border-white/30 animate-slideInRight">
        <h3 className="text-2xl text-white mb-6 flex items-center gap-3">
          <Award className="h-6 w-6 text-yellow-300 animate-pulse-glow" />
          Semester Records
        </h3>

        {sortedGrades.length === 0 ? (
          <div className="text-center py-16 animate-scaleIn">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center animate-float border border-purple-300/30">
              <GraduationCap className="h-10 w-10 text-white/60" />
            </div>
            <p className="text-white/70 text-lg mb-2">No semester grades yet</p>
            <p className="text-white/50">Start adding your semester grades to track your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGrades.map((grade, index) => {
              const percentage = (grade.score / grade.maxScore) * 100;
              const isCurrent = grade.semester === currentSemester;
              
              return (
                <div
                  key={grade.id}
                  className={`stagger-item p-6 rounded-2xl backdrop-blur-sm border transition-all hover:scale-[1.02] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border ${
                        isCurrent
                          ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-300/40 animate-pulse-glow'
                          : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                      }`}>
                        <span className="text-2xl text-white">S{grade.semester}</span>
                      </div>
                      <div>
                        <h4 className="text-xl text-white flex items-center gap-2">
                          Semester {grade.semester}
                          {isCurrent && (
                            <span className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 px-2 py-1 rounded-full animate-pulse-glow">
                              Current
                            </span>
                          )}
                        </h4>
                        <p className="text-white/60">{grade.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-3xl text-white mb-1">{percentage.toFixed(1)}%</p>
                        <p className="text-sm text-white/60">
                          {grade.score.toFixed(1)} / {grade.maxScore.toFixed(1)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(grade)}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteSemesterGrade(grade.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {grade.subjects.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
                      {grade.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          <p className="text-white/90 text-sm mb-1">{subject.name}</p>
                          <p className="text-white text-lg">
                            {((subject.score / subject.maxScore) * 100).toFixed(0)}%
                          </p>
                          <p className="text-white/50 text-xs">
                            {subject.score}/{subject.maxScore}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Speciality Selection Info */}
      <div className="glass-card rounded-3xl p-8 border border-yellow-400/30 animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm border border-yellow-300/30 animate-pulse-glow">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl text-white mb-2 gradient-text">Speciality Selection</h3>
              <p className="text-white/80 mb-4">
                Your cumulative score across all 10 semesters will determine your speciality selection options. 
                Keep tracking your progress to ensure you reach your goal!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow" />
                  <span className="text-white/90">85%+ = Top Specialities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-glow" />
                  <span className="text-white/90">75%+ = Wide Options</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse-glow" />
                  <span className="text-white/90">65%+ = Good Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
