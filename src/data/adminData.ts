import {
  AdminDashboardKpis,
  AdminInvestorItem,
  InvestmentPlan,
  AdminInvestmentTransaction,
  MiningFacilityItem,
  AsicMachineItem,
  MiningPoolItem,
  BtcProductionLedgerRow,
  InvestorAllocationRecord,
  CompanyWalletItem,
  AdminPayoutItem,
  FinanceSummary,
  InvestorLiabilityRow,
  KycVerificationRequest,
  AdminDocumentItem,
  MonthlyStatementBatchItem,
  AdminSupportTicket,
  AdminAuditLogRow,
  SystemSettingsConfig,
  AdminUser
} from '../types';

export const mockAdminUser: AdminUser = {
  id: 'ADM-001',
  name: 'Gaurav K. Sharma',
  username: 'Admin',
  email: 'gaurav.sharma@finovateck.om',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  twoFactorEnabled: true,
  lastLogin: '26 Aug 2026, 08:14 UTC',
  ipAddress: '185.193.88.42 (Muscat, Oman)'
};

export const mockAdminDashboardKpis: AdminDashboardKpis = {
  totalInvestors: 248,
  activeInvestors: 231,
  totalInvestmentUsd: 2450000,
  totalBtcAllocated: 38.65,
  totalBtcMined: 42.85,
  totalBtcPaidOut: 31.20,
  pendingPayoutBtc: 1.82,
  miningHashratePH: 425.0,
  minersOnline: 1185,
  totalMiners: 1220,
  miningUptimePercent: 97.8,
  monthlyRevenueUsd: 185400,
  monthlyCostUsd: 92300,
  netProfitUsd: 93100,
  spotBtcPriceUsd: 64250,
  dailyBtcProduced: 0.1425,
  activeFacilities: 2
};

export const mockAdminInvestors: AdminInvestorItem[] = [
  {
    id: 'INV-00124',
    name: 'Tariq Al-Said',
    email: 'tariq.alsaid@omaninvestment.om',
    phone: '+968 9123 4567',
    country: 'Oman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '12 Jan 2025',
    kycDocumentsCount: 4,
    investmentAmountUsd: 50000,
    btcAllocation: 0.7782,
    currentValueUsd: 64650,
    roiPercent: 29.3,
    contractStatus: 'Active',
    walletStatus: 'Verified',
    walletAddress: 'bc1q9x3d8u7y7f6z5t4r3e2w1q0p9o8n7m6l5k4j3h',
    btcBalance: 0.2241,
    totalMinedBtc: 0.3582,
    totalPaidOutBtc: 0.1341,
    pendingPayoutBtc: 0.0024,
    lastLogin: '26 Aug 2026, 07:45 UTC',
    accountStatus: 'Active',
    assignedRm: 'Sultan Al-Habsi',
    planName: 'Enterprise Hashrate Allocation',
    startDate: '15 Jan 2025',
    endDate: '15 Jan 2029',
    agreementNumber: 'FM-EHA-2025-0892',
    notes: ['Institutional VIP account', 'Requested bi-weekly payout settlement', 'Whitelisted cold storage ledger']
  },
  {
    id: 'INV-00088',
    name: 'Sheikh Hamdan Al-Maktoum',
    email: 'h.maktoum@dubaiholdings.ae',
    phone: '+971 50 112 3344',
    country: 'United Arab Emirates',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '03 Feb 2025',
    kycDocumentsCount: 5,
    investmentAmountUsd: 250000,
    btcAllocation: 3.891,
    currentValueUsd: 334500,
    roiPercent: 33.8,
    contractStatus: 'Active',
    walletStatus: 'Verified',
    walletAddress: 'bc1qhm88k29a4v5z7x9c1b3n5m7l9k0j2h4g6f8d0s',
    btcBalance: 1.1205,
    totalMinedBtc: 1.8450,
    totalPaidOutBtc: 0.7245,
    pendingPayoutBtc: 0.0150,
    lastLogin: '25 Aug 2026, 19:20 UTC',
    accountStatus: 'High Value',
    assignedRm: 'Layla Al-Balushi',
    planName: 'Sovereign Institutional Pod',
    startDate: '01 Feb 2025',
    endDate: '01 Feb 2029',
    agreementNumber: 'FM-SIP-2025-0014',
    notes: ['Dedicated immersion pod (25 PH/s)', 'Direct wire transfers via Emirates NBD']
  },
  {
    id: 'INV-00156',
    name: 'Fatima Al-Harthy',
    email: 'fatima.harthy@muscatcapital.om',
    phone: '+968 9988 7766',
    country: 'Oman',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '18 Mar 2025',
    kycDocumentsCount: 3,
    investmentAmountUsd: 25000,
    btcAllocation: 0.3891,
    currentValueUsd: 31800,
    roiPercent: 27.2,
    contractStatus: 'Active',
    walletStatus: 'Verified',
    walletAddress: 'bc1qfat99h88j77k66l55m44n33o22p11q00r99s88',
    btcBalance: 0.1042,
    totalMinedBtc: 0.1780,
    totalPaidOutBtc: 0.0738,
    pendingPayoutBtc: 0.0012,
    lastLogin: '26 Aug 2026, 04:10 UTC',
    accountStatus: 'Active',
    assignedRm: 'Sultan Al-Habsi',
    planName: 'Muscat Professional Hashrate',
    startDate: '20 Mar 2025',
    endDate: '20 Mar 2028',
    agreementNumber: 'FM-MPH-2025-0142',
    notes: ['Monthly statement automated dispatch enabled']
  },
  {
    id: 'INV-00201',
    name: 'Marcus Vance',
    email: 'marcus.vance@genevacapital.ch',
    phone: '+41 22 819 4400',
    country: 'Switzerland',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Submitted',
    kycSubmittedDate: '24 Aug 2026',
    kycDocumentsCount: 3,
    investmentAmountUsd: 100000,
    btcAllocation: 1.5564,
    currentValueUsd: 100000,
    roiPercent: 0.0,
    contractStatus: 'Pending',
    walletStatus: 'Pending Whitelist',
    walletAddress: 'bc1qmvc77x99z11w22e33r44t55y66u77i88o99p00',
    btcBalance: 0.0000,
    totalMinedBtc: 0.0000,
    totalPaidOutBtc: 0.0000,
    pendingPayoutBtc: 0.0000,
    lastLogin: '24 Aug 2026, 14:15 UTC',
    accountStatus: 'Pending KYC',
    assignedRm: 'Layla Al-Balushi',
    planName: 'Enterprise Hashrate Allocation',
    startDate: '01 Sep 2026',
    endDate: '01 Sep 2030',
    agreementNumber: 'FM-EHA-2026-1049',
    notes: ['Awaiting compliance officer review of Swiss passport & utility bill']
  },
  {
    id: 'INV-00189',
    name: 'Khalfan Al-Rawahi',
    email: 'khalfan.rawahi@soharlogistics.om',
    phone: '+968 9456 1234',
    country: 'Oman',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '10 Apr 2025',
    kycDocumentsCount: 3,
    investmentAmountUsd: 15000,
    btcAllocation: 0.2334,
    currentValueUsd: 18950,
    roiPercent: 26.3,
    contractStatus: 'Active',
    walletStatus: 'Verified',
    walletAddress: 'bc1qkraw99x88y77z66a55b44c33d22e11f00g99h88',
    btcBalance: 0.0612,
    totalMinedBtc: 0.1080,
    totalPaidOutBtc: 0.0468,
    pendingPayoutBtc: 0.0008,
    lastLogin: '23 Aug 2026, 11:30 UTC',
    accountStatus: 'Active',
    assignedRm: 'Sultan Al-Habsi',
    planName: 'Muscat Starter Hashrate',
    startDate: '15 Apr 2025',
    endDate: '15 Apr 2027',
    agreementNumber: 'FM-MSH-2025-0312',
    notes: ['Referral partner with 3 active invites']
  },
  {
    id: 'INV-00045',
    name: 'Dr. Ziyad Al-Kharusi',
    email: 'dr.ziyad@omarmedical.om',
    phone: '+968 9222 8899',
    country: 'Oman',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '05 Nov 2024',
    kycDocumentsCount: 4,
    investmentAmountUsd: 75000,
    btcAllocation: 1.1673,
    currentValueUsd: 101250,
    roiPercent: 35.0,
    contractStatus: 'Expiring',
    walletStatus: 'Verified',
    walletAddress: 'bc1qdrz99k88j77h66g55f44d33s22a11p00o99i88',
    btcBalance: 0.3412,
    totalMinedBtc: 0.5890,
    totalPaidOutBtc: 0.2478,
    pendingPayoutBtc: 0.0035,
    lastLogin: '26 Aug 2026, 06:12 UTC',
    accountStatus: 'Contract Expiring',
    assignedRm: 'Sultan Al-Habsi',
    planName: 'Enterprise Hashrate Allocation',
    startDate: '10 Nov 2024',
    endDate: '10 Nov 2026',
    agreementNumber: 'FM-EHA-2024-0042',
    notes: ['Contract matures in 75 days', 'Renewal proposal sent on Aug 15']
  },
  {
    id: 'INV-00214',
    name: 'Elena Rostova',
    email: 'e.rostova@nordiccapital.fi',
    phone: '+358 40 123 4567',
    country: 'Finland',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Under Review',
    kycSubmittedDate: '25 Aug 2026',
    kycDocumentsCount: 4,
    investmentAmountUsd: 50000,
    btcAllocation: 0.7782,
    currentValueUsd: 50000,
    roiPercent: 0.0,
    contractStatus: 'Pending',
    walletStatus: 'Pending Whitelist',
    walletAddress: 'bc1qelena88x77y66z55a44b33c22d11e00f99g88',
    btcBalance: 0.0000,
    totalMinedBtc: 0.0000,
    totalPaidOutBtc: 0.0000,
    pendingPayoutBtc: 0.0000,
    lastLogin: '25 Aug 2026, 16:40 UTC',
    accountStatus: 'Pending Payment',
    assignedRm: 'Layla Al-Balushi',
    planName: 'Enterprise Hashrate Allocation',
    startDate: '01 Sep 2026',
    endDate: '01 Sep 2029',
    agreementNumber: 'FM-EHA-2026-1120',
    notes: ['Wire transfer pending from OP Financial Group Helsinki']
  },
  {
    id: 'INV-00102',
    name: 'Nasser Al-Barwani',
    email: 'nasser.barwani@muscatenergy.om',
    phone: '+968 9876 5432',
    country: 'Oman',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    kycStatus: 'Approved',
    kycSubmittedDate: '14 Feb 2025',
    kycDocumentsCount: 3,
    investmentAmountUsd: 120000,
    btcAllocation: 1.8676,
    currentValueUsd: 158400,
    roiPercent: 32.0,
    contractStatus: 'Active',
    walletStatus: 'Verified',
    walletAddress: 'bc1qnas99b88c77d66e55f44g33h22j11k00l99m88',
    btcBalance: 0.4850,
    totalMinedBtc: 0.8920,
    totalPaidOutBtc: 0.4070,
    pendingPayoutBtc: 0.0055,
    lastLogin: '25 Aug 2026, 21:00 UTC',
    accountStatus: 'High Value',
    assignedRm: 'Sultan Al-Habsi',
    planName: 'Sovereign Institutional Pod',
    startDate: '20 Feb 2025',
    endDate: '20 Feb 2029',
    agreementNumber: 'FM-SIP-2025-0028',
    notes: ['Co-investor in MCT-01 Pod #04']
  }
];

