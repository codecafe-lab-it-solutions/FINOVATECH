export type PageRoute = 
  | 'home' 
  | 'about' 
  | 'mining' 
  | 'infrastructure' 
  | 'operations' 
  | 'leadership' 
  | 'contact'
  | 'login'
  | 'portal'
  | 'admin-portal';

export type AdminTab = 
  | 'dashboard'
  | 'all-investors'
  | 'kyc-queue'
  | 'investment-plans'
  | 'investor-allocations'
  | 'investments-list'
  | 'investment-transactions'
  | 'deposit-requests'
  | 'contracts-documents'
  | 'mining-overview'
  | 'mining-farms'
  | 'asic-machines'
  | 'mining-pools'
  | 'production-ledger'
  | 'hashrate-telemetry'
  | 'mining-ledger'
  | 'investor-earnings'
  | 'calculation-engine'
  | 'company-wallets'
  | 'investor-wallets'
  | 'wallet-transactions'
  | 'payout-queue'
  | 'payout-processing'
  | 'payout-completed'
  | 'payout-failed'
  | 'finance-overview'
  | 'finance-revenue'
  | 'finance-expenses'
  | 'finance-pnl'
  | 'finance-cashflow'
  | 'investor-liabilities'
  | 'reports-investor'
  | 'reports-mining'
  | 'reports-financial'
  | 'monthly-statements'
  | 'all-documents'
  | 'support-tickets'
  | 'support-crm'
  | 'support-communications'
  | 'notifications-center'
  | 'audit-logs'
  | 'users-roles'
  | 'permissions'
  | 'fees-rules'
  | 'payout-rules'
  | 'system-settings';

export type AdminRole = 
  | 'Super Admin' 
  | 'Finance Admin' 
  | 'Mining Operations' 
  | 'Investor Manager' 
  | 'Auditor / Read Only';

export interface AdminUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  ipAddress?: string;
  status?: 'Active' | 'Suspended';
  permissions?: string[];
}

export interface AdminAuditLogItem {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  action: string;
  module: string;
  targetId: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent?: string;
}

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  recipientGroup: 'All Investors' | 'VIP Investors' | 'Pending KYC' | 'Contract Expiring';
  sentDate: string;
  sentBy: string;
  type: 'Operational Notice' | 'Payout Notification' | 'General Announcement' | 'Security Alert';
  status: 'Sent' | 'Delivered' | 'Scheduled';
}

export interface DailyCalculationRun {
  id: string;
  date: string;
  grossProductionBtc?: number;
  totalBtcMined?: number;
  networkDifficultyT?: number;
  networkHashrateEH?: number;
  electricityExpenseUsd?: number;
  electricityCostUsd?: number;
  managementFeeUsd?: number;
  managementFeesUsd?: number;
  netDistributionBtc?: number;
  netDistributableBtc?: number;
  investorsCount?: number;
  investorsCreditedCount?: number;
  executionMode?: string;
  executedBy: string;
  executedAt?: string;
  status: 'Settled' | 'Processing' | 'Pending' | 'Applied & Credited' | 'Executed';
}

export interface AdminFinanceRecord {
  id: string;
  month: string;
  totalRevenueUsd: number;
  totalRevenueBtc: number;
  miningRevenueUsd: number;
  managementFeesUsd: number;
  setupFeesUsd: number;
  totalExpensesUsd: number;
  electricityCostUsd: number;
  hostingCostUsd: number;
  maintenanceCostUsd: number;
  adminCostUsd: number;
  netProfitUsd: number;
  netProfitBtc: number;
  profitMarginPercent: number;
}

export interface AdminKycSubmission {
  id: string;
  investorId: string;
  investorName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  submittedDate: string;
  amlRiskScore: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Request Info';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface InvestorLiabilityItem {
  id: string;
  investorId: string;
  investorName: string;
  capitalInvestedUsd: number;
  totalMinedToDateBtc: number;
  totalPaidOutBtc: number;
  accruedUnpaidBtc: number;
  nextPayoutDueDate: string;
  collateralBackingStatus: string;
}

export interface AdminReportItem {
  id: string;
  title: string;
  category: string;
  period: string;
  formats: string[];
  generatedDate: string;
  description: string;
}

