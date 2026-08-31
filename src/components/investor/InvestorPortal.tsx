import React, { useState } from 'react';
import { InvestorNavbar } from './InvestorNavbar';
import { InvestorSidebar } from './InvestorSidebar';
import { InvestorDashboardTab } from './InvestorDashboardTab';
import { InvestorProfileTab } from './InvestorProfileTab';
import { InvestmentDetailsTab } from './InvestmentDetailsTab';
import { MiningPerformanceTab } from './MiningPerformanceTab';
import { WalletTab } from './WalletTab';
import { EarningsMiningHistoryTab } from './EarningsMiningHistoryTab';
import { PayoutHistoryTab } from './PayoutHistoryTab';
import { RoiPerformanceTab } from './RoiPerformanceTab';
import { MiningInfrastructureTab } from './MiningInfrastructureTab';
import { ReportsDocumentsTab } from './ReportsDocumentsTab';
import { MonthlyStatementsTab } from './MonthlyStatementsTab';
import { NotificationsCenterTab } from './NotificationsCenterTab';
import { SupportHelpdeskTab } from './SupportHelpdeskTab';
import { ReferralPartnerTab } from './ReferralPartnerTab';
import { SecurityCenterTab } from './SecurityCenterTab';

import { 
  INITIAL_INVESTOR_USER, 
  INITIAL_OVERVIEW_METRICS, 
  INITIAL_WALLET_TRANSACTIONS, 
  INITIAL_MINING_EARNINGS, 
  INITIAL_PAYOUTS, 
  FLEET_MACHINES, 
  INITIAL_DOCUMENTS, 
  INITIAL_MONTHLY_STATEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TICKETS, 
  INITIAL_REFERRALS, 
  INITIAL_SESSIONS 
} from '../../data/investorData';
import { 
  InvestorTab, 
  InvestorUser, 
  WalletTransaction, 
  SupportTicket 
} from '../../types';

interface InvestorPortalProps {
  onLogout: () => void;
  onNavigateWebsite: () => void;
}

export const InvestorPortal: React.FC<InvestorPortalProps> = ({
  onLogout,
  onNavigateWebsite
}) => {
  const [currentTab, setCurrentTab] = useState<InvestorTab>('overview');
  const [user, setUser] = useState<InvestorUser>(INITIAL_INVESTOR_USER);
  const [metrics, setMetrics] = useState(INITIAL_OVERVIEW_METRICS);
  const [transactions, setTransactions] = useState(INITIAL_WALLET_TRANSACTIONS);
  const [earnings, setEarnings] = useState(INITIAL_MINING_EARNINGS);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [machines, setMachines] = useState(FLEET_MACHINES);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [statements, setStatements] = useState(INITIAL_MONTHLY_STATEMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handlers
  const handleUpdateUser = (updated: Partial<InvestorUser>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleAddTransaction = (newTx: WalletTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    // update metrics
    setMetrics((prev) => ({
      ...prev,
      totalBtcAllocated: Math.max(0, prev.totalBtcAllocated + newTx.amountBtc),
      totalPayoutsUsd: prev.totalPayoutsUsd + Math.abs(newTx.amountUsd),
      totalPayoutsBtc: prev.totalPayoutsBtc + Math.abs(newTx.amountBtc)
    }));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleAddTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleAddTicketMessage = (ticketId: string, messageText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            lastUpdated: 'Just now',
            messages: [
              ...t.messages,
              {
                id: `MSG-${Date.now()}`,
                sender: 'Investor',
                senderName: user.name,
                text: messageText,
                timestamp: '26 Aug 2026, 08:00 UTC'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;

  const handleSelectTab = (tab: InvestorTab) => {
    setCurrentTab(tab);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="investor-portal-root" className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col">
      
      {/* Top Navbar */}
      <InvestorNavbar
        user={user}
        notifications={notifications}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onLogout={onLogout}
        onNavigateWebsite={onNavigateWebsite}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <InvestorSidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            unreadNotificationsCount={unreadNotifs}
            openTicketsCount={openTickets}
          />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex">
            <div className="w-80 max-w-[85vw] h-full bg-[#0F172A] shadow-2xl flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F7931A] uppercase">
                  Investor Navigation
                </span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <InvestorSidebar
                  currentTab={currentTab}
                  onSelectTab={handleSelectTab}
                  unreadNotificationsCount={unreadNotifs}
                  openTicketsCount={openTickets}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentTab === 'overview' && (
            <InvestorDashboardTab
              metrics={metrics}
              user={user}
              onNavigateTab={handleSelectTab}
            />
          )}

          {currentTab === 'profile' && (
            <InvestorProfileTab
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {currentTab === 'investment' && (
            <InvestmentDetailsTab
              user={user}
              metrics={metrics}
            />
          )}

          {currentTab === 'mining-performance' && (
            <MiningPerformanceTab
              metrics={metrics}
            />
          )}

          {currentTab === 'wallet' && (
            <WalletTab
              transactions={transactions}
              metrics={metrics}
              user={user}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentTab === 'earnings-history' && (
            <EarningsMiningHistoryTab
              earnings={earnings}
            />
          )}

          {currentTab === 'payout-history' && (
            <PayoutHistoryTab
              payouts={payouts}
            />
          )}

          {currentTab === 'roi-performance' && (
            <RoiPerformanceTab
              metrics={metrics}
            />
          )}

          {currentTab === 'infrastructure-fleet' && (
            <MiningInfrastructureTab
              machines={machines}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsDocumentsTab
              documents={documents}
            />
          )}

          {currentTab === 'monthly-statements' && (
            <MonthlyStatementsTab
              statements={statements}
              user={user}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsCenterTab
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onToggleRead={handleToggleNotificationRead}
            />
          )}

          {currentTab === 'support' && (
            <SupportHelpdeskTab
              tickets={tickets}
              user={user}
              onAddTicket={handleAddTicket}
              onAddMessage={handleAddTicketMessage}
            />
          )}

          {currentTab === 'referrals' && (
            <ReferralPartnerTab
              referrals={referrals}
            />
          )}

          {currentTab === 'security' && (
            <SecurityCenterTab
              sessions={sessions}
              user={user}
              onRevokeSession={handleRevokeSession}
            />
          )}
        </main>

      </div>

    </div>
  );
};
