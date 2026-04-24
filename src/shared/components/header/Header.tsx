"use client";

import { useState, useEffect } from "react";
import { Search, UserRound, Heart, X, ShoppingBag } from "lucide-react";
import HeaderNavButton from "./HeaderNavButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/shared/components/ui/Toast";

export default function Header() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileSearchActive, setMobileSearchActive] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { showToast } = useToast();

    const MOCK_CATEGORIES = [
        { id: 1, name: "HOMEM" },
        { id: 2, name: "MULHER" },
        { id: 3, name: "VINTAGE" },
        { id: 4, name: "STREETWEAR" },
        { id: 5, name: "Y2K" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            if (window.scrollY > 20) {
                setMobileSearchActive(true);
            } else {
                setMobileSearchActive(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchFocused(false);
        }
    };

    return (
        <>
            {/* Desktop Backdrop Overlay */}
            {isSearchFocused && (
                <div 
                    className="hidden md:block fixed inset-0 bg-tactile-dark/80 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSearchFocused(false)}
                />
            )}

            <header className="sticky top-0 w-full z-50 bg-background border-b-[1.5px] border-foreground">
                <div className="flex items-center justify-between px-4 md:px-6 h-16 transition-all duration-300 gap-4">
                    
                    {/* Logo (Hidden on mobile when scrolled or when mobile search is active) */}
                    <div className={`${mobileSearchActive ? 'hidden' : 'block'} md:block transition-all flex-shrink-0`}>
                        <Link href={'/'} className="text-3xl md:text-4xl font-serif font-black italic tracking-tighter">
                            Breshop
                        </Link>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                        <form onSubmit={handleSearchSubmit} className="w-full relative">
                            <input 
                                type="text"
                                placeholder="Garimpar peças, brechós..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                className={`w-full bg-tactile-light border-[1.5px] border-foreground px-4 py-2.5 pr-10 focus:outline-none focus:border-accent-orange transition-all placeholder:text-foreground/50 ${isSearchFocused ? 'hard-shadow-lg scale-105 bg-white z-50 relative' : ''}`}
                            />
                            <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 ${isSearchFocused ? 'z-50' : ''}`} aria-label="Search">
                                <Search size={20} className="stroke-[1.5] hover:text-accent-orange transition-colors" />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Search Bubble (Now inline with icons when active) */}
                    <div className={`${mobileSearchActive ? 'flex' : 'hidden'} md:hidden flex-1 relative`}>
                        <form onSubmit={handleSearchSubmit} className="w-full relative">
                            <input 
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={mobileSearchActive && !isScrolled}
                                className="w-full rounded-full bg-tactile-light border-[1.5px] border-foreground px-4 py-2 pr-10 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all placeholder:text-foreground/50"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Submit Search">
                                <Search size={18} className="stroke-[1.5]" />
                            </button>
                        </form>
                    </div>

                    {/* Right Nav Icons */}
                    <nav className="flex gap-3 md:gap-6 items-center flex-shrink-0">
                        {/* Mobile Search Trigger (Hidden when search bubble is active) */}
                        <button 
                            className={`${mobileSearchActive ? 'hidden' : 'block'} md:hidden hover:text-accent-orange transition-colors`} 
                            aria-label="Open Search"
                            onClick={() => setMobileSearchActive(true)}
                        >
                            <Search size={22} className="stroke-[1.5]" />
                        </button>
                        
                        <Link href={'/favorites'} className="hover:text-accent-orange transition-colors" aria-label="Favorites">
                            <Heart size={22} className="stroke-[1.5]" />
                        </Link>

                        <Link href={'/cart'} className="hover:text-accent-orange transition-colors" aria-label="Cart">
                            <ShoppingBag size={22} className="stroke-[1.5]" />
                        </Link>

                        <div className="relative">
                            {/* Desktop: Toggle Dropdown | Mobile: Direct Link to Profile */}
                            <button 
                                onClick={() => {
                                    if (window.innerWidth >= 768) {
                                        setIsUserMenuOpen(!isUserMenuOpen);
                                    } else {
                                        router.push('/profile');
                                    }
                                }}
                                className={`hover:text-accent-orange transition-colors ${isUserMenuOpen ? 'text-accent-orange' : ''}`} 
                                aria-label="Profile Menu"
                            >
                                <UserRound size={22} className="stroke-[1.5]" />
                            </button>

                            {/* Floating Táctil Dropdown (Desktop Only) */}
                            {isUserMenuOpen && (
                                <>
                                    <div className="hidden md:block fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                    
                                    <div className="absolute right-0 top-full mt-4 w-48 bg-[#F2EFEB] border-[2px] border-[#16261A] hard-shadow hidden md:flex flex-col z-50">
                                        <Link 
                                            href="/profile" 
                                            className="px-4 py-3 font-bold uppercase text-xs text-[#16261A] border-b-[1.5px] border-[#16261A] hover:bg-[#16261A] hover:text-[#F2EFEB] transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Meu Perfil
                                        </Link>
                                        <Link 
                                            href="/profile" 
                                            className="px-4 py-3 font-bold uppercase text-xs text-[#16261A] border-b-[1.5px] border-[#16261A] hover:bg-[#16261A] hover:text-[#F2EFEB] transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Minhas Compras
                                        </Link>
                                        <button 
                                            className="px-4 py-3 font-bold uppercase text-xs text-red-500 border-b-[1.5px] border-[#16261A] hover:bg-red-500 hover:text-tactile-light transition-colors text-left w-full"
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                showToast("Logout será implementado em breve!");
                                            }}
                                        >
                                            Sair da Conta
                                        </button>
                                        <Link 
                                            href="/register" 
                                            className="px-4 py-3 font-bold uppercase text-xs text-accent-orange hover:bg-accent-orange hover:text-[#16261A] transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Cadastrar / Entrar
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Horizontal Scroll Categories / Pills - Táctil */}
                <div className="w-full overflow-x-auto no-scrollbar border-t-[1.5px] border-foreground bg-tactile-light">
                    <nav className="flex items-center gap-3 px-4 py-3 min-w-max">
                        {MOCK_CATEGORIES.map((category) => (
                            <HeaderNavButton key={category.id}>{category.name}</HeaderNavButton>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    );
}
