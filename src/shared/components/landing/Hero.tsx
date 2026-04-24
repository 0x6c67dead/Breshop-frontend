
type heroProps = {
    img ?: string | "",
}

export default function Hero({img}: heroProps){
    const safeImg: string = img ?? '/assets/img-padrao-hero.jpg';

    return(
        <div className="relative w-full col-span-2 mb-15">
            
            <img src='/assets/img-padrao-hero.jpg' alt="imagem landing page" className="aspect-16/7 object-cover w-full opacity-70"/>
            
            <button className="
            absolute bottom-20 left-1/2 -translate-x-1/2 font-thin text-white text-4xl
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
                Explorar
            </button>
        </div>
    )
}