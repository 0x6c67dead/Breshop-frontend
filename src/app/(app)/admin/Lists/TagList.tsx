'use client'
import { Tag } from "@/src/shared/types/Tag";
import { useEffect, useState } from "react";



export default function TagList() {
    const [nome, setNome] = useState('')
    const [atualizando, setAtualizando] = useState(false)

    function atualizarTag(pk: number, e: React.FormEvent) {
        e.preventDefault()
        fetch(`http://localhost:8000/tags/${pk}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ name: nome })
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
    function deleteTag(pk: number) {
        fetch(`http://localhost:8000/tags/${pk}/`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Tag não encontrada");
                return res.json()
            })
            .then(data => {
                setTags(prev => prev.filter(tag => tag.id !== pk))
            })
            .catch(error => console.log(error));
    }

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/tags/")
            .then((res) => res.json())
            .then((data) => setTags(data))
            .catch((error) => console.error(error))
    }, [])


    const Form = (pk: number, name: string) => {

        return (

            <form method={"PUT"} onSubmit={(e) => atualizarTag(pk, e)}>
                <div className="space-y-12 mt-5">
                    <div className="pb-12">
                        <h2 className="text-white text-xl font-bold">Atualizar Tag</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                            <div className="sm:col-span-3">
                                <label htmlFor="nome" className="block text-white">Nome</label>
                                <input type="text" name="nome" id="nome" placeholder={name}
                                    required
                                    onChange={(e) => setNome(e.target.value)}
                                    className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-x-2 px-2 py-1">
                        <div>
                            <input type="submit" value='Enviar' id="submit" name="submit" className="px-2 py-1 rounded-md bg-sky-600 font-bold cursor-pointer" />
                        </div>
                        <div>
                            <input type="reset" value='cancelar' id="reset" name="reset" formMethod="post"
                                onClick={() => setNome('')}
                                className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer" />
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    const tagView = (tag: Tag) => {
        return (
            <div key={tag.id} className="flex flex-col justify-between outline-white/20 outline-1 outline-offset-2 px-4 py-3 rounded-md bg-gray-800">
                <div className="flex justify-between">
                    <div className="flex gap-10">
                        <p>Id: {tag.id}</p>
                        <p>Name: {tag.name}</p>
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button onClick={() => setAtualizando(!atualizando)} className="px-2 py-1 rounded-md bg-sky-600 font-bold text-sm">Atualizar</button>
                        <button onClick={() => deleteTag(tag.id)} className="px-2 py-1 rounded-md bg-red-600 font-bold text-sm">Excluir</button>
                    </div>
                </div>
                <div>
                    {atualizando && (
                        Form(tag.id, tag.name)
                    )}
                </div>
            </div>
        )
    }


    return (
        <div className="space-y-12">
            <h2 className="text-white text-xl font-bold">Tag list</h2>

            <div className="flex flex-col gap-10">
                {tags.map((tag: any) => (
                    tagView(tag)
                ))}
            </div>
        </div>
    )
}