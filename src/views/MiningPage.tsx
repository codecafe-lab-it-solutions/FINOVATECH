import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { BitcoinMiningSection } from '../components/BitcoinMiningSection';
import { TechVisualization } from '../components/TechVisualization';
import { BusinessPillars } from '../components/BusinessPillars';
import { PageRoute } from '../types';

interface MiningPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const MiningPage: React.FC<MiningPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="Bitcoin Mining"
        badge="Industrial Proof-of-Work Operations"
        title="Industrial-Scale Bitcoin Mining Operations"
        subtitle="Executing continuous SHA-256 computational proof algorithms with high-efficiency ASIC deployments, disciplined electrical load management, and precision thermal control."
        backgroundImage="https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Algorithm', value: 'SHA-256 Proof-of-Work' },
          { label: 'Fleet Architecture', value: 'High-Efficiency ASICs' },
          { label: 'Operational Uptime', value: '99.85% Continuous' },
        ]}
        onNavigate={onNavigate}
      />
      <BitcoinMiningSection onNavigate={onNavigate} />
      <TechVisualization />
      <BusinessPillars onNavigate={onNavigate} />
    </div>
  );
};
