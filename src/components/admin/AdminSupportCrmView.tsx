import React, { useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Search,
  User,
  PlusCircle,
  X,
  Filter
} from 'lucide-react';
import { AdminSupportTicket } from '../../types';

interface AdminSupportCrmViewProps {
  tickets: AdminSupportTicket[];
}

export const AdminSupportCrmView: React.FC<AdminSupportCrmViewProps> = ({ tickets: initialTickets }) => {
  const [ticketList, setTicketList] = useState<AdminSupportTicket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = ticketList.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.investorName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    const newMsg = {
      sender: 'Gaurav K. Sharma (Support Lead)',
      time: 'Just now',
      message: replyMessage.trim(),
      isAdmin: true
    };
    const updated: AdminSupportTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
      status: 'In Progress'
    };
    setSelectedTicket(updated);
    setTicketList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyMessage('');
  };

  const handleAddInternalNote = () => {
    if (!selectedTicket || !internalNote.trim()) return;
    const updated: AdminSupportTicket = {
      ...selectedTicket,
      internalNotes: [internalNote.trim(), ...selectedTicket.internalNotes]
    };
    setSelectedTicket(updated);
    setTicketList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setInternalNote('');
  };

  const handleCloseTicket = (id: string) => {
    setTicketList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>INVESTOR RELATIONSHIP DESK & TICKETING CRM</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Support Desk & Relationship CRM</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Direct VIP investor inquiries, multi-sig wallet update requests, and phone logs.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by investor, subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Ticket ID & Subject</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Assigned To</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#F7931A]" />
                      <span>{t.subject}</span>
                    </div>
                    <div className="text-[11px] font-mono text-gray-400">{t.id} • {t.createdDate}</div>
                  </td>

                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-semibold text-white">{t.investorName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{t.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                      {t.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                      t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-300">{t.assignedTo}</td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Open' ? 'bg-amber-500/20 text-amber-300' :
                      t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(t);
                      }}
                      className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-200 text-[11px] font-mono transition-colors"
                    >
                      Open Thread
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedTicket.subject}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-amber-400">
                    {selectedTicket.id}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">
                  Investor: {selectedTicket.investorName} ({selectedTicket.investorId})
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold cursor-pointer"
                  >
                    ✓ Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-950/60 rounded-2xl border border-gray-800 max-h-72">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-xs font-mono ${
                    msg.isAdmin
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 ml-8'
                      : 'bg-gray-900 border border-gray-800 text-gray-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-gray-400">
                    <span className="font-bold text-white">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-gray-300 font-sans text-xs">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Internal Notes Section */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Internal Admin Notes:</div>
              {selectedTicket.internalNotes.map((note, idx) => (
                <div key={idx} className="text-xs text-amber-200/90 font-mono">• {note}</div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add private compliance/admin note..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-xs font-mono"
                />
                <button
                  onClick={handleAddInternalNote}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Send Reply */}
            <div className="flex gap-2">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type response to investor..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              />
              <button
                onClick={handleSendReply}
                className="px-5 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
