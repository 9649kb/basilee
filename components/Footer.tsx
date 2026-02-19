
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import LegalNoticeModal from './LegalNoticeModal';
import SalesTermsModal from './SalesTermsModal';

const Footer: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const { isAdmin } = useAdmin();
  
  const [copyrightText, setCopyrightText] = useState(`Basile Kadjolo. Lomé, Togo. Tous droits réservés.`);
  const [isEditingCopyright, setIsEditingCopyright] = useState(false);

  useEffect(() => {
    const savedCopyright = localStorage.getItem('basile_copyright_text');
    if (savedCopyright) setCopyrightText(savedCopyright);
  }, []);

  const handleSaveCopyright = () => {
    localStorage.setItem('basile_copyright_text', copyrightText);
    setIsEditingCopyright(false);
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 text-left">
            <h3 className="text-3xl font-bold mb-6">BASILE<span className="text-orange-500">KADJOLO</span></h3>
            <p className="text-slate-400 max-w-sm mb-8">Basé à Lomé, Togo. Expert digital dédié à la transformation visuelle et stratégique de votre business.</p>
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
