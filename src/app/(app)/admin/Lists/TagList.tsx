'use client'
import { Tag } from "@/src/shared/types/Tag";
import { useEffect, useState } from "react";
import { Hash, Trash2, Edit3 } from "lucide-react";

export default function TagList() {
    const [nome, setNome] = useState('')
    const [atualizando, setAtualizando] = useState<number | null>(null)
    const [tags, setTags] = useState<Tag[]>([
        { id: 1, name: "vintage" },
        { id: 2, name: "archive" },
        { id: 3, name: "streetwear" },
        { id: 4, name: "luxury" }
    ]);

    function atualizarTag(pk: number, e: React.FormEvent) {
        e.preventDefault()
        setTags(prev => prev.map(t => t.id === pk ? { ...t, name: nome || t.name } : t))
        setAtualizando(null)
    }

    function deleteTag(pk: number) {
        setTags(prev => prev.filter(tag => tag.id !== pk))
    }

    const Form = (pk: number, name: string) => {
        return (
            <form method={"PUT"} onSubmit={(e) => atualizarTag(pk, e)} className="mt-6 p-6 bg-white/80 rounded-[24px] border border-foreground/10 shadow-inner flex gap-4 items-end">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome da Tag</label>
                    <input type="text" placeholder={name} onChange={(e) => setNome(e.target.value)}
                        className="w-full bg-white rounded-2xl px-6 py-3 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold" />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-foreground text-background px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-80 transition-all">
                        Salvar
                    </button>
                    <button type="button" onClick={() => setAtualizando(null)} className="px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest border border-foreground/10 hover:bg-foreground/5 transition-all text-foreground">
                        Cancelar
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Tags.</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mt-2">Categorias e taxonomias do sistema</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tags.map((tag: Tag) => (
                    <div key={tag.id} className="group bg-white rounded-[32px] p-8 transition-all border border-foreground/10 hover:border-foreground/30 shadow-md hover:shadow-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-accent-orange group-hover:text-white transition-all">
                                    <Hash size={20} />
                                </div>
                                <span className="font-serif font-black text-2xl italic tracking-tighter uppercase text-foreground">{tag.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setAtualizando(atualizando === tag.id ? null : tag.id)} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-foreground">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => deleteTag(tag.id)} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-foreground">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {atualizando === tag.id && Form(tag.id, tag.name)}
                    </div>
                ))}
            </div>
        </div>
    )
}