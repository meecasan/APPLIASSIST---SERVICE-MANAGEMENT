import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';

interface WorkspaceLoginProps {
  onLogin: (email: string, password: string, role: 'technician') => Promise<{
    success: boolean;
    message: string;
  }>;
  onNavigateToHome: () => void;
  onNavigateToJoinUs: () => void;
}

export function WorkspaceLogin({ onLogin, onNavigateToHome, onNavigateToJoinUs }: WorkspaceLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'technician' as 'technician',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onLogin(formData.email, formData.password, formData.role);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2F4F] via-[#2a4066] to-[#1E2F4F] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <span className="text-4xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              A
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Workspace Portal
          </h1>
          <p className="text-blue-200 text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Login Failed
                  </p>
                  <p className="text-sm text-red-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066]'
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
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Not a partner yet?
              </span>
            </div>
          </div>

          {/* Back to Main Site */}
          <button
            onClick={onNavigateToHome}
            className="w-full border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Back to Main Site
          </button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Want to join APPLIASSIST?{' '}
              <button
                onClick={onNavigateToJoinUs}
                className="text-[#1E2F4F] font-semibold hover:underline"
              >
                Apply Now
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
          <p className="text-xs text-blue-100 mb-2 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs text-blue-200" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <p>Technician: tech@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
