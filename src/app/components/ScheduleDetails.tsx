import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown, Calendar, Clock, X } from 'lucide-react';

interface ScheduleItem {
  id: string;
  jobOrderNo: string;
  created: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  services: string[];
  appliance: string;
  brandModel: string;
  problem: string;
  technicianNotes?: string;
}

interface ScheduleDetailsProps {
  schedule: ScheduleItem;
  onBack: () => void;
  onStatusUpdate?: (scheduleId: string, newStatus: ScheduleItem['status']) => void;
  onReschedule?: (scheduleId: string, date: string, time: string) => void;
  onCancelAppointment?: (scheduleId: string, reason?: string) => void;
}

export function ScheduleDetails({
  schedule,
  onBack,
  onStatusUpdate,
  onReschedule,
  onCancelAppointment
}: ScheduleDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState(schedule.status);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(schedule.scheduledFor);
  const [scheduledTime, setScheduledTime] = useState(schedule.scheduledTime);
  const [technicianNotes, setTechnicianNotes] = useState(schedule.technicianNotes || '');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions: Array<{
    value: ScheduleItem['status'];
    label: string;
    bgColor: string;
    textColor: string;
  }> = [
    { value: 'confirmed', label: 'Confirmed', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    { value: 'pending', label: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { value: 'in-progress', label: 'In Progress', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'completed', label: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'canceled', label: 'Canceled', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { value: 'no-show', label: 'No-show', bgColor: 'bg-gray-700', textColor: 'text-white' },
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? `${option.bgColor} ${option.textColor}` : 'bg-gray-100 text-gray-800';
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (newStatus: ScheduleItem['status']) => {
    setCurrentStatus(newStatus);
    setShowStatusDropdown(false);
    if (onStatusUpdate) {
      onStatusUpdate(schedule.id, newStatus);
    }
  };

  const handleSaveReschedule = () => {
    if (onReschedule) {
      onReschedule(schedule.id, scheduledDate, scheduledTime);
    }
    setShowReschedule(false);
  };

  const handleCancelAppointment = () => {
    if (onCancelAppointment) {
      onCancelAppointment(schedule.id, cancelReason);
    }
    if (onStatusUpdate) {
      onStatusUpdate(schedule.id, 'canceled');
    }
    setCurrentStatus('canceled');
    setShowCancelConfirm(false);
    setCancelReason('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div>
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 -mx-8 -mt-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Back to Schedule
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Schedule Details
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
            View and manage appointment information
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Schedule Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Scheduled Date & Time
              </p>
              <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {formatDate(scheduledDate)} at {formatTime(scheduledTime)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Status
              </p>
              <div className="relative inline-block" ref={statusDropdownRef}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  <span>{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace('-', ' ')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50 min-w-[160px] border border-gray-200 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                          currentStatus === option.value ? 'font-semibold' : ''
                        }`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${option.bgColor} ${option.textColor}`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Name
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.clientName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Contact
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.clientPhone}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Address
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.clientAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Appliance Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Appliance Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Appliance
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.appliance}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Brand / Model
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.brandModel}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Problem
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.problem}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Services
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {schedule.services.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Technician Notes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Technician Notes
            </h2>
            <textarea
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="Add notes about this appointment..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            />
          </div>

          {/* Reschedule Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Reschedule Appointment
              </h2>
              {!showReschedule && (
                <button
                  onClick={() => setShowReschedule(true)}
                  className="px-5 py-2.5 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold text-sm"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Reschedule
                </button>
              )}
            </div>

            {showReschedule && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Select New Date & Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      New Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <Clock className="w-4 h-4 inline mr-2" />
                      New Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowReschedule(false)}
                    className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReschedule}
                    className="px-5 py-2.5 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cancel Appointment Section */}
          {currentStatus !== 'canceled' && (
            <div className="pt-6 border-t border-gray-200">
              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-6 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel Appointment
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Cancel Appointment
                  </h3>
                  <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Are you sure you want to cancel this appointment? This action will update the status to "Canceled".
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Cancellation Reason (Optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Provide reason for cancellation..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowCancelConfirm(false);
                        setCancelReason('');
                      }}
                      className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Keep Appointment
                    </button>
                    <button
                      onClick={handleCancelAppointment}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
