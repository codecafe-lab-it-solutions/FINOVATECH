import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { OperatingFramework } from '../components/OperatingFramework';
import { OperationalTimeline } from '../components/OperationalTimeline';
import { WhyFinovatech } from '../components/WhyFinovatech';
import { PageRoute } from '../types';

interface OperationsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const OperationsPage: React.FC<OperationsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="Operations & Lifecycle"
        badge="NOC Telemetry & Systematic Governance"
        title="Disciplined Operating Framework & Timeline"
        subtitle="A centralized operating model orchestrating physical compute, regulated electrical input, continuous telemetry, and lifecycle execution."
        backgroundImage="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Network Operations', value: '24/7/365 NOC Telemetry' },
          { label: 'Load Management', value: 'Automated Dynamic Balancing' },
          { label: 'Lease Horizon', value: '48-Month Defined Horizon' },
        ]}
        onNavigate={onNavigate}
      />
      <OperatingFramework onNavigate={onNavigate} />
      <OperationalTimeline onNavigate={onNavigate} />
      <WhyFinovatech onNavigate={onNavigate} />
    </div>
  );
};
