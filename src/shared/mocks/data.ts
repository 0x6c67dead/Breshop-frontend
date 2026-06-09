export interface Shop {
    id: string;
    name: string;
    location: string;
    avatar: string;
    description: string;
    stats: { products: number; followers: number; rating: number };
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
        id: "shop-1", name: "Acervo 90s", location: "São Paulo, SP", avatar: "AC",
        description: "Especialistas em curadoria de luxo e streetwear dos anos 90. Peças raras e selecionadas a dedo.",
        stats: { products: 124, followers: 850, rating: 4.9 },
        bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-2", name: "Garimpo Solar", location: "Rio de Janeiro, RJ", avatar: "GS",
        description: "Peças leves, vintages solares e acessórios que contam histórias. O melhor do Rio.",
        stats: { products: 86, followers: 1200, rating: 4.8 },
        bannerUrl: "https://images.unsplash.com/photo-1470309638588-29928bc3b5b1?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-3", name: "Relíquia Urbana", location: "Belo Horizonte, MG", avatar: "RU",
        description: "O closet dos sonhos urbanos. Roupas que transbordam personalidade e autenticidade da cena mineira.",
        stats: { products: 45, followers: 320, rating: 5.0 },
        bannerUrl: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-4", name: "Vintage Carioca", location: "Rio de Janeiro, RJ", avatar: "VC",
        description: "Moda carioca com alma vintage. Do Leblon ao Lapa, cada peça tem uma história para contar.",
        stats: { products: 68, followers: 540, rating: 4.7 },
        bannerUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "shop-5", name: "Ateliê Retrô", location: "Curitiba, PR", avatar: "AR",
        description: "Streetwear premium e peças de colecionador. Para quem leva moda a sério.",
        stats: { products: 92, followers: 2100, rating: 4.9 },
        bannerUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
    },
];

