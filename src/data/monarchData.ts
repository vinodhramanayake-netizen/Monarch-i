export type EnquiryCategory =
  | 'General Enquiry'
  | 'Table Reservation'
  | 'Wedding Lookbook'
  | 'Meetings & Events'
  | 'Room Availability';

export interface NavItem {
  label: string;
  href: string;
  enquiryCategory?: EnquiryCategory;
}

export interface ExperienceCard {
  id: string;
  anchor?: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  enquiryCategory?: EnquiryCategory;
  staggered?: boolean;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  cropClass?: string;
}

export interface WeddingPillar {
  title: string;
  description: string;
}

export const CONTACT_EMAIL = 'inquiry@monarchimperial.lk';
export const CONTACT_PHONE = '+94 11 277 2727';
export const CONTACT_PHONE_HREF = 'tel:+94112772727';
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Monarch+Imperial+Sri+Lanka';

export const NAV_LINKS: NavItem[] = [
  { label: 'About Us', href: '#arrival' },
  { label: 'Rooms', href: '#stay' },
  { label: 'Weddings', href: '#weddings' },
  { label: 'Meetings', href: '#events' },
  { label: 'Catering', href: '#dining' },
  { label: 'Dining', href: '#dining' },
  { label: 'Gallery', href: '#experiences' },
];

export const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    id: 'dining-exp',
    title: 'Dining',
    description: 'A taste of the extraordinary',
    image: '/assets/37-41-6993f367ea.png',
    alt: 'Dining experience at Monarch Imperial',
    href: '#dining',
  },
  {
    id: 'weddings-exp',
    title: 'Weddings',
    description: 'Your story, beautifully celebrated',
    image: '/assets/37-46-ebf7930acf.png',
    alt: 'Wedding celebrations in the grand ballroom',
    href: '#weddings',
    staggered: true,
  },
  {
    id: 'events-exp',
    anchor: 'events',
    title: 'Events',
    description: 'Room for remarkable ideas',
    image: '/assets/37-51-073a9df7d4.png',
    alt: 'Private dining and executive meetings space',
    href: '#events',
    enquiryCategory: 'Meetings & Events',
  },
  {
    id: 'stay-exp',
    anchor: 'stay',
    title: 'Stay',
    description: 'A little longer. A little slower.',
    image: '/assets/37-56-8b7148d386.png',
    alt: 'Luxury accommodation suite at Monarch Imperial',
    href: '#stay',
    enquiryCategory: 'Room Availability',
    staggered: true,
  },
];

export const AWARDS: AwardItem[] = [
  {
    id: 'boutique-hotel',
    year: '2026',
    title: 'Best Boutique Hotel',
    description: 'For intimate luxury and exceptional guest experiences.',
    image: '/assets/37-97-d12e08d56d.png',
    alt: 'Asia Pacific Property Awards logo',
    cropClass: 'scale-[1.45] object-center',
  },
  {
    id: 'outstanding-service',
    year: '2026',
    title: 'Outstanding Service',
    description: 'For warm, personalised care and thoughtful attention to every detail.',
    image: '/assets/37-102-99b324d183.png',
    alt: 'Sri Lanka Tourism Excellence Awards 2026 logo',
  },
  {
    id: 'sustainable-stays',
    year: '2026',
    title: 'Sustainable Stays',
    description: 'For eco-conscious practices and meaningful support for local communities.',
    image: '/assets/37-107-d6ee89303e.png',
    alt: 'SLIM Kantar Peoples Awards 2026 logo',
    cropClass: 'scale-[1.35] object-center',
  },
  {
    id: 'culinary-excellence',
    year: '2026',
    title: 'Culinary Excellence',
    description: 'For exceptional dining inspired by fresh ingredients and local flavours.',
    image: '/assets/37-112-8a5238cbff.png',
    alt: 'National Business Excellence Awards logo',
  },
  {
    id: 'inspired-design',
    year: '2026',
    title: 'Inspired Design',
    description: 'For timeless interiors that blend local character with modern comfort.',
    image: '/assets/37-117-26cbd5fbc7.png',
    alt: 'World Luxury Hotel Awards logo',
  },
];

export const WEDDING_PILLARS: WeddingPillar[] = [
  {
    title: 'THE BRIDAL SANCTUARY',
    description:
      'Private 1,200 sq ft dressing wing with salon mirrors and dedicated champagne butler.',
  },
  {
    title: 'FLORAL CURATIONS',
    description:
      'In-house botanical team crafting bespoke imported and rare indigenous orchid arrangements.',
  },
  {
    title: 'GRAND ENTRANCE',
    description:
      'Double sweeping imperial staircase and private limousine arrival court for the couple.',
  },
];

export const HERO_ACTIONS: Array<{ label: string; category: EnquiryCategory }> = [
  { label: 'Reserve a table', category: 'Table Reservation' },
  { label: 'Plan your occasion', category: 'Wedding Lookbook' },
  { label: 'Check availability', category: 'Room Availability' },
];
