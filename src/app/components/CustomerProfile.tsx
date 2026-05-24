import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Lock, Save } from 'lucide-react';

interface CustomerProfileData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CustomerProfileProps {
  userEmail: string;
  profileData?: CustomerProfileData;
  onSaveProfile: (data: CustomerProfileData) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

export function CustomerProfile({
  userEmail,
  profileData,
  onSaveProfile,
  onChangePassword,
}: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const [formData, setFormData] = useState<CustomerProfileData>(
    profileData || {
      email: userEmail,
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
    }
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSaveProfile = () => {
    onSaveProfile(formData);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleChangePassword = () => {
    const errors: typeof passwordErrors = {};

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      onChangePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Profile
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Manage your account information and security settings
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Save className="w-4 h-4 text-white" />
            </div>
            <p className="text-green-800 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Changes saved successfully!
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#1E2F4F] text-[#1E2F4F]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'security'
                ? 'border-[#1E2F4F] text-[#1E2F4F]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Security Settings
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <>
            {!profileData && formData.fullName === '' ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Profile not available
                </h3>
                <p className="text-gray-600 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Complete your profile to get started.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+63 XXX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
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
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="Enter zip code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold flex items-center space-x-2"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Change Password
            </h2>

            <div className="space-y-4 max-w-md">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleChangePassword}
                className="px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Update Password
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
