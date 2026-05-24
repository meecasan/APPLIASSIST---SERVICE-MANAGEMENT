import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Package, ClipboardList, Calendar } from 'lucide-react';
import type { User as UserType } from '../App';
import { TechnicianNavbar } from './TechnicianNavbar';
import { ServiceSchedule } from './ServiceSchedule';
import { ScheduleDetails } from './ScheduleDetails';
import { TechnicianProfile } from './TechnicianProfile';
import { TechnicianServiceRequestsTable } from './TechnicianServiceRequestsTable';
import { TechnicianRequestDetails } from './TechnicianRequestDetails';
import { ServicesOffered } from './ServicesOffered';
import { servicesAPI, getCurrentUser } from '../services/api';
import { serviceRequestsAPI } from '../services/api-extended';
import { onServiceNew, offServiceNew, onServiceUpdated, offServiceUpdated, onServiceAssigned, offServiceAssigned } from '../services/realtime';

interface TechnicianDashboardProps {
  user: UserType;
  onLogout: () => void;
  customerBookings?: any[];
}

interface ServiceRequest {
  id: number;
  created: string;
  createdTime: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Canceled' | 'No-show';
  name: string;
  appliance: string;
  applianceBrand: string;
  issue: string;
  contact: string;
  address: string;
  requestId: string;
  technicianNotes?: string;
}

interface ScheduleItem {
  id: string;
  jobOrderNo: string;
  created: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  services: string[];
  appliance: string;
  brandModel: string;
  problem: string;
  technicianNotes: string;
}

// Map backend service status to frontend status
const mapServiceStatus = (backendStatus: string): ServiceRequest['status'] => {
  const statusMap: Record<string, ServiceRequest['status']> = {
    'Pending': 'Pending',
    'Assigned': 'Confirmed',
    'In Progress': 'In Progress',
    'Completed': 'Completed',
    'Cancelled': 'Canceled',
    'No-show': 'No-show',
  };
  return statusMap[backendStatus] || 'Pending';
};

