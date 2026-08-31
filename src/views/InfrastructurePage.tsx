import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { MiningInfrastructure } from '../components/MiningInfrastructure';
import { TechVisualization } from '../components/TechVisualization';
import { PageRoute } from '../types';

interface InfrastructurePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InfrastructurePage: React.FC<InfrastructurePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        category="Computing & Energy Infrastructure"
        badge="High-Density Power & Thermal Systems"
        title="Engineered Infrastructure Architecture"
        subtitle="Exploring the physical and digital infrastructure components powering high-density digital-asset operations in Muscat, Sultanate of Oman."
        backgroundImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2400&q=85"
        metrics={[
          { label: 'Power Grid', value: 'High-Voltage Regulated' },
          { label: 'Thermal Control', value: 'Precision Ducts & Immersion' },
          { label: 'Architecture', value: 'Containerized Modular Pods' },
        ]}
        onNavigate={onNavigate}
      />
      <MiningInfrastructure onNavigate={onNavigate} />
      <TechVisualization />
    </div>
  );
};
