import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { AdminKycSubmission } from '../../types';

interface AdminKycViewProps {
  kycSubmissions: AdminKycSubmission[];
  onReviewKyc?: (id: string, status: AdminKycSubmission['status']) => void;
}

export const AdminKycView: React.FC<AdminKycViewProps> = ({
  kycSubmissions: initialSubmissions,
  onReviewKyc
}) => {
  const [submissions, setSubmissions] = useState<AdminKycSubmission[]>(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<AdminKycSubmission | null>(null);
  const [reviewReason, setReviewReason] = useState('');

  const handleDecision = (status: AdminKycSubmission['status']) => {
    if (!selectedSubmission) return;

    const updated = {
      ...selectedSubmission,
      status,
      reviewedBy: 'Gaurav K. Sharma (Compliance Officer)',
      reviewedAt: 'Just now',
      notes: reviewReason ? `${selectedSubmission.notes} | Reason: ${reviewReason}` : selectedSubmission.notes
    };

    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedSubmission(null);
    setReviewReason('');
    if (onReviewKyc) onReviewKyc(updated.id, status);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FINANCIAL REGULATORY COMPLIANCE & AML</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">KYC & Identity Verification Queue</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Sultanate of Oman Capital Market Authority & international AML guidelines document verification.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          {submissions.filter((s) => s.status === 'Submitted' || s.status === 'Under Review').length} Pending Review
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3">Country</th>
                <th className="py-3.5 px-3">Document Type</th>
                <th className="py-3.5 px-3">Submission Date</th>
                <th className="py-3.5 px-3">AML Risk Score</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{sub.investorName}</div>
                    <div className="text-[11px] font-mono text-gray-400">{sub.investorId} • {sub.id}</div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-300">{sub.country}</td>

                  <td className="py-3.5 px-3">
                    <div className="text-white font-semibold">{sub.documentType}</div>
                    <div className="text-[10px] text-gray-400">{sub.documentNumber}</div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400">{sub.submittedDate}</td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {sub.amlRiskScore}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      sub.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                      sub.status === 'Under Review' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {sub.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                    >
                      Verify Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Drawer / Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 overflow-hidden space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">KYC Compliance Dossier</h3>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {selectedSubmission.investorName} ({selectedSubmission.investorId})
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Documents Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-[#F7931A] mx-auto" />
                <div className="text-xs font-bold text-white">Passport / ID</div>
                <div className="text-[10px] text-gray-400 font-mono">Verified High-Res PDF</div>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">Legible</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-xs font-bold text-white">Proof of Address</div>
                <div className="text-[10px] text-gray-400 font-mono">Utility Bill (June 2026)</div>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">Matches Name</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-purple-400 mx-auto" />
                <div className="text-xs font-bold text-white">Source of Wealth</div>
                <div className="text-[10px] text-gray-400 font-mono">Bank Statement</div>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">Clean Audit</span>
              </div>
            </div>

            {/* AML Screening notes */}
            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-xs font-mono text-gray-300 space-y-1">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Automated Sanction & PEP Screening:</div>
              <div>• PEP (Politically Exposed Person): <strong>Clean (Negative)</strong></div>
              <div>• OFAC / EU / UN Sanction Lists: <strong>Clean (Negative)</strong></div>
              <div>• Adverse Media Screening: <strong>No Hits</strong></div>
            </div>

            {/* Reason / Admin notes input */}
            <div>
              <label className="block text-gray-400 text-[10px] font-mono uppercase mb-1">Compliance Notes / Rejection Reason</label>
              <input
                type="text"
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                placeholder="Optional internal verification note..."
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => handleDecision('Request Info')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs font-bold cursor-pointer"
              >
                Request More Info
              </button>
              <button
                onClick={() => handleDecision('Rejected')}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-xs font-bold cursor-pointer"
              >
                Reject KYC
              </button>
              <button
                onClick={() => handleDecision('Approved')}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-mono text-xs font-extrabold cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Approve KYC & Activate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
