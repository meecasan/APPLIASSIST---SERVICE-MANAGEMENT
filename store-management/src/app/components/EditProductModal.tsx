import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Ruler, FileText, Image, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  unit?: string;
  description?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdate: (productData: any) => void;
}

export function EditProductModal({ isOpen, product, onClose, onUpdate }: EditProductModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentState, setCurrentState] = useState<'form' | 'success'>('form');
  const [hasChanges, setHasChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state - pre-filled with product data
  const [formData, setFormData] = useState({
    productName: '',
    unit: '',
    description: '',
    startingPrice: '',
    image: null as File | null,
  });

  // Pre-fill form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.name || '',
        unit: product.unit || '',
        description: product.description || '',
        startingPrice: product.price.toString() || '',
        image: null,
      });
      setHasChanges(false);
      setCurrentState('form');
      setCurrentStep(1);
    }
  }, [product]);

  // Lock body scroll when modal is open
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

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        if (currentState === 'success') {
          handleClose();
        } else {
          handleCloseAttempt();
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, hasChanges, currentState]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleTab);
    const currentModal = modalRef.current;

    // Auto-focus first input
    setTimeout(() => {
      firstElement?.focus();
    }, 100);

    return () => {
      currentModal?.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, currentStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setShowCloseConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCurrentState('form');
    setHasChanges(false);
    setShowCloseConfirm(false);
    setFormData({
      productName: '',
      unit: '',
      description: '',
      startingPrice: '',
      image: null,
    });
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.productName || !formData.unit || !formData.startingPrice) {
        alert('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    } else {
      // Submit form
      onUpdate({
        id: product?.id,
        ...formData,
      });
      setCurrentState('success');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setHasChanges(true);
    }
  };

  if (!isOpen || !product) return null;

  // Close confirmation dialog
  if (showCloseConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Discard Changes?
          </h3>
          <p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            You have unsaved changes. Are you sure you want to close?
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCloseConfirm(false)}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (currentState === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Success Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: 'ease' }}
        >
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
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Success!
            </h2>
            <p
              className="text-sm text-gray-600 mb-6"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Receipt sent and product updated successfully
            </p>

            {/* Action Button - Single centered button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="px-8 py-2.5 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-all"
                style={{
                  fontFamily: 'Instrument Sans, sans-serif',
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[580px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{ animationTimingFunction: 'ease' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Product Details
            </h2>
            <button
              onClick={handleCloseAttempt}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                  currentStep >= 1 ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-500'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                1
              </div>
              <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Product Details
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                  currentStep === 2 ? 'bg-[#2C3E50] text-white' : 'bg-white border-2 border-gray-300 text-gray-500'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                2
              </div>
              <span className={`text-sm font-medium ${currentStep === 2 ? 'text-gray-900' : 'text-gray-500'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                Image
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 max-h-[500px] overflow-y-auto">
          {currentStep === 1 ? (
            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    placeholder="Enter product name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Unit of Measurement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Unit of Measurement <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    placeholder="e.g., pcs, kg, liter"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>
              </div>

              {/* Starting Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Starting Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-semibold text-lg">₱</span>
                  </div>
                  <input
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Image Upload
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {formData.image ? formData.image.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`text-sm font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            BACK
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-[#2C3E50] text-white rounded-lg text-sm font-medium hover:bg-[#34495E] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {currentStep === 1 ? 'NEXT' : 'SEND RECEIPT'}
          </button>
        </div>
      </div>
    </div>
  );
}