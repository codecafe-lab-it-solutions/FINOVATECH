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
    <footer id="main-footer" className="bg-[#0F172A] text-white border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/finovatech_favicon.svg"
                alt="Finovatech Mining Company"
                className="w-9 h-9 rounded-xl shadow-xs shrink-0"
              />
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white block leading-tight">
                  FINOVATECH
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-400 block mt-0.5">
                  MINING COMPANY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              Institutional Bitcoin mining and digital-asset infrastructure company operating from Muscat, Sultanate of Oman.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#F7931A]" />
              <span>Muscat, Sultanate of Oman • Est. 2 Oct 2025</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              Corporate Navigation
            </div>
            <ul className="grid grid-cols-2 gap-2.5 text-xs text-gray-400">
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
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              Governance & Term
            </div>
            <div className="text-xs text-gray-400 space-y-2">
              <div className="p-3 rounded-lg bg-gray-900/90 border border-gray-800">
                <div className="text-[11px] text-gray-400 font-mono">Managing Director:</div>
                <div className="font-semibold text-gray-200">{COMPANY_PROFILE.managingDirector}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/90 border border-gray-800">
                <div className="text-[11px] text-gray-400 font-mono">Operating Term:</div>
                <div className="font-semibold text-gray-200">4-Year Defined Term (Lease)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <p>
              © 2026 {COMPANY_PROFILE.name}. All Rights Reserved.
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Digital-asset activities involve inherent technological, operational and market risks. Information presented on this website is for general corporate and informational purposes.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-mono transition-colors border border-gray-800 cursor-pointer shrink-0"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F7931A]" />
          </button>
        </div>

      </div>
    </footer>
  );
};
