import { User } from "@/src/shared/types/User";
import { useEffect, useState } from "react";
import { Edit3, Trash2, User as UserIcon } from "lucide-react";
import { MOCK_USERS } from "@/src/shared/mocks/data";

export default function UserList() {
    const [atualizando, setAtualizando] = useState<number | null>(null)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)
    const [users, setUsers] = useState<User[]>(MOCK_USERS as any);

    function atualizarUser(pk: number, e: React.FormEvent) {
        e.preventDefault()
        // Mock update
        setUsers(prev => prev.map(u => u.id === pk ? { ...u, name: nome || u.name, email: email || u.email, address: address_id || u.address } : u))
        setAtualizando(null)
    }

    function deleteUser(pk: number) {
        setUsers(prev => prev.filter(user => user.id !== pk))
    }

    useEffect(() => {
        // Fetch disabled for MVP
    }, [])

    const Form = (pk: number, oldName: string, oldEmail: string, oldAddress: number) => {
        return (
            <form method={"PUT"} onSubmit={(e) => atualizarUser(pk, e)} className="mt-8 p-8 bg-white/80 rounded-[30px] border border-foreground/10 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Nome Completo</label>
                        <input type="text" placeholder={oldName} onChange={(e) => setNome(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">E-mail</label>
                        <input type="email" placeholder={oldEmail} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground px-2">Address ID</label>
                        <input type="number" placeholder={oldAddress.toString()} onChange={(e) => setAddress_id(e.target.valueAsNumber)}
                            className="w-full bg-white rounded-2xl px-6 py-4 border border-foreground/20 focus:outline-none focus:border-foreground transition-all text-foreground font-bold" />
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
                <h2 className="text-4xl font-serif font-black italic tracking-tighter uppercase text-foreground">Usuários.</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mt-2">Controle de acesso e perfis da rede</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {users.map((user: User) => (
                    <div key={user.id} className="group bg-white rounded-[32px] p-8 transition-all border border-foreground/10 hover:border-foreground/30 shadow-md hover:shadow-xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-accent-lime transition-all">
                                    <UserIcon size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif font-black text-2xl italic tracking-tighter uppercase text-foreground">{user.name}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{user.email}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button onClick={() => setAtualizando(atualizando === user.id ? null : user.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-foreground">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => deleteUser(user.id)} className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-foreground">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {atualizando === user.id && Form(user.id, user.name, user.email, user.address ? user.address : 0)}
                    </div>
                ))}
            </div>
        </div>
    )
}
