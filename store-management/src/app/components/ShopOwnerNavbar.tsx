import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package2, User, LogOut, ClipboardList, Calendar, Wrench, Bell } from 'lucide-react';
import { onNotificationNew, offNotificationNew } from '../services/realtime';

interface ShopOwnerNavbarProps {
  activeTab: 'dashboard' | 'orders' | 'products' | 'profile' | 'requests' | 'schedule' | 'services';
  onTabChange: (tab: 'dashboard' | 'orders' | 'products' | 'profile' | 'requests' | 'schedule' | 'services') => void;
  userEmail: string;
  onLogout: () => void;
  hasServices?: boolean;
}

export function ShopOwnerNavbar({ activeTab, onTabChange, userEmail, onLogout, hasServices = false }: ShopOwnerNavbarProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Subscribe to real-time notifications
  useEffect(() => {
    const handleNotificationNew = (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    onNotificationNew(handleNotificationNew);

    return () => {
      offNotificationNew(handleNotificationNew);
    };
  }, []);

  const baseNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'products' as const, label: 'Products', icon: Package2 },
  ];

  const serviceNavItems = [
    { id: 'requests' as const, label: 'Order Requests', icon: ClipboardList },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { id: 'services' as const, label: 'Categories', icon: Wrench },
  ];

  const profileNavItem = { id: 'profile' as const, label: 'Profile', icon: User };

  const navItems = hasServices
    ? [...baseNavItems, ...serviceNavItems, profileNavItem]
    : [...baseNavItems, profileNavItem];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">A</span>
          </div>
          <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            APPLIASSIST
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1E2F4F] text-white'
                      : 'text-gray-700 hover:bg-[#1E2F4F] hover:text-white'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px' }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {userEmail}
          </p>
          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Store Owner
          </p>
        </div>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', marginBottom: '8px' }}>
          <button 
            onClick={() => { setShowNotifications(p => !p); setUnreadCount(0); }}
            style={{
              position: 'relative',
              width: '100%',
              padding: '10px 12px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              marginBottom: '8px'
            }}
          >
            <span>🔔 Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && notifications.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              width: '100%',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '8px'
            }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600 }}>{n.notification_type || 'Notification'}</div>
                  <div style={{ color: '#6b7280', marginTop: '4px' }}>{n.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
