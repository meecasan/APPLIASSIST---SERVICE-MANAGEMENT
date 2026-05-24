import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Upload, X, CheckCircle, Wrench, Clock, AlertCircle, Loader } from 'lucide-react';
import { bookingAPI } from '../services/api';
import { getCurrentUser } from '../services/api';
import { toast } from 'sonner';

interface BookingFlowProps {
  technician: any;
  onBack: () => void;
  onBookingComplete?: (bookingData: any) => void;
  userEmail?: string;
}

export default function BookingFlow({ technician, onBack, onBookingComplete, userEmail }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1
    applianceType: '',
    problemDescription: '',
    appliancePhoto: null as File | null,
    preferredDate: '',
    preferredTime: '',

    // Step 2
    streetAddress: '',
    barangay: '',
    city: '',
    zipCode: '',
    contactName: '',
    contactNumber: '',
    additionalInstructions: '',

    // Step 3
    agreedToTerms: false,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const applianceTypes = [
    'Air Conditioner',
    'Refrigerator',
    'Washing Machine',
    'Microwave',
    'Television',
    'Electric Fan',
    'Water Heater',
    'Dishwasher',
    'Oven',
    'Other',
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, appliancePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, appliancePhoto: null });
    setPhotoPreview(null);
  };

  const isStep1Valid = () => {
    return formData.applianceType && formData.problemDescription && formData.preferredDate && formData.preferredTime;
  };

  const isStep2Valid = () => {
    return formData.streetAddress && formData.city && formData.contactName && formData.contactNumber;
  };

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Get current user from localStorage
      const currentUser = getCurrentUser();
      console.debug('[BookingFlow] currentUser (from localStorage):', currentUser);

      // Accept multiple possible id keys saved by different parts of the app
      const customerId = currentUser?.user_id || currentUser?.id || currentUser?.userId || currentUser?.customer_id || null;
      if (!customerId) {
        // Log localStorage for easier debugging
        console.warn('[BookingFlow] No customer id found in currentUser. localStorage:', {
          currentUserStr: localStorage.getItem('currentUser'),
          authToken: localStorage.getItem('authToken'),
        });
        throw new Error('User not logged in');
      }

      const service_address = [
        formData.streetAddress.trim(),
        formData.barangay.trim(),
        formData.city.trim(),
      ].filter(Boolean).join(', ');

      const scheduled_date = formData.preferredDate.trim();
      const problem_description = formData.problemDescription.trim();

      const selectedAppliance = Array.isArray(technician?.services)
        ? technician.services.find((service: any) => {
            const serviceName = service?.service_name || service?.category || '';
            return serviceName === formData.applianceType;
          })
        : null;

      const appliance_id = selectedAppliance?.service_id ?? selectedAppliance?.id ?? technician?.service_id ?? technician?.id ?? null;

      const payload = {
        customer_id: customerId,
        technician_id: technician?.technician_id || technician?.id,
        appliance_id,
        scheduled_date,
        problem_description,
        service_address,
        contact_name: formData.contactName || '',
        contact_number: formData.contactNumber || '',
        additional_instructions: formData.additionalInstructions.trim(),
        status: 'Pending',
      };

      console.log('[BookingFlow] final payload before API call:', {
        ...payload,
        missingRequiredFields: {
          customer_id: payload.customer_id == null || payload.customer_id === '',
          technician_id: payload.technician_id == null || payload.technician_id === '',
          appliance_id: payload.appliance_id == null || payload.appliance_id === '',
          scheduled_date: !payload.scheduled_date,
          problem_description: !payload.problem_description,
          service_address: !payload.service_address,
        },
      });

      if (!payload.scheduled_date || !payload.problem_description || !payload.service_address || !payload.customer_id || !payload.technician_id) {
        throw new Error('Missing required booking fields before submission.');
      }

      // Connect to bookingAPI
      const response = await bookingAPI.createBooking(payload);

      // Show success toast
      toast.success('Booking Confirmed!', {
        description: `Your booking reference is ${response.request_id || response.service_request_id || 'Pending'}. A technician will contact you soon.`,
      });

      // Set the booking reference from the response
      const ref = response.request_id ? `REQ-${response.request_id}` : 
                 (response.service_request_id ? `REQ-${response.service_request_id}` : `BK-${Date.now().toString().slice(-6)}`);
      setBookingReference(ref);

      // Call the callback to save booking if needed
      if (onBookingComplete) {
        onBookingComplete({ ...formData, reference: ref });
      }

      setShowSuccessModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm booking';
      setError(errorMessage);
      console.error('Booking error:', err);
      
      // Show error toast
      toast.error('Booking failed', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  const getTotalEstimate = () => {
    const baseFee = technician.startingFee || 599;
    const serviceFee = 50;
    return baseFee + serviceFee;
  };

  const stepProgress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-8 py-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1E2F4F] mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Book Service Appointment
            </h1>
            <p className="text-lg text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              with {technician.name || 'Technician'}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Enhanced Progress Stepper */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#6B7280]">Progress</span>
                <span className="text-sm font-semibold text-[#1E2F4F]">{Math.round(stepProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1E2F4F] to-blue-600 transition-all duration-300"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentStep >= step
                          ? 'bg-[#1E2F4F] text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    <div className="ml-3 text-left">
                      <p className={`text-sm font-semibold ${currentStep >= step ? 'text-gray-900' : 'text-gray-500'}`}>
                        Step {step}
                      </p>
                      <p className={`text-xs ${currentStep >= step ? 'text-[#6B7280]' : 'text-gray-400'}`}>
                        {step === 1 && 'Service Details'}
                        {step === 2 && 'Contact Info'}
                        {step === 3 && 'Review & Confirm'}
                      </p>
                    </div>
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step ? 'bg-[#1E2F4F]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-[#1E2F4F]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Tell us about your appliance issue
                    </h2>
                    <p className="text-sm text-[#6B7280]">Help the technician prepare for the repair</p>
                  </div>
                </div>

                {/* Appliance Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Appliance Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {applianceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, applianceType: type })}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          formData.applianceType === type
                            ? 'border-[#1E2F4F] bg-[#1E2F4F] text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-[#1E2F4F] hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Problem Description *
                  </label>
                  <textarea
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    rows={4}
                    placeholder="Please describe the issue in detail (e.g., 'Air conditioner not cooling, only blowing warm air')..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  <p className="text-xs text-[#6B7280] mt-2">💡 Detailed descriptions help technicians diagnose faster</p>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Upload Photo (Optional)
                  </label>
                  {!photoPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1E2F4F] hover:bg-gray-50 transition-all group">
                      <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#1E2F4F] mb-2" />
                      <span className="text-sm text-[#6B7280] font-medium">Click to upload appliance photo</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="Appliance" className="w-full h-56 object-cover rounded-lg border-2 border-gray-200" />
                      <button
                        onClick={removePhoto}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent bg-white appearance-none"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Where should the technician go?
                    </h2>
                    <p className="text-sm text-[#6B7280]">Provide your service location and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="+63 XXX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="House/Building No., Street Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Barangay
                    </label>
                    <input
                      type="text"
                      value={formData.barangay}
                      onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                      placeholder="Barangay"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="ZIP"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.additionalInstructions}
                    onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
                    rows={3}
                    placeholder="Any special instructions for the technician (e.g., gate code, parking info)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Review your booking
                    </h2>
                    <p className="text-sm text-[#6B7280]">Please verify all details before confirming</p>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-5">
                  <div className="pb-5 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Service Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Appliance:</span>
                        <span className="text-gray-900 font-semibold">{formData.applianceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Scheduled:</span>
                        <span className="text-gray-900 font-semibold">{formData.preferredDate} at {formData.preferredTime}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#6B7280] mb-1">Issue:</span>
                        <span className="text-gray-900 font-medium bg-white px-3 py-2 rounded-lg">{formData.problemDescription}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pb-5 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Technician</h3>
                    <p className="text-sm text-gray-900 font-semibold">{technician.name || 'Technician'}</p>
                  </div>

                  <div className="pb-5 border-b border-gray-300">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Service Location</h3>
                    <p className="text-sm text-gray-900 font-medium">{formData.streetAddress}, {formData.barangay && `${formData.barangay}, `}{formData.city}</p>
                    <p className="text-sm text-[#6B7280] mt-1">Contact: {formData.contactName} - {formData.contactNumber}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Cost Estimate</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Service Fee</span>
                        <span className="text-gray-900 font-semibold">₱{technician.startingFee || 599}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Platform Fee</span>
                        <span className="text-gray-900 font-semibold">₱50</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-3 mt-2">
                        <span className="text-gray-900">Total Estimate</span>
                        <span className="text-[#1E2F4F] text-xl">₱{getTotalEstimate().toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-800">Final cost may vary based on actual repair and parts needed</p>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                      className="mt-1 w-5 h-5 text-[#1E2F4F] border-gray-300 rounded focus:ring-[#1E2F4F]"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      I agree to the terms and conditions. I understand that the final service cost may vary based on the technician's assessment and actual parts required.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Error confirming booking
                      </p>
                      <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    (currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] shadow-md'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={!formData.agreedToTerms || isSubmitting}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                    !formData.agreedToTerms || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] shadow-md'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full animate-scale-in">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Booking Confirmed!
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#6B7280] mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {bookingReference}
              </p>
            </div>

            <p className="text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Your booking has been confirmed. The technician will contact you shortly to confirm the schedule.
            </p>

            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-semibold transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Go to Tracking
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
