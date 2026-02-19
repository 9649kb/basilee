
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../App';
import { ShopItem } from '../types';

const DEFAULT_ITEMS: ShopItem[] = [
  {
    id: 'b1',
    title: 'Pack de 100+ Templates Canva Pro',
    price: '15.000 FCFA',
    promotionPrice: '7.500 FCFA',
    description: 'Boostez votre productivité avec nos templates premium prêts à l\'emploi pour vos réseaux sociaux au Togo. Logos, flyers, et carrousels inclus.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800',
    category: 'Outil',
    secretCode: 'CANVA228',
    downloadLink: 'https://drive.google.com'
  }
];

const Boutique: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filter, setFilter] = useState<'Tout' | ShopItem['category']>('Tout');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ShopItem | null>(null);
  
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  const { isAdmin } = useAdmin();
  const { openCheckout } = useShop();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<ShopItem, 'id'>>({
    title: '', price: '', promotionPrice: '', description: '', imageUrl: '', category: 'Formation', secretCode: '', downloadLink: ''
  });

  const loadStates = () => {
    const saved = localStorage.getItem('basile_boutique_v3');
    const currentItems = saved ? JSON.parse(saved) : DEFAULT_ITEMS;
    setItems(currentItems);

    const ordered: string[] = [];
    const unlocked: string[] = [];
    currentItems.forEach((it: ShopItem) => {
      if (localStorage.getItem(`basile_ordered_${it.id}`) === 'true') ordered.push(it.id);
      const savedCode = localStorage.getItem(`basile_code_used_${it.id}`);
      if (savedCode === it.secretCode) {
        unlocked.push(it.id);
      }
    });
    setOrderedItems(ordered);
    setUnlockedItems(unlocked);
  };

  useEffect(() => {
    loadStates();
    window.addEventListener('storage', loadStates);
    return () => window.removeEventListener('storage', loadStates);
  }, []);

  const saveToLocal = (updated: ShopItem[]) => {
    localStorage.setItem('basile_boutique_v3', JSON.stringify(updated));
    setItems(updated);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const oldItem = items.find(it => it.id === editingId);
      if (oldItem && oldItem.secretCode !== formData.secretCode) {
        localStorage.removeItem(`basile_code_used_${editingId}`);
      }
      const updated = items.map(it => it.id === editingId ? { ...formData, id: editingId } : it);
      saveToLocal(updated);
      showToast("Mise à jour réussie !");
    } else {
      const newItem: ShopItem = { ...formData, id: `b-${Date.now()}` };
      saveToLocal([newItem, ...items]);
      showToast("Nouveau produit ajouté !");
    }
    closeAdminModal();
    loadStates();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingId(null);
    setFormData({ 
      title: '', price: '', promotionPrice: '', description: '', imageUrl: '', category: 'Formation', secretCode: '', downloadLink: ''
    });
  };

  const openEdit = (e: React.MouseEvent, it: ShopItem) => {
    e.stopPropagation();
    setEditingId(it.id);
    setFormData({
      title: it.title, price: it.price, promotionPrice: it.promotionPrice || '',
      description: it.description, imageUrl: it.imageUrl, category: it.category,
      secretCode: it.secretCode || '', downloadLink: it.downloadLink || ''
    });
    setShowAdminModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const updated = items.filter(it => it.id !== itemToDelete.id);
      saveToLocal(updated);
      showToast("Produit supprimé.");
      setItemToDelete(null);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (inputCode.trim().toUpperCase() === (selectedItem.secretCode || "").toUpperCase()) {
      localStorage.setItem(`basile_code_used_${selectedItem.id}`, selectedItem.secretCode || "");
      setUnlockedItems(prev => [...prev, selectedItem.id]);
      setShowCodeEntry(false);
      setInputCode('');
      showToast("🎉 Accès débloqué !");
    } else {
      showToast("❌ Code incorrect.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = filter === 'Tout' ? items : items.filter(it => it.category === filter);

  return (
    <section id="boutique" className="py-24 md:py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs">Shop Digital Premium</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">Ma <span className="text-blue-600">Boutique</span></h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 flex-wrap justify-center">
              {['Tout', 'Formation', 'E-book', 'Outil', 'Service'].map((cat) => (
                <button key={cat} onClick={() => setFilter(cat as any)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>{cat}</button>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => setShowAdminModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Ajouter un produit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((it) => (
            <div key={it.id} onClick={() => setSelectedItem(it)} className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border-4 cursor-pointer relative ${isAdmin ? 'border-blue-500 border-dashed' : 'border-white'}`}>
              <div className="h-64 overflow-hidden relative">
                <img src={it.imageUrl || 'https://via.placeholder.com/800x600?text=Produit+Basile'} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/10">{it.category}</span>
                  {unlockedItems.includes(it.id) ? (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">ACCÈS VALIDE ✅</span>
                  ) : orderedItems.includes(it.id) ? (
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">COMMANDE EN COURS 🔑</span>
                  ) : it.promotionPrice ? (
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">OFFRE SPÉCIALE</span>
                  ) : null}
                </div>

                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-[40]">
                    <button 
                      onClick={(e) => openEdit(e, it)} 
                      className="p-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setItemToDelete(it); }} 
                      className="p-3 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold mb-4 text-slate-900 line-clamp-1">{it.title}</h3>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl font-black text-blue-600">{it.promotionPrice || it.price}</span>
                  {it.promotionPrice && <span className="text-slate-400 line-through text-sm font-bold">{it.price}</span>}
                </div>
                
                {unlockedItems.includes(it.id) ? (
                  <button className="w-full py-5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">Ouvrir le contenu</button>
                ) : (
                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">Voir Détails</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boîte de Suppression Personnalisée */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setItemToDelete(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🗑️</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Supprimer ce produit ?</h3>
            <p className="text-slate-500 text-sm mb-8">Cette action est irréversible. "{itemToDelete.title}" sera retiré de la boutique.</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100">Confirmer la suppression</button>
              <button onClick={() => setItemToDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails & Déblocage */}
      {selectedItem && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 text-left">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => { setSelectedItem(null); setShowCodeEntry(false); }}></div>
          <div className="bg-white rounded-[3rem] p-0 max-w-4xl w-full relative z-10 shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
             <div className="md:w-1/2 h-64 md:h-auto relative">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
             </div>
             <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto relative bg-white flex flex-col">
                <button onClick={() => { setSelectedItem(null); setShowCodeEntry(false); }} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-6 text-slate-900 leading-tight">{selectedItem.title}</h3>
                  {showCodeEntry ? (
                    <div className="animate-fade-in">
                       <p className="text-slate-500 text-sm mb-6">Entrez le code secret envoyé sur WhatsApp par Basile.</p>
                       <form onSubmit={handleUnlock} className="space-y-4">
                          <input required autoFocus placeholder="VOTRE CODE" className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-2xl font-black tracking-widest outline-none focus:border-blue-500 transition-all uppercase" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Débloquer maintenant</button>
                          <button type="button" onClick={() => setShowCodeEntry(false)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase">Retour</button>
                       </form>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <span className="text-3xl font-black text-blue-600">{selectedItem.promotionPrice || selectedItem.price}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-10 whitespace-pre-wrap">{selectedItem.description}</p>
                    </>
                  )}
                </div>
                
                {!showCodeEntry && (
                  <div className="pt-8 border-t border-slate-100">
                    {unlockedItems.includes(selectedItem.id) ? (
                      <a href={selectedItem.downloadLink} target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-green-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest text-center block animate-pulse">🚀 Accéder au contenu (Drive/Video)</a>
                    ) : orderedItems.includes(selectedItem.id) ? (
                      <button onClick={() => setShowCodeEntry(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl">🔑 J'ai reçu mon code</button>
                    ) : (
                      <button onClick={() => { openCheckout({ id: selectedItem.id, title: selectedItem.title, price: selectedItem.promotionPrice || selectedItem.price, category: selectedItem.category }); setSelectedItem(null); }} className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl transition-all">💳 Commander sur WhatsApp</button>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Modal Admin Boutique */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 text-left">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={closeAdminModal}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full relative z-10 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Modifier Produit' : 'Nouveau Produit Digital'}</h3>
            
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Miniature du Produit</label>
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative shadow-inner">
                   {formData.imageUrl ? (
                     <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                   ) : (
                     <span className="text-slate-300 font-bold uppercase text-[9px]">Aucune image</span>
                   )}
                   <button 
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg"
                   >
                     📸 Charger Fichier
                   </button>
                   <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nom / Titre</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: E-book Canva" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Type</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="Formation">🎓 Formation</option>
                    <option value="E-book">📚 E-book</option>
                    <option value="Outil">🛠️ Outil</option>
                    <option value="Service">💼 Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Argumentaire de vente (Description)</label>
                <textarea 
                  required 
                  rows={4} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none resize-none" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Décrivez les bénéfices pour le client..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Prix Normal</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Ex: 10.000 FCFA" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Prix Promotion</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" value={formData.promotionPrice} onChange={e => setFormData({...formData, promotionPrice: e.target.value})} placeholder="Ex: 5.000 FCFA" />
                </div>
              </div>

              <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 space-y-5">
                <div className="flex justify-between items-center">
                   <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-widest">🔑 Configuration Sécurisée</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[9px] font-black uppercase text-orange-400 mb-2 tracking-widest">Code Secret WhatsApp</label>
                      <input required className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl uppercase font-black text-orange-600 outline-none" value={formData.secretCode} onChange={e => setFormData({...formData, secretCode: e.target.value.toUpperCase()})} placeholder="EX: LOGO24" />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-orange-400 mb-2 tracking-widest">Lien de contenu</label>
                      <input required className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl outline-none text-xs" value={formData.downloadLink} onChange={e => setFormData({...formData, downloadLink: e.target.value})} placeholder="https://..." />
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAdminModal} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Boutique;
