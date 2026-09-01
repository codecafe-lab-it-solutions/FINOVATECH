import React, { useState } from 'react';
import { HelpCircle, Plus, Send, X } from 'lucide-react';
import { ApiTicket } from '../../lib/api';

interface SupportHelpdeskTabProps {
  tickets: ApiTicket[];
  onAddTicket: (subject: string, category: string, message: string) => Promise<void>;
  onAddMessage: (ticketId: string, messageText: string) => Promise<void>;
}

const CATEGORIES = ['Payment', 'Withdrawal', 'Wallet', 'Mining earnings', 'KYC', 'Investment agreement', 'Technical issue', 'General'];

export const SupportHelpdeskTab: React.FC<SupportHelpdeskTabProps> = ({ tickets, onAddTicket, onAddMessage }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newInitialMsg, setNewInitialMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setIsSending(true);
    try {
      await onAddMessage(selectedTicket.id, replyText.trim());
      setReplyText('');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newInitialMsg.trim()) return;
    setIsCreating(true);
    try {
      await onAddTicket(newSubject.trim(), newCategory, newInitialMsg.trim());
      setShowNewTicketModal(false);
      setNewSubject('');
      setNewInitialMsg('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SUPPORT & HELPDESK</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Support & Helpdesk</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Real support tickets, stored in the database and answered by the admin team.</p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between px-2 text-gray-400 text-[11px] uppercase font-bold">
            <span>Your Tickets ({tickets.length})</span>
            <span>Status</span>
          </div>
          <div className="space-y-2">
            {tickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicket?.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-gray-900 border-[#F7931A] shadow-md shadow-[#F7931A]/10' : 'bg-gray-900/60 border-gray-800 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                    <span className="text-[#F7931A] font-bold">{ticket.id.slice(0, 8).toUpperCase()}</span>
                    <span>{ticket.updatedAt}</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{ticket.subject}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300">{ticket.category}</span>
                    <span className={`font-bold ${ticket.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>{ticket.status}</span>
                  </div>
                </div>
              );
            })}
            {tickets.length === 0 && <div className="p-6 text-center text-gray-500">No tickets yet.</div>}
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div>
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F7931A] font-bold">{selectedTicket.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedTicket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>{selectedTicket.status}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{selectedTicket.subject}</h3>
                  <div className="text-xs font-mono text-gray-400">Category: {selectedTicket.category}</div>
                </div>

                <div className="space-y-4 my-4 max-h-72 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((msg) => {
                    const isInvestor = msg.senderRole === 'investor';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isInvestor ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] font-mono text-gray-500 mb-1">{msg.senderName} • {msg.createdAt}</div>
                        <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] font-sans leading-relaxed ${
                          isInvestor ? 'bg-[#F7931A] text-gray-950 font-medium rounded-tr-xs' : 'bg-gray-950 border border-gray-800 text-gray-200 rounded-tl-xs'
                        }`}>{msg.message}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message to support..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs font-mono placeholder-gray-500 focus:outline-hidden focus:border-[#F7931A]"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="p-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs font-mono">No ticket selected. Raise a new ticket above.</div>
          )}
        </div>
      </div>

      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F7931A]" />
                <span className="font-bold uppercase text-sm">Raise Support Ticket</span>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-gray-400 mb-1">Subject / Issue Summary:</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Question about my August statement"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Message:</label>
                <textarea
                  required
                  rows={4}
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="Provide relevant details..."
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white font-sans focus:outline-hidden focus:border-[#F7931A]"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button type="button" onClick={() => setShowNewTicketModal(false)} className="px-4 py-3 rounded-xl bg-gray-800 text-gray-300 cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
