import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function POST(request: Request) {
  try {
    const { brechoId, amount } = await request.json();

    if (!brechoId || !amount) return NextResponse.json({ error: 'brechoId e amount obrigatórios' }, { status: 400 });

    const wallet = await prisma.coinWallet.findFirst({ where: { brechoId } });
    if (!wallet) return NextResponse.json({ error: 'Carteira não encontrada' }, { status: 404 });
    if (wallet.balance < amount) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });

    const updated = await prisma.$transaction(async (tx) => {
      await tx.coinTransaction.create({
        data: { walletId: wallet.id, type: 'RELEASE', amount: -amount },
      });
      return tx.coinWallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro' }, { status: 500 });
  }
}
