import React from 'react';
import { MapPin } from 'lucide-react';
import { PageRoute } from '../types';
import { OPERATING_FACTS } from '../data/companyData';

interface OmanMuscatSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OmanMuscatSection: React.FC<OmanMuscatSectionProps> = ({ onNavigate }) => {
  return (
    <section id="oman-muscat-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Strategic Geography
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Operating from Muscat. Connected to a Global Digital Economy.
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Headquartered in Muscat, Sultanate of Oman, FINOVATECK operates from a strategically positioned market connecting the Middle East with global technology and digital-asset ecosystems.
          </p>
        </div>

        {/* 2-Column Geographic & Strategic Layout */}
        {/* items-center dropped the left stack ~80px below the map card,
            and the left stack had no gutter of its own. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Strategic Pillars */}
          <div className="lg:col-span-6 space-y-4">

            <div className="p-6 rounded-2xl bg-ink-850 border border-line space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ink-850 border border-line flex items-center justify-center text-white shadow-2xs">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Muscat Global Gateway
                  </h3>
                  <p className="text-xs text-fg-body">
                    <span className="font-mono">{OPERATING_FACTS.coordinates}</span> · Sultanate of Oman
                  </p>
                </div>
              </div>
              <p className="text-sm text-fg-body leading-relaxed">
                Muscat offers world-class telecommunication networks, established international commercial governance, and a growing technological ecosystem fostering high-density digital infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-ink-850 border border-line">
                <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500 mb-1">
                  Connectivity
                </div>
                <div className="text-base font-bold text-white">
                  Subsea Cable Hubs
                </div>
                <p className="text-xs text-fg-body mt-1 leading-relaxed">
                  Direct low-latency transit to European, Asian, and Gulf digital backbones.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-ink-850 border border-line">
                <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500 mb-1">
                  Grid Stability
                </div>
                <div className="text-base font-bold text-white">
                  Industrial Power
                </div>
                <p className="text-xs text-fg-body mt-1 leading-relaxed">
                  Robust electrical infrastructure engineered for continuous high-load industrial demands.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-ink-850 border border-line text-xs text-fg-body flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-white">Headquarters registered:</span> Muscat, Sultanate of Oman
              </div>
              <span className="font-mono">2 Oct 2025</span>
            </div>

          </div>

          {/* Right Map & Network Visualization */}
          <div className="lg:col-span-6 space-y-6">

            <div className="relative rounded-2xl bg-ink-850 border border-line p-6 sm:p-8 text-white overflow-hidden shadow-xl">
              
              {/* Top Bar of Map Graphic */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-line text-xs">
                <span className="font-semibold uppercase tracking-eyebrow text-gold-500">
                  Regional Network Topology
                </span>
                <span className="text-fg-body">Illustrative</span>
              </div>

              {/* Stylized SVG Map & Routing Lines */}
              <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
                
                {/* SVG Regional Graph */}
                <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                  
                  {/* Subtle Grid Lines */}
                  <line x1="50" y1="50" x2="450" y2="50" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />
                  
                  <line x1="100" y1="20" x2="100" y2="280" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="250" y1="20" x2="250" y2="280" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="400" y1="20" x2="400" y2="280" stroke="#2A2F38" strokeDasharray="3 3" strokeWidth="0.5" />

                  {/* Connecting Network Arcs radiating from Muscat (x: 270, y: 170) */}
                  {/* Europe route */}
                  <path d="M 270 170 Q 180 80 120 70" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Asia / Singapore route */}
                  <path d="M 270 170 Q 360 200 430 190" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Gulf Regional route */}
                  <path d="M 270 170 Q 230 130 190 120" stroke="#8A6B1E" strokeWidth="1.2" />
                  {/* North America consensus route */}
                  <path d="M 270 170 Q 150 40 70 50" stroke="#4C5564" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Remote Nodes */}
                  <circle cx="120" cy="70" r="4" fill="#6E7686" />
                  <text x="120" y="54" fill="#B4B9C3" fontSize="12" textAnchor="middle">Frankfurt</text>

                  <circle cx="430" cy="190" r="4" fill="#6E7686" />
                  <text x="430" y="212" fill="#B4B9C3" fontSize="12" textAnchor="middle">Singapore</text>

                  {/* The Gulf node sat on the Europe arc, so its label
                      collided with the route line. */}
                  <circle cx="178" cy="128" r="4" fill="#6E7686" />
                  <text x="150" y="150" fill="#B4B9C3" fontSize="12" textAnchor="middle">Gulf</text>

                  {/* Muscat Primary Node */}
                  <circle cx="270" cy="170" r="18" fill="#D4AF37" fillOpacity="0.15" />
                  <circle cx="270" cy="170" r="10" fill="#D4AF37" fillOpacity="0.3" />
                  <circle cx="270" cy="170" r="5" fill="#D4AF37" />
                  
                  <text x="270" y="207" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                    Muscat, Oman
                  </text>
                  <text x="270" y="224" fill="#D4AF37" fontSize="12" textAnchor="middle">
                    FINOVATECK HQ
                  </text>
                </svg>

              </div>

              {/* Bottom Telemetry Metrics */}
              {/* Three values in three different colours; now one. */}
              <div className="mt-4 pt-4 border-t border-line grid grid-cols-3 gap-4 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-ink-800 border border-line">
                  <div className="text-fg-body uppercase tracking-eyebrow">Timezone</div>
                  <div className="font-bold font-mono text-white mt-1">{OPERATING_FACTS.timezone}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-ink-800 border border-line">
                  <div className="text-fg-body uppercase tracking-eyebrow">Gulf latency</div>
                  <div className="font-bold font-mono text-white mt-1">&lt; 18 ms</div>
                </div>
                <div className="p-2.5 rounded-xl bg-ink-800 border border-line">
                  <div className="text-fg-body uppercase tracking-eyebrow">Stratum</div>
                  <div className="font-bold text-white mt-1">V2</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
