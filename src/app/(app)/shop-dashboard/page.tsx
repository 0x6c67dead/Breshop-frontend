"use client";

import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import { useToast } from "@/src/shared/components/ui/Toast";
import { CheckCircle2, AlertCircle, Package, ArrowRight, DollarSign } from "lucide-react";
import Image from "next/image";

export default function ShopDashboard() {
    const { user, confirmSale } = useMarketplaceStore();
    const { showToast } = useToast();

    if (user?.role !== 'OWNER' && user?.role !== 'ADMIN') {
        return <div className="p-24 text-center">Acesso Negado.</div>;
    }

    // Mocking sales for this shop
    const myShopSales = [
        { id: "SALE-001", productId: "prod-1", buyer: "Clara Vintage", date: "Hoje, 14:30", amount: "C$ 850", status: "PENDING" },
        { id: "SALE-002", productId: "prod-3", buyer: "João Silva", date: "Ontem", amount: "C$ 320", status: "CONFIRMED" },
    ];

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Header */}
                <div className="border-b border-foreground/10 pb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">Dashboard.</h1>
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">Painel de Gestão do seu Brechó</p>
                    </div>
                    <div className="flex gap-4 bg-white p-2 rounded-full border border-foreground/5 shadow-sm">
                        <div className="px-6 py-3 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <DollarSign size={14} />
                            Saldo a Receber: C$ 1.170
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Summary Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-xl">
                            <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Performance.</h3>
                            <div className="flex flex-col gap-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Vendas do Mês</span>
                                    <span className="font-serif font-black text-3xl italic">14</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Visitas na Loja</span>
                                    <span className="font-serif font-black text-3xl italic">1.284</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] font-black uppercase text-foreground/40">Ticket Médio</span>
                                    <span className="font-serif font-black text-3xl italic text-green-600">C$ 245</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-foreground text-background rounded-[40px] p-10 shadow-2xl">
                             <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-4 text-background/60">Ação Necessária</h3>
                             <p className="font-serif text-lg leading-tight mb-8">Você tem 1 reserva aguardando confirmação de envio.</p>
                             <button className="w-full bg-white text-foreground rounded-full py-4 text-[10px] font-black uppercase tracking-widest">
                                Ver Reservas
                             </button>
                        </div>
                    </div>

                    {/* Right: Sales Table */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase">Recent Sales.</h3>
                        <div className="flex flex-col gap-4">
                            {myShopSales.map(sale => {
                                const product = MOCK_PRODUCTS.find(p => p.id === sale.productId);
                                return (
                                    <div key={sale.id} className="group bg-white rounded-[40px] p-8 flex flex-col md:flex-row justify-between items-center gap-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-md">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-24 bg-[#F4F0EB] rounded-2xl overflow-hidden relative flex-shrink-0">
                                                {product && <Image src={product.imageUrl} fill alt="sale" className="object-cover" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-[10px] font-black text-foreground/20 uppercase">{sale.id}</span>
                                                    <span className={`px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest ${sale.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                        {sale.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-serif font-black text-xl italic uppercase tracking-tighter mt-1">{product?.brand} - {product?.model}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="font-mono text-[9px] font-bold text-foreground/40 uppercase">Comprado por:</span>
                                                    <span className="font-mono text-[9px] font-black uppercase underline decoration-2">{sale.buyer}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-4">
                                            <div className="text-right">
                                                <span className="font-serif font-black text-3xl italic tracking-tighter">{sale.amount}</span>
                                                <p className="font-mono text-[9px] font-bold text-foreground/20 uppercase mt-1">{sale.date}</p>
                                            </div>
                                            {sale.status === 'PENDING' ? (
                                                <button 
                                                    onClick={() => {
                                                        confirmSale(sale.productId);
                                                        showToast("Venda confirmada! As moedas foram liberadas.");
                                                    }}
                                                    className="bg-foreground text-background px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircle2 size={14} />
                                                    Liberar Envio
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 text-green-600 font-mono text-[9px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={16} />
                                                    Concluído
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
