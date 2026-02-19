
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../App';
import { WHATSAPP_NUMBER } from '../constants';
import { GiftConfig } from '../types';

interface Skill {
  name: string;
  level: number;
}

interface AboutData {
  image: string;
  yearsExp: string;
  title: string;
  description1: string;
  description2: string;
  vision: string;
  values: string;
  skills: Skill[];
}

const DEFAULT_ABOUT: AboutData = {
  image: 'https://picsum.photos/seed/about/600/700',
  yearsExp: '05+',
  title: "Je m'appelle Basile Kadjolo, votre partenaire pour l'excellence digitale au Togo.",
  description1: "Basé à Lomé, je suis un passionné du monde numérique. Mon parcours m'a permis de maîtriser les outils les plus pointus du marché pour offrir des solutions créatives et rentables à mes clients.",
  description2: "Qu'il s'agisse de créer votre premier logo, de monter une vidéo virale pour vos réseaux ou de former votre équipe aux outils du marketing digital, je mets mon expertise à votre service pour des résultats tangibles.",
  vision: "Démocratiser le digital au Togo et en Afrique par la qualité.",
  values: "Qualité, Réactivité et Innovation constante.",
  skills: [
    { name: 'Graphisme (Canva/Adobe)', level: 95 },
    { name: 'Montage Vidéo (CapCut/Premiere)', level: 90 },
    { name: 'Publicité Facebook & Google', level: 85 },
    { name: 'Stratégie Social Media', level: 80 }
  ]
};

const DEFAULT_GIFT: GiftConfig = {
  enabled: true,
  title: "E-book Offert : 10 secrets du digital au Togo",
  code: "KDO228",
  downloadLink: "https://google.com"
};

