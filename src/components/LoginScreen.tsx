import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Lock, User, Activity } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setError('');
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Medical Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="medical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>
      </div>

      {/* Animated Background Particles */}
      <div className="particle-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              background: `rgba(20, 184, 166, ${0.3 + Math.random() * 0.3})`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 border-2 border-teal-400/30 shadow-2xl shadow-teal-500/20 animate-scaleIn relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 animate-shimmer opacity-20" />
          
          {/* Medical Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-400/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-400/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-400/50" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-teal-500/50 animate-pulse-glow mb-4 relative">
                {/* Clearer Surgical Scalpel */}
                <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-3xl bg-teal-400/30 animate-ping" />
              </div>
              <h1 className="text-4xl mb-2">
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold tracking-widest">
                  SPOP
                </span>
              </h1>
              <p className="text-teal-300/80 tracking-[0.3em] mb-1">SPECIAL OPERATIONS</p>
              <p className="text-white/50 text-xs tracking-wider">SURGICAL EXCELLENCE PLATFORM</p>
            </div>

            {/* Medical Notice */}
            <div className="mb-6 p-3 rounded-xl bg-teal-500/10 border border-teal-400/30">
              <div className="flex items-center gap-2 text-teal-300 text-sm">
                <Activity className="h-4 w-4" />
                <span className="tracking-wide">Medical Professional Access Portal</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90 flex items-center gap-2 tracking-wide">
                  <User className="h-4 w-4 text-teal-400" />
                  Medical ID
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-teal-400/30 text-white placeholder:text-white/40 focus:border-teal-400/50 h-12 tracking-wide"
                  placeholder="Enter your medical ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 flex items-center gap-2 tracking-wide">
                  <Lock className="h-4 w-4 text-teal-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-teal-400/30 text-white placeholder:text-white/40 focus:border-teal-400/50 h-12 pr-12 tracking-wide"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 text-red-200 text-sm animate-scaleIn tracking-wide">
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all hover:scale-[1.02] tracking-widest"
              >
                <Activity className="h-5 w-5 mr-2" />
                ACCESS PLATFORM
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-teal-400/20 text-center">
              <p className="text-teal-300/70 text-sm tracking-wider mb-2">
                Excellence in Surgical Education
              </p>
              <div className="flex items-center justify-center gap-4 text-white/40 text-xs tracking-wider">
                <span>PRECISION</span>
                <span>•</span>
                <span>EXPERTISE</span>
                <span>•</span>
                <span>INNOVATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>
    </div>
  );
}
