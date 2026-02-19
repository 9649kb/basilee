
import { Service, Project, Product, Testimonial } from './types';

export const SERVICES: Service[] = [
  {
    id: 'design',
    title: 'Graphisme Professionnel',
    description: 'Logos, charte graphique, flyers et identité visuelle percutante pour votre marque.',
    icon: '🎨'
  },
  {
    id: 'video',
    title: 'Montage Vidéo',
    description: 'Montage dynamique pour YouTube, TikTok, Reels ou publicités professionnelles.',
    icon: '🎬'
  },
  {
    id: 'ads',
    title: 'Publicités (Ads)',
    description: 'Campagnes Facebook, Instagram et Google pour booster vos ventes.',
    icon: '🚀'
  },
  {
    id: 'content',
    title: 'Création de Contenu',
    description: 'Stratégie et création de contenus engageants pour vos réseaux sociaux.',
    icon: '📱'
  },
  {
    id: 'training',
    title: 'Formateur Digital',
    description: 'Formations pratiques en graphisme, montage et marketing pour débutants et pros.',
    icon: '👨‍🏫'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Digital',
    description: 'Vente de produits digitaux et accompagnement dans le commerce en ligne.',
    icon: '🛍️'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Identité Visuelle - Tech Togo',
    category: 'Graphisme',
    mediaUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    description: 'Création d\'un logo moderne pour une startup technologique.'
  },
  {
    id: '2',
    title: 'Showreel Montage 2024',
    category: 'Montage Vidéo',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple
    mediaType: 'youtube',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    description: 'Compilation de mes meilleurs montages vidéo réalisés cette année.'
  },
  {
    id: '3',
    title: 'Publicité Animée - Juice Bar',
    category: 'Montage Vidéo',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-99648-large.mp4',
    mediaType: 'video',
    description: 'Montage dynamique avec effets spéciaux pour une marque de boisson.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Pack 50+ Templates Canva',
    price: '9.900 FCFA',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=400',
    link: '#'
  },
  {
    id: 'p2',
    title: 'E-book : Réussir sur TikTok',
    price: '15.000 FCFA',
    imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=400',
    link: '#'
  },
  {
    id: 'p3',
    title: 'Formation Montage CapCut',
    price: '25.000 FCFA',
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=400',
    link: '#'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Koffi Mensah',
    role: 'CEO, Innovate Lome',
    content: 'Basile a transformé notre image de marque. Son professionnalisme et sa créativité sont exceptionnels.',
    avatar: 'https://i.pravatar.cc/150?u=koffi'
  },
  {
    id: 't2',
    name: 'Abla Sika',
    role: 'Influenceuse Mode',
    content: 'Mes vidéos n\'ont jamais eu autant d\'impact ! Le montage de Basile est dynamique et moderne.',
    avatar: 'https://i.pravatar.cc/150?u=abla'
  }
];

export const WHATSAPP_NUMBER = "22896495419";
export const WHATSAPP_MESSAGE = "Bonjour Basile, je suis intéressé par vos services digitaux.";
