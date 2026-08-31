import React, { useState } from 'react';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Building2
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onAdminLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onAdminLoginSuccess,
  onNavigateHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const u = username.trim();
      const p = password.trim();

      // Credentials are matched dynamically — whichever role matches signs the user
      // straight into that respective panel, no manual role selection needed.
      if (u.toLowerCase() === 'admin' && p === 'Admin') {
        setIsLoading(false);
        onAdminLoginSuccess();
        return;
      }

      if (u === 'investor1' && p === '12345') {
        setIsLoading(false);
        onLoginSuccess();
        return;
      }

      setIsLoading(false);
      setError('Invalid username or password. Please try again.');
    }, 450);
  };

  return (
    <div id="finovatech-login-screen" className="min-h-screen bg-[#070B14] text-white flex flex-col justify-between pt-8 pb-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F7931A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 group cursor-pointer focus:outline-hidden"
        >
          <img
            src="/finovatech_favicon.svg"
            alt="FINOVATECH"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md shrink-0"
          />
          <div className="text-left">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-[#F7931A] transition-colors block font-mono">
              FINOVATECH
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
              MINING COMPANY • SULTANATE OF OMAN
            </span>
          </div>
        </button>

        <button
          onClick={onNavigateHome}
          className="text-xs font-mono text-gray-400 hover:text-white px-3.5 py-1.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
        >
          ← Return to Website
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        
        {/* Institutional Pill */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 shadow-md text-[11px] font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SECURE CRYPTOGRAPHIC GATEWAY</span>
            <span className="text-gray-600">|</span>
            <span className="text-[#F7931A]">MCT-01 256-BIT SSL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
            Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Enter your username and password to sign in.
          </p>
        </div>

        {/* Login Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-gray-800 shadow-2xl backdrop-blur-xl">
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-gray-400 mb-1.5">
                Username / Investor ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A] transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-gray-400">
                  Password
                </label>
                <span className="text-[11px] text-gray-500 font-mono">Encrypted</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & 2FA Note */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-950 text-[#F7931A] focus:ring-[#F7931A] focus:ring-offset-gray-900"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Hardware 2FA Ready
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 min-h-[48px] font-mono"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Session...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Security Guarantee Footer */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 text-center">
            <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span>FINOVATECH Mining Company S.A.O.C • Muscat</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs text-gray-500 font-mono z-10">
        Protected by hardware enclave isolation & SHA-256 telemetry verification.
      </div>

    </div>
  );
};
