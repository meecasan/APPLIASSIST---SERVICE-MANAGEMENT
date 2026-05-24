import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Wrench } from 'lucide-react';
import type { UserRole } from '../App';

interface CreateAccountProps {
  onRegister: (email: string, password: string, role: UserRole) => { success: boolean; message: string };
  onNavigateToLogin: () => void;
}

export function CreateAccount({ onRegister, onNavigateToLogin }: CreateAccountProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [error, setError] = useState('');

  const isFormValid = 
    email.trim() !== '' && 
    password.trim() !== '' && 
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    role !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
      } else {
        setError('Please fill in all fields and select a role');
      }
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = onRegister(email, password, role);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join APPLIASSIST to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I'm a...
              </label>
            <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    role === 'technician'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Wrench className={`w-8 h-8 mb-2 ${role === 'technician' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${role === 'technician' ? 'text-blue-600' : 'text-gray-700'}`}>
                    Technician
                  </span>
                </button>
            </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isFormValid
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Create Account
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Note:</strong> Select your role carefully. Technicians have access to service tools and manage their scheduled repairs.
          </p>
        </div>
      </div>
    </div>
  );
}
