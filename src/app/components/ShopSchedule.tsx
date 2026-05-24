import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, Eye, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Phone, Search } from 'lucide-react';
import { ordersAPI } from '../services/api';

interface ShopScheduleProps {
  schedules?: DeliveryItem[];
  storeId?: string;
  onNavigate?: (view: 'list' | 'calendar') => void;
  onViewDetails?: (scheduleId: string) => void;
  onRefresh?: () => void;
}

interface DeliveryItem {
  id: string;
  orderNo: string;
  created: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'new' | 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  products: string[];
  productType: string;
  productBrand: string;
  deliveryNotes: string;
}

// Map backend order status to frontend delivery status
const mapOrderStatus = (backendStatus: string): DeliveryItem['status'] => {
  const statusMap: Record<string, DeliveryItem['status']> = {
    'Pending': 'pending',
    'Confirmed': 'confirmed',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Cancelled': 'canceled',
    'No-show': 'no-show',
  };
  return statusMap[backendStatus] || 'new';
};

// Transform backend order data to frontend DeliveryItem format
const transformOrderToDelivery = (order: any): DeliveryItem => {
  return {
    id: String(order.order_id || order.id),
    orderNo: `ORD-${String(order.order_id || order.id).padStart(6, '0')}`,
    created: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    scheduledFor: order.scheduled_date || new Date().toISOString().split('T')[0],
    scheduledTime: order.scheduled_time || '12:00',
    status: mapOrderStatus(order.order_status || 'Pending'),
    customerName: order.customer_first_name 
      ? `${order.customer_first_name} ${order.customer_last_name || ''}`.trim()
      : 'Customer',
    customerPhone: order.contact_number || '',
    customerAddress: order.customer_address || order.delivery_address || '',
    products: order.products ? [order.products] : ['Order Items'],
    productType: order.product_type || 'Appliance Parts',
    productBrand: order.product_brand || 'Various',
    deliveryNotes: order.delivery_notes || order.notes || '',
  };
};

