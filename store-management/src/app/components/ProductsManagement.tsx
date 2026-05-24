import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { DeleteProductModal } from './DeleteProductModal';
import { productsAPI } from '../services/api-extended';

interface Product {
  id: string | number;
  code?: string;
  part_id?: number;
  part_name?: string;
  name?: string;
  category: string;
  stock?: number;
  stock_quantity?: number;
  price: number;
  status?: 'in-stock' | 'low-stock' | 'out-of-stock' | string;
  unit?: string;
  description?: string;
  imageIcon?: string;
  part_number?: string;
}

interface ProductsManagementProps {
  isReadOnly?: boolean; // For technician role
}

export function ProductsManagement({ isReadOnly = false }: ProductsManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<{ id: string | number; name: string } | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsAPI.listProducts({ limit: 100 });
      
      // Transform API response to component format
      const transformedProducts = Array.isArray(data) ? data.map((p: any) => ({
        id: p.part_id || p.id,
        code: p.part_number || `PART-${p.part_id}`,
        part_id: p.part_id,
        part_name: p.part_name,
        name: p.part_name,
        category: p.category,
        stock: p.stock_quantity,
        stock_quantity: p.stock_quantity,
        price: p.price,
        status: p.status || (p.stock_quantity > 10 ? 'in-stock' : p.stock_quantity > 0 ? 'low-stock' : 'out-of-stock'),
        description: p.description,
      })) : [];
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      // Fallback to empty array so UI doesn't break
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product added - refetch list
  const handleProductAdded = () => {
    fetchProducts();
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            In Stock
          </span>
        );
      case 'low-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Low Stock
          </span>
        );
      case 'out-of-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={editProduct !== null}
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onUpdate={async (productData) => {
          try {
            // Update product via API
            await productsAPI.updateProduct(Number(productData.id), {
              part_name: productData.productName,
              price: parseFloat(productData.startingPrice),
              description: productData.description,
            });

            // Refresh product list
            fetchProducts();
            setEditProduct(null);
          } catch (err) {
            console.error('Error updating product:', err);
          }
        }}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        isOpen={deleteProduct !== null}
        productName={deleteProduct?.name || ''}
        onConfirm={async () => {
          try {
            if (deleteProduct) {
              // Delete product via API
              await productsAPI.deleteProduct(Number(deleteProduct.id));
              // Remove the product from the state
              setProducts(prevProducts => prevProducts.filter(p => p.id !== deleteProduct.id));
              setDeleteProduct(null);
            }
          } catch (err) {
            console.error('Error deleting product:', err);
          }
        }}
        onCancel={() => setDeleteProduct(null)}
      />

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewProduct(null)} />

          {/* Modal */}
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Product Details
              </h2>
              <button
                onClick={() => setViewProduct(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left - Image */}
                <div className="flex items-center justify-center">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-8xl">{viewProduct.imageIcon || '📦'}</span>
                  </div>
                </div>

                {/* Right - Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {viewProduct.name}
                    </h3>
                    <p className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      SKU: {viewProduct.code}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Category:</span>
                      <span className="text-sm text-gray-900">{viewProduct.category}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Stock:</span>
                      <span className="text-sm text-gray-900">{viewProduct.stock} units</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Unit:</span>
                      <span className="text-sm text-gray-900">{viewProduct.unit || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Price:</span>
                      <span className="text-2xl font-bold text-[#1E2F4F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ₱{(typeof viewProduct.price === 'number' ? viewProduct.price : parseFloat(viewProduct.price) || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Status:</span>
                      {getStatusBadge(viewProduct.status)}
                    </div>
                  </div>

                  {viewProduct.description && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Description:</h4>
                      <p className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {viewProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="px-6 py-2.5 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] font-semibold transition-all"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Products Management
        </h1>
        <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Manage your product inventory
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Top Controls */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              {!isReadOnly && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#1E2F4F] text-white rounded-lg hover:bg-[#2a4066] transition-colors" 
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              )}
              
              <div className={`relative ${isReadOnly ? 'ml-auto' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Products Table */}
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <p className="text-red-600">Error: {error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Status
                      </th>
                      {!isReadOnly && (
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.slice(0, rowsPerPage).map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            <span className="text-2xl">{product.imageIcon || '📦'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          <button
                            onClick={() => setViewProduct(product)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left transition-colors"
                          >
                            {product.name || product.part_name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {product.stock || product.stock_quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          ₱{(typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(product.status)}
                        </td>
                        {!isReadOnly && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-3">
                              <button
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit"
                                onClick={() => setEditProduct(product)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                                onClick={() => setDeleteProduct({ id: product.id, name: product.name || product.part_name })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <label className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Show
                </label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Showing 1–{Math.min(rowsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-[#1E2F4F] text-white rounded-lg text-sm font-medium hover:bg-[#2a4066] transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  1
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  2
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
    </div>
  );
}