import React, { useState, useRef } from 'react';
import { Check, Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoBrandingSetupProps {
  onBack: () => void;
  onComplete: (data: LogoBrandingData) => void;
  isSubmitting?: boolean;
}

export interface LogoBrandingData {
  logo: string | null; // Base64 encoded image or null
  logoFileName: string | null;
}

export function LogoBrandingSetup({ onBack, onComplete, isSubmitting = false }: LogoBrandingSetupProps) {
  const [logoData, setLogoData] = useState<LogoBrandingData>({
    logo: null,
    logoFileName: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      completed: true, 
      current: false 
    },
    { 
      id: 3, 
      name: 'Logo & Branding', 
      subtext: 'Upload company logo',
      completed: false, 
      current: true 
    },
  ];

  const currentStepIndex = steps.findIndex(step => step.current);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG or PNG file';
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoData({
        logo: result,
        logoFileName: file.name,
      });
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    handleFileRead(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoData({
      logo: null,
      logoFileName: null,
    });
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCompleteSetup = () => {
    onComplete(logoData);
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
                    Logo & Branding
                  </h2>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Upload your company logo to personalize your account
                  </p>
                </div>
                {/* Step Badge */}
                <div className="bg-[#1E2F4F] text-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step 3 of 3
                  </span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-10 py-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Company Logo
                </h3>
                
                {/* Upload Card */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                    isDragging
                      ? 'border-[#1E2F4F] bg-[#1E2F4F]/5'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {logoData.logo ? (
                    /* Preview State */
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className="w-48 h-48 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                          <img
                            src={logoData.logo}
                            alt="Company logo preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          aria-label="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-700 font-medium mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {logoData.logoFileName}
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="text-sm text-[#1E2F4F] font-semibold hover:underline"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        Replace Logo
                      </button>
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      
                      <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Upload Company Logo
                      </h4>
                      
                      <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Drag and drop your logo here, or click to browse
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors flex items-center gap-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <Upload className="w-4 h-4" />
                        Browse Files
                      </button>
                      
                      <p className="text-xs text-[#6B7280] mt-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Accepted formats: JPG, PNG (Max size: 5MB)
                      </p>
                    </div>
                  )}
                  
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
                
                {/* Error Message */}
                {uploadError && (
                  <p className="mt-3 text-sm text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {uploadError}
                  </p>
                )}
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
                onClick={handleCompleteSetup}
                disabled={isSubmitting}
                className={`px-10 py-3 bg-[#1E2F4F] text-white rounded-lg font-semibold transition-colors shadow-sm ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#2a4066]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
