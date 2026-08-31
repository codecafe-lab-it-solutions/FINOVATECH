import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ContactSection } from '../components/ContactSection';
import { CorporateTransparency } from '../components/CorporateTransparency';
import { PageRoute } from '../types';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="Corporate Inquiries"
        badge="Institutional Communications Desk"
        title="Connect with FINOVATECH Mining Company"
        subtitle="Direct your institutional inquiries regarding computing operations, digital asset infrastructure, or strategic collaboration to our Muscat headquarters."
        backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Headquarters', value: 'Muscat, Sultanate of Oman' },
          { label: 'Response Window', value: 'Within 24 Hours' },
          { label: 'Institutional Desk', value: 'Operational & Governance' },
        ]}
        onNavigate={onNavigate}
      />
      <ContactSection />
      <CorporateTransparency onNavigate={onNavigate} />
    </div>
  );
};
