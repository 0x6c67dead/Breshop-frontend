"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";

export default function FavoritesPage() {
    const [activeTab, setActiveTab] = useState<"products" | "shops">("products");

    return (
        <main className="w-full min-h-screen px-4 md:px-6 py-8 flex flex-col items-center">
            <div className="w-full max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-[2px] border-foreground pb-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter uppercase leading-none">
                            Favorites.
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mt-4">Curadoria Pessoal</p>
                    </div>

                    <div className="flex bg-tactile-light p-1 border-[1.5px] border-foreground hard-shadow">
                        <button 
                            onClick={() => setActiveTab("products")}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-foreground text-tactile-light" : "hover:bg-foreground/10"}`}
                        >
                            Produtos
                        </button>
                        <button 
                            onClick={() => setActiveTab("shops")}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "shops" ? "bg-foreground text-tactile-light" : "hover:bg-foreground/10"}`}
                        >
                            Brechós
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {activeTab === "products" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_PRODUCTS.slice(0, 3).map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group flex flex-col border-[1.5px] border-foreground bg-tactile-light hover:hard-shadow transition-all relative overflow-hidden">
                                <div className="aspect-[3/4] relative overflow-hidden border-b-[1.5px] border-foreground">
                                    <Image 
                                        src={product.imageUrl} 
                                        alt={product.model}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 flex flex-col gap-1">
                                    <span className="text-[10px] font-mono font-bold uppercase opacity-50">{product.brand}</span>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold uppercase text-sm tracking-tight">{product.model}</h3>
                                        <span className="font-serif font-black italic">R$ {product.price.toFixed(0)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_SHOPS.map((shop) => (
                            <div key={shop.id} className="border-[1.5px] border-foreground bg-tactile-light flex flex-col hover:hard-shadow transition-shadow">
                                {/* Shop Header */}
                                <div className="p-4 flex items-center gap-4 border-b-[1.5px] border-foreground">
                                    <div className="w-12 h-12 bg-tactile-dark text-tactile-light font-serif italic text-xl flex items-center justify-center flex-shrink-0">
                                        {shop.avatar}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-bold uppercase text-lg truncate">{shop.name}</h3>
                                        <p className="text-xs font-mono text-foreground/60 truncate">{shop.location}</p>
                                    </div>
                                    <Link href={`/shop/${shop.id}`} className="tag-pill border-[1.5px] border-foreground bg-accent-orange text-tactile-dark text-xs font-bold px-3 py-1 uppercase hover:bg-tactile-dark hover:text-tactile-light transition-colors">
                                        Visitar
                                    </Link>
                                </div>
                                
                                {/* Recent Items Showcase */}
                                <div className="p-4 bg-tactile-bg flex-1 flex flex-col justify-center">
                                    <div className="flex gap-2 h-28">
                                        {MOCK_PRODUCTS.filter(p => p.shopId === shop.id).slice(0, 3).map((product) => (
                                            <div key={product.id} className="relative flex-1 h-full border-[1.5px] border-foreground overflow-hidden">
                                                <Image 
                                                    src={product.imageUrl} 
                                                    alt={product.model} 
                                                    fill 
                                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                                                    sizes="(max-width: 768px) 33vw, 20vw"
                                                />
                                            </div>
                                        ))}
                                        {/* Preenche blocos vazios se tiver menos de 3 para manter o grid */}
                                        {Array.from({ length: Math.max(0, 3 - MOCK_PRODUCTS.filter(p => p.shopId === shop.id).length) }).map((_, idx) => (
                                            <div key={`empty-${idx}`} className="flex-1 h-full border-[1.5px] border-foreground border-dashed bg-foreground/5" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
