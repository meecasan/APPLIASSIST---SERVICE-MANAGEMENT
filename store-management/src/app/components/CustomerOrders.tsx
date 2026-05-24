import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { onOrderUpdated, offOrderUpdated } from '../services/realtime';

interface Booking {
  id: string;
  reference: string;
  technicianName: string;
  applianceType: string;
  problemDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Canceled';
  address: string;
  contactNumber: string;
  createdAt: string;
  totalAmount: number;
}

interface CustomerOrdersProps {
  userEmail: string;
  bookings: Booking[];
  onNavigateToServices: () => void;
}

export function CustomerOrders({
  userEmail,
  bookings,
  onNavigateToServices,
}: CustomerOrdersProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [liveOrders, setLiveOrders] = useState(bookings ?? []);

  useEffect(() => {
    const handle = ({ data }: any) => {
      setLiveOrders(prev =>
        prev.map(o => o.id === data.order_id ? { ...o, ...data } : o)
      );
    };
    onOrderUpdated(handle);
    return () => offOrderUpdated(handle);
  }, []);

  const filteredBookings = filterStatus === 'All'
    ? liveOrders
    : liveOrders.filter(b => b.status === filterStatus);

  const statusConfig = {
    'Pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    'Confirmed': { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Confirmed' },
    'In Progress': { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' },
    'Completed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
    'Canceled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Canceled' },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Orders
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
            View and track all your service bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-4 mb-6 border-b border-gray-200">
          {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Canceled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
                filterStatus === status
                  ? 'border-[#1E2F4F] text-[#1E2F4F]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No orders found
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {filterStatus === 'All'
                ? "You haven't made any bookings yet. Browse our services to get started!"
                : `No ${filterStatus.toLowerCase()} orders at the moment.`}
            </p>
            {filterStatus === 'All' && (
              <button
                onClick={onNavigateToServices}
                className="px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Browse Services
              </button>
            )}
          </div>
        )}

        {/* Orders List */}
        {filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusConfig[booking.status].icon;

              return (
                <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {booking.applianceType} Repair
                        </h3>
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[booking.status].bg} ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig[booking.status].label}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Reference: <span className="font-medium text-gray-900">{booking.reference}</span>
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Technician: <span className="font-medium text-gray-900">{booking.technicianName}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{booking.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        SCHEDULED DATE & TIME
                      </p>
                      <p className="text-sm text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {booking.scheduledDate} at {booking.scheduledTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        PROBLEM
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {booking.problemDescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        ADDRESS
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {booking.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        CONTACT
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {booking.contactNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Booked on {booking.createdAt}
                    </p>
                    <button
                      className="px-4 py-2 text-sm text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-[#1E2F4F] hover:text-white transition-colors font-medium"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
