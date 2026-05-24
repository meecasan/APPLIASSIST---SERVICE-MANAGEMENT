import React, { useState, useEffect } from 'react';
import { Users, Shield, Clock, Star, ChevronDown, Wrench } from 'lucide-react';
import { onOrderUpdated, offOrderUpdated, onServiceUpdated, offServiceUpdated } from '../services/realtime';

interface CustomerDashboardProps {
  userEmail: string;
  onNavigateToServices: () => void;
  onNavigateToPartsMarketplace: () => void;
  onLogout: () => void;
  onNavigateToAdminLogin?: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToCart?: () => void;
  onNavigateToProfile?: () => void;
}

export function CustomerDashboard({
  userEmail,
  onNavigateToServices,
  onNavigateToPartsMarketplace,
  onLogout,
  onNavigateToAdminLogin,
  onNavigateToOrders,
  onNavigateToCart,
  onNavigateToProfile,
}: CustomerDashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // State for tracking customer's orders and services
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [customerServices, setCustomerServices] = useState<any[]>([]);

  // Subscribe to real-time order and service updates
  useEffect(() => {
    const handleOrderUpdated = (order: any) => {
      setCustomerOrders((prev) =>
        prev.map((o) => o.id === order.order_id ? { ...o, status: order.status } : o)
      );
    };

    const handleServiceUpdated = (service: any) => {
      setCustomerServices((prev) =>
        prev.map((s) => s.id === service.service_request_id ? { ...s, status: service.status } : s)
      );
    };

    onOrderUpdated(handleOrderUpdated);
    onServiceUpdated(handleServiceUpdated);

    return () => {
      offOrderUpdated(handleOrderUpdated);
      offServiceUpdated(handleServiceUpdated);
    };
  }, []);

  const services = [
    {
      id: 1,
      name: 'Air Conditioner Repair',
      icon: '❄️',
      badge: 'All Brands',
      rating: 4.8,
      reviews: 1250,
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      name: 'Refrigerator Repair',
      icon: '🧊',
      badge: '52 Techs',
      rating: 4.9,
      reviews: 980,
      bgColor: 'bg-cyan-50',
    },
    {
      id: 3,
      name: 'Washing Machine Repair',
      icon: '🧺',
      badge: '45 Techs',
      rating: 4.7,
      reviews: 875,
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  A
                </span>
              </div>
              <span className="text-lg font-bold text-[#1E2F4F] tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
                APPLIASSIST
              </span>
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <button className="text-gray-900 font-medium hover:text-[#1E2F4F] transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Home
              </button>
              <button
                onClick={onNavigateToServices}
                className="text-gray-600 font-medium hover:text-[#1E2F4F] transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Services
              </button>
              <button className="text-gray-600 font-medium hover:text-[#1E2F4F] transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Contact
              </button>
            </div>

            {/* Right Side - Bookings & User Menu */}
            <div className="flex items-center space-x-6">
              <button
                onClick={onNavigateToOrders}
                className="text-gray-900 font-medium hover:text-[#1E2F4F] transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Bookings
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {userEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* User Name */}
                  <span className="text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {userEmail.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onNavigateToProfile) {
                          onNavigateToProfile();
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 relative overflow-hidden">
        {/* Background Icon */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
          <Wrench className="w-64 h-64 text-[#1E5EFF]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-[#1E2F4F] mb-4 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Expert Appliance Repair<br />& Quality Parts<br />At Your Doorstep
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Connect with certified technicians and shop authentic appliance<br />parts—all in one platform
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4 mb-10">
              <button
                onClick={onNavigateToServices}
                className="px-8 py-3.5 bg-[#1E2F4F] text-white rounded-lg font-semibold hover:bg-[#2a4066] transition-colors shadow-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Browse Services
              </button>
            </div>

            {/* Feature Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  500+ Technicians
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Satisfaction Guar.
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Repair Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E2F4F] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Popular Repair Services
            </h2>
            <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Book certified technicians for all your appliance needs
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center text-3xl`}>
                    {service.icon}
                  </div>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {service.badge}
                  </span>
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-semibold text-[#1E2F4F] mb-3 group-hover:text-[#1E5EFF] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {service.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {service.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    ({service.reviews} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E2F4F] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#1E2F4F] font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    A
                  </span>
                </div>
                <span className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  APPLIASSIST
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Your trusted platform for appliance repair services and genuine parts.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToServices}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToPartsMarketplace}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Parts Marketplace
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    FAQs
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Contact Us
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <li>Email: support@appliassist.ph</li>
                <li>Phone: +63 917 123 4567</li>
                <li>Address: Naga City, Philippines</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-600 pt-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                © 2026 APPLIASSIST. All rights reserved.
              </p>
              {onNavigateToAdminLogin && (
                <button
                  onClick={onNavigateToAdminLogin}
                  className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  (Admin)
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
