import React, { useState } from 'react';
import { CORPORATE_TRANSPARENCY_DATA, FAQ_ITEMS } from '../data/companyData';
import { ShieldCheck, FileText, ChevronDown } from 'lucide-react';
import { PageRoute } from '../types';

interface CorporateTransparencyProps {
  onNavigate?: (route: PageRoute) => void;
}

export const CorporateTransparency: React.FC<CorporateTransparencyProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="transparency-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Institutional Disclosure
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built on Clarity and Accountability
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            FINOVATECK maintains clear and factual disclosures regarding corporate structure, operational scope, and governance mandates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left: 2-Column Institutional Table */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line overflow-hidden bg-ink-850">
              <div className="bg-ink-800 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" />
                  <span className="text-xs font-semibold tracking-eyebrow uppercase">
                    Corporate Registry Data
                  </span>
                </div>
                <span className="text-xs text-fg-body">Muscat Registry</span>
              </div>

              {/* The rows alternated #000 and #12151B, which read as heavy
                  stripes. One surface, separated by hairlines. */}
              <div className="divide-y divide-line">
                {CORPORATE_TRANSPARENCY_DATA.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-12 px-6 py-3.5 text-sm gap-2"
                  >
                    <div className="sm:col-span-5 text-fg-body">
                      {row.label}
                    </div>
                    <div className="sm:col-span-7 font-semibold text-white">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Institutional Q&A and Risk Framework */}
          <div className="lg:col-span-5 space-y-5">

            <div className="p-6 rounded-2xl bg-ink-850 border border-line space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Governance & Compliance Mandates</span>
              </div>
              <p className="text-sm text-fg-body leading-relaxed">
                FINOVATECK operates exclusively as an infrastructure provider and technology operator. The company does not solicit retail investments, offer speculative financial instruments, or make guarantees regarding cryptocurrency valuations or mining profitability.
              </p>
            </div>

            {/* All four questions now ship, as an accordion, so the column
                reaches the table's height instead of stopping halfway. */}
            <div className="rounded-2xl bg-ink-850 border border-line divide-y divide-line overflow-hidden">
              {FAQ_ITEMS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-3 p-4 text-left cursor-pointer hover:bg-ink-800 transition-colors"
                    >
                      <span className="text-sm font-semibold text-white leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 mt-0.5 text-gold-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-fg-body leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
