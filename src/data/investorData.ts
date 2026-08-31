import { 
  InvestorUser, 
  InvestorOverviewMetrics, 
  WalletTransaction, 
  MiningEarningsRow, 
  PayoutRecord, 
  MiningFleetMachine, 
  DocumentItem, 
  MonthlyStatementData, 
  InvestorNotification, 
  SupportTicket, 
  ReferralStat, 
  LoginSession 
} from '../types';

export const INITIAL_INVESTOR_USER: InvestorUser = {
  id: 'INV-2025-0842',
  username: 'investor1',
  name: 'Dr. Tariq Al-Balushi',
  email: 'tariq.albalushi@investor.om',
  phone: '+968 9123 4567',
  country: 'Sultanate of Oman',
  kycStatus: 'Verified',
  accountStatus: 'Active',
  plan: 'Industrial Pod Tier 1 (125 TH/s Dedicated Compute)',
  agreementNumber: 'FNV-MCT-AGR-2025-0842',
  startDate: '15 Jan 2025',
  maturityDate: '15 Jan 2029 (4-Year Defined Term)',
  referralCode: 'FINO-OM-842',
  referrerName: 'Executive Private Wealth Muscat',
  payoutBtcAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  bankName: 'Bank Muscat S.A.O.G',
  bankAccountHolder: 'Dr. Tariq Al-Balushi',
  bankAccountNumber: '0421-9876-5432-10',
  bankIban: 'OM68BMSC04219876543210',
  bankSwift: 'BMSCOM2X'
};

export const INITIAL_OVERVIEW_METRICS: InvestorOverviewMetrics = {
  totalInvestmentUsd: 50000,
  currentPortfolioValueUsd: 56200,
  totalBtcAllocated: 0.085,
  btcMined: 0.0124,
  btcPendingAccrued: 0.0018,
  totalReturnsUsd: 14650,
  roiPercent: 29.3,
  totalPayoutsUsd: 1850,
  totalPayoutsBtc: 0.0287,
  nextExpectedPayoutBtc: 0.0018,
  nextExpectedPayoutDate: '28 Aug 2026',
  investmentStartDate: '15 Jan 2025',
  contractEndDate: '15 Jan 2029',
  currentBtcPriceUsd: 64280,
  networkDifficulty: '84.42 T',
  miningRevenuePerDayUsd: 48.20,
  miningRevenuePerDayBtc: 0.00075,
  yourMiningSharePercent: 0.125
};

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'WTX-901',
    date: '26 Aug 2026, 04:12 UTC',
    type: 'Mining Credit',
    amountBtc: 0.00042,
    amountUsd: 26.99,
    status: 'Completed',
    txid: '3b8f1a2c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    explorerUrl: 'https://mempool.space/tx/3b8f1a2c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a'
  },
  {
    id: 'WTX-900',
    date: '25 Aug 2026, 18:30 UTC',
    type: 'Payout',
    amountBtc: -0.0012,
    amountUsd: -77.13,
    status: 'Completed',
    txid: 'e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9',
    explorerUrl: 'https://mempool.space/tx/e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9',
    destination: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  },
  {
    id: 'WTX-899',
    date: '24 Aug 2026, 04:08 UTC',
    type: 'Mining Credit',
    amountBtc: 0.00041,
    amountUsd: 26.35,
    status: 'Completed',
    txid: '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    explorerUrl: 'https://mempool.space/tx/8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'
  },
  {
    id: 'WTX-898',
    date: '23 Aug 2026, 04:15 UTC',
    type: 'Mining Credit',
    amountBtc: 0.00043,
    amountUsd: 27.64,
    status: 'Completed',
    txid: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0',
    explorerUrl: 'https://mempool.space/tx/f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0'
  },
  {
    id: 'WTX-897',
    date: '20 Aug 2026, 11:20 UTC',
    type: 'Referral Commission',
    amountBtc: 0.00078,
    amountUsd: 50.14,
    status: 'Completed',
    txid: 'c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2',
    explorerUrl: 'https://mempool.space/tx/c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2'
  },
  {
    id: 'WTX-896',
    date: '18 Aug 2026, 09:00 UTC',
    type: 'Payout',
    amountBtc: -0.0025,
    amountUsd: -160.70,
    status: 'Completed',
    txid: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0f',
    explorerUrl: 'https://mempool.space/tx/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0f',
    destination: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  }
];

