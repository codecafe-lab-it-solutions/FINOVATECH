import React from 'react';
import { ArrowUp, MapPin } from 'lucide-react';
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
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#8A6B1E_25%,#D4AF37_50%,#8A6B1E_75%,transparent)] opacity-60" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-line">

          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            {/* Left-aligned and capped, so it sits on the same axis as the
                copy beneath it; the previous lockup was a wide centred
                plate with an illegible tagline. */}
            <img
              src="/logo-wordmark.png"
              alt="FINOVATECK Mining Company"
              width={1040}
              height={199}
              className="h-10 w-auto object-contain block"
            />

            <p className="text-sm text-fg-body max-w-sm leading-relaxed">
              Institutional Bitcoin mining and digital-asset infrastructure company operating from Muscat, Sultanate of Oman.
            </p>

            <div className="flex items-center gap-2 text-sm text-fg-body pt-1">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Muscat, Sultanate of Oman · Est. 2 Oct 2025</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-eyebrow text-white">
              Corporate Navigation
            </div>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => {
                      onNavigate(item.route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-fg-body hover:text-gold-500 transition-colors cursor-pointer text-left py-0.5"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The "Company & Term" box held a single line and read as empty. */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-eyebrow text-white">
              Company
            </div>
            <dl className="text-sm space-y-2.5">
              <div>
                <dt className="text-fg-body">Operating term</dt>
                <dd className="font-semibold text-white">4-year defined lease</dd>
              </div>
              <div>
                <dt className="text-fg-body">Jurisdiction</dt>
                <dd className="font-semibold text-white">Sultanate of Oman</dd>
              </div>
              <div>
                <dt className="text-fg-body">Inquiries</dt>
                <dd>
                  <a
                    href="mailto:corporate@finovateck-mining.om"
                    className="font-mono text-xs text-gold-500 hover:underline break-words"
                  >
                    corporate@finovateck-mining.om
                  </a>
                </dd>
              </div>
            </dl>
          </div>

        </div>

        {/* Bottom Tier: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-fg-body">
          <div className="space-y-2 max-w-2xl">
            <p>© 2025 {COMPANY_PROFILE.name}. All rights reserved.</p>
            <p className="text-xs leading-relaxed">
              Digital-asset activities involve inherent technological, operational and market risks. Information presented on this website is for general corporate and informational purposes.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-secondary px-4 py-2.5 text-sm shrink-0"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4 text-gold-500" />
          </button>
        </div>

      </div>
    </footer>
  );
};
