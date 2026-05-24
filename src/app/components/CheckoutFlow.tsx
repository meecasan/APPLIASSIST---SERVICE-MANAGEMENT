import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Phone, Mail } from 'lucide-react';

interface CheckoutFlowProps {
  product: any;
  onBack: () => void;
}

export default function CheckoutFlow({ product, onBack }: CheckoutFlowProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const shippingFee = 150;
  const quantity = product.quantity || 1;
  const subtotal = product.price * quantity;
  const total = subtotal + shippingFee;

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phoneNumber
    );
  };

  const handleConfirmOrder = () => {
    const ref = `ORD-${Date.now().toString().slice(-8)}`;
    setOrderReference(ref);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-8 py-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1E2F4F] mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Customer Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+63 XXX XXX XXXX"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{product.name}</p>
                      <p className="text-xs text-[#6B7280]">Qty: {quantity}</p>
                      <p className="text-sm font-bold text-[#1E2F4F] mt-1">₱{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-semibold text-gray-900">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Shipping Fee</span>
                    <span className="font-semibold text-gray-900">₱{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₱{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={!isFormValid()}
                  className={`w-full px-6 py-4 rounded-xl font-bold transition-all text-lg shadow-lg ${
                    !isFormValid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] hover:shadow-xl'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Place Order
                </button>

                <p className="text-xs text-center text-[#6B7280] mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full animate-scale-in">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Order Placed!
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#6B7280] mb-1">Order Reference</p>
              <p className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {orderReference}
              </p>
            </div>

            <p className="text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Your order has been confirmed. We'll send you updates via email and SMS.
            </p>

            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 rounded-lg bg-[#1E2F4F] text-white hover:bg-[#2a4066] font-semibold transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              View Tracking
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
