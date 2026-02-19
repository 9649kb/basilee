
import React, { useEffect, useState, createContext, useContext } from 'react';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Boutique from './components/Boutique';
import About from './components/About';
import Testimonials from './components/Testimonials';
import AIAssistant from './components/AIAssistant';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from './constants';

// Context pour les notifications Toast
interface ToastContextType {
  showToast: (message: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

const App: React.FC = () => {
  const [whatsappNum, setWhatsappNum] = useState(WHATSAPP_NUMBER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        try {
          const element = document.querySelector(hash);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 800);
          }
        } catch (err) {
          console.warn("Sélecteur de hash invalide:", hash);
        }
      }
    };

    handleInitialScroll();
    
    const savedNum = localStorage.getItem('basile_whatsapp_number');
    if (savedNum) setWhatsappNum(savedNum);

    // Nettoyage des paramètres d'URL après un délai pour permettre aux composants de les lire
    const timer = setTimeout(() => {
      if (window.location.search) {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const footerCTAMessage = "Bonjour Basile, je souhaite bénéficier d'un boost digital pour mon entreprise. Pouvons-nous en discuter ?";

  return (
    <AdminProvider>
      <ToastContext.Provider value={{ showToast }}>
        <div className="antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
          <Navbar />
          <main>
            <Hero />
            <Services />
            <Portfolio />
            <Boutique />
            <About />
            <Testimonials />
            
            <section className="py-24 bg-gradient-to-br from-blue-700 to-blue-900 relative border-y border-white/5">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                  Besoin d'un coup de <span className="text-orange-400">boost digital ?</span>
                </h2>
                <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
                  Que ce soit pour une prestation sur mesure ou pour acquérir mes outils, je suis prêt à vous accompagner.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(footerCTAMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-2xl hover:shadow-orange-500/20 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Discuter sur WhatsApp
                  </a>
                  <button 
                    onClick={() => document.querySelector('#boutique')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-2xl"
                  >
                    Explorer la boutique
                  </button>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <AIAssistant />
          <FloatingWhatsApp />
          <LoginModal />

          {/* Toast Notification UI */}
          {toastMessage && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] animate-fade-in-up">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                <span className="text-xl">✅</span>
                <span className="text-xs font-bold uppercase tracking-widest">{toastMessage}</span>
              </div>
            </div>
          )}
        </div>
      </ToastContext.Provider>
    </AdminProvider>
  );
};

export default App;
