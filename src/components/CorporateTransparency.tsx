import React from 'react';
import { CORPORATE_TRANSPARENCY_DATA, FAQ_ITEMS } from '../data/companyData';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageRoute } from '../types';

interface CorporateTransparencyProps {
  onNavigate?: (route: PageRoute) => void;
}

export const CorporateTransparency: React.FC<CorporateTransparencyProps> = ({ onNavigate }) => {
  return (
    <section id="transparency-section" className="py-20 lg:py-28 bg-ink-950 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
              Institutional Disclosure
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built on Clarity and Accountability
          </h2>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            FINOVATECK maintains clear and factual disclosures regarding corporate structure, operational scope, and governance mandates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: 2-Column Institutional Table */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line overflow-hidden bg-ink-850 shadow-2xs">
              <div className="bg-ink-950 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    Official Corporate Registry Data
                  </span>
                </div>
                <span className="text-[11px] font-mono text-fg-muted">Muscat Registry</span>
              </div>

              <div className="divide-y divide-line">
                {CORPORATE_TRANSPARENCY_DATA.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-1 sm:grid-cols-12 p-4 text-xs sm:text-sm gap-2 ${
                      idx % 2 === 0 ? 'bg-ink-850' : 'bg-ink-950'
                    }`}
                  >
                    <div className="sm:col-span-5 font-semibold text-fg-muted font-mono">
                      {row.label}
                    </div>
                    <div className="sm:col-span-7 font-bold text-white">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Institutional Q&A and Risk Framework */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="p-6 rounded-2xl bg-ink-950 border border-line space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-fg-body">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Governance & Compliance Mandates</span>
              </div>
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                FINOVATECK operates exclusively as an infrastructure provider and technology operator. The company does not solicit retail investments, offer speculative financial instruments, or make guarantees regarding cryptocurrency valuations or mining profitability.
              </p>
            </div>

            {/* Quick Institutional Q&A Cards */}
            <div className="space-y-3">
              {FAQ_ITEMS.slice(0, 2).map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-ink-850 border border-line shadow-2xs">
                  <div className="text-xs font-bold text-white mb-1.5 flex items-start gap-2">
                    <span className="text-gold-500 font-mono font-bold">Q:</span>
                    <span>{faq.question}</span>
                  </div>
                  <div className="text-xs text-fg-muted leading-relaxed pl-4">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
