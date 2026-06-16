"use client";

import Link from 'next/link';
import { useToast } from './ui/Toast';

export default function Footer() {
    const { showToast } = useToast();

    const FOOTER_LINKS = [
        { id: 1, label: 'ABOUT', href: '/about', functional: false },
        { id: 2, label: 'FAQ', href: '/faq', functional: false },
        { id: 3, label: 'TERMS', href: '/terms', functional: false },
        { id: 4, label: 'CONTACT', href: '/contact', functional: false },
        { id: 5, label: 'SUPPORT', href: '/support', functional: true },
    ];

    return (
        <footer className="w-full bg-tactile-dark text-tactile-light border-t-[2px] border-tactile-dark py-12 px-4 md:px-8 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                
                {/* Brand Identity */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter">
                        Breshop
                    </h2>
                    <p className="max-w-xs font-semibold uppercase tracking-wider text-sm opacity-80">
                        CURATED THRIFT & VINTAGE, LOCALLY SOURCED.
                    </p>
                </div>

                {/* Navigation Blocks */}
                <div className="grid grid-cols-2 gap-12">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-accent-lime font-bold uppercase tracking-widest text-sm mb-2">Platform</h3>
                        {FOOTER_LINKS.map(link => (
                            <Link 
                                key={link.id} 
                                href={link.href}
                                prefetch={link.functional}
                                onClick={(e) => {
                                    if (!link.functional) {
                                        e.preventDefault();
                                        showToast("FUNCIONALIDADE EM DESENVOLVIMENTO!");
                                    }
                                }}
                                className="font-semibold uppercase text-sm hover:text-accent-orange transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
            
            <div className="w-full h-[1px] bg-tactile-light/20 my-8" />
            
            <div className="w-full text-center text-sm font-bold uppercase tracking-widest opacity-50">
                &copy; {new Date().getFullYear()} Breshop. All rights reserved.
            </div>
        </footer>
    );
}