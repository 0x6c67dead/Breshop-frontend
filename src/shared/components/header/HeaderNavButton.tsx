import { useToast } from "@/src/shared/components/ui/Toast";

type buttonProps = {
    children: string
}

export default function HeaderNavButton({children}: buttonProps){
    const { showToast } = useToast();

    return(
        <button 
            onClick={() => showToast(`Categoria "${children}" em breve!`)}
            className="
                tag-pill 
                bg-tactile-light 
                px-2
                text-foreground
                border-[1.5px] border-foreground
                hover:bg-accent-lime
                transition-colors
                hard-shadow
                whitespace-nowrap
            "
        >
            {children}
        </button>
    )
}