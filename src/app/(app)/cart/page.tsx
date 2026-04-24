"use client";

import Link from 'next/link';
import { useToast } from "@/src/shared/components/ui/Toast";

export default function CartPage() {
    const { showToast } = useToast();
    const MOCK_CART = [
        { id: "ITEM-A", name: "Jaqueta de Couro Vintage", size: "M", price: 350.00, shop: "Acervo 90s" },
        { id: "ITEM-B", name: "Óculos de Sol Retro", size: "ÚNICO", price: 120.00, shop: "Garimpo Solar" },
    ];

    const subtotal = MOCK_CART.reduce((acc, item) => acc + item.price, 0);
    const shipping = 25.00;
    const total = subtotal + shipping; // Ignoring promo code math for UI mockup

    return (
        <main className="w-full min-h-screen px-4 md:px-6 py-8 flex justify-center">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12">
                
                {/* Left side: Items */}
                <div className="w-full lg:w-3/5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-black italic tracking-tighter uppercase">Shopping Bag.</h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-foreground/50 mt-2">{MOCK_CART.length} Itens</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        {MOCK_CART.map((item) => (
                            <div key={item.id} className="flex gap-4 border-[1.5px] border-foreground p-4 bg-tactile-light relative">
                                <button 
                                    onClick={() => showToast("Remoção de item em breve!")}
                                    className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider text-red-500 hover:underline"
                                >
                                    Remover
                                </button>
                                
                                <div className="w-24 h-28 bg-foreground/10 border-[1.5px] border-foreground flex-shrink-0" />
                                
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold uppercase leading-tight text-sm md:text-base pr-16">{item.name}</h3>
                                        <p className="text-xs font-mono font-semibold opacity-60 mt-1">Vendido por: {item.shop}</p>
                                        <span className="inline-block mt-2 font-bold text-xs uppercase border-[1.5px] border-foreground px-2 py-0.5">Tam: {item.size}</span>
                                    </div>
                                    <p className="font-serif font-black italic text-xl">R$ {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Receipt / Checkout */}
                <div className="w-full lg:w-2/5">
                    <div className="sticky top-24 w-full bg-tactile-dark text-tactile-light border-[1.5px] border-tactile-dark p-6 hard-shadow flex flex-col gap-6">
                        <div className="text-center border-b-[1.5px] border-tactile-light/20 pb-4">
                            <h2 className="text-2xl font-serif font-black italic uppercase">Breshop</h2>
                            <p className="font-mono text-xs opacity-60 mt-1">ORDER SUMMARY RECEIPT</p>
                        </div>

                        <div className="flex flex-col gap-3 font-mono text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete Estimado</span>
                                <span>R$ {shipping.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-[1px] border-b-[1.5px] border-dashed border-tactile-light/30 my-2" />
                            
                            {/* Promo Code Logic Mockup */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="promoCode" className="text-xs uppercase font-sans font-bold">Código Promocional</label>
                                <div className="flex font-sans">
                                    <input 
                                        type="text" 
                                        id="promoCode"
                                        placeholder="INSIRA AQUI"
                                        className="w-full bg-tactile-light/10 border-[1.5px] border-tactile-light px-3 py-2 text-tactile-light placeholder:text-tactile-light/30 focus:outline-none uppercase text-sm"
                                    />
                                    <button 
                                        onClick={() => showToast("Validação de cupom em breve!")}
                                        className="bg-tactile-light text-tactile-dark px-4 font-bold border-y-[1.5px] border-r-[1.5px] border-tactile-light hover:bg-accent-orange hover:border-accent-orange transition-colors"
                                    >
                                        APLICAR
                                    </button>
                                </div>
                            </div>

                            <div className="w-full h-[1px] border-b-[1.5px] border-dashed border-tactile-light/30 my-2" />

                            <div className="flex justify-between items-end font-sans">
                                <span className="font-bold uppercase text-sm">Total</span>
                                <span className="font-serif font-black italic text-4xl text-accent-lime">R$ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => showToast("Processamento de pagamento em breve!")}
                            className="w-full mt-4 bg-accent-orange text-tactile-dark border-[2px] border-tactile-dark font-black tracking-widest uppercase py-4 text-lg hover:bg-tactile-light transition-colors tag-pill"
                        >
                            Finalizar Compra
                        </button>

                        <p className="text-center text-[10px] font-mono opacity-50 uppercase mt-2">
                            Transação criptografada & Segura
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
