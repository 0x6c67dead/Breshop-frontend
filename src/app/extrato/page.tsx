"use client";

import { useMarketplaceStore, DbOrder } from "@/src/shared/lib/store/marketplaceStore";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  RESERVED: "Aguardando",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  RESERVED: "text-orange-500",
  APPROVED: "text-blue-500",
  REJECTED: "text-red-500",
  COMPLETED: "text-green-600",
  CANCELLED: "text-gray-400",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  RESERVED: <Clock size={14} />,
  APPROVED: <CheckCircle2 size={14} />,
  REJECTED: <XCircle size={14} />,
  COMPLETED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function ExtratoPage() {
  const { user, brechoOrders, fetchBrechoOrders } = useMarketplaceStore();
  const [loading, setLoading] = useState(true);
  const [brechoBalance, setBrechoBalance] = useState({ balance: 0, totalEarned: 0 });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    if (!user?.brechoId) return;
    Promise.all([
      fetchBrechoOrders(),
      fetch(`/api/wallet/balance?brechoId=${user.brechoId}`)
        .then((r) => r.json())
        .then((d) => setBrechoBalance({ balance: d.balance ?? 0, totalEarned: d.totalEarned ?? 0 }))
        .catch(() => null),
    ]).finally(() => setLoading(false));
  }, [fetchBrechoOrders, user?.brechoId]);

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > brechoBalance.balance) return;
    setWithdrawLoading(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brechoId: user?.brechoId, amount }),
      });
      if (res.ok) {
        setBrechoBalance((p) => ({ ...p, balance: p.balance - amount }));
        setWithdrawAmount("");
      }
    } finally {
      setWithdrawLoading(false);
    }
  };

  const completedOrders = brechoOrders.filter((o) => o.status === "COMPLETED");
  const pendingOrders = brechoOrders.filter((o) => o.status === "RESERVED" || o.status === "APPROVED");

  if (!user || (user.role !== "BRECHO_OWNER" && user.role !== "ADMIN")) {
    return <div className="p-24 text-center font-mono font-black uppercase">Acesso Negado.</div>;
  }

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        <div className="border-b border-foreground/10 pb-12">
          <Link href="/shop-dashboard" className="group flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50 hover:text-foreground transition-all mb-6">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">Extrato.</h1>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">
            Histórico completo de vendas · {user.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-foreground/5 shadow-xl flex flex-col gap-2">
            <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Total Ganho</span>
            <span className="font-serif font-black text-4xl italic text-green-600">C$ {brechoBalance.totalEarned}</span>
            <span className="font-mono text-[9px] text-foreground/30 uppercase">Pedidos concluídos</span>
          </div>
          <div className="bg-white rounded-[32px] p-8 border border-foreground/5 shadow-xl flex flex-col gap-2">
            <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Saldo Disponível</span>
            <span className="font-serif font-black text-4xl italic">C$ {brechoBalance.balance}</span>
            <span className="font-mono text-[9px] text-foreground/30 uppercase">Pronto para sacar</span>
          </div>
          <div className="bg-white rounded-[32px] p-8 border border-foreground/5 shadow-xl flex flex-col gap-2">
            <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Em Andamento</span>
            <span className="font-serif font-black text-4xl italic text-orange-500">{pendingOrders.length}</span>
            <span className="font-mono text-[9px] text-foreground/30 uppercase">Reservas ativas</span>
          </div>
        </div>

        {/* Withdraw */}
        <div className="bg-foreground text-background rounded-[40px] p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-3xl italic uppercase tracking-tighter">Sacar Coins</h3>
            <p className="font-mono text-[10px] text-background/50 uppercase tracking-widest mt-1">
              Saldo disponível: C$ {brechoBalance.balance}
            </p>
          </div>
          <div className="flex gap-3 items-center w-full md:w-auto">
            <input
              type="number"
              min="1"
              max={brechoBalance.balance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Valor"
              className="bg-background/10 border border-background/20 rounded-full px-6 py-3 font-mono text-sm text-background placeholder-background/30 focus:outline-none focus:border-background/50 w-32"
            />
            <button
              onClick={handleWithdraw}
              disabled={withdrawLoading || !withdrawAmount || parseInt(withdrawAmount) > brechoBalance.balance}
              className="bg-white text-foreground px-8 py-3 rounded-full font-mono text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {withdrawLoading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              Sacar
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase">Histórico de Vendas.</h3>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-foreground/30" />
            </div>
          ) : brechoOrders.length === 0 ? (
            <div className="bg-white rounded-[40px] p-16 text-center border border-foreground/5">
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/30">Nenhuma venda ainda</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] overflow-hidden border border-foreground/5 shadow-xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/5">
                    <th className="text-left p-6 font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30">Peça</th>
                    <th className="text-left p-6 font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30 hidden md:table-cell">Comprador</th>
                    <th className="text-left p-6 font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30 hidden lg:table-cell">Data</th>
                    <th className="text-right p-6 font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30">Valor</th>
                    <th className="text-right p-6 font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {brechoOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function OrderRow({ order }: { order: DbOrder }) {
  const mock = MOCK_PRODUCTS.find((p) => p.id === order.itemId);
  const statusColor = STATUS_COLOR[order.status] ?? "text-gray-400";
  const icon = STATUS_ICON[order.status];
  const date = new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <tr className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-14 bg-[#F4F0EB] rounded-xl overflow-hidden relative flex-shrink-0">
            {mock && <Image src={mock.imageUrl} fill sizes="48px" alt={mock.brand} className="object-cover" />}
          </div>
          <div>
            <p className="font-serif font-black italic text-sm">{mock ? `${mock.brand}` : order.itemId.slice(0, 10)}</p>
            <p className="font-mono text-[9px] text-foreground/40 uppercase">{mock?.model ?? ""}</p>
          </div>
        </div>
      </td>
      <td className="p-6 hidden md:table-cell">
        <span className="font-mono text-[10px] font-black text-foreground/60">
          {order.user?.name ?? "—"}
        </span>
      </td>
      <td className="p-6 hidden lg:table-cell">
        <span className="font-mono text-[10px] text-foreground/40">{date}</span>
      </td>
      <td className="p-6 text-right">
        <span className="font-serif font-black italic text-lg">C$ {order.total}</span>
      </td>
      <td className="p-6 text-right">
        <span className={`flex items-center justify-end gap-1 font-mono text-[9px] font-black uppercase ${statusColor}`}>
          {icon}
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </td>
    </tr>
  );
}
