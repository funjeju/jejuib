import Link from 'next/link';
import { MagazineIssue, MagazineItem } from '@/lib/firestore/types';
import { IssueMeta } from './IssueMeta';

interface Props {
  issue: MagazineIssue & { id: string };
  coverItem?: MagazineItem & { id: string };
  linkToIssue?: boolean;
}

export function IssueCover({ issue, coverItem, linkToIssue }: Props) {
  const content = (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* 커버 이미지 */}
      {issue.coverImageUrl ? (
        <img
          src={issue.coverImageUrl}
          alt={issue.title}
          className="w-full h-64 md:h-80 object-cover"
        />
      ) : (
        <div className="h-64 md:h-80 bg-accent/10 flex items-center justify-center">
          <span className="text-accent/30 text-6xl font-bold">#{issue.number}</span>
        </div>
      )}

      {/* 커버 텍스트 */}
      <div className="p-6 md:p-8">
        <IssueMeta issue={issue} />
        {issue.coverCategory && (
          <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded mb-3">
            {issue.coverCategory}
          </span>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-text leading-snug mb-3">
          {issue.title}
        </h2>
        {issue.subtitle && (
          <p className="text-sm text-text-muted mb-4">{issue.subtitle}</p>
        )}
        {coverItem && (
          <p className="text-sm text-text-muted line-clamp-2 mb-4">{coverItem.summary}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>by 펀제주 편집부</span>
          {coverItem?.body && <span>· {Math.ceil(coverItem.body.split(' ').length / 200 || 8)}분 읽기</span>}
        </div>
      </div>
    </div>
  );

  if (linkToIssue) {
    return (
      <Link href={`/magazine/issue/${issue.number}`} className="block hover:opacity-95 transition">
        {content}
      </Link>
    );
  }

  return content;
}
