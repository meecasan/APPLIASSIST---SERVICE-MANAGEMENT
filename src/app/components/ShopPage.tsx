import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MessageCircle, Store, Users, Package } from 'lucide-react';
import { productsAPI } from '../services/api-extended';

interface ShopPageProps {
  brand: string;
  onBack: () => void;
  onSelectProduct: (product: any) => void;
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
  imageIcon?: string;
}

export default function ShopPage({ brand, onBack, onSelectProduct }: ShopPageProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['Home', 'All Products', 'Refrigerator Parts', 'AC Parts', 'Washing Machine', 'More'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productsAPI.listProducts({ limit: 100 });
        
        // Filter and transform API data
        const transformedProducts = Array.isArray(data) ? data.map((p: any) => ({
          id: p.part_id || p.id,
          part_id: p.part_id,
          name: p.part_name,
          part_name: p.part_name,
          category: p.category,
          price: p.price,
          stock: p.stock_quantity,
          stock_quantity: p.stock_quantity,
          rating: Math.random() * (5 - 4) + 4,
          reviews: Math.floor(Math.random() * 200) + 20,
          imageIcon: '📦',
          brand: brand,
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
  }, [brand]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1E2F4F] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Shop Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            {/* Left side - Shop info */}
            <div className="flex items-center space-x-6">
              {/* Shop Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Store className="w-12 h-12 text-white" />
              </div>

              {/* Shop details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {brand}
                </h1>
                <p className="text-sm text-green-600 font-semibold mb-3">Active 3 minutes ago</p>
                <button className="px-6 py-2 border-2 border-[#1E2F4F] text-[#1E2F4F] rounded-lg hover:bg-gray-50 font-semibold transition-all flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shop Stats */}
          <div className="grid grid-cols-5 gap-8 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Products</p>
              <p className="text-xl font-bold text-gray-900">129</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Following</p>
              <p className="text-xl font-bold text-gray-900">846</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Chat Performance</p>
              <p className="text-xl font-bold text-gray-900">100% (within minutes)</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Rating</p>
              <p className="text-xl font-bold text-[#FF6B35]">4.7 (5.4k Ratings)</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Joined</p>
              <p className="text-xl font-bold text-gray-900">20 months ago</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center space-x-8 px-8 py-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-2 px-2 border-b-3 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? 'border-[#1E2F4F] text-[#1E2F4F]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1E2F4F]'
                }`}
                style={{ borderBottomWidth: activeTab === tab.toLowerCase() ? '3px' : '0', fontFamily: 'Poppins, sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            All Products
          </h2>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Loading products...</p>
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
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products available from this brand</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1E2F4F] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {product.imageIcon}
                    </div>

                    {/* Stock Badge */}
                    {(product.stock === 0 || product.stock_quantity === 0) && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                        Pre-Order
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {product.name || product.part_name}
                    </h3>

                    {/* Price */}
                    <div className="mb-2">
                      <p className="text-xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{(product.price || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Rating and Sales */}
                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span>{(product.stock || product.stock_quantity) || 0} sold</span>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            RECOMMENDED FOR YOU
          </h2>

          {/* Same product grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={`rec-${product.id}`}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1E2F4F] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {product.imageIcon}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {product.name || product.part_name}
                    </h3>

                    <div className="mb-2">
                      <p className="text-xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{(product.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                      <span>{(product.stock || product.stock_quantity) || 0} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
