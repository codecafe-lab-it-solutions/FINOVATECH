import React from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  DollarSign, 
  Coins, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { ROI_CUMULATIVE_CHART_DATA } from '../../data/investorData';
import { InvestorOverviewMetrics } from '../../types';

interface RoiPerformanceTabProps {
  metrics: InvestorOverviewMetrics;
}

export const RoiPerformanceTab: React.FC<RoiPerformanceTabProps> = ({ metrics }) => {
  const investedAmount = metrics.totalInvestmentUsd; // $50,000
  const earnedMiningUsd = 8450;
  const currentPortfolioValue = metrics.currentPortfolioValueUsd; // $56,200
  const totalReturnUsd = metrics.totalReturnsUsd; // $14,650
  const roiPercent = metrics.roiPercent; // 29.3%

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs font-mono text-white shadow-xl space-y-1">
          <div className="text-[#F7931A] font-bold">{label}</div>
          {payload.map((item: any, idx: number) => (
            <div key={idx} style={{ color: item.color }} className="flex justify-between gap-4">
              <span>{item.name}:</span>
              <span className="font-bold">${item.value.toLocaleString()}</span>
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
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AUDITED CAPITAL GROWTH & YIELD ANALYTICS</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            ROI & Portfolio Appreciation Matrix
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Holistic capital return model combining daily Bitcoin block production with asset appreciation
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
          <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">NET ROI TO DATE</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">+{roiPercent}%</div>
        </div>
      </div>

      {/* Visual Investment Flow: Investment -> Earnings -> Current Value -> ROI */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Layers className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">
            Capital Progression Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          
          {/* Step 1: Invested */}
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-center space-y-1">
            <div className="text-[10px] text-gray-400 font-mono uppercase">1. Invested Principal</div>
            <div className="text-xl font-extrabold text-white font-mono">${investedAmount.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 font-mono">Muscat Pod Allocation</div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex justify-center text-gray-600">
            <ArrowRight className="w-5 h-5 text-[#F7931A]" />
          </div>

          {/* Step 2: Earned Mining */}
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-center space-y-1">
            <div className="text-[10px] text-gray-400 font-mono uppercase">2. Mined Revenue</div>
            <div className="text-xl font-extrabold text-amber-400 font-mono">${earnedMiningUsd.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 font-mono">SHA-256 Block Rewards</div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex justify-center text-gray-600">
            <ArrowRight className="w-5 h-5 text-[#F7931A]" />
          </div>

          {/* Step 3: Current Value */}
          <div className="p-4 rounded-2xl bg-gray-950 border border-[#F7931A]/40 text-center space-y-1 shadow-lg shadow-[#F7931A]/5">
            <div className="text-[10px] text-[#F7931A] font-mono font-bold uppercase">3. Current Value</div>
            <div className="text-xl font-extrabold text-white font-mono">${currentPortfolioValue.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold">+${totalReturnUsd.toLocaleString()} Total Return</div>
          </div>

        </div>
      </div>

      {/* Primary Chart: Cumulative Portfolio Value & Mined Asset Trajectory */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Cumulative Value Trajectory ($ USD)
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono mt-0.5 block">
              Historical performance from contract inception (Jan 2025) through August 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Total Return: +${totalReturnUsd.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ROI_CUMULATIVE_CHART_DATA}>
              <defs>
                <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[45000, 60000]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area 
                type="monotone" 
                dataKey="portfolioVal" 
                name="Portfolio Value ($)" 
                stroke="#10B981" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#roiGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                name="Principal Invested ($)" 
                stroke="#64748B" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-2">
          <div className="text-[#F7931A] font-bold">Bitcoin Appreciation Factor</div>
          <p className="text-gray-300 font-sans leading-relaxed text-xs">
            Bitcoin benchmark price advanced from $58,000 in Jan 2025 to $64,280 in Aug 2026 (+10.8%), creating dual-engine yield alongside daily hashrate block rewards.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-2">
          <div className="text-emerald-400 font-bold">Maturity Horizon (2029 Projections)</div>
          <p className="text-gray-300 font-sans leading-relaxed text-xs">
            At current average block reward yields and scheduled Oman industrial power stability, projected 4-year cumulative IRR is modelled at 142%–185% across full term.
          </p>
        </div>
      </div>

    </div>
  );
};
