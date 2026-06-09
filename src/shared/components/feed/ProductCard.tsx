import Image from 'next/image';
import Link from 'next/link';
import { PieceStatus } from '@/src/shared/types/Marketplace';

export interface ProductCardProps {
    id: string;
    imageUrl: string;
    brand: string;
    model: string;
    price: number;
    size: string;
    tags: string[];
    status?: PieceStatus;
}

export default function ProductCard({ id, imageUrl, brand, model, price, size, tags, status = "AVAILABLE" }: ProductCardProps) {
    const isReserved = status === "RESERVED";
    const isSold = status === "SOLD";

    return (
        <Link href={`/product/${id}`} className={`group block w-full mb-6 relative ${isReserved || isSold ? 'pointer-events-none' : ''}`}>
            <div className="relative w-full overflow-hidden bg-foreground/5 border-[1.5px] border-foreground">
                <Image 
                    src={imageUrl} 
                    alt={`${brand} ${model}`} 
                    width={400} 
                    height={500} 
                    className={`w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${(isReserved || isSold) ? 'grayscale opacity-50' : ''}`} 
                />
                
                {/* Tactical Pills Overlay */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-2 z-10">
                    {tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag-pill bg-accent-lime text-foreground uppercase border-[1.5px] border-foreground text-[10px] px-2 py-1">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Status Badges */}
                {isReserved && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="bg-foreground text-background font-black uppercase text-2xl px-4 py-2 border-2 border-background transform -rotate-12">
                            Reservado
                        </span>
                    </div>
                )}
                {isSold && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="bg-red-600 text-white font-black uppercase text-2xl px-4 py-2 border-2 border-white transform rotate-12">
                            Vendido
                        </span>
                    </div>
                )}

                {/* Size Badge */}
                <div className="absolute top-2 right-2 bg-foreground text-tactile-light font-bold text-xs px-2 py-1 uppercase tracking-wider">
                    {size}
                </div>
            </div>

            <div className="mt-2 flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="font-sans font-black uppercase text-sm leading-tight tracking-wide">{brand}</span>
                    <span className="text-foreground/70 text-sm font-medium">{model}</span>
                </div>
                <div className="font-serif font-black italic text-lg text-foreground flex items-center gap-1">
                    C$ {price.toFixed(0)}
                </div>
            </div>
        </Link>
    );
}
