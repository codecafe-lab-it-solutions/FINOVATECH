import React, { useState } from 'react';
import { FolderArchive, Search, FileText } from 'lucide-react';
import { ApiDocument } from '../../lib/api';

interface ReportsDocumentsTabProps {
  documents: ApiDocument[];
}

export const ReportsDocumentsTab: React.FC<ReportsDocumentsTabProps> = ({ documents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(documents.map((d) => d.category)))];

  const filtered = documents.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-line-warm text-xs font-mono text-gold-500">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>DOCUMENT CENTER</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Document Center</h2>
          <p className="text-xs text-fg-muted font-mono mt-0.5">
            Documents your admin team has recorded for your account — {documents.length} on file.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ink-950 border border-line text-white placeholder-fg-muted text-xs font-mono focus:outline-hidden focus:border-gold-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              selectedCategory === c ? 'bg-gold-500 text-black font-bold' : 'bg-ink-850 hover:bg-ink-800 text-fg-muted border border-line'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="p-5 rounded-2xl bg-ink-850/90 border border-line text-white space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-ink-950 border border-line shrink-0">
                <FileText className="w-4 h-4 text-gold-500" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white leading-snug">{doc.title}</div>
                <div className="text-[11px] text-fg-muted mt-0.5">{doc.category}</div>
              </div>
            </div>
            <div className="text-[11px] text-fg-muted font-mono">Added {doc.createdAt} by {doc.uploadedBy}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-fg-muted font-mono text-xs">No documents found.</div>
        )}
      </div>
    </div>
  );
};
