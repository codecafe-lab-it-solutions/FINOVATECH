import React from 'react';
import {
  ShieldCheck,
  Building2,
  ArrowRight,
  Lock,
  Cpu,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { PageRoute } from '../types';
import { OPERATING_FACTS } from '../data/companyData';

interface LeadershipSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

/* This section used to present a person who does not exist — a generic
   avatar, "Operational Oversight" as a name and "Operations Team" as a
   title. Rather than ship a placeholder executive, it now describes the
   governance structure itself, which is what the copy was really about. */
const GOVERNANCE_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Lifecycle Stewardship',
    body: 'Execution structured under a defined four-year operating lease charter, with transparent financial and technological horizons.',
  },
  {
    icon: Cpu,
    title: 'Computing Infrastructure',
    body: 'Industrial ASIC clusters and modular containerized pods engineered for thermodynamic stability under continuous load.',
  },
  {
    icon: Lock,
    title: 'Risk Mitigation',
    body: 'Round-the-clock CCTV surveillance, multi-layer physical access control, and continuous Stratum protocol monitoring.',
  },
  {
    icon: TrendingUp,
    title: 'Sovereign Alignment',
    body: 'Headquartered in Muscat, Sultanate of Oman, supporting regional technology infrastructure and industrial diversification.',
  },
];

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onNavigate }) => {
  return (
    <section id="leadership-section" className="theme-light py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line relative overflow-hidden">

      <div className="absolute top-0 right-10 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-600"></span>
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Corporate Governance & Stewardship
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Leadership & Governance
            </h2>
            <p className="text-base sm:text-lg text-fg-body leading-relaxed max-w-2xl">
              Institutional stewardship focused on rigorous operational discipline, infrastructure reliability, and long-term technological integrity.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-850 border border-line text-sm text-fg-body shrink-0">
            <Building2 className="w-4 h-4 text-gold-500 shrink-0" />
            <span>Muscat Corporate Office</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left: the governance mandate */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl bg-ink-850 border border-line p-7 sm:p-9 shadow-xs">

            <div className="flex items-center gap-2 pb-5 border-b border-line">
              <Scale className="w-4 h-4 text-gold-500 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Executive Mandate
              </span>
            </div>

            <div className="pt-6 space-y-4 text-base text-fg-body leading-relaxed grow">
              <p>
                FINOVATECK Mining Company is directed by its executive operations office in Muscat, which holds responsibility for facility engineering, energy management, security and the execution of the four-year operating charter.
              </p>
              <p>
                The mandate is deliberately narrow: build and run industrial computing infrastructure to a documented standard, report against it, and close out the term as planned. The company does not manage client capital or offer financial products.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-line">
              <div>
                <div className="text-xs text-fg-body uppercase tracking-eyebrow">Operating charter</div>
                <div className="text-sm font-bold text-white mt-1">4-year lease mandate</div>
              </div>
              <div>
                <div className="text-xs text-fg-body uppercase tracking-eyebrow">Facility node</div>
                <div className="text-sm font-bold text-white mt-1 font-mono">{OPERATING_FACTS.nodeId}</div>
              </div>
            </div>

            <button
              id="leadership-contact-director-btn"
              onClick={() => onNavigate && onNavigate('contact')}
              className="btn-primary w-full mt-6 px-5 py-3.5 text-base group min-h-[48px]"
            >
              <span>Contact the Executive Office</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

          </div>

          {/* Right: governance pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
            {GOVERNANCE_PILLARS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-ink-850 border border-line hover:border-gold-600 transition-colors"
              >
                {/* All four chips were different tints — gold, green, grey. */}
                <div className="w-10 h-10 rounded-xl bg-gold-500/12 text-gold-500 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {title}
                </h3>
                <p className="text-sm text-fg-body leading-relaxed">
                  {body}
                </p>
              </div>
            ))}

            <div className="sm:col-span-2 p-5 rounded-2xl bg-ink-850 border border-line flex flex-wrap items-center justify-between gap-3 text-sm text-fg-body">
              <span>Corporate structure, term and jurisdiction are published in full under Institutional Disclosure.</span>
              <button
                onClick={() => onNavigate && onNavigate('about')}
                className="text-white font-bold hover:text-gold-500 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Read Corporate Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
