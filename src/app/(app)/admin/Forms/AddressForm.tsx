import { useState } from "react"

export default function AddressForm(){

    const [ cep, setCep ] = useState('')
    const [ estado, setEstado ] = useState('')
    const [ cidade, setCidade ] = useState('')
    const [ logradouro, setLogradouro ] = useState('')
    const [ numero, setNumero ] = useState(0)


    function criarEndereco(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = {
            CEP: cep,
            state: estado,
            city: cidade,
            street: logradouro,
            number: numero,
        }
        console.log(JSON.stringify(data));
        

        fetch('http://localhost:8000/addresses/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            const status = response.status
            const json = await response.json()
            return{status: status, json: json}
        })
        .then(({status, json}) => {
            console.log("Status: ",status);
            console.log("JSON: ",json);
            if(status == 201){
                setCep('')
                setCidade('')
                setEstado('')
                setLogradouro('')
                setNumero(0)
            }
        })
        .catch(erro => console.log(erro))
    }



    return(
        <form method="POST" onSubmit={criarEndereco}>
            <div className="space-y-12">  
                <div className="border-b border-white/20 pb-12">
                    <h2 className="text-white text-xl font-bold">Endereço</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-6 mt-8 gap-x-6 gap-y-8">
                        <div className="sm:col-span-3">
                            <label htmlFor="cep" className="block text-white">CEP</label>
                            <input type="tel" name="cep" id="cep" inputMode="tel" maxLength={8} pattern="[0-9]{8}" 
                            value={cep}
                            required 
                            onChange={(e) => setCep(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="estado" className="block text-white">Estado</label>
                            <input type="text" name="estado" id="estado" 
                            value={estado}
                            required 
                            onChange={(e) => setEstado(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="cidade" className="block text-white">Cidade</label>
                            <input type="text" name="cidade" id="cidade" 
                            value={cidade}
                            required 
                            onChange={(e) => setCidade(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                        
                        <div className="sm:col-span-6">
                            <label htmlFor="logradouro" className="block text-white">Logradouro</label>
                            <input type="text" name="logradouro" id="logradouro" 
                            value={logradouro}
                            required 
                            onChange={(e) => setLogradouro(e.target.value)}
                            className="block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="numero" className="block text-white">Numero</label>
                            <input type="number" inputMode="numeric" name="numero" id="numero" 
                            value={numero}
                            required 
                            onChange={(e) => setNumero(e.target.valueAsNumber)}
                            className="[appearance:textfield] block w-full rounded-md mt-2 px-2 py-1 outline-white/20 -outline-offset-1 outline-1 bg-white/5"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row-reverse gap-x-2 px-2 py-1">
                    <div>
                        <input type="submit" value='Enviar' id="submit" name="submit" className="px-2 py-1 rounded-md bg-sky-600 font-bold cursor-pointer"/>
                    </div>
                    <div>
                        <input type="reset" value='cancelar' id="reset" name="reset" className="px-2 py-1 rounded-md bg-transparent font-bold cursor-pointer"/>
                    </div>
                </div>
            </div>
    </form>
    )
}