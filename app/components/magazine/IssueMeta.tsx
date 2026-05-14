import { MagazineIssue } from '@/lib/firestore/types';

interface Props {
  issue: MagazineIssue & { id: string };
  compact?: boolean;
}

export function IssueMeta({ issue, compact }: Props) {
  const date = issue.publishedAt?.toDate?.() || new Date();
  const formatted = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  if (compact) {
    return (
      <p className="text-xs text-text-muted">
        ISSUE #{issue.number} · {formatted}
      </p>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-1">펀제주 매거진</p>
      <p className="text-sm font-medium text-accent">
        ISSUE #{issue.number} · {formatted}
      </p>
    </div>
  );
}
