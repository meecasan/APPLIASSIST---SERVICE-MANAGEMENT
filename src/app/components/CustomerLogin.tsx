import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomerLoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onNavigateToCreateAccount: () => void;
  onNavigateToJoinUs: () => void;
}

export function CustomerLogin({ onLogin, onNavigateToCreateAccount, onNavigateToJoinUs }: CustomerLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[500px]">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl px-10 py-12 relative">
          {/* Close Button */}
          <button
            onClick={onNavigateToJoinUs}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Log in or create account
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Book trusted appliance repair services and order genuine parts from certified professionals.
            </p>
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                  required
                  autoFocus
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-semibold transition-all bg-[#1E5EFF] text-white hover:bg-[#1850E0] shadow-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Continue
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    or
                  </span>
                </div>
              </div>

              {/* Social Login Buttons (UI Only) */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Professional Link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={onNavigateToJoinUs}
                  className="text-sm text-[#1E2F4F] hover:underline font-medium transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Are you a service professional? Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Email Display */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Signing in as
                  </p>
                  <p className="font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Change
                </button>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700" style={{ fontFamily: 'Manrope, sans-serif' }}>{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all shadow-sm ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#1E5EFF] text-white hover:bg-[#1850E0]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Create Account Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToCreateAccount}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Demo Credentials Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-[#6B7280] font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              📌 Demo Customer Account:
            </p>
            <div className="text-xs text-[#6B7280] space-y-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <p>Email: <span className="text-gray-700 font-medium">customer@example.com</span></p>
              <p>Password: <span className="text-gray-700 font-medium">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
