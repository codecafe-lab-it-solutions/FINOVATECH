import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, ChevronRight, MapPin, Building2, ShieldCheck, Phone, Mail } from 'lucide-react';
import { PageRoute } from '../types';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const navLinks: { label: string; route: PageRoute; description: string }[] = [
    { label: 'Home', route: 'home', description: 'Overview & facility highlights' },
    { label: 'About', route: 'about', description: 'Company history & Muscat base' },
    { label: 'Bitcoin Mining', route: 'mining', description: 'Industrial SHA-256 compute' },
    { label: 'Infrastructure', route: 'infrastructure', description: 'Power, pods & cooling design' },
    { label: 'Operations', route: 'operations', description: 'Operating framework & timeline' },
    { label: 'Leadership', route: 'leadership', description: 'Executive governance & charter' },
    { label: 'Contact', route: 'contact', description: 'Institutional inquiry & office' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled || mobileMenuOpen
            ? 'bg-ink-900/95 backdrop-blur-md border-b border-line/90 shadow-xs'
            : 'bg-ink-950/95 backdrop-blur-xs border-b border-line/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">
            
            {/* Logo / Wordmark */}
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer focus:outline-hidden py-1 shrink-0 transition-opacity hover:opacity-95"
              aria-label="FINOVATECK Home"
            >
              <img
                src="/logoreal.png"
                alt="FINOVATECK MINING COMPANY"
                className="w-44 h-11 sm:w-[216px] sm:h-12 object-cover rounded-md bg-black block"
              />
            </button>

            {/* Desktop Navigation Links - Single line without wrapping */}
            <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
              {navLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    id={`nav-link-${item.route}`}
                    onClick={() => handleNavClick(item.route)}
                    className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-[12.5px] xl:text-[13.5px] font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-ink-800 font-semibold shadow-2xs'
                        : 'text-fg-muted hover:text-white hover:bg-ink-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right Action */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-800/80 border border-line text-[11px] text-fg-muted font-mono whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Muscat HQ Active</span>
              </div>

              <button
                id="navbar-investor-login-btn"
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center justify-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-200 border border-gold-500/30 text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap min-h-[38px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Login</span>
              </button>
            </div>

            {/* Mobile Controls (Menu Toggle & Quick Action) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              <button
                id="mobile-quick-login"
                onClick={() => handleNavClick('login')}
                className="px-2.5 py-1.5 rounded-lg bg-gold-500 text-black text-[11px] sm:text-xs font-bold font-mono tracking-tight flex items-center gap-1 shadow-2xs min-h-[38px] cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Login</span>
              </button>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-fg-body bg-ink-900 hover:bg-ink-700 border border-line flex items-center justify-center focus:outline-hidden cursor-pointer shrink-0 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-fg-body" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Rendered directly under header with independent fixed portal) */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-overlay"
          className="fixed inset-x-0 top-14 sm:top-16 bottom-0 z-40 lg:hidden flex flex-col bg-ink-850 border-t border-line overflow-y-auto animate-in fade-in duration-200"
          style={{ height: 'calc(100dvh - 56px)' }}
        >
          {/* Menu Items */}
          <div className="flex-1 p-3.5 sm:p-5 space-y-1">
            <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-mono font-bold uppercase tracking-wider text-fg-muted">
              <span>Navigation Menu</span>
              <span className="text-gold-500">7 SECTIONS</span>
            </div>

            {navLinks.map((item, index) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`mobile-nav-item-${item.route}`}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer min-h-[52px] ${
                    isActive
                      ? 'bg-ink-800 text-white shadow-sm ring-1 ring-gold-500/40'
                      : 'text-fg-body hover:bg-ink-800 active:bg-ink-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isActive ? 'bg-gold-500 text-black' : 'bg-ink-800 text-fg-muted'
                    }`}>
                      0{index + 1}
                    </div>
                    <div>
                      <div className={`text-sm sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-white'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-fg-body' : 'text-fg-muted'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-500' : 'text-fg-muted'}`} />
                </button>
              );
            })}
          </div>

          {/* Drawer Footer Information */}
          <div className="p-3.5 sm:p-5 bg-white border-t border-line space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-ink-850 border border-line shadow-2xs">
                <div className="text-[10px] text-fg-muted uppercase">Headquarters</div>
                <div className="text-white font-bold mt-0.5 truncate">Muscat, Oman</div>
              </div>
              <div className="p-2.5 rounded-xl bg-ink-850 border border-line shadow-2xs">
                <div className="text-[10px] text-fg-muted uppercase">Facility Node</div>
                <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  MCT-01 Active
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                id="mobile-drawer-login-action"
                onClick={() => handleNavClick('login')}
                className="w-full py-3 px-3 rounded-xl bg-[linear-gradient(180deg,#F4E183_0%,#E2C873_42%,#CCA84F_100%)] hover:brightness-110 text-black font-bold text-xs font-mono tracking-wide flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
              >
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Login</span>
              </button>
            </div>

            <div className="text-center text-[10px] font-mono text-fg-muted">
              FINOVATECK MINING COMPANY • EST. 2025 • SULTANATE OF OMAN
            </div>
          </div>
        </div>
      )}
    </>
  );
};


