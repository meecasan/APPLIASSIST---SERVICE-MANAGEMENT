import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Award, Clock, CheckCircle, Filter, Zap, Shield, ThumbsUp, Loader2 } from 'lucide-react';
import { catalogAPI } from '../services/api';

interface TechnicianMarketplaceProps {
  category: string;
  onSelectTechnician: (technician: any) => void;
  onBookNow: (technician: any) => void;
  onBack: () => void;
}

interface TechnicianCard {
  id: number;
  technician_id: number;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  certifications: string[];
  availability: string;
  sameDayService: boolean;
  serviceArea: string;
  startingFee: number;
  completedJobs: number;
  specializations: string[];
  verified: boolean;
  responseTime: string;
  email: string;
  contactNumber: string;
  services: any[];
}

export default function TechnicianMarketplace({ category, onSelectTechnician, onBookNow, onBack }: TechnicianMarketplaceProps) {
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<TechnicianCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch technicians from database filtered by category
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch services for this category from the catalog API
        const response = await catalogAPI.getServicesByCategory(category);
        console.log("MARKETPLACE RAW RESPONSE:", response);

        const data = (response as any)?.data || response;
        console.log("MARKETPLACE ACTUAL DATA:", data);

        const servicesList = Array.isArray(data) ? data : [];

        // Group services by technician_id to build technician cards
        const techMap: Record<number, {
          technician_id: number;
          first_name: string;
          last_name: string;
          specialization: string;
          service_area: string;
          email: string;
          contact_number: string;
          services: any[];
          minPrice: number;
        }> = {};

        servicesList.forEach((service: any) => {
          const techId = service.technician_id;
          if (!techMap[techId]) {
            techMap[techId] = {
              technician_id: techId,
              first_name: service.first_name || '',
              last_name: service.last_name || '',
              specialization: service.specialization || '',
              service_area: service.service_area || '',
              email: service.email || '',
              contact_number: service.contact_number || '',
              services: [],
              minPrice: Infinity,
            };
          }
          techMap[techId].services.push(service);
          const price = parseFloat(service.starting_price) || 0;
          if (price > 0 && price < techMap[techId].minPrice) {
            techMap[techId].minPrice = price;
          }
        });

        // Transform into TechnicianCard format
        const transformedTechnicians: TechnicianCard[] = Object.values(techMap).map((tech) => {
          // Build specializations list from all services
          const specs = [...new Set(tech.services.map((s: any) => s.category || s.service_type).filter(Boolean))];

          return {
            id: tech.technician_id,
            technician_id: tech.technician_id,
            name: `${tech.first_name} ${tech.last_name}`.trim() || 'Technician',
            photo: '👨‍🔧',
            rating: 4.8, // Will come from reviews table in the future
            reviewCount: 0,
            yearsExperience: 0,
            certifications: tech.specialization
              ? tech.specialization.split(',').map((s: string) => s.trim()).filter(Boolean)
              : [],
            availability: 'Available',
            sameDayService: true,
            serviceArea: tech.service_area || 'Service area not specified',
            startingFee: tech.minPrice === Infinity ? 0 : tech.minPrice,
            completedJobs: 0,
            specializations: specs.length > 0 ? specs : [category],
            verified: true,
            responseTime: '~30 min',
            email: tech.email,
            contactNumber: tech.contact_number || '',
            services: tech.services,
          };
        });

        console.log("MARKETPLACE TECHNICIANS:", transformedTechnicians);
        setTechnicians(transformedTechnicians);
      } catch (err) {
        console.error('Failed to load technicians:', err);
        setError('Failed to load technicians. Please try again.');
        setTechnicians([]);
      } finally {
        setLoading(false);
      }
    };

    loadTechnicians();
  }, [category]);

  const filteredTechnicians = technicians.filter(tech => {
    if (selectedAvailability === 'today') return tech.sameDayService;
    if (selectedAvailability === 'tomorrow') return !tech.sameDayService;
    return true;
  });

  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'price-low': return a.startingFee - b.startingFee;
      case 'price-high': return b.startingFee - a.startingFee;
      case 'experience': return b.yearsExperience - a.yearsExperience;
      case 'jobs': return b.completedJobs - a.completedJobs;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1E2F4F] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Services</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {category} Technicians
              </h1>
              <p className="text-lg text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {loading
                  ? 'Loading technicians...'
                  : `${sortedTechnicians.length} technician${sortedTechnicians.length !== 1 ? 's' : ''} available`}
              </p>
            </div>

            {/* Quick Availability Filter Pills */}
            <div className="flex gap-2">
              {[
                { value: 'all' as const, label: 'All' },
                { value: 'today' as const, label: 'Today', icon: Zap },
                { value: 'tomorrow' as const, label: 'Tomorrow' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedAvailability(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    selectedAvailability === option.value
                      ? 'bg-[#1E2F4F] text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E2F4F]'
                  }`}
                >
                  {option.icon && <option.icon className="w-4 h-4" />}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters and Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Only</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{technicians.filter(t => t.sameDayService).length} Same-Day Available</span>
              </div>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] bg-white cursor-pointer font-medium"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
              <option value="experience">Most Experienced</option>
              <option value="jobs">Most Jobs Completed</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#1E2F4F] animate-spin mb-4" />
            <p className="text-lg text-[#6B7280] font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Finding {category} technicians...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-medium text-lg mb-2">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedTechnicians.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No Technicians Found
            </h3>
            <p className="text-[#6B7280] text-lg mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              No technicians are currently offering {category} services. Check back later!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] font-semibold transition-all"
            >
              Browse Other Services
            </button>
          </div>
        )}

        {/* Technician Cards Grid */}
        {!loading && !error && sortedTechnicians.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedTechnicians.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-5 mb-5">
                    {/* Profile Photo */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      {tech.photo}
                      {tech.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Name, Rating, and Badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {tech.name}
                          </h3>
                          <div className="flex items-center space-x-2 flex-wrap gap-1">
                            {tech.sameDayService && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>Same Day</span>
                              </span>
                            )}
                            {tech.verified && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <Shield className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating Display */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(tech.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-900">{tech.rating}</span>
                        {tech.reviewCount > 0 && (
                          <span className="text-sm text-[#6B7280]">({tech.reviewCount} reviews)</span>
                        )}
                      </div>

                      {/* Experience Badge */}
                      <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">
                          {tech.services.length} service{tech.services.length !== 1 ? 's' : ''} offered
                          {tech.completedJobs > 0 ? ` • ${tech.completedJobs} jobs` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certifications / Specialization */}
                  {tech.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {tech.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-200"
                        >
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Specializations */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.specializations.map((spec, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info Grid with Icons */}
                  <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Service Area</p>
                        <p className="text-sm text-gray-900 font-medium">{tech.serviceArea}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Clock className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Availability</p>
                        <p className="text-sm text-green-600 font-semibold">{tech.availability}</p>
                        <p className="text-xs text-[#6B7280]">Responds in {tech.responseTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and CTAs */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Starting Fee</p>
                      <p className="text-3xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{tech.startingFee.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onSelectTechnician(tech)}
                        className="px-5 py-3 rounded-lg border-2 border-[#1E2F4F] text-[#1E2F4F] hover:bg-[#1E2F4F] hover:text-white font-semibold transition-all"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => onBookNow(tech)}
                        className="px-5 py-3 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-semibold transition-all shadow-md hover:shadow-lg"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
