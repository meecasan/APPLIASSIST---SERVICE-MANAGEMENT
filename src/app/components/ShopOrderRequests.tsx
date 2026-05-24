import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Eye, X, Plus, Trash2, Calendar, Clock, Search } from 'lucide-react';
import { onOrderNew, offOrderNew } from '../services/realtime';

interface OrderRequest {
  id: number;
  created: string;
  createdTime: string;
  scheduledFor: string;
  scheduledTime: string;
  status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Canceled' | 'No-show';
  name: string;
  product: string;
  productBrand: string;
  quantity: number;
  contact: string;
  address: string;
  orderNo: string;
  shopNotes?: string;
}

interface ShopOrderRequestsProps {
  orders?: OrderRequest[];
  onViewDetails?: (id: number) => void;
}

export function ShopOrderRequests({ orders: externalOrders, onViewDetails }: ShopOrderRequestsProps) {
  // State management
  const [orders, setOrders] = useState<OrderRequest[]>(externalOrders || [
    {
      id: 1,
      created: 'Jan 2, 2026',
      createdTime: '9:30 AM',
      scheduledFor: 'Jan 8, 2026',
      scheduledTime: '2:00 PM',
      status: 'Pending',
      name: 'Maria Santos',
      product: 'Refrigerator Compressor',
      productBrand: 'Samsung RT38G5D2S',
      quantity: 2,
      contact: '+63 912 345 6789',
      address: '123 Main Street, Quezon City',
      orderNo: 'ORD-000001'
    },
    {
      id: 2,
      created: 'Jan 3, 2026',
      createdTime: '10:15 AM',
      scheduledFor: 'Jan 9, 2026',
      scheduledTime: '10:00 AM',
      status: 'Confirmed',
      name: 'Juan Dela Cruz',
      product: 'Washing Machine Motor',
      productBrand: 'LG WM09918BA',
      quantity: 1,
      contact: '+63 917 234 5678',
      address: '456 Oak Avenue, Manila',
      orderNo: 'ORD-000002'
    },
    {
      id: 3,
      created: 'Jan 4, 2026',
      createdTime: '11:30 AM',
      scheduledFor: 'Jan 10, 2026',
      scheduledTime: '4:00 PM',
      status: 'Pending',
      name: 'Anna Reyes',
      product: 'Air Conditioner Filter Set',
      productBrand: 'Carrier X-Series',
      quantity: 5,
      contact: '+63 918 345 6789',
      address: '789 Pine Road, Makati',
      orderNo: 'ORD-000003'
    },
    {
      id: 4,
      created: 'Jan 5, 2026',
      createdTime: '8:45 AM',
      scheduledFor: 'Jan 11, 2026',
      scheduledTime: '9:00 AM',
      status: 'In Progress',
      name: 'Roberto Garcia',
      product: 'Microwave Magnetron',
      productBrand: 'Panasonic NN9653',
      quantity: 1,
      contact: '+63 919 456 7890',
      address: '321 Elm Street, Pasig',
      orderNo: 'ORD-000004'
    },
    {
      id: 5,
      created: 'Jan 1, 2026',
      createdTime: '2:30 PM',
      scheduledFor: 'Jan 7, 2026',
      scheduledTime: '11:00 AM',
      status: 'Completed',
      name: 'Carmen Lopez',
      product: 'Dishwasher Spray Arm',
      productBrand: 'Bosch SPH4857594',
      quantity: 3,
      contact: '+63 920 567 8901',
      address: '654 Maple Avenue, Taguig',
      orderNo: 'ORD-000005'
    },
    {
      id: 6,
      created: 'Jan 3, 2026',
      createdTime: '4:00 PM',
      scheduledFor: 'Jan 9, 2026',
      scheduledTime: '3:00 PM',
      status: 'Canceled',
      name: 'Pedro Ramos',
      product: 'Dryer Heating Element',
      productBrand: 'Whirlpool WED4815W',
      quantity: 1,
      contact: '+63 921 678 9012',
      address: '987 Cedar Lane, Paranaque',
      orderNo: 'ORD-000006'
    },
    {
      id: 7,
      created: 'Jan 4, 2026',
      createdTime: '1:15 PM',
      scheduledFor: 'Jan 10, 2026',
      scheduledTime: '1:00 PM',
      status: 'No-show',
      name: 'Sofia Martinez',
      product: 'Oven Temperature Sensor',
      productBrand: 'GE JB645SNSS',
      quantity: 2,
      contact: '+63 922 789 0123',
      address: '147 Birch Road, Las Pinas',
      orderNo: 'ORD-000007'
    },
    {
      id: 8,
      created: 'Jan 5, 2026',
      createdTime: '5:45 PM',
      scheduledFor: 'Jan 12, 2026',
      scheduledTime: '10:00 AM',
      status: 'Pending',
      name: 'Diego Torres',
      product: 'Refrigerator Ice Maker',
      productBrand: 'Haier HRF-6456SS',
      quantity: 1,
      contact: '+63 923 890 1234',
      address: '258 Willow Street, Muntinlupa',
      orderNo: 'ORD-000008'
    },
    {
      id: 9,
      created: 'Jan 6, 2026',
      createdTime: '9:00 AM',
      scheduledFor: 'Jan 6, 2026',
      scheduledTime: '2:00 PM',
      status: 'Confirmed',
      name: 'Isabella Cruz',
      product: 'TV Power Board',
      productBrand: 'Sony XBR-48A9Gfu',
      quantity: 1,
      contact: '+63 924 901 2345',
      address: '369 Spruce Avenue, Caloocan',
      orderNo: 'ORD-000009'
    },
    {
      id: 10,
      created: 'Jan 6, 2026',
      createdTime: '10:30 AM',
      scheduledFor: 'Jan 7, 2026',
      scheduledTime: '9:00 AM',
      status: 'Pending',
      name: 'Miguel Fernandez',
      product: 'Washing Machine Belt',
      productBrand: 'Samsung WA09R5260W',
      quantity: 2,
      contact: '+63 925 012 3456',
      address: '741 Oak Boulevard, Valenzuela',
      orderNo: 'ORD-000010'
    },
  ]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduledForFilter, setScheduledForFilter] = useState('all-time');
  const [createdFilter, setCreatedFilter] = useState('all-time');
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [scheduledForOpen, setScheduledForOpen] = useState(false);
  const [createdOpen, setCreatedOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<'created' | 'name' | 'product' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusFilterRef = useRef<HTMLDivElement>(null);
  const scheduledForRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef<HTMLDivElement>(null);

  // Sync external orders with internal state
  useEffect(() => {
    if (externalOrders) {
      setOrders(externalOrders);
    }
  }, [externalOrders]);

  // Real-time order updates
  useEffect(() => {
    const handleNew = ({ data }: any) => {
      setOrders(prev => [data, ...prev]);
    };
    onOrderNew(handleNew);
    return () => offOrderNew(handleNew);
  }, []);

  const statusOptions = [
    { value: 'Confirmed', label: 'Confirmed', bg: '#E8F5E9', text: '#388E3C', hoverBg: '#C8E6C9', selectedText: '#1B5E20' },
    { value: 'Pending', label: 'Pending', bg: '#FFF9C4', text: '#F57C00', hoverBg: '#FFF59D', selectedText: '#E65100' },
    { value: 'In Progress', label: 'In Progress', bg: '#F3E5F5', text: '#7B1FA2', hoverBg: '#E1BEE7', selectedText: '#4A148C' },
    { value: 'Completed', label: 'Completed', bg: '#F5F5F5', text: '#424242', hoverBg: '#E0E0E0', selectedText: '#212121' },
    { value: 'Canceled', label: 'Canceled', bg: '#FFEBEE', text: '#D32F2F', hoverBg: '#FFCDD2', selectedText: '#B71C1C' },
    { value: 'No-show', label: 'No-show', bg: '#FFF3E0', text: '#F57C00', hoverBg: '#FFE0B2', selectedText: '#E65100' },
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

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setStatusFilterOpen(false);
      }
      if (scheduledForRef.current && !scheduledForRef.current.contains(event.target as Node)) {
        setScheduledForOpen(false);
      }
      if (createdRef.current && !createdRef.current.contains(event.target as Node)) {
        setCreatedOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      case 'No-show':
        return 'bg-gray-700 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = (value: string) => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    setSelectedStatuses(statusOptions.map(s => s.value));
  };

  const handleClearAll = () => {
    setSelectedStatuses([]);
  };

  const handleSort = (column: 'created' | 'name' | 'product' | 'status') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleViewDetails = (orderId: number) => {
    if (onViewDetails) {
      onViewDetails(orderId);
    }
  };

  // Filter orders
  let filteredOrders = orders.filter(order => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) {
      return false;
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        order.name.toLowerCase().includes(lowerCaseQuery) ||
        order.product.toLowerCase().includes(lowerCaseQuery) ||
        order.orderNo.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return true;
  });

  // Sort orders
  if (sortColumn) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortColumn === 'created') {
        aVal = a.created;
        bVal = b.created;
      } else if (sortColumn === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortColumn === 'product') {
        aVal = a.product;
        bVal = b.product;
      } else if (sortColumn === 'status') {
        aVal = a.status;
        bVal = b.status;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div>
      {/* Page Header */}

      {/* Search and Filters Row */}
      <div className="mb-6 flex items-center justify-between space-x-4">
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
          <div className="relative" ref={statusFilterRef}>
            <button
              onClick={() => setStatusFilterOpen(!statusFilterOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#d1d5dc] rounded-[10px] hover:bg-gray-50 transition-colors h-[37.6px]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span className="text-sm font-medium text-gray-700">
                Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {statusFilterOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Select all
                  </button>
                  <button
                    onClick={handleClearAll}
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
                        onChange={() => handleStatusToggle(option.value)}
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

          {/* Created Filter */}
          <div className="relative" ref={createdRef}>
            <button
              onClick={() => setCreatedOpen(!createdOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#d1d5dc] rounded-[10px] hover:bg-gray-50 transition-colors h-[37.6px]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span className="text-sm font-medium text-gray-700">Created: All time</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {createdOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('created')}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <span>Created</span>
                    {sortColumn === 'created' ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <span>Customer</span>
                    {sortColumn === 'name' ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('product')}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <span>Product</span>
                    {sortColumn === 'product' ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Quantity
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-gray-900"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <span>Status</span>
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.created}
                    </div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.createdTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.product}
                    </div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.productBrand}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors text-sm font-medium"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Rows per page:
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#1E2F4F] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
