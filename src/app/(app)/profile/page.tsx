"use client";

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useToast } from "@/src/shared/components/ui/Toast";
import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { Settings, LogOut, Package, ArrowRight, ShieldCheck, Coins } from "lucide-react";

export default function ProfilePage() {
    const { showToast } = useToast();
    const router = useRouter();
    const { user, balance, addCoins, logout } = useMarketplaceStore();

    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const MOCK_PURCHASES = [
        { id: "ORD-0091", date: "22/04/2026", item: "Trench Coat Burberry", amount: "C$ 450", status: "DELIVERED" },
        { id: "ORD-0084", date: "10/03/2026", item: "Levis 501 90s", amount: "C$ 180", status: "DELIVERED" },
    ];

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Header */}
                <div className="border-b border-foreground/10 pb-12">
                    <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">Profile.</h1>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">Bem-vindo ao seu painel pessoal</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Left Column: ID Card */}
                    <div className="w-full lg:w-[35%] flex flex-col gap-6 sticky top-32">
                        <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-8 right-8 font-mono text-[9px] font-black uppercase border border-foreground/10 px-3 py-1 rounded-full text-foreground/30">
                                {user.role}
                            </div>
                            
                            <div className="w-32 h-32 bg-foreground rounded-[24px] mb-8 flex items-center justify-center font-serif text-background italic text-5xl shadow-xl uppercase">
                                {user.name.slice(0, 2)}
                            </div>

                            <h2 className="text-4xl font-serif font-black italic uppercase leading-tight tracking-tighter mb-2">{user.name}</h2>
                            <p className="text-xs font-mono font-bold text-foreground/40 mb-8 uppercase tracking-widest">{user.email}</p>
                            
                            <div className="w-full h-px bg-foreground/5 mb-8" />
                            
                            <div className="flex flex-col gap-6">
                                <div className="bg-[#F4F0EB]/50 rounded-[32px] p-8 border border-foreground/5 shadow-inner flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[9px] font-black uppercase text-foreground/40 tracking-widest">Saldo na Wallet</span>
                                        <span className="font-serif font-black text-3xl italic tracking-tighter">C$ {balance}</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            addCoins(500);
                                            showToast("C$ 500 adicionados com sucesso!");
                                        }}
                                        className="w-full bg-foreground text-background rounded-full py-4 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Coins size={14} />
                                        Comprar Moedas (C$ 500)
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => showToast("Edição em breve")}
                                        className="w-full bg-white border border-foreground/10 text-foreground rounded-full py-4 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings size={14} />
                                        Configurações
                                    </button>
                                    <button 
                                        onClick={() => {
                                            logout();
                                            router.push('/login');
                                        }}
                                        className="w-full border border-red-500/20 text-red-500 rounded-full py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/40 rounded-3xl p-6 border border-foreground/5 flex items-center gap-4">
                             <ShieldCheck size={20} className="text-foreground/40" />
                             <span className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40">Sua conta está protegida pela arquitetura Breshop.</span>
                        </div>
                    </div>

                    {/* Right Column: Archive & Sections */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-16">
                        
                        {/* Archive Section */}
                        <section>
                            <div className="flex justify-between items-end mb-8">
                                <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase">Order Archive.</h3>
                                <span className="font-mono text-[10px] font-black text-foreground/40 uppercase tracking-widest">({MOCK_PURCHASES.length} Pedidos)</span>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                {MOCK_PURCHASES.map(order => (
                                    <div key={order.id} className="group bg-white rounded-[32px] p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border border-foreground/5 hover:border-foreground/20 transition-all shadow-md hover:shadow-xl cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-[#F4F0EB] rounded-2xl flex items-center justify-center text-foreground/20 group-hover:bg-foreground group-hover:text-background transition-all">
                                                <Package size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-[10px] font-black text-foreground/30 uppercase">{order.id}</span>
                                                    <span className="px-3 py-1 bg-foreground/5 text-foreground/40 rounded-full font-mono text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                                </div>
                                                <h4 className="font-serif font-black text-xl italic uppercase tracking-tighter mt-1">{order.item}</h4>
                                                <span className="font-mono text-[9px] font-black text-foreground/20 uppercase tracking-widest mt-1">{order.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-serif font-black text-3xl italic tracking-tighter">{order.amount}</span>
                                            <div className="flex items-center gap-2 text-foreground/20 mt-1">
                                                <span className="font-mono text-[9px] font-black uppercase tracking-widest">Ver Detalhes</span>
                                                <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Navigation Grid */}
                        <section>
                            <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase mb-8">Management.</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Endereços", desc: "Gestão de locais de entrega" },
                                    { title: "Pagamentos", desc: "Cartões e métodos salvos" },
                                    { title: "Segurança", desc: "Senha e autenticação" },
                                    { title: "Notificações", desc: "Alertas de garimpo" }
                                ].map((item) => (
                                    <Link key={item.title} href="#" className="group bg-white rounded-[32px] p-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-md flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="font-serif font-black text-xl italic uppercase tracking-tighter">{item.title}</span>
                                            <span className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{item.desc}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                                            <ArrowRight size={16} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
