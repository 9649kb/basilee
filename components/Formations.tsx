
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../App';

interface Formation {
  id: string;
  title: string;
  tag: string;
  description: string;
  features: string[];
  price: string;
  oldPrice: string;
  image: string;
  secretCode: string;
  downloadLink: string;
}

const DEFAULT_FORMATIONS: Formation[] = [
  {
    id: 'f1',
    title: 'Devenir Graphiste Pro avec Canva & Mobile',
    tag: 'Le Best-Seller',
    description: 'La formation la plus complète au Togo pour maîtriser le design sur smartphone. Théorie, pratique et business.',
    features: ['+20 modules vidéos', 'Coaching groupé WhatsApp', 'Certificat de fin de formation'],
    price: '15.000 FCFA',
    oldPrice: '25.000 FCFA',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    secretCode: 'CANVA228',
    downloadLink: 'https://drive.google.com'
  }
];

const Formations: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
  const { isAdmin } = useAdmin();
  const { openCheckout } = useShop();
  const { showToast } = useToast();
  
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [showCodeModal, setShowCodeModal] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Formation, 'id'>>({
    title: '', tag: 'NOUVEAU', description: '', features: ['Accès à vie', 'Support WhatsApp'],
    price: '', oldPrice: '', image: '', secretCode: '', downloadLink: ''
  });

  const loadStates = () => {
    const saved = localStorage.getItem('basile_formations_v3');
    const currentFormations = saved ? JSON.parse(saved) : DEFAULT_FORMATIONS;
    setFormations(currentFormations);

    const ordered: string[] = [];
    const unlocked: string[] = [];
    currentFormations.forEach((f: Formation) => {
      if (localStorage.getItem(`basile_ordered_${f.id}`) === 'true') ordered.push(f.id);
      const savedCode = localStorage.getItem(`basile_f_code_used_${f.id}`);
      if (savedCode === f.secretCode) {
        unlocked.push(f.id);
      }
    });
    setOrderedIds(ordered);
    setUnlockedIds(unlocked);
  };

  useEffect(() => {
    loadStates();
    window.addEventListener('storage', loadStates);
    return () => window.removeEventListener('storage', loadStates);
  }, []);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Formation[];
    if (editingId) {
      const oldF = formations.find(f => f.id === editingId);
      if (oldF && oldF.secretCode !== formData.secretCode) {
        localStorage.removeItem(`basile_f_code_used_${editingId}`);
      }
      updated = formations.map(f => f.id === editingId ? { ...formData, id: editingId } : f);
      showToast("Formation mise à jour !");
    } else {
      const newFormation = { ...formData, id: `f-${Date.now()}` };
      updated = [newFormation, ...formations];
      showToast("Nouvelle formation ajoutée !");
    }
    setFormations(updated);
    localStorage.setItem('basile_formations_v3', JSON.stringify(updated));
    closeAdminModal();
    loadStates();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingId(null);
    setFormData({
      title: '', tag: 'NOUVEAU', description: '', features: ['Accès à vie', 'Support WhatsApp'],
      price: '', oldPrice: '', image: '', secretCode: '', downloadLink: ''
    });
  };

  const openEdit = (e: React.MouseEvent, f: Formation) => {
    e.stopPropagation();
    setEditingId(f.id);
    setFormData({ ...f });
    setShowAdminModal(true);
  };

  const confirmDelete = () => {
    if (formationToDelete) {
      const updated = formations.filter(f => f.id !== formationToDelete.id);
      setFormations(updated);
      localStorage.setItem('basile_formations_v3', JSON.stringify(updated));
      showToast("Formation supprimée.");
      setFormationToDelete(null);
    }
  };

  const handleUnlock = (e: React.FormEvent, formation: Formation) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === formation.secretCode.toUpperCase()) {
      localStorage.setItem(`basile_f_code_used_${formation.id}`, formation.secretCode);
      setUnlockedIds(prev => [...prev, formation.id]);
      setShowCodeModal(null);
      setInputCode('');
      showToast("🎉 Accès débloqué ! Bonne formation.");
    } else {
      showToast("❌ Code incorrect.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const updateFeature = (index: number, val: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = val;
    setFormData({ ...formData, features: newFeatures });
  };
  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <section id="formations" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div className="text-center md:text-left">
            <span className="text-blue-600 font-black tracking-[0.2em] uppercase text-[10px] bg-blue-50 px-4 py-2 rounded-full mb-6 inline-block">Académie Basile Kadjolo</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900">Formations <span className="text-blue-600">Pro</span></h2>
          </div>
          {isAdmin && (
            <button onClick={() => setShowAdminModal(true)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Nouvelle Formation
            </button>
          )}
        </div>

        <div className="space-y-16">
          {formations.map((f) => (
            <div key={f.id} className={`bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch group relative ${isAdmin ? 'ring-4 ring-blue-500 ring-dashed ring-offset-8' : ''}`}>
              <div className="lg:w-1/2 relative min-h-[400px]">
                <img src={f.image || 'https://via.placeholder.com/800x600?text=Formation+Basile'} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <span className="px-6 py-2 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl">{f.tag}</span>
                  {isAdmin && <span className="px-6 py-2 bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full">🔑 Code: {f.secretCode}</span>}
                </div>
                {isAdmin && (
                  <div className="absolute top-8 right-8 flex gap-2 z-[40]">
                    <button onClick={(e) => openEdit(e, f)} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button onClick={(e) => { e.stopPropagation(); setFormationToDelete(f); }} className="p-3 bg-white text-red-600 rounded-xl shadow-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                )}
              </div>

              <div className="lg:w-1/2 p-10 md:p-20 flex flex-col justify-center text-left">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{f.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed whitespace-pre-wrap">{f.description}</p>
                <ul className="space-y-4 mb-12">
                  {f.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-200 font-medium">
                      <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-blue-400">{f.price}</span>
                    {f.oldPrice && <span className="text-slate-500 line-through font-bold">{f.oldPrice}</span>}
                  </div>
                  
                  {unlockedIds.includes(f.id) ? (
                    <a href={f.downloadLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 py-5 bg-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 animate-pulse">📥 Accéder à la formation</a>
                  ) : orderedIds.includes(f.id) ? (
                    <button onClick={() => setShowCodeModal(f.id)} className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">🔑 Entrer mon code</button>
                  ) : (
                    <button onClick={() => openCheckout({ id: f.id, title: f.title, price: f.price, category: 'Formation' })} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Rejoindre la formation</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boîte de Suppression Personnalisée */}
      {formationToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setFormationToDelete(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center text-slate-900">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🗑️</div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Supprimer cette formation ?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-tight">Voulez-vous retirer "{formationToDelete.title}" de l'Académie ?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100">Confirmer la suppression</button>
              <button onClick={() => setFormationToDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin Formations */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeAdminModal}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Éditer Formation</h3>
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Image Miniature</label>
                <div className="w-full h-48 rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-200 flex items-center justify-center relative shadow-inner">
                   {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="Preview" /> : <span className="text-slate-500 font-bold uppercase text-[9px]">Aucune image</span>}
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-4 bg-white text-blue-600 px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">📸 Charger Fichier</button>
                   <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Titre" />
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="Badge (ex: Best-Seller)" />
              </div>

              <textarea rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description marketing..." />

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Points forts du programme</label>
                <div className="space-y-3">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs" value={feat} onChange={e => updateFeature(idx, e.target.value)} placeholder="Ex: Accès illimité" />
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))}
                  <button type="button" onClick={addFeature} className="text-blue-600 font-bold text-[9px] uppercase">+ Ajouter un module</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Prix actuel" />
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} placeholder="Ancien prix" />
              </div>

              <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-widest">🔑 Sécurité & Accès</h4>
                <div className="grid md:grid-cols-2 gap-4">
                   <input required className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl uppercase font-black text-orange-600 outline-none" value={formData.secretCode} onChange={e => setFormData({...formData, secretCode: e.target.value.toUpperCase()})} placeholder="CODE" />
                   <input required className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl outline-none text-xs" value={formData.downloadLink} onChange={e => setFormData({...formData, downloadLink: e.target.value})} placeholder="Lien (YouTube, Drive...)" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAdminModal} className="flex-1 py-4 bg-slate-100 rounded-xl">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Code Entry Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setShowCodeModal(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-2xl font-black text-slate-900">Débloquer l'accès</h3>
              <p className="text-slate-500 text-[10px] mt-3 uppercase font-bold tracking-widest">{formations.find(f => f.id === showCodeModal)?.title}</p>
            </div>
            <form onSubmit={(e) => handleUnlock(e, formations.find(f => f.id === showCodeModal)!)} className="space-y-4">
              <input required autoFocus placeholder="VOTRE CODE SECRET" className="w-full px-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black uppercase tracking-[0.4em] outline-none focus:border-blue-600" value={inputCode} onChange={e => setInputCode(e.target.value)} />
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Accéder maintenant</button>
              <button type="button" onClick={() => setShowCodeModal(null)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase">Annuler</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Formations;
