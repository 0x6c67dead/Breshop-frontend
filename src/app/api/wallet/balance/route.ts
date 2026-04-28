import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brechoId = searchParams.get('brechoId');

    if (!brechoId) return NextResponse.json({ error: 'brechoId obrigatório' }, { status: 400 });

    const wallet = await prisma.coinWallet.findFirst({ where: { brechoId } });
    const earned = await prisma.order.aggregate({
      where: { item: { brechoId }, status: 'COMPLETED' },
      _sum: { total: true },
    });

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      locked: wallet?.locked ?? 0,
      totalEarned: earned._sum.total ?? 0,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro' }, { status: 500 });
  }
}
