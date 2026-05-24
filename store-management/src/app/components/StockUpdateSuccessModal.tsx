import React from 'react';
import { Check } from 'lucide-react';

interface StockUpdateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockUpdateSuccessModal({ isOpen, onClose }: StockUpdateSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 py-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon with Floating Dots */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Floating decorative dots - primary color theme */}
              <div className="absolute -top-2 -left-8 w-2.5 h-2.5 bg-[#1E2F4F] rounded-full" />
              <div className="absolute top-1 -right-10 w-3 h-3 bg-[#1E2F4F] rounded-full" />
              <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-[#1E2F4F] rounded-full" />
              <div className="absolute bottom-4 -left-6 w-2 h-2 bg-[#1E2F4F] rounded-full" />
              
              {/* Main Success Icon - Large Primary Circle */}
              <div className="w-20 h-20 bg-[#1E2F4F] rounded-full flex items-center justify-center">
                {/* White Circle Background */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  {/* Check Icon */}
                  <svg
                    className="w-7 h-7 text-[#1E2F4F]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Success Text */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Success!
            </h2>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Stock updated successfully
            </p>
          </div>

          {/* Action Buttons - Horizontal */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Save only
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Send receipt & save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}