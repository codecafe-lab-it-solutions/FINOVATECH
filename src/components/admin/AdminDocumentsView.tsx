import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Plus, RotateCw, AlertTriangle, X, Archive } from 'lucide-react';
import { ApiDocument, ApiInvestorProfile, fetchAdminDocuments, createAdminDocument, updateAdminDocumentStatus, fetchAdminInvestors } from '../../lib/api';

interface AdminDocumentsViewProps {
  authToken: string;
}

const CATEGORIES: ApiDocument['category'][] = [
  'Investment Agreement', 'Amendment', 'Investor Statement', 'Tax Document', 'KYC Document', 'Payment Receipt', 'Mining Audit'
];

export const AdminDocumentsView: React.FC<AdminDocumentsViewProps> = ({ authToken }) => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ApiDocument['category']>('Investment Agreement');
  const [investorUserId, setInvestorUserId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [{ documents: docs }, { investors: invs }] = await Promise.all([
        fetchAdminDocuments(authToken),
        fetchAdminInvestors(authToken)
      ]);
      setDocuments(docs);
      setInvestors(invs);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load documents.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }
    setIsSaving(true);
    try {
      await createAdminDocument(authToken, { title: title.trim(), category, investorUserId: investorUserId || null });
      setTitle('');
      setInvestorUserId('');
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create document record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateAdminDocumentStatus(authToken, id, 'Archived');
      setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Archived' } : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not archive document.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>CONTRACTS & DOCUMENT VAULT</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Contracts & Document Vault</h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLoading ? 'Loading...' : `${documents.length} record${documents.length === 1 ? '' : 's'}, live from the database. Metadata only — no file upload/storage yet.`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Document Record
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3">Uploaded By</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {documents.map((d) => (
                <tr key={d.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 font-sans font-semibold text-white">{d.title}</td>
                  <td className="py-3 px-3">{d.category}</td>
                  <td className="py-3 px-3 text-gray-400">{d.investorName || '—'}</td>
                  <td className="py-3 px-3 text-gray-400">{d.uploadedBy}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-300'
                    }`}>{d.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {d.status === 'Active' && (
                      <button onClick={() => handleArchive(d.id)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-rose-300 cursor-pointer">
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && documents.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 font-mono">No documents on record.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">New Document Record</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input placeholder="Document title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
            <select value={category} onChange={(e) => setCategory(e.target.value as ApiDocument['category'])}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={investorUserId} onChange={(e) => setInvestorUserId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white">
              <option value="">No specific investor (company-wide)</option>
              {investors.map((inv) => <option key={inv.userId} value={inv.userId}>{inv.name} ({inv.username})</option>)}
            </select>
            <button
              onClick={handleCreate}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Create Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
