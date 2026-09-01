import React from 'react';
import { Gauge, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiMachine } from '../../lib/api';

interface MiningInfrastructureTabProps {
  machines: ApiMachine[];
}

export const MiningInfrastructureTab: React.FC<MiningInfrastructureTabProps> = ({ machines }) => {
  const totalHashrate = machines.reduce((sum, m) => sum + m.hashrateTh, 0);
  const totalPower = machines.reduce((sum, m) => sum + m.powerDrawWatts, 0);
  const avgUptime = machines.length > 0 ? machines.reduce((sum, m) => sum + m.uptimePercent, 0) / machines.length : 0;
  const onlineCount = machines.filter((m) => m.status === 'Online').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MUSCAT DATA CENTER MCT-01</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Pod & Miner Fleet</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Machines assigned to your account, live from the database — {machines.length} unit{machines.length === 1 ? '' : 's'}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-gray-400 text-[11px] uppercase">Your Machines</div>
          <div className="text-xl font-extrabold text-white mt-1">{machines.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">{onlineCount} Online</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-gray-400 text-[11px] uppercase">Your Hashrate</div>
          <div className="text-xl font-extrabold text-[#F7931A] mt-1">{totalHashrate.toFixed(1)} TH/s</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-gray-400 text-[11px] uppercase">Power Draw</div>
          <div className="text-xl font-extrabold text-white mt-1">{(totalPower / 1000).toFixed(2)} kW</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-gray-400 text-[11px] uppercase">Avg Uptime</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">{avgUptime.toFixed(1)}%</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Gauge className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">Your Allocated Compute</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Pod</th>
                <th className="pb-3 px-3">Model</th>
                <th className="pb-3 px-3">Hashrate</th>
                <th className="pb-3 px-3">Power Draw</th>
                <th className="pb-3 px-3">Temp</th>
                <th className="pb-3 px-3">Pool</th>
                <th className="pb-3 px-3">Uptime</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.podId || '—'}</td>
                  <td className="py-3 px-3 text-white font-bold whitespace-nowrap">{m.model}</td>
                  <td className="py-3 px-3 text-[#F7931A] font-bold whitespace-nowrap">{m.hashrateTh} TH/s</td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.powerDrawWatts} W</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={m.tempCelsius > 65 ? 'text-amber-400' : 'text-emerald-400'}>{m.tempCelsius}°C</span>
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.pool || '—'}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold whitespace-nowrap">{m.uptimePercent}%</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                      m.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {m.status === 'Online' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{m.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {machines.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-gray-500">No machines assigned to your account yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
