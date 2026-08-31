import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { LeadershipSection } from '../components/LeadershipSection';
import { CorporateTransparency } from '../components/CorporateTransparency';
import { WhyFinovatech } from '../components/WhyFinovatech';
import { PageRoute } from '../types';

interface LeadershipPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LeadershipPage: React.FC<LeadershipPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="Corporate Governance"
        badge="Executive Leadership & Transparency"
        title="Institutional Leadership & Governance"
        subtitle="Led by Rayees Ahmad Bhat, Managing Director, FINOVATECH is committed to transparent standards, operational discipline, and defined operational execution."
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Executive Leadership', value: 'Rayees Ahmad Bhat (MD)' },
          { label: 'Governance Standard', value: 'Audited Transparency' },
          { label: 'Jurisdiction', value: 'Muscat, Sultanate of Oman' },
        ]}
        onNavigate={onNavigate}
      />
      <LeadershipSection onNavigate={onNavigate} />
      <CorporateTransparency onNavigate={onNavigate} />
      <WhyFinovatech onNavigate={onNavigate} />
    </div>
  );
};
