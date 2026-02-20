
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import LegalNoticeModal from './LegalNoticeModal';
import SalesTermsModal from './SalesTermsModal';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  active: boolean;
  color: string;
}

const Footer: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const { isAdmin } = useAdmin();
  
  const [copyrightText, setCopyrightText] = useState(`Basile Kadjolo. Lomé, Togo. Tous droits réservés.`);
  const [isEditingCopyright, setIsEditingCopyright] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: 'fb', name: 'Facebook', url: 'https://facebook.com', active: true, color: 'hover:text-blue-500', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
    { id: 'ig', name: 'Instagram', url: 'https://instagram.com', active: true, color: 'hover:text-pink-500', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { id: 'tk', name: 'TikTok', url: 'https://tiktok.com', active: true, color: 'hover:text-cyan-400', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.3 2.97-6.07 6.26-6.02 1.37.03 2.71.5 3.79 1.34V.02z"/></svg> },
    { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com', active: true, color: 'hover:text-blue-700', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
    { id: 'yt', name: 'YouTube', url: 'https://youtube.com', active: true, color: 'hover:text-red-600', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.499-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  ]);

  useEffect(() => {
    const savedCopyright = localStorage.getItem('basile_copyright_text');
    if (savedCopyright) setCopyrightText(savedCopyright);

    const savedSocials = localStorage.getItem('basile_social_links');
    if (savedSocials) {
      const parsed = JSON.parse(savedSocials);
      setSocialLinks(prev => prev.map(p => {
        const found = parsed.find((item: any) => item.id === p.id);
        return found ? { ...p, url: found.url, active: found.active } : p;
      }));
    }
  }, []);

  const handleSaveCopyright = () => {
    localStorage.setItem('basile_copyright_text', copyrightText);
    setIsEditingCopyright(false);
  };

  const handleUpdateSocial = (id: string, url: string, active: boolean) => {
    const updated = socialLinks.map(s => s.id === id ? { ...s, url, active } : s);
    setSocialLinks(updated);
  };

  const saveSocialLinks = () => {
    localStorage.setItem('basile_social_links', JSON.stringify(socialLinks.map(({ id, url, active }) => ({ id, url, active }))));
    setIsSocialModalOpen(false);
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-20 pb-10 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 text-left">
            <h3 className="text-3xl font-bold mb-6">BASILE<span className="text-orange-500">KADJOLO</span></h3>
            <p className="text-slate-400 max-w-sm mb-8">Basé à Lomé, Togo. Expert digital dédié à la transformation visuelle et stratégique de votre business.</p>
            
            {/* Social Media Links Display */}
            <div className="flex flex-wrap gap-4 mt-6">
              {socialLinks.filter(s => s.active).map(social => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-white/10 hover:-translate-y-1 shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => setIsSocialModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  title="Gérer les réseaux sociaux"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="text-left">
            <h4 className="font-bold mb-6 uppercase text-xs text-orange-500 tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#home" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#boutique" className="hover:text-white transition-colors">Boutique</a></li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="font-bold mb-6 uppercase text-xs text-orange-500 tracking-widest">Légal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>
                <button 
                  onClick={() => setIsLegalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Mentions Légales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsPrivacyOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Confidentialité
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSalesOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Conditions de Vente
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 flex flex-col items-center gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-3">
            {isEditingCopyright ? (
              <div className="flex gap-2 items-center bg-slate-800 p-2 rounded-xl border border-white/10">
                <input 
                  type="text" 
                  value={copyrightText} 
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="bg-transparent border-none outline-none text-white px-2 w-64"
                />
                <button onClick={handleSaveCopyright} className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold uppercase text-[9px]">Enregistrer</button>
              </div>
            ) : (
              <p className="flex items-center gap-2">
                © {new Date().getFullYear()} {copyrightText}
                {isAdmin && (
                  <button onClick={() => setIsEditingCopyright(true)} className="text-blue-400 hover:text-white transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Social Media Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setIsSocialModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative z-10 shadow-2xl animate-fade-in-up text-left overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Mes Réseaux Sociaux</h3>
            <div className="space-y-6">
              {socialLinks.map((social) => (
                <div key={social.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-900">{social.icon}</div>
                      <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest">{social.name}</span>
                    </div>
                    <label className="flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="w-5 h-5 accent-blue-600" 
                         checked={social.active} 
                         onChange={(e) => handleUpdateSocial(social.id, social.url, e.target.checked)} 
                       />
                       <span className="ml-2 text-[9px] font-black uppercase text-slate-400">Afficher</span>
                    </label>
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Lien ${social.name}`} 
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-xs text-slate-600 focus:border-blue-500 transition-colors"
                    value={social.url}
                    onChange={(e) => handleUpdateSocial(social.id, e.target.value, social.active)}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-8">
              <button onClick={() => setIsSocialModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase text-xs">Annuler</button>
              <button onClick={saveSocialLinks} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-xl shadow-blue-100">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />
      <LegalNoticeModal 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
      />
      <SalesTermsModal 
        isOpen={isSalesOpen} 
        onClose={() => setIsSalesOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
