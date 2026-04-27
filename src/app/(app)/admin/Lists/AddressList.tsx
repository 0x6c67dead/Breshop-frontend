import { Address } from "@/src/shared/types/Address"
import { useEffect, useState } from "react"
import { MapPin, Trash2, Edit3, Navigation, Building } from "lucide-react"

export default function AddressList() {
    const [atualizando, setAtualizando] = useState<number | null>(null)
    const [cep, setCep] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState<number>(0)
    const [addresses, setAddresses] = useState<Address[]>([
        { id: 1, cep: "01310930", state: "SP", city: "São Paulo", street: "Avenida Paulista", number: 1578 },
        { id: 2, cep: "22041001", state: "RJ", city: "Rio de Janeiro", street: "Rua Figueiredo de Magalhães", number: 598 }
    ])

    function atualizarEndereco(pk: number, e: React.FormEvent) {
        e.preventDefault()
        setAddresses(prev => prev.map(a => a.id === pk ? { ...a, cep: cep || a.cep, state: state || a.state, city: city || a.city, street: street || a.street, number: number || a.number } : a))
        setAtualizando(null)
    }

    function deleteAddress(pk: number) {
        setAddresses(prev => prev.filter(address => address.id !== pk))
    }

    const Form = (pk: number, oldCep: string, oldState: string, oldCity: string, oldStreet: string, oldNumber: number) => {
        return (
            <form method="PUT" onSubmit={(e) => atualizarEndereco(pk, e)} className="mt-8 p-8 bg-white/80 rounded-[30px] border border-foreground/10 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">CEP</label>
                        <input type="text" placeholder={oldCep} onChange={(e) => setCep(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Estado</label>
                        <input type="text" placeholder={oldState} onChange={(e) => setState(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Cidade</label>
                        <input type="text" placeholder={oldCity} onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Logradouro</label>
                        <input type="text" placeholder={oldStreet} onChange={(e) => setStreet(e.target.value)}
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
                <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Endereços.</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mt-2">Logística e localizações da rede</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {addresses.map((address: Address) => (
                    <div key={address.id} className="group bg-white rounded-[32px] p-8 transition-all border border-foreground/10 hover:border-foreground/30 shadow-md hover:shadow-xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-accent-orange transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter uppercase text-foreground">{address.street}, {address.number}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{address.city} — {address.state}</span>
                                </div>
                            </div>

                            <div className="flex gap-8 flex-1 max-w-md justify-center">
                                <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
                                    <Navigation size={14} />
                                    <span className="text-[10px] font-bold uppercase">{address.cep}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
                                    <Building size={14} />
                                    <span className="text-[10px] font-bold uppercase">Sede</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button onClick={() => setAtualizando(atualizando === address.id ? null : address.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-foreground">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => deleteAddress(address.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-foreground">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {atualizando === address.id && Form(address.id, address.cep, address.state, address.city, address.street, address.number)}
                    </div>
                ))}
            </div>
        </div>
    )
}