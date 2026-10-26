import React, { useState } from 'react';
import { Mail, MapPin, Building, Send, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/companyData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    category: 'Infrastructure & Operations',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section id="contact-section" className="py-20 lg:py-28 bg-ink-900 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
              Institutional Inquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let's Build the Digital Asset Infrastructure of Tomorrow.
          </h2>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            Connect with FINOVATECK to explore technology, infrastructure and strategic opportunities within the digital-asset ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Details & Muscat Headquarters Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-ink-850 border border-line shadow-2xs space-y-5">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-fg-muted">
                  Headquarters Office
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {COMPANY_PROFILE.name}
                </h3>
                <div className="text-xs font-mono text-fg-muted mt-0.5">
                  Muscat, Sultanate of Oman
                </div>
              </div>

              <div className="space-y-3 pt-2 text-sm text-fg-muted">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Corporate Location</div>
                    <div className="text-xs text-fg-muted">Muscat Commercial District, Sultanate of Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Corporate Incorporation</div>
                    <div className="text-xs text-fg-muted">Established 2 October 2025 • Muscat, Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Official Inquiry Desk</div>
                    <div className="text-xs font-mono text-fg-body">corporate@finovateck-mining.om</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-900 border border-line text-xs text-fg-muted space-y-1">
                <div className="font-bold text-fg-body">Operating Hours & Timezone</div>
                <div>Sunday – Thursday: 08:00 – 17:00 (GST / UTC+4)</div>
              </div>
            </div>

            {/* Institutional Compliance Notice */}
            <div className="p-5 rounded-xl bg-ink-850 border border-line text-xs text-fg-muted flex items-start gap-3">
              <Shield className="w-4 h-4 text-fg-muted shrink-0 mt-0.5" />
              <p>
                All institutional correspondence is reviewed under corporate governance guidelines. FINOVATECK does not provide financial advice, trading accounts, or investment products.
              </p>
            </div>

          </div>

          {/* Right: Contact / Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-ink-850 border border-line p-6 sm:p-8 shadow-xs">
              
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-fg-muted max-w-md mx-auto">
                    Thank you for reaching out to FINOVATECK Mining Company. Your correspondence has been logged with our corporate office in Muscat, Oman.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        organization: '',
                        email: '',
                        category: 'Infrastructure & Operations',
                        message: '',
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-xs font-semibold text-white transition-colors cursor-pointer mt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Corporate Correspondence Form
                    </h3>
                    <p className="text-xs text-fg-muted mt-0.5">
                      Direct inquiries to the FINOVATECK operational and leadership office.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-fg-body uppercase tracking-wider mb-1.5 font-mono">
                        Full Name *
                      </label>
                      <input
                        id="contact-fullname"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Tariq Al-Harthy"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-line text-sm text-white placeholder:text-fg-muted focus:outline-hidden focus:border-gold-500 focus:bg-ink-850 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-fg-body uppercase tracking-wider mb-1.5 font-mono">
                        Organization / Entity *
                      </label>
                      <input
                        id="contact-org"
                        type="text"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Gulf Energy Infrastructure"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-line text-sm text-white placeholder:text-fg-muted focus:outline-hidden focus:border-gold-500 focus:bg-ink-850 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-fg-body uppercase tracking-wider mb-1.5 font-mono">
                        Corporate Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-line text-sm text-white placeholder:text-fg-muted focus:outline-hidden focus:border-gold-500 focus:bg-ink-850 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-fg-body uppercase tracking-wider mb-1.5 font-mono">
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-line text-sm text-white focus:outline-hidden focus:border-gold-500 focus:bg-ink-850 transition-all"
                      >
                        <option value="Infrastructure & Operations">Infrastructure & Operations</option>
                        <option value="Technology & Hardware">Technology & Hardware</option>
                        <option value="Strategic Collaboration">Strategic Collaboration</option>
                        <option value="Corporate Governance">Corporate Governance</option>
                        <option value="General Information">General Information</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-fg-body uppercase tracking-wider mb-1.5 font-mono">
                      Message / Subject of Inquiry *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline the nature of your inquiry regarding FINOVATECK digital infrastructure operations..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-line text-sm text-white placeholder:text-fg-muted focus:outline-hidden focus:border-gold-500 focus:bg-ink-850 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[linear-gradient(180deg,#F4E183_0%,#E2C873_42%,#CCA84F_100%)] hover:brightness-110 text-black text-sm font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {submitting ? (
                      <span>Transmitting Correspondence...</span>
                    ) : (
                      <>
                        <span>Contact FINOVATECK</span>
                        <Send className="w-4 h-4 text-gold-500" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
