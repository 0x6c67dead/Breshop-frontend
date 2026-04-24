import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex bg-tactile-bg">
            {/* Left Split: Editorial Splash (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-tactile-dark flex-col justify-between p-12 border-r-[2px] border-foreground">
                <Link href="/" className="text-5xl font-serif font-black italic text-tactile-light tracking-tighter hover:text-accent-orange transition-colors">
                    Breshop
                </Link>
                <div className="text-tactile-light">
                    <h2 className="text-6xl font-bold font-serif leading-none uppercase mb-4">
                        Unlock<br/> Archives.
                    </h2>
                    <p className="text-xl max-w-sm opacity-80">
                        Join the curated marketplace for sustainable and rare pieces.
                    </p>
                </div>
            </div>

            {/* Right Split: Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Header (Only visible on small screens) */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="text-3xl font-serif font-black italic tracking-tighter">
                        Breshop
                    </Link>
                </div>
                
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
