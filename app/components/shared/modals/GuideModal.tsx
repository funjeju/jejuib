'use client';

import { useState } from 'react';

interface GuideModalProps {
  onClose: () => void;
}

type GuideType = 'pyp' | 'myp';

export function GuideModal({ onClose }: GuideModalProps) {
  const [selectedGuide, setSelectedGuide] = useState<GuideType>('pyp');

  const guides = [
    { id: 'pyp', label: 'PYP 가이드', path: '/guide/pyp' },
    { id: 'myp', label: 'MYP 가이드', path: '/guide/myp' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-lg w-full max-w-4xl h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text">IB 가이드</h2>
          <button
            onClick={onClose}
            className="text-2xl text-text-muted hover:text-text transition"
          >
            ✕
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-4 px-6 py-4 border-b border-border">
          {guides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id as GuideType)}
              className={`px-4 py-2 font-semibold transition ${
                selectedGuide === guide.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {guide.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          <iframe
            key={selectedGuide}
            src={guides.find((g) => g.id === selectedGuide)?.path}
            className="w-full h-full border-none"
            title={`${selectedGuide.toUpperCase()} 가이드`}
          />
        </div>
      </div>
    </div>
  );
}
