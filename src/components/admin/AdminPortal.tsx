import React, { useState, useEffect } from 'react';
import { AdminTab, AdminUser, AdminRole } from '../../types';
import { AuthUser, fetchAdminInvestors, fetchAdminPayouts, fetchAdminMachines, fetchAdminAllTransactions, fetchBtcMarketData, fetchAdminDepositRequests } from '../../lib/api';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

// View Components
import { AdminDashboardView } from './AdminDashboardView';
import { AdminInvestorsView } from './AdminInvestorsView';
import { AdminPlansView } from './AdminPlansView';
import { AdminTransactionsView } from './AdminTransactionsView';
import { AdminDepositsView } from './AdminDepositsView';
import { AdminMiningOpsView } from './AdminMiningOpsView';
import { AdminAsicsView } from './AdminAsicsView';
import { AdminPoolsView } from './AdminPoolsView';
import { AdminProductionLedgerView } from './AdminProductionLedgerView';
import { AdminAllocationsView } from './AdminAllocationsView';
import { AdminEarningsEngineView } from './AdminEarningsEngineView';
import { AdminWalletsView } from './AdminWalletsView';
import { AdminPayoutsView } from './AdminPayoutsView';
import { AdminFinanceView } from './AdminFinanceView';
import { AdminLiabilitiesView } from './AdminLiabilitiesView';
import { AdminKycView } from './AdminKycView';
import { AdminDocumentsView } from './AdminDocumentsView';
import { AdminStatementsView } from './AdminStatementsView';
import { AdminSupportCrmView } from './AdminSupportCrmView';
import { AdminCommunicationView } from './AdminCommunicationView';
import { AdminReportsView } from './AdminReportsView';
import { AdminAuditLogsView } from './AdminAuditLogsView';
import { AdminRolesView } from './AdminRolesView';
import { AdminSettingsView } from './AdminSettingsView';

// Mock Data
import {
  initialAdminKpis,
  initialMiningFacilities,
  initialAsicMachines,
  initialMiningPools,
  initialBtcProductionLedger,
  initialInvestorAllocations,
  initialDailyCalculationRuns,
  initialAdminFinanceRecords,
  initialInvestorLiabilities,
  initialStatementBatches,
  initialSupportTickets,
  initialAdminReports,
  initialAdminAuditLogs,
  initialAdminUsers,
  initialSystemSettings
} from '../../data/adminData';

interface AdminPortalProps {
  authUser: AuthUser;
  authToken: string;
  onCredentialsUpdated: (token: string, user: AuthUser) => void;
  onLogout: () => void;
  onNavigateHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  authUser,
  authToken,
  onCredentialsUpdated,
  onLogout,
  onNavigateHome
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State for Admin User & Role — identity comes from the authenticated
  // session, the rest of the profile (role label, permissions) stays demo data.
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser>({
    ...initialAdminUsers[0],
    id: authUser.id,
    username: authUser.username,
    name: authUser.name
  });

  // Keeps the header/sidebar in sync immediately after a credentials change,
  // without requiring the admin to log out and back in.
  const handleCredentialsUpdated: typeof onCredentialsUpdated = (token, user) => {
    setCurrentAdminUser((prev) => ({ ...prev, username: user.username, name: user.name }));
    onCredentialsUpdated(token, user);
  };

