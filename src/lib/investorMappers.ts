import { ApiInvestorProfile, ApiPayout, ApiWalletTransaction } from './api';
import { InvestorOverviewMetrics, InvestorUser, PayoutRecord, WalletTransaction } from '../types';

export function profileToUser(p: ApiInvestorProfile): InvestorUser {
  return {
    id: p.userId,
    username: p.username,
    name: p.name,
    email: p.email || 'Not provided',
    phone: p.phone || 'Not provided',
    country: p.country || 'Not provided',
    kycStatus: p.kycStatus,
    accountStatus: p.accountStatus,
    plan: p.plan || 'No active investment plan',
    agreementNumber: p.agreementNumber || 'Not yet assigned',
    startDate: p.startDate || 'Not yet assigned',
    maturityDate: p.maturityDate || 'Not yet assigned',
    referralCode: p.referralCode || `FINO-${p.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`,
    referrerName: p.referrerName || 'N/A',
    payoutBtcAddress: p.payoutBtcAddress || 'Not set',
    payoutNetwork: p.payoutNetwork || 'TRC20',
    bankName: p.bankName || 'Not set',
    bankAccountHolder: p.bankAccountHolder || 'Not set',
    bankAccountNumber: p.bankAccountNumber || 'Not set',
    bankIban: p.bankIban || 'Not set',
    bankSwift: p.bankSwift || 'Not set'
  };
}

export function profileToMetrics(p: ApiInvestorProfile, btcPriceUsd: number, networkDifficultyT: number): InvestorOverviewMetrics {
  const totalPayoutsBtc = 0; // computed from transactions by the caller when needed
  return {
    totalInvestmentUsd: p.totalInvestmentUsd,
    currentPortfolioValueUsd: p.currentPortfolioValueUsd,
    totalBtcAllocated: p.totalBtcAllocated,
    btcMined: p.btcMined,
    btcPendingAccrued: p.btcPendingAccrued,
    totalReturnsUsd: p.currentPortfolioValueUsd - p.totalInvestmentUsd,
    roiPercent: p.totalInvestmentUsd > 0
      ? Number((((p.currentPortfolioValueUsd - p.totalInvestmentUsd) / p.totalInvestmentUsd) * 100).toFixed(1))
      : 0,
    totalPayoutsUsd: 0, // filled in from transactions by the caller
    totalPayoutsBtc,
    nextExpectedPayoutBtc: p.btcPendingAccrued,
    nextExpectedPayoutDate: p.totalBtcAllocated > 0 ? 'Next scheduled cycle' : 'N/A',
    investmentStartDate: p.startDate || 'N/A',
    contractEndDate: p.maturityDate || 'N/A',
    currentBtcPriceUsd: btcPriceUsd,
    networkDifficulty: networkDifficultyT > 0 ? `${networkDifficultyT} T` : 'N/A',
    miningRevenuePerDayUsd: 0, // filled in from today's Mining Credit transactions by the caller
    miningRevenuePerDayBtc: 0, // filled in from today's Mining Credit transactions by the caller
    yourMiningSharePercent: p.miningSharePercent
  };
}

export function transactionToWallet(t: ApiWalletTransaction): WalletTransaction {
  const type: WalletTransaction['type'] =
    t.type === 'Mining Credit' || t.type === 'Payout' || t.type === 'Deposit' || t.type === 'Referral Commission'
      ? t.type
      : 'Deposit';
  return {
    id: t.id,
    date: t.createdAt,
    type,
    amountBtc: t.amountBtc,
    amountUsd: t.amountUsd,
    status: t.status === 'Completed' || t.status === 'Pending' || t.status === 'Processing' ? t.status : 'Completed',
    txid: '',
    explorerUrl: '',
    destination: undefined,
    network: t.network || ''
  };
}

function mapPayoutStatus(status: ApiPayout['status']): PayoutRecord['status'] {
  switch (status) {
    case 'Completed':
      return 'Successful';
    case 'Rejected':
      return 'Failed';
    case 'Processing':
      return 'Processing';
    default:
      return 'Pending';
  }
}

export function payoutToRecord(p: ApiPayout, btcPriceUsd: number): PayoutRecord {
  return {
    id: p.id,
    payoutId: p.id.slice(0, 8).toUpperCase(),
    date: p.requestedAt,
    amountBtc: p.amountBtc,
    amountUsd: p.amountBtc * btcPriceUsd,
    currency: 'BTC',
    destinationWallet: p.destinationWallet,
    network: p.network || '',
    txid: '',
    explorerUrl: '',
    status: mapPayoutStatus(p.status),
    // Not real on-chain confirmations — this app doesn't broadcast actual
    // Bitcoin transactions, so there's nothing honest to report here.
    confirmations: 0
  };
}
