import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Lock, 
  Copy, 
  Check, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Save
} from 'lucide-react';
import { InvestorUser } from '../../types';

interface InvestorProfileTabProps {
  user: InvestorUser;
  onUpdateUser: (updated: Partial<InvestorUser>) => void;
}

export const InvestorProfileTab: React.FC<InvestorProfileTabProps> = ({
  user,
  onUpdateUser
}) => {
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    payoutBtcAddress: user.payoutBtcAddress,
    bankName: user.bankName,
    bankAccountHolder: user.bankAccountHolder,
    bankAccountNumber: user.bankAccountNumber,
    bankIban: user.bankIban,
    bankSwift: user.bankSwift
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInitiateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpVerification(true);
    setOtpError('');
  };

  const handleVerifyOtpAndSave = () => {
    if (otpCode.trim() === '1234' || otpCode.trim() === '123456' || otpCode.trim().length >= 4) {
      onUpdateUser(formData);
      setShowOtpVerification(false);
      setIsEditingPayment(false);
      setSuccessMsg('Payment details updated and verified successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setOtpError('Please enter a valid OTP code (e.g. 123456 for demo confirmation).');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#F7931A] font-bold uppercase tracking-wider">
              INVESTOR PROFILE & VERIFICATION
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {user.name}
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Investor ID: {user.id} • Registered in {user.country}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>KYC Verified S.A.O.C</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-mono">
            {user.accountStatus} Account
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Left KYC/Account Data, Right Bank/Payout Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: KYC & Account Information (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider font-mono">
                  Basic Investor Information
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">Read-Only KYC</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Full Legal Name:</span>
                <span className="text-white font-bold">{user.name}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Investor ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#F7931A] font-bold">{user.id}</span>
                  <button
                    onClick={() => handleCopy(user.id, 'id')}
                    className="text-gray-500 hover:text-gray-300 cursor-pointer"
                  >
                    {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Registered Email:</span>
                <span className="text-white font-bold">{user.email}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Phone Number:</span>
                <span className="text-white font-bold">{user.phone}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Jurisdiction / Country:</span>
                <span className="text-white font-bold">{user.country}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Account Verification:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Tier 3 Institutional Verified
                </span>
              </div>
            </div>
          </div>

          {/* Plan & Contract Status Box */}
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <FileText className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Contract & Referral Hierarchy
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <div className="text-gray-400 text-[11px]">Investment Plan:</div>
                <div className="text-[#F7931A] font-bold text-sm mt-0.5">{user.plan}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                  <div className="text-gray-400 text-[11px]">Contract Agreement:</div>
                  <div className="text-white font-bold mt-0.5">{user.agreementNumber}</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                  <div className="text-gray-400 text-[11px]">Referral Sponsor:</div>
                  <div className="text-white font-bold mt-0.5">{user.referrerName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                  <div className="text-gray-400 text-[11px]">Start Date:</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{user.startDate}</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                  <div className="text-gray-400 text-[11px]">Maturity / End Date:</div>
                  <div className="text-amber-400 font-bold mt-0.5">{user.maturityDate}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Bank / Payout Details with Secure Update Process (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider font-mono">
                  Settlement & Payout Configuration
                </span>
              </div>

              {!isEditingPayment && (
                <button
                  onClick={() => setIsEditingPayment(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 border border-gray-700 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#F7931A]" />
                  <span>Update Details</span>
                </button>
              )}
            </div>

            {/* BTC Payout Whitelisted Address */}
            <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F7931A] font-bold">Whitelisted BTC Payout Address:</span>
                <span className="text-emerald-400 text-[10px]">Active & Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 font-mono text-xs text-gray-200 flex items-center justify-between break-all">
                <span className="text-amber-400 select-all">{formData.payoutBtcAddress}</span>
                <button
                  onClick={() => handleCopy(formData.payoutBtcAddress, 'btc')}
                  className="ml-2 p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white cursor-pointer shrink-0"
                >
                  {copiedField === 'btc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                Automated weekly Bitcoin mining dividends are disbursed directly to this address.
              </div>
            </div>

            {/* Bank Payout Info Form / Display */}
            {!isEditingPayment ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="text-gray-400 text-[11px]">Commercial Bank:</div>
                  <div className="text-white font-bold">{formData.bankName}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="text-gray-400 text-[11px]">Account Holder:</div>
                  <div className="text-white font-bold">{formData.bankAccountHolder}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="text-gray-400 text-[11px]">Account Number / IBAN:</div>
                  <div className="text-white font-bold">{formData.bankIban}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1">
                  <div className="text-gray-400 text-[11px]">SWIFT / BIC Code:</div>
                  <div className="text-white font-bold">{formData.bankSwift}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInitiateUpdate} className="space-y-3.5 text-xs font-mono">
                
                <div>
                  <label className="block text-gray-400 mb-1">Whitelisted BTC Address:</label>
                  <input
                    type="text"
                    required
                    value={formData.payoutBtcAddress}
                    onChange={(e) => setFormData({ ...formData, payoutBtcAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Bank Name:</label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Account Holder Name:</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccountHolder}
                    onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">IBAN / Account Number:</label>
                  <input
                    type="text"
                    required
                    value={formData.bankIban}
                    onChange={(e) => setFormData({ ...formData, bankIban: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">SWIFT / BIC:</label>
                  <input
                    type="text"
                    required
                    value={formData.bankSwift}
                    onChange={(e) => setFormData({ ...formData, bankSwift: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to 2FA Confirmation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPayment(false)}
                    className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-[11px] font-mono text-gray-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-[#F7931A] shrink-0 mt-0.5" />
              <span>
                All banking and payout changes trigger cryptographic 2FA verification and require a 24-hour security lock before new dispatches.
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 2FA OTP Confirmation Modal */}
      {showOtpVerification && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#F7931A]" />
              <span className="font-bold text-sm uppercase tracking-wider font-mono">
                Confirm Security 2FA
              </span>
            </div>

            <p className="text-xs text-gray-300 font-mono">
              A 6-digit confirmation token was sent to <strong className="text-white">{user.phone}</strong> and <strong className="text-white">{user.email}</strong>.
            </p>

            {otpError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 font-mono mb-1">Enter 2FA Code (Demo: 123456):</label>
              <input
                type="text"
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-700 text-white font-mono text-center tracking-widest text-lg focus:outline-hidden focus:border-[#F7931A]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleVerifyOtpAndSave}
                className="flex-1 py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono cursor-pointer"
              >
                Verify & Save Settlement Address
              </button>
              <button
                type="button"
                onClick={() => setShowOtpVerification(false)}
                className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
