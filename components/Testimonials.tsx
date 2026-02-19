
import React, { useState, useEffect, useCallback } from 'react';
import { TESTIMONIALS as INITIAL_TESTIMONIALS } from '../constants';
import { useAdmin } from '../context/AdminContext';
import { Testimonial } from '../types';
import ReviewModal from './ReviewModal';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const saved = localStorage.getItem('basile_testimonials_v1');
    if (saved) {
      setTestimonials(JSON.parse(saved));
    } else {
      setTestimonials(INITIAL_TESTIMONIALS);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    let interval: any;
    if (isAutoPlaying && testimonials.length > 1) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, nextSlide]);

  const saveTestimonials = (updated: Testimonial[]) => {
    localStorage.setItem('basile_testimonials_v1', JSON.stringify(updated));
    setTestimonials(updated);
  };

  const handleAddReview = (newReview: { name: string; content: string; role: string }) => {
    const review: Testimonial = {
      id: Date.now().toString(),
      name: newReview.name,
      role: newReview.role || 'Client',
      content: newReview.content,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    };
    const updated = [review, ...testimonials];
    saveTestimonials(updated);
    setCurrentIndex(0);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      const updated = testimonials.filter(t => t.id !== testimonialToDelete.id);
      saveTestimonials(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(Math.max(0, updated.length - 1));
      }
      setTestimonialToDelete(null);
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-slate-900 text-white overflow-hidden relative min-h-[600px] flex items-center">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold tracking-widest uppercase text-[10px] md:text-xs">Preuve Sociale</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Ce que mes <span className="text-blue-400">Clients</span> disent</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            + Laisser un avis
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto relative px-12">
          {testimonials.length > 0 ? (
            <div 
              className="relative"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div 
                key={currentTestimonial.id}
                className="bg-white/5 border border-white/10 p-8 md:p-16 rounded-[3rem] text-center animate-fade-in-up relative"
              >
                <div className="mb-8 relative inline-block">
                  <img 
                    src={currentTestimonial.avatar} 
                    alt={currentTestimonial.name} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 object-cover mx-auto shadow-2xl" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017C11.4647 12 11.017 11.5523 11.017 11V6C11.017 5.44772 11.4647 5 12.017 5H19.017C20.6739 5 22.017 6.34315 22.017 8V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V11C3.017 11.5523 2.56928 12 2.017 12H1.017C0.464722 12 0.017 11.5523 0.017 11V6C0.017 5.44772 0.464722 5 1.017 5H8.017C9.67386 5 11.017 6.34315 11.017 8V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z"/></svg>
                  </div>
                </div>

                <p className="text-xl md:text-2xl text-slate-200 italic leading-relaxed mb-8 max-w-2xl mx-auto">
                  "{currentTestimonial.content}"
                </p>

                <div>
                  <h4 className="font-black text-white text-lg md:text-xl">{currentTestimonial.name}</h4>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">{currentTestimonial.role}</p>
                </div>

                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setTestimonialToDelete(currentTestimonial); }}
                    className="absolute top-8 right-8 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl z-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>

              {testimonials.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute top-1/2 -left-6 md:-left-16 -translate-y-1/2 p-4 bg-white/5 hover:bg-blue-600 text-white rounded-full transition-all border border-white/10 group shadow-2xl"
                  >
                    <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute top-1/2 -right-6 md:-right-16 -translate-y-1/2 p-4 bg-white/5 hover:bg-blue-600 text-white rounded-full transition-all border border-white/10 group shadow-2xl"
                  >
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  
                  <div className="flex justify-center gap-2 mt-12">
                    {testimonials.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Aucun témoignage pour le moment. Soyez le premier !</p>
            </div>
          )}
        </div>
      </div>

      {/* Boîte de Suppression Personnalisée */}
      {testimonialToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setTestimonialToDelete(null)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center text-slate-900">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🗑️</div>
            <h3 className="text-xl font-black mb-2 uppercase">Supprimer cet avis ?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-tight">Voulez-vous retirer le témoignage de "{testimonialToDelete.name}" ?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100">Confirmer la suppression</button>
              <button onClick={() => setTestimonialToDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Annuler</button>
            </div>
          </div>
        </div>
      )}
      
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleAddReview}
      />
    </section>
  );
};

export default Testimonials;
