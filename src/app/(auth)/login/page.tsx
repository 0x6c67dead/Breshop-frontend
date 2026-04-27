"use client";

import { useMarketplaceStore, UserRole } from "@/src/shared/lib/store/marketplaceStore";
import { useRouter } from "next/navigation";
import { ShieldCheck, Store, User as UserIcon, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useMarketplaceStore();
  const router = useRouter();

  const handleLogin = (role: UserRole) => {
    login(role);
    router.push("/");
  };

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl border border-foreground/5 flex flex-col gap-10">
        <div className="text-center">
            <h1 className="text-4xl font-serif font-black italic tracking-tighter uppercase mb-2">Breshop.</h1>
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">Selecione seu perfil de acesso</p>
        </div>

        <div className="flex flex-col gap-4">
            <button 
                onClick={() => handleLogin('ADMIN')}
                className="group flex items-center justify-between p-6 bg-[#F4F0EB]/50 rounded-[24px] border border-transparent hover:border-foreground/10 hover:bg-white transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-serif font-black text-lg italic uppercase tracking-tighter">Administrador</span>
                        <span className="text-[9px] font-bold uppercase text-foreground/40">Gestão Global da Rede</span>
                    </div>
                </div>
                <ArrowRight size={16} className="text-foreground/20 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
                onClick={() => handleLogin('OWNER')}
                className="group flex items-center justify-between p-6 bg-[#F4F0EB]/50 rounded-[24px] border border-transparent hover:border-foreground/10 hover:bg-white transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center">
                        <Store size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-serif font-black text-lg italic uppercase tracking-tighter">Dono de Brechó</span>
                        <span className="text-[9px] font-bold uppercase text-foreground/40">Gestão de Peças e Vendas</span>
                    </div>
                </div>
                <ArrowRight size={16} className="text-foreground/20 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
                onClick={() => handleLogin('USER')}
                className="group flex items-center justify-between p-6 bg-[#F4F0EB]/50 rounded-[24px] border border-transparent hover:border-foreground/10 hover:bg-white transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center">
                        <UserIcon size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-serif font-black text-lg italic uppercase tracking-tighter">Garimpeiro</span>
                        <span className="text-[9px] font-bold uppercase text-foreground/40">Comprar e Favoritar Peças</span>
                    </div>
                </div>
                <ArrowRight size={16} className="text-foreground/20 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {user && (
            <div className="text-center pt-4 border-t border-foreground/5">
                <p className="font-mono text-[10px] text-foreground/40 uppercase">Logado como: <span className="text-foreground font-black">{user.name}</span></p>
            </div>
        )}
      </div>
    </main>
  );
}
