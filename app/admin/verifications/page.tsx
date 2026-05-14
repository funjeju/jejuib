'use client';

import { useEffect, useState } from 'react';

const DOC_TYPE_LABEL: Record<string, string> = {
  student_id: '학생증',
  enrollment_cert: '재학증명서',
  graduation_cert: '졸업증명서',
  family_relation: '가족관계증명서',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  manual_review: '수동 검토',
  approved: '승인',
  rejected: '거절',
};

interface VerificationItem {
  id: string;
  userId: string;
  schoolId: string;
  documentType: string;
  storagePath: string;
  ocrConfidence: number;
  extractedSchool: string;
  status: string;
  createdAt: string | null;
}

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/verifications')
      .then(r => r.json())
      .then(d => setItems(d.items ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  async function handle(id: string, action: 'approve' | 'reject') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: rejectReason[id] ?? '' }),
      });
      if (!res.ok) throw new Error('failed');
      setItems(prev => prev.filter(v => v.id !== id));
    } catch {
      alert('처리 실패');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-xl font-bold text-text">인증 검토</h1>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-text-muted">검토 대기 중인 인증이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {items.map(v => (
            <div key={v.id} className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === 'manual_review' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {STATUS_LABEL[v.status] ?? v.status}
                    </span>
                    <span className="text-xs text-text-muted">{DOC_TYPE_LABEL[v.documentType] ?? v.documentType}</span>
                  </div>
                  <p className="text-sm font-medium text-text">학교 ID: {v.schoolId}</p>
                  <p className="text-xs text-text-muted">
                    OCR 추출: <span className="text-text">{v.extractedSchool || '—'}</span>
                    {' · '}신뢰도: <span className={`font-medium ${v.ocrConfidence >= 85 ? 'text-green-600' : 'text-red-500'}`}>{(v.ocrConfidence * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    사용자: {v.userId}
                    {v.createdAt && ` · ${new Date(v.createdAt).toLocaleDateString('ko-KR')}`}
                  </p>
                  {v.storagePath && (
                    <a
                      href={`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/${v.storagePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      문서 보기 →
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handle(v.id, 'approve')}
                  disabled={busy === v.id}
                  className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {busy === v.id ? '처리 중...' : '승인'}
                </button>
                <input
                  type="text"
                  placeholder="거절 사유 (선택)"
                  value={rejectReason[v.id] ?? ''}
                  onChange={e => setRejectReason(prev => ({ ...prev, [v.id]: e.target.value }))}
                  className="flex-1 min-w-0 px-3 py-1.5 border border-border rounded-lg bg-bg text-text text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={() => handle(v.id, 'reject')}
                  disabled={busy === v.id}
                  className="px-4 py-1.5 border border-red-300 text-red-500 text-xs font-medium rounded-lg hover:border-red-500 transition disabled:opacity-50"
                >
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
