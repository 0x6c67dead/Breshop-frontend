import { Tag } from "@/src/shared/types/Tag"
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

        const listOfTags = []

        if (tag01) listOfTags.push(tag01)
        if (tag02) listOfTags.push(tag02)
        if (tag03) listOfTags.push(tag03)

        const data = {
            name: nome,
            price: preco,
            brecho: brecho_id,
            listOfTags: listOfTags,
        }

        fetch('http://localhost:8000/products/', {
            method: 'POST',
            headers: {
                "Content-type": 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(async response => {
                const status = response.status
                const json = await response.json()
                return { status: status, json: json }
            })
            .then(({ status, json }) => {
                console.log("Json: ", json);
                console.log("Status: ", status);
                if (status == 201) {
                    limparCampos()
                }
            })
    }

    return (
        <form method="POST" onSubmit={criarProdutos}>
            <div className="space-y-12">
                <div className="border-b border-white/20 pb-12">
                    <h2 className="text-white text-xl font-bold">Informações Produto</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                        <div className="sm:col-span-3">
                            <label htmlFor="nome" className="block text-white">Nome</label>
                            <input type="text" name="nome" id="nome"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="preco" className="block text-white">Preço</label>
                            <input type="number" name="preco" id="preco" pattern="[0-9]+([.]?[0-9]{0,2})"
                                required
                                value={preco}
                                onChange={(e) => setPreco(e.target.valueAsNumber)}
                                className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="brecho_id" className="block text-white">Brecho_Id</label>
                            <input type="number" name="brecho_id" id="brecho_id"
                                required
                                value={brecho_id}
                                onChange={(e) => setBrecho_id(e.target.valueAsNumber)}
                                className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="tag01" className="block text-white">tag01_id</label>
                            <input type="number" name="tag01" id="tag01"
                                required
                                value={tag01}
                                onChange={(e) => setTag01(e.target.valueAsNumber)}
                                className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="tag02" className="block text-white">tag02_id</label>
                            <input type="number" name="tag02" id="tag02"
                                value={tag02}
                                onChange={(e) => setTag02(e.target.valueAsNumber)}
                                className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5" />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="tag03" className="block text-white">tag03_id</label>
                            <input type="number" name="tag03" id="tag03"
                                value={tag03}
                                onChange={(e) => setTag03(e.target.valueAsNumber)}
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
                            onClick={limparCampos}
                            className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer" />
                    </div>
                </div>
            </div>
        </form>
    )
}