export interface AdminSystemSettings {
  electricityTariffPerKwh: number;
  defaultManagementFeePercent: number;
  maintenanceReservePercent: number;
  defaultPool: string;
  failoverPool: string;
  minPayoutBtc: number;
  payoutSchedule: string;
  multiSigThreshold: string;
  maintenanceMode: boolean;
  autoCalculateDaily: boolean;
}

export interface AdminStatementBatchItem {
  id: string;
  month: string;
  investorId: string;
  investorName: string;
  investmentAmountUsd: number;
  totalBtcMined: number;
  electricityCostUsd: number;
  managementFeeUsd: number;
  netPayoutUsd: number;
  status: 'Draft' | 'Generated' | 'Sent' | 'Downloaded';
}

export type InvestorTab = 
  | 'overview'
  | 'profile'
  | 'investment'
  | 'mining-performance'
  | 'wallet'
  | 'earnings-history'
  | 'payout-history'
  | 'roi-performance'
  | 'infrastructure-fleet'
  | 'reports'
  | 'monthly-statements'
  | 'notifications'
  | 'support'
  | 'referrals'
  | 'security';

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface BusinessCard {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface MiningStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  techDetail: string;
  iconName: string;
}

export interface InfrastructurePillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  keyPoints: string[];
  iconName: string;
}

export interface FrameworkNode {
  number: string;
  title: string;
  description: string;
  role: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'planned';
  details: string;
}

export interface ValuePillar {
  title: string;
  description: string;
  metric: string;
  detail: string;
}

export interface CorporateInfoRow {
  label: string;
  value: string;
}

/* =========================================================================
   INVESTOR PORTAL TYPES
   ========================================================================= */

export interface InvestorUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  kycStatus: 'Verified' | 'Pending' | 'Action Required';
  accountStatus: 'Active' | 'Under Review';
  plan: string;
  agreementNumber: string;
  startDate: string;
  maturityDate: string;
  referralCode: string;
  referrerName: string;
  payoutBtcAddress: string;
  payoutNetwork: string;
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIban: string;
  bankSwift: string;
}

export interface InvestorOverviewMetrics {
  totalInvestmentUsd: number;
  currentPortfolioValueUsd: number;
  totalBtcAllocated: number;
  btcMined: number;
  btcPendingAccrued: number;
  totalReturnsUsd: number;
  roiPercent: number;
  totalPayoutsUsd: number;
  totalPayoutsBtc: number;
  nextExpectedPayoutBtc: number;
  nextExpectedPayoutDate: string;
  investmentStartDate: string;
  contractEndDate: string;
  currentBtcPriceUsd: number;
  networkDifficulty: string;
  miningRevenuePerDayUsd: number;
  miningRevenuePerDayBtc: number;
  yourMiningSharePercent: number;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'Mining Credit' | 'Payout' | 'Deposit' | 'Referral Commission';
  amountBtc: number;
  amountUsd: number;
  status: 'Completed' | 'Pending' | 'Processing';
  txid: string;
  explorerUrl: string;
  destination?: string;
  network: string;
}

export interface MiningEarningsRow {
  id: string;
  date: string;
  btmMined: number;
  grossRevenueUsd: number;
  miningFeesUsd: number;
  electricityCostUsd: number;
  managementFeeUsd: number;
  netEarningsUsd: number;
  netEarningsBtc: number;
  btcPriceUsd: number;
  investorSharePercent: number;
  status: 'Audited' | 'Settled' | 'Processing';
}

export interface PayoutRecord {
  id: string;
  payoutId: string;
  date: string;
  amountBtc: number;
  amountUsd: number;
  currency: 'BTC' | 'USDT';
  destinationWallet: string;
  network: string;
  txid: string;
  explorerUrl: string;
  status: 'Successful' | 'Pending' | 'Processing' | 'Failed';
  confirmations: number;
}

export interface MiningFleetMachine {
  id: string;
  podId: string;
  model: string;
  hashrateTH: number;
  powerDrawWatts: number;
  tempCelsius: number;
  efficiencyJTH: number;
  status: 'Online' | 'Maintenance' | 'Calibrating';
  pool: string;
  uptimePercent: number;
  assignedToUser: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Agreement' | 'KYC' | 'Mining Statement' | 'Receipt' | 'Tax' | 'Audit';
  date: string;
  size: string;
  fileFormat: 'PDF' | 'DOCX';
  verified: boolean;
}

