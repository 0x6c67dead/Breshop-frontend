import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: { brecho: { select: { id: true, name: true, ownerId: true } } },
    });
    if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
