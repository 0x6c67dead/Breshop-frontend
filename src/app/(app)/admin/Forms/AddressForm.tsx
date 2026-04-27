import { useState } from "react"

export default function AddressForm(){
    const [ cep, setCep ] = useState('')
    const [ estado, setEstado ] = useState('')
    const [ cidade, setCidade ] = useState('')
    const [ logradouro, setLogradouro ] = useState('')
    const [ numero, setNumero ] = useState<number>()

    function limparCampos() {
        setCep('')
        setEstado('')
        setCidade('')
        setLogradouro('')
        setNumero(0)
    }

    function criarEndereco(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = {
            CEP: cep,
            state: estado,
            city: cidade,
            street: logradouro,
            number: numero,
        }
        console.log("Creating Address:", data);
        alert("Endereço criado com sucesso (Simulado)");
        limparCampos();
    }

    return(
        <form method="POST" onSubmit={criarEndereco} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">  
                <div className="border-b border-foreground/10 pb-12">
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Novo Endereço.</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Defina a localização para novos parceiros</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="cep" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">CEP</label>
                            <input 
                                type="text" 
                                name="cep" 
                                id="cep" 
                                maxLength={8}
                                value={cep}
                                required 
                                onChange={(e) => setCep(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="00000000"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="estado" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Estado (UF)</label>
                            <input 
                                type="text" 
                                name="estado" 
                                id="estado" 
                                value={estado}
                                required 
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: SP"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="cidade" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Cidade</label>
                            <input 
                                type="text" 
                                name="cidade" 
                                id="cidade" 
                                value={cidade}
                                required 
                                onChange={(e) => setCidade(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: São Paulo"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="numero" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Número</label>
                            <input 
                                type="number" 
                                name="numero" 
                                id="numero" 
                                value={numero || ''}
                                required 
                                onChange={(e) => setNumero(e.target.valueAsNumber)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="0"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="logradouro" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Logradouro / Rua</label>
                            <input 
                                type="text" 
                                name="logradouro" 
                                id="logradouro" 
                                value={logradouro}
                                required 
                                onChange={(e) => setLogradouro(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: Avenida Paulista"
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
                        Salvar Endereço
                    </button>
                </div>
            </div>
    </form>
    )
}