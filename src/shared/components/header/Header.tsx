"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Coins, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Header() {
    const { balance, user, logout } = useMarketplaceStore();
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");

    // Hide header on auth pages
    if (AUTH_PATHS.some((p) => pathname.startsWith(p))) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isOwner = user?.role === 'BRECHO_OWNER';
    const isAdmin = user?.role === 'ADMIN';

    return (
        <header className="sticky top-0 w-full z-50 bg-[#F4F0EB]/80 backdrop-blur-md border-b border-foreground/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-12 h-24">

                {/* Left: Search & Wallet */}
                <form onSubmit={handleSearch} className="flex items-center gap-6 flex-1 lg:flex-none">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-foreground/5 rounded-full pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-foreground/20 shadow-sm w-32 md:w-48 lg:w-64 transition-all focus:w-48 md:focus:w-64 lg:focus:w-80"
                        />
                        <button type="submit" className="absolute left-4 text-foreground/40 hover:text-foreground">
                            <Search size={18} />
                        </button>
                    </div>
                    {user && (
                        <Link
                            href={isOwner || isAdmin ? '/extrato' : '/minhas-reservas'}
                            className="hidden md:flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-foreground/5 shadow-sm hover:border-foreground/20 hover:shadow-md transition-all"
                        >
                            <Coins size={14} className="text-foreground/40" />
                            <span className="text-[10px] font-black tracking-widest uppercase">C$ {balance}</span>
                        </Link>
                    )}
                </form>

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="text-3xl md:text-5xl font-serif font-black italic tracking-tighter hover:opacity-70 transition-opacity">
                        Breshop.
                    </Link>
                </div>

                {/* Right: Nav + Actions */}
                <div className="flex items-center gap-4">
                    <nav className="hidden lg:flex items-center gap-6 mr-4">
                        {isAdmin && (
                            <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                Admin
                            </Link>
                        )}
                        {(isOwner || isAdmin) && (
                            <>
                                <Link href="/shop-dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/extrato" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                    Extrato
                                </Link>
                            </>
                        )}
                        {!isOwner && (
                            <>
                                <Link href="/favorites" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                    Favoritos
                                </Link>
                                <Link href="/minhas-reservas" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                    Reservas
                                </Link>
                            </>
                        )}
                        {user ? (
                            <>
                                <Link href="/profile" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
                                    Perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
                                >
                                    <LogOut size={12} />
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 bg-foreground text-background px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all">
                                <LogIn size={14} />
                                Login
                            </Link>
                        )}
                    </nav>

                    <button className="w-12 h-12 rounded-full bg-white border border-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-all shadow-sm lg:hidden">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