export const mockInvestmentPlans: InvestmentPlan[] = [
  {
    id: 'PLAN-A',
    name: 'Muscat Starter Hashrate',
    tagline: 'Accessible institutional mining entry with flexible terms',
    minInvestmentUsd: 5000,
    maxInvestmentUsd: 20000,
    durationMonths: 12,
    miningAllocationThPer1k: 15.5,
    managementFeePercent: 8.0,
    electricityRatePerKwh: 0.042,
    payoutFrequency: 'Monthly',
    status: 'Active',
    activeInvestorsCount: 68,
    totalAumUsd: 485000,
    projectedAnnualRoiMin: 22.0,
    projectedAnnualRoiMax: 28.5,
    features: [
      '15.5 TH/s per $1,000 capital',
      'Fixed $0.042/kWh tariff guarantee',
      'Monthly BTC settlement directly to cold storage',
      'Audited monthly production reports',
      'Standard ticket support (24h SLA)'
    ]
  },
  {
    id: 'PLAN-B',
    name: 'Enterprise Hashrate Allocation',
    tagline: 'High-efficiency industrial allocation with daily telemetry',
    minInvestmentUsd: 25000,
    maxInvestmentUsd: 100000,
    durationMonths: 24,
    miningAllocationThPer1k: 16.8,
    managementFeePercent: 6.5,
    electricityRatePerKwh: 0.042,
    payoutFrequency: 'Monthly',
    status: 'Active',
    activeInvestorsCount: 114,
    totalAumUsd: 1240000,
    projectedAnnualRoiMin: 26.5,
    projectedAnnualRoiMax: 34.0,
    features: [
      '16.8 TH/s per $1,000 capital',
      'Dedicated S21 Pro / M60S fleet pod allocation',
      'Priority on-chain BTC settlement',
      'Dedicated Relationship Manager',
      'Quarterly facility visit invitation'
    ]
  },
  {
    id: 'PLAN-C',
    name: 'Sovereign Institutional Pod',
    tagline: 'Private immersion megawatt container for family offices and funds',
    minInvestmentUsd: 150000,
    maxInvestmentUsd: 1000000,
    durationMonths: 48,
    miningAllocationThPer1k: 18.2,
    managementFeePercent: 4.5,
    electricityRatePerKwh: 0.039,
    payoutFrequency: 'Weekly',
    status: 'Active',
    activeInvestorsCount: 49,
    totalAumUsd: 725000,
    projectedAnnualRoiMin: 30.0,
    projectedAnnualRoiMax: 39.5,
    features: [
      '18.2 TH/s per $1,000 capital',
      'Dedicated 1.2 MW immersion container enclosure',
      'Weekly automated multi-sig payout protocol',
      'Direct WhatsApp VIP desk & technical engineering lead access',
      'Legal title / hardware asset lien documentation'
    ]
  }
];

export const mockInvestmentTransactions: AdminInvestmentTransaction[] = [
  {
    id: 'TXN-9081',
    investmentId: 'INV-TX-2026-081',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    amountUsd: 50000,
    currency: 'USD',
    paymentMethod: 'Bank Wire Transfer',
    paymentReference: 'WIRE-BMA-992140',
    date: '15 Jan 2025',
    planId: 'PLAN-B',
    planName: 'Enterprise Hashrate Allocation',
    hashrateAllocationTH: 840,
    status: 'Active',
    adminApprovedBy: 'Gaurav K. Sharma',
    verifiedAt: '15 Jan 2025, 14:00 UTC',
    notes: 'Payment confirmed via Bank Muscat Corporate Account'
  },
  {
    id: 'TXN-9104',
    investmentId: 'INV-TX-2026-104',
    investorId: 'INV-00201',
    investorName: 'Marcus Vance',
    amountUsd: 100000,
    currency: 'USD',
    paymentMethod: 'Bank Wire Transfer',
    paymentReference: 'WIRE-UBS-884102',
    date: '24 Aug 2026',
    planId: 'PLAN-B',
    planName: 'Enterprise Hashrate Allocation',
    hashrateAllocationTH: 1680,
    status: 'Verified',
    adminApprovedBy: 'Layla Al-Balushi (Finance)',
    verifiedAt: '25 Aug 2026, 09:30 UTC',
    notes: 'Escrow deposit verified, awaiting KYC final signoff'
  },
  {
    id: 'TXN-9118',
    investmentId: 'INV-TX-2026-118',
    investorId: 'INV-00214',
    investorName: 'Elena Rostova',
    amountUsd: 50000,
    currency: 'USD',
    paymentMethod: 'Corporate Escrow',
    paymentReference: 'ESCROW-NC-4401',
    date: '25 Aug 2026',
    planId: 'PLAN-B',
    planName: 'Enterprise Hashrate Allocation',
    hashrateAllocationTH: 840,
    status: 'Payment Received',
    notes: 'Incoming swift MT103 confirmation received'
  },
  {
    id: 'TXN-8842',
    investmentId: 'INV-TX-2025-034',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    amountUsd: 250000,
    amountBtc: 3.891,
    currency: 'USD',
    paymentMethod: 'Bitcoin (BTC)',
    paymentReference: 'BTC-TX-77a88b99c00d11e22f',
    date: '01 Feb 2025',
    planId: 'PLAN-C',
    planName: 'Sovereign Institutional Pod',
    hashrateAllocationTH: 4550,
    status: 'Active',
    adminApprovedBy: 'Gaurav K. Sharma',
    verifiedAt: '01 Feb 2025, 11:20 UTC',
    notes: 'On-chain settlement verified into Treasury Vault #1'
  }
];

