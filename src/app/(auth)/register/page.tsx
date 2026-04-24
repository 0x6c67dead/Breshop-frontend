import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="flex flex-col w-full gap-8">
            <div>
                <h1 className="text-4xl font-serif font-black uppercase mb-2">Join the Club.</h1>
                <p className="text-foreground/70">Crie sua conta e encontre peças únicas.</p>
            </div>

            <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-wider" htmlFor="userName">
                        Nome Completo
                    </label>
                    <input 
                        type="text" 
                        id="userName"
                        name="fullName"
                        placeholder="Seu nome"
                        className="w-full bg-tactile-bg border-[1.5px] border-foreground px-4 py-3 placeholder:text-foreground/40 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-wider" htmlFor="userEmail">
                        E-mail
                    </label>
                    <input 
                        type="email" 
                        id="userEmail"
                        name="email"
                        placeholder="seu@email.com"
                        className="w-full bg-tactile-bg border-[1.5px] border-foreground px-4 py-3 placeholder:text-foreground/40 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-wider" htmlFor="userPassword">
                        Senha
                    </label>
                    <input 
                        type="password" 
                        id="userPassword"
                        name="password"
                        placeholder="••••••••"
                        className="w-full bg-tactile-bg border-[1.5px] border-foreground px-4 py-3 placeholder:text-foreground/40 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full tag-pill bg-foreground text-tactile-light border-[2px] border-foreground hover:bg-accent-orange hover:text-tactile-dark hard-shadow mt-4 py-4 text-base"
                >
                    Criar Conta
                </button>
            </form>

            <div className="text-center mt-4">
                <p className="text-sm opacity-80">
                    Já possui conta? <Link href="/login" className="font-bold underline hover:text-accent-orange decoration-[1.5px]">Fazer Login</Link>
                </p>
            </div>
        </div>
    );
}
