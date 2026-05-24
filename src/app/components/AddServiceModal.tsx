import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceData) => void;
  editingService?: ServiceData | null;
}

export interface ServiceData {
  id?: string;
  serviceName: string;
  category: string;
  description: string;
  startingPrice: string;
  duration: string;
  serviceType: string;
  isAvailable: boolean;
  isActive: boolean;
}

const applianceCategories = [
  'Air Conditioner',
  'Refrigerator',
  'Washing Machine',
  'Microwave',
  'Television',
  'Electric Fan',
  'Oven',
  'Dishwasher',
  'Water Heater',
  'Vacuum Cleaner',
  'Coffee Maker',
  'Rice Cooker',
];

const serviceTypes = [
  'Installation',
  'Repair',
  'Maintenance',
  'Diagnostics',
];

export function AddServiceModal({ isOpen, onClose, onSave, editingService }: AddServiceModalProps) {
  const [formData, setFormData] = useState<ServiceData>({
    serviceName: '',
    category: '',
    description: '',
    startingPrice: '',
    duration: '',
    serviceType: '',
    isAvailable: true,
    isActive: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    } else {
      setFormData({
        serviceName: '',
        category: '',
        description: '',
        startingPrice: '',
        duration: '',
        serviceType: '',
        isAvailable: true,
        isActive: true,
      });
    }
    setErrors({});
  }, [editingService, isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll when modal is open
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

  const handleClose = () => {
    setFormData({
      serviceName: '',
      category: '',
      description: '',
      startingPrice: '',
      duration: '',
      serviceType: '',
      isAvailable: true,
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = 'Valid starting price is required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 bg-[#0000004d]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {editingService
                  ? 'Update service information displayed on your public profile'
                  : 'Add a service to your public technician profile and marketplace listing'}
              </p>
            </div>
            <button
              onClick={handleClose}
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
            {/* Service Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="e.g., Air Conditioner Cleaning"
                className={`w-full px-4 py-2.5 border ${errors.serviceName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              />
              {errors.serviceName && (
                <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {errors.serviceName}
                </p>
              )}
            </div>

            {/* Appliance Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Appliance Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-2.5 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <option value="">Select category</option>
                {applianceCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Service Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this service includes..."
                rows={4}
                className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Starting Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Starting Price (₱) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-semibold text-lg">₱</span>
                  </div>
                  <input
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    placeholder="0"
                    className={`w-full pl-8 pr-4 py-2.5 border ${errors.startingPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>
                {errors.startingPrice && (
                  <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {errors.startingPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Estimated Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 1-2 hrs"
                  className={`w-full px-4 py-2.5 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {errors.duration}
                  </p>
                )}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className={`w-full px-4 py-2.5 border ${errors.serviceType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <option value="">Select service type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="text-sm text-red-500 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {errors.serviceType}
                </p>
              )}
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Availability
                  </label>
                  <p className="text-xs text-[#6B7280] mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Accept bookings for this service
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.isAvailable ? 'bg-[#1E2F4F]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Active Status
                  </label>
                  <p className="text-xs text-[#6B7280] mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Show this service on your public profile
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.isActive ? 'bg-[#1E2F4F]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 rounded-b-2xl flex items-center justify-end space-x-4">
          <button
            onClick={handleClose}
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
            {editingService ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </div>
    </div>
  );
}
