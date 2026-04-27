"use client";

import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { useCountdown } from "@/src/shared/lib/hooks/useCountdown";
import { MOCK_PRODUCTS, Product } from "@/src/shared/mocks/data";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reservation } from "@/src/shared/types/Marketplace";

export default function MinhasReservasPage() {
    const { reservations, setReservations } = useMarketplaceStore();

    // Mocking initial reservations for demo
    useEffect(() => {
        if (reservations.length === 0) {
            setReservations([
                {
                    id: "res-1",
                    pieceId: "prod-1",
                    buyerId: "user-1",
                    status: "PENDING",
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days
                }
            ]);
        }
    }, [reservations.length, setReservations]);

    return (
        <main className="flex flex-col min-h-screen p-4 md:p-8">
            <header className="mb-12 border-b-2 border-foreground pb-6">
                <h1 className="text-4xl md:text-6xl font-serif font-black italic uppercase tracking-tighter">
                    Minhas Reservas
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-foreground/50 mt-2">
                    Acompanhe suas peças selecionadas
                </p>
            </header>

            {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-xl font-bold uppercase text-foreground/30">Nenhuma reserva ativa</p>
                    <Link href="/" className="mt-4 text-sm font-black uppercase underline hover:text-accent-lime transition-colors">
                        Voltar para a vitrine
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reservations.map((res) => {
                        const product = MOCK_PRODUCTS.find(p => p.id === res.pieceId);
                        if (!product) return null;

                        return (
                            <ReservationCard key={res.id} reservation={res} product={product} />
                        );
                    })}
                </div>
            )}
        </main>
    );
}

function ReservationCard({ reservation, product }: { reservation: Reservation, product: Product }) {
    const timeLeft = useCountdown(reservation.expiresAt);

    return (
        <div className="border-2 border-foreground p-4 flex flex-col gap-4 bg-background">
            <div className="flex gap-4">
                <div className="relative w-24 h-24 bg-foreground/5 border border-foreground overflow-hidden flex-shrink-0">
                    <Image 
                        src={product.imageUrl} 
                        alt={product.model} 
                        fill
                        className="object-cover" 
                    />
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <h3 className="font-black uppercase text-sm leading-tight">{product.brand}</h3>
                        <p className="text-xs text-foreground/70">{product.model}</p>
                    </div>
                    <p className="font-serif font-black italic">C${product.price.toFixed(0)}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-foreground/10 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Status</span>
                    <span className="bg-accent-lime text-foreground text-[10px] font-black uppercase px-2 py-0.5 border border-foreground">
                        {reservation.status}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Expira em</span>
                    <span className="font-mono text-xs font-bold text-red-600 animate-pulse">
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <button 
                    disabled 
                    className="flex-1 bg-foreground text-background font-black uppercase text-xs py-3 opacity-50 cursor-not-allowed"
                >
                    Aguardando Brechó
                </button>
                <button className="px-4 border-2 border-foreground text-foreground font-black uppercase text-xs hover:bg-red-50 transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
