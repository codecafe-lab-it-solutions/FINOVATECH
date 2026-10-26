import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Building2, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  TrendingUp, 
  FileText,
  Mail
} from 'lucide-react';
import { PageRoute } from '../types';

interface LeadershipSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onNavigate }) => {
  return (
    <section id="leadership-section" className="py-14 sm:py-20 lg:py-28 bg-ink-900 border-b border-line relative overflow-hidden">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 lg:mb-16 gap-4 sm:gap-6">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-ink-850 border border-line/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-fg-body">
                Corporate Governance & Stewardship
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Executive Leadership
            </h2>
            <p className="text-sm sm:text-lg text-fg-muted leading-relaxed max-w-2xl">
              Institutional stewardship focused on rigorous operational discipline, infrastructure reliability, and long-term technological integrity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-ink-850 border border-line shadow-2xs font-mono text-xs text-fg-muted flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-500" />
              <span>Muscat Corporate Office</span>
            </div>
          </div>
        </div>

        {/* Full-Width Executive Leadership Presentation Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Executive Identity & Profile Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-ink-950 text-white p-5 sm:p-7 md:p-9 shadow-xl border border-line relative overflow-hidden">
            
            {/* Ambient Background Watermark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 space-y-5 sm:space-y-6">
              
              {/* Card Top Pill: Role & Office */}
              <div className="flex items-center justify-between border-b border-line pb-4 sm:pb-5">
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-ink-850/90 border border-line-warm text-[10px] sm:text-[11px] font-mono font-semibold text-gold-500">
                  <span>EXECUTIVE MANDATE</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Appointment</span>
                </div>
              </div>

              {/* Monogram Portrait Crest & Title */}
              <div className="flex flex-row items-center gap-4 sm:gap-5">
                
                {/* Crest Box */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-ink-800 via-ink-850 to-ink-950 border border-line-warm flex flex-col items-center justify-center text-white shadow-2xl relative shrink-0 group">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-ink-800/90 border border-line-warm flex items-center justify-center text-gold-500 mb-1 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-fg-body uppercase">
                    FINOVATECK
                  </span>
                </div>

                {/* Name & Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Operational Oversight
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-gold-500 mt-0.5 sm:mt-1 font-mono">
                    Operations Team
                  </div>
                  <div className="text-[11px] sm:text-xs text-fg-muted mt-1 flex items-center gap-1.5 font-mono">
                    <Compass className="w-3.5 h-3.5 text-fg-muted" />
                    <span>Muscat, Sultanate of Oman</span>
                  </div>
                </div>

              </div>

              {/* Leadership Philosophy Quote */}
              <div className="p-4 sm:p-5 rounded-2xl bg-ink-850/80 border border-line/90 relative">
                <div className="text-fg-muted text-[10px] sm:text-xs font-mono mb-1.5 uppercase tracking-wider text-gold-500">
                  Executive Directive
                </div>
                <p className="text-xs sm:text-sm text-fg-body leading-relaxed italic font-serif">
                  "Our mandate is defined by technological discipline, sovereign regulatory alignment, and pure operational execution in industrial Bitcoin compute."
                </p>
              </div>

              {/* Governance Badges */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div className="p-2.5 sm:p-3 rounded-xl bg-ink-850/50 border border-line text-[11px] sm:text-xs font-mono">
                  <div className="text-fg-muted text-[9px] sm:text-[10px] uppercase">Operating Charter</div>
                  <div className="text-fg-body font-bold mt-0.5">4-Year Lease Mandate</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-ink-850/50 border border-line text-[11px] sm:text-xs font-mono">
                  <div className="text-fg-muted text-[9px] sm:text-[10px] uppercase">Facility Node</div>
                  <div className="text-emerald-400 font-bold mt-0.5">Muscat Site MCT-01</div>
                </div>
              </div>

            </div>

            {/* Bottom Action / Contact Trigger */}
            <div className="relative z-10 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-line flex flex-col sm:flex-row items-center gap-3">
              <button
                id="leadership-contact-director-btn"
                onClick={() => onNavigate && onNavigate('contact')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono transition-all shadow-md cursor-pointer group min-h-[48px]"
              >
                <span>Connect with Executive Office</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

          {/* Right Column: Institutional Governance & Operational Pillars (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Top Narrative Card */}
            <div className="rounded-3xl bg-ink-850 border border-line/90 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="text-xs font-mono font-bold text-fg-muted uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span>Strategic Leadership & Vision</span>
                </div>
                <span className="text-xs font-mono text-fg-muted">Governance ID: FNV-MCT-DIR</span>
              </div>

              <div className="space-y-3.5 text-base text-fg-muted leading-relaxed">
                <p>
                  FINOVATECK Mining Company operates under the institutional stewardship of <strong className="font-bold text-white">Company Operations Team</strong>, Operations Team. The executive agenda focuses on developing secure, enterprise-grade technology infrastructure engineered for thermodynamic resilience and sovereign energy efficiency.
                </p>
                <p className="text-sm text-fg-muted">
                  Under this leadership, FINOVATECK prioritizes transparent capital stewardship, continuous telemetry verification, and rigorous adherence to institutional lifecycle standards from the Sultanate of Oman.
                </p>
              </div>
            </div>

            {/* 4 Core Governance Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-ink-850 border border-line/90 shadow-2xs hover:border-gold-500/60 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Lifecycle Stewardship
                </h4>
                <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
                  Execution structured under a defined 4-year operating lease charter, ensuring transparent financial and technological horizons.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-ink-850 border border-line/90 shadow-2xs hover:border-gold-500/60 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-ink-800 text-gold-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Computing Infrastructure
                </h4>
                <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
                  Industrial ASIC clusters and modular containerized pods engineered for maximum thermodynamic stability and 112 TH/s standard.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-ink-850 border border-line/90 shadow-2xs hover:border-gold-500/60 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Institutional Risk Mitigation
                </h4>
                <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
                  Comprehensive 24/7 CCTV surveillance, multi-layer physical access controls, and direct Stratum protocol monitoring.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-ink-850 border border-line/90 shadow-2xs hover:border-gold-500/60 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-ink-800 text-gold-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Sovereign Alignment
                </h4>
                <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
                  Headquartered in Muscat, Sultanate of Oman, supporting regional technology infrastructure and industrial diversification.
                </p>
              </div>

            </div>

            {/* Verification Footer Banner */}
            <div className="p-4 rounded-2xl bg-ink-850 border border-line flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-fg-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Executive Office & Corporate Governance Certified</span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('about')}
                className="text-white font-bold hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Read Corporate Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
