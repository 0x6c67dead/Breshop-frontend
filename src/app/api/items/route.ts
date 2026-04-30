import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brechoId = searchParams.get('brechoId');
    const tag = searchParams.get('tag');
    const includeUnavailable = searchParams.get('all') === 'true';

    const where: any = includeUnavailable ? {} : { status: 'AVAILABLE' };

    if (brechoId) {
      where.brechoId = brechoId;
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        brecho: { select: { id: true, name: true } },
        tags: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
