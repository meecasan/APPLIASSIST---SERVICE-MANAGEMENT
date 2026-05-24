import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { onServiceNew, offServiceNew, onServiceUpdated, offServiceUpdated, onServiceAssigned, offServiceAssigned } from '../services/realtime';

interface ServiceRequest {
  id: number;
  created: string;
  scheduledFor: string;
  status: 'New' | 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Canceled' | 'No-show';
  name: string;
  appliance: string;
  issue: string;
  contact: string;
  address: string;
  brand?: string;
  requestId?: string;
}

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

interface ServiceRequestsTableProps {
  onViewDetails?: (id: number) => void;
}

export function ServiceRequestsTable({ onViewDetails }: ServiceRequestsTableProps) {
  // Mock data
  const [requests, setRequests] = useState<ServiceRequest[]>([
    { 
      id: 1, 
      created: '2026-01-05', 
      scheduledFor: '2026-01-07', 
      status: 'New', 
      name: 'Juan Dela Cruz', 
      appliance: 'Refrigerator', 
      issue: 'Not cooling properly',
      contact: '+63 912 345 6789',
      address: '123 Main Street, Quezon City',
      brand: 'Samsung WA65H4200',
      requestId: 'REQ-000001'
    },
    { 
      id: 2, 
      created: '2026-01-05', 
      scheduledFor: '2026-01-08', 
      status: 'Confirmed', 
      name: 'Jane Smith', 
      appliance: 'Washing Machine', 
      issue: 'Loud noise during spin cycle',
      contact: '+63 917 234 5678',
      address: '456 Oak Avenue, Manila',
      brand: 'LG F1408',
      requestId: 'REQ-000002'
    },
    { 
      id: 3, 
      created: '2026-01-04', 
      scheduledFor: '2026-01-07', 
      status: 'In Progress', 
      name: 'Bob Johnson', 
      appliance: 'Dryer', 
      issue: 'Not heating',
      contact: '+63 918 345 6789',
      address: '789 Pine Road, Makati',
      brand: 'Whirlpool WED4815',
      requestId: 'REQ-000003'
    },
    { 
      id: 4, 
      created: '2026-01-06', 
      scheduledFor: '2026-01-09', 
      status: 'Pending', 
      name: 'Alice Brown', 
      appliance: 'Air Conditioner', 
      issue: 'Weak airflow',
      contact: '+63 919 456 7890',
      address: '321 Elm Street, Pasig',
      brand: 'Carrier 1.5HP',
      requestId: 'REQ-000004'
    },
    { 
      id: 5, 
      created: '2026-01-03', 
      scheduledFor: '2026-01-06', 
      status: 'Completed', 
      name: 'Mark Wilson', 
      appliance: 'Dishwasher', 
      issue: 'Not draining water',
      contact: '+63 920 567 8901',
      address: '654 Maple Avenue, Taguig',
      brand: 'Bosch SMS',
      requestId: 'REQ-000005'
    },
    { 
      id: 6, 
      created: '2026-01-06', 
      scheduledFor: '2026-01-10', 
      status: 'New', 
      name: 'Sarah Davis', 
      appliance: 'Oven', 
      issue: 'Temperature inconsistent',
      contact: '+63 921 678 9012',
      address: '987 Cedar Lane, Paranaque',
      brand: 'Electrolux EOB',
      requestId: 'REQ-000006'
    },
    { 
      id: 7, 
      created: '2026-01-02', 
      scheduledFor: '2026-01-05', 
      status: 'Canceled', 
      name: 'Tom Anderson', 
      appliance: 'Microwave', 
      issue: 'Not turning on',
      contact: '+63 922 789 0123',
      address: '159 Birch Street, Las Pinas',
      brand: 'Panasonic NN',
      requestId: 'REQ-000007'
    },
    { 
      id: 8, 
      created: '2026-01-05', 
      scheduledFor: '2026-01-07', 
      status: 'Confirmed', 
      name: 'Emily White', 
      appliance: 'Television', 
      issue: 'Screen flickering',
      contact: '+63 923 890 1234',
      address: '753 Willow Drive, Muntinlupa',
      brand: 'Sony Bravia 55"',
      requestId: 'REQ-000008'
    },
  ]);

  useEffect(() => {
    const handleNew = ({ data }: any) => {
      setRequests(prev => [data, ...prev]);
    };
    const handleUpdate = ({ data }: any) => {
      setRequests(prev =>
        prev.map(r => r.id === data.service_request_id ? { ...r, status: data.status } : r)
      );
    };
    const handleAssigned = ({ data }: any) => {
      setRequests(prev =>
        prev.map(r => r.id === data.service_request_id
          ? { ...r, status: 'Confirmed', requestId: data.service_request_id }
          : r
        )
      );
    };
    onServiceNew(handleNew);
    onServiceUpdated(handleUpdate);
    onServiceAssigned(handleAssigned);
    return () => {
      offServiceNew(handleNew);
      offServiceUpdated(handleUpdate);
      offServiceAssigned(handleAssigned);
    };
  }, []);

  const allStatuses: Array<'New' | 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Canceled' | 'No-show'> = [
    'New', 'Confirmed', 'Pending', 'In Progress', 'Completed', 'Canceled', 'No-show'
  ];

  const dateFilterOptions = [
    'All time', 'Today', 'Tomorrow', 'This week', 'Next week', 
    'This month', 'Next month', 'Yesterday', 'Last week', 'Last month', 'Custom range'
  ];

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [createdDateFilter, setCreatedDateFilter] = useState('All time');
  const [scheduledForFilter, setScheduledForFilter] = useState('All time');
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' | null }>({ column: '', direction: null });
  
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [createdDateDropdownOpen, setCreatedDateDropdownOpen] = useState(false);
  const [scheduledForDropdownOpen, setScheduledForDropdownOpen] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [declineReason, setDeclineReason] = useState('');

  // Wizard data
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: 'Diagnostic Assessment', amount: 500 },
    { id: '2', description: 'Labor (2 hours @ ₱350/hr)', amount: 700 },
    { id: '3', description: 'Basic Maintenance', amount: 300 },
  ]);
  const [jobOrderNumber] = useState('JO-000001');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-gray-100 text-gray-800';
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

  const handleStatusChange = (requestId: number, newStatus: ServiceRequest['status']) => {
    setRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
    );
    setEditingStatusId(null);
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleSelectAllStatuses = () => {
    if (selectedStatuses.length === allStatuses.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses([...allStatuses]);
    }
  };

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ column, direction });
  };

  const getSortedRequests = () => {
    let sorted = [...requests];

    // Apply status filter
    if (selectedStatuses.length > 0) {
      sorted = sorted.filter(req => selectedStatuses.includes(req.status));
    }

    // Apply sorting
    if (sortConfig.column && sortConfig.direction) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.column as keyof ServiceRequest];
        let bValue = b[sortConfig.column as keyof ServiceRequest];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return sorted;
  };

  const filteredRequests = getSortedRequests();

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    // Adjust current page if needed
    const newTotalPages = Math.ceil(filteredRequests.length / newRowsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleDecline = () => {
    if (selectedRequest) {
      setRequests(prev => 
        prev.map(req => req.id === selectedRequest.id ? { ...req, status: 'Canceled' } : req)
      );
      setDetailsModalOpen(false);
      setDeclineReason('');
    }
  };

  const handleAccept = () => {
    setDetailsModalOpen(false);
    setWizardOpen(true);
    setWizardStep(1);
    // Reset wizard data
    setScheduleDate('');
    setScheduleTime('');
    setScheduleNotes('');
    setLineItems([
      { id: '1', description: 'Diagnostic Assessment', amount: 500 },
      { id: '2', description: 'Labor (2 hours @ ₱350/hr)', amount: 700 },
      { id: '3', description: 'Basic Maintenance', amount: 300 },
    ]);
  };

  const handleWizardNext = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleAddLineItem = () => {
    const newId = String(Date.now());
    setLineItems([...lineItems, { id: newId, description: '', amount: 0 }]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: 'description' | 'amount', value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSendReceipt = () => {
    if (selectedRequest) {
      setRequests(prev => 
        prev.map(req => req.id === selectedRequest.id ? { ...req, status: 'Confirmed' } : req)
      );
    }
    setWizardOpen(false);
    setSelectedRequest(null);
  };

  const SortIcon = ({ column }: { column: string }) => {
    const isActive = sortConfig.column === column;
    const direction = sortConfig.direction;

    return (
      <div className="inline-flex flex-col ml-1">
        <ChevronUp 
          className={`w-3 h-3 -mb-1 ${isActive && direction === 'asc' ? 'text-[#1E2F4F]' : 'text-gray-400'}`} 
        />
        <ChevronDown 
          className={`w-3 h-3 ${isActive && direction === 'desc' ? 'text-[#1E2F4F]' : 'text-gray-400'}`} 
        />
      </div>
    );
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 p-6">
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Status
            </label>
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setCreatedDateDropdownOpen(false);
                setScheduledForDropdownOpen(false);
              }}
              className="w-64 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#1E2F4F] transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <span className="text-sm text-gray-700">
                {selectedStatuses.length === 0 
                  ? 'All Statuses' 
                  : selectedStatuses.length === allStatuses.length
                  ? 'All Statuses'
                  : `${selectedStatuses.length} selected`
                }
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 border-b border-gray-200">
                  <button
                    onClick={handleSelectAllStatuses}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-[#1E2F4F] hover:bg-gray-50 rounded transition-colors"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {selectedStatuses.length === allStatuses.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {allStatuses.map(status => (
                    <label
                      key={status}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatusFilter(status)}
                        className="w-4 h-4 text-[#1E2F4F] border-gray-300 rounded focus:ring-[#1E2F4F]"
                      />
                      <span className="ml-3 text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Created Date Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Created
            </label>
            <button
              onClick={() => {
                setCreatedDateDropdownOpen(!createdDateDropdownOpen);
                setStatusDropdownOpen(false);
                setScheduledForDropdownOpen(false);
              }}
              className="w-52 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#1E2F4F] transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <span className="text-sm text-gray-700">{createdDateFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {createdDateDropdownOpen && (
              <div className="absolute z-10 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {dateFilterOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setCreatedDateFilter(option);
                        setCreatedDateDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        createdDateFilter === option
                          ? 'bg-[#1E2F4F] text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scheduled For Date Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Scheduled For
            </label>
            <button
              onClick={() => {
                setScheduledForDropdownOpen(!scheduledForDropdownOpen);
                setStatusDropdownOpen(false);
                setCreatedDateDropdownOpen(false);
              }}
              className="w-52 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#1E2F4F] transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <span className="text-sm text-gray-700">{scheduledForFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {scheduledForDropdownOpen && (
              <div className="absolute z-10 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {dateFilterOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setScheduledForFilter(option);
                        setScheduledForDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        scheduledForFilter === option
                          ? 'bg-[#1E2F4F] text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedStatuses.length > 0 && selectedStatuses.length < allStatuses.length) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Active filters:
              </span>
              {selectedStatuses.map(status => (
                <span
                  key={status}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('created')}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Created
                    </span>
                    <SortIcon column="created" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Name
                    </span>
                    <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('appliance')}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Appliance
                    </span>
                    <SortIcon column="appliance" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Issue
                  </span>
                </th>
                <th 
                  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Status
                    </span>
                    <SortIcon column="status" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      No service requests found matching your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {new Date(request.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {request.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {request.appliance}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {request.issue}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingStatusId === request.id ? (
                        <div className="relative inline-block">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusChange(request.id, e.target.value as ServiceRequest['status'])}
                            onBlur={() => setEditingStatusId(null)}
                            autoFocus
                            className="px-3 py-1.5 pr-8 rounded-full text-xs font-medium border-2 border-[#1E2F4F] focus:outline-none focus:ring-2 focus:ring-[#1E2F4F]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {allStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingStatusId(request.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-all duration-200 ${getStatusColor(request.status)}`}
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          {request.status}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-[#1E2F4F] hover:text-white transition-all whitespace-nowrap"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} requests
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Rows per page:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-all ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-[#1E2F4F] text-white border-[#1E2F4F]'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {detailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Customer Details
              </h2>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Request Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Request Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Request ID
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.requestId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Date Created
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {new Date(selectedRequest.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Current Status
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Name
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Contact
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.contact}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Address
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appliance Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Appliance Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Appliance
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.appliance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Brand / Model
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Issue Description
                    </p>
                    <p className="text-base text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {selectedRequest.issue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decline Reason (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Decline Reason (Optional)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all resize-none"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                  placeholder="Enter reason for declining (optional)"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
              <button
                onClick={handleDecline}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Acceptance Wizard Modal */}
      {wizardOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Wizard Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Service Acceptance Wizard
                </h2>
                <button
                  onClick={() => setWizardOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Step {wizardStep} of 3
                  </span>
                  <span className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {Math.round((wizardStep / 3) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E2F4F] transition-all duration-300"
                    style={{ width: `${(wizardStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Wizard Content */}
            <div className="p-6">
              {/* Step 1: Schedule */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Schedule Service
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Select Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Notes / Reason (Optional)
                    </label>
                    <textarea
                      value={scheduleNotes}
                      onChange={(e) => setScheduleNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent transition-all resize-none"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      placeholder="Add any additional notes or instructions"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Pricing & Line Items
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {lineItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent text-sm"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                            placeholder="Description"
                          />
                        </div>
                        <div className="w-40">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) => handleLineItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent text-sm"
                              style={{ fontFamily: 'Manrope, sans-serif' }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddLineItem}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#1E2F4F] hover:text-[#1E2F4F] transition-all w-full justify-center"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Total Service Cost
                      </span>
                      <span className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Service Receipt */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Service Receipt (Preview)
                    </h3>
                  </div>

                  {/* Job Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Job Information
                    </h4>
                    <p className="text-sm text-gray-700 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <span className="font-medium">Job Order Number:</span> {jobOrderNumber}
                    </p>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Customer Information
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <p><span className="font-medium">Name:</span> {selectedRequest.name}</p>
                      <p><span className="font-medium">Contact:</span> {selectedRequest.contact}</p>
                      <p><span className="font-medium">Address:</span> {selectedRequest.address}</p>
                    </div>
                  </div>

                  {/* Appliance & Service Details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Appliance & Service Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <p><span className="font-medium">Appliance:</span> {selectedRequest.appliance}</p>
                      <p><span className="font-medium">Brand / Model:</span> {selectedRequest.brand}</p>
                      <p><span className="font-medium">Issue:</span> {selectedRequest.issue}</p>
                      <p><span className="font-medium">Service Date:</span> {scheduleDate || 'Not set'}</p>
                      <p><span className="font-medium">Service Time:</span> {scheduleTime || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Payment Summary
                    </h4>
                    <div className="space-y-2 mb-3">
                      {lineItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          <span>{item.description}</span>
                          <span>₱{item.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Final Cost
                        </span>
                        <span className="text-xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          ₱{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <button
                onClick={() => setWizardOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Cancel
              </button>

              <div className="flex items-center space-x-3">
                {wizardStep > 1 && (
                  <button
                    onClick={handleWizardBack}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Back
                  </button>
                )}
                {wizardStep < 3 ? (
                  <button
                    onClick={handleWizardNext}
                    disabled={wizardStep === 1 && (!scheduleDate || !scheduleTime)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      wizardStep === 1 && (!scheduleDate || !scheduleTime)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066]'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSendReceipt}
                    className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Send Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}