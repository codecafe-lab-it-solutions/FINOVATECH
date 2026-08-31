import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Activity, 
  Wallet, 
  History, 
  CreditCard, 
  TrendingUp, 
  Server, 
  FolderArchive, 
  FileSpreadsheet, 
  Bell, 
  HelpCircle, 
  Users, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { InvestorTab } from '../../types';

interface InvestorSidebarProps {
  currentTab: InvestorTab;
  onSelectTab: (tab: InvestorTab) => void;
  unreadNotificationsCount: number;
  openTicketsCount: number;
  hasActiveAllocation: boolean;
}

export const InvestorSidebar: React.FC<InvestorSidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadNotificationsCount,
  openTicketsCount,
  hasActiveAllocation
}) => {
  type MenuItem = {
    id: InvestorTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    hidden?: boolean;
  };

  const menuGroups: { group: string; hidden?: boolean; items: MenuItem[] }[] = [
    {
      group: 'Core Portfolio',
      items: [
        { id: 'overview' as InvestorTab, label: 'Overview Dashboard', icon: LayoutDashboard },
        { id: 'profile' as InvestorTab, label: 'Investor Profile & KYC', icon: User },
        { id: 'investment' as InvestorTab, label: 'Investment Terms & Docs', icon: FileText },
        { id: 'mining-performance' as InvestorTab, label: 'Live Mining Telemetry', icon: Activity, hidden: true },
      ]
    },
    {
      group: 'Financials & Yields',
      items: [
        { id: 'wallet' as InvestorTab, label: 'Dedicated BTC Wallet', icon: Wallet },
        { id: 'earnings-history' as InvestorTab, label: 'Earnings / Mining Log', icon: History },
        { id: 'payout-history' as InvestorTab, label: 'Payout Records', icon: CreditCard },
        { id: 'roi-performance' as InvestorTab, label: 'ROI & Growth Analytics', icon: TrendingUp, hidden: true },
      ]
    },
    {
      group: 'Facility & Audits',
      hidden: true,
      items: [
        { id: 'infrastructure-fleet' as InvestorTab, label: 'Pod & Miner Fleet', icon: Server },
        { id: 'reports' as InvestorTab, label: 'Document Center', icon: FolderArchive },
        { id: 'monthly-statements' as InvestorTab, label: 'Monthly Statements', icon: FileSpreadsheet, badge: 'Aug 26' },
      ]
    },
    {
      group: 'Account & Operations',
      hidden: true,
      items: [
        {
          id: 'notifications' as InvestorTab,
          label: 'Notification Center',
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined
        },
        {
          id: 'support' as InvestorTab,
          label: 'Support & RM Helpdesk',
          icon: HelpCircle,
          badge: openTicketsCount > 0 ? `${openTicketsCount} Active` : undefined
        },
        { id: 'referrals' as InvestorTab, label: 'Partner / Referrals', icon: Users },
        { id: 'security' as InvestorTab, label: 'Security & 2FA Center', icon: ShieldCheck },
      ]
    }
  ];

  // Numbering is derived from visible items only, so a hidden section never
  // leaves a gap (e.g. 3 then 5) that would hint something was removed.
  let visibleItemNumber = 0;

  return (
    <aside className="w-full lg:w-72 bg-[#0F172A] border-r border-gray-800 text-gray-300 flex flex-col justify-between shrink-0 select-none">
      
      {/* Scrollable Navigation List */}
      <div className="p-3 sm:p-4 space-y-6 overflow-y-auto max-h-[calc(100dvh-4rem)]">
        
        {menuGroups.filter((group) => !group.hidden).map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">

            {/* Group Category Header */}
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-3 py-1">
              {group.group}
            </div>

            {/* Menu Buttons */}
            {group.items.filter((item) => !item.hidden).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              visibleItemNumber += 1;
              return (
                <button
                  key={item.id}
                  id={`investor-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left min-h-[42px] ${
                    isActive
                      ? 'bg-[#F7931A] text-gray-950 font-bold shadow-md shadow-[#F7931A]/10'
                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-gray-950' : 'text-gray-400 group-hover:text-[#F7931A]'
                    }`} />
                    <span className="truncate">{visibleItemNumber}. {item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                      isActive ? 'bg-gray-950 text-[#F7931A]' : 'bg-gray-800 text-[#F7931A] border border-gray-700'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'opacity-100 text-gray-950' : 'text-gray-500'
                    }`} />
                  )}
                </button>
              );
            })}

          </div>
        ))}

        {/* Muscat Node Status Capsule at Bottom of Sidebar */}
        <div className="p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 text-xs font-mono space-y-2 mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Node Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MCT-01 ONLINE
            </span>
          </div>
          <div className="text-[10px] text-gray-500">
            {hasActiveAllocation ? 'Assigned: 125 TH/s Dedicated Compute' : 'No compute assigned yet'}
          </div>
          <div className="text-[10px] text-[#F7931A] font-bold">
            {hasActiveAllocation ? 'Foundry USA VIP Pool' : 'Pool: Not Assigned'}
          </div>
        </div>

      </div>

    </aside>
  );
};
