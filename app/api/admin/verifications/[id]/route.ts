import { NextRequest, NextResponse } from 'next/server';
import { approveVerification, rejectVerification } from '@/lib/firestore/admin';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { action, reason } = await req.json();

  if (action === 'approve') {
    await approveVerification(params.id);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reject') {
    await rejectVerification(params.id, reason ?? '');
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'invalid action' }, { status: 400 });
}
