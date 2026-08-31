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
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Analytics, Financial & Operational Reports</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
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
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
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
            className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-gray-800 text-gray-300 font-mono text-[10px] font-bold">
                  {rpt.category}
                </span>
                <span className="text-[11px] font-mono text-gray-400">{rpt.period}</span>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">{rpt.title}</h3>
              <p className="text-xs text-gray-400">{rpt.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-800/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Available Formats:</span>
                <span className="text-amber-400">{rpt.formats.join(' • ')}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Generated:</span>
                <span className="text-gray-300">{rpt.generatedDate}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {rpt.formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleDownload(`${rpt.id}-${fmt}`)}
                    className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-200 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-gray-700"
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
