import { Metadata } from 'next';
import { SCHOOLS } from '@/app/data/schools';

export async function generateSchoolMetadata(id: string): Promise<Metadata> {
  const school = SCHOOLS.find((s) => s.id === id);

  if (!school) {
    return { title: '학교를 찾을 수 없습니다' };
  }

  const title = `${school.name} IB 커뮤니티 — 후기·질문·정보`;
  const description = `${school.name}(${school.nameEn}) ${school.stage === '인증' ? 'IB 인증 학교' : 'IB 후보 학교'}. ${school.region} ${school.level}. 학부모·학생 커뮤니티, 학교 정보, 실제 후기.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}
