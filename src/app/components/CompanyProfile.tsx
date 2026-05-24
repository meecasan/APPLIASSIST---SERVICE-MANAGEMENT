import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CompanyProfileProps {
  onBack: () => void;
  onServiceAvailabilityChange?: (hasServices: boolean) => void;
}

interface BusinessInfo {
  businessName: string;
  taxNumber: string;
  streetName: string;
  buildingNumber: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
  emailAddress: string;
}

interface ServicePayment {
  serviceAvailability: 'has-services' | 'no-services';
  gcashNumber: string;
}

export function CompanyProfile({ onBack, onServiceAvailabilityChange }: CompanyProfileProps) {
  // Initialize with empty values - data should come from props or API
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    taxNumber: '',
    streetName: '',
    buildingNumber: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    emailAddress: '',
  });

  const [servicePayment, setServicePayment] = useState<ServicePayment>({
    serviceAvailability: 'has-services',
    gcashNumber: '',
  });

  const [showBusinessInfoModal, setShowBusinessInfoModal] = useState(false);
  const [showServicePaymentModal, setShowServicePaymentModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit form states
  const [editBusinessInfo, setEditBusinessInfo] = useState<BusinessInfo>(businessInfo);
  const [editServicePayment, setEditServicePayment] = useState<ServicePayment>(servicePayment);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Form errors
  const [businessInfoErrors, setBusinessInfoErrors] = useState<Partial<Record<keyof BusinessInfo, string>>>({});
  const [servicePaymentErrors, setServicePaymentErrors] = useState<{ gcashNumber?: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const completeAddress = `${businessInfo.buildingNumber} ${businessInfo.streetName}, ${businessInfo.city}, ${businessInfo.zipCode}`;

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    const cleaned = phone.replace(/[\s\-]/g, '');
    if (!/^\d+$/.test(cleaned)) return 'Please enter numbers only';
    if (cleaned.startsWith('09')) {
      if (cleaned.length !== 11) return 'Please enter an 11-digit mobile number';
    } else if (cleaned.startsWith('9')) {
      if (cleaned.length !== 10) return 'Please enter a 10-digit mobile number';
    } else {
      return 'Mobile number must start with 09 or 9';
    }
    return undefined;
  };

  const validateGCashNumber = (number: string): string | undefined => {
    if (!number.trim()) return undefined; // Optional
    const cleaned = number.replace(/[\s\-]/g, '');
    if (!/^\d+$/.test(cleaned)) return 'Please enter numbers only';
    if (cleaned.startsWith('09')) {
      if (cleaned.length !== 11) return 'Please enter an 11-digit mobile number (09XXXXXXXXX)';
    } else if (cleaned.startsWith('9')) {
      if (cleaned.length !== 10) return 'Please enter a 10-digit mobile number (9XXXXXXXXX)';
    } else {
      return 'Mobile number must start with 09 or 9';
    }
    return undefined;
  };

  // Handle Business Info Edit
  const handleEditBusinessInfo = () => {
    setEditBusinessInfo(businessInfo);
    setBusinessInfoErrors({});
    setShowBusinessInfoModal(true);
  };

  const handleSaveBusinessInfo = () => {
    const errors: Partial<Record<keyof BusinessInfo, string>> = {};

    // Validate required fields
    if (!editBusinessInfo.businessName.trim()) errors.businessName = 'Business name is required';
    if (!editBusinessInfo.taxNumber.trim()) errors.taxNumber = 'Tax number is required';
    if (!editBusinessInfo.streetName.trim()) errors.streetName = 'Street name is required';
    if (!editBusinessInfo.buildingNumber.trim()) errors.buildingNumber = 'Building number is required';
    if (!editBusinessInfo.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!editBusinessInfo.city.trim()) errors.city = 'City is required';

    const phoneError = validatePhoneNumber(editBusinessInfo.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    const emailError = validateEmail(editBusinessInfo.emailAddress);
    if (emailError) errors.emailAddress = emailError;

    if (Object.keys(errors).length > 0) {
      setBusinessInfoErrors(errors);
      return;
    }

    setBusinessInfo(editBusinessInfo);
    setShowBusinessInfoModal(false);
  };

  const handleCancelBusinessInfo = () => {
    setShowBusinessInfoModal(false);
    setBusinessInfoErrors({});
  };

  // Handle Service & Payment Edit
  const handleEditServicePayment = () => {
    setEditServicePayment(servicePayment);
    setServicePaymentErrors({});
    setShowServicePaymentModal(true);
  };

  const handleSaveServicePayment = () => {
    const errors: { gcashNumber?: string } = {};

    if (editServicePayment.gcashNumber.trim()) {
      const gcashError = validateGCashNumber(editServicePayment.gcashNumber);
      if (gcashError) errors.gcashNumber = gcashError;
    }

    if (Object.keys(errors).length > 0) {
      setServicePaymentErrors(errors);
      return;
    }

    setServicePayment(editServicePayment);
    setShowServicePaymentModal(false);

    // Notify parent component of service availability change
    if (onServiceAvailabilityChange) {
      onServiceAvailabilityChange(editServicePayment.serviceAvailability === 'has-services');
    }
  };

  const handleCancelServicePayment = () => {
    setShowServicePaymentModal(false);
    setServicePaymentErrors({});
  };

  // Handle Password Change
  const handleEditPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    // Validate current password
    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // In a real application, this would call an API to update the password
    // For now, we'll just show a success message
    setPasswordSuccess(true);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    // Close modal after showing success for 2 seconds
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 2000);
  };

  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    setPasswordErrors({});
    setPasswordSuccess(false);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1E2F4F] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Company Profile
        </h1>
        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          View and manage your company information
        </p>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* Business Information Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Business Information
            </h2>
            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Company details and contact information
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Business Name
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.businessName}
                </p>
              </div>

              {/* Tax Number */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Tax Number
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.taxNumber}
                </p>
              </div>

              {/* Street Name */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Street Name
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.streetName}
                </p>
              </div>

              {/* Building Number */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Building Number
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.buildingNumber}
                </p>
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  ZIP Code
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.zipCode}
                </p>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  City
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.city}
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Phone Number
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.phoneNumber}
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Email Address
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {businessInfo.emailAddress}
                </p>
              </div>

              {/* Complete Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Complete Address
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {completeAddress}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleEditBusinessInfo}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Edit Information
              </button>
            </div>
          </div>
        </div>

        {/* Service & Payment Setup Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Service & Payment Setup
            </h2>
            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Service availability and payment configuration
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Service Availability */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Service Availability
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {servicePayment.serviceAvailability === 'has-services'
                    ? 'Has Services - We offer repair or maintenance services'
                    : 'No Services - We only sell products or parts'}
                </p>
              </div>

              {/* GCash Account Number */}
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  GCash Account Number
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {servicePayment.gcashNumber || 'Not configured'}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleEditServicePayment}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Edit Information
              </button>
            </div>
          </div>
        </div>

        {/* Account Security Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Account Security
            </h2>
            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Manage your password and security settings
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="mb-8">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Password
                </label>
                <p className="text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ••••••••
                </p>
                <p className="text-xs text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Last changed: Never
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleEditPassword}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information Edit Modal */}
      {showBusinessInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Edit Business Information
                </h3>
                <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Update your company details
                </p>
              </div>
              <button
                onClick={handleCancelBusinessInfo}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.businessName}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, businessName: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.businessName && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.businessName}
                    </p>
                  )}
                </div>

                {/* Tax Number */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Tax Number *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.taxNumber}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, taxNumber: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.taxNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.taxNumber && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.taxNumber}
                    </p>
                  )}
                </div>

                {/* Street Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Street Name *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.streetName}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, streetName: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.streetName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.streetName && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.streetName}
                    </p>
                  )}
                </div>

                {/* Building Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Building Number *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.buildingNumber}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, buildingNumber: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.buildingNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.buildingNumber && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.buildingNumber}
                    </p>
                  )}
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.zipCode}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, zipCode: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.zipCode && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.zipCode}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.city}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, city: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.city && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.city}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={editBusinessInfo.phoneNumber}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, phoneNumber: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editBusinessInfo.emailAddress}
                    onChange={(e) => setEditBusinessInfo({ ...editBusinessInfo, emailAddress: e.target.value })}
                    className={`w-full px-4 py-3 border ${businessInfoErrors.emailAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {businessInfoErrors.emailAddress && (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {businessInfoErrors.emailAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancelBusinessInfo}
                className="px-6 py-2.5 bg-white text-[#1E2F4F] border-2 border-[#1E2F4F] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBusinessInfo}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service & Payment Edit Modal */}
      {showServicePaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Edit Service & Payment Setup
                </h3>
                <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Update service availability and payment options
                </p>
              </div>
              <button
                onClick={handleCancelServicePayment}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              <div className="space-y-6">
                {/* Service Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Service Availability
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setEditServicePayment({ ...editServicePayment, serviceAvailability: 'has-services' })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        editServicePayment.serviceAvailability === 'has-services'
                          ? 'border-[#1E2F4F] bg-[#1E2F4F]/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            editServicePayment.serviceAvailability === 'has-services'
                              ? 'border-[#1E2F4F]'
                              : 'border-gray-300'
                          }`}>
                            {editServicePayment.serviceAvailability === 'has-services' && (
                              <div className="w-3 h-3 bg-[#1E2F4F] rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Has Services
                          </p>
                          <p className="text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            We offer repair or maintenance services
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditServicePayment({ ...editServicePayment, serviceAvailability: 'no-services' })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        editServicePayment.serviceAvailability === 'no-services'
                          ? 'border-[#1E2F4F] bg-[#1E2F4F]/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            editServicePayment.serviceAvailability === 'no-services'
                              ? 'border-[#1E2F4F]'
                              : 'border-gray-300'
                          }`}>
                            {editServicePayment.serviceAvailability === 'no-services' && (
                              <div className="w-3 h-3 bg-[#1E2F4F] rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            No Services
                          </p>
                          <p className="text-sm text-[#6B7280] mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            We only sell products or parts
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* GCash Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    GCash Account Number
                  </label>
                  <input
                    type="text"
                    value={editServicePayment.gcashNumber}
                    onChange={(e) => setEditServicePayment({ ...editServicePayment, gcashNumber: e.target.value })}
                    placeholder="Enter GCash mobile number"
                    className={`w-full px-4 py-3 border ${servicePaymentErrors.gcashNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  />
                  {servicePaymentErrors.gcashNumber ? (
                    <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {servicePaymentErrors.gcashNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Enter your registered GCash mobile number for transactions
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancelServicePayment}
                className="px-6 py-2.5 bg-white text-[#1E2F4F] border-2 border-[#1E2F4F] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveServicePayment}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Change Password
                </h3>
                <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Update your account password
                </p>
              </div>
              <button
                onClick={handleCancelPassword}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              {passwordSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-green-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Password Changed Successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Your password has been updated.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className={`w-full px-4 py-3 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className={`w-full px-4 py-3 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    />
                    {passwordErrors.newPassword ? (
                      <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {passwordErrors.newPassword}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className={`w-full px-4 py-3 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent`}
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!passwordSuccess && (
              <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCancelPassword}
                  className="px-6 py-2.5 bg-white text-[#1E2F4F] border-2 border-[#1E2F4F] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
