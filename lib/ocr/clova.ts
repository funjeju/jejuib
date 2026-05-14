// 네이버 클로바 OCR client
// API docs: https://api.ncloud-docs.com/docs/ai-application-service-ocr-general

const CLOVA_OCR_URL = process.env.CLOVA_OCR_URL;
const CLOVA_OCR_SECRET = process.env.CLOVA_OCR_SECRET;

export interface ClovaOcrResult {
  rawText: string;
  extractedSchool: string;
  extractedYear: string;
  confidence: number; // 0~1
}

interface ClovaField {
  inferText: string;
  inferConfidence: number;
}

interface ClovaImage {
  fields?: ClovaField[];
}

interface ClovaResponse {
  images: ClovaImage[];
}

// IB 학교명 키워드 매핑 (학교명 추출에 사용)
const SCHOOL_KEYWORDS = [
  'NLCS',
  'BHA',
  'KIS',
  'SJA',
  'GIFS',
  '한국국제학교',
  '제주국제학교',
  '브랭섬홀',
  '세인트존스베리',
  '노스런던컬리지에잇',
  '제주외국어고',
  '표선고',
  '성산고',
  '제주제일고',
  '대기고',
  '남원고',
];

export async function callClovaOcr(imageBase64: string, mimeType: string): Promise<ClovaOcrResult> {
  if (!CLOVA_OCR_URL || !CLOVA_OCR_SECRET) {
    throw new Error('CLOVA_OCR_URL or CLOVA_OCR_SECRET env var not set');
  }

  const requestBody = {
    version: 'V2',
    requestId: `req-${Date.now()}`,
    timestamp: Date.now(),
    images: [
      {
        format: mimeType.split('/')[1] || 'jpeg',
        name: 'document',
        data: imageBase64,
      },
    ],
  };

  const response = await fetch(CLOVA_OCR_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': CLOVA_OCR_SECRET,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Clova OCR error: ${response.status}`);
  }

  const data = (await response.json()) as ClovaResponse;
  const fields = data.images?.[0]?.fields || [];

  const rawText = fields.map((f) => f.inferText).join(' ');
  const avgConfidence =
    fields.length > 0
      ? fields.reduce((sum, f) => sum + f.inferConfidence, 0) / fields.length
      : 0;

  const extractedSchool = extractSchoolName(rawText);
  const extractedYear = extractYear(rawText);

  return {
    rawText,
    extractedSchool,
    extractedYear,
    confidence: avgConfidence,
  };
}

function extractSchoolName(text: string): string {
  const upper = text.toUpperCase();
  for (const keyword of SCHOOL_KEYWORDS) {
    if (upper.includes(keyword.toUpperCase())) {
      return keyword;
    }
  }
  return '';
}

function extractYear(text: string): string {
  const match = text.match(/20\d{2}/);
  return match ? match[0] : '';
}
