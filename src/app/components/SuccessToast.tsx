import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessOverlayProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessOverlay({
  isOpen,
  message,
  onClose,
}: SuccessOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      {/* Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            Success
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>

          <p
            className="text-sm text-gray-700"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
