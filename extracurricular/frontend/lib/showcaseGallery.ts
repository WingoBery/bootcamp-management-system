export interface ShowcaseProject {
  id: string;
  projectTitle: string;
  description: string;
  bootcampTitle: string;
  cohort: string;
  city: string;
  country: string;
  studentName: string;
  studentRole: string;
  marks: number;
  evaluation: 'distinction' | 'merit' | 'pass';
  rankLabel: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
}

export interface ShowcaseCohort {
  id: string;
  label: string;
}

export const SHOWCASE_COHORTS: ShowcaseCohort[] = [
  { id: 'all', label: 'All cohorts' },
  { id: '2025-q4', label: 'West Africa · Q4 2025' },
  { id: '2025-q3', label: 'East Africa · Q3 2025' },
  { id: '2025-q2', label: 'Central Africa · Q2 2025' },
  { id: '2024-q4', label: 'Pan-African · Q4 2024' },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'mpay-douala',
    projectTitle: 'M-Pay Marché',
    description:
      'A mobile wallet for Douala market traders to accept payments, track daily sales, and send remittances without a bank branch visit.',
    bootcampTitle: 'Fintech Builders · Douala',
    cohort: '2025-q4',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Amadou Njie',
    studentRole: 'Top graduate',
    marks: 96,
    evaluation: 'distinction',
    rankLabel: '#1 · Fintech Builders',
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-38ec56ead4a4?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Black Cameroonian developer building a fintech app in Douala',
    tags: ['Fintech', 'Mobile', 'USSD'],
  },
  {
    id: 'agrilink-accra',
    projectTitle: 'AgriLink Ghana',
    description:
      'Connects smallholder farmers in Ashanti Region with buyers and input suppliers, with SMS price alerts in Twi and English.',
    bootcampTitle: 'AgriTech Accra',
    cohort: '2025-q3',
    city: 'Accra',
    country: 'Ghana',
    studentName: 'Akosua Mensah',
    studentRole: 'Top graduate',
    marks: 94,
    evaluation: 'distinction',
    rankLabel: '#1 · AgriTech Accra',
    imageUrl: 'https://images.unsplash.com/photo-1664575602270-0960883c3144?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Ghanaian woman technologist working on agricultural software',
    tags: ['AgriTech', 'SMS', 'Marketplace'],
  },
  {
    id: 'healthqueue-lagos',
    projectTitle: 'HealthQueue Lagos',
    description:
      'Digital queue and appointment system for public clinics in Lagos, reducing wait times and sending WhatsApp reminders to patients.',
    bootcampTitle: 'Health Innovation · Lagos',
    cohort: '2025-q4',
    city: 'Lagos',
    country: 'Nigeria',
    studentName: 'Chioma Okafor',
    studentRole: 'Top graduate · Highest marks',
    marks: 97,
    evaluation: 'distinction',
    rankLabel: '#1 · All cohorts',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c488b398?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Nigerian health-tech founder reviewing clinic dashboard',
    tags: ['HealthTech', 'WhatsApp', 'Public sector'],
  },
  {
    id: 'solargrid-kigali',
    projectTitle: 'SolarGrid Kigali',
    description:
      'Monitors solar mini-grids across rural Rwanda, alerting technicians when battery storage drops below safe levels.',
    bootcampTitle: 'Green Energy Bootcamp',
    cohort: '2025-q2',
    city: 'Kigali',
    country: 'Rwanda',
    studentName: 'Jean-Paul Uwimana',
    studentRole: 'Top graduate',
    marks: 92,
    evaluation: 'distinction',
    rankLabel: '#1 · Green Energy',
    imageUrl: 'https://images.unsplash.com/photo-1595152770828-7808147258ee?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Rwandan engineer presenting a clean-energy monitoring project',
    tags: ['Clean energy', 'IoT', 'Rural'],
  },
  {
    id: 'edutrack-nairobi',
    projectTitle: 'EduTrack Nairobi',
    description:
      'Tracks student attendance and sends guardian alerts for schools in Eastlands, with offline-first sync for low-connectivity days.',
    bootcampTitle: 'EdTech Nairobi',
    cohort: '2025-q3',
    city: 'Nairobi',
    country: 'Kenya',
    studentName: 'Wanjiru Kamau',
    studentRole: 'Top graduate',
    marks: 91,
    evaluation: 'merit',
    rankLabel: '#1 · EdTech Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Kenyan educator and developer collaborating on EduTrack',
    tags: ['EdTech', 'Offline-first', 'SMS alerts'],
  },
  {
    id: 'fishmarket-dakar',
    projectTitle: 'FishMarket Dakar',
    description:
      'Helps fishermen in Dakar publish catch volumes each morning so restaurants and families can reserve fresh stock before boats dock.',
    bootcampTitle: 'Coastal Commerce · Dakar',
    cohort: '2024-q4',
    city: 'Dakar',
    country: 'Senegal',
    studentName: 'Moussa Diop',
    studentRole: 'Top graduate',
    marks: 89,
    evaluation: 'merit',
    rankLabel: '#1 · Coastal Commerce',
    imageUrl: 'https://images.unsplash.com/photo-1611348520971-15babe4c8772?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dakar waterfront at golden hour representing coastal commerce',
    tags: ['Marketplace', 'Fisheries', 'Mobile web'],
  },
  {
    id: 'transit-kinshasa',
    projectTitle: 'Mataa Transit Kinshasa',
    description:
      'Maps shared taxi routes across Kinshasa with crowd-sourced fare updates, built for commuters navigating the city daily.',
    bootcampTitle: 'Urban Mobility · Kinshasa',
    cohort: '2025-q2',
    city: 'Kinshasa',
    country: 'DR Congo',
    studentName: 'Grace Mbayo',
    studentRole: 'Top graduate',
    marks: 88,
    evaluation: 'merit',
    rankLabel: '#1 · Urban Mobility',
    imageUrl: 'https://images.unsplash.com/photo-1573167236862-1b97f47655fe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Congolese developer building an urban mobility application',
    tags: ['Mobility', 'Maps', 'Community'],
  },
  {
    id: 'craft-harare',
    projectTitle: 'ZimCraft Online',
    description:
      'Showcases handmade baskets and sculptures from Zimbabwean artisans to buyers across Southern Africa with mobile money checkout.',
    bootcampTitle: 'Creative Economy · Harare',
    cohort: '2024-q4',
    city: 'Harare',
    country: 'Zimbabwe',
    studentName: 'Tendai Mutasa',
    studentRole: 'Top graduate',
    marks: 90,
    evaluation: 'merit',
    rankLabel: '#1 · Creative Economy',
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6e0e5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Zimbabwean artisan weaving baskets at a Harare craft market',
    tags: ['E-commerce', 'Crafts', 'Mobile money'],
  },
  {
    id: 'water-maputo',
    projectTitle: 'ÁguaViva Maputo',
    description:
      'Reports broken water points in Maputo neighbourhoods and routes maintenance crews using community-submitted photos and GPS pins.',
    bootcampTitle: 'Civic Tech · Maputo',
    cohort: '2025-q3',
    city: 'Maputo',
    country: 'Mozambique',
    studentName: 'Filomena Chissano',
    studentRole: 'Top graduate',
    marks: 93,
    evaluation: 'distinction',
    rankLabel: '#1 · Civic Tech',
    imageUrl: 'https://images.unsplash.com/photo-1531383903190-1b63bfd7800a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Mozambican civic technologist working on community water project',
    tags: ['Civic tech', 'GIS', 'Community'],
  },
];

export const SHOWCASE_STATS = {
  bootcamps: 9,
  graduates: 124,
  featuredProjects: SHOWCASE_PROJECTS.length,
  countries: 9,
};

export function filterShowcaseProjects(cohortId: string): ShowcaseProject[] {
  if (cohortId === 'all') {
    return SHOWCASE_PROJECTS;
  }
  return SHOWCASE_PROJECTS.filter((project) => project.cohort === cohortId);
}

export function evaluationLabel(value: ShowcaseProject['evaluation']): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
