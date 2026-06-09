import { useState } from "react"

export default function TagForm(){
    const [nome, setNome] = useState('')

    function criarTag(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        console.log("Creating Tag:", { name: nome });
        alert("Tag criada com sucesso (Simulado)");
        setNome('');
    }
    
    return(
        <form method="POST" onSubmit={(e) => criarTag(e)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">
                <div className="border-b border-foreground/10 pb-12">
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Nova Categoria.</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Defina uma nova taxonomia para o sistema</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome da Tag</label>
                            <input 
                                type="text" 
                                name="nome" 
                                id="nome" 
                                value={nome}
                                required 
                                onChange={(e) => setNome(e.target.value)} 
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: Streetwear, Minimalista, etc."
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 pt-6">
                    <button 
                        type="button"
                        onClick={() => setNome('')}
                        className="px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border-2 border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-all"
                    >
                        cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="bg-foreground text-background px-12 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-xl"
                    >
                        Criar Tag
                    </button>
                </div>
            </div>
    </form>
    )
}
