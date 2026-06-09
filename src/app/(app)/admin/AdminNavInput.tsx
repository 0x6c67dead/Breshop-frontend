type AdminNavInputProps = {
    grupo: string,
    children: string,
    checked?: boolean
}

export default function AdminNavInput({grupo, children, checked}: AdminNavInputProps){
    return(
        <div className="w-full">
            <input 
                type="radio"
                id={`${grupo}-${children}`}
                name={grupo}
                className="peer hidden"
                defaultChecked={checked}
            />
            <label 
                htmlFor={`${grupo}-${children}`} 
                className="
                flex items-center gap-3
                w-full py-4 px-6
                bg-white/40 rounded-2xl
                text-foreground/60 font-black uppercase text-[10px] tracking-widest
                cursor-pointer transition-all border border-foreground/5
                hover:bg-white/60
                peer-checked:bg-foreground
                peer-checked:text-background
                peer-checked:border-foreground
                peer-checked:shadow-lg
                "
            >
                <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                {children}
            </label>
        </div>
    )
}