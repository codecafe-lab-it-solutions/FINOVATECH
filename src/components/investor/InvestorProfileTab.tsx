import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Building2, 
  CreditCard, 
  CheckCircle2,
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
  onUpdateUser: (updated: Partial<InvestorUser>) => Promise<void>;
}

export const InvestorProfileTab: React.FC<InvestorProfileTabProps> = ({
  user,
  onUpdateUser
}) => {
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    payoutBtcAddress: user.payoutBtcAddress,
    payoutNetwork: user.payoutNetwork,
    bankName: user.bankName,
    bankAccountHolder: user.bankAccountHolder,
    bankAccountNumber: user.bankAccountNumber,
    bankIban: user.bankIban,
    bankSwift: user.bankSwift
  });

  const [contactData, setContactData] = useState({
    email: user.email,
    phone: user.phone,
    country: user.country
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateUser(formData);
    setIsEditingPayment(false);
    setSuccessMsg('Payment details updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateUser(contactData);
    setIsEditingContact(false);
    setSuccessMsg('Contact details updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
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
          <div className={`px-3.5 py-1.5 rounded-full border text-xs font-mono flex items-center gap-1.5 font-bold ${
            user.kycStatus === 'Verified'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : user.kycStatus === 'Action Required'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>KYC {user.kycStatus}</span>
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
              {!isEditingContact && (
                <button
                  onClick={() => {
                    setContactData({ email: user.email, phone: user.phone, country: user.country });
                    setIsEditingContact(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 border border-gray-700 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#F7931A]" />
                  <span>Edit Contact Info</span>
                </button>
              )}
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

              {!isEditingContact ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                    <span className="text-gray-400">Registered Email:</span>
                    <span className="text-white font-bold">{user.email || 'Not provided'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                    <span className="text-gray-400">Phone Number:</span>
                    <span className="text-white font-bold">{user.phone || 'Not provided'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                    <span className="text-gray-400">Jurisdiction / Country:</span>
                    <span className="text-white font-bold">{user.country || 'Not provided'}</span>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveContact} className="space-y-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Registered Email:</label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Jurisdiction / Country:</label>
                    <input
                      type="text"
                      value={contactData.country}
                      onChange={(e) => setContactData({ ...contactData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(false)}
                      className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800">
                <span className="text-gray-400">Account Verification:</span>
                <span className={`font-bold flex items-center gap-1 ${
                  user.kycStatus === 'Verified'
                    ? 'text-emerald-400'
                    : user.kycStatus === 'Action Required'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> KYC {user.kycStatus}
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

            {/* USDT Payout Address */}
            <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F7931A] font-bold">USDT Payout Address:</span>
                <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 text-[10px] font-bold">
                  {formData.payoutNetwork} Network
                </span>
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
                Automated weekly mining dividends are disbursed directly to this USDT address on the {formData.payoutNetwork} network. Sending to the wrong network can permanently lose funds — double-check before saving.
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
              <form onSubmit={handleSaveDetails} className="space-y-3.5 text-xs font-mono">

                <div>
                  <label className="block text-gray-400 mb-1">USDT Network:</label>
                  <select
                    value={formData.payoutNetwork}
                    onChange={(e) => setFormData({ ...formData, payoutNetwork: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  >
                    <option value="TRC20">TRC20 (Tron)</option>
                    <option value="ERC20">ERC20 (Ethereum)</option>
                    <option value="BEP20">BEP20 (BNB Smart Chain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">USDT Payout Address:</label>
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
                    <span>Save Changes</span>
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
                Banking and payout detail changes are saved directly to your account and take effect immediately.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
