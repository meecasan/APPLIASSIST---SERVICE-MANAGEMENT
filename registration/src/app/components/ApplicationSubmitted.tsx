import React, { useEffect } from 'react';
import { CheckCircle, Mail } from 'lucide-react';

interface ApplicationSubmittedProps {
  onNavigateToHome: () => void;
}

export function ApplicationSubmitted({ onNavigateToHome }: ApplicationSubmittedProps) {
  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigateToHome();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNavigateToHome]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        {/* Success Icon with Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <CheckCircle className="w-32 h-32 text-green-500 animate-scale-in" />
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-25" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Application Submitted!
        </h1>

        {/* Message */}
        <p className="text-lg text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Your application is pending approval. You will be notified once your account is activated.
        </p>

        {/* Subtext */}
        <p className="text-base text-[#6B7280] italic mb-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Redirecting to homepage...
        </p>

        {/* Email Confirmation Card */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
          <div className="flex items-start space-x-3">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-gray-900 font-medium mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Check Your Email
              </p>
              <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                We've sent a confirmation email to your registered email address. You'll receive updates on your application status.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onNavigateToHome}
          className="px-8 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-all"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Return to Homepage
        </button>
      </div>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
