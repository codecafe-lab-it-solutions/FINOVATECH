import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Filter, 
  Trash2, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  FileText 
} from 'lucide-react';
import { InvestorNotification } from '../../types';

interface NotificationsCenterTabProps {
  notifications: InvestorNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
}

export const NotificationsCenterTab: React.FC<NotificationsCenterTabProps> = ({
  notifications,
  onMarkAllRead,
  onToggleRead
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    payoutAlerts: true,
    maintenanceAlerts: true,
    securityAlerts: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filtered = notifications.filter((item) => {
    if (filterType === 'unread') return !item.read;
    if (filterType === 'payout') return item.type === 'payout';
    if (filterType === 'facility') return item.type === 'facility';
    return true;
  });

  const handleSaveChannels = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'payout':
        return <Zap className="w-4 h-4 text-[#F7931A]" />;
      case 'statement':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'facility':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <Bell className="w-3.5 h-3.5" />
            <span>COMMUNICATION & TELEMETRY DISPATCH</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investor Notification Center
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Real-time updates on payouts, statements, facility status, and critical security events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Notification dispatch channels and WhatsApp routing preferences saved successfully.</span>
        </div>
      )}

      {/* Grid: Left Feed, Right Notification Dispatch Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filters */}
          <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800 flex items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'unread', label: 'Unread Only' },
              { id: 'payout', label: 'Payouts' },
              { id: 'facility', label: 'Facility' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  filterType === f.id
                    ? 'bg-[#F7931A] text-gray-950 font-bold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleRead(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  !item.read
                    ? 'bg-gray-900 border-[#F7931A]/40 shadow-lg shadow-[#F7931A]/5'
                    : 'bg-gray-900/60 border-gray-800/80 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-gray-950 border border-gray-800 shrink-0 mt-0.5">
                      {getIconForType(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-300 font-sans mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px] text-gray-500 shrink-0">
                    <div>{item.date}</div>
                    <div>{item.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Dispatch Routing Settings (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Smartphone className="w-4 h-4 text-[#F7931A]" />
              <span className="font-bold uppercase tracking-wider text-sm">
                Multi-Channel Dispatch Routing
              </span>
            </div>

            <p className="text-gray-400 font-sans text-xs">
              Configure which channels receive instant alerts for financial payouts and facility maintenance.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Email Dispatch (PDF Statements)</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F7931A] bg-gray-900 border-gray-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <span>SMS Alerts (2FA & Payouts)</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F7931A] bg-gray-900 border-gray-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">WhatsApp VIP RM Channel</span>
                </div>
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F7931A] bg-gray-900 border-gray-700"
                />
              </label>
            </div>

            <button
              onClick={handleSaveChannels}
              className="w-full py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs cursor-pointer transition-colors mt-2"
            >
              Save Alert Preferences
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
