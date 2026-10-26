import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, Zap, FileText } from 'lucide-react';
import { ApiNotification } from '../../lib/api';

interface NotificationsCenterTabProps {
  notifications: ApiNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

export const NotificationsCenterTab: React.FC<NotificationsCenterTabProps> = ({
  notifications,
  onMarkAllRead,
  onToggleRead
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((item) => {
    if (filterType === 'unread') return !item.isRead;
    if (filterType === 'payout') return item.type === 'payout';
    if (filterType === 'kyc') return item.type === 'kyc';
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'payout':
        return <Zap className="w-4 h-4 text-gold-500" />;
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      case 'statement':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-gold-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-line-warm text-xs font-mono text-gold-500">
            <Bell className="w-3.5 h-3.5" />
            <span>NOTIFICATION CENTER</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Investor Notification Center</h2>
          <p className="text-xs text-fg-muted font-mono mt-0.5">
            Real notifications — automatically generated when your payouts or KYC status change.
          </p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="px-4 py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 text-white border border-line-warm text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="p-3 rounded-2xl bg-ink-850/90 border border-line flex items-center gap-1.5 text-xs font-mono">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'payout', label: 'Payouts' },
          { id: 'kyc', label: 'KYC' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
              filterType === f.id ? 'bg-gold-500 text-black font-bold' : 'bg-ink-800 text-fg-body hover:bg-ink-700 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleRead(item.id, !item.isRead)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              !item.isRead ? 'bg-ink-850 border-gold-500/40 shadow-lg shadow-gold-500/5' : 'bg-ink-850/60 border-line/80 hover:bg-ink-800/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-ink-950 border border-line shrink-0 mt-0.5">
                  {getIconForType(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    {!item.isRead && <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />}
                  </div>
                  <p className="text-xs text-fg-body font-sans mt-1 leading-relaxed">{item.message}</p>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-fg-muted shrink-0">{item.createdAt}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-fg-muted font-mono text-xs rounded-2xl bg-ink-850/60 border border-line/80">
            No notifications{filterType !== 'all' ? ' matching this filter' : ' yet'}.
          </div>
        )}
      </div>
    </div>
  );
};
