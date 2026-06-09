import { Brecho } from "@/src/shared/types/Brecho"
import { useEffect, useState } from "react"
import { MOCK_SHOPS } from "@/src/shared/mocks/data"
import { Store, Trash2, Edit3, Instagram, Phone, Mail } from "lucide-react"

export default function BrechoList() {
    const [atualizando, setAtualizando] = useState<number | null>(null)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)
    const [instagram, setInstagram] = useState('')
    const [brechos, setBrechos] = useState<any[]>(MOCK_SHOPS)

    function atualizarBrecho(pk: number, e: React.FormEvent) {
        e.preventDefault()
        setBrechos(prev => prev.map(b => b.id === pk ? { ...b, name: nome || b.name, email: email || b.email, phone: phone || b.phone, address: address_id || b.address, instagram: instagram || b.instagram } : b))
        setAtualizando(null)
    }

    function deleteBrecho(pk: string) {
        setBrechos(prev => prev.filter(brecho => brecho.id !== pk))
    }

    const Form = (pk: number, oldName: string, oldEmail: string, oldAddress: number, oldPhone: string, oldInstagram: string) => {
        return (
            <form method="PUT" onSubmit={(e) => atualizarBrecho(pk, e)} className="mt-8 p-8 bg-white/80 rounded-[30px] border border-foreground/10 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome do Brechó</label>
                        <input type="text" placeholder={oldName} onChange={(e) => setNome(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Instagram</label>
                        <input type="text" placeholder={oldInstagram} onChange={(e) => setInstagram(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">E-mail</label>
                        <input type="email" placeholder={oldEmail} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Telefone</label>
                        <input type="text" placeholder={oldPhone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button type="submit" className="bg-foreground text-background px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-80 transition-all shadow-lg">
                        Salvar Alterações
                    </button>
                    <button type="button" onClick={() => setAtualizando(null)} className="px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border-2 border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all">
                        Cancelar
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Brechós.</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mt-2">Gestão de parceiros e curadorias</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {brechos.map((brecho: any) => (
                    <div key={brecho.id} className="group bg-white rounded-[32px] p-8 transition-all border border-foreground/10 hover:border-foreground/30 shadow-md hover:shadow-xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-accent-lime transition-all">
                                    <Store size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter uppercase text-foreground">{brecho.name}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{brecho.location}</span>
                                </div>
                            </div>

                            <div className="flex gap-8 flex-1 max-w-md justify-center">
                                <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
                                    <Mail size={14} />
                                    <span className="text-[10px] font-bold uppercase">{brecho.email || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
                                    <Instagram size={14} />
                                    <span className="text-[10px] font-bold uppercase">@acervo</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button onClick={() => setAtualizando(atualizando === brecho.id ? null : brecho.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-foreground">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => deleteBrecho(brecho.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-foreground">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {atualizando === brecho.id && Form(brecho.id, brecho.name, brecho.email, 0, '', '')}
                    </div>
                ))}
            </div>
        </div>
    )
}