import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, Eye, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Phone, Search } from 'lucide-react';
import { servicesAPI } from '../services/api';

interface ServiceScheduleProps {
  schedules?: ServiceItem[];
  onNavigate?: (view: 'list' | 'calendar') => void;
  onViewDetails?: (scheduleId: string) => void;
}

interface ServiceItem {
  id: string;
  jobOrderNo: string;
  created: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'new' | 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  services: string[];
  appliance: string;
  brandModel: string;
  problem: string;
}

export function ServiceSchedule({ schedules: externalSchedules, onNavigate, onViewDetails }: ServiceScheduleProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'timeline' | 'day' | 'week' | 'month' | 'weekly-overview'>('week');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduledForFilter, setScheduledForFilter] = useState('all-time');
  const [createdFilter, setCreatedFilter] = useState('all-time');
  const [sortColumn, setSortColumn] = useState<'created' | 'scheduledFor' | 'status' | 'client' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [scheduledForOpen, setScheduledForOpen] = useState(false);
  const [createdOpen, setCreatedOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentMonthStart, setCurrentMonthStart] = useState(new Date(2026, 0, 1));
  const [loading, setLoading] = useState(false);

  // Services from external props or API
  const [services, setServices] = useState<ServiceItem[]>(externalSchedules || []);

  const statusOptions = [
    { value: 'new', label: 'New', bg: '#E3F2FD', text: '#1976D2', hoverBg: '#BBDEFB', selectedText: '#0D47A1' },
    { value: 'confirmed', label: 'Confirmed', bg: '#E8F5E9', text: '#388E3C', hoverBg: '#C8E6C9', selectedText: '#1B5E20' },
    { value: 'pending', label: 'Pending', bg: '#FFF9C4', text: '#F57C00', hoverBg: '#FFF59D', selectedText: '#E65100' },
    { value: 'in-progress', label: 'In Progress', bg: '#F3E5F5', text: '#7B1FA2', hoverBg: '#E1BEE7', selectedText: '#4A148C' },
    { value: 'completed', label: 'Completed', bg: '#F5F5F5', text: '#424242', hoverBg: '#E0E0E0', selectedText: '#212121' },
    { value: 'canceled', label: 'Canceled', bg: '#FFEBEE', text: '#D32F2F', hoverBg: '#FFCDD2', selectedText: '#B71C1C' },
    { value: 'no-show', label: 'No-show', bg: '#FFF3E0', text: '#F57C00', hoverBg: '#FFE0B2', selectedText: '#E65100' },
  ];

  const dateFilterOptions = [
    { value: 'all-time', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This week' },
    { value: 'last-week', label: 'Last week' },
    { value: 'next-week', label: 'Next week' },
    { value: 'this-month', label: 'This month' },
    { value: 'last-month', label: 'Last month' },
    { value: 'next-month', label: 'Next month' },
    { value: 'custom', label: 'Custom range' },
  ];

  const calendarViewOptions = [
    { value: 'timeline', label: 'Timeline' },
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'weekly-overview', label: 'Weekly overview' },
  ];

  // Sync external schedules with internal state or load from API
  useEffect(() => {
    if (externalSchedules) {
      setServices(externalSchedules);
      return;
    }

    // Load from API if no external schedules provided
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await servicesAPI.getAllServices();
        // Transform API response to ServiceItem format
        const transformedData = (data || []).map((service: any) => ({
          id: service.service_request_id?.toString() || service.id?.toString(),
          jobOrderNo: `JO-${service.service_request_id || Math.random()}`,
          created: service.created_at || new Date().toISOString().split('T')[0],
          scheduledFor: service.appointment_date || new Date().toISOString().split('T')[0],
          scheduledTime: service.appointment_time || '09:00',
          status: (service.status || 'new') as any,
          clientName: service.customer_name || 'Unknown Customer',
          clientPhone: service.customer_phone || '',
          clientAddress: service.service_address || '',
          services: [service.service_type || 'General Service'],
          appliance: service.appliance_type || 'Unknown',
          brandModel: service.appliance_model || 'Unknown',
          problem: service.issue_description || 'No details provided',
        }));
        setServices(transformedData);
      } catch (err) {
        console.error('Failed to load services:', err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [externalSchedules]);

  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'new': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'New' },
      'confirmed': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Confirmed' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'canceled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' },
      'no-show': { bg: 'bg-gray-700', text: 'text-white', label: 'No-show' },
    };

    return statusConfig[status] || statusConfig['new'];
  };

  const handleSort = (column: 'created' | 'scheduledFor' | 'status' | 'client') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (serviceId: string, newStatus: string) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, status: newStatus as any } : s));
  };

  const toggleStatusFilter = (value: string) => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const handleSelectAllStatuses = () => {
    setSelectedStatuses(statusOptions.map(s => s.value));
  };

  const handleClearStatuses = () => {
    setSelectedStatuses([]);
  };

  const handleViewDetails = (service: ServiceItem) => {
    if (onViewDetails) {
      onViewDetails(service.id);
    }
  };


  // Filter services
  let filteredServices = services.filter(service => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(service.status)) {
      return false;
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return service.clientName.toLowerCase().includes(lowerCaseQuery);
    }
    return true;
  });

  // Sort services - default to nearest upcoming first
  if (sortColumn) {
    filteredServices = [...filteredServices].sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortColumn === 'created') {
        aVal = new Date(a.created).getTime();
        bVal = new Date(b.created).getTime();
      } else if (sortColumn === 'scheduledFor') {
        aVal = new Date(`${a.scheduledFor}T${a.scheduledTime}`).getTime();
        bVal = new Date(`${b.scheduledFor}T${b.scheduledTime}`).getTime();
      } else if (sortColumn === 'status') {
        aVal = a.status;
        bVal = b.status;
      } else if (sortColumn === 'client') {
        aVal = a.clientName;
        bVal = b.clientName;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  } else {
    // Default sort: nearest upcoming first (by scheduled date/time)
    filteredServices = [...filteredServices].sort((a, b) => {
      const dateTimeA = new Date(`${a.scheduledFor}T${a.scheduledTime}`).getTime();
      const dateTimeB = new Date(`${b.scheduledFor}T${b.scheduledTime}`).getTime();
      return dateTimeA - dateTimeB;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calendar View Functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthStartDay = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getServicesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredServices.filter(service => service.scheduledFor === dateStr);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentMonthStart);
    newStart.setMonth(newStart.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonthStart(newStart);
  };

  const getDateRangeText = () => {
    if (calendarView === 'week' || calendarView === 'weekly-overview') {
      const weekDays = getWeekDays(currentWeekStart);
      const startDate = weekDays[0];
      const endDate = weekDays[6];
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
      const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
      const year = startDate.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startDate.getDate()} – ${endDate.getDate()}, ${year}`;
      } else {
        return `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}, ${year}`;
      }
    } else if (calendarView === 'month') {
      return currentMonthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (calendarView === 'day') {
      return currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return '';
  };

  return (
    <div>
      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-[#1E2F4F] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#1E2F4F] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Calendar View</span>
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-[#FAFAFA] rounded-xl border border-gray-200 shadow-sm">
          {/* Search and Filters Row */}
          <div className="px-6 py-4 flex items-center justify-between space-x-4">
            {/* Search Bar - Left Side */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
              </div>
            </div>

            {/* Filters - Right Side */}
            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {statusFilterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                      <button
                        onClick={handleSelectAllStatuses}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        Select all
                      </button>
                      <button
                        onClick={handleClearStatuses}
                        className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {statusOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(option.value)}
                            onChange={() => toggleStatusFilter(option.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Scheduled For Filter */}
              <div className="relative">
                <button
                  onClick={() => setScheduledForOpen(!scheduledForOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span className="text-sm font-medium text-gray-700">Scheduled For</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {scheduledForOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      {dateFilterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setScheduledForFilter(option.value);
                            setScheduledForOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${
                            scheduledForFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Created Filter */}
              <div className="relative">
                <button
                  onClick={() => setCreatedOpen(!createdOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span className="text-sm font-medium text-gray-700">Created</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {createdOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      {dateFilterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setCreatedFilter(option.value);
                            setCreatedOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${
                            createdFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('created')}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Created</span>
                      {sortColumn === 'created' ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('scheduledFor')}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Scheduled For</span>
                      {sortColumn === 'scheduledFor' ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Status</span>
                      {sortColumn === 'status' ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('client')}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Client</span>
                      {sortColumn === 'client' ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedServices.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Show
              </label>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Showing {startIndex + 1}–{Math.min(endIndex, filteredServices.length)} of {filteredServices.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#1E2F4F] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {/* Navigation */}
            <button
              onClick={() => {
                if (calendarView === 'month') {
                  navigateMonth('prev');
                } else {
                  navigateWeek('prev');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Center: Date Range */}
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {getDateRangeText()}
            </h2>

            {/* Navigation Right */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (calendarView === 'month') {
                    navigateMonth('next');
                  } else {
                    navigateWeek('next');
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Calendar View Dropdown */}
              <div className="relative">
                <select
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {calendarViewOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar Grid - Week View */}
          {(calendarView === 'week' || calendarView === 'weekly-overview') && (
            <div className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="text-center pb-3 border-b border-gray-200">
                    <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {day}
                    </div>
                  </div>
                ))}

                {/* Day Cells */}
                {getWeekDays(currentWeekStart).map((date, idx) => {
                  const dayServices = getServicesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={idx} className="min-h-[200px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className={`text-sm font-semibold mb-3 ${isToday ? 'text-[#1E2F4F]' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-2">
                        {dayServices.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleViewDetails(service)}
                            className={`p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${
                              service.status === 'new' ? 'bg-blue-100 border border-blue-200' :
                              service.status === 'confirmed' ? 'bg-green-100 border border-green-200' :
                              service.status === 'pending' ? 'bg-yellow-100 border border-yellow-200' :
                              service.status === 'in-progress' ? 'bg-purple-100 border border-purple-200' :
                              service.status === 'completed' ? 'bg-gray-100 border border-gray-200' :
                              service.status === 'canceled' ? 'bg-red-100 border border-red-200' :
                              'bg-orange-100 border border-orange-200'
                            }`}
                          >
                            <div className="text-xs font-semibold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                              {formatTime(service.scheduledTime)}
                            </div>
                            <div className="text-xs text-gray-900 truncate" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {service.clientName}
                            </div>
                            <div className="text-xs text-gray-600 truncate mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {service.services[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Grid - Month View */}
          {calendarView === 'month' && (
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="text-center pb-2">
                    <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {day}
                    </div>
                  </div>
                ))}

                {/* Empty cells for days before month start */}
                {Array.from({ length: getMonthStartDay(currentMonthStart) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[100px] p-2 bg-gray-50 rounded-lg" />
                ))}

                {/* Day Cells */}
                {Array.from({ length: getDaysInMonth(currentMonthStart) }).map((_, idx) => {
                  const date = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth(), idx + 1);
                  const dayServices = getServicesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={idx} className="min-h-[100px] p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#1E2F4F]' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        {dayServices.slice(0, 3).map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleViewDetails(service)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                              service.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              service.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              service.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                              service.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              service.status === 'canceled' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {formatTime(service.scheduledTime)}
                          </div>
                        ))}
                        {dayServices.length > 3 && (
                          <div className="text-xs text-gray-500 px-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            +{dayServices.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {calendarView === 'day' && (
            <div className="p-6">
              <div className="space-y-3">
                {getServicesForDate(currentWeekStart).length > 0 ? (
                  getServicesForDate(currentWeekStart).map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleViewDetails(service)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-semibold text-[#1E2F4F]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                              {formatTime(service.scheduledTime)}
                            </span>
                            {getStatusBadge(service.status)}
                          </div>
                          <div className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {service.clientName}
                          </div>
                          <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {service.services.join(', ')}
                          </div>
                          <div className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {service.appliance} - {service.brandModel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      No services scheduled for this day
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline View */}
          {calendarView === 'timeline' && (
            <div className="p-6">
              <div className="space-y-4">
                {filteredServices
                  .sort((a, b) => {
                    const dateA = new Date(`${a.scheduledFor}T${a.scheduledTime}`);
                    const dateB = new Date(`${b.scheduledFor}T${b.scheduledTime}`);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleViewDetails(service)}
                      className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    >
                      <div className="flex-shrink-0 text-center">
                        <div className="text-xs text-gray-500 uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {new Date(service.scheduledFor).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {new Date(service.scheduledFor).getDate()}
                        </div>
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {formatTime(service.scheduledTime)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {service.clientName}
                          </span>
                          {getStatusBadge(service.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {service.services.join(', ')}
                        </div>
                        <div className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {service.appliance} - {service.brandModel}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Service Row Component with Client Hover Tooltip
function ServiceRow({
  service,
  onStatusChange,
  onViewDetails,
}: {
  service: ServiceItem;
  onStatusChange: (serviceId: string, newStatus: string) => void;
  onViewDetails: (service: ServiceItem) => void;
}) {
  const [showClientTooltip, setShowClientTooltip] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New', bg: '#E3F2FD', text: '#1976D2', hoverBg: '#BBDEFB', selectedText: '#0D47A1' },
    { value: 'confirmed', label: 'Confirmed', bg: '#E8F5E9', text: '#388E3C', hoverBg: '#C8E6C9', selectedText: '#1B5E20' },
    { value: 'pending', label: 'Pending', bg: '#FFF9C4', text: '#F57C00', hoverBg: '#FFF59D', selectedText: '#E65100' },
    { value: 'in-progress', label: 'In Progress', bg: '#F3E5F5', text: '#7B1FA2', hoverBg: '#E1BEE7', selectedText: '#4A148C' },
    { value: 'completed', label: 'Completed', bg: '#F5F5F5', text: '#424242', hoverBg: '#E0E0E0', selectedText: '#212121' },
    { value: 'canceled', label: 'Canceled', bg: '#FFEBEE', text: '#D32F2F', hoverBg: '#FFCDD2', selectedText: '#B71C1C' },
    { value: 'no-show', label: 'No-show', bg: '#FFF3E0', text: '#F57C00', hoverBg: '#FFE0B2', selectedText: '#E65100' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'new': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'New' },
      'confirmed': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Confirmed' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'canceled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' },
      'no-show': { bg: 'bg-gray-700', text: 'text-white', label: 'No-show' },
    };

    return statusConfig[status] || statusConfig['new'];
  };

  const currentStatusConfig = getStatusBadge(service.status);
  const currentOption = statusOptions.find(opt => opt.value === service.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {formatDate(service.created)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {formatDate(service.scheduledFor)} at {formatTime(service.scheduledTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${currentStatusConfig.bg} ${currentStatusConfig.text}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
          {currentStatusConfig.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm relative">
        <div
          className="inline-block relative"
          onMouseEnter={() => setShowClientTooltip(true)}
          onMouseLeave={() => setShowClientTooltip(false)}
        >
          <span
            className="text-blue-600 font-medium cursor-pointer"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {service.clientName}
          </span>

          {showClientTooltip && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <h4 className="text-sm font-semibold text-blue-600 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {service.clientName}
              </h4>
              <p className="text-sm text-gray-700 mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {service.clientPhone}
              </p>
              <a
                href={`tel:${service.clientPhone}`}
                className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-medium"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="flex flex-wrap gap-1">
          {service.services.map((svc, idx) => (
            <span key={idx} className="inline-block">
              {svc}{idx < service.services.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onViewDetails(service)}
          className="flex items-center space-x-2 px-5 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors text-sm font-medium"
          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </td>
    </tr>
  );
}