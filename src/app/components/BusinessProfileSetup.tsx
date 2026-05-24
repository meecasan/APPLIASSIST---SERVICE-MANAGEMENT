import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface BusinessProfileSetupProps {
  onContinue: (data: BusinessInfoData) => void;
}

export interface BusinessInfoData {
  businessName: string;
  taxNumber: string;
  streetName: string;
  buildingNumber: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
  emailAddress: string;
}

interface FormData {
  businessName: string;
  taxNumber: string;
  streetName: string;
  buildingNumber: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
  emailAddress: string;
}

interface FormErrors {
  businessName?: string;
  taxNumber?: string;
  phoneNumber?: string;
  emailAddress?: string;
}

export function BusinessProfileSetup({ onContinue }: BusinessProfileSetupProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    taxNumber: '',
    streetName: '',
    buildingNumber: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    emailAddress: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Progress steps
  const steps = [
    { 
      id: 1, 
      name: 'Business Information', 
      subtext: 'Enter business details',
      completed: false, 
      current: true 
    },
    { 
      id: 2, 
      name: 'Service & Payment', 
      subtext: 'Configure services and GCash',
      completed: false, 
      current: false 
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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    // Only validate required fields
    const requiredFields = ['businessName', 'taxNumber', 'phoneNumber', 'emailAddress'];
    
    if (requiredFields.includes(name) && !value.trim()) {
      return 'This field is required';
    }

    // Skip validation for optional fields if empty
    if (!requiredFields.includes(name) && !value.trim()) {
      return undefined;
    }

    switch (name) {
      case 'emailAddress':
        if (value && !validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phoneNumber':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'taxNumber':
        if (value && value.length < 5) {
          return 'Please enter a valid tax number';
        }
        break;
    }

    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name as keyof FormErrors] = error;
        } else {
          delete newErrors[name as keyof FormErrors];
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name as keyof FormData, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name as keyof FormErrors] = error;
      } else {
        delete newErrors[name as keyof FormErrors];
      }
      return newErrors;
    });
  };

  const handleContinue = () => {
    // Validate all required fields
    const requiredFields: (keyof FormData)[] = ['businessName', 'taxNumber', 'phoneNumber', 'emailAddress'];
    const newErrors: FormErrors = {};
    let hasErrors = false;

    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(
      requiredFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (!hasErrors) {
      // Proceed to next step
      console.log('Form data:', formData);
      onContinue(formData);
    }
  };

  // Check if form is valid (all required fields filled and no errors)
  const isFormValid = () => {
    const requiredFieldsFilled = 
      formData.businessName.trim() !== '' &&
      formData.taxNumber.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.emailAddress.trim() !== '';

    const noErrors = Object.keys(errors).length === 0;
    
    return requiredFieldsFilled && noErrors && 
           validateEmail(formData.emailAddress) && 
           validatePhone(formData.phoneNumber);
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
                    Business Information
                  </h2>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Enter your business details and contact information
                  </p>
                </div>
                {/* Step Badge */}
                <div className="bg-[#1E2F4F] text-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 1 of 3
                  </span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-10 py-10">
              <div className="grid grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="col-span-2">
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your business name"
                    className={`w-full px-4 py-3 border ${
                      errors.businessName && touched.businessName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {errors.businessName && touched.businessName && (
                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Tax Number */}
                <div className="col-span-2">
                  <label
                    htmlFor="taxNumber"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Tax Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter tax number"
                    className={`w-full px-4 py-3 border ${
                      errors.taxNumber && touched.taxNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {errors.taxNumber && touched.taxNumber && (
                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.taxNumber}
                    </p>
                  )}
                </div>

                {/* Street Name */}
                <div>
                  <label
                    htmlFor="streetName"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Street Name
                  </label>
                  <input
                    type="text"
                    id="streetName"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter street name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                </div>

                {/* Building Number */}
                <div>
                  <label
                    htmlFor="buildingNumber"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Building Number
                  </label>
                  <input
                    type="text"
                    id="buildingNumber"
                    name="buildingNumber"
                    value={formData.buildingNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter building number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter ZIP code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 border ${
                      errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-medium text-gray-900 mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 border ${
                      errors.emailAddress && touched.emailAddress ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {errors.emailAddress && touched.emailAddress && (
                    <p className="mt-1.5 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.emailAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Footer with Continue Button */}
            <div className="px-10 py-6 border-t border-gray-200 flex justify-end">
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