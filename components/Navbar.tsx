
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const { isAdmin, currentAdmin, setIsLoginModalOpen, setIsSettingsModalOpen, logout } = useAdmin();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccessMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (!id || id === '#' || id.length < 2) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const element = document.querySelector(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: id === '#home' ? 0 : offsetPosition,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.warn("Erreur de défilement", id);
    }
  };

  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Boutique', href: '#boutique' },
    { name: 'À propos', href: '#about' },
    { name: 'Témoignages', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, '#home')}
          className={`text-2xl font-bold tracking-tighter transition-colors ${isScrolled ? 'text-blue-900' : 'text-white'}`}
        >
          BASILE<span className="text-orange-500">KADJOLO</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-orange-500 ${isScrolled ? 'text-slate-700' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowAccessMenu(!showAccessMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${isAdmin ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/10 text-white border-white/20 hover:border-blue-500/50'} ${isScrolled && !isAdmin ? 'text-slate-600 border-slate-200' : ''}`}
              >
                {/* Icône discrète pour les visiteurs, Nom pour les admins */}
                <span>{isAdmin ? `🔑 ${currentAdmin?.name.toUpperCase()}` : '👤'}</span>
                <svg className={`w-3 h-3 transition-transform ${showAccessMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {showAccessMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-down">
                  {!isAdmin ? (
                    <button 
                      onClick={() => { setIsLoginModalOpen(true); setShowAccessMenu(false); }}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-lg opacity-40">🔒</span>
                      Espace Admin
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setIsSettingsModalOpen(true); setShowAccessMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-lg">⚙️</span>
                        Équipe & Sécurité
                      </button>
                      <button 
                        onClick={() => { logout(); setShowAccessMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors border-t border-slate-50"
                      >
                        <span className="text-lg">🚪</span>
                        Déconnexion
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setShowAccessMenu(!showAccessMenu)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border-2 ${isAdmin ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/10 text-white border-white/20'}`}
          >
            {isAdmin ? currentAdmin?.name.split(' ')[0] : '👤'}
          </button>
          <button 
            className={`${isScrolled ? 'text-blue-900' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 absolute w-full shadow-lg animate-fade-in-down">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => scrollToSection(e, link.href)}
              className="block py-3 text-slate-700 font-semibold border-b last:border-0"
            >
              {link.name}
            </a>
          ))}
          
          <div className="mt-6 space-y-2">
            {!isAdmin ? (
              <button 
                onClick={() => { setIsLoginModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-4 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest"
              >
                🔒 Espace Admin
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setIsSettingsModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-4 bg-slate-100 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  ⚙️ Équipe & Sécurité
                </button>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-4 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
