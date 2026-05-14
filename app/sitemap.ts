import { MetadataRoute } from 'next';
import { SCHOOLS } from '@/app/data/schools';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibcommunity.kr';

const PILLAR_SLUGS = [
  'ib-education-complete-guide',
  'ib-pyp-parent-guide',
  'ib-myp-parent-guide',
  'ib-dp-complete-guide',
  'ib-vs-suneung',
  'ib-dp-korean-university',
  'ib-score-conversion',
  'ib-school-selection-guide',
  'ib-private-education',
  'ib-cost-guide',
  'ib-transfer-guide',
  'ib-schools-full-list',
  'jeju-ib-schools-guide',
  'jeju-english-city-guide',
  'jeju-relocation-parent-guide',
  'pyoseon-ib-analysis',
  'jeju-4schools-comparison',
  'ia-ee-tok-guide',
  'ib-dp-subject-selection',
  'ib-vs-international-school',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/community`, lastModified: now, priority: 0.8, changeFrequency: 'hourly' },
    { url: `${SITE_URL}/jeju`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/articles`, lastModified: now, priority: 0.8, changeFrequency: 'daily' },
    { url: `${SITE_URL}/articles/pillar`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/notice`, lastModified: now, priority: 0.5, changeFrequency: 'weekly' },
  ];

  // 학교 페이지 (430개)
  const schoolPages: MetadataRoute.Sitemap = SCHOOLS.map((school) => ({
    url: `${SITE_URL}/school/${school.id}`,
    lastModified: now,
    priority: school.stage === '인증' ? 0.8 : 0.6,
    changeFrequency: 'weekly' as const,
  }));

  // Pillar 아티클 페이지
  const articlePages: MetadataRoute.Sitemap = PILLAR_SLUGS.map((slug) => ({
    url: `${SITE_URL}/articles/${slug}`,
    lastModified: now,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPages, ...schoolPages, ...articlePages];
}
