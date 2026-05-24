import React, { useEffect, useRef, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

interface RescheduleServiceModalProps {
  isOpen: boolean;
  customerName: string;
  currentDate: string;
  currentTime: string;
  onClose: () => void;
  onSave: (date: string, time: string, notes: string) => void;
}

export function RescheduleServiceModal({
  isOpen,
  customerName,
  currentDate,
  currentTime,
  onClose,
  onSave,
}: RescheduleServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [newDate, setNewDate] = useState(currentDate);
  const [newTime, setNewTime] = useState(currentTime);
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewDate(currentDate);
      setNewTime(currentTime);
      setNotes("");
    }
  }, [isOpen, currentDate, currentTime]);

  // Reset success state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        if (showSuccess) {
          handleClose();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, showSuccess]);

  const handleSave = () => {
    onSave(newDate, newTime, notes);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  // Success State
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Success Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: "ease" }}
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
            <h2
              className="text-xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Success!
            </h2>
            <p
              className="text-sm text-gray-600 mb-6"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Service rescheduled successfully!
            </p>

            {/* Action Buttons - Horizontal */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                style={{
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Save only
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                style={{
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Send receipt & save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reschedule Form State
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with 50% opacity */}
      <div
        className="absolute inset-0 bg-black/30 bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col"
        style={{ animationTimingFunction: "ease", maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Reschedule Service
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
          {/* Customer Name (Read-only) */}
          <div>
            <label
              className="block text-xs font-medium text-gray-500 mb-1.5"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              Customer
            </label>
            <div
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {customerName}
            </div>
          </div>

          {/* New Date */}
          <div>
            <label
              className="block text-xs font-medium text-gray-500 mb-1.5"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              New Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2.5 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{ fontFamily: "Manrope, sans-serif" }}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* New Time */}
          <div>
            <label
              className="block text-xs font-medium text-gray-500 mb-1.5"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              New Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2.5 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{ fontFamily: "Manrope, sans-serif" }}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Notes / Reason */}
          <div>
            <label
              className="block text-xs font-medium text-gray-500 mb-1.5"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              Notes / Reason <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Enter reason for rescheduling..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              style={{ fontFamily: "Manrope, sans-serif" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            style={{
              fontFamily: "Instrument Sans, sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors text-sm font-medium"
            style={{
              fontFamily: "Instrument Sans, sans-serif",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}