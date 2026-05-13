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

        {/* 통계 대시보드 */}
        <div className="p-6 border-b border-border grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{stats.total}</div>
            <div className="text-xs text-text-muted mt-1">표시 중</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{stats.certified}</div>
            <div className="text-xs text-text-muted mt-1">인증학교</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{stats.candidate}</div>
            <div className="text-xs text-text-muted mt-1">우보학교</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{stats.interested}</div>
            <div className="text-xs text-text-muted mt-1">관심학교</div>
          </div>
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

          {/* 필터 드롭다운 */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>

            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
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
