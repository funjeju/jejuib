import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent-soft border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="font-bold text-lg text-accent mb-4">펀제주</h3>
            <p className="text-sm text-text-muted mb-2">
              IB 학부모와 학생을 위한 신뢰의 정보 허브
            </p>
            <p className="text-sm text-text-faint">
              법인: 펀제주 (주)
              <br />
              문의: contact@fundjeju.com
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="font-semibold text-text mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide" className="text-text-muted hover:text-accent transition">
                  IB 가이드
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-text-muted hover:text-accent transition">
                  학교 검색
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-text-muted hover:text-accent transition">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/jeju" className="text-text-muted hover:text-accent transition">
                  제주 정보
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="font-semibold text-text mb-4">정책</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-text-muted hover:text-accent transition">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="/terms" className="text-text-muted hover:text-accent transition">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/contact" className="text-text-muted hover:text-accent transition">
                  문의
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-border pt-8 mt-8">
          <p className="text-xs text-text-faint text-center">
            © {currentYear} 펀제주 (주). All rights reserved.
            <br />
            청소년보호책임자: [담당자명] | 이메일: contact@fundjeju.com
          </p>
        </div>
      </div>
    </footer>
  );
}
