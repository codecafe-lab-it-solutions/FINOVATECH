import React from 'react';
import { MapPin, Globe, Compass, Shield, Building, ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../types';

interface OmanMuscatSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OmanMuscatSection: React.FC<OmanMuscatSectionProps> = ({ onNavigate }) => {
  return (
    <section id="oman-muscat-section" className="py-20 lg:py-28 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Strategic Geography
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Operating from Muscat. Connected to a Global Digital Economy.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Headquartered in Muscat, Sultanate of Oman, FINOVATECK operates from a strategically positioned market connecting the Middle East with global technology and digital-asset ecosystems.
          </p>
        </div>

        {/* 2-Column Geographic & Strategic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Strategic Pillars */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#111827] shadow-2xs">
                  <MapPin className="w-5 h-5 text-[#F7931A]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Muscat Global Gateway
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    23°36' N, 58°35' E • Sultanate of Oman
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Muscat offers world-class telecommunication networks, established international commercial governance, and a growing technological ecosystem fostering high-density digital infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                <div className="text-xs font-mono font-bold uppercase text-gray-400 mb-1">
                  Connectivity
                </div>
                <div className="text-base font-bold text-gray-900">
                  Subsea Cable Hubs
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Direct low-latency transit to European, Asian, and Gulf digital backbones.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                <div className="text-xs font-mono font-bold uppercase text-gray-400 mb-1">
                  Grid Stability
                </div>
                <div className="text-base font-bold text-gray-900">
                  Industrial Power
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Robust electrical infrastructure engineered for continuous high-load industrial demands.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900">Headquarters Registered:</span> Muscat, Sultanate of Oman
              </div>
              <span className="font-mono text-gray-500">Established 2 Oct 2025</span>
            </div>

          </div>

          {/* Right Map & Network Visualization */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-[#0F172A] border border-gray-800 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
              
              {/* Top Bar of Map Graphic */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse"></span>
                  <span className="font-bold tracking-wider text-gray-200">REGIONAL NETWORK TOPOLOGY</span>
                </div>
                <span className="text-gray-400">NODE: MCT_HQ</span>
              </div>

              {/* Stylized SVG Map & Routing Lines */}
              <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
                
                {/* SVG Regional Graph */}
                <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                  
                  {/* Subtle Grid Lines */}
                  <line x1="50" y1="50" x2="450" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  
                  <line x1="100" y1="20" x2="100" y2="280" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="250" y1="20" x2="250" y2="280" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="400" y1="20" x2="400" y2="280" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                  {/* Connecting Network Arcs radiating from Muscat (x: 270, y: 170) */}
                  {/* Europe route */}
                  <path d="M 270 170 Q 180 80 120 70" stroke="#F7931A" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Asia / Singapore route */}
                  <path d="M 270 170 Q 360 200 430 190" stroke="#F7931A" strokeWidth="1.5" strokeDasharray="4 4" className="animate-data-flow" />
                  {/* Gulf Regional route */}
                  <path d="M 270 170 Q 230 130 190 120" stroke="#60A5FA" strokeWidth="1.2" />
                  {/* North America consensus route */}
                  <path d="M 270 170 Q 150 40 70 50" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Remote Nodes */}
                  <circle cx="120" cy="70" r="4" fill="#64748B" />
                  <text x="120" y="55" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">FRANKFURT</text>

                  <circle cx="430" cy="190" r="4" fill="#64748B" />
                  <text x="430" y="210" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">SINGAPORE</text>

                  <circle cx="190" cy="120" r="4" fill="#64748B" />
                  <text x="190" y="105" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">GULF HUB</text>

                  {/* Muscat Primary Node */}
                  <circle cx="270" cy="170" r="18" fill="#F7931A" fillOpacity="0.15" />
                  <circle cx="270" cy="170" r="10" fill="#F7931A" fillOpacity="0.3" />
                  <circle cx="270" cy="170" r="5" fill="#F7931A" />
                  
                  <text x="270" y="205" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    MUSCAT, OMAN
                  </text>
                  <text x="270" y="220" fill="#F7931A" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    FINOVATECK HQ
                  </text>
                </svg>

              </div>

              {/* Bottom Telemetry Metrics */}
              <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-gray-900/80 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">TIMEZONE</div>
                  <div className="font-bold text-gray-200 mt-0.5">GST (UTC+4)</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/80 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">LATENCY</div>
                  <div className="font-bold text-emerald-400 mt-0.5">&lt; 18ms Gulf</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/80 border border-gray-800">
                  <div className="text-gray-400 text-[10px]">STRATUM POOL</div>
                  <div className="font-bold text-[#F7931A] mt-0.5">Global Tier 1</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
