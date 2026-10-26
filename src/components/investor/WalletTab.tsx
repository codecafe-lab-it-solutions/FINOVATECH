import { PlanConditions } from './PlanConditions';
import { todayInTimezone } from '../../lib/dates';
import { Money } from '../../lib/currency';
import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Coins,
  Send,
  X,
  RefreshCw,
  ArrowDownToLine,
  Upload
} from 'lucide-react';
import { WalletTransaction, InvestorOverviewMetrics, InvestorUser } from '../../types';
import { ApiDepositRequest, ApiWithdrawalSettings } from '../../lib/api';

interface WalletTabProps {
  reservedPayoutUsd?: number;
  reservedPayoutBtc: number;
  transactions: WalletTransaction[];
  metrics: InvestorOverviewMetrics;
  user: InvestorUser;
  depositRequests: ApiDepositRequest[];
  withdrawalSettings: ApiWithdrawalSettings | null;
  onRequestPayoutOtp: () => Promise<{ ok: true; message: string }>;
  onRequestPayout: (amountUsd: number, destinationWallet: string, otp: string, network: string) => Promise<void>;
  onFetchDepositAddress: () => Promise<{ address: string; network: string }>;
  onSubmitDeposit: (amountUsd: number, proofFile: File) => Promise<{ referenceNumber: string }>;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  reservedPayoutUsd = 0,
  reservedPayoutBtc,
  transactions,
  metrics,
  user,
  depositRequests,
  withdrawalSettings,
  onRequestPayoutOtp,
  onRequestPayout,
  onFetchDepositAddress,
  onSubmitDeposit
}) => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<1 | 2 | 3>(1);
  const [withdrawAmount, setWithdrawAmount] = useState('50');
  const [destinationAddress, setDestinationAddress] = useState(user.bankIban === 'Not set' ? '' : user.bankIban);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositStep, setDepositStep] = useState<1 | 2 | 3>(1);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAddressInfo, setDepositAddressInfo] = useState<{ address: string; network: string } | null>(null);
  const [depositProofFile, setDepositProofFile] = useState<File | null>(null);
  const [depositReference, setDepositReference] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [copiedDepositAddress, setCopiedDepositAddress] = useState(false);

  const availableBtc = Math.max(0, metrics.totalBtcAllocated - reservedPayoutBtc);
  const availableUsd = Math.max(0, (metrics.usdWalletBalance || 0) - reservedPayoutUsd);
  const maximumUsd = Math.min(withdrawalSettings?.maxWithdrawalUsd ?? Infinity, Math.max(0, Math.floor((availableUsd - Math.round(metrics.totalInvestmentUsd * (user.planTerms?.dailyReturnPercent ?? 0) * 30) / 100) * 100 + 0.000001) / 100));
  const pendingBtc = metrics.btcPendingAccrued;
  const totalEarnedBtc = metrics.btcMined;
  const totalWithdrawnBtc = metrics.totalPayoutsBtc;
  const btcPriceUsd = metrics.currentBtcPriceUsd;


  const todayIso = todayInTimezone(user.platformTimezone);
  const isDateLocked = !!user.nextWithdrawalDate && todayIso < user.nextWithdrawalDate;
  const globallyDisabled = withdrawalSettings?.withdrawalsEnabled === false;
  const withdrawalsBlocked = globallyDisabled || isDateLocked || !user.joiningDate || !user.planTerms || user.kycStatus !== 'Verified' || user.accountStatus !== 'Active';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleStartWithdraw = () => {
    setWithdrawStep(1);
    setDestinationAddress(user.bankIban === 'Not set' ? '' : user.bankIban);
    setOtpCode('');
    setOtpMessage('');
    setWithdrawError(null);
    setShowWithdrawModal(true);
  };

  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    const requested = Number(withdrawAmount);
    if (withdrawalsBlocked || !Number.isFinite(requested) || requested <= 0 || requested > maximumUsd) { setWithdrawError('Amount exceeds your eligible USD balance after the required threshold and transaction limit, or withdrawal is not yet eligible.'); return; }
    setIsProcessing(true);
    try {
      const { message } = await onRequestPayoutOtp();
      setOtpMessage(message);
      setWithdrawStep(2);
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : 'Could not send confirmation code.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOtp = async () => {
    setIsProcessing(true);
    setWithdrawError(null);
    try {
      await onRequestPayout(parseFloat(withdrawAmount), destinationAddress, otpCode.trim(), 'USD bank/payment');
      setWithdrawStep(3);
      setWithdrawSuccess(`Payout request for USD ${withdrawAmount} submitted and is awaiting admin approval.`);
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : 'Could not submit payout request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartDeposit = async () => {
    setDepositStep(1);
    setDepositAmount('');
    setDepositProofFile(null);
    setDepositReference('');
    setDepositError(null);
    setShowDepositModal(true);
    try {
      const address = await onFetchDepositAddress();
      setDepositAddressInfo(address);
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : 'Could not load deposit address.');
    }
  };

  const handleDepositStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    if (!parseFloat(depositAmount) || parseFloat(depositAmount) <= 0) {
      setDepositError('Enter a valid deposit amount.');
      return;
    }
    setDepositStep(2);
  };

  const handleSubmitDeposit = async () => {
    if (!depositProofFile) {
      setDepositError('Attach a screenshot of your payment.');
      return;
    }
    setIsDepositing(true);
    setDepositError(null);
    try {
      const { referenceNumber } = await onSubmitDeposit(parseFloat(depositAmount), depositProofFile);
      setDepositReference(referenceNumber);
      setDepositStep(3);
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : 'Could not submit deposit request.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCopyDepositAddress = () => {
    if (!depositAddressInfo) return;
    navigator.clipboard.writeText(depositAddressInfo.address);
    setCopiedDepositAddress(true);
    setTimeout(() => setCopiedDepositAddress(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PlanConditions user={user} investmentUsd={metrics.totalInvestmentUsd} walletUsd={availableUsd} />
      <div className="p-5 rounded-2xl bg-ink-850 border border-emerald-800 text-white"><h3 className="text-sm font-bold">USD Earnings Wallet</h3><p className="text-2xl font-bold mt-2"><Money usd={availableUsd} /></p><p className="text-xs text-fg-muted mt-2">Daily interest is credited in dollars without BTC conversion. Reserved USD payouts: <Money usd={reservedPayoutUsd} />. Maximum eligible withdrawal: <Money usd={maximumUsd} />.</p></div>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-line-warm text-xs font-mono text-gold-500">
            <Wallet className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL BITCOIN VAULT (MCT-01)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investor Wallet & Treasury Management
          </h2>
          <p className="text-xs text-fg-muted font-mono mt-0.5">
            Your dollar earnings, existing BTC holdings and transaction ledger, with admin-reviewed USD withdrawal requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartDeposit}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>
          <button
            onClick={handleStartWithdraw}
            disabled={withdrawalsBlocked}
            title={
              globallyDisabled
                ? 'Withdrawals are currently disabled by the administrator.'
                : isDateLocked
                ? `Your withdrawals are locked until ${user.nextWithdrawalDate}.`
                : undefined
            }
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request USD Withdrawal</span>
          </button>
        </div>
      </div>

      {globallyDisabled && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Withdrawals are currently disabled by the administrator.</span>
        </div>
      )}

      {isDateLocked && (
        <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-100 text-xs font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Your withdrawals are locked until <strong>{user.nextWithdrawalDate}</strong>. You can request a withdrawal again after that date.</span>
        </div>
      )}

      {withdrawSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{withdrawSuccess}</span>
          </div>
          <button onClick={() => setWithdrawSuccess(null)} className="text-fg-muted hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5-Column Balances Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs font-mono">
        
        {/* Available BTC */}
        <div className="p-4 rounded-2xl bg-ink-850/90 border border-gold-500/40 text-white relative shadow-lg shadow-gold-500/5">
          <div className="text-[10px] text-gold-500 font-bold uppercase flex items-center justify-between">
            <span>Available Balance</span>
            <Coins className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {availableBtc} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-0.5">
            ≈ <Money usd={(availableBtc * btcPriceUsd)} />
          </div>
        </div>

        {/* Pending BTC */}
        <div className="p-4 rounded-2xl bg-ink-850/90 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase flex items-center justify-between">
            <span>Pending / Accrued</span>
            <Clock className="w-4 h-4 text-gold-200" />
          </div>
          <div className="text-xl font-bold text-gold-200 mt-1 font-mono">
            {pendingBtc} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-0.5">
            ≈ <Money usd={(pendingBtc * btcPriceUsd)} />
          </div>
        </div>

        {/* Total Earned BTC */}
        <div className="p-4 rounded-2xl bg-ink-850/90 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase flex items-center justify-between">
            <span>Total BTC Earned</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {totalEarnedBtc} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-0.5">
            ≈ <Money usd={(totalEarnedBtc * btcPriceUsd)} />
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="p-4 rounded-2xl bg-ink-850/90 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase flex items-center justify-between">
            <span>Total Withdrawn</span>
            <ArrowUpRight className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {totalWithdrawnBtc} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-0.5">
            ≈ <Money usd={(totalWithdrawnBtc * btcPriceUsd)} />
          </div>
        </div>

        {/* Current BTC Rate */}
        <div className="p-4 rounded-2xl bg-ink-850/90 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase flex items-center justify-between">
            <span>Current Benchmark</span>
            <RefreshCw className="w-4 h-4 text-fg-muted" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            <Money usd={btcPriceUsd} />
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-0.5">
            Spot Price
          </div>
        </div>

      </div>

      {/* Wallet Activity / Transaction Table */}
      <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-bold uppercase tracking-wider font-mono">
              On-Chain Activity & Wallet Ledger
            </span>
          </div>
          <span className="text-xs text-fg-muted font-mono">
            {transactions.length} entr{transactions.length === 1 ? 'y' : 'ies'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-line text-fg-muted uppercase text-[10px]">
                <th className="pb-3 px-3">Date / Time (UTC)</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Amount (BTC)</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Network</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Blockchain TXID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-ink-800/40 transition-colors">
                  <td className="py-3 px-3 text-fg-body whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'Mining Credit'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : tx.type === 'Payout'
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                        : 'bg-gold-500/10 text-gold-200 border border-gold-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-3 px-3 font-bold whitespace-nowrap ${
                    tx.amountBtc >= 0 ? 'text-emerald-400' : 'text-gold-400'
                  }`}>
                    {tx.amountBtc >= 0 ? `+${tx.amountBtc}` : `${tx.amountBtc}`} BTC
                  </td>
                  <td className="py-3 px-3 text-fg-body whitespace-nowrap">
                    {tx.amountUsd >= 0 ? '+' : ''}<Money usd={tx.amountUsd} />
                  </td>
                  <td className="py-3 px-3 text-fg-muted whitespace-nowrap">
                    {tx.network || '—'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`flex items-center gap-1 font-semibold ${
                      tx.status === 'Completed' ? 'text-emerald-400' : 'text-gold-200'
                    }`}>
                      {tx.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-spin" />}
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {tx.txid ? (
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          title={tx.txid}
                        >
                          <span>{tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleCopy(tx.txid, tx.id)}
                          className="text-fg-muted hover:text-white cursor-pointer"
                          title="Copy TXID"
                        >
                          {copiedTx === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-fg-muted font-mono text-[11px]">Internal ledger entry</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Request History */}
      {depositRequests.length > 0 && (
        <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold uppercase tracking-wider font-mono">
              Deposit Requests
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-line text-fg-muted uppercase text-[10px]">
                  <th className="pb-3 px-3">Reference</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Network</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {depositRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-ink-800/40">
                    <td className="py-3 px-3 text-gold-500 font-bold whitespace-nowrap">{r.referenceNumber}</td>
                    <td className="py-3 px-3 text-white whitespace-nowrap"><Money usd={r.amountUsd} /></td>
                    <td className="py-3 px-3 text-fg-muted whitespace-nowrap">{r.network}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                        r.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-gold-500/20 text-gold-100'
                      }`}>{r.status}</span>
                    </td>
                    <td className="py-3 px-3 text-fg-muted whitespace-nowrap">{r.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multi-Step Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-ink-850 border border-line text-white shadow-2xl space-y-5 animate-in zoom-in-95">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm uppercase tracking-wider font-mono">
                  Deposit USDT
                </span>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-white hover:bg-ink-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded-lg ${depositStep === 1 ? 'bg-emerald-600 text-white font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                1. Amount & Address
              </div>
              <div className={`p-2 rounded-lg ${depositStep === 2 ? 'bg-emerald-600 text-white font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                2. Attach Proof
              </div>
              <div className={`p-2 rounded-lg ${depositStep === 3 ? 'bg-emerald-600 text-white font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                3. Submitted
              </div>
            </div>

            {depositError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{depositError}</span>
              </div>
            )}

            {/* Step 1: Amount + Address */}
            {depositStep === 1 && (
              <form onSubmit={handleDepositStep1Next} className="space-y-4 text-xs font-mono">
                {depositAddressInfo ? (
                  <div className="p-4 rounded-xl bg-ink-950 border border-line-warm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-fg-muted">Send USDT to:</span>
                      <span className="text-emerald-400 font-bold">{depositAddressInfo.network} Network</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-ink-850 border border-line">
                      <span className="text-gold-200 select-all break-all">{depositAddressInfo.address}</span>
                      <button type="button" onClick={handleCopyDepositAddress} className="text-fg-muted hover:text-white cursor-pointer shrink-0">
                        {copiedDepositAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-ink-950 border border-line-warm text-fg-muted text-center">
                    Loading deposit address...
                  </div>
                )}

                <div>
                  <label className="block text-fg-muted mb-1">Amount You're Depositing (USD):</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2.5 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-100 text-[11px]">
                  Send this amount to the address above from your own wallet first, then continue to attach proof of payment.
                </div>

                <button
                  type="submit"
                  disabled={!depositAddressInfo}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  I've Sent The Payment →
                </button>
              </form>
            )}

            {/* Step 2: Attach Proof */}
            {depositStep === 2 && (
              <div className="space-y-4 text-xs font-mono">
                <p className="text-fg-body">
                  Attach a screenshot of your payment confirmation for <strong className="text-white"><Money usd={Number(depositAmount)} /></strong>.
                </p>

                <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-ink-950 border-2 border-dashed border-line-warm hover:border-emerald-500 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-fg-muted" />
                  <span className="text-fg-muted text-center">
                    {depositProofFile ? depositProofFile.name : 'Click to select a screenshot (PNG, JPG, or WEBP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => setDepositProofFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositStep(1)}
                    className="py-2.5 px-4 rounded-xl bg-ink-800 hover:bg-ink-700 text-fg-body cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isDepositing || !depositProofFile}
                    onClick={handleSubmitDeposit}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDepositing ? 'Submitting...' : 'Submit Deposit Request'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {depositStep === 3 && (
              <div className="text-center space-y-3 py-2 text-xs font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Deposit Request Submitted</h4>
                <p className="text-fg-body">
                  Your reference number is <strong className="text-emerald-400">{depositReference}</strong>. It's now awaiting admin review — you'll see it credited to your account once approved.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer mt-2"
                >
                  Return to Wallet
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Multi-Step Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-ink-850 border border-line text-white shadow-2xl space-y-5 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-gold-500" />
                <span className="font-bold text-sm uppercase tracking-wider font-mono">
                  USD Withdrawal Request
                </span>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-white hover:bg-ink-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded-lg ${withdrawStep === 1 ? 'bg-gold-500 text-black font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                1. Amount & Address
              </div>
              <div className={`p-2 rounded-lg ${withdrawStep === 2 ? 'bg-gold-500 text-black font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                2. Confirm
              </div>
              <div className={`p-2 rounded-lg ${withdrawStep === 3 ? 'bg-emerald-500 text-white font-bold' : 'bg-ink-800 text-fg-muted'}`}>
                3. Submitted
              </div>
            </div>

            {withdrawError && (
              <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            {/* Step 1: Form */}
            {withdrawStep === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-4 text-xs font-mono">
                  <PlanConditions user={user} investmentUsd={metrics.totalInvestmentUsd} walletUsd={availableUsd} />
                <div>
                  <div className="flex justify-between text-fg-muted mb-1">
                    <span>Withdrawal Amount (USD):</span>
                    <span>Max: USD {maximumUsd.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={maximumUsd}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-gold-500"
                  />
                  <div className="text-[11px] text-fg-muted mt-1">
                    Display equivalent: <Money usd={parseFloat(withdrawAmount || '0')} />
                  </div>
                  {withdrawalSettings && (
                    <div className="text-[11px] text-gold-200/90 mt-1">
                      Limit: <Money usd={withdrawalSettings.maxWithdrawalUsd} /> per transaction
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-fg-muted mb-1">
                    <span>USD Payment Destination (bank/account details):</span>
                    <span className="text-gold-500 font-bold">USD bank/payment</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-gold-500"
                  />
                  <div className="text-[11px] text-fg-muted mt-1">
                    An administrator reviews these bank/account details before processing your USD payment.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-100 text-[11px]">
                  Withdrawal requests are reviewed and approved by an administrator before funds move.
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Sending Confirmation Code...' : 'Review & Confirm →'}
                </button>
              </form>
            )}

            {/* Step 2: Confirm */}
            {withdrawStep === 2 && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-ink-950 border border-line-warm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Amount:</span>
                    <span className="text-white font-bold">USD {withdrawAmount}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-fg-muted shrink-0">Destination:</span>
                    <span className="text-gold-100/90 break-all text-right">{destinationAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Network:</span>
                    <span className="text-white font-bold">USD bank/payment</span>
                  </div>
                </div>

                {otpMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    {otpMessage}
                  </div>
                )}

                <div>
                  <label className="block text-fg-muted mb-1">Confirmation Code:</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full px-3 py-2.5 rounded-xl bg-ink-950 border border-line-warm text-white text-center tracking-[0.3em] focus:outline-hidden focus:border-gold-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={isProcessing || !otpCode.trim()}
                  onClick={handleConfirmOtp}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Submitting Payout Request...' : 'Confirm & Submit Request'}
                </button>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {withdrawStep === 3 && (
              <div className="text-center space-y-3 py-2 text-xs font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Payout Request Submitted</h4>
                <p className="text-fg-body">
                  Your request to withdraw <strong className="text-white">USD {withdrawAmount}</strong> has been recorded and is now awaiting admin review and approval. You'll see it under Payout Records once processed.
                </p>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs cursor-pointer mt-2"
                >
                  Return to Wallet
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
