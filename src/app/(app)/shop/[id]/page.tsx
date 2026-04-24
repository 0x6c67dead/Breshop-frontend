"use client";

import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { MOCK_SHOPS, MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import ProductCard from "@/src/shared/components/feed/ProductCard";
import { useToast } from "@/src/shared/components/ui/Toast";

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
    const { showToast } = useToast();
    const unresolvedParams = use(params);
    const shopId = unresolvedParams.id;

    const shop = MOCK_SHOPS.find(s => s.id === shopId) || MOCK_SHOPS[0];
    const shopProducts = MOCK_PRODUCTS.filter(p => p.shopId === shop.id);

    return (
        <main className="w-full min-h-screen pt-0">
            {/* Shop Header / Banner */}
            <div className="w-full h-[40vh] relative border-b-[2px] border-foreground bg-tactile-dark">
                <Image 
                    src={shop.bannerUrl} 
                    alt={shop.name}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                
                {/* Back Link */}
                <Link 
                    href="/" 
                    className="absolute top-6 left-6 z-10 px-4 py-2 bg-tactile-light border-[1.5px] border-foreground font-mono text-xs font-bold uppercase tracking-widest hard-shadow hover:bg-foreground hover:text-tactile-light transition-all"
                >
                    &larr; Voltar
                </Link>

                {/* Shop Identity Overlay */}
                <div className="absolute -bottom-12 left-4 md:left-12 flex items-end gap-6 z-20">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-tactile-dark border-[2px] border-foreground flex items-center justify-center font-serif text-tactile-light italic text-4xl md:text-5xl hard-shadow">
                        {shop.avatar}
                    </div>
                    <div className="mb-4 bg-tactile-light/90 border-[1.5px] border-foreground p-4 hard-shadow">
                        <h1 className="text-3xl md:text-5xl font-black uppercase leading-none tracking-tighter">
                            {shop.name}
                        </h1>
                        <p className="text-xs md:text-sm font-mono mt-2 font-bold text-foreground/70 uppercase">
                            {shop.location}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 pt-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    {/* Left: Info & Stats */}
                    <div className="lg:col-span-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-xl font-serif font-black italic border-b-[1.5px] border-foreground w-max pb-1">Bio.</h2>
                            <p className="font-serif text-lg leading-relaxed text-foreground/80">
                                {shop.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 border-[2px] border-foreground bg-tactile-light divide-x-[2px] divide-foreground hard-shadow">
                            <div className="p-4 text-center">
                                <p className="text-2xl font-black">{shop.stats.products}</p>
                                <p className="text-[10px] font-mono uppercase opacity-60">Peças</p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-2xl font-black">{shop.stats.followers}</p>
                                <p className="text-[10px] font-mono uppercase opacity-60">Seguidores</p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-2xl font-black">{shop.stats.rating}</p>
                                <p className="text-[10px] font-mono uppercase opacity-60">Nota</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => showToast("Seguir brechó em breve!")}
                            className="w-full tag-pill bg-accent-orange text-tactile-dark border-[2px] border-foreground py-4 font-black uppercase tracking-widest hard-shadow hover:bg-tactile-light transition-all"
                        >
                            Seguir Loja
                        </button>
                    </div>

                    {/* Right: Product Feed */}
                    <div className="lg:col-span-2">
                        <div className="mb-10 flex justify-between items-end">
                            <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase">The Inventory.</h2>
                        </div>

                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {shopProducts.map((product) => (
                                <div key={product.id} className="break-inside-avoid">
                                    <ProductCard {...product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
