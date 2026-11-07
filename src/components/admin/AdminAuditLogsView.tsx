import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Search, RotateCw, AlertTriangle } from 'lucide-react';
import { ApiActivityLog, fetchActivityLogs } from '../../lib/api';

interface AdminAuditLogsViewProps {
  authToken: string;
}

const FILTERS = ['All', 'Logins', 'Failed / Blocked', 'Admin actions', 'Investor actions'] as const;
type Filter = (typeof FILTERS)[number];

const statusStyle: Record<string, string> = {
  Success: 'bg-emerald-500/20 text-emerald-300',
  Failed: 'bg-rose-500/20 text-rose-300',
  Blocked: 'bg-amber-500/20 text-amber-300'
};

// Access / activity log: every login (success, failure, blocked) and every change made in the system.
export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ authToken }) => {
  const [logs, setLogs] = useState<ApiActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setLogs((await fetchActivityLogs(authToken)).logs);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the activity log.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = logs.filter((log) => {
    const q = query.trim().toLowerCase();
    if (q && ![log.actorName, log.action, log.module, log.targetId, log.details, log.ipAddress].some((v) => v.toLowerCase().includes(q))) return false;
    if (filter === 'Logins') return log.action.startsWith('Login');
    if (filter === 'Failed / Blocked') return log.status !== 'Success';
    if (filter === 'Admin actions') return log.actorRole === 'admin' && !log.action.startsWith('Login');
    if (filter === 'Investor actions') return log.actorRole === 'investor' && !log.action.startsWith('Login');
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[11px] font-mono text-gold-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACCESS &amp; ACTIVITY LOG</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access &amp; Activity Log</h2>
          <p className="text-xs text-fg-muted mt-1 max-w-2xl">
            Every login and every change made by admins and investors, recorded live with time, user and IP address. Passwords and PINs are never stored here.
          </p>
        </div>
        <button onClick={() => void load()} className="px-4 py-2 rounded-xl bg-ink-850 border border-line text-xs font-mono text-fg-body hover:text-white flex items-center gap-2 cursor-pointer">
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-5 rounded-3xl bg-ink-950 border border-line space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user, action, IP or details..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ink-850 border border-line-warm text-white placeholder-fg-muted text-xs font-mono focus:outline-hidden focus:border-gold-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${filter === f ? 'bg-gold-500 text-black font-bold' : 'bg-ink-850 hover:bg-ink-800 text-fg-muted border border-line'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-ink-950 border border-line overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-850/90 text-fg-muted font-mono text-[11px] uppercase tracking-wider border-b border-line">
                <th className="py-3.5 px-4">Time (UTC)</th>
                <th className="py-3.5 px-3">User</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">IP address</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/80 font-mono text-fg-body">
              {visible.map((log) => (
                <tr key={log.id} className="align-top">
                  <td className="py-3 px-4 whitespace-nowrap text-fg-muted">{String(log.createdAt).replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-white">{log.actorName || 'Unknown'}</div>
                    <div className="text-[10px] text-fg-muted">{log.actorRole || '-'}</div>
                  </td>
                  <td className="py-3 px-3 text-white">{log.action}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle[log.status] ?? 'bg-ink-700 text-fg-body'}`}>{log.status}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{log.ipAddress || '-'}</td>
                  <td className="py-3 px-4 text-fg-muted break-words max-w-md">{log.details}</td>
                </tr>
              ))}
              {!isLoading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-fg-muted">No activity recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
