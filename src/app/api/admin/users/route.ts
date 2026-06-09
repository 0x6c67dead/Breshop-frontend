import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallet: { select: { balance: true, locked: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const safe = users.map(({ password: _pw, ...u }) => u);
    return NextResponse.json(safe);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
