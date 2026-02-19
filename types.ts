
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'youtube';
  thumbnailUrl?: string;
  description: string;
  externalLink?: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  link: string;
}

export interface ShopItem {
  id: string;
  title: string;
  price: string;
  promotionPrice?: string;
  description: string;
  imageUrl: string;
  category: 'Tout' | 'Formation' | 'E-book' | 'Outil' | 'Service';
  secretCode?: string;
  downloadLink?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  pin: string;
  isSuperAdmin?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface GiftConfig {
  enabled: boolean;
  title: string;
  code: string;
  downloadLink: string;
}
