import React, { useState, useEffect, useCallback } from 'react';
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

import { InvestorTab, InvestorUser, InvestorOverviewMetrics } from '../../types';
import {
  AuthUser,
  fetchInvestorProfile,
  fetchInvestorTransactions,
  fetchInvestorPayouts,
  fetchInvestorEarnings,
  fetchInvestorStatements,
  fetchInvestorNotifications,
  setNotificationReadApi,
  markAllNotificationsReadApi,
  fetchInvestorSessions,
  revokeSessionApi,
  fetchInvestorTickets,
  createInvestorTicket,
  addInvestorTicketMessage,
  fetchInvestorReferrals,
  fetchInvestorMachines,
  fetchInvestorDocuments,
  requestPayoutApi,
  updateInvestorProfileApi,
  fetchBtcMarketData,
  ApiEarningRow,
  ApiMonthlyStatement,
  ApiNotification,
  ApiSession,
  ApiTicket,
  ApiReferredInvestor,
  ApiMachine,
  ApiDocument,
  BtcMarketData
} from '../../lib/api';
import { profileToUser, profileToMetrics, transactionToWallet, payoutToRecord } from '../../lib/investorMappers';

interface InvestorPortalProps {
  authUser: AuthUser;
  authToken: string;
  onLogout: () => void;
  onNavigateWebsite: () => void;
  onCredentialsUpdated: (token: string, user: AuthUser) => void;
}