export const INITIAL_MINING_EARNINGS: MiningEarningsRow[] = [
  {
    id: 'ME-2026-08-26',
    date: '26 Aug 2026',
    btmMined: 0.00042,
    grossRevenueUsd: 27.00,
    miningFeesUsd: 0.54,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.35,
    netEarningsUsd: 17.01,
    netEarningsBtc: 0.000264,
    btcPriceUsd: 64280,
    investorSharePercent: 0.125,
    status: 'Audited'
  },
  {
    id: 'ME-2026-08-25',
    date: '25 Aug 2026',
    btmMined: 0.00044,
    grossRevenueUsd: 28.28,
    miningFeesUsd: 0.56,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.41,
    netEarningsUsd: 18.21,
    netEarningsBtc: 0.000283,
    btcPriceUsd: 64150,
    investorSharePercent: 0.125,
    status: 'Audited'
  },
  {
    id: 'ME-2026-08-24',
    date: '24 Aug 2026',
    btmMined: 0.00041,
    grossRevenueUsd: 26.19,
    miningFeesUsd: 0.52,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.31,
    netEarningsUsd: 16.26,
    netEarningsBtc: 0.000254,
    btcPriceUsd: 63890,
    investorSharePercent: 0.125,
    status: 'Audited'
  },
  {
    id: 'ME-2026-08-23',
    date: '23 Aug 2026',
    btmMined: 0.00043,
    grossRevenueUsd: 27.48,
    miningFeesUsd: 0.55,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.37,
    netEarningsUsd: 17.46,
    netEarningsBtc: 0.000273,
    btcPriceUsd: 63900,
    investorSharePercent: 0.125,
    status: 'Settled'
  },
  {
    id: 'ME-2026-08-22',
    date: '22 Aug 2026',
    btmMined: 0.00045,
    grossRevenueUsd: 28.80,
    miningFeesUsd: 0.58,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.44,
    netEarningsUsd: 18.68,
    netEarningsBtc: 0.000292,
    btcPriceUsd: 64000,
    investorSharePercent: 0.125,
    status: 'Settled'
  },
  {
    id: 'ME-2026-08-21',
    date: '21 Aug 2026',
    btmMined: 0.00039,
    grossRevenueUsd: 24.84,
    miningFeesUsd: 0.50,
    electricityCostUsd: 7.90,
    managementFeeUsd: 1.24,
    netEarningsUsd: 15.20,
    netEarningsBtc: 0.000239,
    btcPriceUsd: 63700,
    investorSharePercent: 0.125,
    status: 'Settled'
  },
  {
    id: 'ME-2026-08-20',
    date: '20 Aug 2026',
    btmMined: 0.00043,
    grossRevenueUsd: 27.35,
    miningFeesUsd: 0.55,
    electricityCostUsd: 8.10,
    managementFeeUsd: 1.37,
    netEarningsUsd: 17.33,
    netEarningsBtc: 0.000272,
    btcPriceUsd: 63600,
    investorSharePercent: 0.125,
    status: 'Settled'
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PAY-8801',
    payoutId: 'FNV-PAY-2026-084',
    date: '25 Aug 2026',
    amountBtc: 0.0012,
    amountUsd: 77.13,
    currency: 'BTC',
    destinationWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    txid: 'e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9',
    explorerUrl: 'https://mempool.space/tx/e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9',
    status: 'Successful',
    confirmations: 142
  },
  {
    id: 'PAY-8800',
    payoutId: 'FNV-PAY-2026-079',
    date: '18 Aug 2026',
    amountBtc: 0.0025,
    amountUsd: 160.70,
    currency: 'BTC',
    destinationWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    txid: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0f',
    explorerUrl: 'https://mempool.space/tx/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9e4f5a6b7c8d9e0f',
    status: 'Successful',
    confirmations: 820
  },
  {
    id: 'PAY-8799',
    payoutId: 'FNV-PAY-2026-071',
    date: '05 Aug 2026',
    amountBtc: 0.0034,
    amountUsd: 216.50,
    currency: 'BTC',
    destinationWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    txid: '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    explorerUrl: 'https://mempool.space/tx/8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    status: 'Successful',
    confirmations: 2410
  },
  {
    id: 'PAY-8798',
    payoutId: 'FNV-PAY-2026-065',
    date: '20 Jul 2026',
    amountBtc: 0.0051,
    amountUsd: 322.00,
    currency: 'BTC',
    destinationWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    txid: '3b8f1a2c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    explorerUrl: 'https://mempool.space/tx/3b8f1a2c7d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    status: 'Successful',
    confirmations: 5800
  }
];

