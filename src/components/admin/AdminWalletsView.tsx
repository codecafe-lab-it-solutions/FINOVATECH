import React, { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Zap,
  DollarSign,
  AlertTriangle,
  Send
} from 'lucide-react';
import { CompanyWalletItem } from '../../types';

interface AdminWalletsViewProps {
  wallets: CompanyWalletItem[];
  spotBtcPriceUsd: number;
}

export const AdminWalletsView: React.FC<AdminWalletsViewProps> = ({ wallets, spotBtcPriceUsd }) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const totalBtc = wallets.reduce((sum, w) => sum + w.balanceBtc, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL MULTI-SIG CUSTODY & TREASURY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Company Wallets & Reserve Vaults</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Segregated multi-signature cold vaults, automated hot disbursement relays, and OPEX settlement liquidity.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-right font-mono">
          <div className="text-[10px] text-gray-400 uppercase">Total Treasury Balance</div>
          <div className="text-2xl font-black text-[#F7931A] mt-0.5">{totalBtc.toFixed(4)} BTC</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">≈ ${(totalBtc * spotBtcPriceUsd).toLocaleString()} USD</div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    wallet.type === 'Cold Storage Vault' ? 'bg-blue-500/20 text-blue-300' :
                    wallet.type === 'Hot Payout Wallet' ? 'bg-amber-500/20 text-amber-300' :
                    wallet.type === 'Operational Treasury' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {wallet.type}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{wallet.description}</div>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-gray-900 border border-gray-800 text-[11px] font-mono text-emerald-400 font-bold">
                {wallet.multiSigConfig}
              </div>
            </div>

            {/* Balance Display */}
            <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 flex items-center justify-between font-mono">
              <div>
                <div className="text-[10px] text-gray-400 uppercase">Available On-Chain</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">{wallet.balanceBtc.toFixed(4)} BTC</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase">USD Value</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">${wallet.balanceUsd.toLocaleString()}</div>
              </div>
            </div>

            {/* Address bar with copy */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Whitelisted Public Key Address</div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-amber-400 text-xs truncate select-all">{wallet.address}</span>
                <button
                  onClick={() => handleCopy(wallet.address)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer shrink-0 ml-auto"
                >
                  {copiedAddress === wallet.address ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Transaction info */}
            <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Last Movement: {wallet.lastTxDate}</span>
              <span className="text-gray-300">{wallet.lastTxAmountBtc > 0 ? `+${wallet.lastTxAmountBtc} BTC` : `${wallet.lastTxAmountBtc} BTC`}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
