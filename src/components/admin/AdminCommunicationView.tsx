import React, { useEffect, useState, useCallback } from 'react';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Users
} from 'lucide-react';
import {
  ApiInvestorProfile,
  ApiBroadcast,
  fetchAdminInvestors,
  fetchAdminBroadcasts,
  sendAdminBroadcast
} from '../../lib/api';

interface AdminCommunicationViewProps {
  authToken: string;
}

export const AdminCommunicationView: React.FC<AdminCommunicationViewProps> = ({ authToken }) => {
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [broadcasts, setBroadcasts] = useState<ApiBroadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'All' | 'Specific'>('All');
  const [selectedInvestorIds, setSelectedInvestorIds] = useState<string[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [{ investors: invs }, { broadcasts: history }] = await Promise.all([
        fetchAdminInvestors(authToken),
        fetchAdminBroadcasts(authToken)
      ]);
      setInvestors(invs);
      setBroadcasts(history);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load communication data.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleInvestor = (id: string) => {
    setSelectedInvestorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (recipientType === 'Specific' && selectedInvestorIds.length === 0) {
      setError('Select at least one investor.');
      return;
    }
    setIsSending(true);
    try {
      const { broadcast } = await sendAdminBroadcast(authToken, {
        title: title.trim(),
        message: message.trim(),
        recipientType,
        recipientIds: recipientType === 'Specific' ? selectedInvestorIds : undefined,
        sendEmail
      });
      setSentMessage(
        `Sent to ${broadcast.recipientCount} investor${broadcast.recipientCount === 1 ? '' : 's'}${sendEmail ? ' (in-app notification + email)' : ' (in-app notification only)'}.`
      );
      setTitle('');
      setMessage('');
      setSelectedInvestorIds([]);
      await load();
      setTimeout(() => setSentMessage(''), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">Communication Center</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl">
          Send a real in-app notification (and optionally an email) to some or all investors — e.g. a top-up reminder or platform announcement.
        </p>
      </div>

      {sentMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{sentMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#F7931A]" />
          <span>Compose Message</span>
        </h3>

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reminder: Top up your account"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to investors..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-mono text-[10px] uppercase mb-2">Recipients</label>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-1.5 text-gray-300 font-mono cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === 'All'}
                  onChange={() => setRecipientType('All')}
                  className="text-[#F7931A]"
                />
                <span>All Investors ({investors.length})</span>
              </label>
              <label className="flex items-center gap-1.5 text-gray-300 font-mono cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === 'Specific'}
                  onChange={() => setRecipientType('Specific')}
                  className="text-[#F7931A]"
                />
                <span>Specific Investors</span>
              </label>
            </div>

            {recipientType === 'Specific' && (
              <div className="max-h-40 overflow-y-auto rounded-xl bg-gray-950 border border-gray-800 p-2 space-y-1">
                {investors.length === 0 && <div className="text-gray-500 p-2">No investors found.</div>}
                {investors.map((inv) => (
                  <label key={inv.userId} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-900 cursor-pointer text-gray-300 font-mono">
                    <input
                      type="checkbox"
                      checked={selectedInvestorIds.includes(inv.userId)}
                      onChange={() => toggleInvestor(inv.userId)}
                      className="text-[#F7931A]"
                    />
                    <span>{inv.name} ({inv.username})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-1.5 text-gray-300 font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-[#F7931A]"
              />
              <span>Also send email to registered addresses</span>
            </label>

            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold font-mono text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send Now'}
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Broadcast History
          </h3>
          <span className="text-[11px] text-gray-500 font-mono">
            {isLoading ? 'Loading...' : `${broadcasts.length} sent, live from the database`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Title & Message</th>
                <th className="py-3.5 px-3">Recipients</th>
                <th className="py-3.5 px-3">Email Sent</th>
                <th className="py-3.5 px-3">Sent By</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{b.title}</div>
                    <div className="text-[11px] text-gray-400 font-sans mt-0.5 line-clamp-1">{b.message}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> {b.recipientCount} ({b.recipientType})
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {b.emailSent ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-gray-400">{b.sentBy}</td>
                  <td className="py-3.5 px-3 text-gray-400">{b.createdAt}</td>
                </tr>
              ))}
              {!isLoading && broadcasts.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 font-mono">No broadcasts sent yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
