import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, Star, Clock, Package } from 'lucide-react';

export interface ProductCategory {
  id?: string;
  categoryName: string;
  description: string;
  productCount?: string;
  averagePrice?: string;
  categoryType: string;
  isAvailable: boolean;
  isActive: boolean;
}

interface ShopServicesOfferedProps {
  categories?: ProductCategory[];
}

export function ShopServicesOffered({ categories: externalCategories }: ShopServicesOfferedProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mock categories data
  const [categories, setCategories] = useState<ProductCategory[]>(externalCategories || [
    {
      id: '1',
      categoryName: 'Refrigerator Parts',
      description: 'Complete range of refrigerator components including compressors, thermostats, and cooling units',
      productCount: '48',
      averagePrice: '1,250',
      categoryType: 'Major Components',
      isAvailable: true,
      isActive: true,
    },
    {
      id: '2',
      categoryName: 'Washing Machine Parts',
      description: 'Motors, belts, pumps, and drum components for all washing machine brands',
      productCount: '36',
      averagePrice: '890',
      categoryType: 'Mechanical Parts',
      isAvailable: true,
      isActive: true,
    },
    {
      id: '3',
      categoryName: 'Air Conditioner Parts',
      description: 'Filters, capacitors, fans, and cooling coils for AC units',
      productCount: '52',
      averagePrice: '1,450',
      categoryType: 'Cooling Components',
      isAvailable: true,
      isActive: false,
    },
    {
      id: '4',
      categoryName: 'Microwave Parts',
      description: 'Magnetrons, turntables, door switches, and control panels',
      productCount: '24',
      averagePrice: '680',
      categoryType: 'Electronic Parts',
      isAvailable: false,
      isActive: true,
    },
  ]);

  const handleSaveCategory = (categoryData: ProductCategory) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...categoryData, id: editingCategory.id } : c)));
    } else {
      // Add new category
      const newCategory = { ...categoryData, id: Date.now().toString() };
      setCategories([...categories, newCategory]);
    }
    setEditingCategory(null);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
    setOpenMenuId(null);
  };

  const handleToggleAvailability = (categoryId: string) => {
    setCategories(
      categories.map((c) => (c.id === categoryId ? { ...c, isAvailable: !c.isAvailable } : c))
    );
    setOpenMenuId(null);
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(categories.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c)));
    setOpenMenuId(null);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Refrigerator Parts': '❄️',
      'Washing Machine Parts': '🧺',
      'Air Conditioner Parts': '❄️',
      'Microwave Parts': '📻',
      'Television Parts': '📺',
      'Electric Fan Parts': '💨',
      'Oven Parts': '🔥',
      'Dishwasher Parts': '🍽️',
      'Water Heater Parts': '💧',
      'Vacuum Cleaner Parts': '🧹',
      'Dryer Parts': '🌀',
      'Coffee Maker Parts': '☕',
    };
    return iconMap[category] || '🔧';
  };

  const getCategoryTypeColor = (type: string) => {
    switch (type) {
      case 'Major Components':
        return 'bg-blue-100 text-blue-800';
      case 'Mechanical Parts':
        return 'bg-orange-100 text-orange-800';
      case 'Cooling Components':
        return 'bg-green-100 text-green-800';
      case 'Electronic Parts':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Product Categories
          </h1>
          <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Manage product categories displayed on your public shop profile and marketplace listing
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors shadow-sm"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No categories added yet
            </h3>
            <p className="text-sm text-[#6B7280] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Add your first product category to start organizing your inventory
            </p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Category</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-2xl">
                      {getCategoryIcon(category.categoryName)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {category.categoryName}
                      </h3>
                      <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        {category.productCount} products
                      </p>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {openMenuId === category.id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit Category</span>
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(category.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            {category.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                          </button>
                          <button
                            onClick={() => handleToggleActive(category.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            {category.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => handleDeleteCategory(category.id!)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            style={{ fontFamily: 'Manrope, sans-serif' }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Category</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#6B7280] mb-4 line-clamp-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {category.description}
                </p>

                {/* Category Type Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryTypeColor(
                      category.categoryType
                    )}`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {category.categoryType}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 bg-gray-50 space-y-3">
                {/* Average Price */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Average Price
                  </span>
                  <span className="text-xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₱{category.averagePrice}
                  </span>
                </div>

                {/* Product Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#6B7280]">
                    <Package className="w-4 h-4" />
                    <span className="text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Products
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {category.productCount} items
                  </span>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                  <div
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-xs font-medium ${
                      category.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {category.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                  <div
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-xs font-medium ${
                      category.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Card Footer - Public Visibility Note */}
              {category.isActive && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs text-blue-800 flex items-center space-x-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <Star className="w-3 h-3 fill-current" />
                    <span>Visible on public profile</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal - Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Category management form coming soon...
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCategory(null);
                }}
                className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCategory(null);
                }}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg font-medium hover:bg-[#2a4066] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
