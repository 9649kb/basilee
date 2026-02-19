
import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../App';

const AdminSettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen, admins, addAdmin, removeAdmin, toggleSuperAdmin, updateAdminPin, currentAdmin } = useAdmin();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'security' | 'team'>('security');
  
  // Security states
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  // Team states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [newAdminIsSuper, setNewAdminIsSuper] = useState(false);

  const [error, setError] = useState<string | null>(null);

  if (!isSettingsModalOpen) return null;

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;
    if (newPin !== confirmPin) { setError("Codes PIN différents."); return; }
    if (newPin.length !== 4) { setError("4 chiffres requis."); return; }

    if (updateAdminPin(currentAdmin.id, oldPin, newPin)) {
      showToast("PIN mis à jour !");
      setOldPin(''); setNewPin(''); setConfirmPin(''); setError(null);
    } else {
      setError("Ancien PIN incorrect.");
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPin.length !== 4) { setError("PIN : 4 chiffres."); return; }
    addAdmin(newName, newEmail, newAdminPin, newAdminIsSuper);
    showToast(`${newName} ajouté !`);
    setNewName(''); setNewEmail(''); setNewAdminPin(''); setNewAdminIsSuper(false); setError(null);
  };

  const hasFullControl = currentAdmin?.isSuperAdmin;

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsSettingsModalOpen(false)}></div>
      <div className="bg-white rounded-[2.5rem] p-0 max-w-2xl w-full relative z-10 shadow-2xl animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Configuration</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sécurité & Collaborateurs</p>
          </div>
          <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-300 hover:text-slate-900">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex bg-white border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            Sécurité
          </button>
          {hasFullControl && (
            <button 
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'team' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
            >
              Équipe ({admins.length})
            </button>
          )}
        </div>

        <div className="p-8 md:p-10 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          {activeTab === 'security' ? (
            <form onSubmit={handleUpdatePin} className="space-y-6">
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Ancien PIN</label>
                  <input type="password" maxLength={4} value={oldPin} onChange={e => setOldPin(e.target.value)} className="w-full text-center text-xl tracking-[1em] py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nouveau PIN</label>
                    <input type="password" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full text-center text-xl tracking-[1em] py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="••••" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Confirmer</label>
                    <input type="password" maxLength={4} value={confirmPin} onChange={e => setConfirmPin(e.target.value)} className="w-full text-center text-xl tracking-[1em] py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="••••" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100">Mettre à jour mon PIN</button>
            </form>
          ) : (
            <div className="space-y-10 text-left">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accès Actifs</h4>
                <div className="space-y-3">
                  {admins.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${admin.id === 'default' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} rounded-xl flex items-center justify-center font-black text-sm`}>
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-900 text-sm">{admin.name}</p>
                            {admin.isSuperAdmin && <span className="text-[7px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">Shield</span>}
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold lowercase">{admin.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {admin.id !== 'default' && (
                          <label className="flex items-center cursor-pointer group" title="Déléguer le Contrôle Total">
                            <span className="mr-3 text-[8px] font-black uppercase text-slate-400 group-hover:text-blue-600">Full Access</span>
                            <div className="relative">
                              <input type="checkbox" className="sr-only" checked={admin.isSuperAdmin} onChange={() => toggleSuperAdmin(admin.id)} />
                              <div className={`w-10 h-5 rounded-full transition-colors ${admin.isSuperAdmin ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${admin.isSuperAdmin ? 'translate-x-5' : ''}`}></div>
                            </div>
                          </label>
                        )}
                        {admin.id !== 'default' && admin.id !== currentAdmin?.id && (
                          <button onClick={() => { if(confirm(`Révoquer ${admin.name} ?`)) removeAdmin(admin.id); }} className="text-red-400 hover:text-red-600 p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddAdmin} className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Nouveau Collaborateur</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Nom" className="w-full px-5 py-4 bg-white border border-blue-100 rounded-xl outline-none text-sm font-bold" value={newName} onChange={e => setNewName(e.target.value)} />
                    <input required type="password" maxLength={4} placeholder="PIN" className="w-full px-5 py-4 bg-white border border-blue-100 rounded-xl outline-none text-sm text-center tracking-widest font-black" value={newAdminPin} onChange={e => setNewAdminPin(e.target.value)} />
                  </div>
                  <input required type="email" placeholder="Email professionnel" className="w-full px-5 py-4 bg-white border border-blue-100 rounded-xl outline-none text-sm font-medium" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 px-2">
                  <input type="checkbox" id="nAdminSuper" className="w-4 h-4 rounded accent-blue-600" checked={newAdminIsSuper} onChange={e => setNewAdminIsSuper(e.target.checked)} />
                  <label htmlFor="nAdminSuper" className="text-[9px] font-black uppercase text-slate-500 cursor-pointer">Donner immédiatement le contrôle total</label>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">Ajouter à l'Équipe</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