export const FLEET_MACHINES: MiningFleetMachine[] = [
  {
    id: 'MINER-MCT-0101',
    podId: 'POD-A-01 (Muscat Site)',
    model: 'Antminer S21 Pro (16nm SHA-256)',
    hashrateTH: 114.2,
    powerDrawWatts: 3420,
    tempCelsius: 64.2,
    efficiencyJTH: 15.0,
    status: 'Online',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 99.8,
    assignedToUser: true
  },
  {
    id: 'MINER-MCT-0102',
    podId: 'POD-A-01 (Muscat Site)',
    model: 'Antminer S21 Pro (16nm SHA-256)',
    hashrateTH: 113.8,
    powerDrawWatts: 3410,
    tempCelsius: 65.1,
    efficiencyJTH: 15.0,
    status: 'Online',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 99.7,
    assignedToUser: true
  },
  {
    id: 'MINER-MCT-0103',
    podId: 'POD-A-02 (Muscat Site)',
    model: 'Antminer S21 Pro (16nm SHA-256)',
    hashrateTH: 114.6,
    powerDrawWatts: 3430,
    tempCelsius: 63.8,
    efficiencyJTH: 15.0,
    status: 'Online',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 99.9,
    assignedToUser: true
  },
  {
    id: 'MINER-MCT-0104',
    podId: 'POD-A-02 (Muscat Site)',
    model: 'Antminer S21 XP Hydro',
    hashrateTH: 115.1,
    powerDrawWatts: 3450,
    tempCelsius: 61.5,
    efficiencyJTH: 14.8,
    status: 'Online',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 100.0,
    assignedToUser: true
  },
  {
    id: 'MINER-MCT-0105',
    podId: 'POD-B-01 (Muscat Site)',
    model: 'Antminer S21 Pro',
    hashrateTH: 112.9,
    powerDrawWatts: 3400,
    tempCelsius: 66.0,
    efficiencyJTH: 15.2,
    status: 'Online',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 98.9,
    assignedToUser: false
  },
  {
    id: 'MINER-MCT-0106',
    podId: 'POD-B-02 (Muscat Site)',
    model: 'Antminer S21 Pro',
    hashrateTH: 0.0,
    powerDrawWatts: 120,
    tempCelsius: 42.0,
    efficiencyJTH: 0.0,
    status: 'Maintenance',
    pool: 'Foundry USA Pool (VIP VIP-084)',
    uptimePercent: 94.2,
    assignedToUser: false
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-01',
    title: '4-Year Defined Term Mining Pod Lease Agreement',
    category: 'Agreement',
    date: '15 Jan 2025',
    size: '2.4 MB',
    fileFormat: 'PDF',
    verified: true
  },
  {
    id: 'DOC-02',
    title: 'Muscat Corporate KYC & Sovereign Compliance Clearance',
    category: 'KYC',
    date: '12 Jan 2025',
    size: '1.8 MB',
    fileFormat: 'PDF',
    verified: true
  },
  {
    id: 'DOC-03',
    title: 'August 2026 Monthly Telemetry & Mining Statement',
    category: 'Mining Statement',
    date: '26 Aug 2026',
    size: '1.1 MB',
    fileFormat: 'PDF',
    verified: true
  },
  {
    id: 'DOC-04',
    title: 'July 2026 Monthly Telemetry & Mining Statement',
    category: 'Mining Statement',
    date: '31 Jul 2026',
    size: '1.2 MB',
    fileFormat: 'PDF',
    verified: true
  },
  {
    id: 'DOC-05',
    title: 'Initial Capital Deposition & Allocation Official Receipt',
    category: 'Receipt',
    date: '15 Jan 2025',
    size: '840 KB',
    fileFormat: 'PDF',
    verified: true
  },
  {
    id: 'DOC-06',
    title: 'FY2025 Annual Thermodynamic & Hashrate Audit Report',
    category: 'Audit',
    date: '10 Jan 2026',
    size: '4.6 MB',
    fileFormat: 'PDF',
    verified: true
  }
];

