
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../App';
import { Project } from '../types';
import { PROJECTS as INITIAL_PROJECTS } from '../constants';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { isAdmin } = useAdmin();
  const { openCheckout } = useShop();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Graphisme', 'Montage Vidéo', 'Publicité'];

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    category: 'Graphisme',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    externalLink: ''
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('basile_portfolio_v2');
    const loadedProjects = savedProjects ? JSON.parse(savedProjects) : INITIAL_PROJECTS;
    setProjects(loadedProjects);
  }, []);

  const saveToLocal = (updated: Project[]) => {
    setProjects([...updated]);
    localStorage.setItem('basile_portfolio_v2', JSON.stringify(updated));
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleCardClick = (project: Project) => {
    if (project.externalLink && project.mediaType === 'image') {
      window.open(project.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedProject(project);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = projects.map(p => p.id === editingId ? { ...p, ...formData, id: p.id } : p);
      saveToLocal(updated);
      showToast("Projet mis à jour !");
    } else {
      const newProject: Project = { ...formData, id: Date.now().toString() };
      saveToLocal([...projects, newProject]);
      showToast("Nouveau projet ajouté !");
    }
    closeAdminModal();
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setEditingId(null);
    setFormData({ title: '', category: 'Graphisme', description: '', mediaUrl: '', mediaType: 'image', externalLink: '' });
  };

  const openEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingId(project.id);
    setFormData({
      title: project.title, category: project.category, description: project.description,
      mediaUrl: project.mediaUrl, mediaType: project.mediaType, externalLink: project.externalLink || ''
    });
    setShowAdminModal(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const updated = projects.filter(p => p.id !== projectToDelete.id);
      saveToLocal(updated);
      showToast("Projet supprimé.");
      setProjectToDelete(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, mediaUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-6 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Mon Savoir-faire</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 text-slate-900">
              Galerie de <span className="text-orange-500">Projets</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-200 shadow-sm border border-slate-100'}`}
                >
                  {cat === 'All' ? 'Tous' : cat}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => setShowAdminModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg">+ Nouveau Projet</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => handleCardClick(project)}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-[4/3] sm:aspect-video md:aspect-[4/3] shadow-lg border-4 transition-all cursor-pointer ${isAdmin ? 'border-blue-500 border-dashed' : 'border-white hover:border-blue-400'}`}
            >
              {project.mediaType === 'image' && <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover opacity-90 transition-all duration-700" />}
              {project.mediaType === 'video' && <video src={project.mediaUrl} className="w-full h-full object-cover opacity-80" muted loop playsInline />}
              {project.mediaType === 'youtube' && <img src={project.thumbnailUrl || `https://img.youtube.com/vi/${getYoutubeId(project.mediaUrl)}/hqdefault.jpg`} alt={project.title} className="w-full h-full object-cover opacity-80" />}
              
              {/* BOUTONS ADMIN PERMANENTS */}
              {isAdmin && (
                <div className="absolute top-6 right-6 flex gap-2 z-[40]">
                  <button onClick={(e) => openEdit(e, project)} className="p-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }} className="p-3 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                <span className="px-4 py-1.5 bg-slate-900/60 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{project.category}</span>
              </div>

              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent">
                <h3 className="text-white text-xl md:text-3xl font-black mb-2">{project.title}</h3>
                <p className="text-slate-300 text-xs md:text-sm max-w-sm mb-6 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boîte de Suppression Personnalisée */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setProjectToDelete(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🗑️</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Supprimer ce projet ?</h3>
            <p className="text-slate-500 text-sm mb-8">Confirmez-vous la suppression de "{projectToDelete.title}" de votre portfolio ?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100">Confirmer la suppression</button>
              <button onClick={() => setProjectToDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin (Ajout/Modif) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeAdminModal}></div>
          <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-2xl w-full relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            <h3 className="text-2xl font-black mb-8 text-slate-900">{editingId ? 'Modifier Projet' : 'Nouveau Projet'}</h3>
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="flex gap-2">
                {['image', 'video', 'youtube'].map(type => (
                  <button key={type} type="button" onClick={() => setFormData({...formData, mediaType: type as any})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${formData.mediaType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{type}</button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Titre" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <input required type="text" placeholder="URL Média / ID YouTube" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})} />
              <textarea required placeholder="Description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl resize-none outline-none" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="flex gap-4 pt-4">
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

export default Portfolio;
