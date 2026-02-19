
import React, { useState } from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: { name: string; content: string; role: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Publication sur le site
    onSuccess({
      name: name,
      content: comment,
      role: role || 'Client'
    });

    // Optionnel : Envoi aussi sur WhatsApp pour notification
    const stars = '⭐'.repeat(rating);
    const message = `Nouvel avis publié sur le site :\n\nNom: ${name}\nNote: ${stars}\nCommentaire: ${comment}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Reset et fermeture
    setName('');
    setRole('');
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-slate-900">Votre avis compte !</h3>
          <p className="text-slate-500 text-sm mt-2">Partagez votre expérience et aidez-moi à m'améliorer.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Votre Nom Complet</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
              placeholder="Ex: Koffi Mensah"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Votre Titre / Entreprise (Optionnel)</label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
              placeholder="Ex: CEO, Innovate Togo"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note</label>
            <div className="flex gap-3 justify-center bg-slate-50 p-4 rounded-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 ${rating >= star ? 'grayscale-0' : 'grayscale opacity-30'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Votre Témoignage</label>
            <textarea 
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-slate-900"
              placeholder="Racontez votre expérience..."
            ></textarea>
          </div>
          
          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-200">
            Publier mon avis
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
