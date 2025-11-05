import { useEffect, useState } from 'react';
import { Activity, Check } from 'lucide-react';

interface ECGAnimationProps {
  onComplete: () => void;
}

export function ECGAnimation({ onComplete }: ECGAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900/50 to-cyan-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="text-center space-y-8 animate-scaleIn">
        {/* Medical Logo with pulse */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-teal-500/50">
            {/* Clearer Surgical Scalpel */}
            <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Scalpel blade */}
              <path d="M3 21 L9 15 L12 18 L6 24 Z" fill="currentColor" opacity="0.9"/>
              {/* Scalpel handle */}
              <rect x="10" y="3" width="3" height="14" rx="1.5" 
                transform="rotate(45 11.5 10)" 
                fill="currentColor" 
                opacity="0.95"/>
              {/* Handle grip lines */}
              <line x1="11" y1="8" x2="13" y2="10" stroke="white" strokeWidth="0.5" opacity="0.6"/>
              <line x1="12" y1="7" x2="14" y2="9" stroke="white" strokeWidth="0.5" opacity="0.6"/>
              <line x1="13" y1="6" x2="15" y2="8" stroke="white" strokeWidth="0.5" opacity="0.6"/>
              {/* Sharp edge highlight */}
              <path d="M8.5 15.5 L11.5 18.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
            </svg>
          </div>
        </div>

        {/* ECG Wave Container */}
        <div className="relative w-96 h-32 mx-auto">
          {/* Medical Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="ecg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ecg-grid)" />
            </svg>
          </div>

          {/* ECG Wave */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* ECG Path - realistic heartbeat pattern */}
            <path
              d="M 0 60 L 50 60 L 55 60 L 60 40 L 65 80 L 70 20 L 75 60 L 80 60 L 90 60 L 95 55 L 100 65 L 105 60 L 150 60 L 155 60 L 160 40 L 165 80 L 170 20 L 175 60 L 180 60 L 190 60 L 195 55 L 200 65 L 205 60 L 250 60 L 255 60 L 260 40 L 265 80 L 270 20 L 275 60 L 280 60 L 290 60 L 295 55 L 300 65 L 305 60 L 350 60 L 355 60 L 360 40 L 365 80 L 370 20 L 375 60 L 380 60 L 400 60"
              fill="none"
              stroke="url(#ecgGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="ecg-line"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000 - (progress * 10),
                transition: 'stroke-dashoffset 0.03s linear'
              }}
            />
          </svg>

          {/* Scanning Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-70"
            style={{
              left: `${progress}%`,
              transition: 'left 0.03s linear',
              boxShadow: '0 0 10px rgba(20, 184, 166, 0.8)'
            }}
          />
        </div>

        {/* Status Text */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            {progress < 100 ? (
              <>
                <Activity className="w-6 h-6 text-teal-400 animate-pulse" />
                <p className="text-teal-400 tracking-wider animate-pulse">
                  INITIALIZING SURGICAL SYSTEMS
                </p>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-scaleIn">
                  <Check className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-emerald-400 tracking-wider">
                  SYSTEM READY
                </p>
              </>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-96 mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/60 text-sm mt-2 tracking-wider">
              {progress < 100 ? `${Math.round(progress)}%` : 'LOADING PLATFORM...'}
            </p>
          </div>
        </div>

        {/* Medical Cross Decoration */}
        <div className="absolute top-10 right-20 opacity-10">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M9 2H15V9H22V15H15V22H9V15H2V9H9V2Z" fill="currentColor" className="text-teal-400"/>
          </svg>
        </div>
        <div className="absolute bottom-10 left-20 opacity-10">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M9 2H15V9H22V15H15V22H9V15H2V9H9V2Z" fill="currentColor" className="text-cyan-400"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
