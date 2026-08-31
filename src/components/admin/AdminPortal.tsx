import React, { useState } from 'react';
import { AdminTab, AdminUser, AdminRole } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

// View Components
import { AdminDashboardView } from './AdminDashboardView';
import { AdminInvestorsView } from './AdminInvestorsView';
import { AdminPlansView } from './AdminPlansView';
import { AdminTransactionsView } from './AdminTransactionsView';
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
  initialAdminInvestors,
  initialInvestmentPlans,
  initialInvestmentTransactions,
  initialAsicMachines,
  initialMiningPools,
  initialBtcProductionLedger,
  initialInvestorAllocations,
  initialDailyCalculationRuns,
  initialCompanyWallets,
  initialAdminPayouts,
  initialAdminFinanceRecords,
  initialInvestorLiabilities,
  initialKycSubmissions,
  initialAdminDocuments,
  initialStatementBatches,
  initialSupportTickets,
  initialAdminNotifications,
  initialAdminReports,
  initialAdminAuditLogs,
  initialAdminUsers,
  initialSystemSettings
} from '../../data/adminData';

interface AdminPortalProps {
  onLogout: () => void;
  onNavigateHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout, onNavigateHome }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // State for Admin User & Role
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser>(initialAdminUsers[0]);

  // Operational State
  const [kpis, setKpis] = useState(initialAdminKpis);
  const [facilities, setFacilities] = useState(initialMiningFacilities);
  const [investors, setInvestors] = useState(initialAdminInvestors);
  const [plans, setPlans] = useState(initialInvestmentPlans);
  const [transactions, setTransactions] = useState(initialInvestmentTransactions);
  const [machines, setMachines] = useState(initialAsicMachines);
  const [pools, setPools] = useState(initialMiningPools);
  const [ledgerRows, setLedgerRows] = useState(initialBtcProductionLedger);
  const [allocations, setAllocations] = useState(initialInvestorAllocations);
  const [calcRuns, setCalcRuns] = useState(initialDailyCalculationRuns);
  const [wallets, setWallets] = useState(initialCompanyWallets);
  const [payouts, setPayouts] = useState(initialAdminPayouts);
  const [financeRecords, setFinanceRecords] = useState(initialAdminFinanceRecords);
  const [liabilities, setLiabilities] = useState(initialInvestorLiabilities);
  const [kycSubmissions, setKycSubmissions] = useState(initialKycSubmissions);
  const [documents, setDocuments] = useState(initialAdminDocuments);
  const [statements, setStatements] = useState(initialStatementBatches);
  const [tickets, setTickets] = useState(initialSupportTickets);
  const [notifications, setNotifications] = useState(initialAdminNotifications);
  const [reports, setReports] = useState(initialAdminReports);
  const [auditLogs, setAuditLogs] = useState(initialAdminAuditLogs);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);

  // Badge Counts
  const pendingPayoutCount = payouts.filter((p) => p.status === 'Pending Approval').length;
  const pendingKycCount = kycSubmissions.filter((s) => s.status === 'Submitted' || s.status === 'Under Review').length;
  const openTicketCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

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
          />

          {/* Dynamic Module View Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <AdminDashboardView
                kpis={kpis}
                facilities={facilities}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'all-investors' && (
              <AdminInvestorsView
                investors={investors}
                onUpdateInvestor={(updated) => {
                  setInvestors((prev) => prev.map((i) => i.id === updated.id ? updated : i));
                }}
              />
            )}

            {currentTab === 'investment-plans' && (
              <AdminPlansView
                plans={plans}
                onSavePlan={(newOrUpdated) => {
                  setPlans((prev) => {
                    const exists = prev.some((p) => p.id === newOrUpdated.id);
                    if (exists) {
                      return prev.map((p) => (p.id === newOrUpdated.id ? newOrUpdated : p));
                    }
                    return [...prev, newOrUpdated];
                  });
                }}
              />
            )}

            {currentTab === 'investment-transactions' && (
              <AdminTransactionsView
                transactions={transactions}
                onApproveTransaction={(id) => {
                  setTransactions((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, status: 'Active' } : t))
                  );
                }}
              />
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
              <AdminWalletsView
                wallets={wallets}
                spotBtcPriceUsd={kpis.spotBtcPriceUsd}
              />
            )}

            {currentTab === 'payout-queue' && (
              <AdminPayoutsView
                payouts={payouts}
                onApprovePayout={(id) => {
                  setPayouts((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status: 'Broadcasted' } : p))
                  );
                }}
              />
            )}

            {currentTab === 'finance-overview' && (
              <AdminFinanceView financeRecords={financeRecords} />
            )}

            {currentTab === 'investor-liabilities' && (
              <AdminLiabilitiesView liabilities={liabilities} />
            )}

            {currentTab === 'kyc-queue' && (
              <AdminKycView
                kycSubmissions={kycSubmissions}
                onReviewKyc={(id, status) => {
                  setKycSubmissions((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, status } : s))
                  );
                }}
              />
            )}

            {currentTab === 'all-documents' && (
              <AdminDocumentsView documents={documents} />
            )}

            {currentTab === 'monthly-statements' && (
              <AdminStatementsView statements={statements} />
            )}

            {currentTab === 'support-crm' && (
              <AdminSupportCrmView tickets={tickets} />
            )}

            {currentTab === 'notifications-center' && (
              <AdminCommunicationView notifications={notifications} />
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
              />
            )}
          </main>

        </div>

      </div>

    </div>
  );
};
