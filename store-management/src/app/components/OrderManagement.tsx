import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, ChevronDown, MapPin, Phone, User } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import { onOrderNew, offOrderNew, onOrderUpdated, offOrderUpdated } from '../services/realtime';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderDate: string;
  orderTime: string;
  status: 'pending' | 'accepted' | 'processing' | 'ready-for-pickup' | 'completed' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    address: string;
    initial: string;
  };
  items: OrderItem[];
  customerNotes?: string;
}

interface OrderManagementProps {
  isReadOnly?: boolean; // For technician role
}

export function OrderManagement({ isReadOnly = false }: OrderManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      orderDate: 'Oct 20, 2024',
      orderTime: '10:30 AM',
      status: 'pending',
      customer: {
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, Springfield, IL 62701',
        initial: 'JD'
      },
      items: [
        { id: '1', productName: 'Remote Carrier Small', quantity: 1, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=100&h=100&fit=crop' },
        { id: '2', productName: 'Carrier CHX Knob', quantity: 2, image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=100&h=100&fit=crop' }
      ],
      customerNotes: 'Please pack items carefully. Need by tomorrow.'
    },
    {
      id: 'ORD-002',
      orderDate: 'Oct 20, 2024',
      orderTime: '09:15 AM',
      status: 'processing',
      customer: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Avenue, Riverside, CA 92501',
        initial: 'JS'
      },
      items: [
        { id: '3', productName: 'Condura Knob', quantity: 3, image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=100&h=100&fit=crop' }
      ]
    },
    {
      id: 'ORD-003',
      orderDate: 'Oct 19, 2024',
      orderTime: '04:45 PM',
      status: 'completed',
      customer: {
        name: 'Robert Johnson',
        phone: '+1 (555) 246-8135',
        address: '789 Pine Road, Lakewood, NJ 08701',
        initial: 'RJ'
      },
      items: [
        { id: '4', productName: 'Gearcase 11T', quantity: 1, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop' },
        { id: '5', productName: 'Thermostat Y131', quantity: 1, image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=100&h=100&fit=crop' }
      ]
    },
    {
      id: 'ORD-004',
      orderDate: 'Oct 19, 2024',
      orderTime: '02:20 PM',
      status: 'cancelled',
      customer: {
        name: 'Emily Davis',
        phone: '+1 (555) 369-2580',
        address: '321 Elm Street, Portland, OR 97201',
        initial: 'ED'
      },
      items: [
        { id: '6', productName: 'Compressor Belt', quantity: 2, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop' }
      ],
      customerNotes: 'Changed mind. Please cancel order.'
    }
  ]);

  // Subscribe to real-time order updates
  useEffect(() => {
    const handleNew = ({ data }: any) => {
      setOrders(prev => [data, ...prev]);
    };
    const handleUpdate = ({ data }: any) => {
      setOrders(prev =>
        prev.map(o => o.id === data.order_id ? { ...o, status: data.status } : o)
      );
    };
    onOrderNew(handleNew);
    onOrderUpdated(handleUpdate);
    return () => {
      offOrderNew(handleNew);
      offOrderUpdated(handleUpdate);
    };
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Accepted
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Processing
          </span>
        );
      case 'ready-for-pickup':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Ready for Pickup
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing orders...');
    // Add refresh logic here
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReceiptSent = (orderId: string) => {
    // Update order status to accepted when receipt is sent
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'accepted' as const } : order
      )
    );
  };

  const handleStartProcessing = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'processing' as const } : order
      )
    );
  };

  const handleMarkReadyForPickup = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'ready-for-pickup' as const } : order
      )
    );
  };

  const handleMarkAsPickedUp = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      )
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Order Management
        </h1>
        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Review and manage incoming orders
        </p>
      </div>

      {/* Top Control Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or order ID..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '14px' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '14px' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="processing">Processing</option>
              <option value="ready-for-pickup">Ready for Pickup</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '14px' }}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List - Card-Based */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              No orders found matching your criteria.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Order Card Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {order.id}
                  </h3>
                  <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {order.orderDate} • {order.orderTime}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Order Card Body */}
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Left Section - Customer & Items */}
                  <div className="flex-1 space-y-6">
                    {/* Customer Information Block */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Customer Information
                      </h4>
                      <div className="flex items-start gap-3">
                        {/* Customer Avatar */}
                        <div className="w-12 h-12 bg-[#1E2F4F] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {order.customer.initial}
                          </span>
                        </div>
                        
                        {/* Customer Details */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {order.customer.name}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              <Phone className="w-4 h-4" />
                              <span>{order.customer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{order.customer.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Block */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {/* Product Thumbnail */}
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                {item.productName}
                              </p>
                              <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Order Summary */}
                  <div className="w-80 flex-shrink-0">
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Order Summary
                      </h4>
                      
                      {/* Items List */}
                      <div className="space-y-2 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            <span className="text-[#6B7280]">
                              {item.productName} ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Start Processing Button - Only for accepted orders */}
                        {!isReadOnly && order.status === 'accepted' && (
                          <button
                            className="w-full px-4 py-3 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleStartProcessing(order.id)}
                          >
                            Start Processing
                          </button>
                        )}

                        {/* Mark Ready for Pickup Button - Only for processing orders */}
                        {!isReadOnly && order.status === 'processing' && (
                          <button
                            className="w-full px-4 py-3 bg-[#8B5CF6] text-white rounded-lg text-sm font-medium hover:bg-[#7C3AED] transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMarkReadyForPickup(order.id)}
                          >
                            Mark Ready for Pickup
                          </button>
                        )}

                        {/* Mark as Picked Up Button - Only for ready-for-pickup orders */}
                        {!isReadOnly && order.status === 'ready-for-pickup' && (
                          <button
                            className="w-full px-4 py-3 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMarkAsPickedUp(order.id)}
                          >
                            Mark as Picked Up
                          </button>
                        )}

                        {/* View Full Details Button */}
                        <button
                          className="w-full px-4 py-3 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-colors"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                          onClick={() => handleViewDetails(order)}
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Notes (Optional) */}
                {order.customerNotes && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-yellow-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Customer Notes:
                      </span>
                      <p className="text-sm text-yellow-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {order.customerNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
        isReadOnly={isReadOnly}
        onReceiptSent={handleReceiptSent}
        onStartProcessing={handleStartProcessing}
      />
    </div>
  );
}