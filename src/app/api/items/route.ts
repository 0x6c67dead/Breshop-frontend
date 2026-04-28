import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: { status: 'AVAILABLE' },
      include: { brecho: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
