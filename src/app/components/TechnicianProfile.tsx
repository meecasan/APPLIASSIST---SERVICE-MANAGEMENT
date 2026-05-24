import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Upload, Check } from 'lucide-react';
import { technicianAPI } from '../services/api';
import { toast } from 'sonner';

interface TechnicianProfileProps {
  user: {
    email: string;
    role: string | null;
  };
}

export function TechnicianProfile({ user }: TechnicianProfileProps) {
  // DB driven data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    first_name: '',
    last_name: '',
    technicianId: '',
    phoneNumber: '',
    email: user.email,
    service_area: '',
    specialization: '',
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await technicianAPI.getProfile();
        setPersonalInfo({
          fullName: `${data.first_name} ${data.last_name || ''}`.trim(),
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          technicianId: `TECH-${String(data.technician_id).padStart(6, '0')}`,
          phoneNumber: data.contact_number || '',
          email: data.email || user.email,
          service_area: data.service_area || '',
          specialization: data.specialization || '',
        });
        
        // Populate skills from specialization if possible (basic mapping for demo)
        if (data.specialization) {
          const specs = data.specialization.split(',').map((s: string) => s.trim());
          setSkills(prev => ({ ...prev, applianceExpertise: specs }));
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.email]);

  const [skills, setSkills] = useState({
    applianceExpertise: ['Refrigerator', 'Air Conditioner', 'Washing Machine', 'Television'],
    repairCapabilities: ['Diagnosis & Inspection', 'Repair & Parts Replacement', 'Installation & Uninstallation'],
  });

  const [verification, setVerification] = useState({
    profilePhotoUrl: 'https://ui-avatars.com/api/?name=John+Santos&size=200&background=1E2F4F&color=fff',
    supportingDocuments: [
      { name: 'Government ID - Front.jpg', status: 'Approved' },
      { name: 'Technician License.pdf', status: 'Approved' },
      { name: 'Training Certificate.pdf', status: 'Pending Review' },
    ],
  });

  const [editMode, setEditMode] = useState({
    personal: false,
    skills: false,
    verification: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
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

  const [tempPersonalInfo, setTempPersonalInfo] = useState(personalInfo);
  const [tempSkills, setTempSkills] = useState(skills);

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

  const handleEditPersonal = () => {
    setTempPersonalInfo(personalInfo);
    setEditMode({ ...editMode, personal: true });
  };

  const handleSavePersonal = async () => {
    try {
      const names = tempPersonalInfo.fullName.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      await technicianAPI.updateProfile({
        first_name: firstName,
        last_name: lastName,
        contact_number: tempPersonalInfo.phoneNumber,
        email: tempPersonalInfo.email,
        service_area: tempPersonalInfo.service_area,
        specialization: tempPersonalInfo.specialization
      });
      
      setPersonalInfo({
        ...tempPersonalInfo,
        first_name: firstName,
        last_name: lastName,
      });
      setEditMode({ ...editMode, personal: false });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelPersonal = () => {
    setTempPersonalInfo(personalInfo);
    setEditMode({ ...editMode, personal: false });
  };

  const handleEditSkills = () => {
    setTempSkills(skills);
    setEditMode({ ...editMode, skills: true });
  };

  const handleSaveSkills = () => {
    setSkills(tempSkills);
    setEditMode({ ...editMode, skills: false });
  };

  const handleCancelSkills = () => {
    setTempSkills(skills);
    setEditMode({ ...editMode, skills: false });
  };

  const toggleApplianceExpertise = (appliance: string) => {
    setTempSkills((prev) => ({
      ...prev,
      applianceExpertise: prev.applianceExpertise.includes(appliance)
        ? prev.applianceExpertise.filter((item) => item !== appliance)
        : [...prev.applianceExpertise, appliance],
    }));
  };

  const toggleRepairCapability = (capability: string) => {
    setTempSkills((prev) => ({
      ...prev,
      repairCapabilities: prev.repairCapabilities.includes(capability)
        ? prev.repairCapabilities.filter((item) => item !== capability)
        : [...prev.repairCapabilities, capability],
    }));
  };

  const handleSavePassword = () => {
    const errors: typeof passwordErrors = {};

    // Validate current password
    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // In a real app, this would call an API to update the password
    console.log('Password updated successfully');

    // Reset form and close modal
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
    setShowPasswordModal(false);
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
    setShowPasswordModal(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Technician Profile
        </h1>
        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          View and manage your personal details, skills, and verification
        </p>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 max-w-5xl">
        {/* Personal Information Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Personal Information
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Basic technician and contact details
              </p>
            </div>
            {!editMode.personal && (
              <button
                onClick={handleEditPersonal}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Information</span>
              </button>
            )}
          </div>

          <div className="p-6">
            {editMode.personal ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={tempPersonalInfo.fullName}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Technician ID / License No.
                    </label>
                    <input
                      type="text"
                      value={tempPersonalInfo.technicianId}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, technicianId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={tempPersonalInfo.phoneNumber}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={tempPersonalInfo.email}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Service Area
                    </label>
                    <input
                      type="text"
                      value={tempPersonalInfo.service_area}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, service_area: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      placeholder="e.g. Quezon City, Manila"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Primary Specialization
                    </label>
                    <input
                      type="text"
                      value={tempPersonalInfo.specialization}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, specialization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancelPersonal}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-white bg-[#1E2F4F] rounded-lg hover:bg-[#2a4066] transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Full Name
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Technician ID / License No.
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.technicianId}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Phone Number
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.phoneNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Email Address
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Service Area
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.service_area || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Primary Specialization
                  </p>
                  <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {personalInfo.specialization || '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Security Settings
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Manage your account password
              </p>
            </div>
            {!showPasswordModal && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <Edit2 className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          <div className="p-6">
            {showPasswordModal ? (
              <>
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                        setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
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
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                        setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                        setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancelPassword}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSavePassword}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-white bg-[#1E2F4F] rounded-lg hover:bg-[#2a4066] transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Password
                </p>
                <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ••••••••••••
                </p>
                <p className="text-sm text-[#6B7280] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Click "Change Password" to update your account password
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Skills & Service Type Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Skills & Service Type
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Services you offer and repair capabilities
              </p>
            </div>
            {!editMode.skills && (
              <button
                onClick={handleEditSkills}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Skills</span>
              </button>
            )}
          </div>

          <div className="p-6">
            {editMode.skills ? (
              <>
                {/* Appliance Expertise Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Appliance Expertise
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Appliances you service (multi-select)
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {applianceOptions.map((appliance) => {
                      const isSelected = tempSkills.applianceExpertise.includes(appliance);
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Repair Capabilities
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Type of work you handle
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {repairCapabilityOptions.map((capability) => {
                      const isSelected = tempSkills.repairCapabilities.includes(capability);
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

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancelSkills}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveSkills}
                    className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-white bg-[#1E2F4F] rounded-lg hover:bg-[#2a4066] transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Appliance Expertise Display */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Appliance Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.applianceExpertise.map((appliance) => (
                      <span
                        key={appliance}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {appliance}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Repair Capabilities Display */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Repair Capabilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.repairCapabilities.map((capability) => (
                      <span
                        key={capability}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile & Verification Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Profile & Verification
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Photo and credential verification
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Photo Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Profile Photo
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={verification.profilePhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-all"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Update Photo</span>
                </button>
              </div>
            </div>

            {/* Supporting Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Supporting Documents
                </h3>
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-all"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Update Documents</span>
                </button>
              </div>

              <div className="space-y-3">
                {verification.supportingDocuments.map((doc, index) => (
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
                          {doc.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(doc.status)}`}
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
