import { NextResponse } from 'next/server';
import { confirmDelivery } from '@/src/shared/lib/services/marketplace';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await confirmDelivery(id);
    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
