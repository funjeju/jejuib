'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SCHOOLS } from '@/app/data/schools';

interface SchoolSearchModalProps {
  onClose: () => void;
}

export function SchoolSearchModal({ onClose }: SchoolSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  const regions = ['전체', ...Array.from(new Set(SCHOOLS.map((s) => s.region)))];

  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion =
        selectedRegion === '전체' || school.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const handleSelectSchool = (schoolId: string) => {
    onClose();
    router.push(`/school/${schoolId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text">학교 검색</h2>
          <button
            onClick={onClose}
            className="text-2xl text-text-muted hover:text-text transition"
          >
            ✕
          </button>
        </div>

        {/* 검색 바 */}
        <div className="p-6 border-b border-border space-y-4">
          <input
            type="text"
            placeholder="학교명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />

          {/* 지역 필터 */}
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                  selectedRegion === region
                    ? 'bg-accent text-white'
                    : 'bg-muted text-text-muted hover:bg-border'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* 학교 목록 */}
        <div className="flex-1 overflow-y-auto">
          {filteredSchools.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelectSchool(school.id!)}
                  className="w-full p-4 hover:bg-muted transition text-left"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-text">{school.name}</h3>
                      <p className="text-sm text-text-muted">{school.nameEn}</p>
                    </div>
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold whitespace-nowrap">
                      {school.stage === '인증' ? '✓ 인증' : '후보'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-surface text-text-muted rounded">
                      {school.level}
                    </span>
                    <span className="text-xs px-2 py-1 bg-surface text-text-muted rounded">
                      {school.region}
                    </span>
                    {school.programs.slice(0, 2).map((prog) => (
                      <span
                        key={prog}
                        className="text-xs px-2 py-1 bg-accent/10 text-accent rounded"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-border text-center text-sm text-text-muted">
          {filteredSchools.length}개 학교
        </div>
      </div>
    </div>
  );
}
