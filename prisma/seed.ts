import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!
const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter });

const HASH = (pw: string) => bcrypt.hashSync(pw, 10);

async function main() {
  console.log("🌱 Limpando banco...");
  await prisma.coinTransaction.deleteMany();
  await prisma.coinWallet.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();
  await prisma.brecho.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Criando usuários...");

  const admin = await prisma.user.create({
    data: { id: "usr-admin", name: "Admin Breshop", email: "admin@breshop.com", password: HASH("admin123"), role: "ADMIN" },
  });

  const owners = await Promise.all([
    prisma.user.create({ data: { id: "usr-owner-1", name: "Carlos Curador", email: "carlos@acervo90s.com", password: HASH("owner123"), role: "BRECHO_OWNER" } }),
    prisma.user.create({ data: { id: "usr-owner-2", name: "Lucia Solar", email: "lucia@garimpossolar.com", password: HASH("owner123"), role: "BRECHO_OWNER" } }),
    prisma.user.create({ data: { id: "usr-owner-3", name: "Felix Urbano", email: "felix@reliquiaurbana.com", password: HASH("owner123"), role: "BRECHO_OWNER" } }),
    prisma.user.create({ data: { id: "usr-owner-4", name: "Ana Vintage", email: "ana@vintagecarioca.com", password: HASH("owner123"), role: "BRECHO_OWNER" } }),
    prisma.user.create({ data: { id: "usr-owner-5", name: "Pedro Retrô", email: "pedro@atelierretro.com", password: HASH("owner123"), role: "BRECHO_OWNER" } }),
  ]);

  const users = await Promise.all([
    prisma.user.create({ data: { id: "usr-user-1", name: "Clara Vintage", email: "clara@gmail.com", password: HASH("user123"), role: "USER" } }),
    prisma.user.create({ data: { id: "usr-user-2", name: "João Silva", email: "joao@gmail.com", password: HASH("user123"), role: "USER" } }),
    prisma.user.create({ data: { id: "usr-user-3", name: "Maria Oliveira", email: "maria@gmail.com", password: HASH("user123"), role: "USER" } }),
  ]);

  console.log("🏪 Criando brechós...");

  await Promise.all([
    prisma.brecho.create({ data: { id: "shop-1", name: "Acervo 90s", ownerId: owners[0].id } }),
    prisma.brecho.create({ data: { id: "shop-2", name: "Garimpo Solar", ownerId: owners[1].id } }),
    prisma.brecho.create({ data: { id: "shop-3", name: "Relíquia Urbana", ownerId: owners[2].id } }),
    prisma.brecho.create({ data: { id: "shop-4", name: "Vintage Carioca", ownerId: owners[3].id } }),
    prisma.brecho.create({ data: { id: "shop-5", name: "Ateliê Retrô", ownerId: owners[4].id } }),
  ]);

  console.log("💰 Criando carteiras (1000 coins cada)...");

  const allUsers = [admin, ...owners, ...users];
  for (const u of allUsers) {
    await prisma.coinWallet.create({ data: { ownerId: u.id, userId: u.id, balance: 1000, locked: 0 } });
  }
  const brechoIds = ["shop-1", "shop-2", "shop-3", "shop-4", "shop-5"];
  for (const bId of brechoIds) {
    await prisma.coinWallet.create({ data: { ownerId: bId, brechoId: bId, balance: 0, locked: 0 } });
  }

  console.log("👗 Criando 50 itens...");

  const items = [
    // Acervo 90s (shop-1) — 10 itens
    { id: "prod-1",  title: "Burberry Classic Trench Coat",    price: 850,  brechoId: "shop-1" },
    { id: "prod-3",  title: "Nike Air Max Original 90",        price: 320,  brechoId: "shop-1" },
    { id: "prod-7",  title: "Prada Sport Tech Sneakers",       price: 550,  brechoId: "shop-1" },
    { id: "prod-9",  title: "Rolex Oyster Datejust",           price: 4500, brechoId: "shop-1" },
    { id: "prod-12", title: "Wool & Co Checkered Scarf",       price: 110,  brechoId: "shop-1" },
    { id: "prod-15", title: "Classic Aviator Gold Frame",      price: 175,  brechoId: "shop-1" },
    { id: "prod-18", title: "Pin Master Retro Pin Set",        price: 35,   brechoId: "shop-1" },
    { id: "prod-19", title: "Levi's 501 Original Denim",       price: 220,  brechoId: "shop-1" },
    { id: "prod-20", title: "Ralph Lauren Polo Vintage",       price: 145,  brechoId: "shop-1" },
    { id: "prod-21", title: "Champion Hoodie 90s Archive",     price: 190,  brechoId: "shop-1" },

    // Garimpo Solar (shop-2) — 10 itens
    { id: "prod-2",  title: "Leather Archive Biker Jacket 80s", price: 420, brechoId: "shop-2" },
    { id: "prod-5",  title: "New Balance 990 Heritage",         price: 280, brechoId: "shop-2" },
    { id: "prod-8",  title: "Ray-Ban Wayfarer 70s",             price: 190, brechoId: "shop-2" },
    { id: "prod-10", title: "Silver Collective Heavy Chain",    price: 240, brechoId: "shop-2" },
    { id: "prod-13", title: "Urban Beanie Ribbed Knit Cap",     price: 65,  brechoId: "shop-2" },
    { id: "prod-16", title: "Silk Road Floral Silk Scarf",      price: 130, brechoId: "shop-2" },
    { id: "prod-22", title: "Adidas Originals Windbreaker",     price: 310, brechoId: "shop-2" },
    { id: "prod-23", title: "Converse Chuck Taylor All Star",   price: 160, brechoId: "shop-2" },
    { id: "prod-24", title: "Fila Disruptor Chunky Sneaker",    price: 195, brechoId: "shop-2" },
    { id: "prod-25", title: "Tommy Hilfiger Flag Tee Vintage",  price: 95,  brechoId: "shop-2" },

    // Relíquia Urbana (shop-3) — 10 itens
    { id: "prod-4",  title: "Omega Classic Timepiece",          price: 1200, brechoId: "shop-3" },
    { id: "prod-6",  title: "Denim Co. Trucker Jacket",         price: 150,  brechoId: "shop-3" },
    { id: "prod-11", title: "Eco Bag Canvas Tote XL",           price: 45,   brechoId: "shop-3" },
    { id: "prod-14", title: "Craft Leather Tan Belt",           price: 85,   brechoId: "shop-3" },
    { id: "prod-17", title: "Traveler Weekend Duffle",          price: 320,  brechoId: "shop-3" },
    { id: "prod-26", title: "Dickies Cargo Worker Pants",       price: 175,  brechoId: "shop-3" },
    { id: "prod-27", title: "Vans Old Skool Classic",           price: 210,  brechoId: "shop-3" },
    { id: "prod-28", title: "Timberland 6-Inch Boot Vintage",   price: 390,  brechoId: "shop-3" },
    { id: "prod-29", title: "Carhartt Work Jacket Washed",      price: 285,  brechoId: "shop-3" },
    { id: "prod-30", title: "Fossil Leather Minimalist Watch",  price: 340,  brechoId: "shop-3" },

    // Vintage Carioca (shop-4) — 10 itens
    { id: "prod-31", title: "Havaianas Special Edition",        price: 55,   brechoId: "shop-4" },
    { id: "prod-32", title: "Osklen Ipanema Linen Shirt",       price: 280,  brechoId: "shop-4" },
    { id: "prod-33", title: "Redley Surf Board Short",          price: 120,  brechoId: "shop-4" },
    { id: "prod-34", title: "Reserva Slim Chino Pants",         price: 195,  brechoId: "shop-4" },
    { id: "prod-35", title: "Farm Rio Floral Maxi Dress",       price: 350,  brechoId: "shop-4" },
    { id: "prod-36", title: "Mizuno Wave Creation Running",     price: 265,  brechoId: "shop-4" },
    { id: "prod-37", title: "Arezzo Couro Ankle Boot",          price: 430,  brechoId: "shop-4" },
    { id: "prod-38", title: "Hering Camiseta Básica Pack",      price: 75,   brechoId: "shop-4" },
    { id: "prod-39", title: "Colcci Bolsa Couro Mini",          price: 310,  brechoId: "shop-4" },
    { id: "prod-40", title: "Lacoste Polo Piquê Heritage",      price: 240,  brechoId: "shop-4" },

    // Ateliê Retrô (shop-5) — 10 itens
    { id: "prod-41", title: "Casablanca Silk Track Jacket",     price: 680,  brechoId: "shop-5" },
    { id: "prod-42", title: "Stüssy 8-Ball Fleece",             price: 390,  brechoId: "shop-5" },
    { id: "prod-43", title: "Supreme Box Logo Tee",             price: 520,  brechoId: "shop-5" },
    { id: "prod-44", title: "Palace Tri-Ferg Longsleeve",       price: 295,  brechoId: "shop-5" },
    { id: "prod-45", title: "Kith Classics Crew Sweat",         price: 340,  brechoId: "shop-5" },
    { id: "prod-46", title: "Off-White Industrial Belt",        price: 185,  brechoId: "shop-5" },
    { id: "prod-47", title: "Jordan 1 Retro High OG",           price: 950,  brechoId: "shop-5" },
    { id: "prod-48", title: "Yeezy Foam Runner Natural",        price: 780,  brechoId: "shop-5" },
    { id: "prod-49", title: "Carhartt WIP Detroit Jacket",      price: 460,  brechoId: "shop-5" },
    { id: "prod-50", title: "Dickies Double Knee Pants",        price: 210,  brechoId: "shop-5" },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: { id: item.id, title: item.title, price: item.price, brechoId: item.brechoId, status: "AVAILABLE" },
    });
  }

  console.log("📦 Criando histórico de pedidos e transações...");

  // 2 completed orders per brecho (10 total), using different users
  const historicalOrders = [
    // Acervo 90s (shop-1)
    { id: "order-hist-1", userId: "usr-user-1", itemId: "prod-12", brechoId: "shop-1", total: 110 },
    { id: "order-hist-2", userId: "usr-user-2", itemId: "prod-15", brechoId: "shop-1", total: 175 },
    // Garimpo Solar (shop-2)
    { id: "order-hist-3", userId: "usr-user-2", itemId: "prod-13", brechoId: "shop-2", total: 65 },
    { id: "order-hist-4", userId: "usr-user-3", itemId: "prod-16", brechoId: "shop-2", total: 130 },
    // Relíquia Urbana (shop-3)
    { id: "order-hist-5", userId: "usr-user-1", itemId: "prod-11", brechoId: "shop-3", total: 45 },
    { id: "order-hist-6", userId: "usr-user-3", itemId: "prod-14", brechoId: "shop-3", total: 85 },
    // Vintage Carioca (shop-4)
    { id: "order-hist-7", userId: "usr-user-1", itemId: "prod-38", brechoId: "shop-4", total: 75 },
    { id: "order-hist-8", userId: "usr-user-2", itemId: "prod-31", brechoId: "shop-4", total: 55 },
    // Ateliê Retrô (shop-5)
    { id: "order-hist-9",  userId: "usr-user-3", itemId: "prod-46", brechoId: "shop-5", total: 185 },
    { id: "order-hist-10", userId: "usr-user-1", itemId: "prod-50", brechoId: "shop-5", total: 210 },
  ];

  for (const o of historicalOrders) {
    // Mark item as COMPLETED
    await prisma.item.update({ where: { id: o.itemId }, data: { status: "COMPLETED" } });

    // Create completed order
    await prisma.order.create({
      data: { id: o.id, userId: o.userId, itemId: o.itemId, status: "COMPLETED", total: o.total },
    });

    // User wallet: was debited (locked then released)
    const userWallet = await prisma.coinWallet.findFirst({ where: { userId: o.userId } });
    const brechoWallet = await prisma.coinWallet.findFirst({ where: { brechoId: o.brechoId } });

    if (userWallet) {
      // RESERVE transaction (deducted from user)
      await prisma.coinTransaction.create({
        data: { walletId: userWallet.id, type: "RESERVE", amount: o.total },
      });
      // User balance reduced
      await prisma.coinWallet.update({
        where: { id: userWallet.id },
        data: { balance: { decrement: o.total } },
      });
    }

    if (brechoWallet) {
      // RELEASE transaction (credited to brecho)
      await prisma.coinTransaction.create({
        data: { walletId: brechoWallet.id, type: "RELEASE", amount: o.total },
      });
      // Brecho balance increased
      await prisma.coinWallet.update({
        where: { id: brechoWallet.id },
        data: { balance: { increment: o.total } },
      });
    }
  }

  // 1 pending reservation per brecho (for dashboard testing)
  const pendingOrders = [
    { id: "order-pend-1", userId: "usr-user-2", itemId: "prod-3",  brechoId: "shop-1", total: 320 },
    { id: "order-pend-2", userId: "usr-user-3", itemId: "prod-8",  brechoId: "shop-2", total: 190 },
    { id: "order-pend-3", userId: "usr-user-1", itemId: "prod-6",  brechoId: "shop-3", total: 150 },
    { id: "order-pend-4", userId: "usr-user-2", itemId: "prod-33", brechoId: "shop-4", total: 120 },
    { id: "order-pend-5", userId: "usr-user-3", itemId: "prod-44", brechoId: "shop-5", total: 295 },
  ];

  for (const o of pendingOrders) {
    await prisma.item.update({ where: { id: o.itemId }, data: { status: "RESERVED" } });
    await prisma.order.create({
      data: { id: o.id, userId: o.userId, itemId: o.itemId, status: "RESERVED", total: o.total },
    });
    const userWallet = await prisma.coinWallet.findFirst({ where: { userId: o.userId } });
    if (userWallet) {
      await prisma.coinTransaction.create({
        data: { walletId: userWallet.id, type: "RESERVE", amount: o.total },
      });
      await prisma.coinWallet.update({
        where: { id: userWallet.id },
        data: { balance: { decrement: o.total }, locked: { increment: o.total } },
      });
    }
  }

  console.log(`✅ Seed concluído!`);
  console.log(`   👤 ${allUsers.length} usuários | 🏪 5 brechós | 👗 ${items.length} itens | 💰 1000 coins cada`);
  console.log(`\n📋 Logins:`);
  console.log(`   admin@breshop.com       / admin123  (ADMIN)`);
  console.log(`   carlos@acervo90s.com    / owner123  (OWNER — Acervo 90s)`);
  console.log(`   lucia@garimpossolar.com / owner123  (OWNER — Garimpo Solar)`);
  console.log(`   felix@reliquiaurbana.com/ owner123  (OWNER — Relíquia Urbana)`);
  console.log(`   ana@vintagecarioca.com  / owner123  (OWNER — Vintage Carioca)`);
  console.log(`   pedro@atelierretro.com  / owner123  (OWNER — Ateliê Retrô)`);
  console.log(`   clara@gmail.com         / user123   (USER)`);
  console.log(`   joao@gmail.com          / user123   (USER)`);
  console.log(`   maria@gmail.com         / user123   (USER)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
