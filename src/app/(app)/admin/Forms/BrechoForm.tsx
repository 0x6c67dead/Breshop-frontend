import { useState } from "react"

export default function BrechoForm(){
    const [nome, setNome] = useState('')
    const [instagram, setInstagram] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [address_id, setAddress_id] = useState<number>()

    function limparCampos(){
        setNome('')
        setInstagram('')
        setEmail('')
        setTelefone('')
        setAddress_id(0)
    }

    function criarBrecho(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = {
            name: nome,
            email: email,
            instagram: instagram,
            phone: telefone,
            address: address_id,
        }
        console.log("Creating Brecho:", data);
        alert("Brechó criado com sucesso (Simulado)");
        limparCampos()
    }
    
    return(
        <form method="POST" onSubmit={criarBrecho} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">
                <div className="border-b border-foreground/10 pb-12">
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Novo Brechó.</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Registre um novo ponto de curadoria</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome do Brechó</label>
                            <input 
                                type="text" 
                                name="nome" 
                                id="nome" 
                                value={nome}
                                required 
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: Acervo 90s"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="instagram" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Instagram (Handle)</label>
                            <input 
                                type="text" 
                                name="instagram" 
                                id="instagram" 
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="@acervo90s"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">E-mail de Contato</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email}
                                required 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="contato@acervo90s.com"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="telefone" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Telefone (WhatsApp)</label>
                            <input 
                                type="text" 
                                name="telefone" 
                                id="telefone" 
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="11999999999"
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
                        Criar Brechó
                    </button>
                </div>
            </div>
    </form>
    )
}