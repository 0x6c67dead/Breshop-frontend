"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useToast } from "@/src/shared/components/ui/Toast";
import { ArrowLeft, Trash2, ShieldCheck, ShoppingBag, Loader2 } from "lucide-react";
import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const { favorites, toggleFavorite, items: dbItems, reserveItem, user, balance } = useMarketplaceStore();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Cart = favorited products that are AVAILABLE
    const cartProducts = MOCK_PRODUCTS.filter((p) => {
        if (!favorites.includes(p.id)) return false;
        const db = dbItems.find((i) => i.id === p.id);
        return db ? db.status === "AVAILABLE" : p.status === "AVAILABLE";
    });

    const subtotal = cartProducts.reduce((acc, p) => {
        const db = dbItems.find((i) => i.id === p.id);
        return acc + (db?.price ?? p.price);
    }, 0);

    const handleRemove = (productId: string) => {
        setRemovingId(productId);
        toggleFavorite(productId);
        showToast("Item removido do carrinho");
        setRemovingId(null);
    };

    const handleCheckout = async () => {
        if (!user) {
            showToast("Faça login para finalizar a reserva");
            router.push("/login");
            return;
        }
        if (balance < subtotal) {
            showToast(`Saldo insuficiente. Você tem C$ ${balance}, precisa de C$ ${subtotal}`);
            return;
        }
        if (cartProducts.length === 0) {
            showToast("Seu carrinho está vazio");
            return;
        }

        setCheckoutLoading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const product of cartProducts) {
            try {
                await reserveItem(product.id);
                toggleFavorite(product.id); // remove from cart after reserving
                successCount++;
            } catch (err) {
                errorCount++;
                showToast(err instanceof Error ? err.message : `Erro ao reservar ${product.brand}`);
            }
        }

        setCheckoutLoading(false);

        if (successCount > 0) {
            showToast(`${successCount} peça${successCount > 1 ? "s" : ""} reservada${successCount > 1 ? "s" : ""}! Aguardando aprovação dos brechós.`);
            router.push("/minhas-reservas");
        }
    };

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">

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
                        <span className="font-serif font-black text-xl italic">{cartProducts.length}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Items */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-6">
                        {cartProducts.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-16 flex flex-col items-center gap-6 border border-foreground/5 shadow-lg text-center">
                                <ShoppingBag size={48} className="text-foreground/20" />
                                <p className="font-serif font-black italic text-foreground/40 text-2xl">Seu carrinho está vazio.</p>
                                <p className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest">Adicione peças aos favoritos para reservar aqui</p>
                                <Link href="/" className="bg-foreground text-background px-8 py-4 rounded-full font-mono text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all">
                                    Explorar Peças
                                </Link>
                            </div>
                        ) : (
                            cartProducts.map((item) => {
                                const db = dbItems.find((i) => i.id === item.id);
                                const price = db?.price ?? item.price;
                                return (
                                    <div key={item.id} className="group bg-white rounded-[40px] p-6 md:p-8 flex gap-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-lg relative overflow-hidden">
                                        <div className="w-32 h-40 md:w-40 md:h-52 bg-[#F4F0EB] rounded-[30px] overflow-hidden relative flex-shrink-0">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.model}
                                                fill
                                                sizes="(max-width:768px) 128px, 160px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between py-2 flex-1">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">{item.brand}</span>
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        disabled={removingId === item.id}
                                                        className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-foreground/20 disabled:opacity-40"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <h3 className="font-serif font-black text-2xl md:text-3xl italic uppercase tracking-tighter leading-tight pr-12">{item.model}</h3>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="px-3 py-1 bg-[#F4F0EB] rounded-full font-mono text-[9px] font-black uppercase tracking-widest text-foreground/60">Tam: {item.size}</span>
                                                </div>
                                            </div>
                                            <p className="font-serif font-black italic text-3xl">C$ {price}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {cartProducts.length > 0 && (
                            <div className="bg-foreground/5 rounded-[40px] p-8 flex items-center justify-center border-2 border-dashed border-foreground/10 mt-4">
                                <p className="font-serif font-black italic text-foreground/30 text-xl">Continue garimpando para encontrar mais tesouros.</p>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-[40%] sticky top-32">
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-foreground/5 flex flex-col gap-10">
                            <div className="flex flex-col gap-2 text-center border-b border-foreground/10 pb-8">
                                <h2 className="text-3xl font-serif font-black italic tracking-tighter uppercase">Order Summary.</h2>
                                <p className="font-mono text-[10px] font-bold text-foreground/40 tracking-widest uppercase">Pagamento em Moedas Breshop</p>
                            </div>

                            <div className="flex flex-col gap-6 font-mono text-[11px] font-black uppercase tracking-[0.2em]">
                                <div className="flex justify-between items-center">
                                    <span className="text-foreground/40">Subtotal</span>
                                    <span className="text-lg font-serif italic">C$ {subtotal}</span>
                                </div>
                                {user && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-foreground/40">Seu saldo</span>
                                        <span className={`text-lg font-serif italic ${balance < subtotal ? 'text-red-500' : 'text-green-600'}`}>
                                            C$ {balance}
                                        </span>
                                    </div>
                                )}
                                <div className="w-full h-px bg-foreground/10 my-2" />
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-foreground text-sm">Total</span>
                                    <span className="font-serif font-black italic text-5xl tracking-tighter">C$ {subtotal}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading || cartProducts.length === 0}
                                    className="w-full bg-foreground text-background rounded-full py-6 text-xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {checkoutLoading ? (
                                        <><Loader2 size={24} className="animate-spin" /> Reservando...</>
                                    ) : (
                                        <><ShoppingBag size={24} /> Finalizar Reserva</>
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-2 text-foreground/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} />
                                    Proteção ao Comprador Breshop
                                </div>
                            </div>
                        </div>

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
