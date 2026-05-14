import Link from 'next/link';
import { MagazineItem } from '@/lib/firestore/types';

interface Props {
  item: MagazineItem & { id: string };
  size?: 'sm' | 'md' | 'lg';
}

export function ItemCard({ item, size = 'md' }: Props) {
  const content = (() => {
    switch (item.type) {
      case 'news':
        return <NewsCard item={item} size={size} />;
      case 'listing':
        return <ListingCard item={item} />;
      case 'interview':
        return <InterviewCard item={item} size={size} />;
      case 'place':
        return <PlaceCard item={item} />;
      case 'voice':
        return <VoiceCard item={item} />;
      default:
        return <DefaultCard item={item} />;
    }
  })();

  if (item.sourceUrl && item.type === 'news') {
    return (
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

function NewsCard({ item, size }: { item: MagazineItem & { id: string }; size: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition h-full flex flex-col">
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-36 object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        {item.sourceName && (
          <span className="text-xs text-text-muted mb-2">{item.sourceName}</span>
        )}
        <h3 className={`font-semibold text-text leading-snug mb-2 ${size === 'lg' ? 'text-base' : 'text-sm'} line-clamp-3`}>
          {item.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 flex-1">{item.summary}</p>
      </div>
    </div>
  );
}

function ListingCard({ item }: { item: MagazineItem & { id: string } }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition">
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
      )}
      <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2">{item.title}</h3>
      <p className="text-xs text-text-muted line-clamp-2">{item.summary}</p>
    </div>
  );
}

function InterviewCard({ item, size }: { item: MagazineItem & { id: string }; size: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-5 hover:border-accent transition ${size === 'lg' ? 'flex gap-5' : ''}`}>
      {item.thumbnailUrl && size === 'lg' && (
        <img src={item.thumbnailUrl} alt={item.authorName || ''} className="w-16 h-16 rounded-full object-cover shrink-0" />
      )}
      <div>
        {item.authorName && (
          <p className="text-xs text-text-muted mb-1">{item.authorName}</p>
        )}
        <h3 className="text-sm font-semibold text-text mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-text-muted line-clamp-3">{item.summary}</p>
      </div>
    </div>
  );
}

function PlaceCard({ item }: { item: MagazineItem & { id: string } }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition">
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-28 object-cover rounded-lg mb-3" />
      )}
      <h3 className="text-sm font-semibold text-text mb-1">{item.title}</h3>
      <p className="text-xs text-text-muted line-clamp-2">{item.summary}</p>
    </div>
  );
}

function VoiceCard({ item }: { item: MagazineItem & { id: string } }) {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 hover:border-accent transition">
      <p className="text-xs text-accent font-medium mb-2">인증 회원 추천글</p>
      <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2">{item.title}</h3>
      <p className="text-xs text-text-muted line-clamp-3">{item.summary}</p>
    </div>
  );
}

function DefaultCard({ item }: { item: MagazineItem & { id: string } }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-text mb-2">{item.title}</h3>
      <p className="text-xs text-text-muted line-clamp-3">{item.summary}</p>
    </div>
  );
}
