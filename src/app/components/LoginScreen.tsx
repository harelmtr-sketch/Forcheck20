import { useState, memo } from 'react';
import { Mail, Lock, Zap, User, ArrowLeft, Phone } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export const LoginScreen = memo(function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Store remember device preference
      if (rememberDevice) {
        localStorage.setItem('forcheck_remember_device', 'true');
      }
      onLogin(email.trim());
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // In a real app, this would initiate OAuth flow
    // For now, just redirect to the provider
    if (provider === 'google') {
      window.open('https://google.com', '_blank');
    } else {
      window.open('https://facebook.com', '_blank');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset code
    setResetEmailSent(true);
    setTimeout(() => {
      setResetEmailSent(false);
      setIsForgotPassword(false);
    }, 3000);
  };

  // Forgot Password Screen
  if (isForgotPassword) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-[#1a1d23] flex flex-col overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-6 py-12 overflow-y-auto">
          {/* Back Button */}
          <button
            onClick={() => setIsForgotPassword(false)}
            className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>

          {/* Logo Section */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-[#252932] rounded-2xl w-full h-full flex items-center justify-center border border-white/10">
                <Lock className="w-10 h-10 text-blue-500" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-1">Reset Password</h1>
              <p className="text-gray-400 text-sm tracking-wider uppercase">Recover Your Account</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-shrink-0 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <p className="text-gray-400 text-sm text-center">
              Enter your email and phone number to receive a password reset code
            </p>
          </div>

          {resetEmailSent ? (
            <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Check Your Messages</h3>
                <p className="text-sm text-gray-400">
                  We've sent a password reset code to your email and phone number
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Send Reset Code Button */}
              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 mt-4"
              >
                Send Reset Code
              </button>

              {/* Back to Sign In */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Copyright */}
          <div className="flex-shrink-0 text-center pt-6 border-t border-white/5 animate-in fade-in duration-700 delay-300">
            <p className="text-gray-600 text-xs uppercase tracking-wider">© 2026 Forcheck Team</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-[#1a1d23] flex flex-col overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 py-12 overflow-y-auto">
        {/* Back Button (only show on sign up) */}
        {isSignUp && (
          <button
            onClick={() => setIsSignUp(false)}
            className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Logo Section */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-[#252932] rounded-2xl w-full h-full flex items-center justify-center border border-white/10">
              <Zap className="w-10 h-10 text-blue-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">Forcheck</h1>
            <p className="text-gray-400 text-sm tracking-wider uppercase">Fitness Tracking</p>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="flex-shrink-0 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'Sign up to start tracking your fitness' : 'Sign in to track your progress'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {/* Full Name Input (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full h-14 bg-[#252932] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Remember Device & Forgot Password */}
          {!isSignUp && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#252932] border border-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember this device</span>
              </label>
              <button 
                type="button"
                onClick={() => setIsForgotPassword(true)} 
                className="text-blue-500 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                Forgot?
              </button>
            </div>
          )}

          {/* Sign In/Up Button */}
          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 mt-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1d23] px-4 text-gray-500 font-medium">Or</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="h-12 bg-[#252932] border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#2d3139] hover:border-white/20 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white text-sm font-medium">Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="h-12 bg-[#252932] border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#2d3139] hover:border-white/20 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-white text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Sign Up/In Link */}
          <div className="text-center mt-4 pb-4">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </form>

        {/* Copyright */}
        <div className="flex-shrink-0 text-center pt-6 border-t border-white/5 animate-in fade-in duration-700 delay-300">
          <p className="text-gray-600 text-xs uppercase tracking-wider">© 2026 Forcheck Team</p>
        </div>
      </div>
    </div>
  );
});