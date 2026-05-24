import React, { useEffect, useState } from 'react';
import { Clock, Info, CheckCircle, XCircle } from 'lucide-react';
import { onUserApproved, offUserApproved, onUserRejected, offUserRejected } from '../services/realtime';

interface PendingApprovalProps {
  userRole: 'technician';
  onLogout: () => void;
  onNavigateToHome: () => void;
}

export function PendingApproval({ userRole, onLogout, onNavigateToHome }: PendingApprovalProps) {
  const roleLabel = 'technician';
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');

  // Subscribe to real-time approval/rejection events
  useEffect(() => {
    const handleUserApproved = (user: any) => {
      setApproved(true);
      // After 3 seconds, navigate to dashboard based on role
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    };

    const handleUserRejected = (user: any) => {
      setRejected(true);
      setRejectionMessage('Your application has been rejected. Please contact support for more information.');
    };

    onUserApproved(handleUserApproved);
    onUserRejected(handleUserRejected);

    return () => {
      offUserApproved(handleUserApproved);
      offUserRejected(handleUserRejected);
    };
  }, [userRole]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-12">
      {/* Approved Message */}
      {approved && (
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Account Approved!
          </h1>
          <p className="text-lg text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Congratulations! Your {roleLabel} account has been approved. You will be redirected to your dashboard shortly.
          </p>
          <div className="animate-spin inline-flex">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      )}

      {/* Rejected Message */}
      {rejected && (
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Application Rejected
          </h1>
          <p className="text-lg text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {rejectionMessage}
          </p>
          <div className="space-y-4">
            <button
              onClick={onLogout}
              className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Logout
            </button>
            <button
              onClick={onNavigateToHome}
              className="w-full px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}

      {/* Pending Message (default) */}
      {!approved && !rejected && (
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        {/* Clock Icon with Pulse Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Clock className="w-32 h-32 text-yellow-500 animate-pulse-slow" />
            {/* Circular progress indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-yellow-200"
                  strokeDasharray="364"
                  strokeDashoffset="91"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Account Pending Approval
        </h1>

        {/* Message */}
        <p className="text-lg text-[#6B7280] mb-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Your {roleLabel} account is awaiting admin approval. You will be notified once your account is activated.
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 text-left">
          <div className="mb-4">
            <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Status
            </p>
            <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm">
              Pending Approval
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <div className="flex justify-between">
              <span>Submitted:</span>
              <span className="font-medium text-gray-900">May 12, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Expected approval:</span>
              <span className="font-medium text-gray-900">3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 mb-10 text-left">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                What's next?
              </p>
              <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Our admin team is reviewing your application and documents. You'll receive an email notification once your account is activated.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onLogout}
            className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Logout
          </button>
          <button
            onClick={onNavigateToHome}
            className="w-full px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Return to Homepage
          </button>
        </div>
      </div>
      )}

      {/* Custom CSS for slow pulse animation */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
