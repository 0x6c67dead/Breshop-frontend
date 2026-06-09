import { NextResponse } from 'next/server';
import { rejectOrder } from '@/src/shared/lib/services/marketplace';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, action } = body;

    if (!reason || !action) {
      return NextResponse.json({ error: 'reason e action são obrigatórios' }, { status: 400 });
    }

    const order = await rejectOrder(id, reason, action);
    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