export const INITIAL_MONTHLY_STATEMENTS: MonthlyStatementData[] = [
  {
    statementId: 'STM-2026-08',
    monthYear: 'August 2026',
    periodStart: '01 Aug 2026',
    periodEnd: '26 Aug 2026 (MTD)',
    openingBalanceUsd: 54100,
    openingBalanceBtc: 0.0812,
    investmentAmountUsd: 50000,
    btcMined: 0.0124,
    grossEarningsUsd: 797.00,
    operationalFeesUsd: 218.70,
    managementFeesUsd: 39.85,
    netEarningsUsd: 538.45,
    payoutsDisbursedUsd: 454.33,
    closingBalanceUsd: 56200,
    closingBalanceBtc: 0.085,
    btcPriceAverage: 64120,
    portfolioValueUsd: 56200,
    monthlyRoiPercent: 2.8
  },
  {
    statementId: 'STM-2026-07',
    monthYear: 'July 2026',
    periodStart: '01 Jul 2026',
    periodEnd: '31 Jul 2026',
    openingBalanceUsd: 51800,
    openingBalanceBtc: 0.0768,
    investmentAmountUsd: 50000,
    btcMined: 0.0142,
    grossEarningsUsd: 894.60,
    operationalFeesUsd: 245.00,
    managementFeesUsd: 44.70,
    netEarningsUsd: 604.90,
    payoutsDisbursedUsd: 500.00,
    closingBalanceUsd: 54100,
    closingBalanceBtc: 0.0812,
    btcPriceAverage: 63000,
    portfolioValueUsd: 54100,
    monthlyRoiPercent: 3.1
  },
  {
    statementId: 'STM-2026-06',
    monthYear: 'June 2026',
    periodStart: '01 Jun 2026',
    periodEnd: '30 Jun 2026',
    openingBalanceUsd: 49500,
    openingBalanceBtc: 0.0715,
    investmentAmountUsd: 50000,
    btcMined: 0.0138,
    grossEarningsUsd: 841.80,
    operationalFeesUsd: 238.00,
    managementFeesUsd: 42.00,
    netEarningsUsd: 561.80,
    payoutsDisbursedUsd: 480.00,
    closingBalanceUsd: 51800,
    closingBalanceBtc: 0.0768,
    btcPriceAverage: 61000,
    portfolioValueUsd: 51800,
    monthlyRoiPercent: 2.9
  }
];

