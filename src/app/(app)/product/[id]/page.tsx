"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from "lucide-react";
import { useToast } from "@/src/shared/components/ui/Toast";
import { use } from "react";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { showToast } = useToast();
  const unresolvedParams = use(params);
  const productId = unresolvedParams.id;

  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const shop = MOCK_SHOPS.find(s => s.id === product.shopId) || MOCK_SHOPS[0];

  return (
    <main className="w-full min-h-screen px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Left Side: Editorial Image */}
        <div className="w-full md:w-1/2">
          {/* Breadcrumb / Back */}
          <Link href="/" className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors mb-6">
            &larr; Voltar pro Garimpo
          </Link>

          <div className="w-full relative aspect-[3/4] border-[2px] border-foreground bg-tactile-light">
            <Image 
              src={product.imageUrl} 
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col pt-0 md:pt-12">
          
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight">
              {product.brand}
            </h1>
            <h2 className="text-xl md:text-2xl font-serif italic text-foreground/80">
              {product.model}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="tag-pill border-[1.5px] border-foreground px-3 py-1 font-bold text-xs uppercase bg-foreground text-tactile-light">
              Tamanho {product.size}
            </span>
            <span className="tag-pill border-[1.5px] border-foreground px-3 py-1 font-bold text-xs uppercase bg-tactile-light">
              Condição {product.condition}
            </span>
            {product.tags.map(tag => (
              <span key={tag} className="tag-pill border-[1.5px] border-foreground px-3 py-1 font-bold text-xs uppercase bg-accent-lime text-tactile-dark">
                #{tag}
              </span>
            ))}
          </div>

          <p className="font-serif text-lg leading-relaxed mb-10 text-foreground/90">
            {product.description}
          </p>

          <div className="flex flex-col gap-4 border-t-[2px] border-foreground pt-8 mb-8">
            <div className="flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-sm opacity-60">Valor da Peça</span>
                <span className="text-5xl font-serif font-black italic">R$ {product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => showToast("Adicionar à sacola será implementado em breve!")}
                    className="tag-pill flex-1 bg-accent-orange text-tactile-dark border-[2px] border-foreground py-5 text-xl font-black uppercase tracking-widest hard-shadow hover:bg-tactile-light transition-all"
                >
                    Adicionar à Sacola
                </button>
                
                <button 
                    onClick={() => showToast("Favoritar peça será implementado em breve!")}
                    className="tag-pill bg-tactile-light text-foreground border-[2px] border-foreground p-5 aspect-square flex items-center justify-center hard-shadow hover:bg-accent-lime transition-all"
                    aria-label="Favoritar"
                >
                    <Heart size={28} className="stroke-[2]" />
                </button>
            </div>
          </div>

          {/* Shop Card */}
          <div className="border-[1.5px] border-foreground bg-tactile-bg p-4 flex items-center justify-between hover:hard-shadow transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-tactile-dark flex items-center justify-center font-serif text-tactile-light italic text-xl border-[1.5px] border-foreground">
                {shop.avatar}
              </div>
              <div>
                <p className="font-bold uppercase text-sm">{shop.name}</p>
                <p className="font-mono text-xs text-foreground/60">{shop.location}</p>
              </div>
            </div>
            <Link href={`/shop/${shop.id}`} className="font-bold text-xs uppercase tracking-widest underline decoration-2 hover:text-accent-orange transition-colors">
              Explorar Loja
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
