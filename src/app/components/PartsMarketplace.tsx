import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Star, ShoppingBag, Package, ChevronDown, X } from 'lucide-react';
import { productsAPI } from '../services/api-extended';

interface PartsMarketplaceProps {
  onSelectProduct: (product: any) => void;
  onBack: () => void;
}

interface Product {
  id?: number;
  part_id?: number;
  name?: string;
  part_name?: string;
  category: string;
  brand?: string;
  price: number;
  stock?: number;
  stock_quantity?: number;
  rating?: number;
  reviews?: number;
  compatibility?: string | string[];
  imageIcon?: string;
  warranty?: string;
  featured?: boolean;
  description?: string;
}

export default function PartsMarketplace({ onSelectProduct, onBack }: PartsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productsAPI.listProducts({ limit: 100 });
        
        // Transform API data to component format
        const transformedProducts = Array.isArray(data) ? data.map((p: any) => ({
          id: p.part_id || p.id,
          part_id: p.part_id,
          name: p.part_name,
          part_name: p.part_name,
          category: p.category,
          price: p.price,
          stock: p.stock_quantity,
          stock_quantity: p.stock_quantity,
          rating: Math.random() * (5 - 4) + 4, // Generate random 4-5 rating for now
          reviews: Math.floor(Math.random() * 150) + 20,
          compatibility: p.description || '',
          imageIcon: '📦',
          warranty: '6 months',
          featured: Math.random() > 0.7, // 30% featured
          description: p.description,
        })) : [];
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // Get unique categories and brands from products
  const categories = ['All Parts', ...new Set(products.map(p => p.category))];
  const brands = ['All Brands', ...new Set(products.map(p => p.brand || 'Generic'))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory.replace('All ', '');
    const matchesBrand = selectedBrand === 'all' || (product.brand || 'Generic') === selectedBrand.replace('All ', '');
    const matchesStock = !showInStockOnly || (product.stock || 0) > 0;
    const matchesFeatured = !showFeaturedOnly || product.featured;
    const matchesRating = (product.rating || 0) >= minRating;

    return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesFeatured && matchesRating;
  });

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (showInStockOnly ? 1 : 0) +
    (showFeaturedOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setShowInStockOnly(false);
    setShowFeaturedOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Appliance Parts Marketplace
              </h1>
              <p className="text-lg text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                100% genuine parts from verified suppliers • {filteredProducts.length} products available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-[#1E2F4F] hover:underline font-semibold">
                    Clear ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.toLowerCase().replace(' parts', '').replace('all ', 'all')}
                        onChange={() => setSelectedCategory(category.toLowerCase().replace(' parts', '').replace('all ', 'all'))}
                        className="w-4 h-4 text-[#1E2F4F] border-gray-300 focus:ring-[#1E2F4F]"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F] font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Brand
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand.toLowerCase().replace(' brands', '').replace('all ', 'all')}
                        onChange={() => setSelectedBrand(brand.toLowerCase().replace(' brands', '').replace('all ', 'all'))}
                        className="w-4 h-4 text-[#1E2F4F] border-gray-300 focus:ring-[#1E2F4F]"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F] font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 0].map((rating) => (
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
                        <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F] font-medium">
                          {rating === 0 ? 'All Ratings' : `${rating} & up`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Quick Filters
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-[#1E2F4F] border-gray-300 rounded focus:ring-[#1E2F4F]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F] font-medium">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="w-4 h-4 text-[#1E2F4F] border-gray-300 rounded focus:ring-[#1E2F4F]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#1E2F4F] font-medium">Featured Products</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Enhanced Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search parts by name, brand, or model number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>

                {/* Enhanced Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] bg-white cursor-pointer font-semibold min-w-[200px]"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-[#6B7280] font-semibold">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <span>{selectedBrand}</span>
                    <button onClick={() => setSelectedBrand('all')} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {showInStockOnly && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <span>In Stock</span>
                    <button onClick={() => setShowInStockOnly(false)} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {isLoading ? 'Loading products...' : error ? 'Error loading products' : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Loading marketplace products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Failed to load products: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products match your filters</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#1E2F4F] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                      <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                        {product.imageIcon}
                      </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.featured && (
                        <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold shadow-md">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Pre-Order'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Brand Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                        {product.brand}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className="text-xs text-[#6B7280] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {product.category}
                    </p>

                    {/* Compatibility */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-[#6B7280] mb-1">Compatible Models:</p>
                      <p className="text-xs text-gray-900 truncate">{product.compatibility.join(', ')}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                      <span className="text-xs text-[#6B7280]">({product.reviews})</span>
                    </div>

                    {/* Warranty */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-xs text-[#6B7280]">
                        Warranty: <span className="font-bold text-gray-900">{product.warranty}</span>
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Price</p>
                        <p className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          ₱{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-sm shadow-md group-hover:shadow-lg ${
                        product.stock > 0
                          ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066]'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                      disabled={product.stock === 0 && !true}
                    >
                      {product.stock > 0 ? 'View Details →' : 'Pre-Order Now'}
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  No products found
                </h3>
                <p className="text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] font-semibold transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
