'use client';

import { useState } from 'react';

interface Props {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function shareKakao() {
    if (typeof window === 'undefined') return;
    const kakao = (window as any).Kakao;
    if (kakao?.Share) {
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description: '펀제주 매거진',
          imageUrl: '',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: '매거진 읽기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
        ],
      });
    } else {
      // 카카오 SDK 미로드 시 URL 복사로 fallback
      copyLink();
    }
  }

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title, url: shareUrl });
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted mr-1">공유</span>

      {/* 카카오톡 */}
      <button
        onClick={shareKakao}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE500] text-[#3C1E1E] text-xs font-medium rounded-lg hover:opacity-90 transition"
        aria-label="카카오톡 공유"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 11c0 2.91 1.636 5.464 4.124 6.981L5.25 21l4.073-2.085C9.773 19.093 10.876 19.2 12 19.2c5.523 0 10-3.477 10-8.2S17.523 3 12 3z"/>
        </svg>
        카카오
      </button>

      {/* 링크 복사 */}
      <button
        onClick={copyLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium rounded-lg transition ${
          copied
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-border text-text-muted hover:border-accent hover:text-accent'
        }`}
        aria-label="링크 복사"
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7"/>
            </svg>
            복사됨
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            링크 복사
          </>
        )}
      </button>

      {/* 모바일 네이티브 공유 (지원 시) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={shareNative}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text-muted text-xs font-medium rounded-lg hover:border-accent hover:text-accent transition"
          aria-label="공유하기"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
          </svg>
          공유
        </button>
      )}
    </div>
  );
}
