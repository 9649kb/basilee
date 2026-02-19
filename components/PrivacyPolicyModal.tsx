
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CONTENT = `01. Collecte des données
Dans le cadre de l'utilisation de mon site portfolio et de ma boutique digitale, je collecte les informations que vous nous fournissez volontairement via le formulaire de commande ou l'assistant IA : Identité (Nom, Prénom), Contact (WhatsApp), Transactions.

02. Utilisation des données
Vos données sont exclusivement utilisées pour traiter vos commandes, vous contacter pour le SAV et personnaliser votre expérience IA. Je ne vends jamais vos données à des tiers.

03. Conservation et Sécurité
Les données transmises via WhatsApp sont chiffrées. Les informations stockées localement sont protégées par les standards de sécurité web.

04. Vos Droits
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-moi directement via WhatsApp pour toute demande.`;

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAdmin();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('basile_privacy_policy');
    if (saved) setContent(saved);
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    setContent(tempContent);
    localStorage.setItem('basile_privacy_policy', tempContent);
    setIsEditing(false);
  };

  const startEditing = () => {
    setTempContent(content);
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full relative z-10 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto custom-scrollbar text-left text-slate-600 text-sm leading-relaxed">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="mb-10 flex justify-between items-start">
          <div>
            <span className="text-blue-600 font-black tracking-widest uppercase text-[10px] bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">Juridique</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Politique de <span className="text-blue-600">Confidentialité</span></h2>
          </div>
          {isAdmin && !isEditing && (
            <button onClick={startEditing} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Éditer
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <textarea 
              className="w-full h-96 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Annuler</button>
              <button onClick={handleSave} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">Sauvegarder</button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap space-y-8">
            {content.split('\n\n').map((section, idx) => {
              const [title, ...lines] = section.split('\n');
              return (
                <section key={idx}>
                  <h3 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3">
                    {title}
                  </h3>
                  <p>{lines.join('\n')}</p>
                </section>
              );
            })}
          </div>
        )}

        {!isEditing && (
          <div className="pt-6 border-t border-slate-100 mt-8">
            <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl">Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
