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
