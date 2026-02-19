
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, WHATSAPP_NUMBER } from '../constants';

const DigitalShop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    imageUrl: '',
    link: ''
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('basile_shop_v1');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(INITIAL_PRODUCTS);
  }, []);

  const saveToLocal = (updated: Product[]) => {
    localStorage.setItem('basile_shop_v1', JSON.stringify(updated));
    setProducts(updated);
  };

  const handleShare = (platform: string) => {
    if (!sharingProduct) return;
    const url = window.location.href;
    const text = `Découvre ce produit digital : ${sharingProduct.title}`;
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
    }
    window.open(shareUrl, '_blank');
    setSharingProduct(null);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
      saveToLocal(updated);
    } else {
      const newProduct: Product = { ...formData, id: Date.now().toString() };
      saveToLocal([newProduct, ...products]);
    }
    closeAdminModal();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingId(null);
    setFormData({ title: '', price: '', imageUrl: '', link: '' });
  };

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(`❓ Êtes-vous sûr de vouloir SUPPRIMER le produit : "${title}" ?`);
    if (confirmDelete) {
      const updated = products.filter(p => p.id !== id);
      saveToLocal(updated);
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

  return (
    <section id="shop" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Boutique</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-slate-900">Produits <span className="text-orange-500">Digitaux</span></h2>
          </div>
          {isAdmin && (
            <button onClick={() => setShowAdminModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl">+ Nouveau Produit</button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className={`bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 group relative ${isAdmin ? 'border-blue-500 border-dashed' : 'border-slate-100'}`}>
              <div className="h-56 overflow-hidden relative">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-xl">{product.price}</div>
                  <button onClick={() => setSharingProduct(product)} className="p-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.482 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                </div>
                {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2">
                    <button onClick={(e) => { setEditingId(product.id); setFormData(product); setShowAdminModal(true); }} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg">Édit</button>
                    <button onClick={(e) => handleDelete(e, product.id, product.title)} className="p-3 bg-white text-red-600 rounded-xl shadow-lg">Suppr</button>
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="font-bold text-xl mb-6 text-slate-900 h-14 overflow-hidden">{product.title}</h3>
                <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Je souhaite commander : ${product.title}`, '_blank')} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase shadow-lg">Commander</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sharingProduct && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSharingProduct(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full relative z-10 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Partager</h3>
              <p className="text-slate-500 text-xs mt-2 italic line-clamp-1">"{sharingProduct.title}"</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all group">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
              </button>
            </div>
            <button onClick={() => setSharingProduct(null)} className="w-full mt-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">Fermer</button>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeAdminModal}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-xl w-full relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8">Gestion Boutique</h3>
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nom du produit" />
              <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Prix" />
              <div className="flex gap-4">
                <button type="button" onClick={closeAdminModal} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DigitalShop;