  // Operational State
  const [kpis, setKpis] = useState(initialAdminKpis);
  // No real mining-facility telemetry exists yet, so this stays empty rather
  // than showing the fabricated Muscat/Salalah demo sites.
  const [facilities, setFacilities] = useState<typeof initialMiningFacilities>([]);
  const [machines, setMachines] = useState(initialAsicMachines);
  const [pools, setPools] = useState(initialMiningPools);
  const [ledgerRows, setLedgerRows] = useState(initialBtcProductionLedger);
  const [allocations, setAllocations] = useState(initialInvestorAllocations);
  const [calcRuns, setCalcRuns] = useState(initialDailyCalculationRuns);
  const [financeRecords, setFinanceRecords] = useState(initialAdminFinanceRecords);
  const [liabilities, setLiabilities] = useState(initialInvestorLiabilities);
  const [statements, setStatements] = useState(initialStatementBatches);
  const [tickets, setTickets] = useState(initialSupportTickets);
  const [reports, setReports] = useState(initialAdminReports);
  const [auditLogs, setAuditLogs] = useState(initialAdminAuditLogs);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);

  // Badge Counts — KYC and Payout counts are live from the database;
  // Support tickets remain demo data (not part of today's real-data scope).
  const [pendingPayoutCount, setPendingPayoutCount] = useState(0);
  const [pendingKycCount, setPendingKycCount] = useState(0);
  const [pendingDepositCount, setPendingDepositCount] = useState(0);
  const openTicketCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  useEffect(() => {
    fetchAdminDepositRequests(authToken)
      .then(({ requests }) => setPendingDepositCount(requests.filter((r) => r.status === 'Pending').length))
      .catch(() => {});
  }, [authToken]);

  // Dashboard KPIs derived from real investor/payout/machine/transaction data.
  // Monthly OPEX (and therefore Net Monthly Revenue) has no real cost-tracking
  // source anywhere in the app yet, so those two stay at the honest zeroed
  // defaults from initialAdminKpis rather than being fabricated.
  useEffect(() => {
    Promise.all([
      fetchAdminInvestors(authToken),
      fetchAdminPayouts(authToken),
      fetchAdminMachines(authToken),
      fetchAdminAllTransactions(authToken),
      fetchBtcMarketData().catch(() => null)
    ])
      .then(([{ investors: investorList }, { payouts: payoutList }, { machines: machineList }, { transactions: txList }, market]) => {
        setPendingKycCount(investorList.filter((i) => i.kycStatus !== 'Verified').length);
        setPendingPayoutCount(payoutList.filter((p) => p.status === 'Requested').length);

        const currentYearMonth = new Date().toISOString().slice(0, 7);
        const monthlyRevenueUsd = txList
          .filter((t) => t.type === 'Mining Credit' && t.createdAt.startsWith(currentYearMonth))
          .reduce((sum, t) => sum + t.amountUsd, 0);

        setKpis((prev) => ({
          ...prev,
          totalInvestors: investorList.length,
          activeInvestors: investorList.filter((i) => i.accountStatus === 'Active').length,
          totalInvestmentUsd: investorList.reduce((sum, i) => sum + i.totalInvestmentUsd, 0),
          totalBtcAllocated: investorList.reduce((sum, i) => sum + i.totalBtcAllocated, 0),
          totalBtcMined: investorList.reduce((sum, i) => sum + i.btcMined, 0),
          totalBtcPaidOut: payoutList
            .filter((p) => p.status === 'Completed')
            .reduce((sum, p) => sum + p.amountBtc, 0),
          pendingPayoutBtc: payoutList
            .filter((p) => p.status === 'Requested')
            .reduce((sum, p) => sum + p.amountBtc, 0),
          totalMiners: machineList.length,
          minersOnline: machineList.filter((m) => m.status === 'Online').length,
          miningHashratePH: machineList.reduce((sum, m) => sum + m.hashrateTh, 0) / 1000,
          miningUptimePercent: machineList.length
            ? Math.round(machineList.reduce((sum, m) => sum + m.uptimePercent, 0) / machineList.length)
            : 0,
          monthlyRevenueUsd,
          // monthlyCostUsd has no real tracking source yet, so it stays 0 —
          // net profit is therefore just revenue until OPEX tracking exists.
          netProfitUsd: monthlyRevenueUsd - prev.monthlyCostUsd,
          spotBtcPriceUsd: market?.usd ?? prev.spotBtcPriceUsd
        }));
      })
      .catch(() => {});
  }, [authToken]);

  const handleChangeRole = (newRole: AdminRole) => {
    setCurrentAdminUser((prev) => ({
      ...prev,
      role: newRole
    }));
  };

  const handleQuickAction = (action: string) => {
    if (action === 'create_plan') {
      setCurrentTab('investment-plans');
    } else if (action === 'batch_payout') {
      setCurrentTab('payout-queue');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-gray-100 flex flex-col font-sans selection:bg-[#F7931A]/30 selection:text-[#F7931A]">
      
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Responsive Navigation Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          pendingPayoutCount={pendingPayoutCount}
          pendingKycCount={pendingKycCount}
          pendingDepositCount={pendingDepositCount}
          openTicketCount={openTicketCount}
          adminUser={currentAdminUser}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
          onNavigateWebsite={onNavigateHome || onLogout}
        />

        {/* Main Content Arena */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Admin Header Bar */}
          <AdminHeader
            currentTab={currentTab}
            adminUser={currentAdminUser}
            onChangeRole={handleChangeRole}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onQuickAction={handleQuickAction}
            onLogout={onLogout}
            spotBtcPriceUsd={kpis.spotBtcPriceUsd}
            totalHashratePH={kpis.miningHashratePH}
            miningUptimePercent={kpis.miningUptimePercent}
          />

          {/* Dynamic Module View Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <AdminDashboardView
                kpis={kpis}
                facilities={facilities}
                pendingPayoutCount={pendingPayoutCount}
                pendingKycCount={pendingKycCount}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'all-investors' && (
              <AdminInvestorsView authToken={authToken} />
            )}

            {currentTab === 'investment-plans' && (
              <AdminPlansView authToken={authToken} />
            )}

            {currentTab === 'investment-transactions' && (
              <AdminTransactionsView authToken={authToken} />
            )}

            {currentTab === 'deposit-requests' && (
              <AdminDepositsView authToken={authToken} />
            )}

            {(currentTab === 'mining-overview' || currentTab === 'mining-farms') && (
              <AdminMiningOpsView facilities={facilities} />
            )}

            {currentTab === 'asic-machines' && (
              <AdminAsicsView
                machines={machines}
                onRebootMachine={(id) => {
                  setMachines((prev) =>
                    prev.map((m) => (m.id === id ? { ...m, status: 'Online' } : m))
                  );
                }}
              />
            )}

            {currentTab === 'mining-pools' && (
              <AdminPoolsView pools={pools} />
            )}

            {currentTab === 'production-ledger' && (
              <AdminProductionLedgerView ledgerRows={ledgerRows} />
            )}

            {currentTab === 'investor-allocations' && (
              <AdminAllocationsView allocations={allocations} />
            )}

            {currentTab === 'calculation-engine' && (
              <AdminEarningsEngineView
                calculationRuns={calcRuns}
                onTriggerCalculation={() => {
                  setKpis((prev) => ({
                    ...prev,
                    totalBtcMined: prev.totalBtcMined + 1.485,
                    totalBtcPaidOut: prev.totalBtcPaidOut + 1.295
                  }));
                }}
              />
            )}

            {currentTab === 'company-wallets' && (
              <AdminWalletsView authToken={authToken} spotBtcPriceUsd={kpis.spotBtcPriceUsd} />
            )}

            {currentTab === 'payout-queue' && (
              <AdminPayoutsView authToken={authToken} />
            )}

            {currentTab === 'finance-overview' && (
              <AdminFinanceView financeRecords={financeRecords} />
            )}

            {currentTab === 'investor-liabilities' && (
              <AdminLiabilitiesView liabilities={liabilities} />
            )}

            {currentTab === 'kyc-queue' && (
              <AdminKycView authToken={authToken} />
            )}

            {currentTab === 'all-documents' && (
              <AdminDocumentsView authToken={authToken} />
            )}

            {currentTab === 'monthly-statements' && (
              <AdminStatementsView statements={statements} />
            )}

            {currentTab === 'support-crm' && (
              <AdminSupportCrmView tickets={tickets} />
            )}

            {currentTab === 'notifications-center' && (
              <AdminCommunicationView authToken={authToken} />
            )}

            {currentTab === 'reports-financial' && (
              <AdminReportsView reports={reports} />
            )}

            {currentTab === 'audit-logs' && (
              <AdminAuditLogsView auditLogs={auditLogs} />
            )}

            {currentTab === 'users-roles' && (
              <AdminRolesView
                adminUsers={adminUsers}
                onAddAdminUser={(newUser) => setAdminUsers((prev) => [...prev, newUser])}
              />
            )}

            {currentTab === 'system-settings' && (
              <AdminSettingsView
                settings={systemSettings}
                onSaveSettings={(updated) => setSystemSettings(updated)}
                authToken={authToken}
                currentUsername={currentAdminUser.username || ''}
                onCredentialsUpdated={handleCredentialsUpdated}
              />
            )}
          </main>

        </div>

      </div>

    </div>
  );
};
