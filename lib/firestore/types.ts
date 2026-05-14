import { Timestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'alumni' | 'parent' | 'staff' | 'visitor' | 'admin';

export interface User {
  email: string;
  displayName: string;
  role: UserRole;
  verified: boolean;
  verifiedSchoolIds: string[];
  badge?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type SchoolLevel = '초등' | '중등' | '고등' | '통합';
export type SchoolType = '국제학교' | '공립' | '사립';
export type SchoolStage = '인증' | '후보' | '관심';

export interface School {
  id?: string;
  name: string;
  nameEn: string;
  region: string;
  city: string;
  address: string;
  level: SchoolLevel;
  type: SchoolType;
  stage: SchoolStage;
  programs: string[];
  lat: number;
  lng: number;
  ratingAvg?: number;
  reviewCount?: number;
  postCount?: number;
}

export type VerificationStatus = 'pending' | 'auto_approved' | 'manual_review' | 'approved' | 'rejected';
export type DocumentType = 'student_id' | 'enrollment_cert' | 'graduation_cert' | 'family_relation';

export interface Verification {
  id?: string;
  userId: string;
  schoolId: string;
  documentType: DocumentType;
  storagePath: string;
  ocrConfidence: number;
  extractedSchool: string;
  extractedYear: string;
  status: VerificationStatus;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  expiresAt: Timestamp;
}

export type PostType = 'review' | 'question' | 'share' | 'meetup' | 'notice' | 'experience';

export interface RatingCategories {
  teaching?: number;
  atmosphere?: number;
  parentInvolvement?: number;
  iaSupport?: number;
  privateTutoring?: number;
}

export interface Post {
  id?: string;
  schoolId: string;
  authorId: string;
  authorBadge: string;
  type: PostType;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  rating?: number;
  ratingCategories?: RatingCategories;
  viewCount: number;
  commentCount: number;
  reactionCounts: {
    like: number;
    helpful: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Comment {
  id?: string;
  authorId: string;
  authorBadge: string;
  body: string;
  parentId?: string;
  createdAt: Timestamp;
}

export type ReactionKind = 'like' | 'helpful' | 'report';
export type ReactionTargetType = 'post' | 'comment';

export interface Reaction {
  id?: string;
  userId: string;
  targetType: ReactionTargetType;
  targetId: string;
  kind: ReactionKind;
  createdAt: Timestamp;
}

export type ListingType = '매매' | '전세' | '월세';

export interface Listing {
  id?: string;
  nearSchoolIds: string[];
  type: ListingType;
  price: number;
  area: number;
  source: string;
  sourceUrl?: string;
  brokerId?: string;
  title: string;
  description: string;
  photos: string[];
  lat: number;
  lng: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface NewsItem {
  id?: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  tags: string[];
  schoolIds: string[];
  publishedAt: Timestamp;
  curatedBy: string;
  curatedAt: Timestamp;
}

export type PlaceCategory = '맛집' | '카페' | '병원' | '문화시설' | '기타';

export interface Place {
  id?: string;
  name: string;
  category: PlaceCategory;
  nearSchoolIds: string[];
  description: string;
  lat: number;
  lng: number;
  photos: string[];
  createdAt: Timestamp;
}

export interface Notice {
  id?: string;
  title: string;
  body: string;
  regionScope: string;
  publishedAt: Timestamp;
  authorName: string;
}

// ── Magazine ──────────────────────────────────────────────

export type MagazineIssueStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type MagazineSectionSlug = 'ib_news' | 'real_estate' | 'moving_in' | 'local' | 'voices';

export interface MagazineSection {
  slug: MagazineSectionSlug;
  title: string;
  itemIds: string[];
  sponsorLabel?: string;
}

export interface MagazineIssue {
  id?: string;
  number: number;
  title: string;
  subtitle?: string;
  coverImageUrl: string;
  coverCategory: string;
  coverItemId?: string;
  publishedAt: Timestamp;
  scheduledAt?: Timestamp;
  status: MagazineIssueStatus;
  sections: MagazineSection[];
  newsletter: {
    sent: boolean;
    sentAt?: Timestamp;
    stibeeMessageId?: string;
    openRate?: number;
    clickRate?: number;
  };
  editorNote?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type MagazineItemType = 'news' | 'listing' | 'interview' | 'place' | 'voice' | 'column';
export type MagazineItemStatus = 'draft' | 'ready' | 'used' | 'archived';

export interface MagazineItem {
  id?: string;
  type: MagazineItemType;
  section: MagazineSectionSlug;
  title: string;
  summary: string;
  body?: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  authorName?: string;
  tags: string[];
  relatedSchoolIds: string[];
  linkedListingId?: string;
  linkedPostId?: string;
  publishedAt: Timestamp;
  usedInIssues: string[];
  status: MagazineItemStatus;
  createdBy: string;
  createdAt: Timestamp;
}

export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced';

export interface Subscriber {
  id?: string;
  email: string;
  name?: string;
  source: 'web_form' | 'invite' | 'import';
  status: SubscriberStatus;
  confirmedAt?: Timestamp;
  unsubscribedAt?: Timestamp;
  tags: string[];
  stibeeId?: string;
  createdAt: Timestamp;
}

// ── Articles (SEO) ─────────────────────────────────────────

export type ArticleType = 'pillar' | 'daily';
export type ArticleStatus =
  | 'generated'
  | 'filtered'
  | 'pending_review'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'flagged';

export interface ArticleSource {
  title: string;
  url: string;
  publisher: string;
  accessedAt: Timestamp;
}

export interface SafetyChecks {
  namedEntityRisk: boolean;
  politicalRisk: boolean;
  factCheckRisk: boolean;
  plagiarismRisk: boolean;
  minLengthOk: boolean;
  sourceCountOk: boolean;
  internalLinkOk: boolean;
}

export interface SearchPerformance {
  impressions: number;
  clicks: number;
  avgPosition: number;
  lastSyncedAt: Timestamp;
}

export interface Article {
  id?: string;
  slug: string;
  type: ArticleType;
  category: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  targetKeyword: string;
  relatedKeywords: string[];
  sources: ArticleSource[];
  internalLinks: string[];
  authorName: '펀제주 편집부';
  generatedBy: 'ai' | 'human' | 'mixed';
  aiModel?: string;
  generationPromptId?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  postReviewedBy?: string;
  postReviewedAt?: Timestamp;
  status: ArticleStatus;
  publishedAt?: Timestamp;
  noindex: boolean;
  safetyChecks?: SafetyChecks;
  searchPerformance?: SearchPerformance;
  freshnessScore?: number;
  updatedAt: Timestamp;
}

export type SeoIdeaStatus = 'queued' | 'drafting' | 'drafted' | 'published' | 'rejected' | 'archived';

export interface SeoIdea {
  id?: string;
  keyword: string;
  type: ArticleType;
  intent: 'informational' | 'navigational' | 'commercial' | 'investigational';
  source: 'manual' | 'rss' | 'search_log' | 'trends';
  sourceRef?: string;
  searchVolume?: number;
  difficulty?: number;
  status: SeoIdeaStatus;
  scheduledFor?: Timestamp;
  notes: string;
  createdAt: Timestamp;
}

export interface RssItem {
  id?: string;
  source: string;
  title: string;
  url: string;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  rawContent?: string;
  matchedKeywords: string[];
  usedInArticleId?: string;
  status: 'new' | 'matched' | 'used' | 'irrelevant';
}

export interface ContentFilter {
  id?: string;
  name: string;
  type: 'block' | 'flag';
  patterns: string[];
  active: boolean;
  notes: string;
}
