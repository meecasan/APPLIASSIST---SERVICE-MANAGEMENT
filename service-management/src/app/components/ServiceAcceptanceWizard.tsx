import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Check } from 'lucide-react';

interface ServiceAcceptanceWizardProps {
  isOpen: boolean;
  customerName: string;
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface LineItem {
  id: string;
  name: string;
  price: number;
}

export function ServiceAcceptanceWizard({ isOpen, customerName, onClose, onComplete }: ServiceAcceptanceWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', name: 'Diagnostic Assessment', price: 500 },
    { id: '2', name: 'Labor (2 hrs @ ₱350/hr)', price: 700 },
    { id: '3', name: 'Basic Maintenance', price: 300 },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: 'name' | 'price', value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const data = {
      scheduleDate,
      scheduleTime,
      notes,
      lineItems,
      total: calculateTotal(),
    };
    onComplete(data);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setScheduleDate('');
    setScheduleTime('');
    setNotes('');
    setLineItems([
      { id: '1', name: 'Diagnostic Assessment', price: 500 },
      { id: '2', name: 'Labor (2 hrs @ ₱350/hr)', price: 700 },
      { id: '3', name: 'Basic Maintenance', price: 300 },
    ]);
    onClose();
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return scheduleDate && scheduleTime;
    }
    if (currentStep === 2) {
      return lineItems.length > 0 && lineItems.every(item => item.name && item.price > 0);
    }
    return true;
  };

  const generateJobOrderNumber = () => {
    return `JO-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-25 flex items-center justify-center z-50 p-4">
      {!showSuccess ? (
        // Wizard Form
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto flex flex-col" style={{ maxHeight: '85vh' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Service Acceptance
              </h2>
              <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Customer: {customerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-5 py-3.5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-600'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Schedule
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-3 ${currentStep >= 2 ? 'bg-[#1E2F4F]' : 'bg-gray-200'}`} />
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-600'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Pricing
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-3 ${currentStep >= 3 ? 'bg-[#1E2F4F]' : 'bg-gray-200'}`} />
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 3 ? 'bg-[#1E2F4F] text-white' : 'bg-gray-200 text-gray-600'
                }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  3
                </div>
                <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'}`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Receipt
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="px-5 py-4 overflow-y-auto flex-1">
            {/* Step 1: Schedule */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Select Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Select Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Notes / Reason <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Additional Charges & Parts
                  </h3>
                  <div className="space-y-2.5">
                    {lineItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2.5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        />
                        <div className="relative flex-shrink-0 w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            ₱
                          </span>
                          <input
                            type="number"
                            value={item.price || ''}
                            onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          />
                        </div>
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addLineItem}
                    className="mt-3 flex items-center space-x-2 px-3.5 py-2 text-[#1E2F4F] border border-[#1E2F4F] rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ₱{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service Receipt */}
            {currentStep === 3 && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3.5">
                  <div className="flex items-start justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Service Receipt
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Job Order: {generateJobOrderNumber()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Date
                      </p>
                      <p className="text-xs font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Customer Information
                    </h4>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {customerName}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Scheduled Service
                    </h4>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {new Date(scheduleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {scheduleTime}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Payment Breakdown
                    </h4>
                    <div className="space-y-1.5">
                      {lineItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {item.name}
                          </span>
                          <span className="font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            ₱{item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Final Total
                      </span>
                      <span className="text-lg font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-5 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors font-medium text-sm"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Send Receipt
              </button>
            )}
          </div>
        </div>
      ) : (
        // Success State - Content swap within same modal container
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto">
          <div className="px-6 py-8 text-center">
            {/* Success Icon with Floating Dots */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                {/* Floating decorative dots - primary color theme */}
                <div className="absolute -top-2 -left-8 w-2.5 h-2.5 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-1 -right-10 w-3 h-3 bg-[#1E2F4F] rounded-full" />
                <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                <div className="absolute bottom-4 -left-6 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                
                {/* Main Success Icon - Large Primary Circle */}
                <div className="w-20 h-20 bg-[#1E2F4F] rounded-full flex items-center justify-center">
                  {/* White Circle Background */}
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    {/* Check Icon */}
                    <svg
                      className="w-7 h-7 text-[#1E2F4F]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Text */}
            <h2
              className="text-xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Success!
            </h2>
            <p
              className="text-sm text-gray-600 mb-6"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Service request accepted successfully
            </p>

            {/* Action Buttons - Horizontal */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseSuccess}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                style={{
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Save only
              </button>
              <button
                onClick={handleCloseSuccess}
                className="flex-1 px-4 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                style={{
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Send receipt & save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}