export interface MonthlyStatementData {
  statementId: string;
  monthYear: string;
  periodStart: string;
  periodEnd: string;
  openingBalanceUsd: number;
  openingBalanceBtc: number;
  investmentAmountUsd: number;
  btcMined: number;
  grossEarningsUsd: number;
  operationalFeesUsd: number;
  managementFeesUsd: number;
  netEarningsUsd: number;
  payoutsDisbursedUsd: number;
  closingBalanceUsd: number;
  closingBalanceBtc: number;
  btcPriceAverage: number;
  portfolioValueUsd: number;
  monthlyRoiPercent: number;
}

export interface InvestorNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  type: 'payout' | 'statement' | 'facility' | 'kyc' | 'security' | 'contract';
  badge: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Payment' | 'Withdrawal' | 'Wallet' | 'Mining earnings' | 'KYC' | 'Investment agreement' | 'Technical issue';
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  lastUpdated: string;
  messages: {
    id: string;
    sender: 'Investor' | 'Support Agent' | 'Relationship Manager';
    senderName: string;
    avatar?: string;
    text: string;
    timestamp: string;
  }[];
}

export interface ReferralStat {
  referralLink: string;
  totalReferrals: number;
  activeInvestorsReferred: number;
  referralEarningsUsd: number;
  pendingCommissionUsd: number;
  paidCommissionUsd: number;
  referredUsers: {
    id: string;
    name: string;
    joinedDate: string;
    plan: string;
    commissionUsd: number;
    status: 'Active' | 'Pending';
  }[];
}

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

/* =========================================================================
   ADMIN PANEL INTERFACES
   ========================================================================= */

export interface AdminDashboardKpis {
  totalInvestors: number;
  activeInvestors: number;
  totalInvestmentUsd: number;
  totalBtcAllocated: number;
  totalBtcMined: number;
  totalBtcPaidOut: number;
  pendingPayoutBtc: number;
  miningHashratePH: number;
  minersOnline: number;
  totalMiners: number;
  miningUptimePercent: number;
  monthlyRevenueUsd: number;
  monthlyCostUsd: number;
  netProfitUsd: number;
  spotBtcPriceUsd: number;
  dailyBtcProduced: number;
  activeFacilities: number;
}

export interface AdminInvestorItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  kycStatus: 'Approved' | 'Pending' | 'Submitted' | 'Under Review' | 'Rejected' | 'Expired';
  kycSubmittedDate?: string;
  kycDocumentsCount: number;
  investmentAmountUsd: number;
  btcAllocation: number;
  currentValueUsd: number;
  roiPercent: number;
  contractStatus: 'Active' | 'Expiring' | 'Pending' | 'Matured' | 'Suspended';
  walletStatus: 'Verified' | 'Pending Whitelist' | 'Flagged';
  walletAddress: string;
  btcBalance: number;
  totalMinedBtc: number;
  totalPaidOutBtc: number;
  pendingPayoutBtc: number;
  lastLogin: string;
  accountStatus: 'Active' | 'Pending KYC' | 'Suspended' | 'Contract Expiring' | 'High Value' | 'Pending Payment' | 'Pending Withdrawal';
  assignedRm: string;
  planName: string;
  startDate: string;
  endDate: string;
  agreementNumber: string;
  notes: string[];
}

export interface InvestmentPlan {
  id: string;
  name: string;
  tagline: string;
  minInvestmentUsd: number;
  maxInvestmentUsd: number;
  durationMonths: number;
  miningAllocationThPer1k: number;
  managementFeePercent: number;
  electricityRatePerKwh: number;
  payoutFrequency: 'Daily' | 'Weekly' | 'Monthly';
  status: 'Active' | 'Draft' | 'Deactivated';
  activeInvestorsCount: number;
  totalAumUsd: number;
  projectedAnnualRoiMin: number;
  projectedAnnualRoiMax: number;
  features: string[];
}

