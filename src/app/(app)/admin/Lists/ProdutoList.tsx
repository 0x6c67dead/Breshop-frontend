import { Produto } from "@/src/shared/types/Produto"
import { useEffect, useState } from "react"
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/src/shared/mocks/data"
import { Package, Trash2 } from "lucide-react"

export default function ProdutoList() {
    const [produtos, setProdutos] = useState<any[]>(MOCK_PRODUCTS)

    function deleteProduct(pk: string) {
        setProdutos(prev => prev.filter(product => product.id !== pk))
    }

    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Produtos.</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mt-2">Gestão de inventário global</p>
            </header>

            <div className="flex flex-col gap-6">
                {produtos.length === 0 ? (
                    <div className="p-20 bg-white rounded-[40px] border-2 border-dashed border-foreground/10 text-center text-foreground/20 font-serif italic text-2xl">
                        Nenhum produto em estoque.
                    </div>
                ) : (
                    produtos.map((produto) => {
                        const shop = MOCK_SHOPS.find(s => s.id === produto.shopId);
                        return (
                            <div key={produto.id} className="group bg-white rounded-[32px] p-8 transition-all border border-foreground/10 hover:border-foreground/30 shadow-md hover:shadow-xl">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-foreground/5 overflow-hidden border border-foreground/10">
                                            <img src={produto.imageUrl} alt={produto.brand} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-serif font-black text-2xl italic tracking-tighter uppercase text-foreground">{produto.brand}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{produto.model}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 max-w-xl">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Preço</span>
                                            <span className="font-serif font-black italic text-xl text-foreground">C$ {produto.price}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Brechó</span>
                                            <span className="font-bold text-sm text-foreground">{shop?.name || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Status</span>
                                            <span className="text-[10px] font-black uppercase bg-accent-lime px-2 py-1 rounded w-max text-foreground">{produto.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => deleteProduct(produto.id)} 
                                            className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-foreground"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}