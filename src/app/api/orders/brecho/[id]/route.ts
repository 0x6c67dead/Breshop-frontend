import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: brechoId } = await params;
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('all') === 'true';

    const where: any = { item: { brechoId } };
    if (!fetchAll) {
      where.status = { in: ['RESERVED', 'APPROVED', 'AWAITING_DELIVERY'] };
    }

    const orders = await prisma.order.findMany({
      where,
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
