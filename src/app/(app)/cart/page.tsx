"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useToast } from "@/src/shared/components/ui/Toast";
import { ArrowLeft, Trash2, ShieldCheck, CreditCard } from "lucide-react";

export default function CartPage() {
    const { showToast } = useToast();
    const MOCK_CART = [
        { id: "prod-1", name: "Jaqueta de Couro Vintage", size: "M", price: 350, brand: "PRADA", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop" },
        { id: "prod-4", name: "Óculos de Sol Retro", size: "ÚNICO", price: 120, brand: "GUCCI", imageUrl: "https://images.unsplash.com/photo-1511499767390-90342f16b147?q=80&w=1000&auto=format&fit=crop" },
    ];

    const subtotal = MOCK_CART.reduce((acc, item) => acc + item.price, 0);
    const shipping = 25.00;
    const total = subtotal + shipping;

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col">
                        <Link href="/" className="group flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50 hover:text-foreground transition-all mb-4">
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            Continuar Garimpando
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-serif font-black italic tracking-tighter uppercase leading-none">Your Bag.</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-foreground/5 shadow-sm">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">Total de Itens:</span>
                        <span className="font-serif font-black text-xl italic">{MOCK_CART.length}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Left side: Items List */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-6">
                        {MOCK_CART.map((item) => (
                            <div key={item.id} className="group bg-white rounded-[40px] p-6 md:p-8 flex gap-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-lg relative overflow-hidden">
                                <div className="w-32 h-40 md:w-40 md:h-52 bg-[#F4F0EB] rounded-[30px] overflow-hidden relative flex-shrink-0">
                                    <Image 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                
                                <div className="flex flex-col justify-between py-2 flex-1">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">{item.brand}</span>
                                            <button 
                                                onClick={() => showToast("Item removido")}
                                                className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center hover:bg-red-50 hover:text-white hover:border-red-50 transition-all text-foreground/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="font-serif font-black text-2xl md:text-3xl italic uppercase tracking-tighter leading-tight pr-12">{item.name}</h3>
                                        <div className="flex gap-4 mt-2">
                                            <span className="px-3 py-1 bg-[#F4F0EB] rounded-full font-mono text-[9px] font-black uppercase tracking-widest text-foreground/60">Tamanho: {item.size}</span>
                                            <span className="px-3 py-1 bg-[#F4F0EB] rounded-full font-mono text-[9px] font-black uppercase tracking-widest text-foreground/60">ID: {item.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="font-serif font-black italic text-3xl">C$ {item.price.toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-foreground/5 rounded-[40px] p-8 flex items-center justify-center border-2 border-dashed border-foreground/10 mt-4">
                            <p className="font-serif font-black italic text-foreground/30 text-xl">Continue garimpando para encontrar mais tesouros.</p>
                        </div>
                    </div>

                    {/* Right side: Summary Card */}
                    <div className="w-full lg:w-[40%] sticky top-32">
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-foreground/5 flex flex-col gap-10">
                            <div className="flex flex-col gap-2 text-center border-b border-foreground/10 pb-8">
                                <h2 className="text-3xl font-serif font-black italic tracking-tighter uppercase">Order Summary.</h2>
                                <p className="font-mono text-[10px] font-bold text-foreground/40 tracking-widest uppercase">Pagamento Seguro & Criptografado</p>
                            </div>

                            <div className="flex flex-col gap-6 font-mono text-[11px] font-black uppercase tracking-[0.2em]">
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/40">Subtotal</span>
                                    <span className="text-lg font-serif italic text-foreground">C$ {subtotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/40">Taxa de Serviço</span>
                                    <span className="text-lg font-serif italic text-foreground">C$ {shipping.toFixed(0)}</span>
                                </div>
                                
                                <div className="w-full h-px bg-foreground/10 my-2" />
                                
                                <div className="flex flex-col gap-4">
                                    <label className="text-[9px] text-foreground/40">Cupom de Desconto</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="CÓDIGO"
                                            className="flex-1 bg-[#F4F0EB] rounded-2xl px-6 py-4 text-xs focus:outline-none border border-transparent focus:border-foreground/10 transition-all font-bold"
                                        />
                                        <button className="bg-foreground text-background px-6 rounded-2xl text-[10px] font-black uppercase hover:opacity-80 transition-all">
                                            Aplicar
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-foreground/10 my-2" />

                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-foreground text-sm">Grand Total</span>
                                    <span className="font-serif font-black italic text-5xl tracking-tighter">C$ {total.toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={() => showToast("Finalizando reserva...")}
                                    className="w-full bg-foreground text-background rounded-full py-6 text-xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-xl"
                                >
                                    <CreditCard size={24} />
                                    Finalizar Reserva
                                </button>
                                <div className="flex items-center justify-center gap-2 text-foreground/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} />
                                    Proteção ao Comprador Breshop
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-white/40 rounded-3xl p-6 border border-foreground/5 flex flex-col gap-2">
                                <span className="font-mono text-[9px] font-black uppercase text-foreground/40">Envio</span>
                                <p className="font-serif font-black italic text-sm uppercase">Brasil Inteiro</p>
                            </div>
                            <div className="bg-white/40 rounded-3xl p-6 border border-foreground/5 flex flex-col gap-2">
                                <span className="font-mono text-[9px] font-black uppercase text-foreground/40">Devolução</span>
                                <p className="font-serif font-black italic text-sm uppercase">7 Dias Grátis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
