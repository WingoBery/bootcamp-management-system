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

export const IUC_SCHOOL = {
  name: 'IUC',
  fullName: 'Institut Universitaire de la Côte',
  location: 'Douala, Cameroon',
  tagline: 'Bootcamp Project Showcase',
};

export const SHOWCASE_COHORTS: ShowcaseCohort[] = [
  { id: 'all', label: 'All cohorts' },
  { id: '2025-s2', label: 'IUC · Semester 2 · 2025' },
  { id: '2025-s1', label: 'IUC · Semester 1 · 2025' },
  { id: '2024-s2', label: 'IUC · Semester 2 · 2024' },
  { id: '2024-summer', label: 'IUC · Summer Bootcamp · 2024' },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'mpay-douala',
    projectTitle: 'M-Pay Marché',
    description:
      'A mobile wallet built by IUC students for Douala market traders to accept Orange Money, track daily sales, and send remittances without visiting a bank branch.',
    bootcampTitle: 'Fintech Builders · IUC',
    cohort: '2025-s2',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Amadou Njie',
    studentRole: 'Top graduate',
    marks: 96,
    evaluation: 'distinction',
    rankLabel: '#1 · Fintech Builders',
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-38ec56ead4a4?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Amadou Njie developing a fintech application on laptop',
    tags: ['Fintech', 'Mobile', 'Orange Money'],
  },
  {
    id: 'agrilink-douala',
    projectTitle: 'AgriLink Douala',
    description:
      'Connects smallholder farmers on the outskirts of Douala with buyers and input suppliers, with SMS price alerts in French and Duala.',
    bootcampTitle: 'AgriTech · IUC',
    cohort: '2025-s1',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Aïcha Mbarga',
    studentRole: 'Top graduate',
    marks: 94,
    evaluation: 'distinction',
    rankLabel: '#1 · AgriTech',
    imageUrl: 'https://images.unsplash.com/photo-1664575602270-0960883c3144?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Aïcha Mbarga working on agricultural technology software',
    tags: ['AgriTech', 'SMS', 'Marketplace'],
  },
  {
    id: 'healthqueue-douala',
    projectTitle: 'HealthQueue Douala',
    description:
      'Digital queue and appointment system for public clinics in Douala, reducing wait times and sending WhatsApp reminders to patients in French.',
    bootcampTitle: 'Health Innovation · IUC',
    cohort: '2025-s2',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Grace Ewane',
    studentRole: 'Top graduate · Highest marks',
    marks: 97,
    evaluation: 'distinction',
    rankLabel: '#1 · All cohorts',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c488b398?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Grace Ewane presenting her health-tech clinic dashboard',
    tags: ['HealthTech', 'WhatsApp', 'Public sector'],
  },
  {
    id: 'solargrid-douala',
    projectTitle: 'SolarGrid Douala',
    description:
      'Monitors solar installations in Douala neighbourhoods and nearby rural communities, alerting technicians when battery storage drops below safe levels.',
    bootcampTitle: 'Green Energy · IUC',
    cohort: '2024-s2',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Jean-Paul Fotso',
    studentRole: 'Top graduate',
    marks: 92,
    evaluation: 'distinction',
    rankLabel: '#1 · Green Energy',
    imageUrl: 'https://images.unsplash.com/photo-1595152770828-7808147258ee?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Jean-Paul Fotso presenting a clean-energy monitoring project',
    tags: ['Clean energy', 'IoT', 'Rural'],
  },
  {
    id: 'edutrack-iuc',
    projectTitle: 'EduTrack IUC',
    description:
      'Tracks student attendance and sends guardian alerts for IUC campus programmes, with offline-first sync for low-connectivity days in Douala.',
    bootcampTitle: 'EdTech · IUC',
    cohort: '2025-s1',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Marie-Claire Nguema',
    studentRole: 'Top graduate',
    marks: 91,
    evaluation: 'merit',
    rankLabel: '#1 · EdTech',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Marie-Claire Nguema collaborating on EduTrack campus software',
    tags: ['EdTech', 'Offline-first', 'Campus'],
  },
  {
    id: 'fishmarket-douala',
    projectTitle: 'FishMarket Douala',
    description:
      'Helps fishermen at Douala port publish catch volumes each morning so restaurants and families in the city can reserve fresh stock before boats dock.',
    bootcampTitle: 'Coastal Commerce · IUC',
    cohort: '2024-summer',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Samuel Bekono',
    studentRole: 'Top graduate',
    marks: 89,
    evaluation: 'merit',
    rankLabel: '#1 · Coastal Commerce',
    imageUrl: 'https://images.unsplash.com/photo-1519085360353-f0218a371683?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Samuel Bekono developing a coastal commerce mobile app',
    tags: ['Marketplace', 'Fisheries', 'Mobile web'],
  },
  {
    id: 'transit-douala',
    projectTitle: 'Mataa Transit Douala',
    description:
      'Maps shared taxi and moto routes across Douala with crowd-sourced fare updates, built for IUC commuters navigating the city daily.',
    bootcampTitle: 'Urban Mobility · IUC',
    cohort: '2024-s2',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Diane Manga',
    studentRole: 'Top graduate',
    marks: 88,
    evaluation: 'merit',
    rankLabel: '#1 · Urban Mobility',
    imageUrl: 'https://images.unsplash.com/photo-1573167236862-1b97f47655fe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Diane Manga building an urban mobility application',
    tags: ['Mobility', 'Maps', 'Community'],
  },
  {
    id: 'craft-douala',
    projectTitle: 'ArtisanDouala Online',
    description:
      'Showcases handmade baskets and sculptures from Douala artisans to local buyers with Mobile Money checkout.',
    bootcampTitle: 'Creative Economy · IUC',
    cohort: '2024-summer',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Tendong Cynthia',
    studentRole: 'Top graduate',
    marks: 90,
    evaluation: 'merit',
    rankLabel: '#1 · Creative Economy',
    imageUrl: 'https://images.unsplash.com/photo-1622297635465-6ec0590e037f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Tendong Cynthia showcasing artisan e-commerce platform',
    tags: ['E-commerce', 'Crafts', 'Mobile Money'],
  },
  {
    id: 'water-douala',
    projectTitle: 'EauPropre Douala',
    description:
      'Reports broken water points in Douala neighbourhoods and routes maintenance crews using community-submitted photos and GPS pins.',
    bootcampTitle: 'Civic Tech · IUC',
    cohort: '2025-s1',
    city: 'Douala',
    country: 'Cameroon',
    studentName: 'Ibrahim Mohamadou',
    studentRole: 'Top graduate',
    marks: 93,
    evaluation: 'distinction',
    rankLabel: '#1 · Civic Tech',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'IUC student Ibrahim Mohamadou working on a civic water-reporting platform',
    tags: ['Civic tech', 'GIS', 'Community'],
  },
];

export const SHOWCASE_STATS = {
  bootcamps: 9,
  graduates: 72,
  featuredProjects: SHOWCASE_PROJECTS.length,
  departments: 4,
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
