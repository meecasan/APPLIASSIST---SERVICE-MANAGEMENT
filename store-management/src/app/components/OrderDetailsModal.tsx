import React, { useState, useEffect } from 'react';
import { X, Check, Calendar } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderDate: string;
  orderTime: string;
  status: 'pending' | 'accepted' | 'processing' | 'ready-for-pickup' | 'completed' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    address: string;
    initial: string;
  };
  items: OrderItem[];
  customerNotes?: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  isReadOnly?: boolean;
  onReceiptSent?: (orderId: string) => void;
  onStartProcessing?: (orderId: string) => void;
}

interface PricingData {
  [key: string]: {
    price: number;
    quantity: number;
  };
}

export function OrderDetailsModal({ isOpen, onClose, order, isReadOnly = false, onReceiptSent, onStartProcessing }: OrderDetailsModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pricingData, setPricingData] = useState<PricingData>({});
  const [downPaymentPercent, setDownPaymentPercent] = useState('50');
  const [pickupDate, setPickupDate] = useState('');

  useEffect(() => {
    if (isOpen && order) {
      // If order is accepted, processing, ready-for-pickup, or completed, go directly to receipt step
      if (order.status === 'accepted' || order.status === 'processing' || order.status === 'ready-for-pickup' || order.status === 'completed') {
        setCurrentStep(3);
      } else {
        setCurrentStep(1);
      }
      // Initialize pricing data with order items
      const initialPricing: PricingData = {};
      order.items.forEach((item) => {
        initialPricing[item.id] = {
          price: 0,
          quantity: item.quantity
        };
      });
      setPricingData(initialPricing);
      setDownPaymentPercent('50');
      setPickupDate('');
    }
  }, [isOpen, order]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 3 && !isReadOnly) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePricing = (itemId: string, field: 'price' | 'quantity', value: number) => {
    setPricingData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(pricingData).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const calculateDownPayment = () => {
    const total = calculateTotal();
    const percent = parseFloat(downPaymentPercent) || 0;
    return (total * percent) / 100;
  };

  const handleSendReceipt = () => {
    console.log('Sending receipt for order:', order?.id);
    // Add receipt sending logic here
    if (onReceiptSent) {
      onReceiptSent(order?.id || '');
    }
    handleClose();
  };

  const handleStartProcessing = () => {
    console.log('Starting processing for order:', order?.id);
    // Add processing logic here
    if (onStartProcessing) {
      onStartProcessing(order?.id || '');
    }
    handleClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {currentStep === 3 ? 'Order Receipt' : 'Order Review'}
              </h2>
              {currentStep === 3 && (
                <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Thank you for your order :)
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Step Indicator */}
          {currentStep < 3 && (
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-500'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 1 ? 'text-gray-900' : 'text-[#6B7280]'
                }`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Review Order
                </span>
              </div>

              {/* Divider */}
              <div className="flex-1 h-0.5 bg-gray-200" />

              {/* Step 2 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-500'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 2 ? 'text-gray-900' : 'text-[#6B7280]'
                }`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Set Pricing
                </span>
              </div>

              {/* Divider */}
              <div className="flex-1 h-0.5 bg-gray-200" />

              {/* Step 3 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-500'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  3
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 3 ? 'text-gray-900' : 'text-[#6B7280]'
                }`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Receipt
                </span>
              </div>
            </div>
          )}

          {/* Success Icon for Step 3 */}
          {currentStep === 3 && (
            <div className="flex justify-center mt-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Step 1: Review Order */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Order Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Order No.
                    </p>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Order Date
                    </p>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {order.orderDate} • {order.orderTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Customer Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Customer Name
                    </p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Contact Number
                    </p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Full Address
                    </p>
                    <p className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {order.customer.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parts Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Parts Details
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Part Name
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Quantity (pcs)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {order.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                              <span className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                {item.productName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Notes */}
              {order.customerNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-yellow-900 mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Customer Notes:
                  </p>
                  <p className="text-sm text-yellow-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {order.customerNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Set Pricing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Pricing Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Item Pricing
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <span className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {item.productName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#6B7280] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Item Price (₱)
                          </label>
                          <input
                            type="number"
                            value={pricingData[item.id]?.price || ''}
                            onChange={(e) => updatePricing(item.id, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#6B7280] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Quantity (pcs)
                          </label>
                          <input
                            type="number"
                            value={pricingData[item.id]?.quantity || ''}
                            onChange={(e) => updatePricing(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Down Payment
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(e.target.value)}
                    placeholder="50% of the price"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    %
                  </span>
                </div>
              </div>

              {/* Order Summary Panel */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Order Summary
                </h4>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const itemData = pricingData[item.id];
                    const itemTotal = itemData ? itemData.price * itemData.quantity : 0;
                    return (
                      <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        <span className="text-[#6B7280]">
                          {item.productName} ×{itemData?.quantity || 0}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₱{itemTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t border-blue-300">
                    <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <span className="text-[#6B7280]">Down Payment ({downPaymentPercent}%)</span>
                      <span className="font-medium text-gray-900">
                        ₱{calculateDownPayment().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-[#1E2F4F] text-lg">
                        ₱{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Pickup Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Receipt */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Order Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Order No.
                    </p>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Date
                    </p>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {order.orderDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <div className="flex">
                    <span className="text-[#6B7280] w-24">Name:</span>
                    <span className="text-gray-900 font-medium">{order.customer.name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6B7280] w-24">Contact:</span>
                    <span className="text-gray-900 font-medium">{order.customer.phone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6B7280] w-24">Address:</span>
                    <span className="text-gray-900 font-medium">{order.customer.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Order Details
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Part Name
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {order.items.map((item) => {
                        const itemData = pricingData[item.id];
                        const itemTotal = itemData ? itemData.price * itemData.quantity : 0;
                        return (
                          <tr key={item.id}>
                            <td className="px-4 py-3 font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {item.productName}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              {itemData?.quantity || 0}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              ₱{itemData?.price.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                              ₱{itemTotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pickup Date */}
              {pickupDate && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Pickup Date:
                    </span>
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {new Date(pickupDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Down Payment Summary */}
              <div className="bg-[#1E2F4F] text-white rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Down Payment ({downPaymentPercent}%)
                    </span>
                    <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₱{calculateDownPayment().toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Final Cost
                      </span>
                      <span className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 rounded-b-2xl flex items-center justify-between">
          {currentStep < 3 ? (
            <>
              <button
                onClick={currentStep === 1 ? handleClose : handleBack}
                className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {currentStep === 1 ? 'Close' : 'Back'}
              </button>
              {!isReadOnly && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Next
                </button>
              )}
            </>
          ) : (
            <>
              {/* For pending orders: Show Cancel and Send Receipt */}
              {order.status === 'pending' && !isReadOnly ? (
                <>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReceipt}
                    className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Send Receipt
                  </button>
                </>
              ) : (
                /* For accepted/processing orders: Only show Close button centered */
                <div className="w-full flex justify-center">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}