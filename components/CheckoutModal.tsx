
import React, { useState, useEffect } from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface CheckoutModalProps {
  item: {
    id: string;
    title: string;
    price: string;
    category: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ item, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numero: '',
    moyenPaiement: 'T-Money'
  });
  const [whatsappNum, setWhatsappNum] = useState(WHATSAPP_NUMBER);

  useEffect(() => {
    const savedNum = localStorage.getItem('basile_whatsapp_number');
    if (savedNum) setWhatsappNum(savedNum);
  }, []);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marquer l'item comme "commandé" localement pour changer l'état du bouton sur le site
    localStorage.setItem(`basile_ordered_${item.id}`, 'true');

    const message = `Bonjour Basile, je souhaite passer une commande :

📦 *Produit/Formation :* ${item.title}
💰 *Prix :* ${item.price}
🏷️ *Type :* ${item.category}

--- 👤 *INFOS CLIENT* ---
*Nom :* ${formData.nom.toUpperCase()}
*Prénom :* ${formData.prenom}
*Tél :* ${formData.numero}
*Paiement :* ${formData.moyenPaiement} ${formData.moyenPaiement === 'Autre pays' ? '(Client International 🌍)' : ''}

Merci de me confirmer la réception et la marche à suivre pour obtenir mon code de déblocage.`;

    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // On notifie les autres composants du changement de localStorage
    window.dispatchEvent(new Event('storage'));
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            📋
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Formulaire de Commande</h3>
          <p className="text-slate-500 text-xs mt-2">Validez vos infos pour recevoir votre code d'accès.</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100 border-l-4 border-l-blue-600">
           <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Article sélectionné :</p>
           <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</p>
           <p className="text-blue-600 font-black text-base mt-1">{item.price}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nom</label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold placeholder:text-slate-300"
                value={formData.nom}
                onChange={e => setFormData({...formData, nom: e.target.value})}
                placeholder="KOFFI"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Prénom</label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold placeholder:text-slate-300"
                value={formData.prenom}
                onChange={e => setFormData({...formData, prenom: e.target.value})}
                placeholder="Jean"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Téléphone (WhatsApp)</label>
            <input 
              required
              type="tel" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold placeholder:text-slate-300"
              value={formData.numero}
              onChange={e => setFormData({...formData, numero: e.target.value})}
              placeholder="Ex: +228 90..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Moyen de Paiement</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold appearance-none cursor-pointer"
              value={formData.moyenPaiement}
              onChange={e => setFormData({...formData, moyenPaiement: e.target.value})}
            >
              <option value="T-Money">T-Money (Togo)</option>
              <option value="Flooz">Flooz (Togo)</option>
              <option value="Wave">Wave</option>
              <option value="Autre pays">Hors Togo (International)</option>
              <option value="Espèces">Paiement en mains propres</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3">
               <span>Commander via WhatsApp</span>
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
            <p className="text-center text-[9px] text-slate-400 mt-4 uppercase tracking-tighter">Traitement sécurisé par Basile Kadjolo</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
