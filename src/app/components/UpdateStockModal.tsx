import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Product {
  id: string | number;
  part_id?: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface UpdateStockModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdate: (productId: string | number, newQuantity: number) => void | Promise<void>;
}

export function UpdateStockModal({ isOpen, product, onClose, onUpdate }: UpdateStockModalProps) {
  const [newQuantity, setNewQuantity] = useState('0');
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when modal opens with new product
  useEffect(() => {
    if (isOpen && product) {
      setNewQuantity('0');
      setIsUpdating(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      setIsUpdating(true);
      try {
        await onUpdate(product.id, quantity);
        onClose();
      } catch (err) {
        console.error('Error updating stock:', err);
        setIsUpdating(false);
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Update stock quantity
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Description */}
            <p className="text-sm text-[#6B7280] text-center mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Set stock quantities for selected product.<br />
              Inventory count document will be created automatically.
            </p>

            {/* Product Information (Read-only) */}
            <div className="space-y-3 mb-6">
              {/* Product Code */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Product Code:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.code}
                </span>
              </div>

              {/* Product Name */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Product Name:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.name}
                </span>
              </div>

              {/* Current Stock */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Current Stock:
                </span>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.quantity} PC
                </span>
              </div>
            </div>

            {/* New Stock Quantity Input */}
            <div className="mb-6">
              <label
                htmlFor="newQuantity"
                className="block text-sm text-[#6B7280] text-center mb-2"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                New Stock Quantity
              </label>
              <input
                id="newQuantity"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent text-center"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Update Stock'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
