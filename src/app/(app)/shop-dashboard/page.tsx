"use client";

import { useMarketplaceStore, DbOrder } from "@/src/shared/lib/store/marketplaceStore";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import { useToast } from "@/src/shared/components/ui/Toast";
import { CheckCircle2, XCircle, Loader2, DollarSign, TrendingUp, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_LABEL: Record<string, string> = {
  RESERVED: "Aguardando aprovação",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const STATUS_COLOR: Record<string, string> = {
  RESERVED: "bg-orange-100 text-orange-600",
  APPROVED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function ShopDashboard() {
  const { user, brechoOrders, fetchBrechoOrders, approveOrder, rejectOrder, confirmDelivery } = useMarketplaceStore();
  const { showToast } = useToast();
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchBrechoOrders().finally(() => setLoadingOrders(false));
  }, [fetchBrechoOrders]);

  if (user?.role !== 'BRECHO_OWNER' && user?.role !== 'ADMIN') {
    return <div className="p-24 text-center font-mono font-black uppercase">Acesso Negado.</div>;
  }

  const doAction = async (orderId: string, fn: () => Promise<void>, msg: string) => {
    setActionLoading((p) => ({ ...p, [orderId]: true }));
    try {
      await fn();
      showToast(msg);
    } catch {
      showToast("Erro ao processar ação");
    } finally {
      setActionLoading((p) => ({ ...p, [orderId]: false }));
    }
  };

  const pendingCount = brechoOrders.filter((o) => o.status === "RESERVED").length;
  const totalEarned = brechoOrders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.total, 0);
  const totalCoins = brechoOrders
    .filter((o) => o.status === "RESERVED" || o.status === "APPROVED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        <div className="border-b border-foreground/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">Dashboard.</h1>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">
              {user?.name} · Painel de Gestão
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-white p-2 rounded-full border border-foreground/5 shadow-sm">
              <div className="px-5 py-2 rounded-full bg-green-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={12} /> Total Ganho: C$ {totalEarned}
              </div>
            </div>
            <div className="flex gap-2 bg-white p-2 rounded-full border border-foreground/5 shadow-sm">
              <div className="px-5 py-2 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={12} /> Em reserva: C$ {totalCoins}
              </div>
            </div>
            <Link href="/extrato" className="flex gap-2 bg-white p-2 rounded-full border border-foreground/5 shadow-sm">
              <div className="px-5 py-2 rounded-full border border-foreground/20 text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-foreground hover:text-background transition-all">
                <ExternalLink size={12} /> Ver Extrato
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-xl">
              <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Performance.</h3>
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Pedidos Totais</span>
                  <span className="font-serif font-black text-3xl italic">{brechoOrders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Aguardando</span>
                  <span className="font-serif font-black text-3xl italic text-orange-500">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Concluídas</span>
                  <span className="font-serif font-black text-3xl italic text-green-600">
                    {brechoOrders.filter((o) => o.status === "COMPLETED").length}
                  </span>
                </div>
              </div>
            </div>

            {pendingCount > 0 && (
              <div className="bg-foreground text-background rounded-[40px] p-10 shadow-2xl">
                <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-4 text-background/60">Ação Necessária</h3>
                <p className="font-serif text-lg leading-tight">
                  Você tem <strong>{pendingCount}</strong> reserva{pendingCount > 1 ? "s" : ""} aguardando aprovação.
                </p>
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase">Pedidos.</h3>

            {loadingOrders ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-foreground/30" />
              </div>
            ) : brechoOrders.length === 0 ? (
              <div className="bg-white rounded-[40px] p-16 text-center border border-foreground/5">
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/30">
                  Nenhum pedido ainda
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {brechoOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    loading={!!actionLoading[order.id]}
                    onApprove={() => doAction(order.id, () => approveOrder(order.id), "Reserva aprovada!")}
                    onReject={(reason, action) => doAction(order.id, () => rejectOrder(order.id, reason, action), "Reserva rejeitada.")}
                    onConfirm={() => doAction(order.id, () => confirmDelivery(order.id), "Entrega confirmada! Coins liberados.")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderRow({
  order, loading, onApprove, onReject, onConfirm
}: {
  order: DbOrder;
  loading: boolean;
  onApprove: () => void;
  onReject: (reason: string, action: string) => void;
  onConfirm: () => void;
}) {
  const mock = MOCK_PRODUCTS.find((p) => p.id === order.itemId);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const statusColor = STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="group bg-white rounded-[40px] p-8 flex flex-col md:flex-row justify-between items-center gap-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-md">
      <div className="flex items-center gap-6">
        <div className="w-20 h-24 bg-[#F4F0EB] rounded-2xl overflow-hidden relative flex-shrink-0">
          {mock && <Image src={mock.imageUrl} fill sizes="80px" alt="item" className="object-cover" />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-black text-foreground/20 uppercase">#{order.id.slice(0, 8)}</span>
            <span className={`px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>
          <h4 className="font-serif font-black text-xl italic uppercase tracking-tighter mt-1">
            {mock ? `${mock.brand} — ${mock.model}` : (order.item?.title ?? order.itemId)}
          </h4>
          {order.user && (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[9px] font-bold text-foreground/40 uppercase">Comprador:</span>
              <span className="font-mono text-[9px] font-black uppercase">{order.user.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <span className="font-serif font-black text-3xl italic">C$ {order.total}</span>

        {loading ? (
          <Loader2 size={20} className="animate-spin text-foreground/40" />
        ) : order.status === "RESERVED" ? (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="bg-foreground text-background px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> Aprovar
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="border-2 border-foreground text-foreground px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <XCircle size={14} /> Rejeitar
            </button>
          </div>
        ) : order.status === "APPROVED" ? (
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={14} /> Confirmar Entrega
          </button>
        ) : null}
      </div>

      {showRejectModal && (
        <RejectModal
          onConfirm={(reason, action) => { setShowRejectModal(false); onReject(reason, action); }}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
}

function RejectModal({ onConfirm, onCancel }: { onConfirm: (reason: string, action: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState("ITEM_ALREADY_SOLD");
  const [action, setAction] = useState("RETURN_TO_STORE");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full flex flex-col gap-6">
        <h3 className="font-serif font-black text-2xl italic uppercase">Rejeitar Reserva</h3>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50">Motivo</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-foreground/20 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none">
            <option value="ITEM_ALREADY_SOLD">Peça já vendida</option>
            <option value="ITEM_NOT_FOUND">Peça não encontrada</option>
            <option value="STOCK_ERROR">Erro de estoque</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50">Ação para a peça</label>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full border border-foreground/20 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none">
            <option value="RETURN_TO_STORE">Voltar para a vitrine</option>
            <option value="MARK_AS_SOLD_OUTSIDE_APP">Vendida fora do app</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onConfirm(reason, action)} className="flex-1 bg-foreground text-background py-4 rounded-full font-mono text-xs font-black uppercase tracking-widest hover:opacity-80">
            Confirmar Rejeição
          </button>
          <button onClick={onCancel} className="px-6 border-2 border-foreground rounded-full font-mono text-xs font-black uppercase hover:bg-foreground/5">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
