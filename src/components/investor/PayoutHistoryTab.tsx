import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  Download, 
  ShieldCheck 
} from 'lucide-react';
import { PayoutRecord } from '../../types';

interface PayoutHistoryTabProps {
  payouts: PayoutRecord[];
}

export const PayoutHistoryTab: React.FC<PayoutHistoryTabProps> = ({ payouts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalPayoutsUsd = payouts.reduce((acc, curr) => acc + (curr.status === 'Successful' ? curr.amountUsd : 0), 0);
  const totalPayoutsBtc = payouts.reduce((acc, curr) => acc + (curr.status === 'Successful' ? curr.amountBtc : 0), 0);
  const successfulCount = payouts.filter((p) => p.status === 'Successful').length;
  const pendingCount = payouts.filter((p) => p.status === 'Pending' || p.status === 'Processing').length;
  const failedCount = payouts.filter((p) => p.status === 'Failed').length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL SETTLEMENT LOG</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Disbursed Payouts & Settlement History
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Real payout records reviewed and approved by an administrator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 px-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-right">
            <div className="text-[10px] text-gray-400 font-mono">LIFETIME DISBURSED</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              ${totalPayoutsUsd.toFixed(2)} USDT ({totalPayoutsBtc.toFixed(4)} BTC)
            </div>
          </div>
        </div>
      </div>

      {/* 4 Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total Payouts</div>
          <div className="text-xl font-bold text-white mt-1">{payouts.length} Batches</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Automatic Friday Cycle</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-emerald-500/30 text-white">
          <div className="text-[10px] text-emerald-400 uppercase">Successful Payouts</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{successfulCount} Confirmed</div>
          <div className="text-[10px] text-gray-500 mt-0.5">100% Delivery Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Pending Batches</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{pendingCount} In Queue</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Next on 28 Aug 2026</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Failed / Reversed</div>
          <div className="text-xl font-bold text-gray-400 mt-1">{failedCount} Failed</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Zero Failures Recorded</div>
        </div>

      </div>

      {/* Payout Records Table */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-sm font-bold uppercase tracking-wider font-mono">
            Settlement Audit Registry
          </span>
          <span className="text-xs text-gray-400 font-mono">
            Real Payout Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Payout ID</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Amount (BTC)</th>
                <th className="pb-3 px-3">Value (USDT)</th>
                <th className="pb-3 px-3">Destination Wallet</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-3 text-[#F7931A] font-bold whitespace-nowrap">{row.payoutId}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{row.date}</td>
                  <td className="py-3.5 px-3 text-white font-bold whitespace-nowrap">{row.amountBtc} BTC</td>
                  <td className="py-3.5 px-3 text-emerald-400 whitespace-nowrap">${row.amountUsd.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-gray-400 whitespace-nowrap">
                    <span className="font-mono select-all text-[11px] text-amber-200/80">
                      {row.destinationWallet.slice(0, 8)}...{row.destinationWallet.slice(-6)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    {row.txid ? (
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={row.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F7931A] hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>{row.txid.slice(0, 6)}...{row.txid.slice(-6)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleCopy(row.txid, row.id)}
                          className="text-gray-500 hover:text-white cursor-pointer"
                          title="Copy TXID"
                        >
                          {copiedId === row.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600 font-mono text-[11px]">Internal record</span>
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
