import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Upload,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { AdminDocumentItem } from '../../types';

interface AdminDocumentsViewProps {
  documents: AdminDocumentItem[];
}

export const AdminDocumentsView: React.FC<AdminDocumentsViewProps> = ({ documents: initialDocs }) => {
  const [docsList, setDocsList] = useState<AdminDocumentItem[]>(initialDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filtered = docsList.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.investorName.toLowerCase().includes(q) ||
      d.documentType.toLowerCase().includes(q)
    );
  });

  const handleDownload = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>ENCRYPTED REPOSITORY & LEGAL VAULT</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investor Contracts & Document Vault</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Immutable SHA-256 hashed custody of investment contracts, KYC passports, power agreements, and monthly statements.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by investor or type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs font-mono"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">File Size</th>
                <th className="py-3.5 px-3">Uploaded</th>
                <th className="py-3.5 px-3">Verification</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#F7931A]" />
                      <span>{doc.title}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">Hash: {doc.fileHash}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white">{doc.investorName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{doc.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                      {doc.documentType}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400">{doc.fileSize}</td>
                  <td className="py-3.5 px-3 text-gray-400">{doc.uploadedDate}</td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {doc.signatureStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-200 text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{downloadSuccess === doc.id ? 'Downloaded' : 'Download'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