export const mockMiningFacilities: MiningFacilityItem[] = [
  {
    id: 'FAC-MCT-01',
    name: 'Muscat Mega Mining Facility',
    code: 'MCT-01',
    location: 'Rusayl Industrial Estate, Muscat',
    country: 'Sultanate of Oman',
    totalMiners: 1220,
    onlineMiners: 1185,
    offlineMiners: 22,
    maintenanceMiners: 13,
    hashratePH: 425.0,
    powerConsumptionMW: 12.8,
    efficiencyJTH: 16.2,
    uptimePercent: 97.8,
    btcToday: 0.142,
    btcThisMonth: 4.28,
    pueRatio: 1.04,
    coolingType: 'Liquid Immersion',
    gridTariffUsd: 0.042,
    status: 'Optimal'
  },
  {
    id: 'FAC-SLL-02',
    name: 'Salalah Freezone Hydro Farm',
    code: 'SLL-02',
    location: 'Salalah Free Zone, Dhofar',
    country: 'Sultanate of Oman',
    totalMiners: 520,
    onlineMiners: 508,
    offlineMiners: 8,
    maintenanceMiners: 4,
    hashratePH: 182.0,
    powerConsumptionMW: 5.6,
    efficiencyJTH: 15.8,
    uptimePercent: 98.4,
    btcToday: 0.061,
    btcThisMonth: 1.83,
    pueRatio: 1.03,
    coolingType: 'Liquid Immersion',
    gridTariffUsd: 0.039,
    status: 'Optimal'
  }
];

export const mockAsicMachines: AsicMachineItem[] = [
  {
    id: 'ASIC-001',
    machineId: 'MCT-S21P-R01-01',
    model: 'Antminer S21 Pro (234 TH/s)',
    serialNumber: 'S21P-OM-2025-901042',
    hashrateTH: 234.8,
    targetHashrateTH: 234.0,
    powerWatts: 3510,
    efficiencyJTH: 15.0,
    ipAddress: '10.240.12.101',
    macAddress: '70:B3:D5:E8:4A:11',
    facility: 'Muscat MCT-01',
    rackLocation: 'Rack A-01',
    shelf: 'Shelf 1',
    status: 'Online',
    tempCelsius: 58,
    chipTempCelsius: 64,
    fanRpm: 5400,
    fanStatus: 'Optimal',
    miningPool: 'Foundry USA Pool',
    lastHeartbeat: '20s ago',
    uptimeHours: 3410,
    firmwareVersion: 'v2.4.1-immersion-om'
  },
  {
    id: 'ASIC-002',
    machineId: 'MCT-S21P-R01-02',
    model: 'Antminer S21 Pro (234 TH/s)',
    serialNumber: 'S21P-OM-2025-901043',
    hashrateTH: 233.9,
    targetHashrateTH: 234.0,
    powerWatts: 3495,
    efficiencyJTH: 14.9,
    ipAddress: '10.240.12.102',
    macAddress: '70:B3:D5:E8:4A:12',
    facility: 'Muscat MCT-01',
    rackLocation: 'Rack A-01',
    shelf: 'Shelf 2',
    status: 'Online',
    tempCelsius: 59,
    chipTempCelsius: 65,
    fanRpm: 5420,
    fanStatus: 'Optimal',
    miningPool: 'Foundry USA Pool',
    lastHeartbeat: '18s ago',
    uptimeHours: 3410,
    firmwareVersion: 'v2.4.1-immersion-om'
  },
  {
    id: 'ASIC-003',
    machineId: 'MCT-M60S-R04-12',
    model: 'Whatsminer M60S (186 TH/s)',
    serialNumber: 'M60S-OM-2025-441098',
    hashrateTH: 172.4,
    targetHashrateTH: 186.0,
    powerWatts: 3420,
    efficiencyJTH: 19.8,
    ipAddress: '10.240.14.112',
    macAddress: '70:B3:D5:E8:9B:44',
    facility: 'Muscat MCT-01',
    rackLocation: 'Rack B-04',
    shelf: 'Shelf 3',
    status: 'Warning',
    tempCelsius: 76,
    chipTempCelsius: 84,
    fanRpm: 6800,
    fanStatus: 'Warning',
    miningPool: 'AntPool Hydro',
    lastHeartbeat: '45s ago',
    uptimeHours: 1820,
    firmwareVersion: 'v1.9.8-std'
  },
  {
    id: 'ASIC-004',
    machineId: 'MCT-S21P-R08-05',
    model: 'Antminer S21 Pro (234 TH/s)',
    serialNumber: 'S21P-OM-2025-908812',
    hashrateTH: 0.0,
    targetHashrateTH: 234.0,
    powerWatts: 15,
    efficiencyJTH: 0.0,
    ipAddress: '10.240.18.105',
    macAddress: '70:B3:D5:E8:3C:99',
    facility: 'Muscat MCT-01',
    rackLocation: 'Rack C-08',
    shelf: 'Shelf 1',
    status: 'Offline',
    tempCelsius: 28,
    chipTempCelsius: 28,
    fanRpm: 0,
    fanStatus: 'Error',
    miningPool: 'Foundry USA Pool',
    lastHeartbeat: '2h 14m ago',
    uptimeHours: 0,
    firmwareVersion: 'v2.4.1-immersion-om'
  },
  {
    id: 'ASIC-005',
    machineId: 'MCT-S21P-R09-02',
    model: 'Antminer S21 Pro (234 TH/s)',
    serialNumber: 'S21P-OM-2025-909941',
    hashrateTH: 0.0,
    targetHashrateTH: 234.0,
    powerWatts: 120,
    efficiencyJTH: 0.0,
    ipAddress: '10.240.19.102',
    macAddress: '70:B3:D5:E8:2A:77',
    facility: 'Muscat MCT-01',
    rackLocation: 'Rack C-09',
    shelf: 'Shelf 2',
    status: 'Maintenance',
    tempCelsius: 32,
    chipTempCelsius: 32,
    fanRpm: 2100,
    fanStatus: 'Optimal',
    miningPool: 'Foundry USA Pool',
    lastHeartbeat: '10m ago',
    uptimeHours: 0,
    firmwareVersion: 'v2.4.2-immersion-beta'
  }
];

export const mockMiningPools: MiningPoolItem[] = [
  {
    id: 'POOL-01',
    poolName: 'Foundry USA Pool',
    accountName: 'finovateck_mct01.worker_main',
    hashratePH: 310.5,
    activeWorkers: 875,
    validSharesPercent: 99.92,
    invalidSharesPercent: 0.08,
    btcEarned24h: 0.1042,
    btcEarnedMonth: 3.125,
    poolFeePercent: 1.5,
    payoutScheme: 'FPPS',
    lastPayoutDate: '26 Aug 2026, 00:05 UTC',
    lastPayoutBtc: 0.1038,
    connectionStatus: 'Connected',
    stratumUrl: 'stratum+tcp://btc.foundryusapool.com',
    stratumPort: 3333
  },
  {
    id: 'POOL-02',
    poolName: 'AntPool Hydro VIP',
    accountName: 'finovateck_sub02',
    hashratePH: 114.5,
    activeWorkers: 310,
    validSharesPercent: 99.88,
    invalidSharesPercent: 0.12,
    btcEarned24h: 0.0383,
    btcEarnedMonth: 1.155,
    poolFeePercent: 1.75,
    payoutScheme: 'PPLNS',
    lastPayoutDate: '26 Aug 2026, 01:12 UTC',
    lastPayoutBtc: 0.0381,
    connectionStatus: 'Connected',
    stratumUrl: 'stratum+ssl://stratum.antpool.com',
    stratumPort: 443
  }
];