const About: React.FC = () => {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const [giftConfig, setGiftConfig] = useState<GiftConfig>(DEFAULT_GIFT);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempData, setTempData] = useState<AboutData>(DEFAULT_ABOUT);
  const [tempGift, setTempGift] = useState<GiftConfig>(DEFAULT_GIFT);
  
  // Gift states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [leadName, setLeadName] = useState({ nom: '', prenom: '' });
  const [inputCode, setInputCode] = useState('');
  
  const [whatsappNum, setWhatsappNum] = useState(WHATSAPP_NUMBER);
  const { isAdmin } = useAdmin();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAbout = localStorage.getItem('basile_about_data_v3');
    if (savedAbout) setData(JSON.parse(savedAbout));

    const savedGift = localStorage.getItem('basile_gift_config');
    if (savedGift) setGiftConfig(JSON.parse(savedGift));

    const unlocked = localStorage.getItem('basile_gift_unlocked');
    if (unlocked === 'true') setIsUnlocked(true);

    const savedNum = localStorage.getItem('basile_whatsapp_number');
    if (savedNum) setWhatsappNum(savedNum);
  }, []);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setData(tempData);
    setGiftConfig(tempGift);
    localStorage.setItem('basile_about_data_v3', JSON.stringify(tempData));
    localStorage.setItem('basile_gift_config', JSON.stringify(tempGift));
    showToast("Paramètres profil et cadeau mis à jour !");
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setTempData(data);
    setTempGift(giftConfig);
    setShowEditModal(true);
  };

  const handleGiftRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Bonjour Basile ! Je m'appelle ${leadName.prenom} ${leadName.nom.toUpperCase()}. Je souhaite recevoir mon cadeau offert : "${giftConfig.title}". Merci !`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
    setShowGiftForm(false);
    setShowCodeEntry(true);
    showToast("Redirection WhatsApp... Revenez entrer le code !");
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === giftConfig.code.toUpperCase()) {
      setIsUnlocked(true);
      localStorage.setItem('basile_gift_unlocked', 'true');
      setShowCodeEntry(false);
      showToast("🎉 Cadeau débloqué ! Bonne lecture.");
    } else {
      showToast("❌ Code incorrect. Vérifiez sur WhatsApp.");
    }
  };

  const addSkill = () => {
    setTempData({
      ...tempData,
      skills: [...tempData.skills, { name: 'Nouvelle compétence', level: 50 }]
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = [...tempData.skills];
    newSkills.splice(index, 1);
    setTempData({ ...tempData, skills: newSkills });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...tempData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setTempData({ ...tempData, skills: newSkills });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const aboutContactMessage = "Bonjour Basile, je viens de lire votre parcours et je souhaite vous contacter pour une collaboration.";

  return (
    <section id="about" className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 right-0 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <div className={`relative z-10 rounded-[3rem] overflow-hidden shadow-2xl ${isAdmin ? 'ring-4 ring-blue-500 ring-dashed ring-offset-8' : ''}`}>
            <img 
              src={data.image} 
              alt="Basile Kadjolo" 
              className="w-full object-cover aspect-[6/7] transition-transform duration-700 group-hover:scale-105"
            />
            
            {isAdmin && (
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={openEditModal}
                  className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transform scale-90 group-hover:scale-100 transition-all"
                >
                  📸 Modifier profil & Cadeau
                </button>
              </div>
            )}
          </div>
          
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white p-8 rounded-3xl shadow-2xl z-20 hidden lg:block max-w-xs">
            <p className="text-4xl font-black mb-1">{data.yearsExp}</p>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-100">Années d'Expérience</p>
            <hr className="my-6 border-blue-400 opacity-30" />
            <p className="italic text-sm">"Le digital n'est pas une option, c'est le moteur de votre croissance."</p>
          </div>
        </div>

        <div className="text-left">
          <div className="flex justify-between items-start">
            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs">À Propos de moi</span>
            {isAdmin && (
              <button onClick={openEditModal} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Éditer profil
              </button>
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-8 text-slate-900 leading-tight">
            {data.title.split('Basile Kadjolo').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-blue-600">Basile Kadjolo</span>}
              </React.Fragment>
            ))}
          </h2>
          
          <div className="space-y-4 mb-10 text-slate-600">
            <p className="leading-relaxed">{data.description1}</p>
            <p className="leading-relaxed">{data.description2}</p>
          </div>

          <div className="mb-12">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Expertise Technique</h4>
            <div className="space-y-6">
              {data.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-900">{skill.name}</span>
                    <span className="text-[10px] font-black text-blue-600">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
            <a 
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(aboutContactMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Me contacter
            </a>
            
            {giftConfig.enabled ? (
              isUnlocked ? (
                <a 
                  href={giftConfig.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-100 text-center flex items-center justify-center gap-2 animate-pulse"
                >
                  📥 Télécharger mon E-book
                </a>
              ) : (
                <button 
                  onClick={() => setShowGiftForm(true)}
                  className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-center flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">🎁 Recevoir mon Cadeau</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              )
            ) : (
              <a 
                href="#portfolio"
                className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-center"
              >
                Voir mon Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal Formulaire Cadeau (Lead Magnet) */}
      {showGiftForm && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setShowGiftForm(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Accédez à votre <span className="text-orange-500">Cadeau</span></h3>
              <p className="text-slate-500 text-xs mt-3 uppercase font-bold tracking-widest">{giftConfig.title}</p>
            </div>
            
            <form onSubmit={handleGiftRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  placeholder="Votre Nom"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none" 
                  value={leadName.nom}
                  onChange={e => setLeadName({...leadName, nom: e.target.value})}
                />
                <input 
                  required 
                  placeholder="Prénom"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold outline-none" 
                  value={leadName.prenom}
                  onChange={e => setLeadName({...leadName, prenom: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">
                Obtenir mon code sur WhatsApp
              </button>
              <button type="button" onClick={() => { setShowGiftForm(false); setShowCodeEntry(true); }} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                J'ai déjà mon code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Entrée du Code */}
      {showCodeEntry && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setShowCodeEntry(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-2xl font-black text-slate-900">Débloquez l'accès</h3>
              <p className="text-slate-500 text-xs mt-3">Entrez le code secret envoyé sur WhatsApp.</p>
            </div>
            
            <form onSubmit={handleUnlock} className="space-y-4">
              <input 
                required 
                autoFocus
                placeholder="VOTRE CODE ICI"
                className="w-full px-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black uppercase tracking-[0.5em] outline-none focus:border-orange-500 transition-all text-slate-900" 
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
              />
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100">
                Valider & Télécharger
              </button>
              <button type="button" onClick={() => setShowCodeEntry(false)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Admin Multi-sections */}
      {showEditModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full relative z-10 shadow-2xl animate-fade-in-up text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Configuration Profil & Lead Magnet</h3>
            
            <form onSubmit={handleSaveAll} className="space-y-8">
              {/* Onglet Profil Rapide */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4">Infos de Base</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl outline-none" value={tempData.title} onChange={e => setTempData({...tempData, title: e.target.value})} placeholder="Titre de section" />
                  <input className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl outline-none" value={tempData.yearsExp} onChange={e => setTempData({...tempData, yearsExp: e.target.value})} placeholder="Expérience (ex: 05+)" />
                </div>
              </div>

              {/* Section Cadeau (Lead Magnet) */}
              <div className="space-y-6 bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-widest">🎁 Système de Cadeau (Lead Magnet)</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={tempGift.enabled} onChange={e => setTempGift({...tempGift, enabled: e.target.checked})} />
                    <span className="text-[10px] font-black uppercase text-orange-600">Activé</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-orange-400 mb-2 tracking-widest">Titre du Cadeau (E-book / Guide)</label>
                    <input className="w-full px-5 py-4 bg-white border border-orange-100 rounded-xl outline-none font-bold" value={tempGift.title} onChange={e => setTempGift({...tempGift, title: e.target.value})} placeholder="Ex: Pack 100 Templates Canva" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-orange-400 mb-2 tracking-widest">Code Secret (Requis)</label>
                      <input className="w-full px-5 py-4 bg-white border border-orange-100 rounded-xl outline-none font-black text-orange-600 uppercase" value={tempGift.code} onChange={e => setTempGift({...tempGift, code: e.target.value.toUpperCase()})} placeholder="Ex: B228" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-orange-400 mb-2 tracking-widest">Lien de Téléchargement</label>
                      <input className="w-full px-5 py-4 bg-white border border-orange-100 rounded-xl outline-none" value={tempGift.downloadLink} onChange={e => setTempGift({...tempGift, downloadLink: e.target.value})} placeholder="URL Drive, Dropbox..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-50 p-6 rounded-[2rem]">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Compétences Techniques</label>
                  <button type="button" onClick={addSkill} className="text-[10px] font-black uppercase text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">Ajouter</button>
                </div>
                <div className="space-y-3">
                  {tempData.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <input type="text" className="flex-1 text-xs font-bold outline-none" value={skill.name} onChange={e => updateSkill(idx, 'name', e.target.value)} />
                      <input type="number" className="w-16 text-center text-xs font-bold text-blue-600" value={skill.level} onChange={e => updateSkill(idx, 'level', parseInt(e.target.value))} />
                      <button type="button" onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold">Annuler</button>
                <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl">Enregistrer tout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
