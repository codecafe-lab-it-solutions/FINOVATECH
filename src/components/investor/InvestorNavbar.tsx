import React, { useState } from 'react';
import { 
  Bell, 
  Wallet, 
  LogOut, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import { InvestorUser, InvestorTab } from '../../types';
import { ApiNotification } from '../../lib/api';

interface InvestorNavbarProps {
  user: InvestorUser;
  walletBalanceBtc: number;
  notifications: ApiNotification[];
  currentTab: InvestorTab;
  onSelectTab: (tab: InvestorTab) => void;
  onLogout: () => void;
  onNavigateWebsite: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const InvestorNavbar: React.FC<InvestorNavbarProps> = ({
  user,
  walletBalanceBtc,
  notifications,
  currentTab,
  onSelectTab,
  onLogout,
  onNavigateWebsite,
  onToggleMobileSidebar,
  isMobileSidebarOpen
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-gray-800 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Mobile Drawer Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-hidden cursor-pointer"
              aria-label="Toggle Navigation Sidebar"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src="/finovateck_favicon.svg"
                alt="FINOVATECK"
                className="w-8 h-8 rounded-xl shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    FINOVATECK
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/20 text-[#F7931A] text-[9px] font-mono font-bold uppercase tracking-wider">
                    INVESTOR PORTAL
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block">
                  Node: Muscat MCT-01
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Bitcoin Telemetry Badge */}
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-gray-900/90 border border-gray-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse" />
              <span>BTC/USD: $64,280</span>
            </div>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.42% (24h)
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Diff: 84.42 T</span>
          </div>

          {/* Right: Actions & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Wallet Button */}
            <button
              onClick={() => onSelectTab('wallet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                currentTab === 'wallet'
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wallet:</span>
              <span className="text-[#F7931A] group-hover:text-amber-400 font-bold">{walletBalanceBtc} BTC</span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F7931A] text-gray-950 text-[10px] font-bold flex items-center justify-center animate-pulse font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl z-50 p-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Investor Notifications
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#F7931A]/20 text-[#F7931A] text-[10px] font-mono font-bold">
                        {unreadCount} New
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectTab('notifications');
                      }}
                      className="text-[11px] text-[#F7931A] hover:underline font-mono cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="divide-y divide-gray-800/80 max-h-72 overflow-y-auto mt-2 space-y-1">
                    {notifications.slice(0, 3).map((item) => (
                      <div key={item.id} className="py-2.5 px-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
                          <span className="text-[#F7931A] font-semibold uppercase">{item.type}</span>
                          <span>{item.createdAt}</span>
                        </div>
                        <div className="text-xs font-semibold text-white">{item.title}</div>
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{item.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-6 text-center text-[11px] text-gray-500">No notifications yet.</div>
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-gray-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectTab('notifications');
                      }}
                      className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors cursor-pointer"
                    >
                      Open Notification Center
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Back to Website Button */}
            <button
              onClick={onNavigateWebsite}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/70 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-xs font-mono transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <Globe className="w-3.5 h-3.5 text-[#F7931A]" />
              <span>Public Site</span>
            </button>

            {/* User Profile Pill & Logout Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-gray-800/90 hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-gray-950 font-bold text-xs flex items-center justify-center shadow-inner">
                  TA
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                    {user.name.split(' ')[0]} {user.name.split(' ')[1]?.[0]}.
                  </div>
                  <div className={`text-[10px] font-mono leading-none ${
                    user.kycStatus === 'Verified'
                      ? 'text-emerald-400'
                      : user.kycStatus === 'Action Required'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                  }`}>
                    KYC {user.kycStatus}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl z-50 p-2 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-gray-800">
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">{user.id}</div>
                    <div className="text-[10px] font-mono text-[#F7931A] mt-0.5">{user.plan}</div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectTab('profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer font-mono"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Investor Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectTab('security');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer font-mono"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Security Center</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateWebsite();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer font-mono lg:hidden"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#F7931A]" />
                      <span>Return to Public Site</span>
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t border-gray-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer font-mono font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
