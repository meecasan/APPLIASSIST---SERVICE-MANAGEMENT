import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, X, ChevronDown } from 'lucide-react';

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  onNavigateToHome: () => void;
  onNavigateToServices: () => void;
  onNavigateToPartsMarketplace: () => void;
  onNavigateToLogin: () => void;
  onNavigateToJoinUs: () => void;
  onNavigateToContact?: () => void;
  onLogin?: (email: string, password: string) => { success: boolean; message: string };
  onNavigateToCreateAccount?: () => void;
  onNavigateToAdminLogin?: () => void;
  currentPage?: 'home' | 'services' | 'parts' | 'contact';
  isLoggedIn?: boolean;
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToCart?: () => void;
  onNavigateToProfile?: () => void;
}

export function MarketplaceLayout({
  children,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToPartsMarketplace,
  onNavigateToLogin,
  onNavigateToJoinUs,
  onNavigateToContact,
  onLogin,
  onNavigateToCreateAccount,
  onNavigateToAdminLogin,
  currentPage = 'home',
  isLoggedIn = false,
  userEmail,
  userName,
  onLogout,
  onNavigateToOrders,
  onNavigateToCart,
  onNavigateToProfile,
}: MarketplaceLayoutProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setLoginStep('email');
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginStep('email');
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setLoginStep('password');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (onLogin) {
      const result = onLogin(email, password);
      if (result.success) {
        handleCloseLoginModal();
      } else {
        setError(result.message);
      }
    }
  };

  const handleBackToEmail = () => {
    setLoginStep('email');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button onClick={onNavigateToHome} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1E2F4F] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              APPLIASSIST
            </span>
          </button>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onNavigateToHome}
              className={`font-medium transition-colors ${
                currentPage === 'home' ? 'text-[#1E2F4F]' : 'text-[#6B7280] hover:text-[#1E2F4F]'
              }`}
            >
              Home
            </button>
            <button
              onClick={onNavigateToServices}
              className={`font-medium transition-colors ${
                currentPage === 'services' ? 'text-[#1E2F4F]' : 'text-[#6B7280] hover:text-[#1E2F4F]'
              }`}
            >
              Services
            </button>
            <button
              onClick={onNavigateToContact}
              className={`font-medium transition-colors ${
                currentPage === 'contact' ? 'text-[#1E2F4F]' : 'text-[#6B7280] hover:text-[#1E2F4F]'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Side - Dynamic based on login state */}
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                {/* Guest Buttons */}
                <button
                  onClick={onNavigateToJoinUs}
                  className="px-6 py-2 rounded-lg border-2 border-[#1E2F4F] text-[#1E2F4F] hover:bg-[#1E2F4F] hover:text-white font-medium transition-all"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Join Us
                </button>
                <button
                  onClick={handleOpenLoginModal}
                  className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-all"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                {/* Logged-in Items */}
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
                        {(userName || userEmail?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* User Name */}
                    <span className="text-gray-900 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {userName || userEmail?.split('@')[0]}
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
                          if (onLogout) {
                            onLogout();
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Main Content Area */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#101828] text-white mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* About Section */}
            <div>
              <div className="flex items-center space-x-2 mb-5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#1E2F4F] font-semibold">A</span>
                </div>
                <span className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  APPLIASSIST
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Your trusted platform for appliance services and genuine parts in Naga City.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={onNavigateToHome}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Home
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
                  <button
                    onClick={onNavigateToJoinUs}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Join Us
                  </button>
                </li>
              </ul>
            </div>

            {/* For Professionals */}
            <div>
              <h3 className="font-semibold mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                For Professionals
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={onNavigateToJoinUs}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Become a Technician
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToJoinUs}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Partner Shop
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Contact Us
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    +63 917 123 4567
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    support@appliassist.ph
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Naga City, Camarines Sur
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
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
              <div className="flex items-center space-x-5">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-opacity-20 bg-[#0000004d]">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-[500px] px-10 py-12 relative my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseLoginModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Log in or create account
              </h1>
              <p className="text-[#6B7280] text-base leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Book trusted appliance repair services and order genuine parts from certified professionals.
              </p>
            </div>

            {/* Email Step */}
            {loginStep === 'email' && (
              <form onSubmit={handleEmailContinue} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    required
                    autoFocus
                  />
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-semibold transition-all bg-[#1E5EFF] text-white hover:bg-[#1850E0] shadow-sm"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Continue
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      or
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons (UI Only) */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Continue with Facebook</span>
                  </button>

                  
                </div>

                {/* Professional Link */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseLoginModal();
                      onNavigateToJoinUs();
                    }}
                    className="text-sm text-[#1E2F4F] hover:underline font-medium transition-colors"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Are you a service professional? Sign in here
                  </button>
                </div>
              </form>
            )}

            {/* Password Step */}
            {loginStep === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Email Display */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Signing in as
                    </p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Change
                  </button>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="modal-password" className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="modal-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700" style={{ fontFamily: 'Manrope, sans-serif' }}>{error}</p>
                  </div>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-semibold transition-all bg-[#1E5EFF] text-white hover:bg-[#1850E0] shadow-sm"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Sign In
                </button>

                {/* Create Account Link */}
                <div className="text-center pt-2">
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseLoginModal();
                        if (onNavigateToCreateAccount) {
                          onNavigateToCreateAccount();
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
