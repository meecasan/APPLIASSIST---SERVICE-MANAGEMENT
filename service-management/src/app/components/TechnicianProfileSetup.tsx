import React, { useState } from 'react';
import { CheckCircle, Circle, Check, Upload, X } from 'lucide-react';

interface TechnicianProfileSetupProps {
  onComplete?: () => void;
}

export function TechnicianProfileSetup({ onComplete }: TechnicianProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    technicianId: '',
    phoneNumber: '',
    email: '',
    streetName: '',
    buildingNumber: '',
    zipCode: '',
    city: '',
  });

  const [skillsData, setSkillsData] = useState({
    applianceExpertise: [] as string[],
    repairCapabilities: [] as string[],
  });

  const [verificationData, setVerificationData] = useState({
    profilePhoto: null as File | null,
    profilePhotoPreview: null as string | null,
    supportingDocuments: [] as File[],
  });

  const applianceOptions = [
    'Refrigerator',
    'Air Conditioner',
    'Electric Fan',
    'Television',
    'Washing Machine',
    'Microwave Oven',
    'Water Dispenser',
    'Others (specify)',
  ];

  const repairCapabilityOptions = [
    'Diagnosis & Inspection',
    'Preventive Maintenance',
    'Repair & Parts Replacement',
    'Installation & Uninstallation',
  ];

  const steps = [
    {
      number: 1,
      title: 'Personal Information',
      subtext: 'Basic technician details',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'upcoming',
    },
    {
      number: 2,
      title: 'Skills & Service Type',
      subtext: 'Configure services and GCash',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'upcoming',
    },
    {
      number: 3,
      title: 'Profile & Verification',
      subtext: 'Upload photo',
      status: currentStep === 3 ? 'active' : 'upcoming',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleApplianceExpertise = (appliance: string) => {
    setSkillsData((prev) => ({
      ...prev,
      applianceExpertise: prev.applianceExpertise.includes(appliance)
        ? prev.applianceExpertise.filter((item) => item !== appliance)
        : [...prev.applianceExpertise, appliance],
    }));
  };

  const toggleRepairCapability = (capability: string) => {
    setSkillsData((prev) => ({
      ...prev,
      repairCapabilities: prev.repairCapabilities.includes(capability)
        ? prev.repairCapabilities.filter((item) => item !== capability)
        : [...prev.repairCapabilities, capability],
    }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.technicianId.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.email.trim() !== ''
    );
  };

  const isSkillsValid = () => {
    return skillsData.applianceExpertise.length > 0;
  };

  const handleContinue = () => {
    if (currentStep === 1 && isFormValid()) {
      setCurrentStep(2);
      console.log('Form submitted:', formData);
    } else if (currentStep === 2 && isSkillsValid()) {
      setCurrentStep(3);
      console.log('Skills submitted:', skillsData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a JPG or PNG file');
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationData({
          ...verificationData,
          profilePhoto: file,
          profilePhotoPreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSupportingDocumentsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setVerificationData({
        ...verificationData,
        supportingDocuments: [...verificationData.supportingDocuments, ...files],
      });
    }
  };

  const removeSupportingDocument = (index: number) => {
    setVerificationData({
      ...verificationData,
      supportingDocuments: verificationData.supportingDocuments.filter((_, i) => i !== index),
    });
  };

  const removeProfilePhoto = () => {
    setVerificationData({
      ...verificationData,
      profilePhoto: null,
      profilePhotoPreview: null,
    });
  };

  const isVerificationValid = () => {
    return verificationData.profilePhoto !== null && verificationData.supportingDocuments.length > 0;
  };

  const handleCompleteSetup = () => {
    if (isVerificationValid()) {
      console.log('Setup completed!', {
        formData,
        skillsData,
        verificationData: {
          profilePhotoName: verificationData.profilePhoto?.name,
          supportingDocumentsCount: verificationData.supportingDocuments.length,
        },
      });
      if (onComplete) {
        onComplete();
      }
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Setup Progress Sidebar */}
      <div className="w-80 bg-[#1E2F4F] px-8 py-10 flex flex-col">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Profile
          </h1>
          <p className="text-sm text-gray-300" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Technician Setup Wizard
          </p>
        </div>

        {/* Progress Section */}
        <div className="flex-1">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Setup Progress
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
                      className={`text-xs ${
                        step.status === 'active' ? 'text-gray-300' : 'text-gray-600'
                      }`}
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

      {/* Right Panel - Main Form Content */}
      <div className="flex-1 px-16 py-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <>
              {/* Section Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Personal Information
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Enter your personal and contact details
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 1 of 3
                  </span>
                </div>
              </div>

              {/* Form Fields */}
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

                  {/* Technician ID / License No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Technician ID / License No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.technicianId}
                      onChange={(e) => handleInputChange('technicianId', e.target.value)}
                      placeholder="Enter ID or license number"
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

                  {/* Email Address */}
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

                  {/* Street Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Street Name
                    </label>
                    <input
                      type="text"
                      value={formData.streetName}
                      onChange={(e) => handleInputChange('streetName', e.target.value)}
                      placeholder="Enter street name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Building Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Building Number
                    </label>
                    <input
                      type="text"
                      value={formData.buildingNumber}
                      onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                      placeholder="Enter building number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* City */}
                  <div>
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

                {/* Continue Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                      isFormValid()
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

          {/* Step 2: Repair Skills */}
          {currentStep === 2 && (
            <>
              {/* Section Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Repair Skills
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Configure your services and payment details
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 2 of 3
                  </span>
                </div>
              </div>

              {/* Skills Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {/* Appliance Expertise Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Appliance Expertise
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Appliances you service (multi-select)
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {applianceOptions.map((appliance) => {
                      const isSelected = skillsData.applianceExpertise.includes(appliance);
                      return (
                        <button
                          key={appliance}
                          onClick={() => toggleApplianceExpertise(appliance)}
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

                {/* Repair Capabilities Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Repair Capabilities
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Type of work you handle
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {repairCapabilityOptions.map((capability) => {
                      const isSelected = skillsData.repairCapabilities.includes(capability);
                      return (
                        <button
                          key={capability}
                          onClick={() => toggleRepairCapability(capability)}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-[#1E2F4F] bg-[#1E2F4F] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-[#1E2F4F] hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {isSelected && <Check className="w-4 h-4" />}
                            <span>{capability}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!isSkillsValid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                      isSkillsValid()
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

          {/* Step 3: Profile & Verification */}
          {currentStep === 3 && (
            <>
              {/* Section Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Profile & Verification
                  </h1>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload your photo and credentials
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 3 of 3
                  </span>
                </div>
              </div>

              {/* Upload Sections */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {/* Profile Photo Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Profile Photo <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload a clear photo of yourself
                  </p>

                  {verificationData.profilePhotoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={verificationData.profilePhotoPreview}
                        alt="Profile Preview"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={removeProfilePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="mt-4 text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {verificationData.profilePhoto?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors">
                      <label htmlFor="profilePhotoUpload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Browse Files
                          </p>
                          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            Supported formats: JPG, PNG (Max 5MB)
                          </p>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="profilePhotoUpload"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Supporting Documents Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Supporting Documents <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload identity verification documents (Government-issued ID, Technician License, Training Certificate)
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors mb-4">
                    <label htmlFor="supportingDocumentsUpload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Browse Files
                        </p>
                        <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          Upload Government ID, License, or Certificates
                        </p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="supportingDocumentsUpload"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      multiple
                      onChange={handleSupportingDocumentsUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Documents List */}
                  {verificationData.supportingDocuments.length > 0 && (
                    <div className="space-y-2">
                      {verificationData.supportingDocuments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                {file.name}
                              </p>
                              <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSupportingDocument(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteSetup}
                    disabled={!isVerificationValid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                      isVerificationValid()
                        ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}