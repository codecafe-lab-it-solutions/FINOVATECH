import React, { useMemo } from 'react';
import { TrendingUp, ArrowRight, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { InvestorOverviewMetrics } from '../../types';
import { ApiMonthlyStatement } from '../../lib/api';

interface RoiPerformanceTabProps {
  metrics: InvestorOverviewMetrics;
  statements: ApiMonthlyStatement[];
}

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

export const RoiPerformanceTab: React.FC<RoiPerformanceTabProps> = ({ metrics, statements }) => {
  const investedAmount = metrics.totalInvestmentUsd;
  const currentPortfolioValue = metrics.currentPortfolioValueUsd;
  const totalReturnUsd = metrics.totalReturnsUsd;
  const roiPercent = metrics.roiPercent;

  const chartData = useMemo(() => {
    const sorted = [...statements].sort((a, b) => a.month.localeCompare(b.month));
    let cumulative = 0;
    return sorted.map((s) => {
      cumulative += s.netUsd;
      return { month: s.month, portfolioVal: investedAmount + cumulative, invested: investedAmount };
    });
  }, [statements, investedAmount]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ROI & GROWTH ANALYTICS</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">ROI & Portfolio Growth</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Computed from your real investment figure and monthly ledger activity.</p>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
          <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">NET ROI TO DATE</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">{roiPercent >= 0 ? '+' : ''}{roiPercent}%</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Layers className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">Capital Progression</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-center space-y-1">
            <div className="text-[10px] text-gray-400 font-mono uppercase">Invested Principal</div>
            <div className="text-xl font-extrabold text-white font-mono">${investedAmount.toLocaleString()}</div>
          </div>
          <div className="hidden lg:flex justify-center text-gray-600">
            <ArrowRight className="w-5 h-5 text-[#F7931A]" />
          </div>
          <div className="p-4 rounded-2xl bg-gray-950 border border-[#F7931A]/40 text-center space-y-1 shadow-lg shadow-[#F7931A]/5">
            <div className="text-[10px] text-[#F7931A] font-mono font-bold uppercase">Current Value</div>
            <div className="text-xl font-extrabold text-white font-mono">${currentPortfolioValue.toLocaleString()}</div>
            <div className={`text-[10px] font-mono font-bold ${totalReturnUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalReturnUsd >= 0 ? '+' : ''}${totalReturnUsd.toLocaleString()} Total Return
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
          <TrendingUp className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">Cumulative Value Trajectory ($ USDT)</span>
        </div>
        <div className="h-72 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="portfolioVal" name="Portfolio Value ($)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#roiGradient)" />
                <Area type="monotone" dataKey="invested" name="Principal Invested ($)" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono">No monthly activity yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