export const mockBtcProductionLedger: BtcProductionLedgerRow[] = [
  {
    id: 'LEDGER-2026-08-25',
    date: '25 Aug 2026',
    poolBtcReceived: 0.1425,
    miningFeesBtc: 0.0021,
    operationalCostBtc: 0.0435,
    operationalCostUsd: 2795,
    investorAllocationBtc: 0.0685,
    companyShareBtc: 0.0284,
    availableBtc: 0.0284,
    btcPriceUsd: 64250,
    totalHashratePH: 425.0,
    status: 'Audited',
    auditedBy: 'Gaurav K. Sharma'
  },
  {
    id: 'LEDGER-2026-08-24',
    date: '24 Aug 2026',
    poolBtcReceived: 0.1438,
    miningFeesBtc: 0.0022,
    operationalCostBtc: 0.0438,
    operationalCostUsd: 2814,
    investorAllocationBtc: 0.0691,
    companyShareBtc: 0.0287,
    availableBtc: 0.0287,
    btcPriceUsd: 64250,
    totalHashratePH: 426.2,
    status: 'Audited',
    auditedBy: 'Gaurav K. Sharma'
  },
  {
    id: 'LEDGER-2026-08-23',
    date: '23 Aug 2026',
    poolBtcReceived: 0.1412,
    miningFeesBtc: 0.0021,
    operationalCostBtc: 0.0431,
    operationalCostUsd: 2769,
    investorAllocationBtc: 0.0678,
    companyShareBtc: 0.0282,
    availableBtc: 0.0282,
    btcPriceUsd: 64250,
    totalHashratePH: 423.8,
    status: 'Audited',
    auditedBy: 'Gaurav K. Sharma'
  },
  {
    id: 'LEDGER-2026-08-22',
    date: '22 Aug 2026',
    poolBtcReceived: 0.1445,
    miningFeesBtc: 0.0022,
    operationalCostBtc: 0.0440,
    operationalCostUsd: 2827,
    investorAllocationBtc: 0.0694,
    companyShareBtc: 0.0289,
    availableBtc: 0.0289,
    btcPriceUsd: 64250,
    totalHashratePH: 427.1,
    status: 'Audited',
    auditedBy: 'Gaurav K. Sharma'
  },
  {
    id: 'LEDGER-2026-08-21',
    date: '21 Aug 2026',
    poolBtcReceived: 0.1408,
    miningFeesBtc: 0.0021,
    operationalCostBtc: 0.0430,
    operationalCostUsd: 2762,
    investorAllocationBtc: 0.0676,
    companyShareBtc: 0.0281,
    availableBtc: 0.0281,
    btcPriceUsd: 64250,
    totalHashratePH: 422.5,
    status: 'Audited',
    auditedBy: 'Gaurav K. Sharma'
  }
];

export const mockInvestorAllocations: InvestorAllocationRecord[] = [
  {
    id: 'ALLOC-0825-01',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    investmentAmountUsd: 50000,
    allocatedHashrateTH: 840,
    miningSharePercent: 0.198,
    date: '25 Aug 2026',
    dailyBtcGenerated: 0.00041,
    grossBtcEarned: 0.00041,
    opexBtcDeducted: 0.00012,
    netBtcCredited: 0.00029,
    status: 'Settled'
  },
  {
    id: 'ALLOC-0825-02',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    investmentAmountUsd: 250000,
    allocatedHashrateTH: 4550,
    miningSharePercent: 1.071,
    date: '25 Aug 2026',
    dailyBtcGenerated: 0.00222,
    grossBtcEarned: 0.00222,
    opexBtcDeducted: 0.00065,
    netBtcCredited: 0.00157,
    status: 'Settled'
  },
  {
    id: 'ALLOC-0825-03',
    investorId: 'INV-00102',
    investorName: 'Nasser Al-Barwani',
    investmentAmountUsd: 120000,
    allocatedHashrateTH: 2184,
    miningSharePercent: 0.514,
    date: '25 Aug 2026',
    dailyBtcGenerated: 0.00107,
    grossBtcEarned: 0.00107,
    opexBtcDeducted: 0.00031,
    netBtcCredited: 0.00076,
    status: 'Settled'
  }
];

export const mockCompanyWallets: CompanyWalletItem[] = [
  {
    id: 'CW-01',
    walletName: 'FINOVATECK Sovereign Cold Vault #1',
    type: 'Cold Vault',
    currency: 'BTC',
    address: 'bc1q9v8u7t6s5r4q3p2o1n0m9l8k7j6h5g4f3d2s1a',
    balance: 184.450,
    balanceUsd: 11850912,
    incoming24h: 0.000,
    outgoing24h: 0.000,
    requiresMultisig: true,
    requiredSignatures: '3 of 5 Hardware Enclaves',
    lastActivity: '12 Aug 2026',
    status: 'Secure'
  },
  {
    id: 'CW-02',
    walletName: 'Investor Automated Hot Payout Pool',
    type: 'Hot Payout',
    currency: 'BTC',
    address: 'bc1qhot99payout88finovateck77mct01xyz123abc456',
    balance: 8.420,
    balanceUsd: 540985,
    incoming24h: 1.820,
    outgoing24h: 0.850,
    requiresMultisig: true,
    requiredSignatures: '2 of 3 (Finance + Automated Engine)',
    lastActivity: '26 Aug 2026, 06:30 UTC',
    status: 'Active'
  },
  {
    id: 'CW-03',
    walletName: 'Muscat Corporate Treasury Reserve',
    type: 'Treasury',
    currency: 'BTC',
    address: 'bc1qtresury77muscat66oman55reserve44corp33btc22',
    balance: 48.200,
    balanceUsd: 3096850,
    incoming24h: 0.0284,
    outgoing24h: 0.000,
    requiresMultisig: true,
    requiredSignatures: '3 of 4 Board Members',
    lastActivity: '25 Aug 2026',
    status: 'Secure'
  },
  {
    id: 'CW-04',
    walletName: 'OPEX & Grid Electricity Escrow',
    type: 'Operational OPEX',
    currency: 'USDT',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    balance: 385400.0,
    balanceUsd: 385400,
    incoming24h: 15000,
    outgoing24h: 92300,
    requiresMultisig: true,
    requiredSignatures: '2 of 3 Finance Admins',
    lastActivity: '24 Aug 2026',
    status: 'Active'
  }
];

