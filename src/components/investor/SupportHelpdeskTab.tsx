import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Phone, 
  User, 
  Send, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { SupportTicket, InvestorUser } from '../../types';

interface SupportHelpdeskTabProps {
  tickets: SupportTicket[];
  user: InvestorUser;
  onAddTicket: (ticket: SupportTicket) => void;
  onAddMessage: (ticketId: string, messageText: string) => void;
}

export const SupportHelpdeskTab: React.FC<SupportHelpdeskTabProps> = ({
  tickets,
  user,
  onAddTicket,
  onAddMessage
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [callRequested, setCallRequested] = useState(false);
  
  // New ticket state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Mining earnings');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('Medium');
  const [newInitialMsg, setNewInitialMsg] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddMessage(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newInitialMsg.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      ticketNumber: `SUP-2026-${Date.now().toString().slice(-4)}`,
      subject: newSubject.trim(),
      category: newCategory,
      status: 'Open',
      priority: newPriority,
      createdDate: '26 Aug 2026',
      lastUpdated: 'Just now',
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: 'Investor',
          senderName: user.name,
          text: newInitialMsg.trim(),
          timestamp: '26 Aug 2026, 07:55 UTC'
        }
      ]
    };

    onAddTicket(newTicket);
    setSelectedTicketId(newTicket.id);
    setShowNewTicketModal(false);
    setNewSubject('');
    setNewInitialMsg('');
  };

  const handleRequestCall = () => {
    setCallRequested(true);
    setTimeout(() => setCallRequested(false), 4000);
  };

  const categories: SupportTicket['category'][] = [
    'Payment',
    'Withdrawal',
    'Wallet',
    'Mining earnings',
    'KYC',
    'Investment agreement',
    'Technical issue'
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>EXECUTIVE INVESTOR DESK (MUSCAT HQ)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Institutional Support & Relationship Management
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Dedicated private wealth managers, 24/7 technical operations desk, and priority SLA responses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Support Ticket</span>
          </button>
        </div>
      </div>

      {callRequested && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Call Request Registered: Your Relationship Manager (Sultan Al-Habsi) will call you within 15 minutes.</span>
        </div>
      )}

      {/* Relationship Manager Contact Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-gray-950 font-bold text-base flex items-center justify-center shrink-0 shadow-lg font-mono">
            SH
          </div>
          <div>
            <div className="text-xs font-mono text-[#F7931A] font-bold uppercase">Dedicated Relationship Manager</div>
            <div className="text-base font-extrabold text-white">Sultan Al-Habsi</div>
            <div className="text-xs text-gray-400 font-mono">Executive Private Wealth Desk • Muscat S.A.O.C</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={handleRequestCall}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#F7931A]" />
            <span>Request Immediate Callback</span>
          </button>

          <a
            href="https://wa.me/96891234567"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct WhatsApp RM</span>
          </a>
        </div>
      </div>

      {/* Main Support Grid: Left Ticket List, Right Active Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ticket History List (5 Cols) */}
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
                    isSelected
                      ? 'bg-gray-900 border-[#F7931A] shadow-md shadow-[#F7931A]/10'
                      : 'bg-gray-900/60 border-gray-800 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                    <span className="text-[#F7931A] font-bold">{ticket.ticketNumber}</span>
                    <span>{ticket.lastUpdated}</span>
                  </div>

                  <div className="text-xs font-bold text-white line-clamp-1">{ticket.subject}</div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                      {ticket.category}
                    </span>
                    <span className={`font-bold ${
                      ticket.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Ticket Thread (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 flex flex-col justify-between">
          
          {selectedTicket ? (
            <>
              <div>
                {/* Thread Header */}
                <div className="border-b border-gray-800 pb-4 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F7931A] font-bold">{selectedTicket.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{selectedTicket.subject}</h3>
                  <div className="text-xs font-mono text-gray-400">Category: {selectedTicket.category} • Priority: {selectedTicket.priority}</div>
                </div>

                {/* Messages Feed */}
                <div className="space-y-4 my-4 max-h-72 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((msg) => {
                    const isInvestor = msg.sender === 'Investor';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isInvestor ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] font-mono text-gray-500 mb-1">
                          {msg.senderName} • {msg.timestamp}
                        </div>
                        <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] font-sans leading-relaxed ${
                          isInvestor
                            ? 'bg-[#F7931A] text-gray-950 font-medium rounded-tr-xs'
                            : 'bg-gray-950 border border-gray-800 text-gray-200 rounded-tl-xs'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message to your support officer..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs font-mono placeholder-gray-500 focus:outline-hidden focus:border-[#F7931A]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs font-mono">
              No ticket selected. Raise a new ticket above.
            </div>
          )}

        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-2xl space-y-4 animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F7931A]" />
                <span className="font-bold uppercase text-sm">Raise Support Ticket</span>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
              >
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
                  placeholder="e.g. Inquiring on August 2026 power audit statement..."
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Priority Level:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Initial Message / Inquiry Details:</label>
                <textarea
                  required
                  rows={4}
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="Provide all relevant details, wallet references, or contract clauses..."
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white font-sans focus:outline-hidden focus:border-[#F7931A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold cursor-pointer"
                >
                  Submit Ticket to Muscat Helpdesk
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-3 rounded-xl bg-gray-800 text-gray-300 cursor-pointer"
                >
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
