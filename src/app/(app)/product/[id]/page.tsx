"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/src/shared/components/ui/Toast";
import { use, useEffect, useState } from "react";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data";
import { useMarketplaceStore, DbItem } from "@/src/shared/lib/store/marketplaceStore";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { showToast } = useToast();
  const { id: productId } = use(params);

  const { user, favorites, toggleFavorite, reserveItem, loadingPiece, items } = useMarketplaceStore();

  const [dbItem, setDbItem] = useState<DbItem | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    setLoadingItem(true);
    fetch(`/api/items/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setDbItem(data);
      })
      .catch(() => null)
      .finally(() => setLoadingItem(false));
  }, [productId]);

  // Live status from store (updates after reserve)
  const liveItem = items.find((i) => i.id === productId);
  const effectiveStatus = liveItem?.status ?? dbItem?.status ?? 'AVAILABLE';

  // Fallback to mock while loading
  const mock = MOCK_PRODUCTS.find((p) => p.id === productId) ?? MOCK_PRODUCTS[0];
  const mockShop = MOCK_SHOPS.find((s) => s.id === mock.shopId) ?? MOCK_SHOPS[0];

  const title = dbItem?.title ?? `${mock.brand} ${mock.model}`;
  const price = dbItem?.price ?? mock.price;
  const imageUrl = mock.imageUrl;
  const shopName = dbItem?.brecho?.name ?? mockShop.name;
  const shopId = dbItem?.brecho?.id ?? mockShop.id;

  const isFavorited = favorites.includes(productId);
  const isLoading = !!loadingPiece[productId];
  const isAvailable = effectiveStatus === 'AVAILABLE';

  const statusLabel: Record<string, string> = {
    AVAILABLE: '',
    RESERVED: 'Reservado',
    SOLD_PENDING_DELIVERY: 'Vendido',
    COMPLETED: 'Vendido',
    CANCELLED: 'Cancelado',
    RETURNED_TO_STORE: 'Disponível',
    SOLD_OUTSIDE_APP: 'Indisponível',
  };

  const handleReserve = async () => {
    if (!user) {
      showToast("Faça login para reservar uma peça");
      return;
    }
    try {
      await reserveItem(productId);
      showToast("Peça reservada! Aguardando aprovação do brechó.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro ao reservar");
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        <div className="flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50 hover:text-foreground transition-all">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Voltar pro Garimpo
          </Link>
          <button
            onClick={() => {
              toggleFavorite(productId);
              showToast(isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos");
            }}
            className={`w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center transition-all ${isFavorited ? 'bg-red-500 text-white border-red-500' : 'hover:bg-white'}`}
          >
            <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Image */}
          <div className="w-full lg:w-[55%]">
            <div className="relative aspect-[4/5] w-full bg-white rounded-[40px] p-4 md:p-8 shadow-2xl border border-foreground/5 overflow-hidden">
              {effectiveStatus !== 'AVAILABLE' && (
                <div className="absolute inset-0 z-10 bg-black/40 rounded-[40px] flex items-center justify-center">
                  <span className="font-mono text-sm font-black uppercase tracking-widest text-white bg-black/60 px-6 py-3 rounded-full">
                    {statusLabel[effectiveStatus] ?? effectiveStatus}
                  </span>
                </div>
              )}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                {loadingItem ? (
                  <div className="w-full h-full bg-foreground/5 animate-pulse rounded-[30px]" />
                ) : (
                  <Image src={imageUrl} alt={title} fill sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" priority />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white rounded-3xl border border-foreground/5 p-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="w-full h-full rounded-2xl bg-foreground/5 overflow-hidden relative">
                    <Image src={imageUrl} fill sizes="200px" alt="view" className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-[45%] flex flex-col pt-0 lg:pt-8">
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-foreground text-background rounded-full">
                  {mock.condition}
                </span>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  Ref: {productId}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-black italic tracking-tighter uppercase leading-none">
                {dbItem ? title : mock.brand}
              </h1>
              {!dbItem && (
                <h2 className="text-2xl md:text-3xl font-serif italic text-foreground/60 leading-tight">
                  {mock.model}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 border-y border-foreground/10 py-8">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">Tamanho</span>
                <span className="font-serif font-black text-2xl italic">{mock.size}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">Preço</span>
                <span className="font-serif font-black text-4xl italic">C$ {price}</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <p className="font-serif text-xl leading-relaxed text-foreground/80 italic">
                &quot;{mock.description}&quot;
              </p>
              <div className="flex flex-wrap gap-2">
                {mock.tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white rounded-full border border-foreground/5 font-mono text-[10px] font-black uppercase tracking-widest shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-12">
              <button
                onClick={handleReserve}
                disabled={!isAvailable || isLoading}
                className="w-full bg-foreground text-background rounded-full py-6 text-xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 size={24} className="animate-spin" /> Reservando...</>
                ) : !isAvailable ? (
                  <>{statusLabel[effectiveStatus] ?? 'Indisponível'}</>
                ) : (
                  <><ShoppingBag size={24} /> Reservar por C$ {price}</>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-foreground/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} />
                Garantia de Autenticidade Breshop
              </div>
            </div>

            <Link href={`/shop/${shopId}`} className="group bg-white rounded-[40px] p-8 flex items-center justify-between border border-foreground/5 hover:border-foreground/20 transition-all shadow-lg">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-foreground rounded-[20px] flex items-center justify-center font-serif text-background italic text-3xl overflow-hidden relative">
                  {shopName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <p className="font-serif font-black text-xl italic uppercase tracking-tighter leading-none">{shopName}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                &rarr;
              </div>
            </Link>
          </div>
        </div>

        <section className="mt-24 border-t border-foreground/10 pt-24">
          <h3 className="text-4xl font-serif font-black italic tracking-tighter uppercase mb-12">Você também pode gostar.</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {MOCK_PRODUCTS.filter((p) => p.status === 'AVAILABLE').slice(0, 4).map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group flex flex-col gap-4">
                <div className="relative aspect-[3/4] bg-white rounded-[32px] p-4 border border-foreground/5 shadow-sm group-hover:shadow-xl transition-all overflow-hidden">
                  <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                    <Image src={p.imageUrl} fill sizes="(max-width:768px) 50vw, 25vw" alt={p.brand} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center px-4">
                  <span className="font-serif font-black text-lg italic uppercase tracking-tighter">{p.brand}</span>
                  <span className="font-serif font-black italic text-xl">C$ {p.price.toFixed(0)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
