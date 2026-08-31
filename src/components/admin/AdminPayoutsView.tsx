import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  RotateCw,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { AdminPayoutItem } from '../../types';

interface AdminPayoutsViewProps {
  payouts: AdminPayoutItem[];
  onApprovePayout?: (id: string) => void;
}

export const AdminPayoutsView: React.FC<AdminPayoutsViewProps> = ({
  payouts: initialPayouts,
  onApprovePayout
}) => {
  const [payoutsList, setPayoutsList] = useState<AdminPayoutItem[]>(initialPayouts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [copiedTxid, setCopiedTxid] = useState<string | null>(null);

  const statuses = ['All', 'Pending Approval', 'Processing', 'Broadcasted', 'Confirmed'];

  const filteredPayouts = payoutsList.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matches =
      p.investorName.toLowerCase().includes(q) ||
      p.investorId.toLowerCase().includes(q) ||
      p.destinationWallet.toLowerCase().includes(q) ||
      (p.txHash && p.txHash.toLowerCase().includes(q));

    if (!matches) return false;
    if (selectedStatus === 'All') return true;
    return p.status === selectedStatus;
  });

  const handleApproveSingle = (id: string) => {
    setPayoutsList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Broadcasted',
              txHash: 'e48a1c90df81e9cb14c5208479e0a6d1b28c5040182479e61234bc56789abcde',
              processedDate: 'Just now',
              approvedBy: 'Gaurav K. Sharma (Super Admin)'
            }
          : p
      )
    );
    if (onApprovePayout) onApprovePayout(id);
  };

  const handleHold = (id: string) => {
    setPayoutsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'On Hold' } : p))
    );
  };

  const handleExecuteBatch = () => {
    setBatchProcessing(true);
    setTimeout(() => {
      setPayoutsList((prev) =>
        prev.map((p) =>
          p.status === 'Pending Approval' || p.status === 'Processing'
            ? {
                ...p,
                status: 'Broadcasted',
                txHash: 'f99c2d10ea92f8da25d6319580f1b7e2c39d6151293580f72345cd6789abcdef',
                processedDate: 'Just now',
                approvedBy: 'Gaurav K. Sharma (Batch Exec)'
              }
            : p
        )
      );
      setBatchProcessing(false);
      setBatchSuccess(true);
      setTimeout(() => setBatchSuccess(false), 3000);
    }, 1500);
  };

  const handleCopyTx = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTxid(tx);
    setTimeout(() => setCopiedTxid(null), 2000);
  };

  const pendingCount = payoutsList.filter((p) => p.status === 'Pending Approval').length;
  const pendingBtc = payoutsList
    .filter((p) => p.status === 'Pending Approval')
    .reduce((sum, p) => sum + p.amountBtc, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner with Batch Action */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>DISBURSEMENT QUEUE & BLOCKCHAIN BROADCAST RELAY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investor Payout Management & Queue</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Review whitelisted destination addresses, authorize batch multi-sig broadcasts, and track mempool confirmation depths.
          </p>
        </div>

        <button
          onClick={handleExecuteBatch}
          disabled={batchProcessing || pendingCount === 0}
          className="px-5 py-3 rounded-2xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {batchProcessing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Broadcasting Batch...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Execute Batch Payout ({pendingBtc.toFixed(4)} BTC)</span>
            </>
          )}
        </button>
      </div>

      {batchSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Batch transaction successfully broadcasted to Bitcoin Mempool. TXIDs assigned.</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-gray-500 text-[11px] uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Queue Filter:
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

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by investor or address..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Payouts Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Payout ID / Date</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3 text-right">Amount (BTC)</th>
                <th className="py-3.5 px-3 text-right">Amount (USD)</th>
                <th className="py-3.5 px-3">Whitelisted Destination Wallet</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Authorization Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{p.id}</div>
                    <div className="text-[11px] text-gray-400">{p.createdDate}</div>
                  </td>

                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-semibold text-white">{p.investorName}</div>
                    <div className="text-[11px] font-mono text-gray-400">{p.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-[#F7931A]">
                    {p.amountBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    ${p.amountUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-300 truncate max-w-[200px] select-all font-mono text-[11px]">
                      {p.destinationWallet}
                    </div>
                    {p.txHash && (
                      <div className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5">
                        <span>TX: {p.txHash.slice(0, 10)}...</span>
                        <button
                          onClick={() => handleCopyTx(p.txHash!)}
                          className="hover:text-purple-300 cursor-pointer"
                        >
                          {copiedTxid === p.txHash ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      p.status === 'Broadcasted' ? 'bg-blue-500/20 text-blue-300' :
                      p.status === 'Pending Approval' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {p.status === 'Pending Approval' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApproveSingle(p.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold font-mono transition-colors cursor-pointer border border-emerald-500/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleHold(p.id)}
                          className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer"
                        >
                          Hold
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400 font-mono">
                        {p.approvedBy ? `By ${p.approvedBy.split(' ')[0]}` : 'Automated'}
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