export const InvestorPortal: React.FC<InvestorPortalProps> = ({
  authUser,
  authToken,
  onLogout,
  onNavigateWebsite,
  onCredentialsUpdated
}) => {
  const [currentTab, setCurrentTab] = useState<InvestorTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [user, setUser] = useState<InvestorUser | null>(null);
  const [metrics, setMetrics] = useState<InvestorOverviewMetrics | null>(null);
  const [transactions, setTransactions] = useState<ReturnType<typeof transactionToWallet>[]>([]);
  const [payouts, setPayouts] = useState<ReturnType<typeof payoutToRecord>[]>([]);
  const [earnings, setEarnings] = useState<ApiEarningRow[]>([]);
  const [statements, setStatements] = useState<ApiMonthlyStatement[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referredUsers, setReferredUsers] = useState<ApiReferredInvestor[]>([]);
  const [machines, setMachines] = useState<ApiMachine[]>([]);
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [btcMarket, setBtcMarket] = useState<BtcMarketData | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const loadPortfolio = useCallback(async () => {
    try {
      const [{ profile }, { transactions: txs }, { payouts: pos }, market] = await Promise.all([
        fetchInvestorProfile(authToken),
        fetchInvestorTransactions(authToken),
        fetchInvestorPayouts(authToken),
        fetchBtcMarketData().catch(() => null)
      ]);

      const btcPriceUsd = market?.usd ?? 0;
      const mappedMetrics = profileToMetrics(profile, btcPriceUsd, market?.difficultyT ?? 0);
      const completedPayouts = pos.filter((p) => p.status === 'Completed');
      mappedMetrics.totalPayoutsBtc = completedPayouts.reduce((sum, p) => sum + p.amountBtc, 0);
      mappedMetrics.totalPayoutsUsd = mappedMetrics.totalPayoutsBtc * mappedMetrics.currentBtcPriceUsd;

      const today = new Date().toISOString().slice(0, 10);
      const todaysMiningCredits = txs.filter((t) => t.type === 'Mining Credit' && t.createdAt.startsWith(today));
      mappedMetrics.miningRevenuePerDayBtc = todaysMiningCredits.reduce((sum, t) => sum + t.amountBtc, 0);
      mappedMetrics.miningRevenuePerDayUsd = todaysMiningCredits.reduce((sum, t) => sum + t.amountUsd, 0);

      if (market) setBtcMarket(market);
      setUser(profileToUser(profile));
      setMetrics(mappedMetrics);
      setTransactions(txs.map(transactionToWallet));
      setPayouts(pos.map((p) => payoutToRecord(p, btcPriceUsd)));
      setLoadError('');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load your portfolio.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  const loadNotifications = useCallback(() => {
    fetchInvestorNotifications(authToken).then(({ notifications }) => setNotifications(notifications)).catch(() => {});
  }, [authToken]);

  const loadSessions = useCallback(() => {
    fetchInvestorSessions(authToken).then(({ sessions }) => setSessions(sessions)).catch(() => {});
  }, [authToken]);

  const loadTickets = useCallback(() => {
    fetchInvestorTickets(authToken).then(({ tickets }) => setTickets(tickets)).catch(() => {});
  }, [authToken]);

  useEffect(() => {
    loadPortfolio();
    loadNotifications();
    loadSessions();
    loadTickets();
    fetchInvestorEarnings(authToken).then(({ earnings }) => setEarnings(earnings)).catch(() => {});
    fetchInvestorStatements(authToken).then(({ statements }) => setStatements(statements)).catch(() => {});
    fetchInvestorReferrals(authToken).then(({ referralCode, referredUsers }) => {
      setReferralCode(referralCode);
      setReferredUsers(referredUsers);
    }).catch(() => {});
    fetchInvestorMachines(authToken).then(({ machines }) => setMachines(machines)).catch(() => {});
    fetchInvestorDocuments(authToken).then(({ documents }) => setDocuments(documents)).catch(() => {});
  }, [authToken, loadPortfolio, loadNotifications, loadSessions, loadTickets]);

  // Keeps the navbar's live BTC ticker fresh between full portfolio reloads.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBtcMarketData().then(setBtcMarket).catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleRequestPayout = async (amountBtc: number, destinationWallet: string) => {
    await requestPayoutApi(authToken, amountBtc, destinationWallet);
    await loadPortfolio();
    loadNotifications();
  };

  // Investors may edit their own contact/banking/payout details — KYC
  // status, account status, and portfolio figures stay admin-managed.
  const handleUpdateUser = async (updated: Partial<InvestorUser>) => {
    await updateInvestorProfileApi(authToken, {
      email: updated.email,
      phone: updated.phone,
      country: updated.country,
      payoutBtcAddress: updated.payoutBtcAddress,
      bankName: updated.bankName,
      bankAccountHolder: updated.bankAccountHolder,
      bankAccountNumber: updated.bankAccountNumber,
      bankIban: updated.bankIban,
      bankSwift: updated.bankSwift
    });
    await loadPortfolio();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsReadApi(authToken);
    loadNotifications();
  };

  const handleToggleNotificationRead = async (id: string, isRead: boolean) => {
    await setNotificationReadApi(authToken, id, isRead);
    loadNotifications();
  };

  const handleAddTicket = async (subject: string, category: string, message: string) => {
    await createInvestorTicket(authToken, { subject, category, message });
    loadTickets();
  };

  const handleAddTicketMessage = async (ticketId: string, messageText: string) => {
    await addInvestorTicketMessage(authToken, ticketId, messageText);
    loadTickets();
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionApi(authToken, sessionId);
    loadSessions();
  };

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;

  const handleSelectTab = (tab: InvestorTab) => {
    setCurrentTab(tab);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !user || !metrics) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-gray-400 flex items-center justify-center font-mono text-xs">
        {loadError ? (
          <div className="text-center space-y-3">
            <p className="text-rose-400">{loadError}</p>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          'Loading your portfolio...'
        )}
      </div>
    );
  }

  return (
    <div id="investor-portal-root" className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col">

      {/* Top Navbar */}
      <InvestorNavbar
        user={user}
        walletBalanceBtc={metrics.totalBtcAllocated}
        notifications={notifications}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onLogout={onLogout}
        onNavigateWebsite={onNavigateWebsite}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        btcMarket={btcMarket}
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
            hasActiveAllocation={metrics.totalBtcAllocated > 0}
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
                  hasActiveAllocation={metrics.totalBtcAllocated > 0}
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
              earnings={earnings}
              machines={machines}
            />
          )}

          {currentTab === 'wallet' && (
            <WalletTab
              transactions={transactions}
              metrics={metrics}
              user={user}
              onRequestPayout={handleRequestPayout}
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
              statements={statements}
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
              onAddTicket={handleAddTicket}
              onAddMessage={handleAddTicketMessage}
            />
          )}

          {currentTab === 'referrals' && (
            <ReferralPartnerTab
              referralCode={referralCode}
              referredUsers={referredUsers}
            />
          )}

          {currentTab === 'security' && (
            <SecurityCenterTab
              sessions={sessions}
              user={user}
              authToken={authToken}
              onRevokeSession={handleRevokeSession}
              onCredentialsUpdated={onCredentialsUpdated}
            />
          )}
        </main>

      </div>

    </div>
  );
};
