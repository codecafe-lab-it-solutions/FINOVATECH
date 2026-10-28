import React from 'react';
import { Mail, MapPin, Building, Shield, Clock, ArrowRight } from 'lucide-react';
import { COMPANY_PROFILE, OPERATING_FACTS } from '../data/companyData';

const INQUIRY_EMAIL = 'corporate@finovateck-mining.om';

/* The inquiry categories that used to be a <select> in the removed form.
   They still tell a visitor what this office handles, so they are kept as
   a routing list rather than discarded with the form. */
const INQUIRY_TYPES = [
  'Infrastructure & operations',
  'Technology & hardware',
  'Strategic collaboration',
  'Corporate governance',
  'General information',
];

/* The correspondence form was removed: it had no endpoint behind it. It
   ran a 900ms timer and then told the visitor "Inquiry Transmitted
   Successfully" while the message went nowhere. Until there is a real
   handler, the inquiry desk address is the honest call to action. */
export const ContactSection: React.FC = () => {
  return (
    <section id="contact-section" className="theme-light py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-600"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Institutional Inquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let's Build the Digital Asset Infrastructure of Tomorrow.
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Connect with FINOVATECK to explore technology, infrastructure and strategic opportunities within the digital-asset ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Headquarters details */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-ink-850 border border-line shadow-2xs space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                  Headquarters Office
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {COMPANY_PROFILE.name}
                </h3>
                <div className="text-sm text-fg-body mt-0.5">
                  Muscat, Sultanate of Oman
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Corporate Location</div>
                    <div className="text-sm text-fg-body">Muscat Commercial District, Sultanate of Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Corporate Incorporation</div>
                    <div className="text-sm text-fg-body">Established 2 October 2025 · Muscat, Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Operating Hours</div>
                    <div className="text-sm text-fg-body">
                      Sunday – Thursday, 08:00 – 17:00{' '}
                      <span className="font-mono">({OPERATING_FACTS.timezone})</span>
                    </div>
                  </div>
                </div>

                {/* Full width: the address breaks mid-word in a half column. */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white">Inquiry Desk</div>
                    <a
                      href={`mailto:${INQUIRY_EMAIL}`}
                      className="text-sm font-mono text-gold-500 hover:underline break-words"
                    >
                      {INQUIRY_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-line text-xs text-fg-body leading-relaxed">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  All institutional correspondence is reviewed under corporate governance guidelines. FINOVATECK does not provide financial advice, trading accounts, or investment products.
                </p>
              </div>
            </div>
          </div>

          {/* What this office handles, and how to reach it */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-ink-850 border border-line shadow-2xs">
              <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Direct Your Inquiry
              </div>
              <h3 className="text-xl font-bold text-white mt-1 mb-4">
                Write to the corporate office
              </h3>

              <p className="text-sm text-fg-body leading-relaxed mb-5">
                Email the inquiry desk with your organization and the nature of your request. Correspondence is routed to the relevant team in Muscat.
              </p>

              <ul className="space-y-2.5 mb-6">
                {INQUIRY_TYPES.map((type) => (
                  <li key={type} className="flex items-start gap-2.5 text-sm text-fg-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 shrink-0 mt-[0.45rem]" />
                    <span>{type}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${INQUIRY_EMAIL}`}
                className="btn-primary w-full px-5 py-3.5 text-base group"
              >
                <span>Email the Inquiry Desk</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
