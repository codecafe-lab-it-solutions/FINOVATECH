import React, { useState, useMemo } from 'react';
import { History, Filter, Zap, DollarSign, CheckCircle2 } from 'lucide-react';
import { ApiEarningRow } from '../../lib/api';

interface EarningsMiningHistoryTabProps {
  earnings: ApiEarningRow[];
}

export const EarningsMiningHistoryTab: React.FC<EarningsMiningHistoryTabProps> = ({ earnings }) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7days' | '30days'>('all');

  const filtered = useMemo(() => {
    if (filterPeriod === 'all') return earnings;
    const days = filterPeriod === '7days' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return earnings.filter((e) => new Date(e.date.replace(' ', 'T')).getTime() >= cutoff);
  }, [earnings, filterPeriod]);

  const totalBtc = filtered.reduce((sum, e) => sum + e.amountBtc, 0);
  const totalUsd = filtered.reduce((sum, e) => sum + e.amountUsd, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 sm:p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <History className="w-3.5 h-3.5" />
            <span>MINING EARNINGS LOG</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Earnings / Mining Log</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real mining credit transactions from your wallet ledger — {earnings.length} record{earnings.length === 1 ? '' : 's'} total.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          {(['all', '7days', '30days'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriod(p)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
                filterPeriod === p ? 'bg-[#F7931A] text-gray-950 font-bold' : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
              }`}
            >
              {p === 'all' ? 'All Time' : p === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[11px] font-mono text-gray-400 uppercase flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400" /> Total BTC Mined</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">{totalBtc.toFixed(8)} BTC</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[11px] font-mono text-gray-400 uppercase flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#F7931A]" /> Total Value</div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-950/60 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-3 text-right">BTC Mined</th>
                <th className="py-3.5 px-3 text-right">USDT Value</th>
                <th className="py-3.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 text-gray-400">{e.date}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">+{e.amountBtc} BTC</td>
                  <td className="py-3 px-3 text-right text-white">${e.amountUsd.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500 font-mono">No mining earnings recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
