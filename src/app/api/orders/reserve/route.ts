import { NextResponse } from 'next/server';
import { reserveItem } from '@/src/shared/lib/services/marketplace';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, itemId } = body;

    if (!userId || !itemId) {
      return NextResponse.json({ error: 'userId e itemId são obrigatórios' }, { status: 400 });
    }

    const order = await reserveItem(userId, itemId);
    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
