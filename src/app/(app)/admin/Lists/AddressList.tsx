import { Address } from "@/src/shared/types/Address"
import { useEffect, useState } from "react"

export default function AddressList() {
    const [atualizando, setAtualizando] = useState(false)
    const [cep, setCep] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState<number>(0)


    function atualizarEndereco(pk: number, e: React.FormEvent) {
        e.preventDefault()
        fetch(`http://localhost:8000/addresses/${pk}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                cep: cep,
                state: state,
                city: city,
                street: street,
                number: number,
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

    function deleteAddress(pk: number) {
        fetch(`http://localhost:8000/addresses/${pk}/`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Address não encontrada");
                return res.json()
            })
            .then(data => {
                setAddresses(prev => prev.filter(address => address.id !== pk))
            })
            .catch(error => console.log(error));
    }


    const [addresses, setAddresses] = useState<Address[]>([])

    useEffect(() => {
        fetch('http://localhost:8000/addresses')
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(erro => console.log(erro))
    }, [])


    const Form = (pk: number, oldCep: string, oldState: string, oldCity: string, oldStreet: string, oldNumber: number) => {
        return (
            <form method="PUT" onSubmit={(e) => atualizarEndereco(pk, e)}>
                <div className="space-y-12 mt-5">
                    <div className="border-b border-white/20 pb-12">
                        <h2 className="text-white text-xl font-bold">Endereço</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                            <div className="sm:col-span-3">
                                <label htmlFor="cep" className="block text-white">CEP</label>
                                <input type="tel" name="cep" id="cep" inputMode="tel" maxLength={8} pattern="[0-9]{8}"
                                    placeholder={oldCep}
                                    required
                                    onChange={(e) => setCep(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="estado" className="block text-white">Estado</label>
                                <input type="text" name="estado" id="estado"
                                    placeholder={oldState}
                                    required
                                    onChange={(e) => setState(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="cidade" className="block text-white">Cidade</label>
                                <input type="text" name="cidade" id="cidade"
                                    placeholder={oldCity}
                                    required
                                    onChange={(e) => setCity(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="logradouro" className="block text-white">Logradouro</label>
                                <input type="text" name="logradouro" id="logradouro"
                                    placeholder={oldStreet}
                                    required
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="numero" className="block text-white">Numero</label>
                                <input type="number" inputMode="numeric" name="numero" id="numero"
                                    placeholder={oldNumber.toString()}
                                    required
                                    onChange={(e) => setNumber(e.target.valueAsNumber)}
                                    className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-x-2 px-2 py-1">
                        <div>
                            <input type="submit" value='Enviar' id="submit" name="submit" className="px-2 py-1 rounded-md bg-sky-600 font-bold cursor-pointer" />
                        </div>
                        <div>
                            <input type="reset" value='cancelar' id="reset" name="reset" className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer" />
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    const AddressView = (address: Address) => {
        return (
            <div key={address.id} className="flex justify-between outline-white/20 outline-1 outline-offset-2 px-4 py-3 rounded-md bg-gray-800">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between">
                        <div className="flex gap-10">
                            <p>Id: {address.id}</p>
                            <p>Estado: {address.state}</p>
                            <p>Cidade: {address.city}</p>
                        </div>
                        <div className="flex justify-center items-center gap-5">
                            <button onClick={() => setAtualizando(!atualizando)} className="px-2 py-1 rounded-md bg-sky-600 font-bold text-sm">Atualizar</button>
                            <button onClick={() => deleteAddress(address.id)} className="px-2 py-1 rounded-md bg-red-600 font-bold text-sm">Excluir</button>
                        </div>
                    </div>
                    {atualizando && (
                        Form(address.id, address.cep, address.state, address.city, address.street, address.number)
                    )}
                </div>
            </div>
        )
    }


    return (
        <div className="space-y-12">
            <h2 className="text-white text-xl font-bold">Endereço list</h2>

            <div className="flex flex-col gap-10">
                {addresses.map((address: any) => (
                    AddressView(address)
                ))}
            </div>
        </div>
    )
}