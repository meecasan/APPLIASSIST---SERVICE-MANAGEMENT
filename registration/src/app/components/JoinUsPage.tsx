import React from 'react';
import { Wrench, CheckCircle, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface JoinUsPageProps {
  onNavigateToTechnicianApplication: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToAdminLogin?: () => void;
}

export function JoinUsPage({
  onNavigateToTechnicianApplication,
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToAdminLogin,
}: JoinUsPageProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
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

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToHome}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Hire a Pro
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-6 py-2 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-medium transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join Our Team
          </h1>
          <p className="text-xl text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Become part of our growing network of professionals
          </p>
        </div>

        {/* Application Type Cards */}
        <div className="flex justify-center">
          {/* Technician Card */}
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 hover:shadow-xl transition-shadow max-w-xl w-full">
            {/* Icon */}
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-10 h-10 text-[#1E2F4F]" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Apply as Technician
            </h2>

            {/* Description */}
            <p className="text-base text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Join our team of skilled technicians and provide repair services to customers
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-[#374151]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Flexible working hours
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-[#374151]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Competitive compensation
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-[#374151]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Access to service requests
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-[#374151]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Professional support
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onNavigateToTechnicianApplication}
              className="w-full px-6 py-4 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-medium text-lg transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Apply as Technician
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-gray-900 text-center mb-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Submit Application', desc: 'Fill out the online form' },
              { step: '2', title: 'Document Verification', desc: 'We verify your credentials' },
              { step: '3', title: 'Admin Approval', desc: 'Review within 3-5 days' },
              { step: '4', title: 'Start Earning', desc: 'Begin serving customers' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#1E2F4F] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.title}
                </h4>
                <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                    onClick={onNavigateToTechnicianApplication}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Become a Technician
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
    </div>
  );
}
