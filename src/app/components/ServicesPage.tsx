import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Wrench, ArrowLeft, Star, MapPin, Award, Clock, ChevronDown, Filter, X } from 'lucide-react';
import { catalogAPI } from '../services/api';

interface ServicesPageProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

interface ServiceCategory {
  name: string;
  techCount: number;
  avgPrice: string;
  duration: string;
  icon: string;
  rating: number;
}

export default function ServicesPage({ onSelectCategory, onBack }: ServicesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);

  // Filter states
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState<'all' | 'today' | 'tomorrow' | 'this-week'>('all');
  const [experienceLevel, setExperienceLevel] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');
  const [serviceType, setServiceType] = useState<string[]>([]);

  const categories = ['All Services', 'Kitchen', 'Laundry', 'Climate Control', 'Entertainment'];
  const serviceTypes = ['Diagnosis', 'Repair', 'Maintenance', 'Installation', 'Replacement'];

  // Iconmap for different appliances
  const iconMap: Record<string, string> = {
    'Air Conditioner': '❄️',
    'Refrigerator': '🧊',
    'Washing Machine': '🧺',
    'Microwave': '📻',
    'Television': '📺',
    'Electric Fan': '💨',
    'Oven': '🔥',
    'Dishwasher': '🍽️',
    'Water Heater': '💧',
    'Vacuum Cleaner': '🧹',
    'Coffee Maker': '☕',
    'Rice Cooker': '🍚',
  };

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        // Fix #1: Handle both Axios-style (.data) and direct array responses
        const response = await catalogAPI.getAllServices();
        console.log("FULL RESPONSE:", response);

        const data = (response as any)?.data || response;
        console.log("ACTUAL DATA:", data);

        // Fix #2: Safely guard against non-array data before iterating
        const servicesList = Array.isArray(data) ? data : [];

        // Group services by category/type and compute stats based on actual DB records
        const categoryMap: Record<string, { count: number; services: any[]; totalBasePrice: number }> = {};

        servicesList.forEach((service: any) => {
          // Fix #4: Resolve category name using a reliable fallback chain
          const categoryName =
            service.category ||
            service.appliance_type ||
            service.service_type ||
            service.service_name ||
            'Other';

          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = { count: 0, services: [], totalBasePrice: 0 };
          }
          categoryMap[categoryName].count++;
          categoryMap[categoryName].services.push(service);

          // Fix #5: Parse starting_price directly
          const price = parseFloat(service.starting_price) || 0;
          categoryMap[categoryName].totalBasePrice += price;
        });

        // Fix #3: Renamed from 'categories' to 'transformedCategories' to avoid shadowing
        const transformedCategories = Object.entries(categoryMap).map(([name, info]) => {
          const avgPriceNum = info.count > 0 ? (info.totalBasePrice / info.count).toFixed(0) : 0;

          let commonDuration = '1-2 hrs';
          if (info.services.length > 0) {
            const firstService = info.services[0];
            const durationVal = firstService.duration;
            if (durationVal) {
              if (typeof durationVal === 'number' || !isNaN(Number(durationVal))) {
                commonDuration = `${durationVal} hr${Number(durationVal) > 1 ? 's' : ''}`;
              } else {
                commonDuration = String(durationVal);
              }
            }
          }

          return {
            name,
            techCount: info.count,
            avgPrice: `₱${avgPriceNum}`,
            duration: commonDuration,
            icon: iconMap[name] || '🔧',
            rating: 4.8,
          };
        });

        // Fix #6: Debug log for final transformed categories
        console.log("FINAL CATEGORIES:", transformedCategories);

        // Fix #7 & #8: Use live database data; no fallback when API succeeds
        setServiceCategories(transformedCategories);
      } catch (err) {
        console.error('Failed to load services:', err);
        // Keep fallback ONLY if API fails completely
        setServiceCategories(getDefaultCategories());
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const getDefaultCategories = (): ServiceCategory[] => [
    { name: 'Air Conditioner', techCount: 0, avgPrice: '₱599', duration: '1-2 hrs', icon: '❄️', rating: 4.8 },
    { name: 'Refrigerator', techCount: 0, avgPrice: '₱799', duration: '2-3 hrs', icon: '🧊', rating: 4.9 },
    { name: 'Washing Machine', techCount: 0, avgPrice: '₱499', duration: '1-2 hrs', icon: '🧺', rating: 4.7 },
    { name: 'Microwave', techCount: 0, avgPrice: '₱399', duration: '1 hr', icon: '📻', rating: 4.8 },
  ];

  const searchSuggestions = [
    'Air conditioner not cooling',
    'Refrigerator repair near me',
    'Washing machine repair',
    'Microwave not heating',
    'TV screen repair',
    'Electric fan noise',
  ];

  const filteredServices = serviceCategories.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = service.rating >= minRating;
    return matchesSearch && matchesRating;
  });

  const filteredSuggestions = searchSuggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleServiceType = (type: string) => {
    setServiceType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setMinRating(0);
    setAvailability('all');
    setExperienceLevel('all');
    setServiceType([]);
  };

  const activeFiltersCount =
    (minRating > 0 ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (experienceLevel !== 'all' ? 1 : 0) +
    serviceType.length;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Appliance Repair Services
              </h1>
              <p className="text-lg text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Browse {filteredServices.length} services and connect with {serviceCategories.reduce((acc, s) => acc + s.techCount, 0)} certified technicians
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-5 py-3 border-2 border-gray-300 rounded-lg hover:border-[#1E2F4F] hover:bg-gray-50 transition-all"
            >
              <Filter className="w-5 h-5 text-[#6B7280]" />
              <span className="font-medium text-gray-700">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-[#1E2F4F] text-white rounded-full text-xs font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-[#1E2F4F] hover:underline font-medium">
                      Clear All
                    </button>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Minimum Rating
                  </h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 text-[#1E2F4F] border-gray-300 focus:ring-[#1E2F4F]"
                        />
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F]">{rating} & up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Availability
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'today', label: 'Available Today' },
                      { value: 'tomorrow', label: 'Available Tomorrow' },
                      { value: 'this-week', label: 'This Week' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === option.value}
                          onChange={() => setAvailability(option.value as typeof availability)}
                          className="w-4 h-4 text-[#1E2F4F] border-gray-300 focus:ring-[#1E2F4F]"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Experience Level
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Levels' },
                      { value: 'expert', label: 'Expert (8+ years)' },
                      { value: 'intermediate', label: 'Intermediate (3-7 years)' },
                      { value: 'beginner', label: 'Beginner (0-2 years)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="experience"
                          checked={experienceLevel === option.value}
                          onChange={() => setExperienceLevel(option.value as typeof experienceLevel)}
                          className="w-4 h-4 text-[#1E2F4F] border-gray-300 focus:ring-[#1E2F4F]"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Service Type
                  </h3>
                  <div className="space-y-2">
                    {serviceTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={serviceType.includes(type)}
                          onChange={() => toggleServiceType(type)}
                          className="w-4 h-4 text-[#1E2F4F] border-gray-300 rounded focus:ring-[#1E2F4F]"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Advanced Search Input with Suggestions */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280] z-10" />
                  <input
                    type="text"
                    placeholder="Search for appliance or service (e.g., 'Air conditioner not cooling')..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="w-4 h-4 text-[#6B7280]" />
                            <span className="text-sm text-gray-700">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort Dropdown with Icon */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] bg-white cursor-pointer font-medium text-gray-700 min-w-[200px]"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Lowest Price</option>
                    <option value="price-high">Highest Price</option>
                    <option value="rating">Top Rated</option>
                    <option value="nearest">Nearest to Me</option>
                    <option value="most-booked">Most Booked</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category.toLowerCase().replace(' ', '-'))}
                    className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category.toLowerCase().replace(' ', '-')
                        ? 'bg-[#1E2F4F] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-[#6B7280] font-medium">Active Filters:</span>
                {minRating > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center space-x-1">
                    <span>{minRating}+ Rating</span>
                    <button onClick={() => setMinRating(0)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {availability !== 'all' && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center space-x-1">
                    <span>{availability === 'today' ? 'Available Today' : availability === 'tomorrow' ? 'Available Tomorrow' : 'This Week'}</span>
                    <button onClick={() => setAvailability('all')} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {serviceType.map((type) => (
                  <span key={type} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center space-x-1">
                    <span>{type}</span>
                    <button onClick={() => toggleServiceType(type)} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Showing <span className="font-semibold text-gray-900">{filteredServices.length}</span> service categories
              </p>
            </div>

            {/* Enhanced Service Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => onSelectCategory(service.name)}
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
                      {service.name.toLowerCase().includes('repair') || 
                       service.name.toLowerCase().includes('service') || 
                       service.name.toLowerCase().includes('maintenance') || 
                       service.name.toLowerCase().includes('installation')
                        ? service.name 
                        : `${service.name} Repair`}
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
                      <span className="text-xs text-[#6B7280]">(500+ reviews)</span>
                    </div>

                    {/* Service Info Grid */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280] flex items-center space-x-2">
                          <Award className="w-4 h-4" />
                          <span>Starting Price</span>
                        </span>
                        <span className="font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {service.avgPrice}
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
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
