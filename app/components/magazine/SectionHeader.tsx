import Link from 'next/link';

interface Props {
  emoji: string;
  title: string;
  sectionSlug?: string;
  issueNumber?: number;
}

export function SectionHeader({ emoji, title, sectionSlug, issueNumber }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-text flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      {sectionSlug && (
        <Link
          href={issueNumber
            ? `/magazine/issue/${issueNumber}#${sectionSlug}`
            : `/magazine/section/${sectionSlug}`}
          className="text-sm text-accent hover:underline"
        >
          전체 보기 →
        </Link>
      )}
    </div>
  );
}
