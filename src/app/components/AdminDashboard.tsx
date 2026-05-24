import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, Clock, UserCheck, Wrench, Eye, Search, X, Download, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import type { User as UserType } from '../App';
import { AdminNavbar } from './AdminNavbar';
import { onOrderNew, offOrderNew, onServiceNew, offServiceNew, onUserApproved, offUserApproved, onUserRejected, offUserRejected } from '../services/realtime';

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
  pendingApplications: Array<{
    email: string;
    role: 'technician';
    profileCompleted: boolean;
  }>;
  onApproveApplication: (email: string) => void;
  onRejectApplication: (email: string) => void;
  initialTab?: 'dashboard' | 'applications';
  applicationData?: Record<string, any>;
}

export function AdminDashboard({
  user,
  onLogout,
  pendingApplications,
  onApproveApplication,
  onRejectApplication,
  initialTab = 'dashboard',
  applicationData = {},
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications'>(initialTab);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'technician'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [liveOrderCount, setLiveOrderCount] = useState(0);
  const [liveServiceCount, setLiveServiceCount] = useState(0);
  const itemsPerPage = 10;

  // Calculate stats
  const totalPending = pendingApplications.length;
  const technicianPending = pendingApplications.filter((app) => app.role === 'technician').length;

  // Filter and search applications
  const filteredApplications = pendingApplications.filter((app) => {
    const matchesFilter = filterType === 'all' || app.role === filterType;
    const matchesSearch = app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicationData[app.email]?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicationData[app.email]?.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicationData[app.email]?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const handleViewApplication = (app: any) => {
    setSelectedApplication({
      ...app,
      data: applicationData[app.email] || {},
    });
    setShowModal(true);
  };

  const handleApprove = (email: string) => {
    if (confirm(`Are you sure you want to approve the application for ${email}?`)) {
      onApproveApplication(email);
      setShowModal(false);
      setSelectedApplication(null);
    }
  };

  const handleReject = (email: string) => {
    if (confirm(`Are you sure you want to reject the application for ${email}?\n\nThis action cannot be undone.`)) {
      onRejectApplication(email);
      setShowModal(false);
      setSelectedApplication(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    // Listen for real-time events
    const handleOrderNew = () => {
      setLiveOrderCount(prev => prev + 1);
    };

    const handleServiceNew = () => {
      setLiveServiceCount(prev => prev + 1);
    };

    onOrderNew(handleOrderNew);
    onServiceNew(handleServiceNew);

    return () => {
      offOrderNew(handleOrderNew);
      offServiceNew(handleServiceNew);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar Navbar */}
      <AdminNavbar
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
                  Admin Dashboard
                </h1>
                <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Manage platform applications and monitor activity
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Total Orders
                    </h3>
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    0 {liveOrderCount > 0 && <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 'normal' }}>({liveOrderCount}+ new)</span>}
                  </p>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Platform orders
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Service Requests
                    </h3>
                    <Wrench className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    0 {liveServiceCount > 0 && <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 'normal' }}>({liveServiceCount}+ new)</span>}
                  </p>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Active requests
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Technician Applications
                    </h3>
                    <Wrench className="w-5 h-5 text-[#1E2F4F]" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {technicianPending}
                  </p>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Pending technicians
                  </p>
                </div>

              </div>

              {/* Quick Overview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Recent Pending Applications
                </h2>
                {totalPending === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      No pending applications at the moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingApplications.slice(0, 5).map((app) => (
                      <div
                        key={app.email}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Wrench className="w-5 h-5 text-[#1E2F4F]" />
                          <div>
                            <p className="font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {applicationData[app.email]?.fullName || applicationData[app.email]?.ownerName || app.email}
                            </p>
                            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              Technician Application
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="text-sm text-[#1E2F4F] font-semibold hover:underline"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Application Management
                </h1>
                <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Review and approve or reject pending applications
                </p>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                {/* Filter Tabs */}
                <div className="flex items-center space-x-4 mb-4 border-b border-gray-200">
                  <button
                    onClick={() => { setFilterType('all'); setCurrentPage(1); }}
                    className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
                      filterType === 'all'
                        ? 'border-[#1E2F4F] text-[#1E2F4F]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    All ({totalPending})
                  </button>
                  <button
                    onClick={() => { setFilterType('technician'); setCurrentPage(1); }}
                    className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
                      filterType === 'technician'
                        ? 'border-[#1E2F4F] text-[#1E2F4F]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Technicians ({technicianPending})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>
              </div>

              {/* Applications Table */}
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {searchTerm ? 'No Results Found' : 'All Caught Up!'}
                  </h3>
                  <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {searchTerm
                      ? 'No applications match your search criteria.'
                      : 'There are no pending applications to review at the moment.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Applicant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Account Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedApplications.map((app) => {
                          const appData = applicationData[app.email] || {};
                          return (
                            <tr key={app.email} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    app.role === 'technician' ? 'bg-blue-100' : 'bg-orange-100'
                                  }`}>
                                    {app.role === 'technician' ? (
                                      <Wrench className="w-5 h-5 text-[#1E2F4F]" />
                                    ) : (
                                      <Store className="w-5 h-5 text-[#FF6B35]" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                      {appData.fullName || appData.ownerName || 'Not provided'}
                                    </div>
                                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                      {app.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                  {app.role === 'technician' ? 'Technician' : 'Shop'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(appData.status || 'pending')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleViewApplication(app)}
                                    className="text-[#1E2F4F] hover:text-[#2a4066] transition-colors"
                                    title="View Application"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleApprove(app.email)}
                                    className="text-green-600 hover:text-green-700 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(app.email)}
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {selectedApplication.role === 'technician' ? 'Technician Application' : 'Business Application'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Full Name</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.fullName || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Email</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Phone Number</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.phoneNumber || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Technician ID</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.technicianId || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Professional Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Experience Level</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.yearsOfExperience ? `${selectedApplication.data.yearsOfExperience} years` : 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    {selectedApplication.data.specializations && selectedApplication.data.specializations.length > 0 && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.data.specializations.map((spec: string) => (
                            <span key={spec} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Service Types */}
                    {selectedApplication.data.serviceTypes && selectedApplication.data.serviceTypes.length > 0 && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Service Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.data.serviceTypes.map((service: string) => (
                            <span key={service} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location Details */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Location Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Address</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.address || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>City</p>
                          <p className="text-base text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {selectedApplication.data.city || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Documents */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Uploaded Documents
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              Government ID: {selectedApplication.data.governmentId ? 'Uploaded' : 'Not uploaded'}
                            </span>
                          </div>
                          {selectedApplication.data.governmentId && (
                            <button className="text-sm text-[#1E2F4F] hover:underline flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              Certificate: {selectedApplication.data.certificate ? 'Uploaded' : 'Not uploaded'}
                            </span>
                          </div>
                          {selectedApplication.data.certificate && (
                            <button className="text-sm text-[#1E2F4F] hover:underline flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
              <button
                onClick={() => handleReject(selectedApplication.email)}
                className="px-6 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedApplication.email)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
