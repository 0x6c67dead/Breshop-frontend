import { useState } from "react"

export default function UserForm(){

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [address_id, setAddress_id] = useState<number>(0)

    function limparCampos(){
        setNome('')
        setEmail('')
        setAddress_id(0)
    }

     function criarUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = {
            name: nome,
            email: email,
            address: address_id,
        }
        console.log(JSON.stringify(data));
        
        fetch("http://localhost:8000/users/", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data) 
        })
        .then(async response => {
            const status = response.status
            const json = await response.json()
            return{status: status, json: json}
        })
        .then(({status, json}) => {
            console.log("JSON: ", json)
            console.log("status: ", status)
            if( status==201)
                limparCampos()
        })
        .catch(error => console.log(error)
        )
    }

    return(
        <form method="POST" onSubmit={criarUser}>
            <div className="space-y-12">
                <div className="border-b border-white/20 pb-12">
                    <h2 className="text-white text-xl font-bold">Informações Pessoais</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                        <div className="sm:col-span-4">
                            <label htmlFor="nome" className="block text-white">Nome</label>
                            <input type="text" name="nome" id="nome" 
                            value={nome}
                            required 
                            onChange={(e) => setNome(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-white">Email</label>
                            <input type="email" name="email" id="email" 
                            value={email}
                            required 
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="Address_id" className="block text-white">Address_id</label>
                            <input type="number" name="Address_id" id="Address_id" 
                            value={address_id}
                            required 
                            onChange={(e) => setAddress_id(e.target.valueAsNumber)}
                            className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row-reverse gap-x-2 px-2 py-1">
                    <div>
                        <input type="submit" value='Enviar' id="submit" name="submit" className="px-2 py-1 rounded-md bg-sky-600 font-bold cursor-pointer"/>
                    </div>
                    <div>
                        <input type="reset" value='cancelar' id="reset" name="reset" 
                        onClick={limparCampos}
                        className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer"/>
                    </div>
                </div>
            </div>
    </form>
    )
}