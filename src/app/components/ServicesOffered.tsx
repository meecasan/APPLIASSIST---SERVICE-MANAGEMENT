import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, Star, Clock, Wrench } from 'lucide-react';
import { AddServiceModal, ServiceData } from './AddServiceModal';
import { technicianAPI } from '../services/api';
import { toast } from 'sonner';

export function ServicesOffered() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Services data from DB
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await technicianAPI.getMyServices();
      console.debug('[ServicesOffered] fetchServices -> fetched', data?.length || 0, 'items');
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (serviceData: ServiceData) => {
    try {
      console.debug('[ServicesOffered] handleSaveService -> payload:', serviceData);
      if (editingService) {
        // Update existing service
        const res = await technicianAPI.updateService(editingService.id!, serviceData);
        console.debug('[ServicesOffered] updateService -> response:', res);
        setServices(services.map((s) => (s.id === editingService.id ? { ...serviceData, id: editingService.id } : s)));
        toast.success('Service updated successfully');
      } else {
        // Add new service
        const res = await technicianAPI.createService(serviceData);
        console.debug('[ServicesOffered] createService -> response:', res);
        const newService = { ...serviceData, id: res.id };
        setServices([newService, ...services]);
        toast.success('Service added successfully');
      }
    } catch (err) {
      console.error('Failed to save service:', err);
      toast.error('Failed to save service');
    }
    setEditingService(null);
  };

  const handleEditService = (service: ServiceData) => {
    setEditingService(service);
    setIsAddModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await technicianAPI.deleteService(serviceId);
        setServices(services.filter((s) => s.id !== serviceId));
        toast.success('Service deleted');
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete service');
      }
    }
    setOpenMenuId(null);
  };

  const handleToggleAvailability = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      const updated = { ...service, isAvailable: !service.isAvailable };
      await technicianAPI.updateService(serviceId, updated);
      
      setServices(services.map((s) => (s.id === serviceId ? updated : s)));
      toast.success(updated.isAvailable ? 'Service marked as available' : 'Service marked as unavailable');
    } catch (err) {
      console.error('Toggle failed:', err);
      toast.error('Failed to update service');
    }
    setOpenMenuId(null);
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      const updated = { ...service, isActive: !service.isActive };
      await technicianAPI.updateService(serviceId, updated);
      
      setServices(services.map((s) => (s.id === serviceId ? updated : s)));
      toast.success(updated.isActive ? 'Service activated' : 'Service deactivated');
    } catch (err) {
      console.error('Toggle failed:', err);
      toast.error('Failed to update service');
    }
    setOpenMenuId(null);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Air Conditioner': '❄️',
      'Refrigerator': '🧊',
      'Washing Machine': '🧺',
      'Microwave': '📻',
      'Television': '📺',
      'Electric Fan': '💨',
      'Oven': '🔥',
      'Dishwasher': '🍽️',
      'Water Heater': '💧',
      'Vacuum Cleaner': '🧹',
      'Coffee Maker': '☕',
      'Rice Cooker': '🍚',
    };
    return iconMap[category] || '🔧';
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'Installation':
        return 'bg-blue-100 text-blue-800';
      case 'Repair':
        return 'bg-orange-100 text-orange-800';
      case 'Maintenance':
        return 'bg-green-100 text-green-800';
      case 'Diagnostics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Services Offered
          </h1>
          <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Manage the services displayed on your public technician profile and marketplace listing
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors shadow-sm"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1E2F4F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No services added yet
            </h3>
            <p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Add your first service to start appearing in the marketplace and attract customers
            </p>
            <button
              onClick={() => {
                setEditingService(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Service</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-2xl">
                      {getCategoryIcon(service.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {service.serviceName}
                      </h3>
                      <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        {service.category}
                      </p>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {openMenuId === service.id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => handleEditService(service)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit Service</span>
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(service.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            {service.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                          </button>
                          <button
                            onClick={() => handleToggleActive(service.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            {service.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => handleDeleteService(service.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Service</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#6B7280] mb-4 line-clamp-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.description}
                </p>

                {/* Service Type Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(
                      service.serviceType
                    )}`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.serviceType}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 bg-gray-50 space-y-3">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Starting Price
                  </span>
                  <span className="text-xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₱{parseFloat(service.startingPrice).toLocaleString()}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#6B7280]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Duration
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {service.duration}
                  </span>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                  <div
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-xs font-medium ${
                      service.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                  <div
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-xs font-medium ${
                      service.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Card Footer - Public Visibility Note */}
              {service.isActive && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs text-blue-800 flex items-center space-x-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <Star className="w-3 h-3 fill-current" />
                    <span>Visible on public profile</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        editingService={editingService}
      />
    </div>
  );
}
