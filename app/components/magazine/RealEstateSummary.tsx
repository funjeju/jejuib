import { MagazineItem } from '@/lib/firestore/types';

interface PriceStat {
  label: string;
  avg: number;
  change?: number; // 전주 대비 만원 단위
}

interface Props {
  items: (MagazineItem & { id: string })[];
}

function formatPrice(manwon: number): string {
  if (manwon >= 10000) {
    const uk = Math.floor(manwon / 10000);
    const rem = manwon % 10000;
    return rem > 0 ? `${uk}억 ${rem.toLocaleString()}만원` : `${uk}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}

function parsePriceStats(items: (MagazineItem & { id: string })[]): PriceStat[] {
  // 아이템 summary에서 가격 정보를 파싱하거나, 없으면 placeholder 표시
  const types = ['매매', '전세', '월세'];
  return types.map((type) => {
    const matched = items.find((i) => i.summary?.includes(type));
    // 실제 데이터가 없으면 빈 placeholder
    return { label: type, avg: 0, change: undefined };
  });
}

export function RealEstateSummary({ items }: Props) {
  if (!items.length) return null;

  // listing 타입 아이템만 추출
  const listings = items.filter((i) => i.type === 'listing');

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest">이번 주 영교도 시세</p>
        <p className="text-xs text-text-muted">전주 대비</p>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {(['매매', '전세', '월세'] as const).map((type) => {
            const typeItems = listings.filter((i) => i.title?.includes(type) || i.summary?.includes(type));
            return (
              <div key={type} className="text-center">
                <p className="text-xs text-text-muted mb-1">{type}</p>
                {typeItems.length > 0 ? (
                  <p className="text-sm font-semibold text-text">{typeItems[0].summary?.split('\n')[0] || '—'}</p>
                ) : (
                  <p className="text-sm text-text-muted">—</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // 시세 데이터가 없을 때 — 아이템 목록으로 fallback
        <div className="space-y-2">
          {items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt={item.title} className="w-12 h-10 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text line-clamp-1">{item.title}</p>
                <p className="text-xs text-text-muted line-clamp-1">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-text-muted mt-3 pt-3 border-t border-accent/10">
        * 영어교육도시 인근 공인중개사 데이터 기준. 참고용.
      </p>
    </div>
  );
}
