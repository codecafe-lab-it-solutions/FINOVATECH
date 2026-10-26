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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-100 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span> 🟠 Warning (Temp)
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-mono text-[10px] font-bold">
            <Wrench className="w-2.5 h-2.5" /> 🔧 Maint.
          </span>
        );
      default:
        return <span className="text-fg-muted">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Machine Status Filter */}
      <div className="p-5 rounded-3xl bg-ink-950 border border-line space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">ASIC Fleet & Machine-by-Machine Telemetry</h2>
            <p className="text-xs text-fg-muted mt-0.5">
              Live hardware diagnostics for Antminer S21 Pro (234 TH/s) & Whatsminer M60S (186 TH/s) hydro racks.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Machine ID, IP, Rack, Pool..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-ink-850 border border-line-warm text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-fg-muted text-[11px] uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Fleet Filter:
          </span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-gold-500 text-black font-bold'
                  : 'bg-ink-850 hover:bg-ink-800 text-fg-muted border border-line'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Machines Table */}
      <div className="rounded-3xl bg-ink-950 border border-line overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-850/90 text-fg-muted font-mono text-[11px] uppercase tracking-wider border-b border-line">
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
            <tbody className="divide-y divide-line/80 font-mono text-fg-body">
              {filteredMachines.map((m) => (
                <tr key={m.id} className="hover:bg-ink-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-gold-500" />
                      <span>{m.machineId}</span>
                    </div>
                    <div className="text-[11px] text-fg-muted font-sans">{m.model}</div>
                    <div className="text-[10px] text-fg-muted">{m.serialNumber}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-fg-body">{m.facility}</div>
                    <div className="text-[11px] text-gold-200">{m.rackLocation} • {m.shelf}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-white font-bold">{m.ipAddress}</div>
                    <div className="text-[10px] text-fg-muted">{m.macAddress}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className={`font-bold text-sm ${m.hashrateTH > 0 ? 'text-gold-500' : 'text-rose-400'}`}>
                      {m.hashrateTH.toFixed(1)} TH/s
                    </div>
                    <div className="text-[10px] text-fg-muted">Target: {m.targetHashrateTH} TH/s</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="text-white font-semibold">{m.powerWatts} W</div>
                    <div className="text-[10px] text-fg-muted">{m.efficiencyJTH} J/TH</div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <div className={`font-bold ${
                      m.tempCelsius > 75 ? 'text-rose-400' :
                      m.tempCelsius > 65 ? 'text-gold-200' :
                      'text-emerald-400'
                    }`}>
                      {m.tempCelsius}°C / {m.chipTempCelsius}°C
                    </div>
                    <div className="text-[10px] text-fg-muted">{m.fanRpm} RPM ({m.fanStatus})</div>
                  </td>

                  <td className="py-3.5 px-3">{getStatusBadge(m.status)}</td>

                  <td className="py-3.5 px-3">
                    <div className="text-fg-body">{m.miningPool}</div>
                    <div className="text-[10px] text-fg-muted">{m.lastHeartbeat}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleReboot(m.id)}
                      disabled={rebootingId === m.id}
                      className="px-2.5 py-1 rounded-lg bg-ink-800 hover:bg-ink-700 text-fg-body text-[11px] font-mono transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3 h-3 ${rebootingId === m.id ? 'animate-spin text-gold-500' : ''}`} />
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
