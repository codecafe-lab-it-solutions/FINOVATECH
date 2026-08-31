import React from 'react';
import {
  Server,
  Activity,
  Zap,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Layers
} from 'lucide-react';
import { MiningPoolItem } from '../../types';

interface AdminPoolsViewProps {
  pools: MiningPoolItem[];
}

export const AdminPoolsView: React.FC<AdminPoolsViewProps> = ({ pools }) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Connected Mining Pools & Reconciliations</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time Stratum v2 connections, share validity verification, and automated FPPS/PPLNS pool payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Stratum Latency: 18ms</span>
          </span>
        </div>
      </div>

      {/* Pool Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{pool.poolName}</h3>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                    {pool.payoutScheme}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#F7931A] mt-0.5">{pool.accountName}</div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{pool.connectionStatus}</span>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 text-center font-mono text-xs">
              <div>
                <div className="text-[10px] text-gray-400 uppercase">Live Hashrate</div>
                <div className="text-base font-bold text-[#F7931A] mt-0.5">{pool.hashratePH} PH/s</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase">Active Workers</div>
                <div className="text-base font-bold text-white mt-0.5">{pool.activeWorkers} Units</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase">Valid Shares</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{pool.validSharesPercent}%</div>
              </div>
            </div>

            {/* Reconciliation Detail rows */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">BTC Earned (Last 24h):</span>
                <span className="text-white font-bold">{pool.btcEarned24h} BTC</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">BTC Earned (Month-to-Date):</span>
                <span className="text-emerald-400 font-bold">{pool.btcEarnedMonth} BTC</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Pool Fee Rate:</span>
                <span className="text-gray-200">{pool.poolFeePercent}% FPPS</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Last Pool Payout Settlement:</span>
                <span className="text-amber-400">{pool.lastPayoutDate} ({pool.lastPayoutBtc} BTC)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Stratum Endpoint:</span>
                <span className="text-gray-400 font-mono text-[11px] truncate max-w-[200px]">{pool.stratumUrl}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
