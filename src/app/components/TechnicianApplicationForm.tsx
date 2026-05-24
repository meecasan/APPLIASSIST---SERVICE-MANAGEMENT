import React, { useState } from 'react';
import { CheckCircle, Circle, Check, Upload, X, ArrowLeft, Facebook, Twitter, Instagram, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

interface TechnicianApplicationFormProps {
  onComplete: (applicationData: any) => void;
  onBack: () => void;
}

export function TechnicianApplicationForm({ onComplete, onBack }: TechnicianApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    yearsOfExperience: '',
    technicianId: '',
    specializations: [] as string[],
    serviceTypes: [] as string[],
    profilePhoto: null as File | null,
    profilePhotoPreview: null as string | null,
    governmentId: null as File | null,
    certificate: null as File | null,
  });

  const applianceOptions = [
    'Refrigerator',
    'Air Conditioner',
    'Electric Fan',
    'Television',
    'Washing Machine',
    'Microwave Oven',
    'Water Dispenser',
    'Others',
  ];

  const serviceTypeOptions = [
    'Diagnosis & Inspection',
    'Preventive Maintenance',
    'Repair & Parts Replacement',
    'Installation & Uninstallation',
  ];

  const steps = [
    {
      number: 1,
      title: 'Personal Information',
      subtext: 'Basic contact details',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'upcoming',
    },
    {
      number: 2,
      title: 'Professional Details',
      subtext: 'Skills and experience',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'upcoming',
    },
    {
      number: 3,
      title: 'Documents',
      subtext: 'Upload credentials',
      status: currentStep === 3 ? 'active' : 'upcoming',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((item) => item !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const toggleServiceType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter((item) => item !== type)
        : [...prev.serviceTypes, type],
    }));
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhoto: file,
          profilePhotoPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (field: 'governmentId' | 'certificate', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const removeProfilePhoto = () => {
    setFormData({ ...formData, profilePhoto: null, profilePhotoPreview: null });
  };

  const isStep1Valid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const isStep2Valid = () => {
    return formData.specializations.length > 0;
  };

  const isStep3Valid = () => {
    return formData.profilePhoto !== null && formData.governmentId !== null;
  };

  const handleContinue = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!isStep3Valid()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Parse name into first and last name
      const nameParts = formData.fullName.trim().split(/\s+/);
      const first_name = nameParts[0] || '';
      // If only one word given, use it as both first and last to satisfy backend
      const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '';

      if (!first_name || !last_name) {
        setError('Please enter your full name (first and last name).');
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim() || !formData.password || !formData.phoneNumber.trim()) {
        setError('Email, password, and phone number are required.');
        setIsSubmitting(false);
        return;
      }

      // Build service_area only when at least one address field is filled
      const addressParts = [formData.address.trim(), formData.city.trim()].filter(Boolean);
      const service_area = addressParts.length > 0 ? addressParts.join(', ') : undefined;

      // Call the registration API
      const response = await authAPI.registerTechnician({
        first_name,
        last_name,
        email: formData.email.trim(),
        password: formData.password,
        contact_number: formData.phoneNumber.trim(),
        specialization: formData.specializations.join(', ') || 'General',
        service_area,
      });

      console.log('Technician registration successful:', response);
      
      // Show success toast
      toast.success('Application submitted successfully!', {
        description: 'Your technician application has been submitted and is pending approval.',
      });
      
      // Call the parent callback
      onComplete({
        ...formData,
        registrationResponse: response,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      console.error('Registration error:', err);
      
      // Show error toast
      toast.error('Application submission failed', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              APPLIASSIST
            </span>
          </div>

          {/* Right Side - Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1E2F4F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Back to Join Us</span>
          </button>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-5rem)] bg-white">
        {/* Left Panel - Progress Sidebar */}
        <div className="w-80 bg-[#1E2F4F] px-8 py-10 flex flex-col">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Technician Application
            </h1>
            <p className="text-sm text-gray-300" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Join our network of professionals
            </p>
          </div>

        {/* Progress Section */}
        <div className="flex-1">
          <h2
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Application Progress
          </h2>

          {/* Step List */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-600" style={{ height: '40px' }} />
                )}

                <div className="flex items-start space-x-4">
                  {/* Step Indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {step.status === 'active' ? (
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#1E2F4F]" />
                      </div>
                    ) : step.status === 'completed' ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3
                      className={`text-sm font-medium mb-1 ${
                        step.status === 'active' ? 'text-white' : step.status === 'completed' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs ${step.status === 'active' ? 'text-gray-300' : 'text-gray-600'}`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {step.subtext}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="flex-1 px-16 py-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <>
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Personal Information
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Tell us about yourself
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 1 of 3
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+63 XXX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password (min 6 characters)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                    />
                    {formData.password && formData.password.length < 6 && (
                      <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleContinue}
                    disabled={!isStep1Valid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                      isStep1Valid()
                        ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <>
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Professional Details
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Share your skills and experience
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 2 of 3
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Technician ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Technician ID / License No.
                    </label>
                    <input
                      type="text"
                      value={formData.technicianId}
                      onChange={(e) => handleInputChange('technicianId', e.target.value)}
                      placeholder="Enter ID or license number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Appliance Specializations */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Appliance Specializations <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Select all appliances you can service
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {applianceOptions.map((appliance) => {
                      const isSelected = formData.specializations.includes(appliance);
                      return (
                        <button
                          key={appliance}
                          type="button"
                          onClick={() => toggleSpecialization(appliance)}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-[#1E2F4F] bg-[#1E2F4F] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-[#1E2F4F] hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {isSelected && <Check className="w-4 h-4" />}
                            <span>{appliance}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service Types */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Service Types
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Select the types of services you offer
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceTypeOptions.map((type) => {
                      const isSelected = formData.serviceTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleServiceType(type)}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-[#1E2F4F] bg-[#1E2F4F] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-[#1E2F4F] hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {isSelected && <Check className="w-4 h-4" />}
                            <span>{type}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBackStep}
                    className="px-8 py-3 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!isStep2Valid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                      isStep2Valid()
                        ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <>
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Upload Documents
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Provide your credentials for verification
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 3 of 3
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {/* Profile Photo */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Profile Photo <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload a clear photo of yourself
                  </p>

                  {formData.profilePhotoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.profilePhotoPreview}
                        alt="Profile Preview"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={removeProfilePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors">
                      <label htmlFor="profilePhoto" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Browse Files
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            JPG, PNG (Max 5MB)
                          </p>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Government ID */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Government-Issued ID <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload a valid government ID
                  </p>

                  {formData.governmentId ? (
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            {formData.governmentId.name}
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {(formData.governmentId.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, governmentId: null })}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors">
                      <label htmlFor="governmentId" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Browse Files
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            JPG, PNG, PDF (Max 5MB)
                          </p>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="governmentId"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={(e) => handleFileUpload('governmentId', e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Certificate (Optional) */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    TESDA Certificate (Optional)
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload your certification if available
                  </p>

                  {formData.certificate ? (
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            {formData.certificate.name}
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {(formData.certificate.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, certificate: null })}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors">
                      <label htmlFor="certificate" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Browse Files
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            JPG, PNG, PDF (Max 5MB)
                          </p>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="certificate"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={(e) => handleFileUpload('certificate', e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Error submitting application
                      </p>
                      <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBackStep}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isStep3Valid() || isSubmitting}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      isStep3Valid() && !isSubmitting
                        ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>  );
}