import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Search,
  RotateCw,
  XCircle
} from 'lucide-react';
import { ApiPayout, fetchAdminPayouts, updateAdminPayoutStatus } from '../../lib/api';

interface AdminPayoutsViewProps {
  authToken: string;
}

export const AdminPayoutsView: React.FC<AdminPayoutsViewProps> = ({ authToken }) => {
  const [payouts, setPayouts] = useState<ApiPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const statuses = ['All', 'Requested', 'Processing', 'Completed', 'Rejected'];

  const loadPayouts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { payouts: list } = await fetchAdminPayouts(authToken);
      setPayouts(list);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load payouts.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const filteredPayouts = payouts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matches =
      (p.investorName || '').toLowerCase().includes(q) ||
      p.destinationWallet.toLowerCase().includes(q);

    if (!matches) return false;
    if (selectedStatus === 'All') return true;
    return p.status === selectedStatus;
  });

  const handleUpdateStatus = async (id: string, status: ApiPayout['status']) => {
    setProcessingId(id);
    try {
      const { payout } = await updateAdminPayoutStatus(authToken, id, status);
      setPayouts((prev) => prev.map((p) => (p.id === id ? payout : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update payout.');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = payouts.filter((p) => p.status === 'Requested').length;
  const pendingBtc = payouts.filter((p) => p.status === 'Requested').reduce((sum, p) => sum + p.amountBtc, 0);

  return (
    <div className="space-y-6 pb-12">

      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>INVESTOR PAYOUT REQUESTS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investor Payout Management & Queue</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            {isLoading
              ? 'Loading...'
              : `${pendingCount} request${pendingCount === 1 ? '' : 's'} awaiting review, totaling ${pendingBtc.toFixed(4)} BTC.`}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
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
                <th className="py-3.5 px-4">Requested</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3 text-right">Amount (BTC)</th>
                <th className="py-3.5 px-3">Destination Wallet</th>
                <th className="py-3.5 px-3">Network</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-[11px] text-gray-400">{p.requestedAt}</td>

                  <td className="py-3.5 px-3 font-sans font-semibold text-white">{p.investorName || 'Unknown'}</td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-[#F7931A]">
                    {p.amountBtc} BTC
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-300 truncate max-w-[220px] select-all font-mono text-[11px]">
                      {p.destinationWallet}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400 text-[11px] font-bold">
                    {p.network || '—'}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      p.status === 'Processing' ? 'bg-blue-500/20 text-blue-300' :
                      p.status === 'Requested' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {(p.status === 'Requested' || p.status === 'Processing') ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          disabled={processingId === p.id}
                          onClick={() => handleUpdateStatus(p.id, 'Completed')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold font-mono transition-colors cursor-pointer border border-emerald-500/30 disabled:opacity-50"
                        >
                          {processingId === p.id ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                        </button>
                        <button
                          disabled={processingId === p.id}
                          onClick={() => handleUpdateStatus(p.id, 'Rejected')}
                          className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400 font-mono flex items-center justify-center gap-1">
                        {p.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {p.processedAt || '—'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-mono">No payout requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
