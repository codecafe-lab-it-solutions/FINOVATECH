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
    <section id="contact-section" className="py-20 lg:py-28 bg-[#F8F9FA] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Institutional Inquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Let's Build the Digital Asset Infrastructure of Tomorrow.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Connect with FINOVATECH to explore technology, infrastructure and strategic opportunities within the digital-asset ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Details & Muscat Headquarters Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-5">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                  Headquarters Office
                </div>
                <h3 className="text-xl font-bold text-[#111827] mt-1">
                  {COMPANY_PROFILE.name}
                </h3>
                <div className="text-xs font-mono text-gray-500 mt-0.5">
                  Muscat, Sultanate of Oman
                </div>
              </div>

              <div className="space-y-3 pt-2 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F7931A] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Corporate Location</div>
                    <div className="text-xs text-gray-500">Muscat Commercial District, Sultanate of Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-[#F7931A] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Corporate Incorporation</div>
                    <div className="text-xs text-gray-500">Established 2 October 2025 • Muscat, Oman</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F7931A] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Official Inquiry Desk</div>
                    <div className="text-xs font-mono text-gray-700">corporate@finovatech-mining.om</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
                <div className="font-bold text-gray-800">Operating Hours & Timezone</div>
                <div>Sunday – Thursday: 08:00 – 17:00 (GST / UTC+4)</div>
              </div>
            </div>

            {/* Institutional Compliance Notice */}
            <div className="p-5 rounded-xl bg-white border border-gray-200 text-xs text-gray-500 flex items-start gap-3">
              <Shield className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <p>
                All institutional correspondence is reviewed under corporate governance guidelines. FINOVATECH does not provide financial advice, trading accounts, or investment products.
              </p>
            </div>

          </div>

          {/* Right: Contact / Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-xs">
              
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Thank you for reaching out to FINOVATECH Mining Company. Your correspondence has been logged with our corporate office in Muscat, Oman.
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-900 transition-colors cursor-pointer mt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111827] tracking-tight">
                      Corporate Correspondence Form
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Direct inquiries to the FINOVATECH operational and leadership office.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                        Full Name *
                      </label>
                      <input
                        id="contact-fullname"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Tariq Al-Harthy"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#111827] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                        Organization / Entity *
                      </label>
                      <input
                        id="contact-org"
                        type="text"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Gulf Energy Infrastructure"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#111827] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                        Corporate Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#111827] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 focus:outline-hidden focus:border-[#111827] focus:bg-white transition-all"
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
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 font-mono">
                      Message / Subject of Inquiry *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline the nature of your inquiry regarding FINOVATECH digital infrastructure operations..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-[#111827] focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white text-sm font-semibold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {submitting ? (
                      <span>Transmitting Correspondence...</span>
                    ) : (
                      <>
                        <span>Contact FINOVATECH</span>
                        <Send className="w-4 h-4 text-[#F7931A]" />
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
