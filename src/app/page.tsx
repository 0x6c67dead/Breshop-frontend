"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/src/shared/components/feed/ProductCard";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const availableProducts = MOCK_PRODUCTS.filter(p => p.status === "AVAILABLE");
  
  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=2000&auto=format&fit=crop", // Clothes on rack
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop", // Clothing store interior
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2000&auto=format&fit=crop", // Shop window
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2000&auto=format&fit=crop"  // Detailed rack
  ];

  // Shop Showcase State
  const [shopIndex, setShopIndex] = useState(0);
  const highlightedShops = MOCK_SHOPS.map(shop => ({
    name: shop.name.toUpperCase(),
    products: availableProducts.filter(p => p.shopId === shop.id)
  }));

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    const shopInterval = setInterval(() => {
      setShopIndex((prev) => (prev + 1) % highlightedShops.length);
    }, 8000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(shopInterval);
    };
  }, [highlightedShops.length]);

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground">
      {/* Editorial Hero Carousel */}
      <section className="w-full h-[85vh] relative overflow-hidden bg-black">
        {heroImages.map((img, i) => (
          <div 
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={img} 
              alt={`Editorial ${i + 1}`} 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <span className="font-mono text-xs uppercase tracking-[0.4em] mb-6 animate-fade-in">Curadoria Autêntica</span>
            <h1 className="text-7xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none mb-12 drop-shadow-2xl">
                O Novo <br />Passado.
            </h1>
            <Link href="/shop" className="px-12 py-4 border-2 border-white text-white font-serif italic text-xl hover:bg-white hover:text-black transition-all backdrop-blur-sm rounded-full inline-block">
                Explorar Acervos
            </Link>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {heroImages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 ${i === heroIndex ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Logo Marquee (Fictional Shops) */}
      <section className="w-full py-12 border-y border-foreground/10 bg-white/50 backdrop-blur-sm overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap gap-20 items-center">
          {MOCK_SHOPS.concat(MOCK_SHOPS).map((shop, i) => (
            <Link key={i} href={`/shop/${shop.id}`} className="flex items-center gap-10 group">
                <span className="text-4xl font-serif font-black italic uppercase tracking-tighter mx-10 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all cursor-pointer">{shop.name}</span>
                <div className="w-2 h-2 rounded-full bg-foreground/20" />
            </Link>
          ))}
        </div>
      </section>

      {/* Branding Exposition (Shop Carousel) */}
      <section className="w-full py-24 bg-[#F4F0EB] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            {/* Shop Title Switcher */}
            <div className="relative h-24 md:h-32 w-full flex items-center justify-center mb-8">
                {highlightedShops.map((shop, i) => (
                  <h2 
                    key={shop.name}
                    className={`absolute text-5xl md:text-8xl font-serif font-black italic tracking-tighter uppercase leading-none transition-all duration-1000 text-center ${i === shopIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  >
                    {shop.name}
                  </h2>
                ))}
            </div>
            <div className="w-48 h-0.5 bg-foreground/10 mb-20"></div>

            {/* White Container Card */}
            <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl border border-foreground/5 relative overflow-hidden">
                <div 
                    className="flex transition-transform duration-1000 ease-in-out" 
                    style={{ transform: `translateX(-${shopIndex * 100}%)` }}
                >
                    {highlightedShops.map((shop) => (
                        <div key={shop.name} className="flex-shrink-0 w-full p-8 md:p-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {(shop.products.length > 0 ? shop.products : availableProducts).slice(0, 3).map((product, i) => (
                                    <Link key={product.id} href={`/product/${product.id}`} className="flex flex-col gap-4 group">
                                        <div className={`relative aspect-[3/4] rounded-[24px] overflow-hidden border border-foreground/5 transition-all duration-500 group-hover:shadow-lg ${i === 1 ? 'md:scale-105 md:-translate-y-2' : ''}`}>
                                            <Image 
                                                src={product.imageUrl} 
                                                alt={product.brand}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <h3 className="font-serif font-black text-lg italic uppercase tracking-tighter leading-tight">{product.brand}</h3>
                                            <p className="font-mono text-[9px] text-foreground/40 font-bold mt-1 uppercase tracking-widest">{product.model}</p>
                                            <p className="font-serif font-black italic text-xl mt-1">C$ {product.price.toFixed(0)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Full Feed Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-20">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-col">
            <h2 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter uppercase leading-none">
              Full Feed.
            </h2>
            <p className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/50 mt-4">
              Explore o acervo completo da rede
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="tag-pill border border-foreground/10 px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-foreground hover:text-background transition-all rounded-full">
              Filtrar
            </button>
            <button className="tag-pill border border-foreground/10 px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-foreground hover:text-background transition-all rounded-full">
              Ordenar
            </button>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12">
          {availableProducts.map((product) => (
            <div key={product.id} className="break-inside-avoid">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="w-full py-40 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center flex flex-col items-center">
            <h2 className="text-7xl md:text-9xl font-serif font-black italic tracking-tighter uppercase leading-none mb-12">
                Join the <br />Network.
            </h2>
            <Link href="/shop/create" className="bg-white text-foreground px-16 py-6 text-xl font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl inline-block">
                Criar seu Brechó
            </Link>
        </div>
      </section>
    </main>
  );
}