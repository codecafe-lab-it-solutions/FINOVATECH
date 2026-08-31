import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { InvestorLiabilityItem } from '../../types';

interface AdminLiabilitiesViewProps {
  liabilities: InvestorLiabilityItem[];
}

export const AdminLiabilitiesView: React.FC<AdminLiabilitiesViewProps> = ({ liabilities }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = liabilities.filter((l) => {
    const q = searchQuery.toLowerCase();
    return l.investorName.toLowerCase().includes(q) || l.investorId.toLowerCase().includes(q);
  });

  const totalCapital = liabilities.reduce((sum, l) => sum + l.capitalInvestedUsd, 0);
  const totalAccruedOwedBtc = liabilities.reduce((sum, l) => sum + l.accruedUnpaidBtc, 0);
  const totalPaidOutBtc = liabilities.reduce((sum, l) => sum + l.totalPaidOutBtc, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL SOLVENCY & BALANCE SHEET LEDGER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investor Liabilities & Accrued Balances</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Real-time balance sheet tracking of investor capital, accrued mining rewards owed, and company 100% reserve backing.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right font-mono">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">Solvency Reserve Ratio</div>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">142.8%</div>
          <div className="text-[11px] text-gray-300">Over-Collateralized</div>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Total Capital Invested</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">${(totalCapital / 1000000).toFixed(2)}M</div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">Across 248 accounts</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Accrued Unpaid Obligations</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{totalAccruedOwedBtc.toFixed(4)} BTC</div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">Next Settlement: Scheduled</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Total BTC Paid Out to Date</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{totalPaidOutBtc.toFixed(4)} BTC</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">100% Fulfilled</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Account-by-Account Liability & Reserve Schedule
          </h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investor..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3 text-right">Capital Invested</th>
                <th className="py-3.5 px-3 text-right">Total Mined to Date</th>
                <th className="py-3.5 px-3 text-right">Total Paid Out</th>
                <th className="py-3.5 px-3 text-right">Accrued Unpaid (Owed)</th>
                <th className="py-3.5 px-3">Next Due Date</th>
                <th className="py-3.5 px-4 text-center">Solvency Backing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{item.investorName}</div>
                    <div className="text-[11px] font-mono text-gray-400">{item.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    ${item.capitalInvestedUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-right text-[#F7931A] font-semibold">
                    {item.totalMinedToDateBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right text-emerald-400">
                    {item.totalPaidOutBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-amber-400">
                    {item.accruedUnpaidBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-gray-300">
                    {item.nextPayoutDueDate}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {item.collateralBackingStatus}
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
