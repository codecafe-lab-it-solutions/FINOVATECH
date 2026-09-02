import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { InvestorOverviewMetrics } from '../../types';
import { ApiEarningRow, ApiMachine } from '../../lib/api';

interface MiningPerformanceTabProps {
  metrics: InvestorOverviewMetrics;
  earnings: ApiEarningRow[];
  machines: ApiMachine[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs font-mono text-white shadow-xl space-y-1">
        <div className="text-gray-400 font-bold">{label}</div>
        {payload.map((item: any, idx: number) => (
          <div key={idx} style={{ color: item.color }} className="flex justify-between gap-4">
            <span>{item.name}:</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MiningPerformanceTab: React.FC<MiningPerformanceTabProps> = ({ metrics, earnings, machines }) => {
  const totalHashrate = machines.reduce((sum, m) => sum + m.hashrateTh, 0);
  const onlineCount = machines.filter((m) => m.status === 'Online').length;
  const avgUptime = machines.length > 0 ? machines.reduce((sum, m) => sum + m.uptimePercent, 0) / machines.length : 0;

  const chartData = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const e of [...earnings].reverse()) {
      const day = e.date.slice(0, 10);
      byDate.set(day, (byDate.get(day) || 0) + e.amountBtc);
    }
    return Array.from(byDate.entries()).map(([date, btc]) => ({ date, btcMined: Number(btc.toFixed(8)) }));
  }, [earnings]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MINING PERFORMANCE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Mining Performance</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Real BTC-mined history from your wallet ledger, plus your assigned machine fleet.</p>
        </div>
        <div className="p-2.5 px-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-right">
          <div className="text-[10px] text-gray-400 font-mono">NETWORK DIFFICULTY</div>
          <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{metrics.networkDifficulty}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-[#F7931A]/30 text-white">
          <div className="text-[10px] text-[#F7931A] uppercase">Your Hashrate</div>
          <div className="text-lg font-bold text-[#F7931A] mt-1">{totalHashrate.toFixed(2)} TH/s</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Machines Online</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{onlineCount} / {machines.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Avg Uptime</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{avgUptime.toFixed(1)}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">BTC Mined (Lifetime)</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{metrics.btcMined} BTC</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
          <Activity className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">BTC Mined Over Time</span>
        </div>
        <div className="h-64 sm:h-72 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7931A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F7931A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="btcMined" name="BTC Mined" stroke="#F7931A" strokeWidth={2.5} fillOpacity={1} fill="url(#earningsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono">No mining credits recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
