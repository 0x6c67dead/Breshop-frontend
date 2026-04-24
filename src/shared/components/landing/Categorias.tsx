
type categoriasProps = {
    img?: string,
    categoria: string,
}

export default function Categoria({img, categoria}: categoriasProps){
    return(
        <div className="relative flex items-center justify-center">
            
            <img src={img} alt="imagem de categoria" className="opacity-70 w-full h-325"/>

            <div className="absolute text-left bottom-20 left-10">
                <h2 className="text-6xl">Peças para {categoria}</h2>
                <button className="
                relative text-white text-2xl
                hover:after:scale-x-120

                after:content-['']
                after:absolute
                after:bottom-0
                after:left-1/2
                after:-translate-x-1/2
                after:w-full
                after:h-[1px]
                after:bg-white
                after:origin-center
                after:transition
                after:duration-200
                ">
                    ver mais
                </button>
            </div>
        </div>
    )
}