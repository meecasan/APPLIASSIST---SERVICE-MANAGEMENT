import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
  inStock: boolean;
}

interface CartProps {
  userEmail: string;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onNavigateToPartsMarketplace: () => void;
}

export function Cart({
  userEmail,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigateToPartsMarketplace,
}: CartProps) {

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = cartItems.length > 0 ? 150 : 0;
    return subtotal + shippingFee;
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Shopping Cart
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Browse our parts marketplace to find appliance parts and accessories.
            </p>
            <button
              onClick={onNavigateToPartsMarketplace}
              className="px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Browse Parts
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image Placeholder */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {item.brand}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            Quantity:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-1.5 border-x border-gray-300 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            ₱{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            ₱{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>

                      {!item.inStock && (
                        <p className="text-sm text-red-600 mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          Currently out of stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      ₱{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Shipping Fee
                    </span>
                    <span className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      ₱150
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₱{calculateTotal().toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  disabled={cartItems.some(item => !item.inStock)}
                  className="w-full px-6 py-3 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Proceed to Checkout
                </button>

                {cartItems.some(item => !item.inStock) && (
                  <p className="text-sm text-red-600 mt-3 text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Remove out-of-stock items to proceed
                  </p>
                )}

                <button
                  onClick={onNavigateToPartsMarketplace}
                  className="w-full mt-3 px-6 py-3 bg-white text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
