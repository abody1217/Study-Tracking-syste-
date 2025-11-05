import { useState } from 'react';
import { Button } from './ui/button';
import { User, Mail, Lock, Stethoscope, Eye, EyeOff } from 'lucide-react';

interface SignUpFlowProps {
  onComplete: (userData: { name: string; email: string; password: string }) => void;
}

export function SignUpFlow({ onComplete }: SignUpFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      onComplete({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      
      <div className="relative z-10 w-full max-w-md animate-scaleIn">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl mb-4 shadow-2xl shadow-teal-500/50 animate-float">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl text-white mb-2 gradient-text">SPOP</h1>
          <p className="text-white/60">Special Surgical Operations</p>
          <p className="text-sm text-white/40 mt-1">Medical Training Command Center</p>
        </div>

        {/* Sign Up Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl text-white mb-2">Create Your Account</h2>
            <p className="text-white/60 text-sm">Join the surgical operations training program</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1">
              <div className={`h-2 rounded-full transition-all ${step >= 1 ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-white/10'}`} />
            </div>
            <div className="flex-1">
              <div className={`h-2 rounded-full transition-all ${step >= 2 ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-white/10'}`} />
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-5 animate-slideIn">
              <div>
                <label className="block text-white/80 text-sm mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-400/50 bg-red-500/10' : 'border-white/20 bg-white/10'
                    } text-white placeholder:text-white/40 focus:bg-white/15 focus:border-teal-400/50 transition-all`}
                    placeholder="Enter your full name"
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-300 text-xs mt-1 ml-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-400/50 bg-red-500/10' : 'border-white/20 bg-white/10'
                    } text-white placeholder:text-white/40 focus:bg-white/15 focus:border-teal-400/50 transition-all`}
                    placeholder="your.email@medical.edu"
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 py-6 text-lg rounded-xl shadow-lg shadow-teal-500/30"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <div className="space-y-5 animate-slideIn">
              <div>
                <label className="block text-white/80 text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                      errors.password ? 'border-red-400/50 bg-red-500/10' : 'border-white/20 bg-white/10'
                    } text-white placeholder:text-white/40 focus:bg-white/15 focus:border-teal-400/50 transition-all`}
                    placeholder="Create a secure password"
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                      errors.confirmPassword ? 'border-red-400/50 bg-red-500/10' : 'border-white/20 bg-white/10'
                    } text-white placeholder:text-white/40 focus:bg-white/15 focus:border-teal-400/50 transition-all`}
                    placeholder="Confirm your password"
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 py-6 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 py-6 rounded-xl shadow-lg shadow-teal-500/30"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-white/40 text-xs">
              By creating an account, you agree to our medical training protocols
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            Your data is stored locally and securely
          </p>
        </div>
      </div>
    </div>
  );
}
