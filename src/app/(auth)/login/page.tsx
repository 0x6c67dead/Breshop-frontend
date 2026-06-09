"use client";

import { useState } from "react";
import { useMarketplaceStore } from "@/src/shared/lib/store/marketplaceStore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, ChevronDown } from "lucide-react";

const TEST_ACCOUNTS = [
  { label: "Admin", email: "admin@breshop.com", password: "admin123" },
  { label: "Acervo 90s (Owner)", email: "carlos@acervo90s.com", password: "owner123" },
  { label: "Garimpo Solar (Owner)", email: "lucia@garimpossolar.com", password: "owner123" },
  { label: "Relíquia Urbana (Owner)", email: "felix@reliquiaurbana.com", password: "owner123" },
  { label: "Vintage Carioca (Owner)", email: "ana@vintagecarioca.com", password: "owner123" },
  { label: "Ateliê Retrô (Owner)", email: "pedro@atelierretro.com", password: "owner123" },
  { label: "Clara (User)", email: "clara@gmail.com", password: "user123" },
  { label: "João (User)", email: "joao@gmail.com", password: "user123" },
  { label: "Maria (User)", email: "maria@gmail.com", password: "user123" },
];

export default function LoginPage() {
  const { login } = useMarketplaceStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccounts, setShowAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (acc: typeof TEST_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowAccounts(false);
    setError(null);
  };

  return (
    <main className="w-full min-h-screen bg-[#F4F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl border border-foreground/5 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-black italic tracking-tighter uppercase mb-2">
            Breshop.
          </h1>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40">
            Acesse sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-2xl border border-foreground/10 bg-[#F4F0EB]/50 font-mono text-sm focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/50">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 rounded-2xl border border-foreground/10 bg-[#F4F0EB]/50 font-mono text-sm focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-500 bg-red-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background rounded-2xl font-mono text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? (
              <span className="animate-pulse">Entrando...</span>
            ) : (
              <>
                <LogIn size={14} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Contas de teste */}
        <div className="border-t border-foreground/5 pt-4">
          <button
            onClick={() => setShowAccounts((v) => !v)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/30">
              Contas de teste
            </span>
            <ChevronDown
              size={12}
              className={`text-foreground/30 transition-transform ${showAccounts ? "rotate-180" : ""}`}
            />
          </button>

          {showAccounts && (
            <div className="mt-3 flex flex-col gap-1">
              {TEST_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillAccount(acc)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F0EB] transition-colors text-left"
                >
                  <span className="font-mono text-[10px] font-bold text-foreground/60">
                    {acc.label}
                  </span>
                  <span className="font-mono text-[9px] text-foreground/30">{acc.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