export const mockAdminPayouts: AdminPayoutItem[] = [
  {
    id: 'PO-10482',
    payoutId: 'P-10482',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    amountBtc: 0.0024,
    amountUsd: 154.20,
    currency: 'BTC',
    destinationWallet: 'bc1q9x3d8u7y7f6z5t4r3e2w1q0p9o8n7m6l5k4j3h',
    requestedDate: '26 Aug 2026, 07:15 UTC',
    status: 'Requested',
    riskScore: 'Low',
    riskCheckPassed: true,
    blockchainConfirmations: 0,
    notes: 'Whitelisted wallet verified. 2FA session authentic.'
  },
  {
    id: 'PO-10480',
    payoutId: 'P-10480',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    amountBtc: 0.0150,
    amountUsd: 963.75,
    currency: 'BTC',
    destinationWallet: 'bc1qhm88k29a4v5z7x9c1b3n5m7l9k0j2h4g6f8d0s',
    requestedDate: '25 Aug 2026, 18:30 UTC',
    status: 'Finance Approval',
    riskScore: 'Low',
    riskCheckPassed: true,
    financeApprovedBy: 'Layla Al-Balushi (Finance)',
    blockchainConfirmations: 0,
    notes: 'Weekly institutional payout schedule'
  },
  {
    id: 'PO-10475',
    payoutId: 'P-10475',
    investorId: 'INV-00156',
    investorName: 'Fatima Al-Harthy',
    amountBtc: 0.0012,
    amountUsd: 77.10,
    currency: 'BTC',
    destinationWallet: 'bc1qfat99h88j77k66l55m44n33o22p11q00r99s88',
    requestedDate: '24 Aug 2026, 10:00 UTC',
    status: 'Completed',
    riskScore: 'Low',
    riskCheckPassed: true,
    financeApprovedBy: 'Layla Al-Balushi',
    finalApprovedBy: 'Gaurav K. Sharma',
    txid: '3f8a9e2d1c4b7a0f8e9d2c1b4a7f0e8d9c2b1a4f7e0d9c2b1a4f7e0d9c2b1a4f',
    blockchainConfirmations: 142,
    notes: 'Disbursed via automated batch'
  },
  {
    id: 'PO-10471',
    payoutId: 'P-10471',
    investorId: 'INV-00189',
    investorName: 'Khalfan Al-Rawahi',
    amountBtc: 0.0008,
    amountUsd: 51.40,
    currency: 'BTC',
    destinationWallet: 'bc1qkraw99x88y77z66a55b44c33d22e11f00g99h88',
    requestedDate: '22 Aug 2026, 14:20 UTC',
    status: 'Completed',
    riskScore: 'Low',
    riskCheckPassed: true,
    financeApprovedBy: 'Layla Al-Balushi',
    finalApprovedBy: 'Gaurav K. Sharma',
    txid: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockchainConfirmations: 388,
    notes: 'Disbursed via automated batch'
  }
];

export const mockFinanceSummary: FinanceSummary = {
  monthlyRevenueUsd: 185400,
  monthlyMiningRevenueUsd: 168200,
  monthlyManagementFeesUsd: 12400,
  monthlyHostingRevenueUsd: 4800,
  monthlyExpensesUsd: 92300,
  electricityExpenseUsd: 64500,
  hostingExpenseUsd: 6200,
  hardwareDepreciationUsd: 8400,
  maintenanceExpenseUsd: 4100,
  staffExpenseUsd: 5800,
  infrastructureExpenseUsd: 2100,
  poolFeesUsd: 1200,
  otherExpensesUsd: 0,
  netProfitUsd: 93100,
  profitMarginPercent: 50.2,
  btcReserveTotal: 241.07,
  btcReserveUsd: 15488747
};

export const mockInvestorLiabilities: InvestorLiabilityRow[] = [
  {
    id: 'LIAB-2026-08',
    monthYear: 'August 2026 (MTD)',
    openingLiabilityBtc: 36.85,
    openingLiabilityUsd: 2367612,
    newInvestmentsBtc: 2.33,
    newInvestmentsUsd: 150000,
    earnedBtcMined: 1.64,
    earnedBtcUsd: 105370,
    payoutsDisbursedBtc: 2.17,
    payoutsDisbursedUsd: 139422,
    adjustmentsBtc: 0.0,
    closingLiabilityBtc: 38.65,
    closingLiabilityUsd: 2483262,
    settlementStatus: 'Balanced'
  },
  {
    id: 'LIAB-2026-07',
    monthYear: 'July 2026',
    openingLiabilityBtc: 34.20,
    openingLiabilityUsd: 2197350,
    newInvestmentsBtc: 3.11,
    newInvestmentsUsd: 200000,
    earnedBtcMined: 2.14,
    earnedBtcUsd: 137495,
    payoutsDisbursedBtc: 2.60,
    payoutsDisbursedUsd: 167050,
    adjustmentsBtc: 0.0,
    closingLiabilityBtc: 36.85,
    closingLiabilityUsd: 2367612,
    settlementStatus: 'Reconciled'
  },
  {
    id: 'LIAB-2026-06',
    monthYear: 'June 2026',
    openingLiabilityBtc: 31.80,
    openingLiabilityUsd: 2043150,
    newInvestmentsBtc: 3.89,
    newInvestmentsUsd: 250000,
    earnedBtcMined: 2.05,
    earnedBtcUsd: 131712,
    payoutsDisbursedBtc: 3.54,
    payoutsDisbursedUsd: 227445,
    adjustmentsBtc: 0.0,
    closingLiabilityBtc: 34.20,
    closingLiabilityUsd: 2197350,
    settlementStatus: 'Reconciled'
  }
];

export const mockKycRequests: KycVerificationRequest[] = [
  {
    id: 'KYC-2026-081',
    investorId: 'INV-00201',
    investorName: 'Marcus Vance',
    investorEmail: 'marcus.vance@genevacapital.ch',
    country: 'Switzerland',
    submittedDate: '24 Aug 2026, 14:15 UTC',
    status: 'Submitted',
    idType: 'Passport',
    idDocumentUrl: '/docs/kyc_vance_passport.pdf',
    addressProofType: 'Utility Bill',
    addressProofUrl: '/docs/kyc_vance_utility.pdf',
    selfieUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bankDetailsVerified: true,
    riskLevel: 'Low'
  },
  {
    id: 'KYC-2026-082',
    investorId: 'INV-00214',
    investorName: 'Elena Rostova',
    investorEmail: 'e.rostova@nordiccapital.fi',
    country: 'Finland',
    submittedDate: '25 Aug 2026, 16:40 UTC',
    status: 'Under Review',
    idType: 'Passport',
    idDocumentUrl: '/docs/kyc_rostova_passport.pdf',
    addressProofType: 'Bank Statement',
    addressProofUrl: '/docs/kyc_rostova_bankstmt.pdf',
    selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bankDetailsVerified: false,
    reviewedBy: 'Sultan Al-Habsi (RM)',
    riskLevel: 'Low'
  },
  {
    id: 'KYC-2026-079',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    investorEmail: 'tariq.alsaid@omaninvestment.om',
    country: 'Oman',
    submittedDate: '12 Jan 2025',
    status: 'Approved',
    idType: 'National ID',
    idDocumentUrl: '/docs/kyc_tariq_national_id.pdf',
    addressProofType: 'Utility Bill',
    addressProofUrl: '/docs/kyc_tariq_address.pdf',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bankDetailsVerified: true,
    reviewedBy: 'Gaurav K. Sharma',
    reviewDate: '13 Jan 2025',
    riskLevel: 'Low'
  }
];

export const mockAdminDocuments: AdminDocumentItem[] = [
  {
    id: 'DOC-8801',
    title: 'FINOVATECK Master Hashrate Agreement — Tariq Al-Said',
    category: 'Investment Agreement',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    date: '15 Jan 2025',
    size: '1.8 MB',
    format: 'PDF',
    uploadedBy: 'Legal Dept',
    downloadUrl: '#',
    status: 'Active'
  },
  {
    id: 'DOC-8802',
    title: 'Sovereign Institutional Custody Lien — Sheikh Hamdan Al-Maktoum',
    category: 'Investment Agreement',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    date: '01 Feb 2025',
    size: '3.4 MB',
    format: 'PDF',
    uploadedBy: 'Legal Dept',
    downloadUrl: '#',
    status: 'Active'
  },
  {
    id: 'DOC-8803',
    title: 'MCT-01 Independent SHA-256 Mining Audit Report — Q2 2026',
    category: 'Mining Audit',
    date: '10 Jul 2026',
    size: '8.2 MB',
    format: 'PDF',
    uploadedBy: 'PwC Middle East / Technical Auditor',
    downloadUrl: '#',
    status: 'Active'
  },
  {
    id: 'DOC-8804',
    title: 'Oman Ministry of Commerce & Industry — Mining License Renewal 2026',
    category: 'Amendment',
    date: '01 Jan 2026',
    size: '2.1 MB',
    format: 'PDF',
    uploadedBy: 'Compliance Dept',
    downloadUrl: '#',
    status: 'Active'
  }
];

