import { User } from "@/src/shared/types/User";
import { useEffect, useState } from "react";

export default function UserList() {
    const [atualizando, setAtualizando] = useState(false)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)

    function atualizarUser(pk: number, e: React.FormEvent) {
        e.preventDefault()
        fetch(`http://localhost:8000/users/${pk}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                email: email,
                address: address_id,
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

    function deleteUser(pk: number) {
        fetch(`http://localhost:8000/users/${pk}/`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("user não encontrada");
                return res.json()
            })
            .then(data => {
                setUsers(prev => prev.filter(user => user.id !== pk))
            })
            .catch(error => console.log(error));
    }

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/users/")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error))
    }, [])


    const Form = (pk: number, oldName: string, oldEmail: string, oldAddress: number) => {

        return (
            <form method={"PUT"} onSubmit={(e) => atualizarUser(pk, e)}>
                <div className="space-y-12 mt-5">
                    <div className="border-b border-white/20 pb-12">
                        <h2 className="text-white text-xl font-bold">Informações Pessoais</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                            <div className="sm:col-span-4">
                                <label htmlFor="nome" className="block text-white">Nome</label>
                                <input type="text" name="nome" id="nome"
                                    placeholder={oldName}
                                    required
                                    onChange={(e) => setNome(e.target.value)}
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



    const UserView = (user: User) => {
        return (
            <div key={user.id} className="flex justify-between outline-white/20 outline-1 outline-offset-2 px-4 py-3 rounded-md bg-gray-800">
                <div className="flex flex-col w-full justify-between">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-10">
                                <p>Id: {user.id}</p>
                                <p>Name: {user.name}</p>
                            </div>
                            <div className="flex gap-10">
                                <p>Email: {user.email}</p>
                                <p>Endereço: {user.address}</p>
                            </div>
                        </div>
                        <div className="flex gap-5 justify-center items-center">
                            <button onClick={() => setAtualizando(!atualizando)} className="px-2 py-1 rounded-md bg-sky-600 font-bold text-sm">Atualizar</button>
                            <button onClick={() => deleteUser(user.id)} className="px-2 py-1 rounded-md bg-red-600 font-bold text-sm">Excluir</button>
                        </div>
                    </div>
                    {atualizando && (
                        Form(user.id, user.name, user.email, user.address ? user.address : 0)
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <h2 className="text-white text-xl font-bold">User list</h2>
            <div className="flex flex-col gap-5">
                {users.map((user: any) => (
                    UserView(user)
                ))}
            </div>
        </div>
    )
}
