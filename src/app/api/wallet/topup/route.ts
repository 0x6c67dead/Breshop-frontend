import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount } = body;

    if (!userId || !amount) {
      return NextResponse.json({ error: 'userId e amount são obrigatórios' }, { status: 400 });
    }

    const wallet = await prisma.coinWallet.upsert({
      where: { userId },
      update: {
        balance: { increment: amount },
      },
      create: {
        userId,
        ownerId: userId,
        balance: amount,
      },
    });

    await prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'TOPUP',
        amount: amount,
      },
    });

    return NextResponse.json(wallet, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
