import React from 'react';
import { ArrowUp, MapPin, Building, Shield } from 'lucide-react';
import { PageRoute } from '../types';
import { COMPANY_PROFILE } from '../data/companyData';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'About Company', route: 'about' },
    { label: 'Bitcoin Mining', route: 'mining' },
    { label: 'Infrastructure', route: 'infrastructure' },
    { label: 'Operations', route: 'operations' },
    { label: 'Leadership', route: 'leadership' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <footer id="main-footer" className="relative bg-ink-950 text-white border-t border-line pt-16 pb-12 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#CCA84F_25%,#F4E183_50%,#CCA84F_75%,transparent)] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-line">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logoreal2.png"
                alt="FINOVATECK Mining Company"
                className="w-64 sm:w-72 h-auto rounded-xl bg-black block"
              />
              <div className="sr-only">
                <span className="text-lg font-extrabold tracking-tight text-white block leading-tight">
                  FINOVATECK
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-fg-muted block mt-0.5">
                  MINING COMPANY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-fg-muted max-w-sm leading-relaxed">
              Institutional Bitcoin mining and digital-asset infrastructure company operating from Muscat, Sultanate of Oman.
            </p>

            <div className="flex items-center gap-2 text-xs text-fg-muted font-mono pt-1">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>Muscat, Sultanate of Oman • Est. 2 Oct 2025</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-body">
              Corporate Navigation
            </div>
            <ul className="grid grid-cols-2 gap-2.5 text-xs text-fg-muted">
              {navLinks.map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => {
                      onNavigate(item.route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Details */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-body">
              Company & Term
            </div>
            <div className="text-xs text-fg-muted space-y-2">
              <div className="p-3 rounded-lg bg-ink-850/90 border border-line">
                <div className="text-[11px] text-fg-muted font-mono">Operating Term:</div>
                <div className="font-semibold text-fg-body">4-Year Defined Term (Lease)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-fg-muted">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <p>
              © 2025 {COMPANY_PROFILE.name}. All Rights Reserved.
            </p>
            <p className="text-[11px] text-fg-muted leading-relaxed">
              Digital-asset activities involve inherent technological, operational and market risks. Information presented on this website is for general corporate and informational purposes.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-fg-body text-xs font-mono transition-colors border border-line cursor-pointer shrink-0"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-gold-500" />
          </button>
        </div>

      </div>
    </footer>
  );
};
