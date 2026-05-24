import React, { useState, useEffect } from 'react';
import { Package, Wrench, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, Truck, AlertCircle, Search } from 'lucide-react';
import { getCurrentUser, bookingAPI } from '../../services/api';

interface TrackingPageProps {
  onBack: () => void;
}

export default function TrackingPage({ onBack }: TrackingPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'bookings' | 'orders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = getCurrentUser();
        const customerId = user?.user_id || user?.id;
        if (!customerId) return;
        const results = await bookingAPI.getMyBookings(customerId);
        // Map backend fields to this component's expected shape where possible
        const mapped = (results || []).map((b: any) => ({
          id: `BK${b.service_request_id || b.request_id || b.id}`,
          type: 'booking',
          service: b.service || b.appliance_type || 'Service',
          technician: b.technician_name || (b.technician_first_name ? `${b.technician_first_name} ${b.technician_last_name || ''}`.trim() : 'Technician'),
          date: b.appointment_date || b.scheduled_date || b.preferred_date || b.scheduledFor || '',
          time: b.scheduled_time || b.preferred_time || '',
          status: (b.status || b.service_status || 'pending').toLowerCase(),
          address: b.service_address || b.address || '',
          phone: b.contact_number || b.customer_phone || '',
          appliance: b.appliance_type || b.appliance || '',
          issue: b.issue_description || b.problem_description || '',
          createdAt: b.created_at || b.request_date || '',
        }));
        setBookings(mapped);
      } catch (err) {
        console.error('Failed to load bookings for tracking page:', err);
      }
    };
    loadBookings();
  }, []);

  const orders = [
    {
      id: 'ORD12345678',
      type: 'order',
      product: 'Samsung Refrigerator Water Filter',
      productIcon: '🔧',
      quantity: 2,
      status: 'shipped',
      orderDate: '2026-05-08',
      estimatedDelivery: '2026-05-16',
      shippingAddress: '123 Main St, Quezon City',
      totalAmount: 2500,
      paymentMethod: 'GCash',
      trackingNumber: 'TRK987654321',
    },
    {
      id: 'ORD12345679',
      type: 'order',
      product: 'LG Washing Machine Drain Pump',
      productIcon: '⚙️',
      quantity: 1,
      status: 'processing',
      orderDate: '2026-05-11',
      estimatedDelivery: '2026-05-18',
      shippingAddress: '456 Oak Ave, Makati City',
      totalAmount: 1800,
      paymentMethod: 'Cash on Delivery',
      trackingNumber: null,
    },
    {
      id: 'PO87654321',
      type: 'preorder',
      product: 'Bosch Dishwasher Control Board',
      productIcon: '🔌',
      quantity: 1,
      status: 'preorder',
      orderDate: '2026-05-09',
      estimatedDelivery: '2026-05-30',
      shippingAddress: '789 Pine Rd, Pasig City',
      totalAmount: 4500,
      downPayment: 1350,
      remainingBalance: 3150,
      paymentMethod: 'GCash',
      trackingNumber: null,
    },
    {
      id: 'ORD12345680',
      type: 'order',
      product: 'Whirlpool Oven Heating Element',
      productIcon: '🔥',
      quantity: 1,
      status: 'delivered',
      orderDate: '2026-05-01',
      estimatedDelivery: '2026-05-07',
      deliveredDate: '2026-05-07',
      shippingAddress: '321 Elm St, Taguig City',
      totalAmount: 3200,
      paymentMethod: 'Bank Transfer',
      trackingNumber: 'TRK123456789',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'preorder':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'preorder':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.technician.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allItems = [...filteredBookings, ...filteredOrders].sort(
    (a, b) => new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime()
  );

  const displayItems =
    activeTab === 'all' ? allItems : activeTab === 'bookings' ? filteredBookings : filteredOrders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E2F4F] mb-2">Track Orders & Bookings</h1>
          <p className="text-gray-600">Monitor all your service bookings and product orders in one place</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'all', label: 'All', count: allItems.length },
            { id: 'bookings', label: 'Service Bookings', count: bookings.length },
            { id: 'orders', label: 'Product Orders', count: orders.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'bookings' | 'orders')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1E2F4F] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, service, product, or technician..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1E2F4F] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1E2F4F] focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="preorder">Pre-Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-6">
          {displayItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {item.type === 'booking' ? (
                  <div>
                    {/* Booking Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-3xl">
                          <Wrench className="w-8 h-8 text-[#1E2F4F]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-[#1E2F4F]">{item.service}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center space-x-1 ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {getStatusIcon(item.status)}
                              <span className="uppercase">{item.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Booking ID: {item.id}</p>
                          <p className="text-sm text-gray-500">Booked on {item.createdAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#1E2F4F]">₱{item.cost.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Service Fee</p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-gray-100 pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {item.technicianPhoto}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Technician</p>
                            <p className="font-semibold text-gray-900">{item.technician}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Scheduled Date & Time</p>
                            <p className="font-semibold text-gray-900">{item.date}</p>
                            <p className="text-sm text-gray-600">{item.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Service Address</p>
                            <p className="font-semibold text-gray-900">{item.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Contact Number</p>
                            <p className="font-semibold text-gray-900">{item.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appliance Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                      <p className="text-sm text-gray-600 mb-1">Appliance: <span className="font-semibold text-gray-900">{item.appliance}</span></p>
                      <p className="text-sm text-gray-600">Issue: <span className="font-semibold text-gray-900">{item.issue}</span></p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center text-4xl">
                          {item.productIcon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-[#1E2F4F]">{item.product}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center space-x-1 ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {getStatusIcon(item.status)}
                              <span className="uppercase">{item.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Order ID: {item.id}</p>
                          <p className="text-sm text-gray-500">Ordered on {item.orderDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#1E2F4F]">₱{item.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-gray-100 pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-semibold text-gray-900">{item.quantity} item(s)</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Estimated Delivery</p>
                            <p className="font-semibold text-gray-900">{item.estimatedDelivery}</p>
                            {item.deliveredDate && (
                              <p className="text-sm text-green-600">Delivered: {item.deliveredDate}</p>
                            )}
                          </div>
                        </div>
                        {item.trackingNumber && (
                          <div className="flex items-start space-x-3">
                            <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Tracking Number</p>
                              <p className="font-semibold text-gray-900">{item.trackingNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Shipping Address</p>
                            <p className="font-semibold text-gray-900">{item.shippingAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <p className="font-semibold text-gray-900">{item.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-Order Info */}
                    {item.type === 'preorder' && (
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mt-4">
                        <p className="font-semibold text-purple-900 mb-2">Pre-Order Payment Details</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-purple-700">Down Payment (30%)</p>
                            <p className="font-bold text-purple-900">₱{item.downPayment.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-purple-700">Remaining Balance</p>
                            <p className="font-bold text-purple-900">₱{item.remainingBalance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
