import React, { useState } from 'react';
import { ArrowLeft, Star, Shield, Truck, Package, Plus, Minus, ShoppingCart, CheckCircle, MessageCircle, Store, Users } from 'lucide-react';

interface ProductDetailsProps {
  product: any;
  onBuyNow: (product: any) => void;
  onPreOrder: (product: any) => void;
  onBack: () => void;
  onViewShop?: (brand: string) => void;
}

const productData = {
  id: 1,
  name: 'Samsung Inverter Compressor RF28',
  category: 'Refrigerator Parts',
  brand: 'Samsung',
  price: 2450,
  stock: 15,
  rating: 4.7,
  reviews: 89,
  imageIcon: '📦',
  warranty: '6 months',
  sku: 'SAM-RF28-COMP-001',
  description: 'Genuine Samsung inverter compressor designed for RF28 series refrigerators. Features energy-efficient operation, quiet performance, and reliable cooling power. Factory-tested and backed by manufacturer warranty.',
  specifications: [
    { label: 'Model Number', value: 'RF28-COMP-INV' },
    { label: 'Power Rating', value: '120W' },
    { label: 'Voltage', value: '220-240V' },
    { label: 'Refrigerant Type', value: 'R-600a' },
    { label: 'Cooling Capacity', value: '450 BTU/hr' },
    { label: 'Weight', value: '8.5 kg' },
    { label: 'Dimensions', value: '25cm x 18cm x 18cm' },
    { label: 'Warranty Coverage', value: '6 months parts & labor' },
  ],
  compatibility: [
    'RF28HMEDBSR/AA',
    'RF28HDEDPRS/AA',
    'RF28HDEDPWW/AA',
    'RF28JBEDBSG/AA',
    'RF28HDEDBSR/AA',
  ],
  customerReviews: [
    {
      id: 1,
      name: 'Roberto Santos',
      rating: 5,
      date: 'May 10, 2026',
      comment: 'Perfect replacement! My refrigerator is running quieter and more efficient than before. Installation was straightforward with the help of a technician.',
      verified: true,
    },
    {
      id: 2,
      name: 'Maria Cruz',
      rating: 5,
      date: 'May 5, 2026',
      comment: 'Genuine Samsung part. Works perfectly with my RF28 model. Delivery was fast and packaging was excellent.',
      verified: true,
    },
    {
      id: 3,
      name: 'Juan Reyes',
      rating: 4,
      date: 'April 28, 2026',
      comment: 'Good quality compressor. Slightly pricey but worth it for the genuine part. Highly recommended.',
      verified: false,
    },
  ],
  relatedProducts: [
    { id: 2, name: 'Samsung Evaporator Fan Motor', price: 890, rating: 4.6, icon: '🌀' },
    { id: 3, name: 'Samsung Door Gasket Set', price: 650, rating: 4.8, icon: '🔧' },
    { id: 4, name: 'Samsung Temperature Sensor', price: 420, rating: 4.7, icon: '🌡️' },
    { id: 5, name: 'Samsung Defrost Heater', price: 580, rating: 4.5, icon: '🔥' },
  ],
  deliveryEstimate: '3-5 business days',
  features: [
    'Energy-efficient inverter technology',
    'Quiet operation',
    'Factory tested and certified',
    'Compatible with multiple RF28 models',
    'Easy installation',
    '6-month manufacturer warranty',
  ],
};

