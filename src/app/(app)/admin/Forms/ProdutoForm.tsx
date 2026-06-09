import { useState } from "react"

export default function ProdutoForm() {
    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState<number>()
    const [brecho_id, setBrecho_id] = useState<number>()
    const [tag01, setTag01] = useState<number>()
    const [tag02, setTag02] = useState<number>()
    const [tag03, setTag03] = useState<number>()

    function limparCampos() {
        setNome('')
        setPreco(0)
        setBrecho_id(0)
        setTag01(0)
        setTag02(0)
        setTag03(0)
    }

    function criarProdutos(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = {
            name: nome,
            price: preco,
            brecho: brecho_id,
            tags: [tag01, tag02, tag03].filter(Boolean)
        }
        console.log("Creating Product:", data);
        alert("Produto criado com sucesso (Simulado)");
        limparCampos()
    }

    return (
        <form method="POST" onSubmit={criarProdutos} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">
                <div className="border-b border-foreground/10 pb-12">
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Novo Produto.</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Adicione uma peça ao inventário global</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome do Produto</label>
                            <input 
                                type="text" 
                                name="nome" 
                                id="nome"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="Ex: Jaqueta Vintage Nike"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="preco" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Preço (C$)</label>
                            <input 
                                type="number" 
                                name="preco" 
                                id="preco"
                                required
                                value={preco || ''}
                                onChange={(e) => setPreco(e.target.valueAsNumber)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="brecho_id" className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">ID do Brechó</label>
                            <input 
                                type="number" 
                                name="brecho_id" 
                                id="brecho_id"
                                required
                                value={brecho_id || ''}
                                onChange={(e) => setBrecho_id(e.target.valueAsNumber)}
                                className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/10 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm"
                                placeholder="ID do proprietário"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Categorias (Tags IDs)</label>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="number" placeholder="Tag 1" value={tag01 || ''} onChange={(e) => setTag01(e.target.valueAsNumber)} className="w-full bg-white rounded-xl px-4 py-3 border border-foreground/10 focus:border-foreground transition-all text-foreground font-bold text-sm shadow-sm" />
                                <input type="number" placeholder="Tag 2" value={tag02 || ''} onChange={(e) => setTag02(e.target.valueAsNumber)} className="w-full bg-white rounded-xl px-4 py-3 border border-foreground/10 focus:border-foreground transition-all text-foreground font-bold text-sm shadow-sm" />
                                <input type="number" placeholder="Tag 3" value={tag03 || ''} onChange={(e) => setTag03(e.target.valueAsNumber)} className="w-full bg-white rounded-xl px-4 py-3 border border-foreground/10 focus:border-foreground transition-all text-foreground font-bold text-sm shadow-sm" />
                            </div>
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
                        Salvar Produto
                    </button>
                </div>
            </div>
        </form>
    )
}