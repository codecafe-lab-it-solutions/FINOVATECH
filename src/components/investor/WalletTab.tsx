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
  RefreshCw
} from 'lucide-react';
import { WalletTransaction, InvestorOverviewMetrics, InvestorUser } from '../../types';

interface WalletTabProps {
  transactions: WalletTransaction[];
  metrics: InvestorOverviewMetrics;
  user: InvestorUser;
  onRequestPayout: (amountBtc: number, destinationWallet: string) => Promise<void>;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  transactions,
  metrics,
  user,
  onRequestPayout
}) => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<1 | 2 | 3>(1);
  const [withdrawAmount, setWithdrawAmount] = useState('0.005');
  const [destinationAddress, setDestinationAddress] = useState(user.payoutBtcAddress);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const availableBtc = metrics.totalBtcAllocated;
  const pendingBtc = metrics.btcPendingAccrued;
  const totalEarnedBtc = metrics.btcMined;
  const totalWithdrawnBtc = metrics.totalPayoutsBtc;
  const btcPriceUsd = metrics.currentBtcPriceUsd;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleStartWithdraw = () => {
    setWithdrawStep(1);
    setDestinationAddress(user.payoutBtcAddress);
    setShowWithdrawModal(true);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStep(2);
  };

  const handleConfirmOtp = async () => {
    setIsProcessing(true);
    setWithdrawError(null);
    try {
      await onRequestPayout(parseFloat(withdrawAmount), destinationAddress);
      setWithdrawStep(3);
      setWithdrawSuccess(`Payout request for ${withdrawAmount} BTC submitted and is awaiting admin approval.`);
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : 'Could not submit payout request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <Wallet className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL BITCOIN VAULT (MCT-01)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investor Wallet & Treasury Management
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Your real BTC balance and transaction ledger, with admin-reviewed withdrawal requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartWithdraw}
            className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request BTC Withdrawal</span>
          </button>
        </div>
      </div>

      {withdrawSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{withdrawSuccess}</span>
          </div>
          <button onClick={() => setWithdrawSuccess(null)} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5-Column Balances Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs font-mono">
        
        {/* Available BTC */}
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-[#F7931A]/40 text-white relative shadow-lg shadow-[#F7931A]/5">
          <div className="text-[10px] text-[#F7931A] font-bold uppercase flex items-center justify-between">
            <span>Available Balance</span>
            <Coins className="w-4 h-4 text-[#F7931A]" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {availableBtc} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
            ≈ ${(availableBtc * btcPriceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
          </div>
        </div>

        {/* Pending BTC */}
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
            <span>Pending / Accrued</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
            {pendingBtc} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
            ≈ ${(pendingBtc * btcPriceUsd).toFixed(2)} USDT
          </div>
        </div>

        {/* Total Earned BTC */}
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
            <span>Total BTC Earned</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {totalEarnedBtc} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
            ≈ ${(totalEarnedBtc * btcPriceUsd).toFixed(2)} USDT
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
            <span>Total Withdrawn</span>
            <ArrowUpRight className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">
            {totalWithdrawnBtc} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
            ≈ ${(totalWithdrawnBtc * btcPriceUsd).toFixed(2)} USDT
          </div>
        </div>

        {/* Current BTC Rate */}
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
            <span>Current Benchmark</span>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            ${btcPriceUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
            Spot Price (USDT)
          </div>
        </div>

      </div>

      {/* Wallet Activity / Transaction Table */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#F7931A]" />
            <span className="text-sm font-bold uppercase tracking-wider font-mono">
              On-Chain Activity & Wallet Ledger
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {transactions.length} entr{transactions.length === 1 ? 'y' : 'ies'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Date / Time (UTC)</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Amount (BTC)</th>
                <th className="pb-3 px-3">Amount (USDT)</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Blockchain TXID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'Mining Credit'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : tx.type === 'Payout'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-3 px-3 font-bold whitespace-nowrap ${
                    tx.amountBtc >= 0 ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {tx.amountBtc >= 0 ? `+${tx.amountBtc}` : `${tx.amountBtc}`} BTC
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                    {tx.amountUsd >= 0 ? `+$${tx.amountUsd.toFixed(2)}` : `-$${Math.abs(tx.amountUsd).toFixed(2)}`}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`flex items-center gap-1 font-semibold ${
                      tx.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
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
                          className="text-[#F7931A] hover:underline flex items-center gap-1 font-mono text-[11px]"
                          title={tx.txid}
                        >
                          <span>{tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleCopy(tx.txid, tx.id)}
                          className="text-gray-500 hover:text-white cursor-pointer"
                          title="Copy TXID"
                        >
                          {copiedTx === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600 font-mono text-[11px]">Internal ledger entry</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Step Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-2xl space-y-5 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#F7931A]" />
                <span className="font-bold text-sm uppercase tracking-wider font-mono">
                  Bitcoin Withdrawal Protocol
                </span>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded-lg ${withdrawStep === 1 ? 'bg-[#F7931A] text-gray-950 font-bold' : 'bg-gray-800 text-gray-400'}`}>
                1. Amount & Address
              </div>
              <div className={`p-2 rounded-lg ${withdrawStep === 2 ? 'bg-[#F7931A] text-gray-950 font-bold' : 'bg-gray-800 text-gray-400'}`}>
                2. Confirm
              </div>
              <div className={`p-2 rounded-lg ${withdrawStep === 3 ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-800 text-gray-400'}`}>
                3. Submitted
              </div>
            </div>

            {/* Step 1: Form */}
            {withdrawStep === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Withdrawal Amount (BTC):</span>
                    <span>Max: {availableBtc} BTC</span>
                  </div>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.001"
                    max={availableBtc}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                  <div className="text-[11px] text-gray-400 mt-1">
                    ≈ ${(parseFloat(withdrawAmount || '0') * btcPriceUsd).toFixed(2)} USDT
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Destination USDT Address:</label>
                  <input
                    type="text"
                    required
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  Withdrawal requests are reviewed and approved by an administrator before funds move.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs cursor-pointer"
                >
                  Review & Confirm →
                </button>
              </form>
            )}

            {/* Step 2: Confirm */}
            {withdrawStep === 2 && (
              <div className="space-y-4 text-xs font-mono">
                <p className="text-gray-300">
                  Confirm your payout request before it's submitted for admin review.
                </p>

                <div className="p-4 rounded-xl bg-gray-950 border border-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-bold">{withdrawAmount} BTC</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400 shrink-0">Destination:</span>
                    <span className="text-amber-200/90 break-all text-right">{destinationAddress}</span>
                  </div>
                </div>

                {withdrawError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmOtp}
                  className="w-full py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
                <p className="text-gray-300">
                  Your request to withdraw <strong className="text-white">{withdrawAmount} BTC</strong> has been recorded and is now awaiting admin review and approval. You'll see it under Payout Records once processed.
                </p>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#F7931A] text-gray-950 font-bold text-xs cursor-pointer mt-2"
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
