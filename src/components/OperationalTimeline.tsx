import React from 'react';
import { Calendar, CheckCircle2, Clock, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { TIMELINE_ITEMS } from '../data/companyData';
import { PageRoute } from '../types';

interface OperationalTimelineProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OperationalTimeline: React.FC<OperationalTimelineProps> = ({ onNavigate }) => {
  return (
    <section id="timeline-section" className="py-20 lg:py-28 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Corporate Horizon
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Operational Timeline & Lifecycle
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            FINOVATECH executes with transparent roadmaps and defined operational horizons, adhering to scheduled lease commitments and high-standard infrastructure lifecycle management.
          </p>
        </div>

        {/* Timeline Grid (4 Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE_ITEMS.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isPlanned = item.status === 'planned';

            return (
              <div
                key={item.date}
                id={`timeline-item-${idx}`}
                className={`relative rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#111827] text-white border-gray-900 shadow-lg ring-2 ring-[#F7931A]/30'
                    : isPlanned
                    ? 'bg-[#F8F9FA] text-gray-900 border-gray-200 hover:border-gray-300'
                    : 'bg-white text-gray-900 border-gray-200/90 hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Top Status & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                      isCurrent
                        ? 'bg-[#F7931A] text-gray-950 font-extrabold'
                        : isPlanned
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.date}
                    </span>

                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      isCurrent
                        ? 'text-emerald-400 font-bold flex items-center gap-1'
                        : isPlanned
                        ? 'text-gray-500 font-semibold'
                        : 'text-emerald-600 font-semibold'
                    }`}>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                      {item.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight mb-2">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className={`text-sm leading-relaxed mb-4 ${
                    isCurrent ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Granular Detail Box */}
                <div className={`mt-4 pt-4 border-t text-xs leading-relaxed ${
                  isCurrent
                    ? 'border-gray-800 text-gray-400'
                    : 'border-gray-200 text-gray-500'
                }`}>
                  {item.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Callout regarding 4-Year Lease Term */}
        <div className="mt-8 p-5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3.5">
          <Clock className="w-5 h-5 text-[#F7931A] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Planned Operating Term Clarity:</span> Operations are planned under the current lease arrangement for four years from Muscat, after which operations are scheduled to close in full alignment with structured corporate planning.
          </div>
        </div>

      </div>
    </section>
  );
};
