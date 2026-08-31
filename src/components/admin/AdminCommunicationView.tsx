import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Send,
  CheckCircle2,
  Users,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react';
import { AdminNotificationItem } from '../../types';

interface AdminCommunicationViewProps {
  notifications: AdminNotificationItem[];
}

export const AdminCommunicationView: React.FC<AdminCommunicationViewProps> = ({
  notifications: initialNotifications
}) => {
  const [notifList, setNotifList] = useState<AdminNotificationItem[]>(initialNotifications);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientGroup, setRecipientGroup] = useState<string>('All Investors');
  const [type, setType] = useState<AdminNotificationItem['type']>('General Announcement');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: AdminNotificationItem = {
      id: `COMM-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      recipientGroup: recipientGroup as any,
      sentDate: 'Just now',
      sentBy: 'Gaurav K. Sharma (Super Admin)',
      type,
      status: 'Sent'
    };

    setNotifList([newNotif, ...notifList]);
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">Communication & Investor Notification Center</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl">
          Dispatch platform announcements, scheduled facility maintenance alerts, payout receipts, and urgent operational notices.
        </p>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Broadcast successfully transmitted to {recipientGroup} email & portal feed.</span>
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#F7931A]" />
          <span>Compose New Investor Broadcast / Announcement</span>
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Headline / Subject</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Salalah SLL-02 Substation Upgrade & Hashrate Boost"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Recipient Group</label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
              >
                <option value="All Investors">All Investors (248 accounts)</option>
                <option value="VIP Investors">VIP Institutional Only</option>
                <option value="Pending KYC">Pending KYC Only</option>
                <option value="Contract Expiring">Contract Expiring Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Message Body (Supports Markdown)</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the comprehensive update for investor portal feeds and notification emails..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-gray-300 font-mono cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-gray-900 border-gray-700 text-[#F7931A]" />
                <span>Send Email Digest</span>
              </label>
              <label className="flex items-center gap-1.5 text-gray-300 font-mono cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-gray-900 border-gray-700 text-[#F7931A]" />
                <span>Push to Portal In-App Feed</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold font-mono text-xs transition-colors cursor-pointer shadow-md"
            >
              Dispatch Broadcast
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Dispatched Broadcast Archive
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Subject & Content</th>
                <th className="py-3.5 px-3">Target Audience</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Sent By</th>
                <th className="py-3.5 px-3">Timestamp</th>
                <th className="py-3.5 px-4">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {notifList.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{notif.title}</div>
                    <div className="text-[11px] text-gray-400 font-sans mt-0.5 line-clamp-1">{notif.message}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                      {notif.recipientGroup}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-300">{notif.type}</td>
                  <td className="py-3.5 px-3 text-gray-400">{notif.sentBy}</td>
                  <td className="py-3.5 px-3 text-gray-400">{notif.sentDate}</td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {notif.status}
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
