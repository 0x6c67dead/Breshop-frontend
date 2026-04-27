"use client";

import { useState } from "react";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";
import ProductCard from "@/src/shared/components/feed/ProductCard";
import { useSearchParams } from "next/navigation";
import { Search, Filter, ArrowUpDown, SlidersHorizontal, X, Store, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FullShopPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    
    // Mocking filter states
    const categories = ["TUDO", "JAQUETAS", "TÊNIS", "ACESSÓRIOS", "DENIM"];
    const [activeCategory, setActiveCategory] = useState("TUDO");

    // Filter Shops
    const filteredShops = MOCK_SHOPS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter Products
    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        const matchesSearch = p.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.model.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "TUDO" || 
                               p.tags.some(t => t.toUpperCase() === activeCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Header */}
                <div className="border-b border-foreground/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="flex flex-col">
                         <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none">
                            Results.
                        </h1>
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">
                            Encontramos {filteredProducts.length} produtos e {filteredShops.length} brechós
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <input 
                                type="text"
                                placeholder="BUSCAR NA REDE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-foreground/5 rounded-full px-12 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-foreground/20 shadow-sm"
                            />
                            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shops Section (Only if searching) */}
                {searchQuery && filteredShops.length > 0 && (
                    <section className="animate-fade-in">
                        <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Brechós Encontrados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredShops.map(shop => (
                                <Link key={shop.id} href={`/shop/${shop.id}`} className="group bg-white rounded-[32px] p-8 border border-foreground/5 hover:border-foreground/20 transition-all shadow-md flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center font-serif text-background italic text-2xl">
                                            {shop.avatar}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-serif font-black text-xl italic uppercase tracking-tighter">{shop.name}</span>
                                            <span className="font-mono text-[9px] font-bold text-foreground/40 uppercase tracking-widest">{shop.location}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                                        <ArrowRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sub-header: Filters & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12">
                    <div className="flex bg-white p-1.5 rounded-full border border-foreground/5 shadow-sm overflow-x-auto max-w-full">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-foreground text-background shadow-md' : 'text-foreground/40 hover:text-foreground'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-foreground/5 shadow-sm hover:shadow-md transition-all">
                            <SlidersHorizontal size={14} className="text-foreground/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-foreground/5 shadow-sm hover:shadow-md transition-all">
                            <ArrowUpDown size={14} className="text-foreground/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ordenar</span>
                        </button>
                    </div>
                </div>

                {/* Main Product Grid */}
                <section>
                    <h3 className="font-serif font-black text-2xl italic uppercase tracking-tighter mb-8">Produtos</h3>
                    {filteredProducts.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12 animate-fade-in">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="break-inside-avoid">
                                    <ProductCard {...product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-6">
                            <h3 className="text-3xl font-serif font-black italic tracking-tighter uppercase opacity-30">Nenhum produto.</h3>
                        </div>
                    )}
                </section>

                {/* Pagination Mockup */}
                {filteredProducts.length > 0 && (
                    <div className="flex justify-center pt-24 pb-12">
                        <div className="flex items-center gap-4">
                             <button className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center opacity-30 cursor-not-allowed">
                                &larr;
                             </button>
                             <div className="flex gap-2">
                                <button className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">1</button>
                                <button className="w-12 h-12 rounded-full bg-white border border-foreground/5 flex items-center justify-center text-[10px] font-black hover:bg-foreground hover:text-background transition-all shadow-sm">2</button>
                             </div>
                             <button className="w-12 h-12 rounded-full bg-white border border-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-all shadow-sm">
                                &rarr;
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
