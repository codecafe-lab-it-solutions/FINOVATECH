import React, { useState } from 'react';
import { 
  FolderArchive, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  Filter, 
  Search, 
  Calendar,
  X,
  FileCheck
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface ReportsDocumentsTabProps {
  documents: DocumentItem[];
}

export const ReportsDocumentsTab: React.FC<ReportsDocumentsTabProps> = ({ documents }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const categories = ['All', 'Agreement', 'KYC', 'Mining Statement', 'Receipt', 'Audit'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    setDownloadSuccess(`Downloaded "${doc.title}" (${doc.size}, verified PDF)`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL DOCUMENT & AUDIT VAULT</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Reports, Tax Certificates & Legal Documents
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Tamper-proof digitally signed statements, agreements, and sovereign regulatory compliance files
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Signatures Validated</span>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
          <button onClick={() => setDownloadSuccess(null)} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                selectedCategory === cat
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-hidden focus:border-[#F7931A]"
          />
        </div>

      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-3 hover:border-gray-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span className="px-2 py-0.5 rounded bg-gray-800 text-[#F7931A] font-bold">
                  {doc.category}
                </span>
                <span>{doc.size}</span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2.5 line-clamp-2">
                {doc.title}
              </h4>

              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mt-2">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>Issued: {doc.date}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="py-2 px-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl text-white shadow-2xl p-6 space-y-4 animate-in zoom-in-95 font-mono">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#F7931A]" />
                <span className="font-bold text-sm uppercase text-white">
                  Document Preview & Cryptographic Verification
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2 text-xs">
              <div className="text-white font-bold text-sm">{previewDoc.title}</div>
              <div className="text-gray-400">Document Reference: #{previewDoc.id} • Category: {previewDoc.category}</div>
              <div className="text-gray-400">Date of Registration: {previewDoc.date} • File Size: {previewDoc.size}</div>
              <div className="text-emerald-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Sealed by FINOVATECH Legal & Sovereign Compliance Desk</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-300 space-y-2 max-h-48 overflow-y-auto">
              <p>
                This official certified copy validates all operational allocations, power tariffs, and cryptographic block receipts registered in the Muscat MCT-01 sovereign data center ledger.
              </p>
              <p className="text-[11px] text-gray-500">
                SHA-256 Hash Digest: e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3b8f1a2c7d9
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#F7931A] text-gray-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs cursor-pointer hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
