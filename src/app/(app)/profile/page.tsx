"use client";

import Link from 'next/link';
import { useToast } from "@/src/shared/components/ui/Toast";

export default function ProfilePage() {
    const { showToast } = useToast();
    const MOCK_USER = {
        name: "Clara Vintage",
        email: "clara.garimpo@exemplo.com",
        memberSince: "OCT 2025"
    };

    const MOCK_PURCHASES = [
        { id: "ORD-0091", date: "22/04/2026", item: "Trench Coat Burberry", amount: "R$ 450,00", status: "DELIVERED" },
        { id: "ORD-0084", date: "10/03/2026", item: "Levis 501 90s", amount: "R$ 180,00", status: "DELIVERED" },
    ];

    return (
        <main className="w-full min-h-screen px-4 md:px-6 py-8 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12">
                
                {/* Left Column: ID Card (Passport style) */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="border-[2px] border-foreground p-6 bg-tactile-light relative hard-shadow">
                        <div className="absolute top-2 right-2 text-xs font-mono font-bold border-[1.5px] border-foreground px-2">ID</div>
                        
                        <div className="w-24 h-24 bg-foreground/20 border-[1.5px] border-foreground rounded-none mb-6 mt-4 flex items-center justify-center font-serif text-3xl italic">
                            CV
                        </div>

                        <h1 className="text-2xl font-black uppercase leading-tight mb-1">{MOCK_USER.name}</h1>
                        <p className="text-sm font-mono text-foreground/80 mb-6">{MOCK_USER.email}</p>
                        
                        <div className="w-full h-[1.5px] bg-foreground/20 mb-4" />
                        
                        <p className="text-xs uppercase font-bold tracking-widest text-foreground/60">Member Since</p>
                        <p className="text-lg font-serif italic font-black">{MOCK_USER.memberSince}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => showToast("Edição de perfil em breve!")}
                            className="tag-pill w-full bg-tactile-bg border-[1.5px] border-foreground py-3 font-bold hover:bg-foreground hover:text-tactile-light transition-colors text-sm uppercase"
                        >
                            Editar Perfil
                        </button>
                        <button 
                            onClick={() => showToast("Logout em breve!")}
                            className="tag-pill w-full bg-transparent border-[1.5px] border-red-500 text-red-500 py-3 font-bold hover:bg-red-500 hover:text-tactile-light transition-colors text-sm uppercase"
                        >
                            Sair da Conta
                        </button>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="w-full md:w-2/3 flex flex-col gap-10">
                    
                    <section>
                        <h2 className="text-3xl font-serif font-black italic tracking-tighter mb-6">Archive.</h2>
                        <div className="flex flex-col gap-4">
                            {MOCK_PURCHASES.map(order => (
                                <div key={order.id} className="w-full border-[1.5px] border-foreground p-4 bg-tactile-bg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-tactile-light transition-colors cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-sm font-bold bg-foreground text-tactile-light px-2 py-0.5 w-max">{order.id}</span>
                                        <span className="font-bold uppercase text-sm mt-1">{order.item}</span>
                                        <span className="text-xs font-mono text-foreground/60">{order.date}</span>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-1">
                                        <span className="font-serif font-black text-lg italic">{order.amount}</span>
                                        <span className="text-xs uppercase tracking-wider font-bold bg-accent-lime text-[#16261A] px-2 py-0.5">{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-3xl font-serif font-black italic tracking-tighter mb-6">Configurações</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="#" className="border-[1.5px] border-foreground p-5 font-bold uppercase text-sm flex justify-between hover:hard-shadow transition-all bg-tactile-light">
                                Endereços
                                <span>&rarr;</span>
                            </Link>
                            <Link href="#" className="border-[1.5px] border-foreground p-5 font-bold uppercase text-sm flex justify-between hover:hard-shadow transition-all bg-tactile-light">
                                Pagamentos
                                <span>&rarr;</span>
                            </Link>
                            <Link href="#" className="border-[1.5px] border-foreground p-5 font-bold uppercase text-sm flex justify-between hover:hard-shadow transition-all bg-tactile-light">
                                Notificações
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
