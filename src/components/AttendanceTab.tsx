import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Subject, AttendanceRecord, ScheduleEntry } from '../types/study';
import { Calendar, Plus, Trash2, AlertCircle, Clock, CheckCircle, XCircle, UserCheck, TrendingUp, BarChart3, CalendarDays } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface AttendanceTabProps {
  subjects: Subject[];
  schedule: ScheduleEntry[];
  onAddAttendance: (subjectId: string, record: Omit<AttendanceRecord, 'id'>) => void;
  onDeleteAttendance: (subjectId: string, recordId: string) => void;
  onAddScheduleEntry: (entry: Omit<ScheduleEntry, 'id'>) => void;
  onDeleteScheduleEntry: (entryId: string) => void;
  onClearSchedule: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AttendanceTab({
  subjects,
  schedule,
  onAddAttendance,
  onDeleteAttendance,
  onAddScheduleEntry,
  onDeleteScheduleEntry,
  onClearSchedule,
}: AttendanceTabProps) {
  const [showAddAttendance, setShowAddAttendance] = useState(false);
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    subjectId: '',
    date: '',
    status: 'present' as 'present' | 'absent',
    hours: '1',
  });
  const [scheduleForm, setScheduleForm] = useState({
    subjectId: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
  });

  const handleAddAttendance = () => {
    if (attendanceForm.subjectId && attendanceForm.date) {
      onAddAttendance(attendanceForm.subjectId, {
        subjectId: attendanceForm.subjectId,
        date: attendanceForm.date,
        status: attendanceForm.status,
        hours: parseFloat(attendanceForm.hours),
      });
      setAttendanceForm({
        subjectId: '',
        date: '',
        status: 'present',
        hours: '1',
      });
      setShowAddAttendance(false);
    }
  };

  const handleAddSchedule = () => {
    if (scheduleForm.subjectId && scheduleForm.startTime && scheduleForm.endTime) {
      onAddScheduleEntry({
        subjectId: scheduleForm.subjectId,
        day: scheduleForm.day,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
      });
      setScheduleForm({
        subjectId: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
      });
    }
  };

  const handleUpdateSchedule = () => {
    if (confirm('This will clear your current schedule. Continue?')) {
      onClearSchedule();
      setShowScheduleManager(true);
    }
  };

  // Calculate attendance stats
  const getSubjectStats = (subject: Subject) => {
    const totalPresent = subject.attendanceRecords
      .filter((r) => r.status === 'present')
      .reduce((sum, r) => sum + r.hours, 0);
    const totalAbsent = subject.attendanceRecords
      .filter((r) => r.status === 'absent')
      .reduce((sum, r) => sum + r.hours, 0);
    const totalHours = totalPresent + totalAbsent;
    const attendanceRate = totalHours > 0 ? (totalPresent / totalHours) * 100 : 0;
    const absencePercentage = subject.allowedAbsenceHours > 0 
      ? (totalAbsent / subject.allowedAbsenceHours) * 100 
      : 0;
    
    return {
      totalPresent,
      totalAbsent,
      totalHours,
      attendanceRate,
      absencePercentage,
      isAtRisk: absencePercentage >= 80,
      isCritical: absencePercentage >= 100,
    };
  };

  const overallStats = subjects.reduce(
    (acc, subject) => {
      const stats = getSubjectStats(subject);
      return {
        totalPresent: acc.totalPresent + stats.totalPresent,
        totalAbsent: acc.totalAbsent + stats.totalAbsent,
        totalHours: acc.totalHours + stats.totalHours,
      };
    },
    { totalPresent: 0, totalAbsent: 0, totalHours: 0 }
  );

  const overallAttendanceRate = overallStats.totalHours > 0 
    ? (overallStats.totalPresent / overallStats.totalHours) * 100 
    : 0;

  const atRiskSubjects = subjects.filter((s) => getSubjectStats(s).isAtRisk).length;
  const criticalSubjects = subjects.filter((s) => getSubjectStats(s).isCritical).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/30 animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl text-white mb-2 gradient-text flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-purple-300 animate-pulse-glow" />
              Attendance Management
            </h2>
            <p className="text-white/80 text-lg">
              Track your presence and monitor absence limits
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showAddAttendance} onOpenChange={setShowAddAttendance}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/95 border-white/30 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl gradient-text">Add Attendance Record</DialogTitle>
                  <DialogDescription className="text-white/70">
                    Record your attendance or absence
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-white/90">Subject</Label>
                    <Select value={attendanceForm.subjectId} onValueChange={(value) => setAttendanceForm({ ...attendanceForm, subjectId: value })}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20 text-white">
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/90">Date</Label>
                      <Input
                        type="date"
                        value={attendanceForm.date}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/90">Hours</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={attendanceForm.hours}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, hours: e.target.value })}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/90">Status</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        onClick={() => setAttendanceForm({ ...attendanceForm, status: 'present' })}
                        className={`h-16 transition-all ${
                          attendanceForm.status === 'present'
                            ? 'bg-gradient-to-br from-green-500/40 to-emerald-500/40 border-2 border-green-400/60 shadow-lg shadow-green-500/30'
                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Present
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setAttendanceForm({ ...attendanceForm, status: 'absent' })}
                        className={`h-16 transition-all ${
                          attendanceForm.status === 'absent'
                            ? 'bg-gradient-to-br from-red-500/40 to-orange-500/40 border-2 border-red-400/60 shadow-lg shadow-red-500/30'
                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Absent
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddAttendance}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Add Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showScheduleManager} onOpenChange={setShowScheduleManager}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Manage Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900/95 border-white/30 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl gradient-text">Weekly Schedule</DialogTitle>
                  <DialogDescription className="text-white/70">
                    Set up your weekly class schedule (Updated every Friday)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/90">Subject</Label>
                      <Select value={scheduleForm.subjectId} onValueChange={(value) => setScheduleForm({ ...scheduleForm, subjectId: value })}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20 text-white">
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/90">Day</Label>
                      <Select value={scheduleForm.day} onValueChange={(value) => setScheduleForm({ ...scheduleForm, day: value })}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20 text-white">
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/90">Start Time</Label>
                      <Input
                        type="time"
                        value={scheduleForm.startTime}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/90">End Time</Label>
                      <Input
                        type="time"
                        value={scheduleForm.endTime}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddSchedule}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    Add to Schedule
                  </Button>

                  {schedule.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <Label className="text-white/90">Current Schedule</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleUpdateSchedule}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Clear All
                        </Button>
                      </div>
                      {DAYS.map((day) => {
                        const daySchedule = schedule.filter((s) => s.day === day);
                        if (daySchedule.length === 0) return null;
                        
                        return (
                          <div key={day} className="space-y-2">
                            <p className="text-sm text-white/70">{day}</p>
                            {daySchedule.map((entry) => {
                              const subject = subjects.find((s) => s.id === entry.subjectId);
                              return (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: subject?.color }}
                                    />
                                    <span className="text-white/90">{subject?.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white/70 text-sm">
                                      {entry.startTime} - {entry.endTime}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onDeleteScheduleEntry(entry.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-green-400/60 hover-lift relative overflow-hidden shadow-2xl shadow-green-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/40 to-emerald-600/40 backdrop-blur-sm border-2 border-green-300/50 shadow-lg shadow-green-500/50">
                <TrendingUp className="h-7 w-7 text-green-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1">Overall Rate</p>
                <p className="text-4xl text-white drop-shadow-lg">{overallAttendanceRate.toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-xs text-white/70">{overallStats.totalPresent}h present</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-blue-400/60 hover-lift relative overflow-hidden shadow-2xl shadow-blue-500/30" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/40 to-indigo-600/40 backdrop-blur-sm border-2 border-blue-300/50 shadow-lg shadow-blue-500/50">
                <BarChart3 className="h-7 w-7 text-blue-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1">Total Hours</p>
                <p className="text-4xl text-white drop-shadow-lg">{overallStats.totalHours}</p>
              </div>
            </div>
            <p className="text-xs text-white/70">Tracked sessions</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-orange-400/60 hover-lift relative overflow-hidden shadow-2xl shadow-orange-500/30" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/40 to-yellow-600/40 backdrop-blur-sm border-2 border-orange-300/50 shadow-lg shadow-orange-500/50">
                <AlertCircle className="h-7 w-7 text-orange-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1">At Risk</p>
                <p className="text-4xl text-white drop-shadow-lg">{atRiskSubjects}</p>
              </div>
            </div>
            <p className="text-xs text-white/70">Subjects ≥80% limit</p>
          </div>
        </div>

        <div className="stagger-item glass-card rounded-2xl p-6 border-2 border-red-400/60 hover-lift relative overflow-hidden shadow-2xl shadow-red-500/30" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/40 to-orange-600/40 backdrop-blur-sm border-2 border-red-300/50 shadow-lg shadow-red-500/50 animate-pulse-glow">
                <XCircle className="h-7 w-7 text-red-100" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1">Critical</p>
                <p className="text-4xl text-white drop-shadow-lg">{criticalSubjects}</p>
              </div>
            </div>
            <p className="text-xs text-white/70">Exceeded limit</p>
          </div>
        </div>
      </div>

      {/* Subject Details */}
      <div className="glass-card rounded-3xl p-8 border border-white/30 animate-slideInRight">
        <h3 className="text-2xl text-white mb-6 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-300 animate-pulse-glow" />
          Subject Attendance
        </h3>

        {subjects.length === 0 ? (
          <div className="text-center py-16 animate-scaleIn">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center animate-float border border-purple-300/30">
              <UserCheck className="h-10 w-10 text-white/60" />
            </div>
            <p className="text-white/70 text-lg mb-2">No subjects yet</p>
            <p className="text-white/50">Add subjects to start tracking attendance</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject, index) => {
              const stats = getSubjectStats(subject);
              const isExpanded = selectedSubject === subject.id;
              
              return (
                <div
                  key={subject.id}
                  className={`stagger-item rounded-2xl backdrop-blur-sm border-2 transition-all ${
                    stats.isCritical
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/60 shadow-lg shadow-red-500/20'
                      : stats.isAtRisk
                      ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400/60 shadow-lg shadow-orange-500/20'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setSelectedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-2 h-16 rounded-full shadow-lg"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl text-white">{subject.name}</h4>
                            {stats.isCritical && (
                              <span className="text-xs bg-red-500/30 text-red-200 px-3 py-1 rounded-full border border-red-300/30 animate-pulse-glow">
                                🚨 Critical
                              </span>
                            )}
                            {stats.isAtRisk && !stats.isCritical && (
                              <span className="text-xs bg-orange-500/30 text-orange-200 px-3 py-1 rounded-full border border-orange-300/30">
                                ⚠️ At Risk
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-white/60">Present</p>
                              <p className="text-white text-lg">{stats.totalPresent}h</p>
                            </div>
                            <div>
                              <p className="text-white/60">Absent</p>
                              <p className="text-white text-lg">{stats.totalAbsent}h</p>
                            </div>
                            <div>
                              <p className="text-white/60">Limit</p>
                              <p className="text-white text-lg">{subject.allowedAbsenceHours}h</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <p className="text-white/60 text-sm mb-1">Attendance Rate</p>
                        <p className="text-4xl text-white mb-2">{stats.attendanceRate.toFixed(0)}%</p>
                        <div className="text-sm">
                          <span className={`px-3 py-1 rounded-full ${
                            stats.absencePercentage >= 100
                              ? 'bg-red-500/30 text-red-200 border border-red-300/30'
                              : stats.absencePercentage >= 80
                              ? 'bg-orange-500/30 text-orange-200 border border-orange-300/30'
                              : 'bg-green-500/30 text-green-200 border border-green-300/30'
                          }`}>
                            {stats.absencePercentage.toFixed(0)}% of limit
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/70">
                        <span>Absence Limit Usage</span>
                        <span>{stats.totalAbsent}h / {subject.allowedAbsenceHours}h</span>
                      </div>
                      <Progress value={Math.min(stats.absencePercentage, 100)} className="h-3" />
                    </div>
                  </div>

                  {isExpanded && subject.attendanceRecords.length > 0 && (
                    <div className="px-6 pb-6 space-y-2 border-t border-white/10 pt-4">
                      <p className="text-white/80 mb-3">Recent Records</p>
                      {subject.attendanceRecords
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              {record.status === 'present' ? (
                                <CheckCircle className="h-5 w-5 text-green-300" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-300" />
                              )}
                              <div>
                                <p className="text-white/90">{new Date(record.date).toLocaleDateString()}</p>
                                <p className="text-white/60 text-sm">{record.hours} hours</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAttendance(subject.id, record.id);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  );
}
