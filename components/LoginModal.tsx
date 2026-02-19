
import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, checkPin } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPin(pin)) {
      setPin('');
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)}></div>
      <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h3 className="text-xl font-black text-slate-900">Accès Administrateur</h3>
          <p className="text-slate-500 text-sm mt-2">Veuillez entrer votre code PIN pour débloquer le contrôle total.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              autoFocus
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full text-center text-3xl tracking-[1em] py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'border-slate-100 focus:border-blue-500 focus:bg-white'}`}
            />
            {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2 uppercase tracking-widest">Code PIN incorrect</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => setIsLoginModalOpen(false)}
              className="py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="py-4 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Valider
            </button>
          </div>
        </form>
        
        <p className="text-center text-[9px] text-slate-400 mt-8 uppercase tracking-tighter">Code par défaut : 1234</p>
      </div>
    </div>
  );
};

export default LoginModal;
