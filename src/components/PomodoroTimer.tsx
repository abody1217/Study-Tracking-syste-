import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, Coffee, Brain, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface PomodoroTimerProps {
  lectureName: string;
  onComplete: (duration: number, notes: string) => void;
  onClose: () => void;
}

export function PomodoroTimer({ lectureName, onComplete, onClose }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [notes, setNotes] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (!isBreak) {
              setSessionNotes(notes);
              onComplete(sessionDuration, notes);
              setCompletedSessions(c => c + 1);
              setIsBreak(true);
              setSessionDuration(5);
              return 5 * 60;
            } else {
              setIsBreak(false);
              setSessionDuration(25);
              setNotes('');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak, onComplete, sessionDuration, notes]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const handleClose = () => {
    if (notes.trim() && !isBreak) {
      const elapsedTime = sessionDuration - Math.floor(timeLeft / 60);
      if (elapsedTime > 0) {
        onComplete(elapsedTime, notes);
      }
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration * 60 - timeLeft) / (sessionDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="glass-card w-full max-w-3xl rounded-3xl p-10 border-2 border-white/30 shadow-2xl max-h-[95vh] overflow-y-auto animate-scaleIn relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-orange-500/20 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-shimmer" />
        
        <div className="space-y-8 relative z-10">
          {/* Header with session counter */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse-glow" />
                <span className="text-sm text-white/80">{completedSessions} session{completedSessions !== 1 ? 's' : ''} completed</span>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                ✕ Close
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              {isBreak ? (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/40 to-emerald-500/40 flex items-center justify-center border-2 border-green-300/50 animate-pulse-glow shadow-lg shadow-green-500/50">
                  <Coffee className="h-8 w-8 text-green-200" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center border-2 border-purple-300/50 animate-pulse-glow shadow-lg shadow-purple-500/50">
                  <Brain className="h-8 w-8 text-purple-200" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-3xl text-white gradient-text mb-2">{lectureName}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                <Target className="h-4 w-4 text-purple-300" />
                <p className="text-white/90 text-sm font-medium">
                  {isBreak ? '☕ Break Time - Recharge your energy!' : '🎯 Focus Mode - Deep work in progress'}
                </p>
              </div>
            </div>
          </div>

          {/* Circular Timer Display */}
          <div className="flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Background circle glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-2xl animate-pulse-glow" />
              
              {/* SVG Circle Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 280 280">
                {/* Background circle */}
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke={isBreak ? 'url(#green-gradient)' : 'url(#purple-gradient)'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))'
                  }}
                />
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-7xl font-bold tabular-nums bg-gradient-to-br from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2 transition-all duration-300 ${
                  isRunning ? 'scale-105' : ''
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                  {isRunning && (
                    <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" />
                  )}
                  <p className="text-white/70 text-sm font-medium">
                    {isBreak ? '☕ Break' : '💪 Focus'} • {sessionDuration}min
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-white/50 text-xs">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="flex gap-4 justify-center items-center">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="px-10 py-6 text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all hover:scale-110 rounded-2xl"
            >
              {isRunning ? (
                <>
                  <Pause className="h-6 w-6 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 mr-2" />
                  {timeLeft === sessionDuration * 60 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="px-6 py-6 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all rounded-2xl backdrop-blur-sm"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSessionDuration(15);
                setTimeLeft(15 * 60);
                setIsBreak(false);
                setIsRunning(false);
              }}
              className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white/70 hover:text-white transition-all"
            >
              <Zap className="h-3 w-3 inline mr-1" />
              Quick 15min
            </button>
            <button
              onClick={() => {
                setSessionDuration(25);
                setTimeLeft(25 * 60);
                setIsBreak(false);
                setIsRunning(false);
              }}
              className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white/70 hover:text-white transition-all"
            >
              <Target className="h-3 w-3 inline mr-1" />
              Standard 25min
            </button>
            <button
              onClick={() => {
                setSessionDuration(50);
                setTimeLeft(50 * 60);
                setIsBreak(false);
                setIsRunning(false);
              }}
              className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white/70 hover:text-white transition-all"
            >
              <Brain className="h-3 w-3 inline mr-1" />
              Deep 50min
            </button>
          </div>

          {/* Notes Section */}
          {!isBreak && (
            <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm">
              <label className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  📝 Session Notes
                  <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Optional
                  </span>
                </span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="📚 Key concepts, important points, questions to review later..."
                className="min-h-[120px] resize-none bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-purple-400/50 transition-all rounded-xl"
              />
              <p className="text-xs text-white/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-glow" />
                Notes auto-save when session completes
              </p>
            </div>
          )}

          {sessionNotes && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-300/30 rounded-2xl p-5 backdrop-blur-sm animate-scaleIn">
              <p className="text-green-200 flex items-center gap-3">
                <Check className="h-5 w-5 animate-pulse-glow" />
                <span className="font-medium">Session completed successfully! 🎉</span>
              </p>
            </div>
          )}

          {/* Footer info */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse-glow" />
                Pomodoro Technique
              </span>
              <span className="text-white/20">•</span>
              <span>Scientifically proven to boost focus</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse-glow" />
                Stay productive
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
