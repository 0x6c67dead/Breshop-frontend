import { NextResponse } from 'next/server';
import prisma from '@/src/shared/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, brechoId, tagNames } = body;

    if (!title || price == null || !brechoId) {
      return NextResponse.json(
        { error: 'title, price e brechoId são obrigatórios' },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        title,
        price: Number(price),
        brechoId,
        status: 'AVAILABLE',
        ...(Array.isArray(tagNames) && tagNames.length
          ? { tags: { connect: (tagNames as string[]).map((name) => ({ name })) } }
          : {}),
      },
      include: {
        brecho: { select: { id: true, name: true } },
        tags: { select: { name: true } },
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brechoId = searchParams.get('brechoId');
    const tag = searchParams.get('tag');
    const includeUnavailable = searchParams.get('all') === 'true';
    const skip = parseInt(searchParams.get('skip') ?? '0', 10);
    const take = parseInt(searchParams.get('take') ?? '20', 10);

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
      skip: isNaN(skip) ? 0 : skip,
      take: isNaN(take) ? 20 : Math.min(take, 100),
    });
    return NextResponse.json(items);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
