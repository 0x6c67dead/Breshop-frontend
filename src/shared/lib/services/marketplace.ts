import prisma from '../prisma';
import { RejectionReason, RejectionAction } from '@prisma/client';

export async function reserveItem(userId: string, itemId: string) {
  return await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: itemId } });

    if (!item || item.status !== "AVAILABLE") {
      throw new Error("Item indisponível");
    }

    const wallet = await tx.coinWallet.findFirst({ where: { userId } });

    if (!wallet || wallet.balance < item.price) {
      throw new Error("Saldo insuficiente");
    }

    // cria pedido
    const order = await tx.order.create({
      data: {
        userId,
        itemId,
        total: item.price,
        status: "RESERVED",
      },
    });

    // trava item
    await tx.item.update({
      where: { id: itemId },
      data: { status: "RESERVED" },
    });

    // movimenta coin
    await tx.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: "RESERVE",
        amount: item.price,
      },
    });

    await tx.coinWallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: item.price },
        locked: { increment: item.price },
      },
    });

    return order;
  });
}

export async function rejectOrder(orderId: string, reason: RejectionReason, action: RejectionAction) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { item: true, user: true },
    });

    if (!order) throw new Error("Pedido não encontrado");

    const wallet = await tx.coinWallet.findFirst({
      where: { userId: order.userId },
    });

    if (!wallet) throw new Error("Carteira do usuário não encontrada");

    // atualizar pedido
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        rejectionAction: action,
      },
    });

    // devolver coin
    await tx.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: "REFUND",
        amount: order.total,
      },
    });

    await tx.coinWallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: order.total },
        locked: { decrement: order.total },
      },
    });

    // atualizar item
    await tx.item.update({
      where: { id: order.itemId },
      data: {
        status:
          action === "RETURN_TO_STORE"
            ? "AVAILABLE"
            : "SOLD_OUTSIDE_APP",
      },
    });
    
    return order;
  });
}

export async function approveOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "APPROVED" },
  });
}

export async function confirmDelivery(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { item: true },
    });

    if (!order) throw new Error("Pedido não encontrado");

    const userWallet = await tx.coinWallet.findFirst({
      where: { userId: order.userId },
    });

    const brechoWallet = await tx.coinWallet.findFirst({
      where: { brechoId: order.item.brechoId },
    });

    if (!userWallet || !brechoWallet) {
        throw new Error("Carteira não encontrada");
    }

    // libera coin para brechó
    await tx.coinTransaction.create({
      data: {
        walletId: brechoWallet.id,
        type: "RELEASE",
        amount: order.total,
      },
    });

    await tx.coinWallet.update({
      where: { id: brechoWallet.id },
      data: {
        balance: { increment: order.total },
      },
    });

    await tx.coinWallet.update({
      where: { id: userWallet.id },
      data: {
        locked: { decrement: order.total },
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });
    
    return order;
  });
}
