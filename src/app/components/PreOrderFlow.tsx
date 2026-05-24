import React, { useState } from 'react';
import { ArrowLeft, Package, User, CheckCircle, DollarSign } from 'lucide-react';

interface PreOrderFlowProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageIcon: string;
  };
  onBack: () => void;
}

export default function PreOrderFlow({ product, onBack }: PreOrderFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const downPaymentPercentage = 30;
  const downPaymentAmount = product.price * (downPaymentPercentage / 100);
  const remainingBalance = product.price - downPaymentAmount;

  const [formData, setFormData] = useState({
    // Customer Info
    fullName: '',
    email: '',
    phone: '',
    quantity: 1,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return formData.fullName && formData.email && formData.phone;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    const reference = `PO${Date.now().toString().slice(-8)}`;
    setOrderReference(reference);
    setShowSuccess(true);
  };

  const totalCost = product.price * formData.quantity;
  const totalDownPayment = downPaymentAmount * formData.quantity;
  const totalRemaining = remainingBalance * formData.quantity;

  const stepProgress = (currentStep / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#1E2F4F] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Product</span>
          </button>
          <h1 className="text-4xl font-bold text-[#1E2F4F] mb-2">Pre-Order Checkout</h1>
          <p className="text-gray-600">Secure your item with a 30% down payment</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-[#1E2F4F] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`h-1 w-24 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-[#1E2F4F]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1E2F4F] to-blue-600 transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'font-semibold text-[#1E2F4F]' : ''}>Contact Info</span>
            <span className={currentStep >= 2 ? 'font-semibold text-[#1E2F4F]' : ''}>Payment & Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-[#1E2F4F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E2F4F]">Contact Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1E2F4F] focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1E2F4F] focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="juan@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1E2F4F] focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Order Review */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#1E2F4F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E2F4F]">Order Review</h2>
                  </div>

                  {/* Order Review */}
                  <div className="border-t-2 border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-[#1E2F4F] mb-4">Order Review</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-semibold">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold">{formData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className={`ml-auto px-8 py-3 rounded-xl font-semibold transition-all ${
                    validateStep(currentStep)
                      ? 'bg-[#1E2F4F] text-white hover:bg-[#2a4066] shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 2 ? 'Confirm Pre-Order' : 'Next Step'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-[#1E2F4F] mb-6">Pre-Order Summary</h3>

              {/* Product Info */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-4xl">
                  {product.imageIcon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600">Qty: {formData.quantity}</p>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({formData.quantity} item)</span>
                  <span>₱{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-gray-900 mb-2">
                    <span>Total Amount</span>
                    <span className="text-xl">₱{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Down Payment Info */}
              <div className="bg-gradient-to-br from-[#1E2F4F] to-[#2a4066] text-white rounded-xl p-5 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5" />
                  <h4 className="font-bold">Down Payment ({downPaymentPercentage}%)</h4>
                </div>
                <p className="text-3xl font-bold mb-2">₱{totalDownPayment.toLocaleString()}</p>
                <p className="text-sm text-blue-100">Pay now to secure your order</p>
              </div>

              {/* Remaining Balance */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Remaining Balance</span>
                  <span className="text-xl font-bold text-gray-900">₱{totalRemaining.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Pay upon delivery or before shipment</p>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>100% authentic products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Guaranteed delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#1E2F4F] mb-4">Pre-Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your pre-order has been successfully placed. We'll notify you when your item ships.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Pre-Order Reference</p>
                <p className="text-2xl font-bold text-[#1E2F4F] mb-4">{orderReference}</p>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-semibold text-green-600">₱{totalDownPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-semibold">₱{totalRemaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  onBack();
                }}
                className="w-full px-6 py-3 bg-[#1E2F4F] text-white rounded-xl font-semibold hover:bg-[#2a4066] transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