// Transform backend service request to frontend format
const transformServiceRequest = (service: any): ServiceRequest => {
  return {
    id: service.service_request_id || service.id,
    created: service.created_at ? new Date(service.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    createdTime: service.created_at ? new Date(service.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '12:00 PM',
    scheduledFor: service.appointment_date ? new Date(service.appointment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    scheduledTime: service.appointment_date ? new Date(service.appointment_date).toTimeString().slice(0, 5) : '12:00',
    status: mapServiceStatus(service.status || 'Pending'),
    name: service.customer_first_name 
      ? `${service.customer_first_name} ${service.customer_last_name || ''}`.trim()
      : 'Customer',
    appliance: service.appliance_type || 'Appliance',
    applianceBrand: service.appliance_brand || 'Not specified',
    issue: service.issue_description || 'No description provided',
    contact: service.contact_number || '',
    address: service.service_address || service.customer_address || '',
    requestId: `REQ-${String(service.service_request_id || service.id).padStart(6, '0')}`,
    technicianNotes: service.technician_notes || '',
  };
};

export function TechnicianDashboard({ user, onLogout, customerBookings = [] }: TechnicianDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'schedule' | 'services' | 'profile'>('dashboard');
  const [viewingRequestId, setViewingRequestId] = useState<number | null>(null);
  const [viewingScheduleId, setViewingScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Service Requests State
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  // Real-time stats from API data
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedToday: 0,
    upcomingSchedule: 0,
    totalEarnings: 0,
  });

  // Fetch service requests for the current technician from the API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        // Fetch service requests assigned to this technician
        const services = await serviceRequestsAPI.listServiceRequests({ technician_id: Number(user.user_id) });
        const transformedRequests = services.map(transformServiceRequest);
        setServiceRequests(transformedRequests);

        // Calculate real-time stats from API data
        const today = new Date().toDateString();
        const now = new Date();
        const thisWeekEnd = new Date();
        thisWeekEnd.setDate(now.getDate() + 7);

        const activeRequests = transformedRequests.filter(
          r => r.status === 'Pending' || r.status === 'Confirmed' || r.status === 'In Progress'
        ).length;

        const completedToday = transformedRequests.filter(
          r => r.status === 'Completed' && new Date(r.scheduledFor).toDateString() === today
        ).length;

        const upcomingSchedule = transformedRequests.filter(
          r => {
            const scheduledDate = new Date(r.scheduledFor);
            return scheduledDate >= now && scheduledDate <= thisWeekEnd && 
                   r.status !== 'Completed' && r.status !== 'Canceled';
          }
        ).length;

        // Calculate earnings (mock calculation - in real app, this would come from backend)
        const totalEarnings = transformedRequests
          .filter(r => r.status === 'Completed')
          .length * 350; // Average service fee

        setStats({
          activeRequests,
          completedToday,
          upcomingSchedule,
          totalEarnings,
        });
      } catch (err) {
        console.error('Failed to fetch service requests:', err);
        // Use mock data as fallback
        setServiceRequests(getMockServiceRequests());
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'requests' || activeTab === 'dashboard') {
      fetchServiceRequests();
    }
  }, [activeTab]);

  // Merge customer bookings into service requests (for backward compatibility)
  useEffect(() => {
    if (customerBookings && customerBookings.length > 0) {
      const newRequests: ServiceRequest[] = customerBookings
        .filter(booking => booking.technicianId === user.email || !booking.technicianId)
        .map((booking, index) => ({
          id: 1000 + index,
          created: booking.createdAt,
          createdTime: '12:00 PM',
          scheduledFor: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
          status: booking.status as ServiceRequest['status'],
          name: booking.contactName || booking.userEmail?.split('@')[0] || 'Customer',
          appliance: booking.applianceType,
          applianceBrand: 'Not specified',
          issue: booking.problemDescription,
          contact: booking.contactNumber,
          address: booking.address,
          requestId: booking.reference,
          technicianNotes: booking.additionalInstructions || '',
        }));

      // Merge with existing requests, avoiding duplicates
      setServiceRequests(prev => {
        const existingIds = new Set(prev.map(r => r.requestId));
        const uniqueNew = newRequests.filter(r => !existingIds.has(r.requestId));
        return [...prev, ...uniqueNew];
      });
    }
  }, [customerBookings, user.email]);

  // Subscribe to real-time service updates
  useEffect(() => {
    const handleServiceNew = (serviceRequest: any) => {
      const newRequest = transformServiceRequest(serviceRequest);
      setServiceRequests((prev) => [newRequest, ...prev]);
    };

    const handleServiceUpdate = (serviceRequest: any) => {
      setServiceRequests((prev) =>
        prev.map((req) => req.id === serviceRequest.service_request_id
          ? { ...req, status: serviceRequest.status || req.status }
          : req
        )
      );
    };

    const handleServiceAssigned = (serviceRequest: any) => {
      setServiceRequests((prev) =>
        prev.map((req) => req.id === serviceRequest.service_request_id 
          ? { ...req, status: 'Confirmed' } 
          : req)
      );
    };

    onServiceNew(handleServiceNew);
    onServiceUpdated(handleServiceUpdate);
    onServiceAssigned(handleServiceAssigned);

    return () => {
      offServiceNew(handleServiceNew);
      offServiceUpdated(handleServiceUpdate);
      offServiceAssigned(handleServiceAssigned);
    };
  }, []);

  // Mock data fallback
  const getMockServiceRequests = (): ServiceRequest[] => [
    {
      id: 1,
      created: 'May 10, 2026',
      createdTime: '09:30 AM',
      scheduledFor: '2026-05-15',
      scheduledTime: '10:00',
      status: 'Pending',
      name: 'John Doe',
      appliance: 'Refrigerator',
      applianceBrand: 'Samsung RT-38',
      issue: 'Not cooling properly, making unusual noise',
      contact: '+63 917 123 4567',
      address: '123 Main Street, Quezon City, Metro Manila',
      requestId: 'REQ-000001',
      technicianNotes: '',
    },
    {
      id: 2,
      created: 'May 11, 2026',
      createdTime: '02:15 PM',
      scheduledFor: '2026-05-16',
      scheduledTime: '14:00',
      status: 'Confirmed',
      name: 'Jane Smith',
      appliance: 'Washing Machine',
      applianceBrand: 'LG WM-500',
      issue: 'Not draining water after wash cycle',
      contact: '+63 917 234 5678',
      address: '456 Oak Avenue, Manila',
      requestId: 'REQ-000002',
      technicianNotes: 'Customer prefers afternoon appointments',
    },
    {
      id: 3,
      created: 'May 12, 2026',
      createdTime: '11:00 AM',
      scheduledFor: '2026-05-17',
      scheduledTime: '09:30',
      status: 'In Progress',
      name: 'Bob Johnson',
      appliance: 'Air Conditioner',
      applianceBrand: 'Carrier Split Type 2HP',
      issue: 'Leaking water, not cooling efficiently',
      contact: '+63 917 345 6789',
      address: '789 Pine Road, Makati City',
      requestId: 'REQ-000003',
      technicianNotes: 'Parts ordered: drainage pipe',
    },
  ];

  // Derive recent requests from real API data (show first 3)
  const recentRequests = serviceRequests.slice(0, 3).map(req => ({
    id: req.id,
    customer: req.name,
    appliance: req.appliance,
    serviceId: req.requestId,
    priority: req.status === 'In Progress' ? 'High' : req.status === 'Pending' ? 'Medium' : 'Low',
    status: req.status,
  }));

  // Derive today's schedule from real API data
  const todaySchedule = serviceRequests
    .filter(req => {
      const scheduledDate = new Date(req.scheduledFor).toDateString();
      const today = new Date().toDateString();
      return scheduledDate === today && req.status !== 'Completed' && req.status !== 'Canceled';
    })
    .slice(0, 3)
    .map((req, index) => ({
      id: index + 1,
      time: req.scheduledTime,
      service: `${req.appliance} Repair`,
      customer: req.name,
      address: req.address,
    }));

  // Helper function to convert service request to schedule item
  const convertToScheduleItem = (req: ServiceRequest): ScheduleItem => ({
    id: String(req.id),
    jobOrderNo: req.requestId,
    created: req.created,
    scheduledFor: req.scheduledFor,
    scheduledTime: req.scheduledTime,
    status: req.status === 'Confirmed' ? 'confirmed' : 
            req.status === 'Pending' ? 'pending' :
            req.status === 'In Progress' ? 'in-progress' :
            req.status === 'Completed' ? 'completed' :
            req.status === 'Canceled' ? 'canceled' : 'pending',
    clientName: req.name,
    clientPhone: req.contact,
    clientAddress: req.address,
    services: [req.appliance],
    appliance: req.appliance,
    brandModel: req.applianceBrand,
    problem: req.issue,
    technicianNotes: req.technicianNotes || '',
  });

  // Schedule State - use state for mutable schedule items
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  // Sync schedule items with service requests
  useEffect(() => {
    setScheduleItems(serviceRequests.map(convertToScheduleItem));
  }, [serviceRequests]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Service Requests Handlers
  const handleViewDetails = (requestId: number) => {
    setViewingRequestId(requestId);
  };

  const handleBackToTable = () => {
    setViewingRequestId(null);
  };

  const handleStatusUpdate = async (requestId: number, newStatus: ServiceRequest['status']) => {
    // Map frontend status to backend status
    const statusMap: Record<ServiceRequest['status'], string> = {
      'Pending': 'Pending',
      'Confirmed': 'Assigned',
      'In Progress': 'In Progress',
      'Completed': 'Completed',
      'Canceled': 'Cancelled',
      'No-show': 'No-show',
    };

    try {
      await servicesAPI.updateServiceStatus(String(requestId), statusMap[newStatus]);
      
      // Update local state after successful API call
      setServiceRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      // Recalculate stats
      const today = new Date().toDateString();
      const updatedRequests = serviceRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      );
      
      setStats({
        activeRequests: updatedRequests.filter(r => r.status === 'Pending' || r.status === 'Confirmed' || r.status === 'In Progress').length,
        completedToday: updatedRequests.filter(r => r.status === 'Completed' && new Date(r.scheduledFor).toDateString() === today).length,
        upcomingSchedule: updatedRequests.filter(r => {
          const scheduledDate = new Date(r.scheduledFor);
          const now = new Date();
          const weekEnd = new Date();
          weekEnd.setDate(now.getDate() + 7);
          return scheduledDate >= now && scheduledDate <= weekEnd && r.status !== 'Completed' && r.status !== 'Canceled';
        }).length,
        totalEarnings: updatedRequests.filter(r => r.status === 'Completed').length * 350,
      });
    } catch (err) {
      console.error('Failed to update service status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleScheduleUpdate = async (requestId: number, date: string, time: string) => {
    // Note: The backend doesn't have a specific endpoint for updating schedule only
    // In a real implementation, you would add this to the API
    // For now, update local state
    setServiceRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, scheduledFor: date, scheduledTime: time } : req
      )
    );
  };

  const handleRequestAccepted = async (requestId: number) => {
    try {
      // Update status to Confirmed via API
      await servicesAPI.updateServiceStatus(String(requestId), 'Assigned');
      
      // Remove accepted request from Service Requests list
      setServiceRequests(prevRequests =>
        prevRequests.filter(req => req.id !== requestId)
      );

      // Recalculate stats
      const today = new Date().toDateString();
      const updatedRequests = serviceRequests.filter(req => req.id !== requestId);
      
      setStats({
        activeRequests: updatedRequests.filter(r => r.status === 'Pending' || r.status === 'Confirmed' || r.status === 'In Progress').length,
        completedToday: updatedRequests.filter(r => r.status === 'Completed' && new Date(r.scheduledFor).toDateString() === today).length,
        upcomingSchedule: updatedRequests.filter(r => {
          const scheduledDate = new Date(r.scheduledFor);
          const now = new Date();
          const weekEnd = new Date();
          weekEnd.setDate(now.getDate() + 7);
          return scheduledDate >= now && scheduledDate <= weekEnd && r.status !== 'Completed' && r.status !== 'Canceled';
        }).length,
        totalEarnings: updatedRequests.filter(r => r.status === 'Completed').length * 350,
      });
    } catch (err) {
      console.error('Failed to accept service request:', err);
      alert('Failed to accept request. Please try again.');
    }
  };

  // Schedule Handlers
  const handleViewScheduleDetails = (scheduleId: string) => {
    setViewingScheduleId(scheduleId);
  };

  const handleBackToSchedule = () => {
    setViewingScheduleId(null);
  };

  const handleScheduleStatusUpdate = (scheduleId: string, newStatus: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'canceled' | 'no-show') => {
    setScheduleItems(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, status: newStatus } : schedule
      )
    );
  };

  const handleReschedule = (scheduleId: string, date: string, time: string) => {
    setScheduleItems(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, scheduledFor: date, scheduledTime: time } : schedule
      )
    );
  };

  const handleCancelAppointment = (scheduleId: string, reason?: string) => {
    setScheduleItems(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, status: 'canceled', technicianNotes: reason || schedule.technicianNotes } : schedule
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar Navbar */}
      <TechnicianNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={user.email}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="px-8 py-6">
          {activeTab === 'dashboard' && (
            <div>
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Dashboard
                </h1>
                <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Welcome back! Here's your overview for today
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Active Requests
                    </h3>
                    <ClipboardList className="w-5 h-5 text-[#1E2F4F]" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.activeRequests}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Pending services
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Completed Today
                    </h3>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.completedToday}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Great work!
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Upcoming Schedule
                    </h3>
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.upcomingSchedule}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    This week
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Total Earnings
                    </h3>
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₱{stats.totalEarnings}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    This month
                  </p>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Service Requests - Left Column */}
                  <div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Recent Service Requests
                        </h2>
                        <button
                          onClick={() => setActiveTab('requests')}
                          className="text-sm font-medium text-[#1E2F4F] hover:underline transition-all"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          View All
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        {recentRequests.map((request) => (
                          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {request.customer}
                                </p>
                                <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                  {request.appliance} • {request.serviceId}
                                </p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                {request.priority}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                                {request.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule - Right Column */}
                  <div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Today's Schedule
                        </h2>
                        <button
                          onClick={() => setActiveTab('schedule')}
                          className="text-sm font-medium text-[#1E2F4F] hover:underline transition-all"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          View All
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        {todaySchedule.map((item) => (
                          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                              {/* Time - Left Side */}
                              <div className="flex-shrink-0">
                                <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {item.time}
                                </p>
                              </div>

                              {/* Vertical Divider */}
                              <div className="w-px bg-gray-300 self-stretch" />

                              {/* Details - Right Side */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {item.service}
                                </h3>
                                <p className="text-sm text-gray-700 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                  {item.customer}
                                </p>
                                <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                  {item.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              {viewingRequestId === null ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Service Requests
                    </h1>
                    <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Manage all service requests and assignments
                    </p>
                  </div>

                  <TechnicianServiceRequestsTable
                    requests={serviceRequests}
                    onViewDetails={handleViewDetails}
                  />
                </>
              ) : (
                <TechnicianRequestDetails
                  request={serviceRequests.find(req => req.id === viewingRequestId)!}
                  onBack={handleBackToTable}
                  onStatusUpdate={handleStatusUpdate}
                  onScheduleUpdate={handleScheduleUpdate}
                  onRequestAccepted={handleRequestAccepted}
                />
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              {viewingScheduleId === null ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Schedule
                    </h1>
                    <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      View and manage your appointments
                    </p>
                  </div>

                  <ServiceSchedule
                    schedules={scheduleItems}
                    onViewDetails={handleViewScheduleDetails}
                  />
                </>
              ) : (
                <ScheduleDetails
                  schedule={scheduleItems.find(schedule => schedule.id === viewingScheduleId)!}
                  onBack={handleBackToSchedule}
                  onStatusUpdate={handleScheduleStatusUpdate}
                  onReschedule={handleReschedule}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <ServicesOffered />
          )}

          {activeTab === 'profile' && (
            <TechnicianProfile user={user} />
          )}
        </main>
      </div>
    </div>
  );
}