import { Brecho } from "./Brecho";
import { Tag } from "./Tag";

export interface Produto{
    id: number;
    nome: string,
    preco: number,
    brecho: Brecho,
    tags: Tag[],
}