export const INITIAL_NOTIFICATIONS: InvestorNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Mining Payout Credited',
    message: 'Your automated payout of 0.0012 BTC ($77.13) has been processed and confirmed on the blockchain.',
    date: '25 Aug 2026',
    time: '18:35 UTC',
    read: false,
    type: 'payout',
    badge: 'PAYOUT'
  },
  {
    id: 'NOTIF-02',
    title: 'Monthly Statement Available',
    message: 'The August 2026 MTD Telemetry & Audit Statement is now available in your Reports & Documents center.',
    date: '26 Aug 2026',
    time: '06:00 UTC',
    read: false,
    type: 'statement',
    badge: 'STATEMENT'
  },
  {
    id: 'NOTIF-03',
    title: 'Mining Facility Scheduled Maintenance',
    message: 'Muscat MCT-01 Pod B-02 undergoing scheduled thermodynamic filter cleaning. Investor Pod A-01 remains at 100% full capacity.',
    date: '24 Aug 2026',
    time: '12:00 UTC',
    read: true,
    type: 'facility',
    badge: 'FACILITY'
  },
  {
    id: 'NOTIF-04',
    title: 'Security Alert: New Session Verified',
    message: 'Successful investor login verified from Muscat, Oman (IP 82.178.45.12).',
    date: '26 Aug 2026',
    time: '07:20 UTC',
    read: true,
    type: 'security',
    badge: 'SECURITY'
  },
  {
    id: 'NOTIF-05',
    title: 'KYC Annual Re-Verification Complete',
    message: 'Your institutional compliance clearance has been approved through Q4 2027.',
    date: '10 Aug 2026',
    time: '10:15 UTC',
    read: true,
    type: 'kyc',
    badge: 'KYC'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1042',
    ticketNumber: 'SUP-2026-1042',
    subject: 'Requesting Payout Destination Whitelist Verification',
    category: 'Withdrawal',
    status: 'In Progress',
    priority: 'Medium',
    createdDate: '24 Aug 2026',
    lastUpdated: '25 Aug 2026',
    messages: [
      {
        id: 'MSG-01',
        sender: 'Investor',
        senderName: 'Dr. Tariq Al-Balushi',
        text: 'Hello, I have updated my cold storage payout address to a multisig taproot descriptor. Please confirm it is whitelisted for future automated Friday payouts.',
        timestamp: '24 Aug 2026, 14:20 UTC'
      },
      {
        id: 'MSG-02',
        sender: 'Relationship Manager',
        senderName: 'Sultan Al-Habsi (Institutional Desk)',
        text: 'Good day Dr. Tariq. Our compliance and security team has verified the cryptographic signature on your new address. It is now active on your whitelist.',
        timestamp: '25 Aug 2026, 09:15 UTC'
      }
    ]
  },
  {
    id: 'TCK-0988',
    ticketNumber: 'SUP-2026-0988',
    subject: 'Annual Tax Statement FY2025 Inquiries',
    category: 'Investment agreement',
    status: 'Resolved',
    priority: 'Low',
    createdDate: '15 Jul 2026',
    lastUpdated: '16 Jul 2026',
    messages: [
      {
        id: 'MSG-10',
        sender: 'Investor',
        senderName: 'Dr. Tariq Al-Balushi',
        text: 'Please provide the stamped PDF of our capital equipment lease tax depreciation certificate.',
        timestamp: '15 Jul 2026, 11:00 UTC'
      },
      {
        id: 'MSG-11',
        sender: 'Support Agent',
        senderName: 'Corporate Compliance Desk',
        text: 'The certified tax depreciation schedule has been uploaded to your Reports tab under DOC-06.',
        timestamp: '16 Jul 2026, 14:40 UTC'
      }
    ]
  }
];

export const INITIAL_REFERRALS: ReferralStat = {
  referralLink: 'https://finovatech-mining.om/ref/FINO-OM-842',
  totalReferrals: 4,
  activeInvestorsReferred: 2,
  referralEarningsUsd: 1450,
  pendingCommissionUsd: 250,
  paidCommissionUsd: 1200,
  referredUsers: [
    {
      id: 'REF-01',
      name: 'Salim Al-Busaidi',
      joinedDate: '12 Feb 2026',
      plan: 'Industrial Pod Tier 1 (125 TH/s)',
      commissionUsd: 750,
      status: 'Active'
    },
    {
      id: 'REF-02',
      name: 'Nasser Al-Kharusi',
      joinedDate: '20 May 2026',
      plan: 'Enterprise ASIC Pod Cluster (250 TH/s)',
      commissionUsd: 450,
      status: 'Active'
    },
    {
      id: 'REF-03',
      name: 'Ahmed Al-Harthy',
      joinedDate: '18 Aug 2026',
      plan: 'Institutional Custom Node (Under KYC)',
      commissionUsd: 250,
      status: 'Pending'
    }
  ]
};

