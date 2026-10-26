import React, { useState } from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Zap,
  DollarSign,
  Users,
  PieChart,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { AdminReportItem } from '../../types';

interface AdminReportsViewProps {
  reports: AdminReportItem[];
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ reports }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const categories = ['All', 'Financial', 'Mining Operations', 'Investor & AUM', 'Tax & Audit'];

  const filtered = reports.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const handleDownload = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Analytics, Financial & Operational Reports</h2>
          <p className="text-xs text-fg-muted mt-1 max-w-2xl">
            Export production datasets, investor tax summaries, hashrate telemetry archives, and solvency audit packages.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                selectedCategory === c
                  ? 'bg-gold-500 text-black font-bold'
                  : 'bg-ink-850 hover:bg-ink-800 text-fg-muted border border-line'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rpt) => (
          <div
            key={rpt.id}
            className="p-6 rounded-3xl bg-ink-950 border border-line hover:border-gold-700/60 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-ink-800 text-fg-body font-mono text-[10px] font-bold">
                  {rpt.category}
                </span>
                <span className="text-[11px] font-mono text-fg-muted">{rpt.period}</span>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">{rpt.title}</h3>
              <p className="text-xs text-fg-muted">{rpt.description}</p>
            </div>

            <div className="pt-4 border-t border-line/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-fg-muted">
                <span>Available Formats:</span>
                <span className="text-gold-200">{rpt.formats.join(' • ')}</span>
              </div>
              <div className="flex items-center justify-between text-fg-muted">
                <span>Generated:</span>
                <span className="text-fg-body">{rpt.generatedDate}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {rpt.formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleDownload(`${rpt.id}-${fmt}`)}
                    className="flex-1 py-2 rounded-xl bg-ink-800 hover:bg-gold-500 hover:text-black text-fg-body text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-line-warm"
                  >
                    <Download className="w-3 h-3" />
                    <span>{downloadSuccess === `${rpt.id}-${fmt}` ? 'Ready' : fmt}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
