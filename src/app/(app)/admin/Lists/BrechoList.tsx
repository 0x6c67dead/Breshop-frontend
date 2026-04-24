import { Brecho } from "@/src/shared/types/Brecho"
import { useEffect, useState } from "react"

export default function BrechoList() {
    const [atualizando, setAtualizando] = useState(false)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)
    const [instagram, setInstagram] = useState('')


    function atualizarBrecho(pk: number, e: React.FormEvent) {
        e.preventDefault()
        fetch(`http://localhost:8000/brechos/${pk}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                email: email,
                phone: phone,
                address: address_id,
                instagram: instagram,
            })
        })
            .then(async response => {
                const status = response.status
                const json = await response.json()
                return { status: status, json: json }
            })
            .then(({ status, json }) => {
                console.log("JSON: ", json)
                console.log("status: ", status)
            })
            .catch(error => console.log(error)
            )
    }


    function deleteBrecho(pk: number) {
        fetch(`http://localhost:8000/brechos/${pk}/`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("brecho não encontrada");
                return res.json()
            })
            .then(data => {
                setBrechos(prev => prev.filter(brecho => brecho.id !== pk))
            })
            .catch(error => console.log(error));
    }

    const [brechos, setBrechos] = useState<Brecho[]>([])

    useEffect(() => {
        fetch('http://localhost:8000/brechos')
            .then(response => response.json())
            .then(data => setBrechos(data))
            .catch(erro => console.log(erro))
    }, [])

    const Form = (pk: number, oldName: string, oldEmail: string, oldAddress: number, oldPhone: string, oldInstagram: string) => {
        return (
            <form method="PUT" onSubmit={(e) => atualizarBrecho(pk, e)}>
                <div className="space-y-12 mt-5">

                    <div className="border-b border-white/20 pb-12">
                        <h2 className="text-white text-xl font-bold">Brecho</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                            <div className="sm:col-span-3">
                                <label htmlFor="nome" className="block text-white">Nome</label>
                                <input type="text" name="nome" id="nome"
                                    placeholder={oldName}
                                    required
                                    onChange={(e) => setNome(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="instagram" className="block text-white">Instagram</label>
                                <input type="text" name="instagram" id="instagram" maxLength={30}
                                    placeholder={oldInstagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-white">Email</label>
                                <input type="email" name="email" id="email"
                                    placeholder={oldEmail}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="telefone" className="block text-white">Telefone</label>
                                <input type="text" name="telefone" id="telefone" pattern="[0-9]{11}"
                                    placeholder={oldPhone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="Address_id" className="block text-white">Address_id</label>
                                <input type="number" name="Address_id" id="Address_id"
                                    placeholder={oldAddress.toString()}
                                    required
                                    onChange={(e) => setAddress_id(e.target.valueAsNumber)}
                                    className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-x-2 px-2 py-1">
                        <div>
                            <input type="submit" value='Enviar' id="submit" name="submit" className="px-2 py-1 rounded-md bg-sky-600 font-bold cursor-pointer" />
                        </div>
                        <div>
                            <input type="reset" value='cancelar' id="reset" name="reset"
                                className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer" />
                        </div>
                    </div>
                </div>
            </form>
        )
    }


    const BrechoView = (brecho: Brecho) => {
        return (
            <div key={brecho.id} className="flex outline-white/20 outline-1 outline-offset-2 px-4 py-3 rounded-md bg-gray-800">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between">
                        <div className="flex gap-10">
                            <p>Id: {brecho.id}</p>
                            <p>Name: {brecho.name}</p>
                        </div>
                        <div className="flex justify-center items-center gap-5">
                            <button onClick={() => setAtualizando(!atualizando)} className="px-2 py-1 rounded-md bg-sky-600 font-bold text-sm">Atualizar</button>
                            <button onClick={() => deleteBrecho(brecho.id)} className="px-2 py-1 rounded-md bg-red-600 font-bold text-sm">Excluir</button>
                        </div>
                    </div>
                    {atualizando && (
                        Form(brecho.id, brecho.name, brecho.email,
                            brecho.address ? brecho.address : 0,
                            brecho.phone ? brecho.phone : '', brecho.instagram ? brecho.instagram : '')
                    )}
                </div>

            </div>
        )
    }

    return (
        <div className="space-y-12">
            <h2 className="text-white text-xl font-bold">Brecho list</h2>

            <div className="flex flex-col gap-10">
                {brechos.map((brecho: any) => (
                    BrechoView(brecho)
                ))}
            </div>
        </div>
    )
}