import { Money } from '../../lib/currency';
import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Zap,
  Shield,
  RefreshCw,
  Cpu,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { AdminTab, AdminUser, AdminRole } from '../../types';

interface AdminHeaderProps {
  currentTab: AdminTab;
  adminUser: AdminUser;
  onChangeRole: (newRole: AdminRole) => void;
  onToggleMobileSidebar: () => void;
  onLogout: () => void;
  spotBtcPriceUsd: number;
  totalHashratePH: number;
  miningUptimePercent: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  adminUser,
  onChangeRole,
  onToggleMobileSidebar,
  onLogout,
  spotBtcPriceUsd,
  totalHashratePH,
  miningUptimePercent
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rolesList: AdminRole[] = [
    'Super Admin',
    'Finance Admin',
    'Mining Operations',
    'Investor Manager',
    'Auditor / Read Only'
  ];

  const getTabLabel = (tab: AdminTab): string => {
    switch (tab) {
      case 'dashboard': return 'Admin Business Dashboard';
      case 'all-investors': return 'Investor Management & Profiles';
      case 'kyc-queue': return 'KYC & Compliance Verification Queue';
      case 'referrals': return 'Referral Overview';
      case 'investment-plans': return 'Investment Plans & Capacity Allocation';
      case 'investor-allocations': return 'Investor Hashrate Allocations';
      case 'investment-transactions': return 'Capital Transactions & Receipts';
      case 'all-documents': return 'Contracts & Document Vault';
      case 'mining-overview': return 'Mining Facilities (Muscat MCT-01 / Salalah SLL-02)';
      case 'asic-machines': return 'ASIC Machine Fleet Telemetry';
      case 'mining-pools': return 'Mining Pools & Reconciliation';
      case 'production-ledger': return 'Daily BTC Production Ledger';
      case 'calculation-engine': return 'Earnings Calculation Engine';
      case 'company-wallets': return 'Company Wallets & Multi-Sig Vaults';
      case 'payout-queue': return 'Investor Payout Queue & Approvals';
      case 'finance-overview': return 'Financial Overview & P&L Statement';
      case 'investor-liabilities': return 'Investor Liability Ledger';
      case 'monthly-statements': return 'Monthly Statement Generator';
      case 'support-crm': return 'Support Helpdesk & CRM';
      case 'notifications-center': return 'Communication & Notification Center';
      case 'reports-financial': return 'Analytics & Reporting Engine';
      case 'audit-logs': return 'Security & Financial Audit Logs';
      case 'users-roles': return 'Admin Users, Roles & Permissions';
      case 'system-settings': return 'System Settings & Operational Parameters';
      default: return 'Admin Management';
    }
  };

  return (
    <header id="admin-header" className="sticky top-0 z-30 bg-ink-900/95 backdrop-blur-md border-b border-line/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Hamburger + Title / Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-ink-800/80 text-fg-body hover:text-white hover:bg-ink-700 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-fg-muted">
              <span>FINOVATECK CONTROL</span>
              <span>/</span>
              <span className="text-gold-500 font-semibold uppercase">{currentTab.replace('-', ' ')}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {getTabLabel(currentTab)}
            </h1>
          </div>
        </div>

        {/* Middle Status Ticker (Desktop) */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-850/90 border border-line text-xs font-mono">
            <span className="text-fg-muted">BTC Spot:</span>
            <span className="text-emerald-400 font-bold">{spotBtcPriceUsd > 0 ? <Money usd={spotBtcPriceUsd} /> : 'Unavailable'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-850/90 border border-line text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-fg-muted">Fleet Hashrate:</span>
            <span className="text-white font-bold">{totalHashratePH.toFixed(1)} PH/s</span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono ${
            miningUptimePercent > 0
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-ink-800/60 border border-line-warm text-fg-muted'
          }`}>
            <span className={`w-2 h-2 rounded-full ${miningUptimePercent > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-ink-900'}`}></span>
            <span>{miningUptimePercent > 0 ? `MCT-01: ${miningUptimePercent}% SLA` : 'No Active Facility'}</span>
          </div>
        </div>

        {/* Right Side: Role Selector + Actions + Notifications */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink-850 border border-line-warm hover:border-line-warm text-xs text-fg-body font-medium cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-gold-200" />
              <span className="hidden md:inline font-mono">{adminUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-ink-950 border border-line-warm shadow-2xl p-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-mono text-fg-muted uppercase font-semibold border-b border-line mb-1">
                  Switch Admin Role (Demo)
                </div>
                {rolesList.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onChangeRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      adminUser.role === role
                        ? 'bg-gold-500/20 text-gold-100 font-semibold'
                        : 'text-fg-body hover:bg-ink-800'
                    }`}
                  >
                    <span>{role}</span>
                    {adminUser.role === role && <CheckCircle2 className="w-3.5 h-3.5 text-gold-200" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-ink-850 border border-line-warm text-fg-body hover:text-white cursor-pointer"
              aria-label="System Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-ink-850"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-ink-950 border border-line-warm shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-line mb-2">
                  <span className="font-semibold text-white font-mono">System Alerts</span>
                  <span className="text-[10px] text-gold-200 font-mono">3 Unresolved</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                    <div className="font-semibold flex items-center gap-1.5 text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Temp Alert (Rack B-04)
                    </div>
                    <p className="text-[11px] text-fg-body mt-1">ASIC MCT-M60S-R04-12 exceeded 76°C. Fan warning.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-100">
                    <div className="font-semibold flex items-center gap-1.5 text-gold-100">
                      <Shield className="w-3.5 h-3.5" /> 2 KYC Submissions Pending
                    </div>
                    <p className="text-[11px] text-fg-body mt-1">Marcus Vance & Elena Rostova waiting review.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-300">
                    <div className="font-semibold flex items-center gap-1.5 text-gold-300">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Payout Queue: 1.82 BTC
                    </div>
                    <p className="text-[11px] text-fg-body mt-1">Daily batch scheduled for 14:00 UTC execution.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign Out of Admin"
            className="p-2 rounded-xl bg-ink-850 border border-line-warm text-fg-muted hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