export const mockMonthlyStatementBatches: MonthlyStatementBatchItem[] = [
  {
    id: 'STMT-B-0826-01',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    monthYear: 'August 2026',
    investmentAmountUsd: 50000,
    openingBalanceUsd: 61400,
    btcMined: 0.0124,
    grossRevenueUsd: 796.70,
    feesUsd: 111.54,
    netEarningsUsd: 685.16,
    payoutsUsd: 154.20,
    closingBalanceUsd: 64650,
    roiPercent: 29.3,
    status: 'Reviewed'
  },
  {
    id: 'STMT-B-0826-02',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    monthYear: 'August 2026',
    investmentAmountUsd: 250000,
    openingBalanceUsd: 318000,
    btcMined: 0.0670,
    grossRevenueUsd: 4304.75,
    feesUsd: 473.52,
    netEarningsUsd: 3831.23,
    payoutsUsd: 963.75,
    closingBalanceUsd: 334500,
    roiPercent: 33.8,
    status: 'Approved'
  },
  {
    id: 'STMT-B-0826-03',
    investorId: 'INV-00156',
    investorName: 'Fatima Al-Harthy',
    monthYear: 'August 2026',
    investmentAmountUsd: 25000,
    openingBalanceUsd: 30400,
    btcMined: 0.0062,
    grossRevenueUsd: 398.35,
    feesUsd: 55.77,
    netEarningsUsd: 342.58,
    payoutsUsd: 77.10,
    closingBalanceUsd: 31800,
    roiPercent: 27.2,
    status: 'Approved'
  }
];

export const mockAdminSupportTickets: AdminSupportTicket[] = [
  {
    id: 'ST-904',
    ticketNumber: 'TKT-88402',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    investorEmail: 'tariq.alsaid@omaninvestment.om',
    subject: 'Requesting confirmation on August scheduled settlement',
    category: 'Withdrawal',
    status: 'In Progress',
    priority: 'High',
    channel: 'Portal Ticket',
    assignedRm: 'Sultan Al-Habsi',
    createdAt: '25 Aug 2026, 14:10 UTC',
    lastUpdated: '26 Aug 2026, 07:30 UTC',
    messages: [
      {
        id: 'msg-1',
        sender: 'Investor',
        senderName: 'Tariq Al-Said',
        text: 'Greetings Sultan. Could you confirm if the 0.0024 BTC withdrawal requested this morning will be grouped into the 14:00 UTC batch?',
        timestamp: '26 Aug 2026, 07:15 UTC'
      },
      {
        id: 'msg-2',
        sender: 'Relationship Manager',
        senderName: 'Sultan Al-Habsi',
        text: 'Dear Tariq, yes indeed. The risk checks have passed and Finance has scheduled it for on-chain broadcast at 14:00 UTC. You will receive the TXID link immediately.',
        timestamp: '26 Aug 2026, 07:30 UTC'
      }
    ]
  },
  {
    id: 'ST-905',
    ticketNumber: 'TKT-88405',
    investorId: 'INV-00201',
    investorName: 'Marcus Vance',
    investorEmail: 'marcus.vance@genevacapital.ch',
    subject: 'KYC Document verification status check',
    category: 'KYC',
    status: 'Open',
    priority: 'Medium',
    channel: 'Email',
    assignedRm: 'Layla Al-Balushi',
    createdAt: '25 Aug 2026, 09:20 UTC',
    lastUpdated: '25 Aug 2026, 09:20 UTC',
    messages: [
      {
        id: 'msg-1',
        sender: 'Investor',
        senderName: 'Marcus Vance',
        text: 'Hello, I uploaded my Swiss passport and proof of residence yesterday. Can you let me know when my $100k allocation will start mining?',
        timestamp: '25 Aug 2026, 09:20 UTC'
      }
    ]
  }
];

export const mockAdminAuditLogs: AdminAuditLogRow[] = [
  {
    id: 'LOG-9941',
    timestamp: '26 Aug 2026, 08:14 UTC',
    adminName: 'Gaurav K. Sharma',
    adminRole: 'Super Admin',
    action: 'Logged in to Admin Gateway',
    targetCategory: 'Auth',
    targetId: 'ADM-001',
    targetDescription: 'Session initiated with 2FA verification',
    ipAddress: '185.193.88.42',
    status: 'Success',
    details: 'Hardware security key YubiKey 5 NFC verified.'
  },
  {
    id: 'LOG-9940',
    timestamp: '26 Aug 2026, 07:45 UTC',
    adminName: 'Layla Al-Balushi',
    adminRole: 'Finance Admin',
    action: 'Approved Payout P-10480',
    targetCategory: 'Payout',
    targetId: 'PO-10480',
    targetDescription: '0.0150 BTC payout approved for Sheikh Hamdan Al-Maktoum',
    ipAddress: '185.193.88.19',
    status: 'Success',
    details: 'Multi-sig signature 1 of 2 registered on hot payout wallet.'
  },
  {
    id: 'LOG-9939',
    timestamp: '25 Aug 2026, 22:10 UTC',
    adminName: 'System Engine',
    adminRole: 'Mining Operations',
    action: 'Reconciled Daily Mining Ledger',
    targetCategory: 'Ledger',
    targetId: 'LEDGER-2026-08-25',
    targetDescription: '0.1425 BTC production credited from Foundry USA',
    ipAddress: '10.240.0.1',
    status: 'Success',
    details: 'Auto-distributed 0.0685 BTC to 231 active investor wallets.'
  },
  {
    id: 'LOG-9938',
    timestamp: '25 Aug 2026, 18:00 UTC',
    adminName: 'Sultan Al-Habsi',
    adminRole: 'Investor Manager',
    action: 'Reviewed KYC Request',
    targetCategory: 'KYC',
    targetId: 'KYC-2026-082',
    targetDescription: 'Elena Rostova KYC documents reviewed',
    ipAddress: '185.193.88.25',
    status: 'Success',
    details: 'Passport valid until 2031, forwarded for final compliance review.'
  },
  {
    id: 'LOG-9937',
    timestamp: '25 Aug 2026, 14:30 UTC',
    adminName: 'Gaurav K. Sharma',
    adminRole: 'Super Admin',
    action: 'Rebooted ASIC Miner MCT-S21P-R08-05',
    targetCategory: 'Machine',
    targetId: 'ASIC-004',
    targetDescription: 'Sent reboot command to IP 10.240.18.105',
    ipAddress: '185.193.88.42',
    status: 'Warning',
    details: 'Hardware fan error detected, unit flagged for physical maintenance.'
  }
];

export const mockSystemSettings: SystemSettingsConfig = {
  companyName: 'FINOVATECK Mining Company S.A.O.C',
  registrationNumber: 'CR-1398201 / MOCI-OM',
  jurisdiction: 'Muscat, Sultanate of Oman',
  primaryCurrency: 'USD',
  btcPriceFeedSource: 'Coinbase Pro & Binance Institutional Real-time Weighted Average',
  currentElectricityTariff: 0.042,
  defaultManagementFeePercent: 6.5,
  poolFeePercent: 1.5,
  minimumWithdrawalBtc: 0.0005,
  maximumDailyWithdrawalBtc: 5.0,
  payoutBatchFrequency: 'Daily',
  kycEnforcementLevel: 'Mandatory Prior to Payout',
  multisigThreshold: '3 of 5 Keys',
  emergencyFreezeActive: false,
  emailNotificationsEnabled: true,
  whatsAppNotificationsEnabled: true
};

// Aliases matching Portal coordinator expectations
// Zeroed until real investor allocations, mining telemetry, and payout data
// are wired into the database — these were fake demo numbers shown regardless
// of actual account state. `spotBtcPriceUsd` is a market fact, kept as-is.
export const initialAdminKpis = {
  totalInvestors: 0,
  activeInvestors: 0,
  totalInvestmentUsd: 0,
  totalBtcAllocated: 0,
  totalBtcMined: 0,
  totalBtcPaidOut: 0,
  pendingPayoutBtc: 0,
  miningHashratePH: 0,
  minersOnline: 0,
  totalMiners: 0,
  miningUptimePercent: 0,
  monthlyRevenueUsd: 0,
  monthlyCostUsd: 0,
  netProfitUsd: 0,
  spotBtcPriceUsd: 64250,
  dailyBtcProduced: 0,
  activeFacilities: 0
};

