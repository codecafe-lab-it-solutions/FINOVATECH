import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Cpu,
  Server,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { MiningFacilityItem } from '../../types';

interface AdminMiningOpsViewProps {
  facilities: MiningFacilityItem[];
}

export const AdminMiningOpsView: React.FC<AdminMiningOpsViewProps> = ({ facilities }) => {
  const [selectedFacility, setSelectedFacility] = useState<MiningFacilityItem>(facilities[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const totalMiners = facilities.reduce((sum, f) => sum + f.totalMiners, 0);
  const totalOnline = facilities.reduce((sum, f) => sum + f.onlineMiners, 0);
  const totalHashrate = facilities.reduce((sum, f) => sum + f.hashratePH, 0);
  const totalPowerMW = facilities.reduce((sum, f) => sum + f.powerConsumptionMW, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Operations Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>IMMERSION DATA CENTER INFRASTRUCTURE • OMAN</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mining Facilities & Farm Operations</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Real-time power substation telemetry, liquid dielectric immersion cooling tanks, and SHA-256 block extraction rates.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-gray-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#F7931A]' : ''}`} />
          <span>Sync Farm Telemetry</span>
        </button>
      </div>

      {/* High-Level Fleet Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Total Hashrate</div>
          <div className="text-2xl font-extrabold text-[#F7931A] font-mono mt-1">{totalHashrate.toFixed(1)} PH/s</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">MCT-01 + SLL-02</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Fleet Online Status</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">{totalOnline} <span className="text-xs text-gray-500">/ {totalMiners}</span></div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">97.8% Fleet Operational</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Substation Power Draw</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">{totalPowerMW.toFixed(1)} MW</div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">Average PUE: 1.038</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Grid Tariff Locked</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">$0.042</div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">Per kWh Levelized</div>
        </div>
      </div>

      {/* Detailed Facility Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            onClick={() => setSelectedFacility(fac)}
            className={`p-6 rounded-3xl bg-[#0F172A] border transition-all cursor-pointer ${
              selectedFacility.id === fac.id
                ? 'border-[#F7931A] shadow-xl shadow-amber-500/5 ring-1 ring-[#F7931A]/40'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{fac.name}</h3>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    {fac.code}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{fac.location} • {fac.country}</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{fac.status}</span>
              </div>
            </div>

            {/* Miners Breakdown */}
            <div className="grid grid-cols-4 gap-2 my-5 p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 text-center font-mono text-xs">
              <div>
                <div className="text-[10px] text-gray-400 uppercase">Total</div>
                <div className="text-base font-bold text-white mt-0.5">{fac.totalMiners}</div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 uppercase">Online</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{fac.onlineMiners}</div>
              </div>
              <div>
                <div className="text-[10px] text-rose-400 uppercase">Offline</div>
                <div className="text-base font-bold text-rose-400 mt-0.5">{fac.offlineMiners}</div>
              </div>
              <div>
                <div className="text-[10px] text-amber-400 uppercase">Maint.</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{fac.maintenanceMiners}</div>
              </div>
            </div>

            {/* Deep Specs */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Total Site Hashrate:</span>
                <span className="text-[#F7931A] font-bold text-sm">{fac.hashratePH} PH/s</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Power Consumption:</span>
                <span className="text-white font-bold">{fac.powerConsumptionMW} MW ({fac.efficiencyJTH} J/TH)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">Cooling Architecture:</span>
                <span className="text-cyan-400 font-semibold">{fac.coolingType} (PUE {fac.pueRatio})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">BTC Production Today:</span>
                <span className="text-white font-bold">{fac.btcToday} BTC / 24h</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400">BTC This Month (MTD):</span>
                <span className="text-emerald-400 font-bold">{fac.btcThisMonth} BTC Mined</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
