import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '../constants';

const Hero: React.FC = () => {
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/basile/800/800');
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [whatsappNum, setWhatsappNum] = useState(WHATSAPP_NUMBER);
  const { isAdmin } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('basile_profile_image');
    if (savedImage) setProfileImage(savedImage);
    
    const savedNum = localStorage.getItem('basile_whatsapp_number');
    if (savedNum) setWhatsappNum(savedNum);
  }, []);

  const handleSaveImage = () => {
    if (tempImageUrl) {
      setProfileImage(tempImageUrl);
      localStorage.setItem('basile_profile_image', tempImageUrl);
      setShowEditModal(false);
      setTempImageUrl('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('basile_profile_image', base64String);
        setShowEditModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const heroContactMessage = "Bonjour Basile, je viens de voir votre portfolio et je souhaite discuter de mes projets digitaux avec vous.";

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-12 md:pt-20 overflow-hidden bg-slate-900 text-white">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-blue-600 opacity-10 blur-3xl rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-full md:w-1/3 h-1/2 bg-orange-500 opacity-5 blur-3xl rounded-full -ml-20 -mb-20"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center md:text-left order-2 md:order-1">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            <span className="inline-block px-4 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-orange-500/30">
              Entrepreneur Digital & Formateur
            </span>
            {isAdmin && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest animate-pulse">
                🔧 Mode Édition Actif
              </span>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Propulsez Votre <span className="text-blue-400">Marque</span> Dans l'ère Digitale.
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Expert en Graphisme, Montage Vidéo et Marketing basé au Togo. J'aide les entreprises à briller en ligne grâce à des contenus visuels percutants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(heroContactMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2 shadow-xl shadow-orange-900/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Me Contacter
            </a>
            <a 
              href="#portfolio" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold transition-all text-center"
            >
              Voir mes réalisations
            </a>
          </div>
        </div>

        <div className="relative order-1 md:order-2 flex justify-center">
          <div className={`relative group p-1 rounded-full ${isAdmin ? 'ring-4 ring-blue-500 ring-dashed ring-offset-8 ring-offset-slate-900' : ''}`}>
            <div className="w-64 sm:w-80 md:w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 p-1 animate-float shadow-2xl">
              <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden border-4 md:border-8 border-slate-900">
                 <img 
                   src={profileImage} 
                   alt="Basile Kadjolo" 
                   className="w-full h-full object-cover transition-all duration-700"
                   style={{ imageRendering: 'auto' }}
                 />
              </div>
            </div>

            {isAdmin && (
              <button 
                onClick={() => setShowEditModal(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition-all z-20"
              >
                📸 Changer Photo
              </button>
            )}
          </div>
          
          <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-slate-900 flex items-center gap-3 md:gap-4 border border-slate-100">
            <div className="bg-green-100 text-green-600 p-2 md:p-3 rounded-xl">
              <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest">Expertise</p>
              <p className="text-base md:text-2xl font-black text-slate-900">Validée</p>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative z-10 shadow-2xl text-slate-900 animate-fade-in-up text-left">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Votre image de marque</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Note de Performance */}
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-4 items-start">
                <span className="text-xl">💡</span>
                <p className="text-[10px] leading-relaxed font-bold text-orange-800 uppercase tracking-tight">
                  Conseil Performance : Utilisez de préférence une <span className="underline">URL d'image</span> (via ImgBB ou Cloudinary) pour garantir un chargement instantané et économiser l'espace de stockage.
                </p>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Option 1 : Fichier Local (Base64)</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 bg-blue-50 text-blue-600 rounded-2xl font-black border-2 border-dashed border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                  Sélectionner un fichier
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">Ou</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Option 2 : Lien URL (Recommandé)</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  placeholder="https://votre-image.jpg"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold">Annuler</button>
                <button onClick={handleSaveImage} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl">Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;