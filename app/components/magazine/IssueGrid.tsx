import Link from 'next/link';
import { MagazineIssue } from '@/lib/firestore/types';

interface Props {
  issues: (MagazineIssue & { id: string })[];
}

export function IssueGrid({ issues }: Props) {
  if (!issues.length) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted">
        <p className="text-sm">첫 이슈 발행 후 아카이브가 쌓입니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {issues.map((issue) => {
        const date = issue.publishedAt?.toDate?.() || new Date();
        return (
          <Link
            key={issue.id}
            href={`/magazine/issue/${issue.number}`}
            className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition group"
          >
            {issue.coverImageUrl ? (
              <img src={issue.coverImageUrl} alt={issue.title} className="w-full h-24 object-cover" />
            ) : (
              <div className="h-24 bg-accent/10 flex items-center justify-center">
                <span className="text-accent/40 text-2xl font-bold">#{issue.number}</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs text-text-muted mb-1">ISSUE #{issue.number}</p>
              <p className="text-xs font-medium text-text line-clamp-2 group-hover:text-accent transition">
                {issue.title}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
