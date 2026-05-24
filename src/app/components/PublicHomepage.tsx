import React, { useState } from 'react';
import { Wrench, Star, CheckCircle, Clock, Award } from 'lucide-react';

interface PublicHomepageProps {
  onNavigateToServices?: () => void;
  onNavigateToJoinUs: () => void;
}

export function PublicHomepage({
  onNavigateToServices,
  onNavigateToJoinUs,
}: PublicHomepageProps) {
  const [services, setServices] = useState([
    { name: 'Air Conditioner', icon: '❄️', price: 599, rating: 4.8, reviews: 342, duration: '1-2 hrs', techCount: 48 },
    { name: 'Refrigerator', icon: '🧊', price: 799, rating: 4.9, reviews: 256, duration: '2-3 hrs', techCount: 52 },
    { name: 'Washing Machine', icon: '🧺', price: 499, rating: 4.7, reviews: 198, duration: '1-2 hrs', techCount: 45 },
    { name: 'Microwave', icon: '📻', price: 399, rating: 4.8, reviews: 124, duration: '1 hr', techCount: 38 },
    { name: 'Television', icon: '📺', price: 699, rating: 4.6, reviews: 167, duration: '2 hrs', techCount: 42 },
    { name: 'Electric Fan', icon: '💨', price: 299, rating: 4.9, reviews: 289, duration: '30 min', techCount: 56 },
  ]);


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#F9FAFB] py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Expert Appliance Repair<br />
                & Quality Parts<br />
                At Your Doorstep
              </h1>
              <p className="text-xl text-[#6B7280] mb-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Connect with certified technicians and shop authentic appliance parts—all in one platform
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={onNavigateToServices}
                  className="px-8 py-3 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-medium transition-all"
                >
                  Browse Services
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-8 text-sm text-[#6B7280]">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>500+ Technicians</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>10,000+ Parts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Column - Image Placeholder */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                <Wrench className="w-32 h-32 text-[#1E2F4F] opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section id="services" className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Popular Repair Services
            </h2>
            <p className="text-lg text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Book certified technicians for all your appliance needs
            </p>
          </div>

          {/* Service Cards Grid - Matching ServicesPage Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={onNavigateToServices}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
              >
                {/* Icon Header with Gradient */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 h-36 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#1E2F4F] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {service.icon}
                  </div>
                  <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full text-sm font-semibold text-[#1E2F4F] shadow-md">
                    {service.techCount} techs
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {service.name} Repair
                  </h3>

                  {/* Rating with Stars */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{service.rating}</span>
                    <span className="text-xs text-[#6B7280]">({service.reviews}+ reviews)</span>
                  </div>

                  {/* Service Info Grid */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280] flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>Starting Price</span>
                      </span>
                      <span className="font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{service.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280] flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Duration</span>
                      </span>
                      <span className="font-medium text-gray-900">{service.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280] flex items-center space-x-2">
                        <Wrench className="w-4 h-4" />
                        <span>Availability</span>
                      </span>
                      <span className="flex items-center space-x-1.5 text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Same Day</span>
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-4 py-3 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-medium transition-all group-hover:shadow-lg">
                    Find Technicians →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Banner */}
      <section className="py-16 px-8 bg-[#1E2F4F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white opacity-90 mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Join our network of professionals or book a service today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToJoinUs}
              className="px-8 py-3 rounded-lg bg-white text-[#1E2F4F] hover:bg-gray-100 font-medium transition-all"
            >
              Join as Technician
            </button>
            <button
              onClick={onNavigateToServices}
              className="px-8 py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium transition-all"
            >
              Browse Services
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}
