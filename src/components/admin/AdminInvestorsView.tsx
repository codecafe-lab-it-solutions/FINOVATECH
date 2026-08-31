import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
  PlusCircle,
  FileText,
  Wallet,
  DollarSign,
  TrendingUp,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Headphones,
  Save,
  MessageSquare
} from 'lucide-react';
import { AdminInvestorItem } from '../../types';

interface AdminInvestorsViewProps {
  investors: AdminInvestorItem[];
  onUpdateInvestor?: (updated: AdminInvestorItem) => void;
}

export const AdminInvestorsView: React.FC<AdminInvestorsViewProps> = ({
  investors: initialInvestors,
  onUpdateInvestor
}) => {
  const [investorsList, setInvestorsList] = useState<AdminInvestorItem[]>(initialInvestors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedInvestor, setSelectedInvestor] = useState<AdminInvestorItem | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'personal' | 'investment' | 'wallet' | 'earnings' | 'support'>('personal');
  const [newNoteText, setNewNoteText] = useState('');

  const filterOptions = [
    'All',
    'Active',
    'Pending KYC',
    'Suspended',
    'Contract Expiring',
    'High Value',
    'Pending Payment',
    'Pending Withdrawal'
  ];

  const filteredInvestors = useMemo(() => {
    return investorsList.filter((inv) => {
      // Search matches
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        inv.name.toLowerCase().includes(query) ||
        inv.id.toLowerCase().includes(query) ||
        inv.email.toLowerCase().includes(query) ||
        inv.country.toLowerCase().includes(query) ||
        inv.walletAddress.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Filter matches
      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'Active') return inv.accountStatus === 'Active' || inv.accountStatus === 'High Value';
      if (selectedFilter === 'Pending KYC') return inv.kycStatus !== 'Approved' || inv.accountStatus === 'Pending KYC';
      if (selectedFilter === 'Contract Expiring') return inv.contractStatus === 'Expiring' || inv.accountStatus === 'Contract Expiring';
      if (selectedFilter === 'High Value') return inv.investmentAmountUsd >= 100000 || inv.accountStatus === 'High Value';
      if (selectedFilter === 'Pending Payment') return inv.accountStatus === 'Pending Payment';
      if (selectedFilter === 'Pending Withdrawal') return inv.pendingPayoutBtc > 0;
      if (selectedFilter === 'Suspended') return inv.accountStatus === 'Suspended';

      return true;
    });
  }, [investorsList, searchQuery, selectedFilter]);

  const handleAddNote = () => {
    if (!selectedInvestor || !newNoteText.trim()) return;
    const updated = {
      ...selectedInvestor,
      notes: [newNoteText.trim(), ...selectedInvestor.notes]
    };
    setSelectedInvestor(updated);
    setInvestorsList((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    if (onUpdateInvestor) onUpdateInvestor(updated);
    setNewNoteText('');
  };

  const handleToggleKyc = (newStatus: AdminInvestorItem['kycStatus']) => {
    if (!selectedInvestor) return;
    const updated: AdminInvestorItem = {
      ...selectedInvestor,
      kycStatus: newStatus,
      accountStatus: newStatus === 'Approved' ? 'Active' : selectedInvestor.accountStatus
    };
    setSelectedInvestor(updated);
    setInvestorsList((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    if (onUpdateInvestor) onUpdateInvestor(updated);
  };

  const getKycBadge = (status: AdminInvestorItem['kycStatus']) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">Approved</span>;
      case 'Submitted':
      case 'Under Review':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">Under Review</span>;
      case 'Pending':
        return <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 font-mono text-[10px] font-bold">Pending</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 font-mono text-[10px] font-bold">{status}</span>;
    }
  };

  const getAccountBadge = (status: AdminInvestorItem['accountStatus']) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">Active</span>;
      case 'High Value':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[10px] font-bold">VIP High Value</span>;
      case 'Pending KYC':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px]">Pending KYC</span>;
      case 'Contract Expiring':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono text-[10px]">Expiring</span>;
      case 'Pending Payment':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[10px]">Pending Wire</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 font-mono text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Search / Filters */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Investor Directory & Ledgers</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Managing 248 enterprise and institutional mining accounts with real-time auditability.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, email, country, or wallet..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-xs font-mono focus:outline-hidden focus:border-[#F7931A]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs font-mono">
          <span className="text-gray-500 text-[11px] uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-[#F7931A] text-gray-950 font-bold shadow-sm'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Investor Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3">Country</th>
                <th className="py-3.5 px-3">KYC Status</th>
                <th className="py-3.5 px-3 text-right">Investment</th>
                <th className="py-3.5 px-3 text-right">BTC Allocated</th>
                <th className="py-3.5 px-3 text-right">Current Value</th>
                <th className="py-3.5 px-3 text-right">ROI %</th>
                <th className="py-3.5 px-3">Contract</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredInvestors.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvestor(inv)}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt={inv.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#F7931A] transition-colors">
                          {inv.name}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">
                          {inv.id} • {inv.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400">{inv.country}</td>
                  
                  <td className="py-3.5 px-3">{getKycBadge(inv.kycStatus)}</td>

                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    ${inv.investmentAmountUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-right font-semibold text-[#F7931A]">
                    {inv.btcAllocation.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    ${inv.currentValueUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    +{inv.roiPercent}%
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      inv.contractStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-300' :
                      inv.contractStatus === 'Expiring' ? 'bg-amber-500/10 text-amber-300' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {inv.contractStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">{getAccountBadge(inv.accountStatus)}</td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvestor(inv);
                      }}
                      className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-300 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Investor Profile Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#0F172A] border-b border-gray-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedInvestor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={selectedInvestor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#F7931A]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">{selectedInvestor.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                      {selectedInvestor.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 font-mono">
                    <span>{selectedInvestor.email}</span>
                    <span>•</span>
                    <span>{selectedInvestor.phone}</span>
                    <span>•</span>
                    <span>{selectedInvestor.country}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvestor(null)}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs Navigation */}
            <div className="flex items-center border-b border-gray-800 bg-[#070B14] px-6 text-xs font-mono">
              {[
                { id: 'personal', label: '1. Personal & KYC' },
                { id: 'investment', label: '2. Investment Plan' },
                { id: 'wallet', label: '3. Wallet & Balance' },
                { id: 'earnings', label: '4. Mining Earnings' },
                { id: 'support', label: '5. Support & Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 font-semibold transition-colors cursor-pointer ${
                    activeProfileTab === tab.id
                      ? 'border-[#F7931A] text-[#F7931A]'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Tab 1: Personal & KYC */}
              {activeProfileTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
                      <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Contact Profile</div>
                      <div className="text-gray-300"><strong className="text-white">Full Legal Name:</strong> {selectedInvestor.name}</div>
                      <div className="text-gray-300"><strong className="text-white">Email:</strong> {selectedInvestor.email}</div>
                      <div className="text-gray-300"><strong className="text-white">Phone:</strong> {selectedInvestor.phone}</div>
                      <div className="text-gray-300"><strong className="text-white">Country:</strong> {selectedInvestor.country}</div>
                      <div className="text-gray-300"><strong className="text-white">Assigned RM:</strong> {selectedInvestor.assignedRm}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                      <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Compliance Status</div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">KYC Status:</span>
                        {getKycBadge(selectedInvestor.kycStatus)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Submitted:</span>
                        <span className="font-mono text-gray-200">{selectedInvestor.kycSubmittedDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Documents on File:</span>
                        <span className="font-mono text-[#F7931A]">{selectedInvestor.kycDocumentsCount} Documents (Passport, Utility)</span>
                      </div>
                      
                      {/* Admin Quick KYC Actions */}
                      <div className="pt-2 flex items-center gap-2 border-t border-gray-800">
                        <button
                          onClick={() => handleToggleKyc('Approved')}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-colors"
                        >
                          ✓ Approve KYC
                        </button>
                        <button
                          onClick={() => handleToggleKyc('Rejected')}
                          className="flex-1 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Investment Plan */}
              {activeProfileTab === 'investment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Capital Invested</div>
                      <div className="text-lg font-bold text-white font-mono mt-1">
                        ${selectedInvestor.investmentAmountUsd.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Current Value</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                        ${selectedInvestor.currentValueUsd.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Net ROI</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                        +{selectedInvestor.roiPercent}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">BTC Allocation</div>
                      <div className="text-lg font-bold text-[#F7931A] font-mono mt-1">
                        {selectedInvestor.btcAllocation} BTC
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Contract Terms</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-400">Plan:</span> <span className="text-white font-semibold">{selectedInvestor.planName}</span></div>
                      <div><span className="text-gray-400">Agreement No:</span> <span className="font-mono text-amber-300">{selectedInvestor.agreementNumber}</span></div>
                      <div><span className="text-gray-400">Start Date:</span> <span className="text-gray-200">{selectedInvestor.startDate}</span></div>
                      <div><span className="text-gray-400">End Date:</span> <span className="text-gray-200">{selectedInvestor.endDate}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Wallet & Balance */}
              {activeProfileTab === 'wallet' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Whitelisted Cold Storage Address</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        {selectedInvestor.walletStatus}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs text-amber-400 break-all select-all">
                      {selectedInvestor.walletAddress}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
                      <div className="text-[10px] text-gray-400 uppercase">Available BTC Balance</div>
                      <div className="text-base font-bold text-white font-mono mt-1">{selectedInvestor.btcBalance} BTC</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
                      <div className="text-[10px] text-gray-400 uppercase">Total BTC Paid Out</div>
                      <div className="text-base font-bold text-emerald-400 font-mono mt-1">{selectedInvestor.totalPaidOutBtc} BTC</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-center">
                      <div className="text-[10px] text-gray-400 uppercase">Pending Payout</div>
                      <div className="text-base font-bold text-amber-400 font-mono mt-1">{selectedInvestor.pendingPayoutBtc} BTC</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Mining Earnings */}
              {activeProfileTab === 'earnings' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Production Summary</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-400">Total BTC Mined:</span> <span className="font-mono text-[#F7931A] font-bold">{selectedInvestor.totalMinedBtc} BTC</span></div>
                      <div><span className="text-gray-400">OPEX Deduction Rate:</span> <span className="font-mono text-gray-200">$0.042 / kWh (Immersion Locked)</span></div>
                      <div><span className="text-gray-400">Management Fee:</span> <span className="font-mono text-gray-200">6.5%</span></div>
                      <div><span className="text-gray-400">Disbursement Cycle:</span> <span className="font-mono text-gray-200">Monthly On-Chain Batch</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Support & Notes */}
              {activeProfileTab === 'support' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                    <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Internal Management Notes</div>
                    <div className="space-y-2">
                      {selectedInvestor.notes.map((note, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 flex items-start gap-2">
                          <span className="text-[#F7931A]">•</span>
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add New Note */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add internal compliance or operational note..."
                        className="flex-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 text-xs font-mono focus:outline-hidden focus:border-[#F7931A]"
                      />
                      <button
                        onClick={handleAddNote}
                        className="px-4 py-2 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono transition-colors cursor-pointer"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0F172A] border-t border-gray-800 flex items-center justify-between">
              <div className="text-[11px] font-mono text-gray-500">
                Last Authenticated: {selectedInvestor.lastLogin}
              </div>
              <button
                onClick={() => setSelectedInvestor(null)}
                className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
