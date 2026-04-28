"use client";

import { useMarketplaceStore, DbOrder } from "@/src/shared/lib/store/marketplaceStore";
import { useCountdown } from "@/src/shared/lib/hooks/useCountdown";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  RESERVED: "Aguardando Brechó",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  AWAITING_DELIVERY: "Aguardando Entrega",
  DELIVERED_PENDING_CONFIRMATION: "Confirmar Entrega",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const STATUS_COLOR: Record<string, string> = {
  RESERVED: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function MinhasReservasPage() {
  const { user, orders, fetchMyOrders, cancelOrder } = useMarketplaceStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().finally(() => setLoading(false));
  }, [fetchMyOrders]);

  if (!user) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center p-8">
        <p className="text-xl font-bold uppercase text-foreground/40">Faça login para ver suas reservas</p>
        <Link href="/login" className="mt-4 font-black uppercase underline text-sm">Fazer login</Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-12 border-b-2 border-foreground pb-6">
        <h1 className="text-4xl md:text-6xl font-serif font-black italic uppercase tracking-tighter">
          Minhas Reservas
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-foreground/50 mt-2">
          Acompanhe suas peças selecionadas
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-foreground/30" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-xl font-bold uppercase text-foreground/30">Nenhuma reserva ativa</p>
          <Link href="/" className="mt-4 text-sm font-black uppercase underline hover:text-accent-lime transition-colors">
            Voltar para a vitrine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
          ))}
        </div>
      )}
    </main>
  );
}

function OrderCard({ order, onCancel }: { order: DbOrder; onCancel: (id: string) => Promise<void> }) {
  const mock = MOCK_PRODUCTS.find((p) => p.id === order.itemId);
  const [cancelling, setCancelling] = useState(false);

  // Orders don't have expiresAt in DB, so we use a 48h window from creation
  const expiresAt = new Date(new Date(order.createdAt).getTime() + 48 * 60 * 60 * 1000).toISOString();
  const timeLeft = useCountdown(expiresAt);

  const canCancel = order.status === "RESERVED";
  const statusColor = STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600 border-gray-300";

  const handleCancel = async () => {
    setCancelling(true);
    try { await onCancel(order.id); } finally { setCancelling(false); }
  };

  return (
    <div className="border-2 border-foreground p-4 flex flex-col gap-4 bg-background">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 bg-foreground/5 border border-foreground overflow-hidden flex-shrink-0">
          {mock ? (
            <Image src={mock.imageUrl} alt={mock.model} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full bg-foreground/10" />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-sm leading-tight">
              {mock ? mock.brand : (order.item?.title ?? order.itemId)}
            </h3>
            <p className="text-xs text-foreground/70">{mock?.model ?? order.item?.brecho?.name}</p>
          </div>
          <p className="font-serif font-black italic">C$ {order.total}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-foreground/10 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Status</span>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 border rounded ${statusColor}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
        {canCancel && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Expira em</span>
            <span className="font-mono text-xs font-bold text-red-600 animate-pulse">{timeLeft}</span>
          </div>
        )}
        {order.rejectionReason && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Motivo</span>
            <span className="font-mono text-[10px] text-red-600">{order.rejectionReason}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        {canCancel ? (
          <>
            <button
              disabled
              className="flex-1 bg-foreground text-background font-black uppercase text-xs py-3 opacity-50 cursor-not-allowed"
            >
              Aguardando Brechó
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 border-2 border-foreground text-foreground font-black uppercase text-xs hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              {cancelling ? <Loader2 size={14} className="animate-spin" /> : "Cancelar"}
            </button>
          </>
        ) : (
          <div className={`w-full text-center py-2 px-4 border rounded text-[10px] font-black uppercase ${statusColor}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </div>
        )}
      </div>
    </div>
  );
}