export const INITIAL_SESSIONS: LoginSession[] = [
  {
    id: 'SES-01',
    device: 'Apple MacBook Pro (macOS Sequoia)',
    browser: 'Chrome 128.0 (Encrypted SSL)',
    ipAddress: '82.178.45.12',
    location: 'Muscat, Sultanate of Oman',
    lastActive: 'Active Now',
    isCurrent: true
  },
  {
    id: 'SES-02',
    device: 'Apple iPhone 15 Pro (iOS 18)',
    browser: 'Mobile Safari',
    ipAddress: '82.178.45.88',
    location: 'Muscat, Sultanate of Oman',
    lastActive: '25 Aug 2026, 20:14 UTC',
    isCurrent: false
  },
  {
    id: 'SES-03',
    device: 'iPad Pro 13-inch',
    browser: 'Mobile Safari',
    ipAddress: '185.12.94.33',
    location: 'Salalah, Sultanate of Oman',
    lastActive: '14 Aug 2026, 12:40 UTC',
    isCurrent: false
  }
];

export const MINING_HISTORICAL_CHART_DATA = [
  { date: '15 Aug', hashrateTH: 124.8, btcMined: 0.00041, revUsd: 26.2, costUsd: 8.1, netUsd: 18.1 },
  { date: '16 Aug', hashrateTH: 125.2, btcMined: 0.00042, revUsd: 26.9, costUsd: 8.1, netUsd: 18.8 },
  { date: '17 Aug', hashrateTH: 124.9, btcMined: 0.00040, revUsd: 25.6, costUsd: 8.1, netUsd: 17.5 },
  { date: '18 Aug', hashrateTH: 125.4, btcMined: 0.00043, revUsd: 27.5, costUsd: 8.1, netUsd: 19.4 },
  { date: '19 Aug', hashrateTH: 125.1, btcMined: 0.00041, revUsd: 26.2, costUsd: 8.1, netUsd: 18.1 },
  { date: '20 Aug', hashrateTH: 125.0, btcMined: 0.00043, revUsd: 27.4, costUsd: 8.1, netUsd: 19.3 },
  { date: '21 Aug', hashrateTH: 124.7, btcMined: 0.00039, revUsd: 24.8, costUsd: 7.9, netUsd: 16.9 },
  { date: '22 Aug', hashrateTH: 125.6, btcMined: 0.00045, revUsd: 28.8, costUsd: 8.1, netUsd: 20.7 },
  { date: '23 Aug', hashrateTH: 125.1, btcMined: 0.00043, revUsd: 27.5, costUsd: 8.1, netUsd: 19.4 },
  { date: '24 Aug', hashrateTH: 124.8, btcMined: 0.00041, revUsd: 26.2, costUsd: 8.1, netUsd: 18.1 },
  { date: '25 Aug', hashrateTH: 125.3, btcMined: 0.00044, revUsd: 28.3, costUsd: 8.1, netUsd: 20.2 },
  { date: '26 Aug', hashrateTH: 125.2, btcMined: 0.00042, revUsd: 27.0, costUsd: 8.1, netUsd: 18.9 }
];

export const ROI_CUMULATIVE_CHART_DATA = [
  { month: 'Jan 25', invested: 50000, portfolioVal: 50000, cumulativeEarned: 0, btcPrice: 58000 },
  { month: 'Mar 25', invested: 50000, portfolioVal: 51200, cumulativeEarned: 1850, btcPrice: 60200 },
  { month: 'Jun 25', invested: 50000, portfolioVal: 52400, cumulativeEarned: 3900, btcPrice: 61500 },
  { month: 'Sep 25', invested: 50000, portfolioVal: 53100, cumulativeEarned: 5800, btcPrice: 62800 },
  { month: 'Dec 25', invested: 50000, portfolioVal: 53900, cumulativeEarned: 7900, btcPrice: 63500 },
  { month: 'Mar 26', invested: 50000, portfolioVal: 54600, cumulativeEarned: 10200, btcPrice: 63900 },
  { month: 'Jun 26', invested: 50000, portfolioVal: 55400, cumulativeEarned: 12800, btcPrice: 64100 },
  { month: 'Aug 26', invested: 50000, portfolioVal: 56200, cumulativeEarned: 14650, btcPrice: 64280 }
];
