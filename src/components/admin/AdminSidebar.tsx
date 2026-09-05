import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Receipt,
  Cpu,
  Server,
  Zap,
  BookOpen,
  PieChart,
  Calculator,
  Wallet,
  ArrowUpRight,
  DollarSign,
  Scale,
  ShieldCheck,
  FileText,
  CalendarDays,
  Headphones,
  Bell,
  FileCheck,
  UserCog,
  Sliders,
  LogOut,
  Globe,
  CheckCircle2,
  ChevronRight,
  Shield
} from 'lucide-react';
import { AdminTab, AdminUser } from '../../types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  adminUser: AdminUser;
  onLogout: () => void;
  onNavigateWebsite: () => void;
  pendingPayoutCount: number;
  pendingKycCount: number;
  openTicketCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  hidden?: boolean;
  items: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    hidden?: boolean;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  adminUser,
  onLogout,
  onNavigateWebsite,
  pendingPayoutCount,
  pendingKycCount,
  openTicketCount,
  isMobileOpen,
  onCloseMobile
}) => {
  const sections: NavSection[] = [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INVESTOR RELATIONS',
      items: [
        { id: 'all-investors', label: 'Investor Management', icon: Users },
        { id: 'kyc-queue', label: 'KYC & Compliance', icon: ShieldCheck, badge: pendingKycCount, badgeColor: 'bg-amber-500 text-black' },
        { id: 'investment-plans', label: 'Investment Plans', icon: Layers },
        { id: 'investor-allocations', label: 'Hashrate Allocations', icon: PieChart, hidden: true }
      ]
    },
    {
      title: 'CAPITAL & TRANSACTIONS',
      items: [
        { id: 'investment-transactions', label: 'Investment Txns', icon: Receipt },
        { id: 'all-documents', label: 'Contracts & Vault', icon: FileText }
      ]
    },
    {
      title: 'MINING OPERATIONS',
      hidden: true,
      items: [
        { id: 'mining-overview', label: 'Mining Farms (MCT/SLL)', icon: Zap },
        { id: 'asic-machines', label: 'ASIC Machine Fleet', icon: Cpu, badge: '1,220', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'mining-pools', label: 'Mining Pools', icon: Server },
        { id: 'production-ledger', label: 'BTC Production Ledger', icon: BookOpen, badge: 'Daily', badgeColor: 'bg-blue-500/20 text-blue-300' },
        { id: 'calculation-engine', label: 'Earnings Engine', icon: Calculator }
      ]
    },
    {
      title: 'TREASURY & PAYOUTS',
      items: [
        { id: 'company-wallets', label: 'Company Wallets', icon: Wallet, badge: 'Multi-Sig', badgeColor: 'bg-purple-500/20 text-purple-300' },
        { id: 'payout-queue', label: 'Payout Management', icon: ArrowUpRight, badge: pendingPayoutCount, badgeColor: 'bg-rose-500 text-white' }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTING',
      hidden: true,
      items: [
        { id: 'finance-overview', label: 'Finance & P&L', icon: DollarSign },
        { id: 'investor-liabilities', label: 'Investor Liability Ledger', icon: Scale },
        { id: 'monthly-statements', label: 'Statement Generator', icon: CalendarDays }
      ]
    },
    {
      title: 'CRM & COMMUNICATIONS',
      items: [
        { id: 'support-crm', label: 'Support / CRM Tickets', icon: Headphones, badge: openTicketCount, badgeColor: 'bg-blue-500 text-white', hidden: true },
        { id: 'notifications-center', label: 'Communication Center', icon: Bell },
        { id: 'reports-financial', label: 'Reports & Analytics', icon: PieChart, hidden: true }
      ]
    },
    {
      title: 'GOVERNANCE & SYSTEM',
      items: [
        { id: 'audit-logs', label: 'Audit Trail Logs', icon: FileCheck, hidden: true },
        { id: 'users-roles', label: 'Roles & Permissions', icon: UserCog, hidden: true },
        { id: 'system-settings', label: 'System Settings', icon: Sliders }
      ]
    }
  ];

  const handleSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-30 w-72 shrink-0 bg-[#0B1120] text-gray-300 border-r border-gray-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:h-screen lg:sticky lg:top-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-800/80 bg-[#070B14]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/finovateck_favicon.svg"
              alt="FINOVATECK"
              className="w-9 h-9 rounded-xl shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">FINOVATECK</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 block tracking-wider uppercase">
                Operations & Control
              </span>
            </div>
          </div>

          {/* Live System Indicator (Desktop) / Close (Mobile) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ONLINE</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
        </div>

      {/* Admin Profile Strip */}
      <div className="px-4 py-3 bg-[#0F172A]/70 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={adminUser.avatar}
            alt={adminUser.name}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/40"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{adminUser.name}</div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 truncate">
              <Shield className="w-2.5 h-2.5 shrink-0" />
              <span>{adminUser.role}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign Out of Admin Portal"
          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar text-xs">
        {sections.filter((sec) => !sec.hidden).map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.filter((item) => !item.hidden).map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group cursor-pointer
                      ${isActive
                        ? 'bg-linear-to-r from-[#F7931A]/20 to-amber-500/5 text-white font-semibold border-l-3 border-[#F7931A] shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#F7931A]' : 'text-gray-500 group-hover:text-gray-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge !== 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-gray-800/80 bg-[#070B14]/80 space-y-2">
        <button
          onClick={onNavigateWebsite}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-gray-700"
        >
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <span>Switch to Main Website</span>
        </button>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 px-1 pt-1">
          <span>v3.4.0-PROD</span>
          <span>MCT-01 SSL SHA256</span>
        </div>
      </div>
    </aside>
  </>
  );
};
