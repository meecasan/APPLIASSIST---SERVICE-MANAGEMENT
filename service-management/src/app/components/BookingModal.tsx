import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Wrench, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician?: {
    id: string;
    name: string;
    photo: string;
    specialty: string;
    rating: number;
  };
  service?: {
    name: string;
    category: string;
    price: string;
  };
  onSubmit: (bookingData: BookingData) => void;
}

export interface BookingData {
  technicianId: string;
  technicianName: string;
  serviceName: string;
  serviceCategory: string;
  date: string;
  time: string;
  problemDescription: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}

export function BookingModal({ isOpen, onClose, technician, service, onSubmit }: BookingModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    problemDescription: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Available time slots
  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        date: '',
        time: '',
        problemDescription: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll
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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Address is required';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = 'Please describe the problem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const bookingData: BookingData = {
        technicianId: technician?.id || '',
        technicianName: technician?.name || '',
        serviceName: service?.name || '',
        serviceCategory: service?.category || '',
        date: formData.date,
        time: formData.time,
        problemDescription: formData.problemDescription,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        status: 'pending',
      };
      onSubmit(bookingData);
      onClose();
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Book Service
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Schedule your appliance service appointment
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="space-y-6">
            {/* Technician Info */}
            {technician && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={technician.photo}
                    alt={technician.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-[#1E2F4F]" />
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {technician.name}
                      </h3>
                    </div>
                    <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {technician.specialty}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Service Info */}
            {service && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <Wrench className="w-5 h-5 text-green-700" />
                  <div>
                    <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {service.name}
                    </h4>
                    <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {service.category} • Starting at ₱{service.price}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Your Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2.5 border ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="09XX XXX XXXX"
                    className={`w-full px-4 py-2.5 border ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.customerPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Service Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Enter complete address (Street, Barangay, City)"
                    rows={3}
                    className={`w-full px-4 py-2.5 border ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  {errors.customerAddress && (
                    <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.customerAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Select Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.date}
                      min={today}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 border ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.time && (
                    <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                placeholder="Please describe the issue with your appliance in detail..."
                rows={4}
                className={`w-full px-4 py-2.5 border ${
                  errors.problemDescription ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              />
              {errors.problemDescription && (
                <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {errors.problemDescription}
                </p>
              )}
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Booking Confirmation
                  </p>
                  <p className="text-xs text-blue-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Your booking request will be sent to the technician. You'll receive a confirmation once the technician
                    accepts your request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 rounded-b-2xl flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Submit Booking
          </button>
        </div>
      </div>
    </div>
  );
}
