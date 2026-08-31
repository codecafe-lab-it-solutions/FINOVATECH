import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { AdminAuditLogItem } from '../../types';

interface AdminAuditLogsViewProps {
  auditLogs: AdminAuditLogItem[];
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('All');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLogItem | null>(null);

  const actionTypes = [
    'All',
    'Payout Approved',
    'Balance Adjusted',
    'KYC Approved',
    'Miner Rebooted',
    'Plan Created',
    'Role Changed'
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.targetId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedActionType === 'All') return true;
    return log.action === selectedActionType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>WORM (WRITE ONCE, READ MANY) IMMUTABLE AUDIT LEDGER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Security & Financial Audit Trail</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Cryptographically sealed audit log recording every admin permission change, payout approval, balance adjustment, and hardware command.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs text-emerald-400">
          ● Immutable Logging Active
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-gray-500 text-[11px] uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Action:
            </span>
            {actionTypes.map((a) => (
              <button
                key={a}
                onClick={() => setSelectedActionType(a)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedActionType === a
                    ? 'bg-[#F7931A] text-gray-950 font-bold'
                    : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-3">Administrator</th>
                <th className="py-3.5 px-3">Action Type</th>
                <th className="py-3.5 px-3">Target / Module</th>
                <th className="py-3.5 px-3">Details / Value Delta</th>
                <th className="py-3.5 px-3">IP Address</th>
                <th className="py-3.5 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-gray-400">{log.timestamp}</td>

                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-semibold text-white">{log.adminName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{log.adminId} • {log.adminRole}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('Payout') ? 'bg-amber-500/20 text-amber-300' :
                      log.action.includes('KYC') ? 'bg-blue-500/20 text-blue-300' :
                      log.action.includes('Balance') ? 'bg-purple-500/20 text-purple-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-white">
                    <div>{log.module}</div>
                    <div className="text-[10px] text-amber-400">{log.targetId}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-gray-300 font-sans">{log.details}</div>
                    {log.oldValue && log.newValue && (
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        <span className="text-rose-400">{log.oldValue}</span> → <span className="text-emerald-400 font-bold">{log.newValue}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-gray-400 text-[11px]">{log.ipAddress}</td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold text-white">Audit Event Signature</h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-gray-300">
              <div><span className="text-gray-500 uppercase text-[10px]">Log Event ID:</span> <span className="text-amber-400">{selectedLog.id}</span></div>
              <div><span className="text-gray-500 uppercase text-[10px]">Timestamp:</span> <span>{selectedLog.timestamp}</span></div>
              <div><span className="text-gray-500 uppercase text-[10px]">Administrator:</span> <span>{selectedLog.adminName} ({selectedLog.adminRole})</span></div>
              <div><span className="text-gray-500 uppercase text-[10px]">Action Category:</span> <span>{selectedLog.action}</span></div>
              <div><span className="text-gray-500 uppercase text-[10px]">Target Object:</span> <span>{selectedLog.targetId} ({selectedLog.module})</span></div>
              <div><span className="text-gray-500 uppercase text-[10px]">IP & User Agent:</span> <span>{selectedLog.ipAddress} • {selectedLog.userAgent}</span></div>
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 mt-2">
                <span className="text-gray-500 uppercase text-[10px] block mb-1">Payload Audit Details</span>
                <p className="text-white font-sans">{selectedLog.details}</p>
                {selectedLog.oldValue && (
                  <div className="text-[11px] mt-2 pt-2 border-t border-gray-800 text-gray-400">
                    <div>Old State: <span className="text-rose-400">{selectedLog.oldValue}</span></div>
                    <div>New State: <span className="text-emerald-400 font-bold">{selectedLog.newValue}</span></div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
