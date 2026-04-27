"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/src/shared/mocks/data";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShowcaseCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  accentColor?: "lime" | "orange" | "blue";
}

export default function ShowcaseCarousel({ title, subtitle, products, accentColor = "lime" }: ShowcaseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => current?.removeEventListener("scroll", handleScroll);
  }, []);

  const accentClass = {
    lime: "bg-accent-lime",
    orange: "bg-accent-orange",
    blue: "bg-sky-500",
  }[accentColor];

  return (
    <section className="w-full py-12 md:py-20 border-b-2 border-foreground last:border-b-0">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-serif font-black italic uppercase tracking-tighter leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/50">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-4 border-2 border-foreground hard-shadow-sm transition-all ${canScrollLeft ? 'bg-tactile-light hover:bg-foreground hover:text-tactile-light' : 'opacity-20 cursor-not-allowed'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-4 border-2 border-foreground hard-shadow-sm transition-all ${canScrollRight ? 'bg-tactile-light hover:bg-foreground hover:text-tactile-light' : 'opacity-20 cursor-not-allowed'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product) => (
            <Link 
              key={product.id}
              href={`/product/${product.id}`}
              className="group flex-shrink-0 w-[280px] md:w-[350px] scroll-snap-align-start"
            >
              <div className="relative aspect-[4/5] border-2 border-foreground bg-foreground/5 overflow-hidden hard-shadow-sm group-hover:hard-shadow transition-all duration-300">
                <Image 
                  src={product.imageUrl}
                  alt={product.brand}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute top-4 left-4 border-[1.5px] border-foreground px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClass}`}>
                    {product.brand}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-black uppercase text-sm tracking-wide">{product.brand}</span>
                  <span className="text-foreground/60 text-xs font-bold uppercase">{product.model}</span>
                </div>
                <span className="font-serif font-black italic text-xl">C$ {product.price.toFixed(0)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
