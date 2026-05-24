import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Ruler, FileText, Image as ImageIcon, CheckCircle, Trash2 } from 'lucide-react';
import { productsAPI } from '../services/api-extended';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: () => void;
}

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 'success' | 'error'>(1);
  const [formData, setFormData] = useState({
    productName: '',
    unitOfMeasurement: '',
    description: '',
    startingPrice: '',
    status: 'Available',
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key with confirmation
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleCloseAttempt();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, formData]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

    return () => {
      currentModal?.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, currentStep]);

  const hasFormData = () => {
    return (
      formData.productName.trim() !== '' ||
      formData.unitOfMeasurement.trim() !== '' ||
      formData.description.trim() !== '' ||
      formData.startingPrice.trim() !== '' ||
      formData.status !== 'Available'
    );
  };

  const handleCloseAttempt = () => {
    if (hasFormData()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
      resetForm();
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
    resetForm();
  };

  const cancelClose = () => {
    setShowCloseConfirm(false);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      unitOfMeasurement: '',
      description: '',
      startingPrice: '',
      status: 'Available',
    });
    setCurrentStep(1);
    setErrors({});
    setProductImages([]);
    setImagePreviews([]);
  };

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.unitOfMeasurement.trim()) {
      newErrors.unitOfMeasurement = 'Unit of measurement is required';
    }
    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = 'Starting price is required';
    } else if (isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0) {
      newErrors.startingPrice = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Handle form submission - call API to save product
      handleSaveProduct();
    }
  };

  const handleSaveProduct = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Get current user from localStorage
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        setErrorMessage('You must be logged in to add a product');
        setCurrentStep('error');
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const storeId = user.store_id || user.id; // Use store_id if available, otherwise user id

      // Prepare product data
      const productData = {
        store_id: storeId,
        part_name: formData.productName,
        category: formData.unitOfMeasurement, // Using unit of measurement as category for now
        description: formData.description,
        price: parseFloat(formData.startingPrice),
        stock_quantity: 1, // Default stock
        compatibility: formData.description,
        status: formData.status, // Must match backend validation: 'Available', 'Out of Stock', 'Discontinued'
      };

      // Log payload for verification
      console.log('Product payload being sent:', productData);

      // Create the product
      const response = await productsAPI.createProduct(productData);

      if (response.part_id) {
        // Upload images if any
        if (productImages.length > 0) {
          for (const image of productImages) {
            try {
              await productsAPI.uploadImage(response.part_id, image);
            } catch (imgError) {
              console.warn('Image upload failed for one image:', imgError);
              // Continue with other images even if one fails
            }
          }
        }

        setSuccessMessage('Product added successfully!');
        setCurrentStep('success');

        // Call parent callback to refresh product list
        if (onProductAdded) {
          onProductAdded();
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add product';
      setErrorMessage(errorMsg);
      setCurrentStep('error');
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setProductImages((prev) => [...prev, ...newFiles]);

      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setProductImages((prev) => [...prev, ...newFiles]);

      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Success State */}
      {currentStep === 'success' ? (
        <div
          ref={modalRef}
          className="relative w-full max-w-[500px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: 'ease' }}
        >
          <div className="px-8 py-10 text-center">
            {/* Success Icon with Floating Dots */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Floating decorative dots */}
                <div className="absolute top-0 left-8 w-3 h-3 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-12 -left-12 w-3 h-3 bg-[#1E2F4F] rounded-full" />
                <div className="absolute bottom-4 -left-8 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-4 right-8 w-3.5 h-3.5 bg-[#1E2F4F] rounded-full" />
                <div className="absolute top-16 right-4 w-2 h-2 bg-[#1E2F4F] rounded-full" />
                <div className="absolute bottom-8 right-8 w-2.5 h-2.5 bg-[#1E2F4F] rounded-full" />
                
                {/* Main Success Icon - Large Blue Circle */}
                <div className="w-32 h-32 bg-[#1E2F4F] rounded-full flex items-center justify-center">
                  {/* White Circle Background */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    {/* Checkmark Icon */}
                    <CheckCircle className="w-12 h-12 text-[#1E2F4F]" strokeWidth={2.5} fill="#1E2F4F" />
                  </div>
                </div>
              </div>
            </div>

            {/* Success Text */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Product Added!
            </h2>
            <p className="text-sm text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {successMessage || 'Your product has been successfully added and saved to the database'}
            </p>

            {/* Okay Button - Outlined Style */}
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="w-full max-w-[400px] px-12 py-3 border-2 border-gray-300 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition-all mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Okay
            </button>
          </div>
        </div>
      ) : currentStep === 'error' ? (
        <div
          ref={modalRef}
          className="relative w-full max-w-[500px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ animationTimingFunction: 'ease' }}
        >
          <div className="px-8 py-10 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Text */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Error Adding Product
            </h2>
            <p className="text-sm text-[#6B7280] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {errorMessage || 'Something went wrong while adding the product'}
            </p>

            {/* Back Button */}
            <button
              onClick={() => {
                setCurrentStep(2);
                setErrorMessage('');
              }}
              className="w-full max-w-[400px] px-12 py-3 border-2 border-gray-300 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition-all mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-[580px] mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300" style={{ animationTimingFunction: 'ease' }} ref={modalRef}>
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
          <div className="px-6 py-6">
            {currentStep === 1 ? (
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="productName"
                      type="text"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      placeholder="Enter product name"
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.productName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                      ref={firstInputRef}
                    />
                  </div>
                  {errors.productName && (
                    <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.productName}
                    </p>
                  )}
                </div>

                {/* Unit of Measurement */}
                <div>
                  <label
                    htmlFor="unitOfMeasurement"
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Unit of Measurement <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Ruler className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="unitOfMeasurement"
                      type="text"
                      value={formData.unitOfMeasurement}
                      onChange={(e) => handleInputChange('unitOfMeasurement', e.target.value)}
                      placeholder="e.g., kg, liters, pieces"
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.unitOfMeasurement ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                    />
                  </div>
                  {errors.unitOfMeasurement && (
                    <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.unitOfMeasurement}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description (optional)"
                      rows={4}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                    />
                  </div>
                </div>

                {/* Starting Price */}
                <div>
                  <label
                    htmlFor="startingPrice"
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Starting Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-semibold text-lg">₱</span>
                    </div>
                    <input
                      id="startingPrice"
                      type="number"
                      step="0.01"
                      value={formData.startingPrice}
                      onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                      placeholder="0.00"
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.startingPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                    />
                  </div>
                  {errors.startingPrice && (
                    <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {errors.startingPrice}
                    </p>
                  )}
                </div>

                {/* Product Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Product Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Step 2: Image Upload */}
                <div>
                  <label
                    className="block text-sm font-medium text-[#6B7280] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Product Images
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E2F4F] transition-colors cursor-pointer ${
                      isDragging ? 'border-[#1E2F4F]' : ''
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      PNG, JPG or WEBP (max. 5MB each) • Multiple images allowed
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      multiple
                    />
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Uploaded Images ({imagePreviews.length})
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Product Summary
                  </p>
                  <div className="space-y-2 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Name:</span>
                      <span className="text-gray-900 font-medium">{formData.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Unit:</span>
                      <span className="text-gray-900 font-medium">{formData.unitOfMeasurement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Price:</span>
                      <span className="text-gray-900 font-medium">₱{formData.startingPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className={`text-sm font-medium transition-colors ${
                currentStep === 1 || isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              BACK
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`px-8 py-2.5 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2C3E50] hover:bg-[#34495E]'} text-white rounded-lg text-sm font-medium transition-all`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {isLoading ? 'SAVING...' : currentStep === 1 ? 'NEXT' : 'SAVE'}
            </button>
          </div>
        </div>
      )}

      {/* Close Confirmation */}
      {showCloseConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-2xl">
            <p className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Are you sure you want to close?
            </p>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Any unsaved changes will be lost.
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelClose}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg mr-2"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}