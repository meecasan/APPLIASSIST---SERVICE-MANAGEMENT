import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface ServicePaymentSetupProps {
  onBack: () => void;
  onContinue: (data: ServicePaymentData) => void;
}

export interface ServicePaymentData {
  serviceAvailability: 'has-services' | 'no-services' | null;
  gcashNumber: string;
}

export function ServicePaymentSetup({ onBack, onContinue }: ServicePaymentSetupProps) {
  const [formData, setFormData] = useState<ServicePaymentData>({
    serviceAvailability: null,
    gcashNumber: '',
  });

  const [gcashError, setGcashError] = useState<string>('');
  const [gcashTouched, setGcashTouched] = useState(false);

  // Progress steps
  const steps = [
    { 
      id: 1, 
      name: 'Business Information', 
      subtext: 'Enter business details',
      completed: true, 
      current: false 
    },
    { 
      id: 2, 
      name: 'Service & Payment', 
      subtext: 'Configure services and GCash',
      completed: false, 
      current: true 
    },
    { 
      id: 3, 
      name: 'Logo & Branding', 
      subtext: 'Upload company logo',
      completed: false, 
      current: false 
    },
  ];

  const currentStepIndex = steps.findIndex(step => step.current);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  // Validate Philippine mobile number format
  const validateGCashNumber = (number: string): string | undefined => {
    if (!number.trim()) {
      return undefined; // GCash is optional
    }

    // Remove spaces and hyphens
    const cleaned = number.replace(/[\s\-]/g, '');

    // Check if it's numeric
    if (!/^\d+$/.test(cleaned)) {
      return 'Please enter numbers only';
    }

    // Check Philippine mobile format (09XXXXXXXXX or 9XXXXXXXXX)
    if (cleaned.startsWith('09')) {
      if (cleaned.length !== 11) {
        return 'Please enter an 11-digit mobile number (09XXXXXXXXX)';
      }
    } else if (cleaned.startsWith('9')) {
      if (cleaned.length !== 10) {
        return 'Please enter a 10-digit mobile number (9XXXXXXXXX)';
      }
    } else {
      return 'Mobile number must start with 09 or 9';
    }

    return undefined;
  };

  const handleServiceSelect = (service: 'has-services' | 'no-services') => {
    setFormData(prev => ({ ...prev, serviceAvailability: service }));
  };

  const handleGCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, gcashNumber: value }));

    // Real-time validation
    if (gcashTouched) {
      const error = validateGCashNumber(value);
      setGcashError(error || '');
    }
  };

  const handleGCashBlur = () => {
    setGcashTouched(true);
    const error = validateGCashNumber(formData.gcashNumber);
    setGcashError(error || '');
  };

  const handleContinue = () => {
    // Validate GCash if provided
    if (formData.gcashNumber.trim()) {
      const error = validateGCashNumber(formData.gcashNumber);
      if (error) {
        setGcashError(error);
        setGcashTouched(true);
        return;
      }
    }

    // Proceed to next step
    onContinue(formData);
  };

  // Check if form is valid
  const isFormValid = () => {
    // Service selection is required
    if (!formData.serviceAvailability) {
      return false;
    }

    // If GCash number is provided, it must be valid
    if (formData.gcashNumber.trim()) {
      const error = validateGCashNumber(formData.gcashNumber);
      if (error) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Setup Progress */}
      <div className="w-80 bg-[#1E2F4F] flex-shrink-0 p-8">
        <div className="mb-12">
          {/* Sidebar Header */}
          <h1 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Company Profile
          </h1>
          <p className="text-gray-300 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Business Setup Wizard
          </p>
        </div>

        {/* Setup Progress Section */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Setup Progress
          </h2>

          {/* Steps List - Vertical Timeline */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4 relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-4 top-10 w-0.5 h-12 ${
                      step.completed ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  ></div>
                )}

                {/* Step Indicator */}
                <div className="flex-shrink-0 relative z-10">
                  {step.completed ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                  ) : step.current ? (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ring-4 ring-white/20">
                      <span className="text-[#1E2F4F] text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {step.id}
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {step.id}
                      </span>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 pt-0.5">
                  <p
                    className={`font-semibold mb-1 ${
                      step.current ? 'text-white' : step.completed ? 'text-green-300' : 'text-gray-500'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {step.name}
                  </p>
                  <p 
                    className={`text-xs ${
                      step.current ? 'text-gray-300' : 'text-gray-500'
                    }`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {step.subtext}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Form Header */}
            <div className="px-10 py-8 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1E2F4F] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Service & Payment Setup
                  </h2>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Configure service availability and payment options
                  </p>
                </div>
                {/* Step Badge */}
                <div className="bg-[#1E2F4F] text-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 2 of 3
                  </span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-10 py-10 space-y-10">
              {/* Service Availability Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Service Availability
                </h3>
                
                <div className="space-y-4">
                  {/* Has Services Option */}
                  <button
                    type="button"
                    onClick={() => handleServiceSelect('has-services')}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                      formData.serviceAvailability === 'has-services'
                        ? 'border-[#1E2F4F] bg-[#1E2F4F]/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio Circle */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.serviceAvailability === 'has-services'
                            ? 'border-[#1E2F4F]'
                            : 'border-gray-300'
                        }`}>
                          {formData.serviceAvailability === 'has-services' && (
                            <div className="w-3 h-3 bg-[#1E2F4F] rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Option Content */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Has Services
                        </p>
                        <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          We offer repair or maintenance services
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* No Services Option */}
                  <button
                    type="button"
                    onClick={() => handleServiceSelect('no-services')}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                      formData.serviceAvailability === 'no-services'
                        ? 'border-[#1E2F4F] bg-[#1E2F4F]/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio Circle */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.serviceAvailability === 'no-services'
                            ? 'border-[#1E2F4F]'
                            : 'border-gray-300'
                        }`}>
                          {formData.serviceAvailability === 'no-services' && (
                            <div className="w-3 h-3 bg-[#1E2F4F] rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Option Content */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          No Services
                        </p>
                        <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          We only sell products or parts
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* GCash Payment Setup Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  GCash Payment Setup
                </h3>
                
                <div>
                  <label
                    htmlFor="gcashNumber"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    GCash Account Number
                  </label>
                  <input
                    type="text"
                    id="gcashNumber"
                    name="gcashNumber"
                    value={formData.gcashNumber}
                    onChange={handleGCashChange}
                    onBlur={handleGCashBlur}
                    placeholder="Enter GCash mobile number"
                    className={`w-full px-4 py-3 border ${
                      gcashError && gcashTouched ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {gcashError && gcashTouched ? (
                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {gcashError}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Enter your registered GCash mobile number for transactions
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Footer with Navigation Buttons */}
            <div className="px-10 py-6 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-3 bg-white text-[#1E2F4F] border-2 border-[#1E2F4F] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="px-10 py-3 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
