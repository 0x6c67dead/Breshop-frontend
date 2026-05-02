"use client";

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { MOCK_SHOPS, MOCK_PRODUCTS } from "@/src/shared/mocks/data";
import ProductCard from "@/src/shared/components/feed/ProductCard";
import { useToast } from "@/src/shared/components/ui/Toast";
import { ArrowLeft, UserPlus, MapPin, Star, Package, Loader2 } from "lucide-react";

interface Brecho {
  id: string;
  name: string;
}

interface DbItem {
  id: string;
  title: string;
  price: number;
  status: string;
  brechoId: string;
  brecho: Brecho;
}

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
    const { showToast } = useToast();
    const unresolvedParams = use(params);
    const shopId = unresolvedParams.id;

    const [dbItems, setDbItems] = useState<DbItem[]>([]);
    const [dbBrecho, setDbBrecho] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const itemsRes = await fetch(`/api/items?brechoId=${shopId}`);
          const itemsData = await itemsRes.json();
          if (Array.isArray(itemsData)) setDbItems(itemsData);

          const brechoRes = await fetch(`/api/brechos/${shopId}`);
          const brechoData = await brechoRes.json();
          if (brechoData && !brechoData.error) setDbBrecho(brechoData);
        } catch (err) {
          console.error('Error fetching:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [shopId]);

    const shop = dbBrecho || MOCK_SHOPS.find(s => s.id === shopId) || MOCK_SHOPS[0];
    const shopProducts = dbItems.length > 0 ? dbItems : MOCK_PRODUCTS.filter(p => p.shopId === shop.id);

    const [selectedTag, setSelectedTag] = useState<string>('');
    
    // Normalize and Filter Products
    const normalizedProducts = (dbItems.length > 0 ? dbItems : MOCK_PRODUCTS.filter(p => p.shopId === shop.id)).map((p: any) => ({
        id: p.id,
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        brand: p.brand || p.title?.split(' ')[0] || "Vintage",
        model: p.model || p.title?.split(' ').slice(1).join(' ') || p.title || "Peça Exclusiva",
        price: p.price,
        size: p.size || "Único",
        tags: p.tags?.map?.((t: any) => typeof t === 'string' ? t : t.name) || [],
        status: p.status
    }));

    const filteredProducts = selectedTag
      ? normalizedProducts.filter((p: any) => p.tags?.some?.((t: any) => t === selectedTag))
      : normalizedProducts;

    if (loading) {
      return (
        <main className="w-full min-h-screen bg-[#F4F0EB] flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-foreground" />
        </main>
      );
    }

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground">
            {/* Shop Banner area */}
            <div className="w-full h-[50vh] relative overflow-hidden">
                <Image 
                    src={shop.bannerUrl}
                    alt={shop.name}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-[20s] hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4F0EB] via-black/20 to-transparent" />
                
                {/* Header Overlay */}
                <div className="absolute top-12 left-4 md:left-12 right-4 md:right-12 flex justify-between items-center z-10">
                    <Link 
                        href="/" 
                        className="group flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-all"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Explorar Rede
                    </Link>
                </div>

                {/* Shop Identity Floating Card */}
                <div className="absolute -bottom-2 px-4 md:px-12 w-full">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
                         <div className="w-40 h-40 md:w-56 md:h-56 bg-foreground rounded-[40px] border-8 border-[#F4F0EB] flex items-center justify-center font-serif text-background italic text-6xl md:text-8xl shadow-2xl overflow-hidden relative">
                            {shop.avatar}
                        </div>
                        <div className="mb-8 flex flex-col gap-2">
                             <h1 className="text-6xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none text-foreground drop-shadow-sm">
                                {shop.name}
                            </h1>
                            <div className="flex items-center gap-4 text-foreground/40 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                                <MapPin size={14} />
                                {shop.location}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 pt-24 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left side: Info Panel */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="bg-white rounded-[40px] p-10 border border-foreground/5 shadow-xl space-y-8">
                            <div className="space-y-4">
                                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">Acervo Bio.</span>
                                <p className="font-serif text-xl leading-relaxed text-foreground/80 italic">
                                    "{shop.description}"
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-foreground/5">
                                <div className="flex flex-col items-center">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter">{shop.stats.products}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Peças</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter">{shop.stats.followers}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Seguidores</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter">{shop.stats.rating}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mt-1">Rating</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => showToast("Loja seguida!")}
                                className="w-full bg-foreground text-background rounded-full py-5 text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
                            >
                                <UserPlus size={18} />
                                Seguir Curadoria
                            </button>
                        </div>

                        {/* Specialization Tags */}
                        <div className="flex flex-wrap gap-2 px-4">
                            {["VINTAGE", "STREETWEAR", "ARCHIVE", "MINIMALIST"].map(tag => (
                                <span key={tag} className="px-5 py-2 bg-foreground text-background rounded-full font-mono text-[9px] font-black uppercase tracking-widest">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Shop Feed */}
                    <div className="lg:col-span-8">
                        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="flex flex-col">
                                <h2 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter uppercase leading-none">The Inventory.</h2>
                                <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground/40 mt-4">Peças únicas selecionadas por esta curadoria</p>
                            </div>
                            <div className="flex gap-4 font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                <span>Disponíveis ({filteredProducts.length})</span>
                            </div>
                        </div>

                        {/* Filters */}
                        {normalizedProducts.length > 0 && (
                          <div className="mb-12 flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedTag('')}
                              className={`px-4 py-2 rounded-full font-mono text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedTag === ''
                                  ? 'bg-foreground text-background'
                                  : 'border border-foreground/20 text-foreground hover:border-foreground'
                              }`}
                            >
                              Todos
                            </button>
                            {Array.from(new Set(
                              normalizedProducts.flatMap((p: any) => p.tags || [])
                            )).map((tag: string) => (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-2 rounded-full font-mono text-[10px] font-black uppercase tracking-widest transition-all ${
                                  selectedTag === tag
                                    ? 'bg-foreground text-background'
                                    : 'border border-foreground/20 text-foreground hover:border-foreground'
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="columns-1 md:columns-2 gap-12 space-y-12">
                            {filteredProducts.map((product) => (
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
