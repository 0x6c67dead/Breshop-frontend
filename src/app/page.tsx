"use client";

import ProductCard from "@/src/shared/components/feed/ProductCard";
import { MOCK_PRODUCTS } from "@/src/shared/mocks/data";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Editorial Feed Section */}
      <section className="px-4 md:px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-[2px] border-foreground pb-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter uppercase leading-none">
              Daily Drop.
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mt-4">Curadoria do dia</p>
          </div>
          <div className="hidden md:block font-mono text-xs font-bold text-foreground/40 uppercase tracking-widest">
            Showing {MOCK_PRODUCTS.length} curated pieces
          </div>
        </div>

        {/* Masonry-like Grid Layout */}
        <div className="w-full max-w-7xl columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="break-inside-avoid">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}