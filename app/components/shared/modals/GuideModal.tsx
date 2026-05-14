'use client';

import { useState } from 'react';

interface GuideModalProps {
  onClose: () => void;
  initialGuide?: 'pyp' | 'myp';
}

export function GuideModal({ onClose, initialGuide = 'pyp' }: GuideModalProps) {
  const [selectedGuide, setSelectedGuide] = useState<'pyp' | 'myp'>(initialGuide);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-text">IB 가이드</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedGuide('pyp')}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                  selectedGuide === 'pyp'
                    ? 'bg-accent text-white'
                    : 'bg-muted text-text-muted hover:bg-border'
                }`}
              >
                PYP
              </button>
              <button
                onClick={() => setSelectedGuide('myp')}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                  selectedGuide === 'myp'
                    ? 'bg-accent text-white'
                    : 'bg-muted text-text-muted hover:bg-border'
                }`}
              >
                MYP
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-text-muted hover:text-text transition"
          >
            ✕
          </button>
        </div>

        {/* 가이드 콘텐츠 (iframe) */}
        <div className="flex-1 overflow-hidden rounded-b-lg">
          <iframe
            key={selectedGuide}
            src={`/legacy/guide/${selectedGuide}/index.html`}
            className="w-full h-full border-0"
            title={`IB ${selectedGuide.toUpperCase()} 가이드`}
          />
        </div>
      </div>
    </div>
  );
}