export const initialMiningFacilities = [
  {
    id: 'FAC-01',
    facilityName: 'Muscat MCT-01 Substation Farm',
    code: 'MCT-01',
    location: 'Muscat Industrial Area, Rusayl, Oman',
    totalPowerMw: 18.5,
    utilizedPowerMw: 14.8,
    activeMiners: 875,
    totalCapacityMiners: 900,
    hashratePH: 310.5,
    averageEfficiencyJTH: 17.5,
    coolingType: 'Two-Phase Immersion Cooling',
    pueRatio: 1.03,
    ambientTempCelsius: 41,
    coolantTempCelsius: 34,
    powerProvider: 'Nama Electricity Distribution (Direct 33kV Line)',
    tariffRatePerKwh: 0.042,
    onlineStatus: 'Optimal' as const,
    uptimePercent: 99.4,
    establishedDate: 'Nov 2024'
  },
  {
    id: 'FAC-02',
    facilityName: 'Salalah SLL-02 Green Grid Hub',
    code: 'SLL-02',
    location: 'Salalah Free Zone, Dhofar, Oman',
    totalPowerMw: 8.0,
    utilizedPowerMw: 6.2,
    activeMiners: 310,
    totalCapacityMiners: 320,
    hashratePH: 114.5,
    averageEfficiencyJTH: 17.2,
    coolingType: 'Hydro-Enclosed Microchannel Cooling',
    pueRatio: 1.04,
    ambientTempCelsius: 28,
    coolantTempCelsius: 29,
    powerProvider: 'Dhofar Integrated Power Company (Wind + Gas)',
    tariffRatePerKwh: 0.040,
    onlineStatus: 'Optimal' as const,
    uptimePercent: 98.9,
    establishedDate: 'Aug 2025'
  }
];

export const initialAdminInvestors = mockAdminInvestors;
export const initialInvestmentPlans = mockInvestmentPlans;
export const initialInvestmentTransactions = mockInvestmentTransactions;
export const initialAsicMachines = mockAsicMachines;
export const initialMiningPools = mockMiningPools;
export const initialBtcProductionLedger = mockBtcProductionLedger;
export const initialInvestorAllocations = mockInvestorAllocations;

export const initialDailyCalculationRuns = [
  {
    id: 'RUN-2026-08-25',
    date: '25 Aug 2026',
    grossProductionBtc: 0.1425,
    electricityExpenseUsd: 2827,
    managementFeeUsd: 485,
    netDistributionBtc: 0.0985,
    investorsCount: 231,
    executedBy: 'Automated Daemon Engine',
    status: 'Settled' as const
  },
  {
    id: 'RUN-2026-08-24',
    date: '24 Aug 2026',
    grossProductionBtc: 0.1410,
    electricityExpenseUsd: 2810,
    managementFeeUsd: 480,
    netDistributionBtc: 0.0976,
    investorsCount: 231,
    executedBy: 'Automated Daemon Engine',
    status: 'Settled' as const
  }
];

export const initialCompanyWallets = mockCompanyWallets;
export const initialAdminPayouts = mockAdminPayouts;

export const initialAdminFinanceRecords = [
  {
    id: 'FIN-2026-08',
    month: 'August 2026 (MTD)',
    totalRevenueUsd: 185400,
    totalRevenueBtc: 2.885,
    miningRevenueUsd: 168200,
    managementFeesUsd: 12400,
    setupFeesUsd: 4800,
    totalExpensesUsd: 92300,
    electricityCostUsd: 64500,
    hostingCostUsd: 6200,
    maintenanceCostUsd: 4100,
    adminCostUsd: 17500,
    netProfitUsd: 93100,
    netProfitBtc: 1.449,
    profitMarginPercent: 50.2
  },
  {
    id: 'FIN-2026-07',
    month: 'July 2026',
    totalRevenueUsd: 192800,
    totalRevenueBtc: 3.010,
    miningRevenueUsd: 174500,
    managementFeesUsd: 13100,
    setupFeesUsd: 5200,
    totalExpensesUsd: 94100,
    electricityCostUsd: 66200,
    hostingCostUsd: 6200,
    maintenanceCostUsd: 4300,
    adminCostUsd: 17400,
    netProfitUsd: 98700,
    netProfitBtc: 1.542,
    profitMarginPercent: 51.2
  }
];

export const initialInvestorLiabilities = [
  {
    id: 'LIAB-01',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    capitalInvestedUsd: 50000,
    totalMinedToDateBtc: 0.3582,
    totalPaidOutBtc: 0.1341,
    accruedUnpaidBtc: 0.2241,
    nextPayoutDueDate: '26 Aug 2026 (Today)',
    collateralBackingStatus: '100% Backed in Cold Vault'
  },
  {
    id: 'LIAB-02',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    capitalInvestedUsd: 250000,
    totalMinedToDateBtc: 1.8450,
    totalPaidOutBtc: 0.7245,
    accruedUnpaidBtc: 1.1205,
    nextPayoutDueDate: '28 Aug 2026 (Scheduled)',
    collateralBackingStatus: '100% Backed in Cold Vault'
  },
  {
    id: 'LIAB-03',
    investorId: 'INV-00156',
    investorName: 'Fatima Al-Harthy',
    capitalInvestedUsd: 25000,
    totalMinedToDateBtc: 0.1780,
    totalPaidOutBtc: 0.0738,
    accruedUnpaidBtc: 0.1042,
    nextPayoutDueDate: '01 Sep 2026',
    collateralBackingStatus: '100% Backed in Cold Vault'
  }
];

export const initialKycSubmissions = [
  {
    id: 'KYC-882',
    investorId: 'INV-00201',
    investorName: 'Marcus Vance',
    country: 'Switzerland',
    documentType: 'Swiss Passport',
    documentNumber: 'X8829104',
    submittedDate: '25 Aug 2026',
    amlRiskScore: 'Low (Clean)',
    status: 'Submitted' as const,
    reviewedBy: 'Pending Compliance',
    reviewedAt: 'Pending',
    notes: 'Swiss national living in Geneva. Source of funds verified via UBS statement.'
  },
  {
    id: 'KYC-881',
    investorId: 'INV-00209',
    investorName: 'Ahmed Al-Shehhi',
    country: 'United Arab Emirates',
    documentType: 'Emirates ID & Passport',
    documentNumber: '784-1988-9182391',
    submittedDate: '24 Aug 2026',
    amlRiskScore: 'Low (Clean)',
    status: 'Under Review' as const,
    reviewedBy: 'Gaurav K. Sharma',
    reviewedAt: '25 Aug 2026',
    notes: 'High net worth allocation verification in progress.'
  }
];

export const initialAdminDocuments = [
  {
    id: 'DOC-01',
    title: 'Sovereign Mining Power Agreement (Muscat MCT-01)',
    documentType: 'PPA Grid Agreement',
    investorId: 'FM-CORP-ALL',
    investorName: 'FINOVATECK Institutional',
    fileSize: '4.2 MB',
    uploadedDate: '15 Jan 2025',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    signatureStatus: 'Fully Executed'
  },
  {
    id: 'DOC-02',
    title: 'Institutional Hashrate Contract (Sheikh Hamdan Al-Maktoum)',
    documentType: 'Investment Agreement',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    fileSize: '1.8 MB',
    uploadedDate: '01 Feb 2025',
    fileHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    signatureStatus: 'Cryptographically Signed'
  }
];

