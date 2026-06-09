import { useState } from "react"

export default function UserForm(){
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)

    function limparCampos(){
        setNome('')
        setEmail('')
        setAddress_id(0)
    }

     function criarUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = {
            name: nome,
            email: email,
            address: address_id,
        }
        console.log("Creating User:", data);
        // Mock success for MVP
        alert("Usuário criado com sucesso (Simulado)");
        limparCampos();
    }

    return(
        <form method="POST" onSubmit={criarUser} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">
                <div className="border-b border-foreground/10 pb-12">
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Novo Usuário.</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Cadastre um novo perfil na rede</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome Completo</label>
                            <input 
                                type="text" 
                                name="nome" 
                                id="nome" 
                                value={nome}
                                required 
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: João Silva"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">E-mail Corporativo</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email}
                                required 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="joao@breshop.com"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="Address_id" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">ID do Endereço</label>
                            <input 
                                type="number" 
                                name="Address_id" 
                                id="Address_id" 
                                value={address_id || ''}
                                required 
                                onChange={(e) => setAddress_id(e.target.valueAsNumber)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 pt-6">
                    <button 
                        type="button"
                        onClick={limparCampos}
                        className="px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border-2 border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-all"
                    >
                        cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="bg-foreground text-background px-12 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-xl"
                    >
                        Criar Usuário
                    </button>
                </div>
            </div>
    </form>
    )
}