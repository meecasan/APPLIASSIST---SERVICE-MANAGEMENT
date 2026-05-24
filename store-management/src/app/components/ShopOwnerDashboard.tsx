import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package2, Database, Users } from 'lucide-react';
import type { User as UserType } from '../App';
import { ShopOwnerNavbar } from './ShopOwnerNavbar';
import { ProductsManagement } from './ProductsManagement';
import { OrderManagement } from './OrderManagement';
import { CompanyProfile } from './CompanyProfile';
import { ShopOrderRequests } from './ShopOrderRequests';
import { ShopSchedule } from './ShopSchedule';
import { ShopServicesOffered } from './ShopServicesOffered';
import { onOrderNew, offOrderNew, onOrderUpdated, offOrderUpdated, onStockUpdated, offStockUpdated } from '../services/realtime';

interface ShopOwnerDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export function ShopOwnerDashboard({ user, onLogout }: ShopOwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'profile' | 'requests' | 'schedule' | 'services'>('dashboard');

  // Feature flag: Enable services if shop offers repair/installation services
  const [hasServices, setHasServices] = useState(true); // Set to true to enable service features

  // State for real-time order updates
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', product: 'Refrigerator Compressor', amount: 450, status: 'completed', date: 'Jan 6, 2026' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Washing Machine Belt', amount: 85, status: 'processing', date: 'Jan 6, 2026' },
    { id: 'ORD-003', customer: 'Bob Johnson', product: 'Dryer Heating Element', amount: 120, status: 'pending', date: 'Jan 5, 2026' },
  ]);

  // Mock data for shop owner - converted to state for real-time updates
  const [stats, setStats] = useState({
    totalRevenue: 45230,
    totalOrders: 156,
    activeProducts: 48,
    lowStock: 12,
  });

  const topProducts = [
    { id: 1, name: 'Refrigerator Compressor', sold: 45, revenue: 20250, stock: 12 },
    { id: 2, name: 'Washing Machine Motor', sold: 38, revenue: 11400, stock: 8 },
    { id: 3, name: 'Oven Heating Element', sold: 32, revenue: 9600, stock: 15 },
  ];

  const [stockAlerts, setStockAlerts] = useState([
    { id: 1, product: 'Dishwasher Pump', currentStock: 3, minStock: 10, status: 'critical' },
    { id: 2, product: 'AC Filter', currentStock: 7, minStock: 15, status: 'low' },
    { id: 3, product: 'Dryer Belt', currentStock: 12, minStock: 20, status: 'low' },
  ]);

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Subscribe to real-time order updates
  useEffect(() => {
    const handleOrderNew = (order: any) => {
      setRecentOrders((prev) => [
        { id: order.order_id, customer: '', product: '', amount: order.total_amount, status: order.status, date: new Date().toLocaleDateString() },
        ...prev
      ]);
      setStats(prev => ({ ...prev, totalOrders: prev.totalOrders + 1 }));
    };

    const handleOrderUpdated = (order: any) => {
      setRecentOrders((prev) =>
        prev.map((o) => o.id === order.order_id ? { ...o, status: order.status } : o)
      );
    };

    const handleStockUpdate = ({ data }: any) => {
      setStockAlerts((prev) =>
        prev.map((p) => p.id === data.product_id ? { ...p, currentStock: data.stock_quantity ?? p.currentStock } : p)
      );
    };

    onOrderNew(handleOrderNew);
    onOrderUpdated(handleOrderUpdated);
    onStockUpdated(handleStockUpdate);

    return () => {
      offOrderNew(handleOrderNew);
      offOrderUpdated(handleOrderUpdated);
      offStockUpdated(handleStockUpdate);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar Navbar */}
      <ShopOwnerNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={user.email}
        onLogout={onLogout}
        hasServices={hasServices}
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
                  Welcome back! Here's your store overview
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Total Orders
                    </h3>
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.totalOrders}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    This month
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Active Products
                    </h3>
                    <Package2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.activeProducts}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    In inventory
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Low Stock Alert
                    </h3>
                    <Database className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stats.lowStock}
                  </p>
                  <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Items need restock
                  </p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Recent Orders
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {order.customer}
                            </p>
                            <p className="text-sm text-[#6B7280] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {order.product}
                            </p>
                            <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              ₱{order.amount}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Top Products
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {product.name}
                            </p>
                            <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {product.sold} units sold
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              ₱{product.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrderManagement />
          )}

          {activeTab === 'products' && (
            <ProductsManagement isReadOnly={false} />
          )}

          {activeTab === 'requests' && hasServices && (
            <ShopOrderRequests />
          )}

          {activeTab === 'schedule' && hasServices && (
            <ShopSchedule />
          )}

          {activeTab === 'services' && hasServices && (
            <ShopServicesOffered />
          )}

          {activeTab === 'profile' && (
            <CompanyProfile
              onBack={() => setActiveTab('dashboard')}
              onServiceAvailabilityChange={setHasServices}
            />
          )}
        </main>
      </div>
    </div>
  );
}