import { InvestorUser, InvestorOverviewMetrics } from '../types';
import { AuthUser } from '../lib/api';

// A freshly self-registered investor has no onboarding/plan data yet —
// that gets filled in by an admin. This renders the portal in a neutral
// "awaiting setup" state instead of crashing or showing demo data.
export function buildEmptyInvestorProfile(authUser: AuthUser): InvestorUser {
  return {
    id: authUser.id,
    username: authUser.username,
    name: authUser.name,
    email: '',
    phone: '',
    country: '',
    kycStatus: 'Pending',
    accountStatus: 'Under Review',
    plan: 'Not yet assigned',
    agreementNumber: '—',
    startDate: '—',
    maturityDate: '—',
    referralCode: '—',
    referrerName: '—',
    payoutBtcAddress: '',
    bankName: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankIban: '',
    bankSwift: ''
  };
}

export function buildEmptyOverviewMetrics(): InvestorOverviewMetrics {
  return {
    totalInvestmentUsd: 0,
    currentPortfolioValueUsd: 0,
    totalBtcAllocated: 0,
    btcMined: 0,
    btcPendingAccrued: 0,
    totalReturnsUsd: 0,
    roiPercent: 0,
    totalPayoutsUsd: 0,
    totalPayoutsBtc: 0,
    nextExpectedPayoutBtc: 0,
    nextExpectedPayoutDate: '—',
    investmentStartDate: '—',
    contractEndDate: '—',
    currentBtcPriceUsd: 0,
    networkDifficulty: '—',
    miningRevenuePerDayUsd: 0,
    miningRevenuePerDayBtc: 0,
    yourMiningSharePercent: 0
  };
}
