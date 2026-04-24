import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardProps {
    id: string;
    imageUrl: string;
    brand: string;
    model: string;
    price: number;
    size: string;
    tags: string[];
}

export default function ProductCard({ id, imageUrl, brand, model, price, size, tags }: ProductCardProps) {
    return (
        <Link href={`/product/${id}`} className="group block w-full mb-6 relative">
            <div className="relative w-full overflow-hidden bg-foreground/5 border-[1.5px] border-foreground">
                {/* 
                    Using aspect-auto and letting the image dictact height requires 
                    either responsive layout or an unoptimized img tag.
                    Since we use next/image in a masonry, we need to provide dimensions, 
                    but to support varying content heights we usually set a known width/height ratio 
                    or use layout="fill" with a container that has an aspect ratio. 
                    Because it's masonry, we want the image to dictate its natural height.
                    A modern trick in next/image for masonry is setting width to a structural constraint and height implicitly,
                    but Next.js Image component needs both width/height to avoid CLS. 
                    We'll use an intrinsic or responsive layout with placeholder dimensions.
                */}
                <Image 
                    src={imageUrl} 
                    alt={`${brand} ${model}`} 
                    width={400} 
                    height={500} 
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                />
                
                {/* Tactical Pills Overlay */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-2 z-10">
                    {tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag-pill bg-accent-lime text-foreground uppercase border-[1.5px] border-foreground text-[10px] px-2 py-1">
                            #{tag}
                        </span>
                    ))}
                </div>

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
                <div className="font-serif font-black italic text-lg text-foreground">
                    R${price.toFixed(2)}
                </div>
            </div>
        </Link>
    );
}
