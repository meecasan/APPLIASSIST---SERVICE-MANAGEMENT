import React, { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteProductModalProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProductModal({ isOpen, productName, onConfirm, onCancel }: DeleteProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset success state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

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
        if (showSuccess) {
          handleClose();
        } else {
          onCancel();
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel, showSuccess]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

    // Auto-focus the No button (safer default)
    setTimeout(() => {
      const noButton = currentModal?.querySelector('[data-action="cancel"]') as HTMLElement;
      noButton?.focus();
    }, 100);

    return () => {
      currentModal?.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  const handleConfirmDelete = () => {
    onConfirm();
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    onCancel();
  };

  if (!isOpen) return null;

  // Success State
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Success Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: 'ease' }}
        >
          <div className="px-6 py-8 text-center">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Success!
            </h2>
            <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Product deleted successfully
            </p>

            {/* Action Buttons - Horizontal */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Save only
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Send receipt & save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation State
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[400px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ animationTimingFunction: 'ease' }}
      >
        {/* Icon Section */}
        <div className="pt-8 pb-6 flex justify-center">
          <div className="relative">
            {/* Floating particles */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-0 -left-3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute -bottom-2 right-1 w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            
            {/* Main Icon Container */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Deleting Product
          </h2>
          <p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Are you sure you want to delete the product <span className="font-medium text-gray-900">"{productName}"</span>?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              data-action="cancel"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              No
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}