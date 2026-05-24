import React, { useState, useEffect } from 'react';
import { Search, Eye, Pencil, Folder, ChevronRight, AlertCircle } from 'lucide-react';
import { StockHistoryDetail } from './StockHistoryDetail';
import { UpdateStockModal } from './UpdateStockModal';
import { StockUpdateSuccessModal } from './StockUpdateSuccessModal';
import { onStockUpdated, offStockUpdated } from '../services/realtime';
import { productsAPI } from '../services/api-extended';

interface StocksManagementProps {
  isReadOnly?: boolean;
}

interface Product {
  id: string | number;
  part_id?: number;
  code: string;
  part_number?: string;
  name: string;
  part_name?: string;
  category: string;
  quantity: number;
  stock_quantity?: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  price?: number;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
}

export function StocksManagement({ isReadOnly = false }: StocksManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState<Product | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Real products data - fetched from API
  const [allProducts, setAllProducts] = useState<Product[]>([]);


  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsAPI.listProducts({ limit: 100 });
      
      // Transform API response to component format
      const transformedProducts = Array.isArray(data) ? data.map((p: any) => ({
        id: p.part_id || p.id,
        part_id: p.part_id,
        code: p.part_number || `PART-${p.part_id}`,
        part_number: p.part_number,
        name: p.part_name,
        part_name: p.part_name,
        category: p.category,
        quantity: p.stock_quantity,
        stock_quantity: p.stock_quantity,
        price: p.price,
        status: p.status || (p.stock_quantity > 10 ? 'in-stock' : p.stock_quantity > 0 ? 'low-stock' : 'out-of-stock'),
        description: p.description,
      })) : [];
      
      setAllProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Subscribe to real-time stock updates
  useEffect(() => {
    const handleStockUpdated = (product: any) => {
      setAllProducts((prev) =>
        prev.map((p) => p.id === String(product.product_id) 
          ? { 
              ...p, 
              quantity: product.stock_quantity, 
              stock_quantity: product.stock_quantity,
              status: product.stock_quantity === 0 ? 'out-of-stock' : product.stock_quantity < 10 ? 'low-stock' : 'in-stock' 
            } 
          : p)
      );
    };

    onStockUpdated(handleStockUpdated);

    return () => {
      offStockUpdated(handleStockUpdated);
    };
  }, []);

  // Extract unique categories from products
  const getCategoriesFromProducts = (): Category[] => {
    const categoryMap = new Map<string, number>();
    allProducts.forEach(product => {
      const cat = product.category;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      productCount: count,
    }));
  };

  const categories = getCategoriesFromProducts();

  // Filter products based on selected category and search query
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    setCurrentPage(1);
  };

  const handleUpdateStock = async (productId: string | number, newQuantity: number) => {
    try {
      setIsUpdating(true);
      const product = allProducts.find(p => String(p.id) === String(productId));
      if (!product) {
        setError('Product not found');
        return;
      }

      // Update stock via API
      await productsAPI.updateProduct(Number(productId), { stock_quantity: newQuantity });

      // Update local state
      setAllProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(productId)
            ? {
                ...p,
                quantity: newQuantity,
                stock_quantity: newQuantity,
                status: newQuantity === 0 ? 'out-of-stock' : newQuantity < 10 ? 'low-stock' : 'in-stock',
              }
            : p
        )
      );

      setUpdatingProduct(null);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  // If viewing a product's stock history, show the detail view
  if (viewingProduct) {
    return (
      <StockHistoryDetail
        productName={viewingProduct.name}
        productCode={viewingProduct.code}
        onBack={() => setViewingProduct(null)}
      />
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          STOCKS MANAGEMENT
        </h1>
        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Manage your stock inventory
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm text-red-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#1E2F4F] rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Loading inventory...
            </p>
          </div>
        </div>
      ) : (
        <>
      {/* Two Panel Layout */}
      <div className="flex gap-6">
        {/* Left Panel - Product Categories */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Category Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Product Categories
              </h2>
              <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Browse by category
              </p>
            </div>

            {/* Category List */}
            <div className="p-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl mb-3 transition-all ${
                    selectedCategory === category.name
                      ? 'bg-[#1E2F4F] text-white shadow-md'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder
                      className={`w-5 h-5 ${
                        selectedCategory === category.name ? 'text-white' : 'text-[#6B7280]'
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium text-sm mb-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {category.name}
                      </p>
                      <p
                        className={`text-xs ${
                          selectedCategory === category.name ? 'text-white/80' : 'text-[#6B7280]'
                        }`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {category.productCount} products
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      selectedCategory === category.name ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Panel - Inventory Table */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Section Header with Search */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                FULL INVENTORY LIST
              </h2>

              {/* Search Input */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Code
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Product Name
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Category
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Quantity
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {product.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {product.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              product.status
                            )}`}
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {getStatusText(product.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="View"
                              onClick={() => setViewingProduct(product)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!isReadOnly && (
                              <button
                                className="text-green-600 hover:text-green-800 transition-colors"
                                title="Edit"
                                onClick={() => setUpdatingProduct(product)}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          No products found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalProducts > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Show
                  </span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2F4F] focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Showing text */}
                <div>
                  <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Showing {startIndex + 1}–{endIndex} of {totalProducts}
                  </p>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#1E2F4F] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {/* Update Stock Modal */}
      {updatingProduct && (
        <UpdateStockModal
          isOpen={!!updatingProduct}
          product={updatingProduct}
          onClose={() => setUpdatingProduct(null)}
          onUpdate={handleUpdateStock}
        />
      )}

      {/* Stock Update Success Modal */}
      {showSuccessModal && (
        <StockUpdateSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setUpdatingProduct(null);
          }}
        />
      )}
    </div>
  );
}