export default function ProductDetails({ product, onBuyNow, onPreOrder, onBack, onViewShop }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [selectedImage, setSelectedImage] = useState(0);

  // Merge passed product data with defaults
  const productData = {
    ...product,
    imageIcon: product.imageIcon || '📦',
    warranty: product.warranty || '6 months',
    sku: product.sku || `SKU-${product.id}`,
    description: product.description || `High-quality ${product.name}. Genuine part with warranty coverage.`,
    specifications: product.specifications || [
      { label: 'Model Number', value: product.name },
      { label: 'Warranty Coverage', value: product.warranty || '6 months' },
    ],
    compatibility: product.compatibility || [],
    customerReviews: product.customerReviews || [
      {
        id: 1,
        name: 'Customer',
        rating: 5,
        date: 'May 10, 2026',
        comment: 'Great product! Works perfectly as described.',
        verified: true,
      },
    ],
    relatedProducts: product.relatedProducts || [],
    deliveryEstimate: product.deliveryEstimate || '3-5 business days',
    features: product.features || [
      'High quality construction',
      'Factory tested',
      'Warranty included',
    ],
  };

  const increaseQuantity = () => {
    if (quantity < productData.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePurchase = () => {
    if (productData.stock > 0) {
      onBuyNow({ ...product, quantity });
    } else {
      onPreOrder({ ...product, quantity });
    }
  };

  const totalPrice = productData.price * quantity;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1E2F4F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Parts</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Left Column - Enhanced Image Gallery */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-12 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
              <div className="relative flex items-center justify-center h-96">
                <div className="text-9xl transform group-hover:scale-110 transition-transform duration-300">
                  {productData.imageIcon}
                </div>
              </div>
              {productData.stock > 0 && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                  ✓ In Stock
                </div>
              )}
            </div>

            {/* Enhanced Trust Badges */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-900">100% Genuine</p>
                <p className="text-xs text-[#6B7280]">Parts</p>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Brand Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-bold rounded-xl border border-blue-200">
                  {productData.brand}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {productData.name}
              </h1>

              {/* Category */}
              <p className="text-lg text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {productData.category}
              </p>

              {/* Enhanced Rating & Reviews */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(productData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{productData.rating}</span>
                </div>
                <span className="text-sm text-[#6B7280]">({productData.reviews} reviews)</span>
                <div className={`ml-auto px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                  productData.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {productData.stock > 0 ? `${productData.stock} in stock` : 'Pre-Order Available'}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-[#6B7280] mb-2">Price</p>
                <p className="text-5xl font-bold text-[#1E2F4F] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ₱{productData.price.toLocaleString()}
                </p>
                <p className="text-sm text-[#6B7280]">SKU: {productData.sku}</p>
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-8 font-bold text-xl text-gray-900">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= productData.stock && productData.stock > 0}
                      className="p-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B7280]">Total Price</p>
                    <p className="text-2xl font-bold text-[#1E2F4F]">₱{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Fast Delivery</p>
                    <p className="text-sm text-[#6B7280]">{productData.deliveryEstimate} for Metro Manila</p>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePurchase}
                  className="w-full px-6 py-4 rounded-xl bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-bold transition-all text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>{productData.stock > 0 ? 'Add to Cart' : 'Pre-Order Now'}</span>
                </button>
                {productData.stock > 0 && (
                  <button
                    onClick={() => onBuyNow({ ...product, quantity })}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#1E2F4F] text-[#1E2F4F] hover:bg-[#1E2F4F] hover:text-white font-bold transition-all text-lg"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            {/* Left side - Seller info */}
            <div className="flex items-center space-x-4">
              {/* Seller Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>

              {/* Seller details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {productData.brand} Official Store
                </h3>
                <p className="text-sm text-green-600 font-semibold">Active 3 minutes ago</p>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-6 py-2.5 border-2 border-[#1E2F4F] text-[#1E2F4F] rounded-lg hover:bg-gray-50 font-semibold transition-all flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat Now</span>
              </button>
              <button
                onClick={() => onViewShop && onViewShop(productData.brand)}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] font-semibold transition-all flex items-center space-x-2"
              >
                <Store className="w-4 h-4" />
                <span>View Shop</span>
              </button>
            </div>
          </div>

          {/* Seller Stats */}
          <div className="grid grid-cols-5 gap-8 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Ratings</p>
              <p className="text-base font-bold text-[#FF6B35]">5.4k</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Response Rate</p>
              <p className="text-base font-bold text-[#FF6B35]">100%</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Products</p>
              <p className="text-base font-bold text-gray-900">129</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Response Time</p>
              <p className="text-base font-bold text-gray-900">within minutes</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Joined</p>
              <p className="text-base font-bold text-gray-900">20 months ago</p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-8 px-8">
              {(['details', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-5 px-2 border-b-3 font-bold transition-colors capitalize ${
                    selectedTab === tab
                      ? 'border-[#1E2F4F] text-[#1E2F4F]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1E2F4F]'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif', borderBottomWidth: selectedTab === tab ? '3px' : '0' }}
                >
                  {tab === 'details' && 'Product Details'}
                  {tab === 'specs' && 'Specifications'}
                  {tab === 'reviews' && `Reviews (${productData.reviews})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'details' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Description
                  </h3>
                  <p className="text-lg text-[#6B7280] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {productData.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Compatible Models
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {productData.compatibility.map((model, idx) => (
                      <span key={idx} className="px-5 py-3 bg-gray-100 text-gray-800 rounded-xl text-sm font-bold border border-gray-300">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productData.specifications.map((spec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <span className="text-sm font-bold text-[#6B7280] uppercase tracking-wide mb-2 block" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        {spec.label}
                      </span>
                      <span className="text-lg text-gray-900 font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Customer Reviews
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    <div>
                      <span className="text-3xl font-bold text-gray-900">{productData.rating}</span>
                      <span className="text-[#6B7280]"> / 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {productData.customerReviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                            {review.verified && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productData.relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
                <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-5xl">{product.icon}</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{product.name}</h4>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-900 font-semibold">{product.rating}</span>
                </div>
                <p className="text-xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>₱{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
