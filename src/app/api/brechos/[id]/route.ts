import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const brecho = await prisma.brecho.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true } },
        items: { select: { id: true } },
      },
    });
    if (!brecho) return NextResponse.json({ error: 'Brechó não encontrado' }, { status: 404 });
    return NextResponse.json(brecho);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
