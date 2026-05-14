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
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedLevel, setSelectedLevel] = useState('전체');
  const [selectedStage, setSelectedStage] = useState('전체');
  const [selectedProgram, setSelectedProgram] = useState('전체');

  const regions = ['전체', ...Array.from(new Set(SCHOOLS.map((s) => s.region))).sort()];
  const levels = ['전체', ...Array.from(new Set(SCHOOLS.map((s) => s.level))).sort()];
  const stages = ['전체', '인증', '후보'];
  const allPrograms = Array.from(new Set(SCHOOLS.flatMap((s) => s.programs))).sort();
  const programs = ['전체', ...allPrograms];

  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === '전체' || school.region === selectedRegion;
      const matchesLevel = selectedLevel === '전체' || school.level === selectedLevel;
      const matchesStage = selectedStage === '전체' || school.stage === selectedStage;
      const matchesProgram =
        selectedProgram === '전체' || school.programs?.some(p => p === selectedProgram);

      return matchesSearch && matchesRegion && matchesLevel && matchesStage && matchesProgram;
    });
  }, [searchQuery, selectedRegion, selectedLevel, selectedStage, selectedProgram]);

  const stats = useMemo(() => {
    return {
      total: filteredSchools.length,
      certified: filteredSchools.filter(s => s.stage === '인증').length,
      candidate: filteredSchools.filter(s => s.stage === '후보').length,
      interested: filteredSchools.filter(s => s.programs?.some(p => ['PYP', 'MYP', 'DP'].includes(p))).length,
    };
  }, [filteredSchools]);

  const handleSelectSchool = (schoolId: string) => {
    onClose();
    router.push(`/school/${schoolId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-bold text-text">학교 검색</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-border hover:text-text transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* 통계 */}
        <div className="mx-8 mb-6 grid grid-cols-4 gap-3">
          {[
            { value: stats.total, label: '전체', color: 'text-text' },
            { value: stats.certified, label: '인증', color: 'text-accent' },
            { value: stats.candidate, label: '후보', color: 'text-text-muted' },
            { value: stats.interested, label: '관심', color: 'text-text-muted' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-bg rounded-xl py-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* 검색 + 필터 */}
        <div className="px-8 pb-5 space-y-3">
          <input
            type="text"
            placeholder="학교명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl bg-bg text-text placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: selectedRegion, onChange: setSelectedRegion, options: regions },
              { value: selectedLevel, onChange: setSelectedLevel, options: levels },
              { value: selectedStage, onChange: setSelectedStage, options: stages },
              { value: selectedProgram, onChange: setSelectedProgram, options: programs },
            ].map(({ value, onChange, options }, i) => (
              <select
                key={i}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-border mx-8" />

        {/* 학교 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredSchools.length === 0 ? (
            <div className="py-16 text-center text-text-muted text-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSelectSchool(school.id!)}
                className="w-full px-4 py-4 rounded-xl hover:bg-bg transition text-left my-0.5"
              >
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div>
                    <span className="font-semibold text-text">{school.name}</span>
                    {school.nameEn && (
                      <span className="block text-xs text-text-muted mt-0.5">{school.nameEn}</span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    school.stage === '인증'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-border text-text-muted'
                  }`}>
                    {school.stage === '인증' ? '✓ 인증' : '후보'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-border/60 text-text-muted rounded-full">
                    {school.level}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-border/60 text-text-muted rounded-full">
                    {school.region}
                  </span>
                  {school.programs.map((prog) => (
                    <span
                      key={prog}
                      className="text-xs px-2.5 py-1 bg-accent/10 text-accent rounded-full font-medium"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        {/* 푸터 */}
        <div className="px-8 py-4 border-t border-border text-center text-xs text-text-muted">
          {filteredSchools.length}개 학교
        </div>
      </div>
    </div>
  );
}
