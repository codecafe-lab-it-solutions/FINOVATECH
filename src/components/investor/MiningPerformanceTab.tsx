import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Server, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Clock, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { MINING_HISTORICAL_CHART_DATA } from '../../data/investorData';
import { InvestorOverviewMetrics } from '../../types';

interface MiningPerformanceTabProps {
  metrics: InvestorOverviewMetrics;
}

export const MiningPerformanceTab: React.FC<MiningPerformanceTabProps> = ({ metrics }) => {
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs font-mono text-white shadow-xl space-y-1">
          <div className="text-gray-400 font-bold">{label} 2026</div>
          {payload.map((item: any, idx: number) => (
            <div key={idx} style={{ color: item.color }} className="flex justify-between gap-4">
              <span>{item.name}:</span>
              <span className="font-bold">{item.value} {item.unit || ''}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE STRATUM TELEMETRY STREAMING</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Real-Time Mining Operations & Hashrate
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Muscat MCT-01 Substation 33kV • SHA-256 Foundational Cluster
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 px-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-right">
            <div className="text-[10px] text-gray-400 font-mono">GLOBAL NETWORK HASHRATE</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">620.4 EH/s</div>
          </div>
          <div className="p-2.5 px-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-right">
            <div className="text-[10px] text-gray-400 font-mono">NETWORK DIFFICULTY</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{metrics.networkDifficulty}</div>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Performance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs font-mono">
        
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total Company Hashrate</div>
          <div className="text-lg font-bold text-white mt-1">125.0 PH/s</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Muscat MCT-01 Facility</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-[#F7931A]/30 text-white">
          <div className="text-[10px] text-[#F7931A] uppercase">Your Allocated Hashrate</div>
          <div className="text-lg font-bold text-[#F7931A] mt-1">125.2 TH/s</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Nominal: 125.0 TH/s (+0.16%)</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Mining Uptime</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">99.8%</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Rolling 30-Day Average</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Machines Online</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">1,244 / 1,250</div>
          <div className="text-[10px] text-gray-500 mt-0.5">6 in routine calibration</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">BTC Mined (24H)</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{metrics.miningRevenuePerDayBtc} BTC</div>
          <div className="text-[10px] text-gray-500 mt-0.5">≈ ${metrics.miningRevenuePerDayUsd} USD</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">BTC Mined (Lifetime)</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{metrics.btcMined} BTC</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Total Accrued Yield</div>
        </div>

      </div>

      {/* Primary Chart 1: Hashrate Consistency Stream (Historical) */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Investor Hashrate Telemetry (TH/s)
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono mt-0.5 block">
              12-Day Continuous Stratum Output vs. 125 TH/s Baseline Commitment
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Avg: 125.12 TH/s (Stable)
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MINING_HISTORICAL_CHART_DATA}>
              <defs>
                <linearGradient id="hashrateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7931A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F7931A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[120, 130]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="hashrateTH" 
                name="Hashrate (TH/s)" 
                stroke="#F7931A" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#hashrateGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Chart Grid: Revenue vs Cost & BTC Mined Daily Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 2: Mining Revenue vs Cost */}
        <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Gross Revenue vs Electricity/OPEX ($)
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">Daily USD</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MINING_HISTORICAL_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="revUsd" name="Gross Rev ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costUsd" name="Power/OPEX ($)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netUsd" name="Net Revenue ($)" fill="#F7931A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: BTC Mined Daily Trajectory */}
        <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Daily Bitcoin Block Rewards (BTC)
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">Rolling Interval</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MINING_HISTORICAL_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[0.00035, 0.00050]} stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="btcMined" 
                  name="BTC Mined" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#F59E0B', r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
