'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GuideModalProps {
  onClose: () => void;
}

type GuideType = 'pyp' | 'myp';

export function GuideModal({ onClose }: GuideModalProps) {
  const [selectedGuide, setSelectedGuide] = useState<GuideType>('pyp');
  const [selectedPage, setSelectedPage] = useState('index');
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const guides = [
    { id: 'pyp', label: 'PYP 가이드' },
    { id: 'myp', label: 'MYP 가이드' },
  ];

  const pagesMap: Record<GuideType, { id: string; label: string }[]> = {
    pyp: [
      { id: 'index', label: 'IB PYP 안내' },
      { id: 'bigpic', label: '큰 그림' },
      { id: 'cycle', label: '수업 진행' },
      { id: 'timeline', label: '1년 흐름' },
      { id: 'concepts', label: '개념 사전' },
      { id: 'evaluation', label: '평가' },
      { id: 'forms', label: '양식' },
      { id: 'parent', label: '자녀와 대화' },
      { id: 'glossary', label: '용어' },
    ],
    myp: [
      { id: 'index', label: 'IB MYP 안내' },
      { id: 'bigpic', label: '큰 그림' },
      { id: 'cycle', label: '수업 진행' },
      { id: 'timeline', label: '1년 흐름' },
      { id: 'concepts', label: '개념 사전' },
      { id: 'evaluation', label: '평가' },
      { id: 'forms', label: '양식' },
      { id: 'parent', label: '자녀와 대화' },
      { id: 'glossary', label: '용어' },
    ],
  };

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const fileMap: Record<GuideType, Record<string, string>> = {
          pyp: {
            index: 'pyp_index.html',
            bigpic: 'pyp_bigpic.html',
            cycle: 'pyp_cycle.html',
            timeline: 'pyp_timeline.html',
            concepts: 'pyp_concepts.html',
            evaluation: 'pyp_evaluation.html',
            forms: 'pyp_forms.html',
            parent: 'pyp_parent.html',
            glossary: 'pyp_glossary.html',
          },
          myp: {
            index: 'myp_index.html',
            bigpic: 'myp_bigpic.html',
            cycle: 'myp_cycle.html',
            timeline: 'myp_timeline.html',
            concepts: 'myp_concepts.html',
            evaluation: 'myp_evaluation.html',
            forms: 'myp_forms.html',
            parent: 'myp_parent.html',
            glossary: 'myp_glossary.html',
          },
        };

        const fileName = fileMap[selectedGuide][selectedPage];
        const response = await fetch(`/guide/${selectedGuide}/${selectedPage}`);
        const html = await response.text();
        setHtmlContent(html);
      } catch (error) {
        console.error('Failed to load guide:', error);
        setHtmlContent('<p>콘텐츠를 불러올 수 없습니다.</p>');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedGuide, selectedPage]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-lg w-full max-w-5xl h-[85vh] flex flex-col">
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

        {/* 가이드 선택 탭 */}
        <div className="flex gap-4 px-6 py-4 border-b border-border">
          {guides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide.id as GuideType);
                setSelectedPage('index');
              }}
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

        {/* 페이지 선택 */}
        <div className="px-6 py-3 border-b border-border overflow-x-auto">
          <div className="flex gap-2 flex-wrap">
            {pagesMap[selectedGuide].map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={`px-3 py-1 rounded text-sm transition ${
                  selectedPage === page.id
                    ? 'bg-accent text-white'
                    : 'bg-muted text-text-muted hover:bg-border'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-muted">로드 중...</p>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose max-w-none p-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}
