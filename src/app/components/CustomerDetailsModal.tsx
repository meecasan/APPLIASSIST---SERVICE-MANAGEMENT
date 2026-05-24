import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ServiceItem {
  id: string;
  jobOrderNo: string;
  created: string;
  scheduledFor: string;
  scheduledTime: string;
  status: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  services: string[];
  appliance: string;
  brandModel: string;
  problem: string;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  service: ServiceItem;
  onClose: () => void;
  onReschedule: () => void;
}

export function CustomerDetailsModal({ isOpen, service, onClose, onReschedule }: CustomerDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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

    return () => {
      currentModal?.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with 50% opacity */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-50" onClick={onClose} />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col"
        style={{ animationTimingFunction: 'ease', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Job Order & Schedule Combined */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Job Order No.
              </label>
              <p className="text-sm text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {service.jobOrderNo}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Scheduled Date & Time
              </label>
              <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {formatDate(service.scheduledFor)} at {service.scheduledTime}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-2.5 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Customer Information
            </h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Name
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.clientName}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Contact
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.clientPhone}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Address
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.clientAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Appliance Details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-2.5 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Appliance Details
            </h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Appliance
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.appliance}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Brand / Model
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.brandModel}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-0.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Problem
                </label>
                <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.problem}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <button
            onClick={onReschedule}
            className="px-5 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors text-sm font-medium"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}