
import React, { useState, useEffect } from 'react';
import { SERVICES as INITIAL_SERVICES } from '../constants';
import { useAdmin } from '../context/AdminContext';
import { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const { isAdmin } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🚀'
  });

  useEffect(() => {
    const saved = localStorage.getItem('basile_services_data');
    if (saved) {
      setServices(JSON.parse(saved));
    } else {
      setServices(INITIAL_SERVICES);
    }
  }, []);

  const saveToLocal = (updated: Service[]) => {
    localStorage.setItem('basile_services_data', JSON.stringify(updated));
    setServices(updated);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = services.map(s => s.id === editingId ? { ...s, ...formData } : s);
      saveToLocal(updated);
    } else {
      const newService: Service = { ...formData, id: Date.now().toString() };
      saveToLocal([...services, newService]);
    }
    closeAdminModal();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingId(null);
    setFormData({ title: '', description: '', icon: '🚀' });
  };

  const openEdit = (e: React.MouseEvent, service: Service) => {
    e.stopPropagation();
    setEditingId(service.id);
    setFormData({ title: service.title, description: service.description, icon: service.icon });
    setShowAdminModal(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      const updated = services.filter(s => s.id !== serviceToDelete.id);
      saveToLocal(updated);
      setServiceToDelete(null);
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 md:mb-24 gap-8">
          <div>
            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs">Domaines d'Expertise</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 text-slate-900">
              Services <span className="text-blue-600">Premium</span>
            </h2>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setShowAdminModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Ajouter un Service
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`group p-10 bg-slate-50 rounded-[2.5rem] border-2 transition-all duration-500 text-left relative overflow-hidden ${isAdmin ? 'border-blue-500 border-dashed bg-blue-50/30' : 'border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl'}`}
            >
              <div className="text-5xl mb-8 transform group-hover:scale-110 transition-all duration-500 inline-block">
                {service.icon}
              </div>
              <h3 className="text-xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {service.description}
              </p>

              {isAdmin && (
                <div className="absolute top-6 right-6 flex gap-2 z-30">
                  <button 
                    onClick={(e) => openEdit(e, service)}
                    className="p-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setServiceToDelete(service); }}
                    className="p-3 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals Admin Service & Deletion... */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeAdminModal}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative z-10 shadow-2xl animate-fade-in-up text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Modifier le Service' : 'Nouveau Service'}</h3>
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <input required className="col-span-1 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-2xl outline-none" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
                <input required className="col-span-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nom du Service" />
              </div>
              <textarea required rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description..." />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAdminModal} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {serviceToDelete && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setServiceToDelete(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full relative z-10 shadow-2xl text-center text-slate-900">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🗑️</div>
            <h3 className="text-xl font-black mb-4 uppercase">Supprimer ?</h3>
            <p className="text-slate-500 text-sm mb-8">Voulez-vous supprimer "{serviceToDelete.title}" ?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Confirmer la suppression</button>
              <button onClick={() => setServiceToDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
