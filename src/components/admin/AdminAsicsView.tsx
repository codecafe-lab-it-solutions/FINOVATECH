import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Thermometer,
  RotateCw,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Server,
  RefreshCw
} from 'lucide-react';
import { AsicMachineItem } from '../../types';

interface AdminAsicsViewProps {
  machines: AsicMachineItem[];
  onRebootMachine?: (machineId: string) => void;
}

export const AdminAsicsView: React.FC<AdminAsicsViewProps> = ({
  machines: initialMachines,
  onRebootMachine
}) => {
  const [machinesList, setMachinesList] = useState<AsicMachineItem[]>(initialMachines);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rebootingId, setRebootingId] = useState<string | null>(null);

  const statuses = ['All', 'Online', 'Warning', 'Offline', 'Maintenance'];

  const filteredMachines = useMemo(() => {
    return machinesList.filter((m) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        m.machineId.toLowerCase().includes(query) ||
        m.model.toLowerCase().includes(query) ||
        m.serialNumber.toLowerCase().includes(query) ||
        m.ipAddress.toLowerCase().includes(query) ||
        m.rackLocation.toLowerCase().includes(query) ||
        m.miningPool.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (statusFilter === 'All') return true;
      return m.status === statusFilter;
    });
  }, [machinesList, searchQuery, statusFilter]);

  const handleReboot = (id: string) => {
    setRebootingId(id);
    setTimeout(() => {
      setMachinesList((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: 'Online', tempCelsius: 58, chipTempCelsius: 64, hashrateTH: m.targetHashrateTH }
            : m
        )
      );
      setRebootingId(null);
      if (onRebootMachine) onRebootMachine(id);
    }, 1200);
  };

  const getStatusBadge = (status: AsicMachineItem['status']) => {
    switch (status) {
      case 'Online':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 🟢 Online
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 🟠 Warning (Temp)
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> 🔴 Offline
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
            <Wrench className="w-2.5 h-2.5" /> 🔧 Maint.
          </span>
        );
      default:
        return <span className="text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Machine Status Filter */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">ASIC Fleet & Machine-by-Machine Telemetry</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live hardware diagnostics for Antminer S21 Pro (234 TH/s) & Whatsminer M60S (186 TH/s) hydro racks.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Machine ID, IP, Rack, Pool..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-gray-500 text-[11px] uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Fleet Filter:
          </span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Machines Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Machine ID & Model</th>
                <th className="py-3.5 px-3">Location / Rack</th>
                <th className="py-3.5 px-3">IP & MAC</th>
                <th className="py-3.5 px-3 text-right">Hashrate</th>
                <th className="py-3.5 px-3 text-right">Power / Eff.</th>
                <th className="py-3.5 px-3 text-center">Temp / Fans</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Pool</th>
                <th className="py-3.5 px-4 text-center">Remote Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredMachines.map((m) => (
                <tr key={m.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#F7931A]" />
                      <span>{m.machineId}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans">{m.model}</div>
                    <div className="text-[10px] text-gray-500">{m.serialNumber}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-200">{m.facility}</div>
                    <div className="text-[11px] text-amber-400">{m.rackLocation} • {m.shelf}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-white font-bold">{m.ipAddress}</div>
                    <div className="text-[10px] text-gray-500">{m.macAddress}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className={`font-bold text-sm ${m.hashrateTH > 0 ? 'text-[#F7931A]' : 'text-rose-400'}`}>
                      {m.hashrateTH.toFixed(1)} TH/s
                    </div>
                    <div className="text-[10px] text-gray-500">Target: {m.targetHashrateTH} TH/s</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="text-white font-semibold">{m.powerWatts} W</div>
                    <div className="text-[10px] text-gray-400">{m.efficiencyJTH} J/TH</div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <div className={`font-bold ${
                      m.tempCelsius > 75 ? 'text-rose-400' :
                      m.tempCelsius > 65 ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {m.tempCelsius}°C / {m.chipTempCelsius}°C
                    </div>
                    <div className="text-[10px] text-gray-400">{m.fanRpm} RPM ({m.fanStatus})</div>
                  </td>

                  <td className="py-3.5 px-3">{getStatusBadge(m.status)}</td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-300">{m.miningPool}</div>
                    <div className="text-[10px] text-gray-500">{m.lastHeartbeat}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleReboot(m.id)}
                      disabled={rebootingId === m.id}
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-mono transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3 h-3 ${rebootingId === m.id ? 'animate-spin text-[#F7931A]' : ''}`} />
                      <span>{rebootingId === m.id ? 'Rebooting...' : 'Reboot'}</span>
                    </button>
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
