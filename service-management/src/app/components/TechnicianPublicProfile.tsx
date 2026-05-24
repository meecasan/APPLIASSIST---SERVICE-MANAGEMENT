import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Award, CheckCircle, Phone, Mail, Calendar, Wrench, Clock, Shield, Zap } from 'lucide-react';

interface TechnicianPublicProfileProps {
  technician: any;
  onBookNow: (technician: any) => void;
  onBack: () => void;
}

const technicianData = {
  id: 1,
  name: 'Juan Carlos Santos',
  photo: '👨‍🔧',
  rating: 4.9,
  reviewCount: 342,
  yearsExperience: 8,
  certifications: ['TESDA Certified', 'Samsung Authorized', 'Daikin Specialist', 'Refrigeration Expert'],
  availability: 'Available Today',
  sameDayService: true,
  serviceArea: ['Quezon City', 'Makati', 'Manila', 'Pasig', 'San Juan'],
  startingFee: 599,
  completedJobs: 856,
  specializations: ['Air Conditioner', 'Refrigerator', 'Washing Machine'],
  verified: true,
  bio: 'Certified appliance repair technician with over 8 years of experience in Metro Manila. Specialized in cooling systems and major home appliances. Committed to providing quality service and customer satisfaction. Member of the Philippine Association of Appliance Technicians.',
  phoneNumber: '+63 912 345 6789',
  email: 'juan.santos@appliassist.ph',
  responseTime: '15 min avg',
  skills: [
    { name: 'Diagnosis & Troubleshooting', level: 95 },
    { name: 'Refrigeration Systems', level: 98 },
    { name: 'Electrical Repair', level: 92 },
    { name: 'Customer Service', level: 96 },
  ],
  reviews: [
    {
      id: 1,
      customerName: 'Maria Gonzales',
      rating: 5,
      date: 'May 8, 2026',
      comment: 'Excellent service! Fixed my AC within an hour. Very professional and knowledgeable. Highly recommend!',
      serviceType: 'Air Conditioner Repair',
    },
    {
      id: 2,
      customerName: 'Roberto Cruz',
      rating: 5,
      date: 'May 5, 2026',
      comment: 'Juan was punctual and did a great job repairing my refrigerator. He explained everything clearly and the price was very reasonable.',
      serviceType: 'Refrigerator Repair',
    },
    {
      id: 3,
      customerName: 'Anna Reyes',
      rating: 4,
      date: 'May 1, 2026',
      comment: 'Good service overall. The washing machine works perfectly now. Would hire again.',
      serviceType: 'Washing Machine Repair',
    },
    {
      id: 4,
      customerName: 'Carlos Mendoza',
      rating: 5,
      date: 'April 28, 2026',
      comment: 'Very satisfied with the service. Juan is an expert in his field. Fixed the problem quickly and efficiently.',
      serviceType: 'Air Conditioner Repair',
    },
  ],
  availability_calendar: [
    { date: 'May 13', day: 'Today', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
    { date: 'May 14', day: 'Tomorrow', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
    { date: 'May 15', day: 'Thursday', slots: ['9:00 AM', '12:00 PM', '2:00 PM', '5:00 PM'] },
  ],
  pricingDetails: [
    { service: 'Diagnostic Fee', price: '₱199' },
    { service: 'Air Conditioner Cleaning', price: '₱599 - ₱899' },
    { service: 'Refrigerator Repair', price: '₱799 - ₱1,499' },
    { service: 'Washing Machine Repair', price: '₱499 - ₱999' },
  ],
};

export default function TechnicianPublicProfile({ technician, onBookNow, onBack }: TechnicianPublicProfileProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reviews' | 'availability'>('overview');

  // Merge passed technician data with defaults
  const technicianData = {
    ...technician,
    serviceArea: Array.isArray(technician.serviceArea)
      ? technician.serviceArea
      : (technician.serviceArea || '').split(',').map(s => s.trim()).filter(Boolean),
    bio: technician.bio || 'Certified appliance repair technician with years of experience in Metro Manila. Committed to providing quality service and customer satisfaction.',
    phoneNumber: technician.phoneNumber || '+63 912 345 6789',
    email: technician.email || 'contact@appliassist.ph',
    skills: technician.skills || [
      { name: 'Diagnosis & Troubleshooting', level: 95 },
      { name: 'Refrigeration Systems', level: 98 },
      { name: 'Electrical Repair', level: 92 },
      { name: 'Customer Service', level: 96 },
    ],
    reviews: technician.reviews || [
      {
        id: 1,
        customerName: 'Maria Gonzales',
        rating: 5,
        date: 'May 8, 2026',
        comment: 'Excellent service! Very professional and knowledgeable. Highly recommend!',
        serviceType: 'Appliance Repair',
      },
      {
        id: 2,
        customerName: 'Roberto Cruz',
        rating: 5,
        date: 'May 5, 2026',
        comment: 'Great job! Explained everything clearly and the price was very reasonable.',
        serviceType: 'Appliance Repair',
      },
    ],
    availability_calendar: technician.availability_calendar || [
      { date: 'May 13', day: 'Today', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
      { date: 'May 14', day: 'Tomorrow', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
      { date: 'May 15', day: 'Thursday', slots: ['9:00 AM', '12:00 PM', '2:00 PM', '5:00 PM'] },
    ],
    pricingDetails: technician.pricingDetails || [
      { service: 'Diagnostic Fee', price: '₱199' },
      { service: 'Standard Repair', price: '₱599 - ₱1,499' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Enhanced Hero Header */}
      <div className="bg-gradient-to-br from-[#1E2F4F] to-[#2a4066] text-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Technicians</span>
          </button>

          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start space-x-6">
              {/* Large Profile Photo with Verification */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center text-7xl flex-shrink-0 relative shadow-2xl">
                {technicianData.photo}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {technicianData.name}
                  </h1>
                  {technicianData.verified && (
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-semibold">Verified Pro</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Rating Display */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-2xl font-bold">{technicianData.rating}</span>
                  </div>
                  <div className="h-6 w-px bg-white/30" />
                  <span className="text-white/90">({technicianData.reviewCount} reviews)</span>
                  <div className="h-6 w-px bg-white/30" />
                  <span className="text-white/90">{technicianData.completedJobs} jobs completed</span>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">{technicianData.yearsExperience} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Responds in {technicianData.responseTime}</span>
                  </div>
                  {technicianData.sameDayService && (
                    <div className="flex items-center space-x-2 bg-yellow-500 px-3 py-2 rounded-lg">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-semibold">Same-Day Service</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced CTA Card */}
            <div className="bg-white rounded-2xl p-6 w-full lg:w-96 flex-shrink-0 shadow-2xl">
              <div className="text-center mb-4">
                <p className="text-sm text-[#6B7280] mb-1">Starting From</p>
                <p className="text-5xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ₱{technicianData.startingFee}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">+ parts if needed</p>
              </div>
              <button
                onClick={() => onBookNow(technician)}
                className="w-full px-6 py-4 rounded-xl bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-semibold transition-all text-lg shadow-lg hover:shadow-xl mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Book This Technician
              </button>
              <p className="text-xs text-center text-green-600 font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ✓ {technicianData.availability}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex space-x-8">
            {(['overview', 'reviews', 'availability'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors capitalize ${
                  selectedTab === tab
                    ? 'border-[#1E2F4F] text-[#1E2F4F]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1E2F4F]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  About {technicianData.name.split(' ')[0]}
                </h2>
                <p className="text-[#6B7280] leading-relaxed text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {technicianData.bio}
                </p>
              </div>

              {/* Specializations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-3">
                  {technicianData.specializations.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E2F4F] rounded-xl border border-blue-200"
                    >
                      <Wrench className="w-5 h-5" />
                      <span className="font-semibold text-lg">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Skills & Expertise
                </h2>
                <div className="space-y-5">
                  {technicianData.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-3">
                        <span className="font-semibold text-gray-900 text-lg">{skill.name}</span>
                        <span className="text-[#1E2F4F] font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1E2F4F] to-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Service Pricing
                </h2>
                <div className="space-y-3">
                  {technicianData.pricingDetails.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{item.service}</span>
                      <span className="font-bold text-[#1E2F4F] text-lg">{item.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#6B7280] mt-4 italic">* Final price may vary based on actual repair needed</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Certifications & Licenses
                </h3>
                <div className="space-y-3">
                  {technicianData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                      <Award className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-green-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-gray-900">{technicianData.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-gray-900">{technicianData.email}</span>
                  </div>
                </div>
              </div>

              {/* Service Coverage */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Service Coverage Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technicianData.serviceArea.map((area, idx) => (
                    <span key={idx} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{area}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Customer Reviews
                </h2>
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-yellow-400 fill-current" />
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{technicianData.rating}</span>
                    <span className="text-[#6B7280]"> / 5.0</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {technicianData.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg mb-1">{review.customerName}</p>
                        <p className="text-sm text-[#6B7280]">{review.date}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#6B7280] mb-3 text-lg leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {review.comment}
                    </p>
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {review.serviceType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'availability' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Available Time Slots
              </h2>
              <div className="space-y-6">
                {technicianData.availability_calendar.map((day, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#1E2F4F] transition-colors">
                    <div className="flex items-center space-x-3 mb-5">
                      <Calendar className="w-6 h-6 text-[#1E2F4F]" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {day.day}
                        </h3>
                        <p className="text-sm text-[#6B7280]">{day.date}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {day.slots.map((slot, slotIdx) => (
                        <button
                          key={slotIdx}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-[#1E2F4F] hover:bg-blue-50 text-gray-900 font-semibold transition-all"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onBookNow(technician)}
                className="w-full mt-8 px-6 py-4 rounded-xl bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-semibold transition-all text-lg shadow-lg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Book This Technician
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
