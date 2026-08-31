import React from 'react';
import { HERO_STATS } from '../data/companyData';

export const HeroStats: React.FC = () => {
  return (
    <section id="hero-statistics" className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-gray-200">
          {HERO_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col ${
                idx === 0
                  ? 'md:pr-8'
                  : idx === HERO_STATS.length - 1
                  ? 'md:pl-8'
                  : 'md:px-8'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-xs text-gray-500 mt-0.5 font-normal">
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
