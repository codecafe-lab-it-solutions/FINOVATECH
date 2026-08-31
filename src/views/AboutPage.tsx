import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { AboutSection } from '../components/AboutSection';
import { FacilityReelsViewer } from '../components/FacilityReelsViewer';
import { CorporateTransparency } from '../components/CorporateTransparency';
import { OmanMuscatSection } from '../components/OmanMuscatSection';
import { WhyFinovatech } from '../components/WhyFinovatech';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="About FINOVATECH"
        badge="Corporate Profile & Infrastructure"
        title="Institutional Digital Infrastructure from Muscat"
        subtitle="FINOVATECH Mining Company develops and operates purpose-built computing infrastructure supporting the global digital-asset ecosystem with operational discipline."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Headquarters', value: 'Muscat, Oman' },
          { label: 'Operating Horizon', value: '4-Year Lease Term' },
          { label: 'Infrastructure Standard', value: 'Industrial High-Density' },
        ]}
        onNavigate={onNavigate}
      />
      <AboutSection showExtended={true} />
      <FacilityReelsViewer />
      <OmanMuscatSection onNavigate={onNavigate} />
      <CorporateTransparency onNavigate={onNavigate} />
      <WhyFinovatech onNavigate={onNavigate} />
    </div>
  );
};
