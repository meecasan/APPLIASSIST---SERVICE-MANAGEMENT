import React from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

interface StockHistoryDetailProps {
  productName: string;
  productCode: string;
  onBack: () => void;
}

interface HistoryEntry {
  id: string;
  reference: string;
  date: string;
  stockDateTime: string;
  quantity: number;
  inStock: number;
  unit: string;
}

export function StockHistoryDetail({ productName, productCode, onBack }: StockHistoryDetailProps) {
  // Mock stock summary data
  const stockSummary = {
    currentStock: 36,
    totalReceived: 90,
    totalIssued: 54,
  };

  // Mock history data
  const allHistory: HistoryEntry[] = [
    { id: '1', reference: 'INV-2025-001', date: '10/16/2025', stockDateTime: '10/16/2025 4:47:00 pm', quantity: 50, inStock: 50, unit: 'PC' },
    { id: '2', reference: 'INV-2025-001', date: '10/17/2025', stockDateTime: '10/17/2025 9:47:00 am', quantity: -5, inStock: 45, unit: 'PC' },
    { id: '3', reference: 'INV-2025-001', date: '10/17/2025', stockDateTime: '10/17/2025 11:30:00 am', quantity: -8, inStock: 37, unit: 'PC' },
    { id: '4', reference: 'INV-2025-001', date: '10/18/2025', stockDateTime: '10/18/2025 1:30:00 pm', quantity: -20, inStock: 17, unit: 'PC' },
    { id: '5', reference: 'INV-2025-001', date: '10/20/2025', stockDateTime: '10/20/2025 9:47:00 am', quantity: -7, inStock: 10, unit: 'PC' },
    { id: '6', reference: 'INV-2025-001', date: '10/21/2025', stockDateTime: '10/21/2025 10:15:00 am', quantity: 30, inStock: 40, unit: 'PC' },
    { id: '7', reference: 'INV-2025-001', date: '10/21/2025', stockDateTime: '10/21/2025 2:20:00 pm', quantity: 3, inStock: 43, unit: 'PC' },
    { id: '8', reference: 'INV-2025-001', date: '10/21/2025', stockDateTime: '10/21/2025 4:47:00 pm', quantity: 7, inStock: 50, unit: 'PC' },
    { id: '9', reference: 'INV-2025-001', date: '10/22/2025', stockDateTime: '10/22/2025 11:00:00 am', quantity: -12, inStock: 38, unit: 'PC' },
    { id: '10', reference: 'INV-2025-001', date: '10/23/2025', stockDateTime: '10/23/2025 3:15:00 pm', quantity: -2, inStock: 36, unit: 'PC' },
  ];

  const handleRefresh = () => {
    // Simulate refresh action
    console.log('Refreshing stock history...');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1E2F4F] hover:text-[#2a4066] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Back to Inventory
          </span>
        </button>
        <h1 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {productName.toUpperCase()} – Stock History
        </h1>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Card 1 - Current Stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Current Stock
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stockSummary.currentStock}
          </p>
          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Pieces
          </p>
        </div>

        {/* Card 2 - Total Received */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Total Received
            </h3>
            <ArrowUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stockSummary.totalReceived}
          </p>
          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Pieces
          </p>
        </div>

        {/* Card 3 - Total Issued */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Total Issued
            </h3>
            <ArrowDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stockSummary.totalIssued}
          </p>
          <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Pieces
          </p>
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Controls */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          {/* Left - Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stock History Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Reference
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Stock Date & Time
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
                  In Stock
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allHistory.length > 0 ? (
                allHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {entry.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {entry.date}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {entry.stockDateTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          entry.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {entry.inStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {entry.unit}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      No history found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}