export interface AdminInvestmentTransaction {
  id: string;
  investmentId: string;
  investorId: string;
  investorName: string;
  amountUsd: number;
  amountBtc?: number;
  currency: 'USD' | 'BTC' | 'USDT' | 'OMR';
  paymentMethod: 'Bank Wire Transfer' | 'Bitcoin (BTC)' | 'USDT TRC20' | 'Corporate Escrow';
  paymentReference: string;
  date: string;
  planId: string;
  planName: string;
  hashrateAllocationTH: number;
  status: 'Pending' | 'Payment Received' | 'Verified' | 'Allocated' | 'Active';
  adminApprovedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface MiningFacilityItem {
  id: string;
  name: string;
  code: string;
  location: string;
  country: string;
  totalMiners: number;
  onlineMiners: number;
  offlineMiners: number;
  maintenanceMiners: number;
  hashratePH: number;
  powerConsumptionMW: number;
  efficiencyJTH: number;
  uptimePercent: number;
  btcToday: number;
  btcThisMonth: number;
  pueRatio: number;
  coolingType: 'Liquid Immersion' | 'Direct Evaporative' | 'Chilled Air';
  gridTariffUsd: number;
  status: 'Optimal' | 'Maintenance' | 'Curtailed';
}

export interface AsicMachineItem {
  id: string;
  machineId: string;
  model: string;
  serialNumber: string;
  hashrateTH: number;
  targetHashrateTH: number;
  powerWatts: number;
  efficiencyJTH: number;
  ipAddress: string;
  macAddress: string;
  facility: string;
  rackLocation: string;
  shelf: string;
  status: 'Online' | 'Warning' | 'Offline' | 'Maintenance';
  tempCelsius: number;
  chipTempCelsius: number;
  fanRpm: number;
  fanStatus: 'Optimal' | 'Warning' | 'Error';
  miningPool: string;
  lastHeartbeat: string;
  uptimeHours: number;
  firmwareVersion: string;
}

export interface MiningPoolItem {
  id: string;
  poolName: string;
  accountName: string;
  hashratePH: number;
  activeWorkers: number;
  validSharesPercent: number;
  invalidSharesPercent: number;
  btcEarned24h: number;
  btcEarnedMonth: number;
  poolFeePercent: number;
  payoutScheme: 'FPPS' | 'PPLNS';
  lastPayoutDate: string;
  lastPayoutBtc: number;
  connectionStatus: 'Connected' | 'Degraded' | 'Disconnected';
  stratumUrl: string;
  stratumPort: number;
}

export interface BtcProductionLedgerRow {
  id: string;
  date: string;
  poolBtcReceived: number;
  miningFeesBtc: number;
  operationalCostBtc: number;
  operationalCostUsd: number;
  investorAllocationBtc: number;
  companyShareBtc: number;
  availableBtc: number;
  btcPriceUsd: number;
  totalHashratePH: number;
  status: 'Reconciled' | 'Audited' | 'Pending Settlement';
  auditedBy: string;
}

export interface InvestorAllocationRecord {
  id: string;
  investorId: string;
  investorName: string;
  investmentAmountUsd: number;
  allocatedHashrateTH: number;
  miningSharePercent: number;
  date: string;
  dailyBtcGenerated: number;
  grossBtcEarned: number;
  opexBtcDeducted: number;
  netBtcCredited: number;
  status: 'Calculated' | 'Settled' | 'Adjusted';
}

export interface CompanyWalletItem {
  id: string;
  walletName: string;
  type: 'Cold Vault' | 'Hot Payout' | 'Treasury' | 'Operational OPEX' | 'USDT Reserve';
  currency: 'BTC' | 'USDT';
  address: string;
  balance: number;
  balanceUsd: number;
  incoming24h: number;
  outgoing24h: number;
  requiresMultisig: boolean;
  requiredSignatures: string;
  lastActivity: string;
  status: 'Secure' | 'Active' | 'Restricted';
}

export interface AdminPayoutItem {
  id: string;
  payoutId: string;
  investorId: string;
  investorName: string;
  amountBtc: number;
  amountUsd: number;
  currency: 'BTC' | 'USDT';
  destinationWallet: string;
  requestedDate: string;
  status: 'Requested' | 'Risk Check' | 'Finance Approval' | 'Final Approval' | 'Processing' | 'Completed' | 'Rejected' | 'Hold' | 'Failed';
  riskScore: 'Low' | 'Medium' | 'High';
  riskCheckPassed: boolean;
  financeApprovedBy?: string;
  finalApprovedBy?: string;
  txid?: string;
  blockchainConfirmations: number;
  notes?: string;
}

export interface FinanceSummary {
  monthlyRevenueUsd: number;
  monthlyMiningRevenueUsd: number;
  monthlyManagementFeesUsd: number;
  monthlyHostingRevenueUsd: number;
  monthlyExpensesUsd: number;
  electricityExpenseUsd: number;
  hostingExpenseUsd: number;
  hardwareDepreciationUsd: number;
  maintenanceExpenseUsd: number;
  staffExpenseUsd: number;
  infrastructureExpenseUsd: number;
  poolFeesUsd: number;
  otherExpensesUsd: number;
  netProfitUsd: number;
  profitMarginPercent: number;
  btcReserveTotal: number;
  btcReserveUsd: number;
}

export interface InvestorLiabilityRow {
  id: string;
  monthYear: string;
  openingLiabilityBtc: number;
  openingLiabilityUsd: number;
  newInvestmentsBtc: number;
  newInvestmentsUsd: number;
  earnedBtcMined: number;
  earnedBtcUsd: number;
  payoutsDisbursedBtc: number;
  payoutsDisbursedUsd: number;
  adjustmentsBtc: number;
  closingLiabilityBtc: number;
  closingLiabilityUsd: number;
  settlementStatus: 'Balanced' | 'Reconciled';
}

export interface KycVerificationRequest {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  country: string;
  submittedDate: string;
  status: 'Pending' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Expired';
  idType: 'Passport' | 'National ID' | 'Corporate Registration';
  idDocumentUrl: string;
  addressProofType: 'Utility Bill' | 'Bank Statement';
  addressProofUrl: string;
  selfieUrl: string;
  corporateDocsUrl?: string;
  bankDetailsVerified: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  rejectionReason?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface AdminDocumentItem {
  id: string;
  title: string;
  category: 'Investment Agreement' | 'Amendment' | 'Investor Statement' | 'Tax Document' | 'KYC Document' | 'Payment Receipt' | 'Mining Audit';
  investorId?: string;
  investorName?: string;
  date: string;
  size: string;
  format: 'PDF' | 'DOCX';
  uploadedBy: string;
  downloadUrl: string;
  status: 'Active' | 'Archived';
}

export interface MonthlyStatementBatchItem {
  id: string;
  investorId: string;
  investorName: string;
  monthYear: string;
  investmentAmountUsd: number;
  openingBalanceUsd: number;
  btcMined: number;
  grossRevenueUsd: number;
  feesUsd: number;
  netEarningsUsd: number;
  payoutsUsd: number;
  closingBalanceUsd: number;
  roiPercent: number;
  status: 'Draft' | 'Reviewed' | 'Approved' | 'Published' | 'Emailed';
  publishedDate?: string;
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  subject: string;
  category: 'Payment' | 'Withdrawal' | 'Wallet' | 'Mining earnings' | 'KYC' | 'Investment agreement' | 'Technical issue';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  channel: 'Portal Ticket' | 'WhatsApp' | 'Phone Call' | 'Email';
  assignedRm: string;
  createdAt: string;
  lastUpdated: string;
  messages: {
    id: string;
    sender: 'Investor' | 'Support Agent' | 'Relationship Manager' | 'System';
    senderName: string;
    avatar?: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AdminAuditLogRow {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  targetCategory: 'Investor' | 'Payout' | 'Machine' | 'Plan' | 'Ledger' | 'KYC' | 'System' | 'Auth';
  targetId: string;
  targetDescription: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Denied';
  details: string;
}

export interface SystemSettingsConfig {
  companyName: string;
  registrationNumber: string;
  jurisdiction: string;
  primaryCurrency: 'USD' | 'OMR' | 'BTC';
  btcPriceFeedSource: string;
  currentElectricityTariff: number; // $0.042/kWh
  defaultManagementFeePercent: number;
  poolFeePercent: number;
  minimumWithdrawalBtc: number;
  maximumDailyWithdrawalBtc: number;
  payoutBatchFrequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
  kycEnforcementLevel: 'Mandatory Prior to Payout' | 'Mandatory at Onboarding';
  multisigThreshold: string;
  emergencyFreezeActive: boolean;
  emailNotificationsEnabled: boolean;
  whatsAppNotificationsEnabled: boolean;
}
