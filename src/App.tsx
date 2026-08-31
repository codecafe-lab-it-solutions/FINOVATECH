import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HeroStats } from './components/HeroStats';
import { AboutSection } from './components/AboutSection';
import { FacilityReelsViewer } from './components/FacilityReelsViewer';
import { BusinessPillars } from './components/BusinessPillars';
import { BitcoinMiningSection } from './components/BitcoinMiningSection';
import { MiningInfrastructure } from './components/MiningInfrastructure';
import { TechVisualization } from './components/TechVisualization';
import { OperatingFramework } from './components/OperatingFramework';
import { OmanMuscatSection } from './components/OmanMuscatSection';
import { LeadershipSection } from './components/LeadershipSection';
import { OperationalTimeline } from './components/OperationalTimeline';
import { WhyFinovatech } from './components/WhyFinovatech';
import { CorporateTransparency } from './components/CorporateTransparency';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { AboutPage } from './views/AboutPage';
import { MiningPage } from './views/MiningPage';
import { InfrastructurePage } from './views/InfrastructurePage';
import { OperationsPage } from './views/OperationsPage';
import { LeadershipPage } from './views/LeadershipPage';
import { ContactPage } from './views/ContactPage';

import { LoginScreen } from './components/LoginScreen';
import { InvestorPortal } from './components/investor/InvestorPortal';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  
  const [isInvestorLoggedIn, setIsInvestorLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('finovatech_investor_auth') === 'true';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('finovatech_admin_auth') === 'true';
  });

  // Handle URL hash changes for deep linking while ensuring default is always 'home'
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'mining', 'infrastructure', 'operations', 'leadership', 'contact', 'login', 'portal', 'admin-portal'].includes(hash)) {
        if (hash === 'portal' && !isInvestorLoggedIn) {
          setCurrentRoute('login');
        } else if (hash === 'admin-portal' && !isAdminLoggedIn) {
          setCurrentRoute('login');
        } else {
          setCurrentRoute(hash as PageRoute);
        }
      } else {
        setCurrentRoute('home');
      }
    };

    // If there is any stale hash on initial fresh load, normalize to home
    if (window.location.hash === '#about' && !sessionStorage.getItem('finovatech_navigated')) {
      window.location.hash = '';
      setCurrentRoute('home');
    } else {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isInvestorLoggedIn, isAdminLoggedIn]);

  const handleNavigate = (route: PageRoute) => {
    sessionStorage.setItem('finovatech_navigated', 'true');
    if (route === 'portal' && !isInvestorLoggedIn) {
      setCurrentRoute('login');
      window.location.hash = 'login';
      return;
    }

    if (route === 'admin-portal' && !isAdminLoggedIn) {
      setCurrentRoute('login');
      window.location.hash = 'login';
      return;
    }

    setCurrentRoute(route);
    if (route === 'home') {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInvestorLoginSuccess = () => {
    setIsInvestorLoggedIn(true);
    localStorage.setItem('finovatech_investor_auth', 'true');
    setCurrentRoute('portal');
    window.location.hash = 'portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('finovatech_admin_auth', 'true');
    setCurrentRoute('admin-portal');
    window.location.hash = 'admin-portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsInvestorLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('finovatech_investor_auth');
    localStorage.removeItem('finovatech_admin_auth');
    setCurrentRoute('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Portal, render the full-screen sovereign Admin Portal
  if (currentRoute === 'admin-portal' && isAdminLoggedIn) {
    return (
      <AdminPortal
        onLogout={handleLogout}
        onNavigateHome={() => handleNavigate('home')}
      />
    );
  }

  // If in Investor Portal, render the full-screen sovereign Investor portal
  if (currentRoute === 'portal' && isInvestorLoggedIn) {
    return (
      <InvestorPortal
        onLogout={handleLogout}
        onNavigateWebsite={() => handleNavigate('home')}
      />
    );
  }

  // If in Login Screen, render Login view with both Investor and Admin capabilities
  if (currentRoute === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-[#070B14] text-gray-100">
        <LoginScreen
          onLoginSuccess={handleInvestorLoginSuccess}
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onNavigateHome={() => handleNavigate('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111827] selection:bg-[#F7931A]/20 selection:text-[#111827]">
      {/* Sticky Global Navigation */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main Page Routing Router View */}
      <main className="grow">
        {currentRoute === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <HeroStats />
            <AboutSection onNavigate={handleNavigate} />
            <FacilityReelsViewer />
            <BusinessPillars onNavigate={handleNavigate} />
            <BitcoinMiningSection onNavigate={handleNavigate} />
            <MiningInfrastructure onNavigate={handleNavigate} />
            <TechVisualization />
            <OperatingFramework onNavigate={handleNavigate} />
            <OmanMuscatSection onNavigate={handleNavigate} />
            <LeadershipSection onNavigate={handleNavigate} />
            <OperationalTimeline onNavigate={handleNavigate} />
            <WhyFinovatech onNavigate={handleNavigate} />
            <CorporateTransparency onNavigate={handleNavigate} />
            <ContactSection />
          </>
        )}

        {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentRoute === 'mining' && <MiningPage onNavigate={handleNavigate} />}
        {currentRoute === 'infrastructure' && <InfrastructurePage onNavigate={handleNavigate} />}
        {currentRoute === 'operations' && <OperationsPage onNavigate={handleNavigate} />}
        {currentRoute === 'leadership' && <LeadershipPage onNavigate={handleNavigate} />}
        {currentRoute === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      {/* Institutional Dark Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
