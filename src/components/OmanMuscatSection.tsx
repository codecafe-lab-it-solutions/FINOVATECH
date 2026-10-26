import React from 'react';
import { MapPin, Globe, Compass, Shield, Building, ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../types';

interface OmanMuscatSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OmanMuscatSection: React.FC<OmanMuscatSectionProps> = ({ onNavigate }) => {
  return (
    <section id="oman-muscat-section" className="py-20 lg:py-28 bg-ink-950 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
              Strategic Geography
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Operating from Muscat. Connected to a Global Digital Economy.
          </h2>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            Headquartered in Muscat, Sultanate of Oman, FINOVATECK operates from a strategically positioned market connecting the Middle East with global technology and digital-asset ecosystems.
          </p>
        </div>

        {/* 2-Column Geographic & Strategic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Strategic Pillars */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="p-6 rounded-2xl bg-ink-950 border border-line space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ink-850 border border-line flex items-center justify-center text-white shadow-2xs">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Muscat Global Gateway
                  </h3>
                  <p className="text-xs text-fg-muted font-mono">
                    23°36' N, 58°35' E • Sultanate of Oman
                  </p>
                </div>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed">
                Muscat offers world-class telecommunication networks, established international commercial governance, and a growing technological ecosystem fostering high-density digital infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-ink-950 border border-line">
                <div className="text-xs font-mono font-bold uppercase text-fg-muted mb-1">
                  Connectivity
                </div>
                <div className="text-base font-bold text-white">
                  Subsea Cable Hubs
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  Direct low-latency transit to European, Asian, and Gulf digital backbones.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-ink-950 border border-line">
                <div className="text-xs font-mono font-bold uppercase text-fg-muted mb-1">
                  Grid Stability
                </div>
                <div className="text-base font-bold text-white">
                  Industrial Power
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  Robust electrical infrastructure engineered for continuous high-load industrial demands.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-ink-900 border border-line text-xs text-fg-muted flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Headquarters Registered:</span> Muscat, Sultanate of Oman
              </div>
              <span className="font-mono text-fg-muted">Established 2 Oct 2025</span>
            </div>

          </div>

          {/* Right Map & Network Visualization */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-ink-950 border border-line p-6 sm:p-8 text-white overflow-hidden shadow-xl">
              
              {/* Top Bar of Map Graphic */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-line text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                  <span className="font-bold tracking-wider text-fg-body">REGIONAL NETWORK TOPOLOGY</span>
                </div>
                <span className="text-fg-muted">NODE: MCT_HQ</span>
              </div>

              {/* Stylized SVG Map & Routing Lines */}
              <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
                
                {/* SVG Regional Graph */}
                <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                  
                  {/* Subtle Grid Lines */}
                  <line x1="50" y1="50" x2="450" y2="50" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />
                  
                  <line x1="100" y1="20" x2="100" y2="280" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="250" y1="20" x2="250" y2="280" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="400" y1="20" x2="400" y2="280" stroke="#2A2A2E" strokeDasharray="3 3" strokeWidth="0.5" />

                  {/* Connecting Network Arcs radiating from Muscat (x: 270, y: 170) */}
                  {/* Europe route */}
                  <path d="M 270 170 Q 180 80 120 70" stroke="#CCA84F" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Asia / Singapore route */}
                  <path d="M 270 170 Q 360 200 430 190" stroke="#CCA84F" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Gulf Regional route */}
                  <path d="M 270 170 Q 230 130 190 120" stroke="#E2C873" strokeWidth="1.2" />
                  {/* North America consensus route */}
                  <path d="M 270 170 Q 150 40 70 50" stroke="#8A8A93" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Remote Nodes */}
                  <circle cx="120" cy="70" r="4" fill="#8A8A93" />
                  <text x="120" y="55" fill="#8A8A93" fontSize="10" fontFamily="monospace" textAnchor="middle">FRANKFURT</text>

                  <circle cx="430" cy="190" r="4" fill="#8A8A93" />
                  <text x="430" y="210" fill="#8A8A93" fontSize="10" fontFamily="monospace" textAnchor="middle">SINGAPORE</text>

                  <circle cx="190" cy="120" r="4" fill="#8A8A93" />
                  <text x="190" y="105" fill="#8A8A93" fontSize="10" fontFamily="monospace" textAnchor="middle">GULF HUB</text>

                  {/* Muscat Primary Node */}
                  <circle cx="270" cy="170" r="18" fill="#CCA84F" fillOpacity="0.15" />
                  <circle cx="270" cy="170" r="10" fill="#CCA84F" fillOpacity="0.3" />
                  <circle cx="270" cy="170" r="5" fill="#CCA84F" />
                  
                  <text x="270" y="205" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    MUSCAT, OMAN
                  </text>
                  <text x="270" y="220" fill="#CCA84F" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    FINOVATECK HQ
                  </text>
                </svg>

              </div>

              {/* Bottom Telemetry Metrics */}
              <div className="mt-4 pt-4 border-t border-line grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-ink-850/80 border border-line">
                  <div className="text-fg-muted text-[10px]">TIMEZONE</div>
                  <div className="font-bold text-fg-body mt-0.5">GST (UTC+4)</div>
                </div>
                <div className="p-2 rounded-lg bg-ink-850/80 border border-line">
                  <div className="text-fg-muted text-[10px]">LATENCY</div>
                  <div className="font-bold text-emerald-400 mt-0.5">&lt; 18ms Gulf</div>
                </div>
                <div className="p-2 rounded-lg bg-ink-850/80 border border-line">
                  <div className="text-fg-muted text-[10px]">STRATUM POOL</div>
                  <div className="font-bold text-gold-500 mt-0.5">Global Tier 1</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
