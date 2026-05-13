import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상 토큰 (학교 검색기 기존 토큰)
        bg: 'hsl(39 38% 97%)',        // #FAF8F4 웜 베이지
        surface: 'hsl(0 0% 100%)',    // #FFFFFF
        text: 'hsl(0 0% 10%)',         // #1A1A1A
        'text-muted': 'hsl(0 0% 42%)', // #6B6B6B
        'text-faint': 'hsl(0 0% 60%)', // #9A9A9A
        border: 'hsl(35 17% 89%)',     // #E7E3DB
        'border-strong': 'hsl(36 14% 80%)', // #D4CFC4
        accent: 'hsl(158 43% 21%)',    // #1F4D3F 딥그린
        'accent-soft': 'hsl(146 24% 92%)', // #E8F0EC

        // 상태 배지
        'cert-bg': 'hsl(158 50% 92%)',   // #E1F5EE
        'cert-text': 'hsl(158 78% 17%)',  // #085041
        'cand-bg': 'hsl(33 79% 92%)',    // #FAEEDA
        'cand-text': 'hsl(28 88% 21%)',  // #633806
        'int-bg': 'hsl(48 17% 92%)',     // #EFEDE6
        'int-text': 'hsl(60 2% 27%)',    // #444441
        'prog-bg': 'hsl(245 80% 96%)',   // #EEEDFE
        'prog-text': 'hsl(247 46% 37%)', // #3C3489
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
    },
  },
  plugins: [],
};

export default config;
