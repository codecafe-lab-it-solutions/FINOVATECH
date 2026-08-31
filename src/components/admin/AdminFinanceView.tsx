import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Download,
  Filter
} from 'lucide-react';
import { AdminFinanceRecord } from '../../types';

interface AdminFinanceViewProps {
  financeRecords: AdminFinanceRecord[];
}

export const AdminFinanceView: React.FC<AdminFinanceViewProps> = ({ financeRecords }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BTC'>('USD');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const latest = financeRecords[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Corporate Finance & P&L Statement</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Consolidated Profit & Loss accounting: Gross mining yield, institutional management fees, energy tariffs, and EBITDA margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="p-1 rounded-xl bg-gray-900 border border-gray-800 flex items-center font-mono text-xs">
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCurrency === 'USD' ? 'bg-[#F7931A] text-gray-950 font-bold' : 'text-gray-400'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setSelectedCurrency('BTC')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCurrency === 'BTC' ? 'bg-[#F7931A] text-gray-950 font-bold' : 'text-gray-400'
              }`}
            >
              BTC (₿)
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded' : 'Export P&L'}</span>
          </button>
        </div>
      </div>

      {/* Latest Month High-Level KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Card */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400">Total Revenue ({latest.month})</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {selectedCurrency === 'USD' ? `$${latest.totalRevenueUsd.toLocaleString()}` : `${latest.totalRevenueBtc} BTC`}
          </div>
          <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-gray-800">
            <div className="flex justify-between text-gray-300">
              <span>Mining Revenue:</span>
              <span>${latest.miningRevenueUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Management Fees:</span>
              <span>${latest.managementFeesUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Setup / Onboarding Fees:</span>
              <span>${latest.setupFeesUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400">Total OPEX ({latest.month})</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {selectedCurrency === 'USD' ? `$${latest.totalExpensesUsd.toLocaleString()}` : '1.436 BTC'}
          </div>
          <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-gray-800">
            <div className="flex justify-between text-gray-300">
              <span>Electricity & Power:</span>
              <span>${latest.electricityCostUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Hosting & Facility:</span>
              <span>${latest.hostingCostUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Maintenance & ASIC Parts:</span>
              <span>${latest.maintenanceCostUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>General & Admin:</span>
              <span>${latest.adminCostUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="p-6 rounded-3xl bg-linear-to-b from-[#0F172A] to-gray-950 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">Net Profit Margin</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              {latest.profitMarginPercent}% EBITDA
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {selectedCurrency === 'USD' ? `$${latest.netProfitUsd.toLocaleString()}` : `${latest.netProfitBtc} BTC`}
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
            Corporate treasury retained cashflow after complete investor distribution and energy settlement.
          </div>
        </div>

      </div>

      {/* Historical P&L Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Historical Monthly P&L Ledger (2026)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-3 text-right">Total Revenue</th>
                <th className="py-3.5 px-3 text-right">Electricity Cost</th>
                <th className="py-3.5 px-3 text-right">Facility & Maint</th>
                <th className="py-3.5 px-3 text-right">Total OPEX</th>
                <th className="py-3.5 px-3 text-right">Net Profit</th>
                <th className="py-3.5 px-4 text-center">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {financeRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{rec.month}</td>
                  <td className="py-3.5 px-3 text-right font-semibold text-emerald-400">
                    ${rec.totalRevenueUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right text-rose-400">
                    -${rec.electricityCostUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right text-gray-300">
                    -${(rec.hostingCostUsd + rec.maintenanceCostUsd).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right text-rose-400">
                    -${rec.totalExpensesUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-white text-sm">
                    ${rec.netProfitUsd.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {rec.profitMarginPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
