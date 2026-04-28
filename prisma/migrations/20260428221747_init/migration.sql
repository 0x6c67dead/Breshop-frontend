-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'BRECHO_OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD_PENDING_DELIVERY', 'DELIVERED_PENDING_CONFIRMATION', 'COMPLETED', 'CANCELLED', 'RETURNED_TO_STORE', 'SOLD_OUTSIDE_APP');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RESERVED', 'APPROVED', 'REJECTED', 'AWAITING_DELIVERY', 'DELIVERED_PENDING_CONFIRMATION', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RejectionReason" AS ENUM ('ITEM_ALREADY_SOLD', 'ITEM_NOT_FOUND', 'STOCK_ERROR', 'OTHER');

-- CreateEnum
CREATE TYPE "RejectionAction" AS ENUM ('RETURN_TO_STORE', 'MARK_AS_SOLD_OUTSIDE_APP');

-- CreateEnum
CREATE TYPE "CoinTransactionType" AS ENUM ('TOPUP', 'RESERVE', 'RELEASE', 'REFUND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brecho" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brecho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "brechoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'RESERVED',
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectionReason" "RejectionReason",
    "rejectionAction" "RejectionAction",

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinWallet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "locked" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "brechoId" TEXT,

    CONSTRAINT "CoinWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "CoinTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CoinWallet_ownerId_key" ON "CoinWallet"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "CoinWallet_userId_key" ON "CoinWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoinWallet_brechoId_key" ON "CoinWallet"("brechoId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_brechoId_fkey" FOREIGN KEY ("brechoId") REFERENCES "Brecho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinWallet" ADD CONSTRAINT "CoinWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinWallet" ADD CONSTRAINT "CoinWallet_brechoId_fkey" FOREIGN KEY ("brechoId") REFERENCES "Brecho"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CoinWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
