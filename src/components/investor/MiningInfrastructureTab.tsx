import React from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  Thermometer, 
  Wind,
  Layers,
  Gauge
} from 'lucide-react';
import { MiningFleetMachine } from '../../types';

interface MiningInfrastructureTabProps {
  machines: MiningFleetMachine[];
}

export const MiningInfrastructureTab: React.FC<MiningInfrastructureTabProps> = ({ machines }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MUSCAT DATA CENTER MCT-01 CLUSTER</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Industrial Mining Infrastructure & Pod Fleet
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Thermodynamically optimized ASIC arrays engineered for sovereign GCC power reliability
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-gray-950/90 border border-gray-800 text-right">
          <div className="text-[10px] text-gray-400 font-mono">FACILITY RATING</div>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Tier III Data Center</div>
        </div>
      </div>

      {/* 4 Facility Snapshot Pillars */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 text-white">
        <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4 font-bold flex items-center gap-2">
          <Server className="w-4 h-4 text-[#F7931A]" />
          <span>Muscat Primary Mining Farm Specifications</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
            <div className="text-gray-400 text-[11px]">Farm Fleet Capacity</div>
            <div className="text-xl font-extrabold text-white mt-1">1,250 Miners</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">1,244 Active | 6 Calibrating</div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
            <div className="text-gray-400 text-[11px]">Cumulative Hashrate</div>
            <div className="text-xl font-extrabold text-[#F7931A] mt-1">125.0 PH/s</div>
            <div className="text-[10px] text-gray-400 mt-0.5">SHA-256 Benchmark</div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
            <div className="text-gray-400 text-[11px]">Facility Power Draw</div>
            <div className="text-xl font-extrabold text-white mt-1">4.28 MW</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Direct 33kV Substation</div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
            <div className="text-gray-400 text-[11px]">Average Annual Uptime</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">98.7%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Target SLA Exceeded</div>
          </div>
        </div>
      </div>

      {/* Operational Specifications Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-2">
          <div className="flex items-center gap-2 text-[#F7931A] font-bold">
            <MapPin className="w-4 h-4" />
            <span>Facility Location & Power</span>
          </div>
          <div className="text-gray-300 text-xs space-y-1 pt-1">
            <p><strong>Site:</strong> Muscat Industrial Zone MCT-01</p>
            <p><strong>Power Source:</strong> Dual-feed industrial electrical grid</p>
            <p><strong>Cooling:</strong> High-efficiency negative pressure air flow + Hydro</p>
            <p><strong>Security:</strong> 24/7 biometric armed checkpoint</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Cpu className="w-4 h-4" />
            <span>Mining Equipment & Efficiency</span>
          </div>
          <div className="text-gray-300 text-xs space-y-1 pt-1">
            <p><strong>Primary Model:</strong> Antminer S21 Pro (16nm)</p>
            <p><strong>Hydro Model:</strong> Antminer S21 XP Hydro</p>
            <p><strong>Fleet Efficiency:</strong> 15.0 Joules / Terahash (J/TH)</p>
            <p><strong>Chip Architecture:</strong> Custom SHA-256 microcode</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Layers className="w-4 h-4" />
            <span>Mining Pool & Protocol</span>
          </div>
          <div className="text-gray-300 text-xs space-y-1 pt-1">
            <p><strong>Mining Pool:</strong> Foundry USA Pool</p>
            <p><strong>Stratum Protocol:</strong> Stratum V2 (Encrypted)</p>
            <p><strong>Payout Mode:</strong> Full PPS+ (Block + TX Fees)</p>
            <p><strong>Redundancy:</strong> Dual fiber-optic uplinks to Frankfurt/US</p>
          </div>
        </div>

      </div>

      {/* Allocated Capacity Telemetry (Investor Specific Node Fleet) */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#F7931A]" />
            <span className="text-sm font-bold uppercase tracking-wider font-mono">
              Investor Allocated Compute Pods (Telemetry Sample)
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            4 Dedicated Units in Pod A-01 / A-02
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Machine ID</th>
                <th className="pb-3 px-3">Pod Location</th>
                <th className="pb-3 px-3">Hardware Model</th>
                <th className="pb-3 px-3">Hashrate (TH/s)</th>
                <th className="pb-3 px-3">Power Draw</th>
                <th className="pb-3 px-3">Core Temp</th>
                <th className="pb-3 px-3">Efficiency</th>
                <th className="pb-3 px-3">Uptime</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      {m.assignedToUser && <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A]" title="Assigned to your lease" />}
                      <span>{m.id}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.podId}</td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.model}</td>
                  <td className="py-3 px-3 text-[#F7931A] font-bold whitespace-nowrap">{m.hashrateTH} TH/s</td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.powerDrawWatts} W</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={m.tempCelsius > 65 ? 'text-amber-400' : 'text-emerald-400'}>
                      {m.tempCelsius}°C
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{m.efficiencyJTH} J/TH</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold whitespace-nowrap">{m.uptimePercent}%</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                      m.status === 'Online'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {m.status === 'Online' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{m.status}</span>
                    </span>
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
