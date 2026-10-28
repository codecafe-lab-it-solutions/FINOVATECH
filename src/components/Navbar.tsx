import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
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
        /* The bar carries the same backdrop from the first pixel; only the
           hairline strengthens on scroll, so there is no colour jump. */
        className={`fixed top-0 left-0 right-0 z-50 bg-ink-950/85 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
          scrolled || mobileMenuOpen
            ? 'border-b border-line shadow-xs'
            : 'border-b border-line/50'
        }`}
      >
        {/* The bar spans the viewport rather than the 1200px content
            container, so the lockup sits near the left edge instead of
            floating ~350px in on a wide screen. */}
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">
            
            {/* Logo / Wordmark */}
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer focus:outline-hidden py-1 shrink-0 transition-opacity hover:opacity-95"
              aria-label="FINOVATECK Home"
            >
              {/* Transparent lockup without the tagline — the supplied asset
                  is a black plate whose edge showed against the bar, and its
                  tagline rendered at about 5px here. */}
              <img
                src="/logo-wordmark.png"
                alt="FINOVATECK Mining Company"
                width={1040}
                height={199}
                className="h-8 sm:h-9 w-auto object-contain block"
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
                    /* Active is a gold underline, not a grey pill — the pill
                       read as a disabled chip next to the gold brand. */
                    className={`relative px-2.5 xl:px-3.5 py-3 text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:rounded-full after:transition-colors ${
                      isActive
                        ? 'text-white font-semibold after:bg-gold-500'
                        : 'text-fg-body hover:text-white after:bg-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right Action */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-850 border border-line text-xs text-fg-body whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Muscat HQ Active</span>
              </div>

              <button
                id="navbar-investor-login-btn"
                onClick={() => handleNavClick('login')}
                className="btn-secondary px-4 py-2 text-sm whitespace-nowrap min-h-[38px]"
              >
                <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Login</span>
              </button>
            </div>

            {/* Mobile Controls (Menu Toggle & Quick Action) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              <button
                id="mobile-quick-login"
                onClick={() => handleNavClick('login')}
                className="btn-primary px-3 py-1.5 text-xs min-h-[38px]"
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
            <div className="flex items-center justify-between px-2 py-1 mb-1 text-xs font-semibold uppercase tracking-eyebrow text-fg-body">
              <span>Navigation</span>
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
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isActive ? 'bg-gold-500 text-black' : 'bg-ink-800 text-fg-body'
                    }`}>
                      0{index + 1}
                    </div>
                    <div>
                      <div className={`text-sm sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-white'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs leading-tight mt-0.5 ${isActive ? 'text-fg-body' : 'text-fg-muted'}`}>
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
          {/* This panel was authored bg-white, which rendered a white slab at
              the bottom of a dark drawer. */}
          <div className="p-3.5 sm:p-5 bg-ink-900 border-t border-line space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-ink-850 border border-line">
                <div className="text-xs text-fg-body uppercase tracking-eyebrow">Headquarters</div>
                <div className="text-white font-bold mt-0.5 truncate">Muscat, Oman</div>
              </div>
              <div className="p-2.5 rounded-xl bg-ink-850 border border-line">
                <div className="text-xs text-fg-body uppercase tracking-eyebrow">Facility Node</div>
                <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono">MCT-01</span>
                </div>
              </div>
            </div>

            <button
              id="mobile-drawer-login-action"
              onClick={() => handleNavClick('login')}
              className="btn-primary w-full py-3 px-3 text-sm min-h-[46px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login</span>
            </button>

            <div className="text-center text-xs text-fg-body">
              FINOVATECK Mining Company · Est. 2025 · Sultanate of Oman
            </div>
          </div>
        </div>
      )}
    </>
  );
};

