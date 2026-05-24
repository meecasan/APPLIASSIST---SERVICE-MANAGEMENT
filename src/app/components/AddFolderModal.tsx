import React, { useState, useEffect, useRef } from 'react';
import { X, Folder, CheckCircle } from 'lucide-react';

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderData: { folderName: string }) => void;
}

export function AddFolderModal({ isOpen, onClose, onSave }: AddFolderModalProps) {
  const [currentState, setCurrentState] = useState<'form' | 'success'>('form');
  const [hasChanges, setHasChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    folderName: '',
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        if (currentState === 'success') {
          handleClose();
        } else {
          handleCloseAttempt();
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, hasChanges, currentState]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleTab);
    const currentModal = modalRef.current;

    // Auto-focus first input
    setTimeout(() => {
      if (currentState === 'form') {
        firstElement?.focus();
      }
    }, 100);

    return () => {
      currentModal?.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, currentState]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCloseAttempt = () => {
    if (hasChanges && currentState === 'form') {
      setShowCloseConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentState('form');
    setHasChanges(false);
    setShowCloseConfirm(false);
    setFormData({
      folderName: '',
    });
    onClose();
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.folderName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Save and show success state
    onSave(formData);
    setCurrentState('success');
  };

  if (!isOpen) return null;

  // Close confirmation dialog
  if (showCloseConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Discard Changes?
          </h3>
          <p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            You have unsaved changes. Are you sure you want to close?
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCloseConfirm(false)}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (currentState === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Success Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-[450px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: 'ease' }}
        >
          <div className="px-8 py-10 text-center">
            {/* Success Icon with Floating Dots */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Floating decorative dots - matching reference image */}
                <div className="absolute top-0 left-8 w-3 h-3 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-12 -left-12 w-3 h-3 bg-[#1E2F4F] rounded-full" />
                <div className="absolute bottom-4 -left-8 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-4 right-8 w-3.5 h-3.5 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-16 right-4 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                <div className="absolute bottom-8 right-8 w-2.5 h-2.5 bg-[#1E2F4F] rounded-full" />
                
                {/* Main Success Icon - Large Blue Circle */}
                <div className="w-32 h-32 bg-[#1E2F4F] rounded-full flex items-center justify-center">
                  {/* White Circle Background */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    {/* Checkmark Icon */}
                    <CheckCircle className="w-12 h-12 text-[#1E2F4F]" strokeWidth={2.5} fill="#1E2F4F" />
                  </div>
                </div>
              </div>
            </div>

            {/* Success Text */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Folder Created!
            </h2>
            <p className="text-sm text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Your folder has been successfully created
            </p>

            {/* Okay Button - Outlined Style */}
            <button
              onClick={handleClose}
              className="w-full max-w-[400px] px-12 py-3 border-2 border-gray-300 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition-all mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[500px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{ animationTimingFunction: 'ease' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Step Badge */}
              <div
                className="flex items-center justify-center w-7 h-7 bg-[#1E2F4F] text-white rounded-full text-sm font-medium"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Folder Details
              </h2>
            </div>
            <button
              onClick={handleCloseAttempt}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <div className="space-y-5">
            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Folder Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Folder className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.folderName}
                  onChange={(e) => handleInputChange('folderName', e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                  ref={firstInputRef}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleCloseAttempt}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            BACK
          </button>

          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2C3E50] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}