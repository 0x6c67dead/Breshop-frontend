export interface Shop {
    id: string;
    name: string;
    location: string;
    avatar: string;
    description: string;
    stats: {
        products: number;
        followers: number;
        rating: number;
    };
    bannerUrl: string;
}

export interface Product {
    id: string;
    shopId: string;
    imageUrl: string;
    brand: string;
    model: string;
    price: number;
    size: string;
    condition: string;
    tags: string[];
    description: string;
}

export const MOCK_SHOPS: Shop[] = [
    {
        id: "shop-1",
        name: "Acervo 90s",
        location: "São Paulo, SP",
        avatar: "AC",
        description: "Especialistas em curadoria de luxo e streetwear dos anos 90. Peças raras e selecionadas a dedo.",
        stats: { products: 124, followers: 850, rating: 4.9 },
        bannerUrl: "https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-2",
        name: "Garimpo Solar",
        location: "Rio de Janeiro, RJ",
        avatar: "GS",
        description: "Peças leves, vintages solares e acessórios que contam histórias. O melhor do Rio.",
        stats: { products: 86, followers: 1200, rating: 4.8 },
        bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-3",
        name: "Brechó da Clara",
        location: "Curitiba, PR",
        avatar: "BC",
        description: "O closet dos sonhos. Roupas que transbordam personalidade e autenticidade.",
        stats: { products: 45, followers: 320, rating: 5.0 },
        bannerUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop"
    }
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "prod-1",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        brand: "Acne Studios",
        model: "Trench Coat Wool Blend",
        price: 450.00,
        size: "M",
        condition: "10/10",
        tags: ["vintage", "archive", "winter"],
        description: "Peça incrivelmente preservada da coleção de outono de 2018. Lã pesada perfeita para invernos rigorosos, caimento oversized brutal e estruturado."
    },
    {
        id: "prod-2",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
        brand: "Nike Vintage",
        model: "90s Track Jacket",
        price: 180.00,
        size: "L",
        condition: "9/10",
        tags: ["streetwear", "sportswear"],
        description: "Corta vento clássico dos anos 90, cores vibrantes e material resistente."
    },
    {
        id: "prod-3",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
        brand: "Levi's",
        model: "501 Made in USA",
        price: 220.00,
        size: "40",
        condition: "8/10",
        tags: ["denim", "classic"],
        description: "O jeans definitivo. Lavagem clara original e sem rasgos."
    },
    {
        id: "prod-4",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
        brand: "Carhartt WIP",
        model: "Detroit Jacket",
        price: 320.00,
        size: "XL",
        condition: "9/10",
        tags: ["workwear", "rugged"],
        description: "Jaqueta de lona resistente com gola de veludo cotelê. Estilo atemporal."
    },
    {
        id: "prod-5",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
        brand: "Issey Miyake",
        model: "Pleated Trousers",
        price: 580.00,
        size: "M",
        condition: "10/10",
        tags: ["designer", "avant-garde"],
        description: "Calça plissada icônica com textura única e caimento fluido."
    },
    {
        id: "prod-6",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
        brand: "Stüssy",
        model: "Graphic Tee",
        price: 120.00,
        size: "L",
        condition: "10/10",
        tags: ["streetwear", "skate"],
        description: "Camiseta com estampa clássica da marca, em algodão de alta qualidade."
    }
];