export const MOCK_PRODUCTS: Product[] = [
    // Acervo 90s (shop-1) — 10 itens
    { id: "prod-1", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", brand: "Burberry", model: "Classic Trench Coat", price: 850, size: "M", condition: "10/10", tags: ["luxury", "vintage", "winter"], description: "Trench coat clássico em perfeito estado. Forro xadrez icônico e material impermeável.", status: "AVAILABLE" },
    { id: "prod-3", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", brand: "Nike Retro", model: "Air Max Original", price: 320, size: "41", condition: "8/10", tags: ["sneakers", "classic"], description: "Edição de colecionador, pouco uso. Amortecimento intacto.", status: "AVAILABLE" },
    { id: "prod-7", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop", brand: "Prada Sport", model: "Tech Sneakers", price: 550, size: "40", condition: "9/10", tags: ["luxury", "minimalist"], description: "Design futurista e materiais premium. Conforto e status.", status: "AVAILABLE" },
    { id: "prod-9", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", brand: "Rolex Vintage", model: "Oyster Datejust", price: 4500, size: "OS", condition: "9/10", tags: ["accessory", "luxury"], description: "Relógio clássico em aço e ouro. Um investimento atemporal.", status: "AVAILABLE" },
    { id: "prod-12", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop", brand: "Wool & Co", model: "Checkered Scarf", price: 110, size: "OS", condition: "10/10", tags: ["accessory", "winter"], description: "Cachecol de lã pura com padronagem clássica. Macio e quente.", status: "AVAILABLE" },
    { id: "prod-15", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop", brand: "Classic Aviator", model: "Gold Frame Shades", price: 175, size: "OS", condition: "10/10", tags: ["accessory", "vintage"], description: "Óculos estilo aviador com armação dourada. Lentes com proteção UV.", status: "AVAILABLE" },
    { id: "prod-18", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop", brand: "Pin Master", model: "Retro Pin Set", price: 35, size: "OS", condition: "10/10", tags: ["accessory", "retro"], description: "Conjunto de 5 pins esmaltados com temática dos anos 80/90.", status: "AVAILABLE" },
    { id: "prod-19", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", brand: "Levi's", model: "501 Original Denim", price: 220, size: "32x32", condition: "9/10", tags: ["denim", "classic"], description: "O jeans que definiu gerações. Lavagem vintage autêntica.", status: "AVAILABLE" },
    { id: "prod-20", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=800&auto=format&fit=crop", brand: "Ralph Lauren", model: "Polo Vintage", price: 145, size: "M", condition: "9/10", tags: ["preppy", "classic"], description: "O polo que nunca sai de moda. Bordado original em perfeito estado.", status: "AVAILABLE" },
    { id: "prod-21", shopId: "shop-1", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", brand: "Champion", model: "Hoodie 90s Archive", price: 190, size: "L", condition: "9/10", tags: ["streetwear", "vintage"], description: "Moletom de acervo com logo bordado original. Peso pesado.", status: "AVAILABLE" },

    // Garimpo Solar (shop-2) — 10 itens
    { id: "prod-2", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop", brand: "Leather Archive", model: "Biker Jacket 80s", price: 420, size: "L", condition: "9/10", tags: ["leather", "vintage"], description: "Couro legítimo pesado com pátina natural do tempo. Peça única de acervo.", status: "AVAILABLE" },
    { id: "prod-5", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop", brand: "New Balance", model: "990 Heritage", price: 280, size: "42", condition: "10/10", tags: ["sneakers", "streetwear"], description: "O conforto definitivo em tons de cinza. Feito nos EUA.", status: "AVAILABLE" },
    { id: "prod-8", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", brand: "Ray-Ban", model: "Wayfarer 70s", price: 190, size: "OS", condition: "10/10", tags: ["accessory", "vintage"], description: "Lentes originais e armação em acetato impecável.", status: "AVAILABLE" },
    { id: "prod-10", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", brand: "Silver Collective", model: "Heavy Chain", price: 240, size: "OS", condition: "10/10", tags: ["accessory", "streetwear"], description: "Corrente de prata 925 maciça com acabamento polido.", status: "AVAILABLE" },
    { id: "prod-13", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop", brand: "Urban Beanie", model: "Ribbed Knit Cap", price: 65, size: "OS", condition: "10/10", tags: ["accessory", "streetwear"], description: "Gorro de malha canelada. Essencial para o estilo urbano.", status: "AVAILABLE" },
    { id: "prod-16", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?q=80&w=800&auto=format&fit=crop", brand: "Silk Road", model: "Floral Silk Scarf", price: 130, size: "OS", condition: "10/10", tags: ["accessory", "luxury"], description: "Lenço de seda pura com estampa floral vintage. Elegância absoluta.", status: "AVAILABLE" },
    { id: "prod-22", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", brand: "Adidas Originals", model: "Windbreaker", price: 310, size: "M", condition: "9/10", tags: ["streetwear", "vintage"], description: "Corta-vento original com três listras. Ícone do esporte.", status: "AVAILABLE" },
    { id: "prod-23", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=800&auto=format&fit=crop", brand: "Converse", model: "Chuck Taylor All Star", price: 160, size: "39", condition: "9/10", tags: ["sneakers", "classic"], description: "O tênis mais democrático da história. Lona original.", status: "AVAILABLE" },
    { id: "prod-24", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", brand: "Fila", model: "Disruptor Chunky", price: 195, size: "40", condition: "10/10", tags: ["sneakers", "90s"], description: "A sola chunky que voltou com tudo. Branco imaculado.", status: "AVAILABLE" },
    { id: "prod-25", shopId: "shop-2", imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop", brand: "Tommy Hilfiger", model: "Flag Tee Vintage", price: 95, size: "G", condition: "8/10", tags: ["preppy", "vintage"], description: "A camiseta com flag icônica dos anos 90. Algodão pesado.", status: "AVAILABLE" },

    // Relíquia Urbana (shop-3) — 10 itens
    { id: "prod-4", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", brand: "Omega Vintage", model: "Classic Timepiece", price: 1200, size: "OS", condition: "9/10", tags: ["accessory", "luxury"], description: "Relógio mecânico revisado. Uma joia do tempo para colecionadores.", status: "AVAILABLE" },
    { id: "prod-6", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", brand: "Denim Co.", model: "Trucker Jacket", price: 150, size: "M", condition: "10/10", tags: ["denim", "workwear"], description: "Lavagem bruta que vai ganhar personalidade com o seu uso.", status: "AVAILABLE" },
    { id: "prod-11", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop", brand: "Eco Bag", model: "Canvas Tote XL", price: 45, size: "OS", condition: "10/10", tags: ["accessory", "minimalist"], description: "Bolsa de lona resistente para o dia a dia. Simples e funcional.", status: "AVAILABLE" },
    { id: "prod-14", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop", brand: "Craft Leather", model: "Tan Leather Belt", price: 85, size: "G", condition: "9/10", tags: ["accessory", "classic"], description: "Cinto de couro legítimo feito à mão. Fivela em latão envelhecido.", status: "AVAILABLE" },
    { id: "prod-17", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop", brand: "Traveler", model: "Weekend Duffle", price: 320, size: "OS", condition: "9/10", tags: ["accessory", "travel"], description: "Mala de mão em lona encerada e detalhes em couro. Perfeita para viagens curtas.", status: "AVAILABLE" },
    { id: "prod-26", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", brand: "Dickies", model: "Cargo Worker Pants", price: 175, size: "34x30", condition: "9/10", tags: ["workwear", "streetwear"], description: "Cargo original com reforço nas costuras. Estilo operário.", status: "AVAILABLE" },
    { id: "prod-27", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop", brand: "Vans", model: "Old Skool Classic", price: 210, size: "41", condition: "9/10", tags: ["sneakers", "skate"], description: "A listra lateral que fundou uma era. Camurça e lona.", status: "AVAILABLE" },
    { id: "prod-28", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", brand: "Timberland", model: "6-Inch Boot Vintage", price: 390, size: "43", condition: "8/10", tags: ["boots", "workwear"], description: "O bota amarela original. Couro waterproof envelhecido.", status: "AVAILABLE" },
    { id: "prod-29", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", brand: "Carhartt", model: "Work Jacket Washed", price: 285, size: "L", condition: "9/10", tags: ["workwear", "denim"], description: "A jaqueta de trabalho americana. Resistência e estilo.", status: "AVAILABLE" },
    { id: "prod-30", shopId: "shop-3", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", brand: "Fossil", model: "Leather Minimalist Watch", price: 340, size: "OS", condition: "9/10", tags: ["accessory", "minimalist"], description: "Relógio com pulseira de couro legítimo. Elegância sem exageros.", status: "AVAILABLE" },

    // Vintage Carioca (shop-4) — 10 itens
    { id: "prod-31", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop", brand: "Havaianas", model: "Special Edition", price: 55, size: "38", condition: "10/10", tags: ["beach", "carioca"], description: "Edição especial com estampa exclusiva. Brasil puro.", status: "AVAILABLE" },
    { id: "prod-32", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", brand: "Osklen", model: "Ipanema Linen Shirt", price: 280, size: "M", condition: "10/10", tags: ["beach", "luxury"], description: "Camisa de linho da coleção Ipanema. Leveza e sofisticação.", status: "AVAILABLE" },
    { id: "prod-33", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=800&auto=format&fit=crop", brand: "Redley", model: "Surf Board Short", price: 120, size: "M", condition: "9/10", tags: ["beach", "surf"], description: "Bermuda de surf com tecnologia dry fast. Rio de Janeiro vibe.", status: "AVAILABLE" },
    { id: "prod-34", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", brand: "Reserva", model: "Slim Chino Pants", price: 195, size: "40", condition: "9/10", tags: ["casual", "classic"], description: "O chino mais bonito do Brasil. Caimento perfeito.", status: "AVAILABLE" },
    { id: "prod-35", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", brand: "Farm Rio", model: "Floral Maxi Dress", price: 350, size: "P", condition: "10/10", tags: ["beach", "floral"], description: "O vestido mais brasileiro da história. Estampa exclusiva.", status: "AVAILABLE" },
    { id: "prod-36", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", brand: "Mizuno", model: "Wave Creation Running", price: 265, size: "42", condition: "9/10", tags: ["sneakers", "running"], description: "Performance japonesa. Amortecimento Wave original.", status: "AVAILABLE" },
    { id: "prod-37", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", brand: "Arezzo", model: "Couro Ankle Boot", price: 430, size: "36", condition: "9/10", tags: ["boots", "luxury"], description: "Ankle boot em couro legítimo. Design brasileiro de alto nível.", status: "AVAILABLE" },
    { id: "prod-38", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop", brand: "Hering", model: "Camiseta Básica Pack", price: 75, size: "G", condition: "10/10", tags: ["basic", "cotton"], description: "A camiseta do Brasil. 100% algodão, caimento perfeito.", status: "AVAILABLE" },
    { id: "prod-39", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop", brand: "Colcci", model: "Bolsa Couro Mini", price: 310, size: "OS", condition: "9/10", tags: ["accessory", "luxury"], description: "Mini bolsa em couro legítimo. Elegância compacta.", status: "AVAILABLE" },
    { id: "prod-40", shopId: "shop-4", imageUrl: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=800&auto=format&fit=crop", brand: "Lacoste", model: "Polo Piquê Heritage", price: 240, size: "L", condition: "9/10", tags: ["preppy", "classic"], description: "O crocodilo original. Piquê francês autêntico.", status: "AVAILABLE" },

    // Ateliê Retrô (shop-5) — 10 itens
    { id: "prod-41", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", brand: "Casablanca", model: "Silk Track Jacket", price: 680, size: "M", condition: "9/10", tags: ["luxury", "streetwear"], description: "Jaqueta track de seda com print exclusivo. Luxo casual.", status: "AVAILABLE" },
    { id: "prod-42", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", brand: "Stüssy", model: "8-Ball Fleece", price: 390, size: "L", condition: "9/10", tags: ["streetwear", "90s"], description: "O fleece com 8-Ball icônico. Streetwear raíz.", status: "AVAILABLE" },
    { id: "prod-43", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop", brand: "Supreme", model: "Box Logo Tee", price: 520, size: "M", condition: "9/10", tags: ["streetwear", "hype"], description: "O box logo que iniciou o hype. Autenticidade verificada.", status: "AVAILABLE" },
    { id: "prod-44", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", brand: "Palace", model: "Tri-Ferg Longsleeve", price: 295, size: "L", condition: "10/10", tags: ["streetwear", "skate"], description: "O tri-ferg em manga longa. London skate culture.", status: "AVAILABLE" },
    { id: "prod-45", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", brand: "Kith", model: "Classics Crew Sweat", price: 340, size: "M", condition: "10/10", tags: ["streetwear", "luxury"], description: "Moletom Kith sem capuz. Algodão pesado premium.", status: "AVAILABLE" },
    { id: "prod-46", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop", brand: "Off-White", model: "Industrial Belt", price: 185, size: "OS", condition: "9/10", tags: ["accessory", "streetwear"], description: "O cinto industrial que virou ícone. Fivela dupla original.", status: "AVAILABLE" },
    { id: "prod-47", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", brand: "Jordan", model: "1 Retro High OG", price: 950, size: "42", condition: "8/10", tags: ["sneakers", "hype"], description: "O Air Jordan 1 que iniciou tudo. Colorway clássico.", status: "AVAILABLE" },
    { id: "prod-48", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop", brand: "Yeezy", model: "Foam Runner Natural", price: 780, size: "41", condition: "9/10", tags: ["sneakers", "hype"], description: "O Foam Runner na colorway Natural. Futuro do calçado.", status: "AVAILABLE" },
    { id: "prod-49", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", brand: "Carhartt WIP", model: "Detroit Jacket", price: 460, size: "L", condition: "9/10", tags: ["workwear", "streetwear"], description: "Detroit Jacket em blanket liner. Frio não passa.", status: "AVAILABLE" },
    { id: "prod-50", shopId: "shop-5", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", brand: "Dickies", model: "Double Knee Pants", price: 210, size: "32x30", condition: "10/10", tags: ["workwear", "streetwear"], description: "O duplo joelho que não rasga nunca. Resistência máxima.", status: "AVAILABLE" },
];

export const MOCK_USERS = [
    { id: "usr-user-1", name: "Clara Vintage", email: "clara@gmail.com" },
    { id: "usr-user-2", name: "João Silva", email: "joao@gmail.com" },
    { id: "usr-user-3", name: "Maria Oliveira", email: "maria@gmail.com" },
];
