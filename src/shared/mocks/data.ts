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
    status: "AVAILABLE" | "RESERVED" | "SOLD" | "BLOCKED";
}

export const MOCK_SHOPS: Shop[] = [
    {
        id: "shop-1",
        name: "Acervo 90s",
        location: "São Paulo, SP",
        avatar: "AC",
        description: "Especialistas em curadoria de luxo e streetwear dos anos 90. Peças raras e selecionadas a dedo.",
        stats: { products: 124, followers: 850, rating: 4.9 },
        bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-2",
        name: "Garimpo Solar",
        location: "Rio de Janeiro, RJ",
        avatar: "GS",
        description: "Peças leves, vintages solares e acessórios que contam histórias. O melhor do Rio.",
        stats: { products: 86, followers: 1200, rating: 4.8 },
        bannerUrl: "https://images.unsplash.com/photo-1470309638588-29928bc3b5b1?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-3",
        name: "Relíquia Urbana",
        location: "Belo Horizonte, MG",
        avatar: "RU",
        description: "O closet dos sonhos urbanos. Roupas que transbordam personalidade e autenticidade da cena mineira.",
        stats: { products: 45, followers: 320, rating: 5.0 },
        bannerUrl: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=1200&auto=format&fit=crop"
    }
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "prod-1",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        brand: "Burberry Vintage",
        model: "Classic Trench Coat",
        price: 850,
        size: "M",
        condition: "10/10",
        tags: ["luxury", "vintage", "winter"],
        description: "Trench coat clássico em perfeito estado. Forro xadrez icônico e material impermeável.",
        status: "AVAILABLE"
    },
    {
        id: "prod-2",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
        brand: "Leather Archive",
        model: "Biker Jacket 80s",
        price: 420,
        size: "L",
        condition: "9/10",
        tags: ["leather", "vintage"],
        description: "Couro legítimo pesado com pátina natural do tempo. Peça única de acervo.",
        status: "AVAILABLE"
    },
    {
        id: "prod-3",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        brand: "Nike Retro",
        model: "Air Max Original",
        price: 320,
        size: "41",
        condition: "8/10",
        tags: ["sneakers", "classic"],
        description: "Edição de colecionador, pouco uso. Amortecimento intacto.",
        status: "AVAILABLE"
    },
    {
        id: "prod-4",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        brand: "Omega Vintage",
        model: "Classic Timepiece",
        price: 1200,
        size: "OS",
        condition: "9/10",
        tags: ["accessory", "luxury"],
        description: "Relógio mecânico revisado. Uma joia do tempo para colecionadores.",
        status: "AVAILABLE"
    },
    {
        id: "prod-5",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
        brand: "New Balance",
        model: "990 Heritage",
        price: 280,
        size: "42",
        condition: "10/10",
        tags: ["sneakers", "streetwear"],
        description: "O conforto definitivo em tons de cinza. Feito nos EUA.",
        status: "AVAILABLE"
    },
    {
        id: "prod-6",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
        brand: "Denim Co.",
        model: "Trucker Jacket",
        price: 150,
        size: "M",
        condition: "10/10",
        tags: ["denim", "workwear"],
        description: "Lavagem bruta que vai ganhar personalidade com o seu uso.",
        status: "AVAILABLE"
    },
    {
        id: "prod-7",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
        brand: "Prada Sport",
        model: "Tech Sneakers",
        price: 550,
        size: "40",
        condition: "9/10",
        tags: ["luxury", "minimalist"],
        description: "Design futurista e materiais premium. Conforto e status.",
        status: "AVAILABLE"
    },
    {
        id: "prod-8",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
        brand: "Ray-Ban",
        model: "Wayfarer 70s",
        price: 190,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "vintage"],
        description: "Lentes originais e armação em acetato impecável.",
        status: "AVAILABLE"
    },
    {
        id: "prod-9",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
        brand: "Rolex Vintage",
        model: "Oyster Datejust",
        price: 4500,
        size: "OS",
        condition: "9/10",
        tags: ["accessory", "luxury"],
        description: "Relógio clássico em aço e ouro. Um investimento atemporal.",
        status: "AVAILABLE"
    },
    {
        id: "prod-10",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        brand: "Silver Collective",
        model: "Heavy Chain",
        price: 240,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "streetwear"],
        description: "Corrente de prata 925 maciça com acabamento polido.",
        status: "AVAILABLE"
    },
    {
        id: "prod-11",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
        brand: "Eco Bag",
        model: "Canvas Tote XL",
        price: 45,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "minimalist"],
        description: "Bolsa de lona resistente para o dia a dia. Simples e funcional.",
        status: "AVAILABLE"
    },
    {
        id: "prod-12",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop",
        brand: "Wool & Co",
        model: "Checkered Scarf",
        price: 110,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "winter"],
        description: "Cachecol de lã pura com padronagem clássica. Macio e quente.",
        status: "AVAILABLE"
    },
    {
        id: "prod-13",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop",
        brand: "Urban Beanie",
        model: "Ribbed Knit Cap",
        price: 65,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "streetwear"],
        description: "Gorro de malha canelada. Essencial para o estilo urbano.",
        status: "AVAILABLE"
    },
    {
        id: "prod-14",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop",
        brand: "Craft Leather",
        model: "Tan Leather Belt",
        price: 85,
        size: "G",
        condition: "9/10",
        tags: ["accessory", "classic"],
        description: "Cinto de couro legítimo feito à mão. Fivela em latão envelhecido.",
        status: "AVAILABLE"
    },
    {
        id: "prod-15",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop",
        brand: "Classic Aviator",
        model: "Gold Frame Shades",
        price: 175,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "vintage"],
        description: "Óculos estilo aviador com armação dourada. Lentes com proteção UV.",
        status: "AVAILABLE"
    },
    {
        id: "prod-16",
        shopId: "shop-2",
        imageUrl: "https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?q=80&w=800&auto=format&fit=crop",
        brand: "Silk Road",
        model: "Floral Silk Scarf",
        price: 130,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "luxury"],
        description: "Lenço de seda pura com estampa floral vintage. Elegância absoluta.",
        status: "AVAILABLE"
    },
    {
        id: "prod-17",
        shopId: "shop-3",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
        brand: "Traveler",
        model: "Weekend Duffle",
        price: 320,
        size: "OS",
        condition: "9/10",
        tags: ["accessory", "travel"],
        description: "Mala de mão em lona encerada e detalhes em couro. Perfeita para viagens curtas.",
        status: "AVAILABLE"
    },
    {
        id: "prod-18",
        shopId: "shop-1",
        imageUrl: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop",
        brand: "Pin Master",
        model: "Retro Pin Set",
        price: 35,
        size: "OS",
        condition: "10/10",
        tags: ["accessory", "retro"],
        description: "Conjunto de 5 pins esmaltados com temática dos anos 80/90.",
        status: "AVAILABLE"
    }
];

export const MOCK_USERS = [
    { id: 1, name: "João Silva", email: "joao@example.com", address: 1 },
    { id: 2, name: "Maria Oliveira", email: "maria@example.com", address: 2 },
    { id: 3, name: "Admin Breshop", email: "admin@breshop.com", address: 3 }
];
