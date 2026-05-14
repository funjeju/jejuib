'use client';

import { useEffect, useState } from 'react';
import { getNotices } from '@/lib/firestore/notices';
import { Notice } from '@/lib/firestore/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function NoticePage() {
  const [notices, setNotices] = useState<(Notice & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getNotices(30)
      .then(setNotices)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">공식 공지</p>
          <h1 className="text-3xl font-bold text-text">펀제주 공지사항</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-border rounded w-1/4 mb-3" />
                <div className="h-5 bg-border rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="py-24 text-center text-text-muted">
            <div className="text-4xl mb-4">📋</div>
            <p className="font-medium text-text mb-1">공지사항이 없습니다</p>
            <p className="text-sm">새로운 소식이 있으면 이곳에 안내드립니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => {
              const date = notice.publishedAt?.toDate?.() || new Date();
              const timeAgo = formatDistanceToNow(date, { locale: ko, addSuffix: true });
              const isOpen = expanded === notice.id;

              return (
                <div
                  key={notice.id}
                  className="bg-surface border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : notice.id!)}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-bg transition"
                  >
                    <div className="flex-1 min-w-0">
                      {notice.regionScope && notice.regionScope !== 'all' && (
                        <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded mb-1.5">
                          {notice.regionScope}
                        </span>
                      )}
                      <p className="font-semibold text-text text-sm leading-snug">
                        {notice.title}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {notice.authorName} · {timeAgo}
                      </p>
                    </div>
                    <span className="text-text-muted text-lg shrink-0 mt-0.5">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-border">
                      <div className="pt-4 text-sm text-text whitespace-pre-wrap leading-relaxed">
                        {notice.body}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
