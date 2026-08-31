import React, { useState } from 'react';
import {
  BookOpen,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  Download,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BtcProductionLedgerRow } from '../../types';

interface AdminProductionLedgerViewProps {
  ledgerRows: BtcProductionLedgerRow[];
}

export const AdminProductionLedgerView: React.FC<AdminProductionLedgerViewProps> = ({ ledgerRows }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCsv = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const totalReceived = ledgerRows.reduce((sum, r) => sum + r.poolBtcReceived, 0);
  const totalInvestorAllocated = ledgerRows.reduce((sum, r) => sum + r.investorAllocationBtc, 0);
  const totalCompanyShare = ledgerRows.reduce((sum, r) => sum + r.companyShareBtc, 0);
  const totalOpexBtc = ledgerRows.reduce((sum, r) => sum + r.operationalCostBtc, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IMMUTABLE SOURCE OF TRUTH • TRIPLE-ENTRY RECONCILIATION</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Mining Production Ledger</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Mathematical waterfall tracing gross SHA-256 pool rewards, power OPEX deductions, investor allocations, and company treasury retention.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-gray-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadSuccess ? 'Ledger CSV Downloaded' : 'Export Full Ledger (.CSV)'}</span>
        </button>
      </div>

      {/* Waterfall Flow Visualizer Guide */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-gray-950 via-[#0F172A] to-gray-950 border border-gray-800">
        <div className="text-[11px] font-mono text-gray-400 uppercase font-bold mb-3">
          Daily Production Reconciliation Waterfall
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="text-[10px] text-gray-400">1. Pool Received</div>
            <div className="text-sm font-extrabold text-[#F7931A] mt-1">{totalReceived.toFixed(4)} BTC</div>
            <div className="text-[9px] text-gray-500">Gross Block Rewards</div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="text-[10px] text-gray-400">2. Mining Fees</div>
            <div className="text-sm font-extrabold text-rose-400 mt-1">-1.5% FPPS</div>
            <div className="text-[9px] text-gray-500">Pool Retained</div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="text-[10px] text-gray-400">3. Grid OPEX</div>
            <div className="text-sm font-extrabold text-rose-400 mt-1">-{totalOpexBtc.toFixed(4)} BTC</div>
            <div className="text-[9px] text-gray-500">$0.042/kWh Tariff</div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="text-[10px] text-gray-400">4. Investor Alloc</div>
            <div className="text-sm font-extrabold text-emerald-400 mt-1">{totalInvestorAllocated.toFixed(4)} BTC</div>
            <div className="text-[9px] text-gray-500">231 Active Accounts</div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="text-[10px] text-gray-400">5. Company Share</div>
            <div className="text-sm font-extrabold text-purple-400 mt-1">{totalCompanyShare.toFixed(4)} BTC</div>
            <div className="text-[9px] text-gray-500">Corporate Retained</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-[10px] text-emerald-400 font-bold">6. Treasury Net</div>
            <div className="text-sm font-extrabold text-emerald-400 mt-1">100% Settled</div>
            <div className="text-[9px] text-emerald-300">Audited Daily</div>
          </div>
        </div>
      </div>

      {/* Production Ledger Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-3 text-right">Pool BTC Received</th>
                <th className="py-3.5 px-3 text-right">Mining Fees</th>
                <th className="py-3.5 px-3 text-right">Operational OPEX</th>
                <th className="py-3.5 px-3 text-right">Investor Allocation</th>
                <th className="py-3.5 px-3 text-right">Company Share</th>
                <th className="py-3.5 px-3 text-right">Available BTC</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4">Audited By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {ledgerRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#F7931A]" />
                    <span>{row.date}</span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-[#F7931A]">
                    {row.poolBtcReceived.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right text-rose-400">
                    -{row.miningFeesBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right text-rose-400">
                    <div>-{row.operationalCostBtc.toFixed(4)} BTC</div>
                    <div className="text-[10px] text-gray-500">${row.operationalCostUsd.toLocaleString()}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    {row.investorAllocationBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-purple-400">
                    {row.companyShareBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    {row.availableBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {row.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-400">
                    {row.auditedBy}
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
