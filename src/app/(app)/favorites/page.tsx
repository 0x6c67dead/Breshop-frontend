"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";
import { Heart, Store, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
    const [activeTab, setActiveTab] = useState<"products" | "shops">("products");

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-foreground/10 pb-12">
                    <div className="flex flex-col">
                         <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">
                            Favorites.
                        </h1>
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">Sua curadoria pessoal na rede</p>
                    </div>

                    <div className="flex bg-white p-2 rounded-full border border-foreground/5 shadow-sm">
                        <button 
                            onClick={() => setActiveTab("products")}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-foreground text-background shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
                        >
                            Peças
                        </button>
                        <button 
                            onClick={() => setActiveTab("shops")}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "shops" ? "bg-foreground text-background shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
                        >
                            Brechós
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {activeTab === "products" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group flex flex-col gap-4">
                                <div className="relative aspect-[3/4] bg-white rounded-[32px] p-4 border border-foreground/5 shadow-sm group-hover:shadow-2xl transition-all overflow-hidden">
                                     <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                                        <Image 
                                            src={product.imageUrl} 
                                            alt={product.model}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                                                <Heart size={16} fill="currentColor" />
                                            </div>
                                        </div>
                                     </div>
                                </div>
                                <div className="flex flex-col items-center text-center px-4">
                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40">{product.brand}</span>
                                    <h3 className="font-serif font-black text-xl italic uppercase tracking-tighter leading-tight mt-1">{product.model}</h3>
                                    <span className="font-serif font-black italic text-2xl mt-2">C$ {product.price.toFixed(0)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_SHOPS.map((shop) => (
                            <div key={shop.id} className="group bg-white rounded-[40px] p-8 flex flex-col gap-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-foreground rounded-[20px] flex items-center justify-center font-serif text-background italic text-3xl overflow-hidden relative">
                                            {shop.avatar}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-serif font-black text-xl italic uppercase tracking-tighter leading-none">{shop.name}</h3>
                                            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-1">{shop.location}</p>
                                        </div>
                                    </div>
                                    <Link href={`/shop/${shop.id}`} className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 h-32">
                                    {MOCK_PRODUCTS.filter(p => p.shopId === shop.id).slice(0, 3).map((product) => (
                                        <div key={product.id} className="relative h-full rounded-2xl overflow-hidden border border-foreground/5 bg-foreground/5">
                                            <Image 
                                                src={product.imageUrl} 
                                                alt={product.model} 
                                                fill 
                                                className="object-cover transition-all duration-300 opacity-60 group-hover:opacity-100" 
                                            />
                                        </div>
                                    ))}
                                    {Array.from({ length: Math.max(0, 3 - MOCK_PRODUCTS.filter(p => p.shopId === shop.id).length) }).map((_, idx) => (
                                        <div key={`empty-${idx}`} className="h-full rounded-2xl border-2 border-dashed border-foreground/5 bg-foreground/5" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