export function ShopSchedule({ schedules: externalSchedules, storeId, onNavigate, onViewDetails, onRefresh }: ShopScheduleProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'timeline' | 'day' | 'week' | 'month' | 'weekly-overview'>('week');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduledForFilter, setScheduledForFilter] = useState('all-time');
  const [createdFilter, setCreatedFilter] = useState('all-time');
  const [sortColumn, setSortColumn] = useState<'created' | 'scheduledFor' | 'status' | 'customer' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [scheduledForOpen, setScheduledForOpen] = useState(false);
  const [createdOpen, setCreatedOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentMonthStart, setCurrentMonthStart] = useState(new Date(2026, 0, 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for deliveries - either use external data or fetch from API
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(
    externalSchedules || []
  );

  // Fetch deliveries from API when component mounts or storeId changes
  useEffect(() => {
    const fetchDeliveries = async () => {
      if (externalSchedules) {
        setDeliveries(externalSchedules);
        return;
      }

      if (!storeId) {
        // Use mock data if no storeId provided
        setDeliveries(getMockDeliveries());
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch orders for this store
        const orders = await ordersAPI.getOrdersByStoreId(storeId);
        const transformedDeliveries = orders.map(transformOrderToDelivery);
        setDeliveries(transformedDeliveries);
      } catch (err) {
        console.error('Failed to fetch deliveries:', err);
        setError('Failed to load deliveries. Using offline data.');
        setDeliveries(getMockDeliveries());
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [storeId, externalSchedules]);

  // Mock data fallback
  const getMockDeliveries = (): DeliveryItem[] => [
    {
      id: '1',
      orderNo: 'ORD-2026-001',
      created: '2026-01-02',
      scheduledFor: '2026-01-07',
      scheduledTime: '09:00',
      status: 'confirmed',
      customerName: 'Jeff O\'Malley',
      customerPhone: '+63 992 695 0715',
      customerAddress: '123 Main Street, Quezon City',
      products: ['Refrigerator Compressor', 'Cooling Coil'],
      productType: 'Refrigerator Parts',
      productBrand: 'Samsung RT38',
      deliveryNotes: 'Scheduled delivery'
    },
    {
      id: '2',
      orderNo: 'ORD-2026-002',
      created: '2026-01-03',
      scheduledFor: '2026-01-08',
      scheduledTime: '14:00',
      status: 'pending',
      customerName: 'Maria Santos',
      customerPhone: '+63 998 123 4567',
      customerAddress: '456 Oak Avenue, Manila',
      products: ['Washing Machine Motor'],
      productType: 'Washing Machine Parts',
      productBrand: 'LG WM-500',
      deliveryNotes: 'Rush order'
    },
    {
      id: '3',
      orderNo: 'ORD-2026-003',
      created: '2026-01-04',
      scheduledFor: '2026-01-06',
      scheduledTime: '10:30',
      status: 'new',
      customerName: 'John Cruz',
      customerPhone: '+63 917 888 9999',
      customerAddress: '789 Pine Road, Makati',
      products: ['Air Filter Set', 'Capacitor'],
      productType: 'Air Conditioner Parts',
      productBrand: 'Carrier X-Series',
      deliveryNotes: 'New order'
    },
    {
      id: '4',
      orderNo: 'ORD-2026-004',
      created: '2026-01-05',
      scheduledFor: '2026-01-06',
      scheduledTime: '13:00',
      status: 'in-progress',
      customerName: 'Anna Reyes',
      customerPhone: '+63 920 555 1234',
      customerAddress: '321 Elm Street, Pasig',
      products: ['Heating Element', 'Thermostat'],
      productType: 'Dryer Parts',
      productBrand: 'Whirlpool DRY-300',
      deliveryNotes: 'In transit'
    },
    {
      id: '5',
      orderNo: 'ORD-2026-005',
      created: '2026-01-06',
      scheduledFor: '2026-01-09',
      scheduledTime: '11:00',
      status: 'completed',
      customerName: 'Robert Garcia',
      customerPhone: '+63 915 777 8888',
      customerAddress: '654 Cedar Lane, Taguig',
      products: ['Spray Arm', 'Water Pump'],
      productType: 'Dishwasher Parts',
      productBrand: 'Bosch DW-600',
      deliveryNotes: 'Delivered successfully'
    },
    {
      id: '6',
      orderNo: 'ORD-2026-006',
      created: '2026-01-04',
      scheduledFor: '2026-01-07',
      scheduledTime: '15:30',
      status: 'confirmed',
      customerName: 'Lisa Wong',
      customerPhone: '+63 922 333 4444',
      customerAddress: '88 Cherry Boulevard, BGC',
      products: ['Magnetron'],
      productType: 'Microwave Parts',
      productBrand: 'Panasonic MW-1200',
      deliveryNotes: 'Confirmed for delivery'
    },
    {
      id: '7',
      orderNo: 'ORD-2026-007',
      created: '2026-01-05',
      scheduledFor: '2026-01-08',
      scheduledTime: '09:30',
      status: 'new',
      customerName: 'Carlos Martinez',
      customerPhone: '+63 919 666 7777',
      customerAddress: '45 Sunset Drive, Alabang',
      products: ['Temperature Sensor', 'Heating Element'],
      productType: 'Oven Parts',
      productBrand: 'Electrolux OV-900',
      deliveryNotes: 'New order pending confirmation'
    },
  ];

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

  // Sync external schedules with internal state
  useEffect(() => {
    if (externalSchedules) {
      setDeliveries(externalSchedules);
    }
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

  const handleSort = (column: 'created' | 'scheduledFor' | 'status' | 'customer') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (deliveryId: string, newStatus: string) => {
    setDeliveries(deliveries.map(d => d.id === deliveryId ? { ...d, status: newStatus as any } : d));
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

  const handleViewDetails = (delivery: DeliveryItem) => {
    if (onViewDetails) {
      onViewDetails(delivery.id);
    }
  };


  // Filter deliveries
  let filteredDeliveries = deliveries.filter(delivery => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(delivery.status)) {
      return false;
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return delivery.customerName.toLowerCase().includes(lowerCaseQuery);
    }
    return true;
  });

  // Sort deliveries - default to nearest upcoming first
  if (sortColumn) {
    filteredDeliveries = [...filteredDeliveries].sort((a, b) => {
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
      } else if (sortColumn === 'customer') {
        aVal = a.customerName;
        bVal = b.customerName;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  } else {
    // Default sort: nearest upcoming first (by scheduled date/time)
    filteredDeliveries = [...filteredDeliveries].sort((a, b) => {
      const dateTimeA = new Date(`${a.scheduledFor}T${a.scheduledTime}`).getTime();
      const dateTimeB = new Date(`${b.scheduledFor}T${b.scheduledTime}`).getTime();
      return dateTimeA - dateTimeB;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

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

  const getDeliveriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredDeliveries.filter(delivery => delivery.scheduledFor === dateStr);
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
                  placeholder="Search by customer name..."
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
                      onClick={() => handleSort('customer')}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <span>Customer</span>
                      {sortColumn === 'customer' ? (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedDeliveries.map((delivery) => (
                  <DeliveryRow
                    key={delivery.id}
                    delivery={delivery}
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
                Showing {startIndex + 1}–{Math.min(endIndex, filteredDeliveries.length)} of {filteredDeliveries.length}
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
                  const dayDeliveries = getDeliveriesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={idx} className="min-h-[200px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className={`text-sm font-semibold mb-3 ${isToday ? 'text-[#1E2F4F]' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-2">
                        {dayDeliveries.map((delivery) => (
                          <div
                            key={delivery.id}
                            onClick={() => handleViewDetails(delivery)}
                            className={`p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${
                              delivery.status === 'new' ? 'bg-blue-100 border border-blue-200' :
                              delivery.status === 'confirmed' ? 'bg-green-100 border border-green-200' :
                              delivery.status === 'pending' ? 'bg-yellow-100 border border-yellow-200' :
                              delivery.status === 'in-progress' ? 'bg-purple-100 border border-purple-200' :
                              delivery.status === 'completed' ? 'bg-gray-100 border border-gray-200' :
                              delivery.status === 'canceled' ? 'bg-red-100 border border-red-200' :
                              'bg-orange-100 border border-orange-200'
                            }`}
                          >
                            <div className="text-xs font-semibold mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                              {formatTime(delivery.scheduledTime)}
                            </div>
                            <div className="text-xs text-gray-900 truncate" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {delivery.customerName}
                            </div>
                            <div className="text-xs text-gray-600 truncate mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {delivery.products[0]}
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
                  const dayDeliveries = getDeliveriesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={idx} className="min-h-[100px] p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#1E2F4F]' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        {dayDeliveries.slice(0, 3).map((delivery) => (
                          <div
                            key={delivery.id}
                            onClick={() => handleViewDetails(delivery)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                              delivery.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              delivery.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              delivery.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                              delivery.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              delivery.status === 'canceled' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {formatTime(delivery.scheduledTime)}
                          </div>
                        ))}
                        {dayDeliveries.length > 3 && (
                          <div className="text-xs text-gray-500 px-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            +{dayDeliveries.length - 3} more
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
                {getDeliveriesForDate(currentWeekStart).length > 0 ? (
                  getDeliveriesForDate(currentWeekStart).map((delivery) => (
                    <div
                      key={delivery.id}
                      onClick={() => handleViewDetails(delivery)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-semibold text-[#1E2F4F]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                              {formatTime(delivery.scheduledTime)}
                            </span>
                            {getStatusBadge(delivery.status)}
                          </div>
                          <div className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {delivery.customerName}
                          </div>
                          <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {delivery.products.join(', ')}
                          </div>
                          <div className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {delivery.productType} - {delivery.productBrand}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      No deliveries scheduled for this day
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
                {filteredDeliveries
                  .sort((a, b) => {
                    const dateA = new Date(`${a.scheduledFor}T${a.scheduledTime}`);
                    const dateB = new Date(`${b.scheduledFor}T${b.scheduledTime}`);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((delivery) => (
                    <div
                      key={delivery.id}
                      onClick={() => handleViewDetails(delivery)}
                      className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    >
                      <div className="flex-shrink-0 text-center">
                        <div className="text-xs text-gray-500 uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {new Date(delivery.scheduledFor).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {new Date(delivery.scheduledFor).getDate()}
                        </div>
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {formatTime(delivery.scheduledTime)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {delivery.customerName}
                          </span>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {delivery.products.join(', ')}
                        </div>
                        <div className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {delivery.productType} - {delivery.productBrand}
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

// Delivery Row Component with Customer Hover Tooltip
function DeliveryRow({
  delivery,
  onStatusChange,
  onViewDetails,
}: {
  delivery: DeliveryItem;
  onStatusChange: (deliveryId: string, newStatus: string) => void;
  onViewDetails: (delivery: DeliveryItem) => void;
}) {
  const [showCustomerTooltip, setShowCustomerTooltip] = useState(false);

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

  const currentStatusConfig = getStatusBadge(delivery.status);
  const currentOption = statusOptions.find(opt => opt.value === delivery.status);

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
        {formatDate(delivery.created)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {formatDate(delivery.scheduledFor)} at {formatTime(delivery.scheduledTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${currentStatusConfig.bg} ${currentStatusConfig.text}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
          {currentStatusConfig.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm relative">
        <div
          className="inline-block relative"
          onMouseEnter={() => setShowCustomerTooltip(true)}
          onMouseLeave={() => setShowCustomerTooltip(false)}
        >
          <span
            className="text-blue-600 font-medium cursor-pointer"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {delivery.customerName}
          </span>

          {showCustomerTooltip && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <h4 className="text-sm font-semibold text-blue-600 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {delivery.customerName}
              </h4>
              <p className="text-sm text-gray-700 mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {delivery.customerPhone}
              </p>
              <a
                href={`tel:${delivery.customerPhone}`}
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
          {delivery.products.map((product, idx) => (
            <span key={idx} className="inline-block">
              {product}{idx < delivery.products.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onViewDetails(delivery)}
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
