import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { AdminInvestmentTransaction } from '../../types';

interface AdminTransactionsViewProps {
  transactions: AdminInvestmentTransaction[];
  onApproveTransaction?: (id: string) => void;
}

export const AdminTransactionsView: React.FC<AdminTransactionsViewProps> = ({
  transactions: initialTransactions,
  onApproveTransaction
}) => {
  const [txns, setTxns] = useState<AdminInvestmentTransaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const statuses = ['All', 'Pending', 'Payment Received', 'Verified', 'Allocated', 'Active'];

  const filteredTxns = txns.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      t.investorName.toLowerCase().includes(query) ||
      t.investmentId.toLowerCase().includes(query) ||
      t.paymentReference.toLowerCase().includes(query) ||
      t.planName.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (selectedStatus === 'All') return true;
    return t.status === selectedStatus;
  });

  const handleAdvanceStatus = (id: string) => {
    setTxns((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        let nextStatus = t.status;
        if (t.status === 'Pending') nextStatus = 'Payment Received';
        else if (t.status === 'Payment Received') nextStatus = 'Verified';
        else if (t.status === 'Verified') nextStatus = 'Allocated';
        else if (t.status === 'Allocated') nextStatus = 'Active';

        return {
          ...t,
          status: nextStatus,
          adminApprovedBy: 'Gaurav K. Sharma',
          verifiedAt: 'Just now'
        };
      })
    );
    if (onApproveTransaction) onApproveTransaction(id);
  };

  const getStatusBadge = (status: AdminInvestmentTransaction['status']) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">Active</span>;
      case 'Allocated':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">Allocated</span>;
      case 'Verified':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">Verified</span>;
      case 'Payment Received':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">Payment Received</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full bg-gray-700 text-gray-300 font-mono text-[10px] font-bold">Pending Wire</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 font-mono text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Status Sequence Guide */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Investment Capital Transactions</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Multi-step capital verification pipeline from escrow receipt to ASIC hashrate assignment.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by investor, ID, ref..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Workflow Chain Visualizer */}
        <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800/80 flex items-center justify-between overflow-x-auto text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Pending</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Payment Received</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Verified</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">4</span>
            <span>Allocated</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">5</span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-gray-500 text-[11px] uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === s
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Txn ID / Date</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3">Plan / Hashrate</th>
                <th className="py-3.5 px-3 text-right">Amount</th>
                <th className="py-3.5 px-3">Method & Ref</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Admin Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{t.id}</div>
                    <div className="text-[11px] text-gray-400">{t.date}</div>
                  </td>

                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-semibold text-white">{t.investorName}</div>
                    <div className="text-[11px] font-mono text-gray-400">{t.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-200">{t.planName}</div>
                    <div className="text-[11px] text-[#F7931A] font-bold">{t.hashrateAllocationTH} TH/s Assigned</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="font-extrabold text-white text-sm">
                      ${t.amountUsd.toLocaleString()}
                    </div>
                    {t.amountBtc && (
                      <div className="text-[11px] text-[#F7931A]">{t.amountBtc} BTC</div>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-300">{t.paymentMethod}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{t.paymentReference}</div>
                  </td>

                  <td className="py-3.5 px-3">{getStatusBadge(t.status)}</td>

                  <td className="py-3.5 px-4 text-center">
                    {t.status !== 'Active' ? (
                      <button
                        onClick={() => handleAdvanceStatus(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-colors cursor-pointer border border-emerald-500/30"
                      >
                        Advance →
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fully Active</span>
                      </div>
                    )}
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