export const initialStatementBatches = [
  {
    id: 'STMT-AUG-01',
    month: 'August 2026',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    investmentAmountUsd: 50000,
    totalBtcMined: 0.0124,
    electricityCostUsd: 111.54,
    managementFeeUsd: 51.80,
    netPayoutUsd: 685.16,
    status: 'Generated' as const
  },
  {
    id: 'STMT-AUG-02',
    month: 'August 2026',
    investorId: 'INV-00088',
    investorName: 'Sheikh Hamdan Al-Maktoum',
    investmentAmountUsd: 250000,
    totalBtcMined: 0.0670,
    electricityCostUsd: 473.52,
    managementFeeUsd: 258.90,
    netPayoutUsd: 3831.23,
    status: 'Sent' as const
  }
];

export const initialSupportTickets = [
  {
    id: 'TKT-88402',
    investorId: 'INV-00124',
    investorName: 'Tariq Al-Said',
    subject: 'Requesting confirmation on August scheduled settlement',
    category: 'Withdrawals & Payouts',
    priority: 'High' as const,
    assignedTo: 'Sultan Al-Habsi (RM)',
    status: 'In Progress' as const,
    createdDate: '25 Aug 2026',
    messages: [
      {
        sender: 'Tariq Al-Said (Investor)',
        time: 'Yesterday 14:10 UTC',
        message: 'Could you please confirm if the 0.0024 BTC withdrawal requested this morning will be grouped into the 14:00 UTC batch?',
        isAdmin: false
      },
      {
        sender: 'Sultan Al-Habsi (Support Lead)',
        time: 'Today 07:30 UTC',
        message: 'Dear Tariq, yes indeed. The risk checks have passed and Finance has scheduled it for on-chain broadcast at 14:00 UTC. You will receive the TXID link immediately.',
        isAdmin: true
      }
    ],
    internalNotes: [
      'Verified with Layla in Finance. Payout approved in batch #882.'
    ]
  },
  {
    id: 'TKT-88405',
    investorId: 'INV-00201',
    investorName: 'Marcus Vance',
    subject: 'KYC Document verification status check',
    category: 'KYC & Onboarding',
    priority: 'Medium' as const,
    assignedTo: 'Layla Al-Balushi (Compliance)',
    status: 'Open' as const,
    createdDate: '25 Aug 2026',
    messages: [
      {
        sender: 'Marcus Vance (Investor)',
        time: 'Yesterday 09:20 UTC',
        message: 'Hello, I uploaded my Swiss passport and proof of residence yesterday. Can you let me know when my $100k allocation will start mining?',
        isAdmin: false
      }
    ],
    internalNotes: [
      'Documents are high quality. Final AML screening pending.'
    ]
  }
];

export const initialAdminNotifications = [
  {
    id: 'NOTIF-01',
    title: 'Muscat MCT-01 Substation Maintenance Notice',
    message: 'Scheduled 15-minute diagnostic firmware update on immersion cooling racks completed with 0 miner downtime.',
    recipientGroup: 'All Investors' as const,
    sentDate: '25 Aug 2026, 12:00 UTC',
    sentBy: 'Mining Operations',
    type: 'Operational Notice' as const,
    status: 'Delivered' as const
  },
  {
    id: 'NOTIF-02',
    title: 'August 2026 Mining Yield Settlement Dispatched',
    message: 'All daily BTC mining allocations for August 25 have been credited to investor ledgers.',
    recipientGroup: 'All Investors' as const,
    sentDate: '25 Aug 2026, 00:05 UTC',
    sentBy: 'Finance Department',
    type: 'Payout Notification' as const,
    status: 'Delivered' as const
  }
];

export const initialAdminReports = [
  {
    id: 'RPT-01',
    title: 'Monthly Institutional P&L & Mining Yield Audit',
    category: 'Financial',
    period: 'August 2026 MTD',
    formats: ['PDF', 'Excel', 'CSV'],
    generatedDate: '26 Aug 2026',
    description: 'Comprehensive gross BTC mined, electricity tariff deductions, and net investor cash distributions.'
  },
  {
    id: 'RPT-02',
    title: '425 PH/s ASIC Hashrate & Thermal Diagnostic Log',
    category: 'Mining Operations',
    period: 'Last 30 Days',
    formats: ['CSV', 'JSON', 'PDF'],
    generatedDate: '26 Aug 2026',
    description: 'Chip temperatures, immersion PUE, rejection rates, and uptime records for 1,220 Antminer S21 Pro units.'
  },
  {
    id: 'RPT-03',
    title: 'Capital Reserves & 100% Solvency Certificate',
    category: 'Tax & Audit',
    period: 'Q3 2026',
    formats: ['PDF'],
    generatedDate: '25 Aug 2026',
    description: 'Third-party auditor signed solvency statement verifying cold vault balances against investor liabilities.'
  }
];

export const initialAdminAuditLogs = [
  {
    id: 'AUD-9941',
    timestamp: '26 Aug 2026, 08:14 UTC',
    adminId: 'ADM-001',
    adminName: 'Gaurav K. Sharma',
    adminRole: 'Super Admin',
    action: 'Logged in to Admin Gateway',
    module: 'Authentication & Session',
    targetId: 'ADM-001',
    details: 'Hardware security key YubiKey 5 NFC verified with 2FA.',
    ipAddress: '185.193.88.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0'
  },
  {
    id: 'AUD-9940',
    timestamp: '26 Aug 2026, 07:45 UTC',
    adminId: 'ADM-002',
    adminName: 'Layla Al-Balushi',
    adminRole: 'Finance Admin',
    action: 'Payout Approved',
    module: 'Treasury & Payouts',
    targetId: 'PO-10480',
    details: '0.0150 BTC payout approved for Sheikh Hamdan Al-Maktoum',
    oldValue: 'Pending Approval',
    newValue: 'Approved for Batch',
    ipAddress: '185.193.88.19',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0'
  },
  {
    id: 'AUD-9939',
    timestamp: '25 Aug 2026, 22:10 UTC',
    adminId: 'SYSTEM',
    adminName: 'System Engine',
    adminRole: 'Mining Operations',
    action: 'Balance Adjusted',
    module: 'Calculation Engine',
    targetId: 'LEDGER-2026-08-25',
    details: 'Auto-distributed 0.0685 BTC to 231 active investor wallets.',
    ipAddress: '10.240.0.1',
    userAgent: 'FINOVATECK-Engine-Worker/2.4'
  }
];

export const initialAdminUsers = [
  mockAdminUser,
  {
    id: 'ADM-002',
    name: 'Layla Al-Balushi',
    username: 'LaylaFinance',
    email: 'layla.balushi@finovateck.om',
    role: 'Finance Admin' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    twoFactorEnabled: true,
    lastLogin: '26 Aug 2026, 07:45 UTC',
    ipAddress: '185.193.88.19 (Muscat, Oman)',
    status: 'Active' as const
  },
  {
    id: 'ADM-003',
    name: 'Sultan Al-Habsi',
    username: 'SultanOps',
    email: 'sultan.habsi@finovateck.om',
    role: 'Mining Operations' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    twoFactorEnabled: true,
    lastLogin: '25 Aug 2026, 18:20 UTC',
    ipAddress: '185.193.88.25 (Salalah, Oman)',
    status: 'Active' as const
  },
  {
    id: 'ADM-004',
    name: 'Tariq Al-Busaidi',
    username: 'TariqAuditor',
    email: 'tariq.busaidi@pwc-oman.com',
    role: 'Auditor / Read Only' as const,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    twoFactorEnabled: true,
    lastLogin: '24 Aug 2026, 11:10 UTC',
    ipAddress: '185.193.88.90 (Muscat, Oman)',
    status: 'Active' as const
  }
];

export const initialSystemSettings = {
  electricityTariffPerKwh: 0.042,
  defaultManagementFeePercent: 6.5,
  maintenanceReservePercent: 2.0,
  defaultPool: 'Foundry USA Pool',
  failoverPool: 'AntPool Hydro VIP',
  minPayoutBtc: 0.0005,
  payoutSchedule: 'Daily Batch (14:00 UTC)',
  multiSigThreshold: '2 of 3 Signatures',
  maintenanceMode: false,
  autoCalculateDaily: true
};

