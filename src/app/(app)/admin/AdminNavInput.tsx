import { FormEventHandler } from "react"

type AdminNavInputProps = {
    grupo: string,
    children: string,
}

export default function AdminNavInput({grupo, children}: AdminNavInputProps){
    
    return(
        <div>

            <input 
                type="radio"
                id={children}
                name={grupo}
                className="peer hidden"
                >
            </input>
            <label 
            htmlFor={children} 
            className="
            flex justify-center items-center 
            aspect-5/2 w-20 rounded-sm 
            bg-white text-black 
            cursor-pointer

            peer-checked:text-sky-500
            peer-checked:font-bold
            peer-checked:outline-solid
            peer-checked:outline-offset-2
            peer-checked:outline-sky-500
            peer-checked:outline-2
            ">
                {children}
            </label>
        </div>
    )
}