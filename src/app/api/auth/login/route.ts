import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    console.log(`[LOGIN API] Attempt for email: "${email}". User found: ${!!user}`);
    if (user) {
      console.log(`[LOGIN API] Input password: "${password}" (length: ${password?.length})`);
      console.log(`[LOGIN API] Db password hash: "${user.password}" (length: ${user.password?.length})`);
      const match = bcrypt.compareSync(password, user.password);
      console.log(`[LOGIN API] Password match result: ${match}`);
      if (!match) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const wallet = await prisma.coinWallet.findFirst({ where: { userId: user.id } });

    // Resolve brechoId for OWNER
    let brechoId: string | undefined;
    if (user.role === 'BRECHO_OWNER') {
      const brecho = await prisma.brecho.findFirst({ where: { ownerId: user.id } });
      brechoId = brecho?.id;
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      brechoId,
      balance: wallet?.balance ?? 0,
      locked: wallet?.locked ?? 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
