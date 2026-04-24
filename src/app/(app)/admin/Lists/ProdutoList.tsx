import { Brecho } from "@/src/shared/types/Brecho"
import { Produto } from "@/src/shared/types/Produto"
import { useEffect, useState } from "react"

export default function ProdutoList() {

    function deleteProduct(pk: number) {
        fetch(`http://localhost:8000/products/${pk}/`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("product não encontrada");
                return res.json()
            })
            .then(data => {
                setProdutos(prev => prev.filter(product => product.id !== pk))
            })
            .catch(error => console.log(error));
    }

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [brechos, setBrechos] = useState<Brecho[]>([])

    useEffect(() => {
        fetch('http://localhost:8000/products/')
            .then(response => response.json())
            .then(data => setProdutos(data))
            .catch(erro => console.log(erro))
    }, [])



    return (
        <div className="space-y-12">
            <h2 className="text-white text-xl font-bold">Produto list</h2>
            <div className="flex flex-col gap-5">
                {produtos.map((produto: any) => (
                    <div key={produto.id} className="flex justify-between outline-white/20 outline-1 outline-offset-2 px-4 py-3 rounded-md bg-gray-800">
                        <div className="flex gap-10">
                            <p>Id: {produto.id}</p>
                            <p>Name: {produto.name}</p>
                            <p>Brecho: {produto.brecho_id}</p>
                        </div>
                        <div className="flex justify-center items-center gap-5">
                            <button onClick={() => deleteProduct(produto.id)} className="px-2 py-1 rounded-md bg-red-600 font-bold text-sm">Excluir</button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}