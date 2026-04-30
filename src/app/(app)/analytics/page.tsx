"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { TrendingUp, DollarSign, ShoppingBag, Eye } from "lucide-react";

interface OrderStats {
  total: number;
  completed: number;
  pending: number;
  revenue: number;
}

interface ProductStats {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
}

export default function AnalyticsPage() {
  const { user } = useMarketplaceStore();
  const [stats, setStats] = useState<OrderStats>({ total: 0, completed: 0, pending: 0, revenue: 0 });
  const [products, setProducts] = useState<ProductStats>({ totalProducts: 0, availableProducts: 0, soldProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.brechoId) {
      fetchStats();
    }
  }, [user?.brechoId]);

  const fetchStats = async () => {
    try {
      const ordersRes = await fetch(`/api/orders/brecho/${user?.brechoId}?all=true`);
      const orders = await ordersRes.json();

      const completed = orders.filter((o: any) => o.status === "COMPLETED").length;
      const pending = orders.filter((o: any) => o.status === "RESERVED").length;
      const revenue = orders
        .filter((o: any) => o.status === "COMPLETED")
        .reduce((sum: number, o: any) => sum + o.total, 0);

      setStats({
        total: orders.length,
        completed,
        pending,
        revenue,
      });

      const itemsRes = await fetch(`/api/items?brechoId=${user?.brechoId}&all=true`);
      const items = await itemsRes.json();
      const available = items.filter((i: any) => i.status === "AVAILABLE").length;
      const sold = items.filter((i: any) => i.status === "COMPLETED" || i.status === "SOLD_PENDING_DELIVERY").length;

      setProducts({
        totalProducts: items.length,
        availableProducts: available,
        soldProducts: sold,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "BRECHO_OWNER" && user?.role !== "ADMIN") {
    return <div className="p-24 text-center font-mono font-black uppercase">Acesso Negado.</div>;
  }

  const conversionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : "0";
  const avgTicket = stats.completed > 0 ? (stats.revenue / stats.completed).toFixed(0) : "0";

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="border-b border-foreground/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">
              Analytics.
            </h1>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">
              Métricas do seu negócio
            </p>
          </div>
          <Link
            href="/shop-dashboard"
            className="px-6 py-3 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
          >
            ← Voltar aos Pedidos
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[40px] p-8 border border-foreground/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-black uppercase text-foreground/40">Total de Pedidos</h3>
              <ShoppingBag size={20} className="text-foreground/40" />
            </div>
            <p className="font-serif font-black text-4xl italic">{stats.total}</p>
            <p className="font-mono text-[9px] text-foreground/50 mt-2">{stats.pending} pendentes</p>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-foreground/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-black uppercase text-foreground/40">Concluídos</h3>
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <p className="font-serif font-black text-4xl italic text-green-600">{stats.completed}</p>
            <p className="font-mono text-[9px] text-foreground/50 mt-2">{conversionRate}% conversão</p>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-foreground/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-black uppercase text-foreground/40">Receita (Coins)</h3>
              <DollarSign size={20} className="text-foreground/40" />
            </div>
            <p className="font-serif font-black text-4xl italic">C$ {stats.revenue}</p>
            <p className="font-mono text-[9px] text-foreground/50 mt-2">Média: C$ {avgTicket}</p>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-foreground/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-black uppercase text-foreground/40">Produtos</h3>
              <Eye size={20} className="text-foreground/40" />
            </div>
            <p className="font-serif font-black text-4xl italic">{products.totalProducts}</p>
            <p className="font-mono text-[9px] text-foreground/50 mt-2">{products.availableProducts} disponíveis</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Orders Distribution */}
          <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-xl">
            <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Distribuição de Pedidos</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Concluídos</span>
                  <span className="font-mono text-[10px] font-black">{stats.completed}</span>
                </div>
                <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Pendentes</span>
                  <span className="font-mono text-[10px] font-black">{stats.pending}</span>
                </div>
                <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-xl">
            <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Status dos Produtos</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Disponíveis</span>
                  <span className="font-mono text-[10px] font-black">{products.availableProducts}</span>
                </div>
                <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all"
                    style={{ width: `${products.totalProducts > 0 ? (products.availableProducts / products.totalProducts) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Vendidos</span>
                  <span className="font-mono text-[10px] font-black">{products.soldProducts}</span>
                </div>
                <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all"
                    style={{ width: `${products.totalProducts > 0 ? (products.soldProducts / products.totalProducts) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-foreground to-foreground/70 text-background rounded-[40px] p-10 shadow-2xl">
          <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-4">Receita Total</h3>
          <p className="font-serif font-black text-6xl italic">C$ {stats.revenue}</p>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest mt-4 text-background/70">
            De {stats.completed} pedidos completos • Média por pedido: C$ {avgTicket}
          </p>
        </div>
      </div>
    </main>
  );
}
