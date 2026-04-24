import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col w-full gap-8">
            <div>
                <h1 className="text-4xl font-serif font-black uppercase mb-2">Recovery.</h1>
                <p className="text-foreground/70">Informe seu e-mail para recuperar o acesso.</p>
            </div>

            <form className="flex flex-col gap-6">
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

                <button 
                    type="submit"
                    className="w-full tag-pill bg-foreground text-tactile-light border-[2px] border-foreground hover:bg-accent-orange hover:text-tactile-dark hard-shadow mt-4 py-4 text-base"
                >
                    Enviar Link de Recuperação
                </button>
            </form>

            <div className="text-center mt-4">
                <p className="text-sm opacity-80">
                    Lembrou a senha? <Link href="/login" className="font-bold underline hover:text-accent-orange decoration-[1.5px]">Voltar para o Login</Link>
                </p>
            </div>
        </div>
    );
}
