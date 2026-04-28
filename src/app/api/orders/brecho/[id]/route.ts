import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: brechoId } = await params;

    const orders = await prisma.order.findMany({
      where: {
        item: { brechoId },
        status: { in: ['RESERVED', 'APPROVED', 'AWAITING_DELIVERY'] },
      },
      include: {
        item: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
