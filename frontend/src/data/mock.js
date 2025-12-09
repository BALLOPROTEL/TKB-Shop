// Mock data pour TKB'Shop (Tanou Karidja Ballo Shop)
export const mockProducts = [
  // Sacs à main
  {
    id: "1",
    name: "Sac à Main Élégant Noir",
    category: "sacs-a-main",
    subcategory: "sac-a-main",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1608060434411-0c3fa9049e7b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxoYW5kYmFnc3xlbnwwfHx8fDE3NTI5NTIzODl8MA&ixlib=rb-4.1.0&q=85",
    description: "Sac à main en cuir véritable avec finitions dorées. Parfait pour toutes vos occasions spéciales.",
    colors: ["Noir", "Marron", "Beige"],
    sizes: ["Petit", "Moyen", "Grand"],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2", 
    name: "Sac Bandoulière Rose",
    category: "sacs",
    subcategory: "sac-a-main",
    price: 65.99,
    originalPrice: 85.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    description: "Sac bandoulière compact et stylé, idéal pour vos sorties quotidiennes.",
    colors: ["Rose", "Blanc", "Noir"],
    sizes: ["Unique"],
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: "3",
    name: "Sac École Résistant",
    category: "sacs",
    subcategory: "sac-ecole", 
    price: 45.99,
    originalPrice: 60.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    description: "Sac d'école robuste avec compartiments organisés, parfait pour les étudiants.",
    colors: ["Bleu", "Noir", "Gris"],
    sizes: ["Grand"],
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: "4",
    name: "Sac Voyage Premium",
    category: "sacs",
    subcategory: "sac-voyage",
    price: 139.99,
    originalPrice: 180.00,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    description: "Grand sac de voyage avec roulettes, compartiments multiples et design élégant.",
    colors: ["Noir", "Marron", "Bleu marine"],
    sizes: ["Grand", "Extra Grand"],
    inStock: true,
    rating: 4.7,
    reviews: 92
  },

  // Chaussures hommes
  {
    id: "5",
    name: "Chaussures Classiques Homme",
    category: "chaussures",
    subcategory: "hommes",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    description: "Chaussures classiques en cuir pour homme, parfaites pour le bureau.",
    colors: ["Noir", "Marron", "Bordeaux"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    inStock: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: "6",
    name: "Baskets Sport Homme",
    category: "chaussures",
    subcategory: "hommes",
    price: 79.99,
    originalPrice: 100.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    description: "Baskets de sport confortables avec technologie de coussinets avancée.",
    colors: ["Blanc", "Noir", "Gris"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    inStock: true,
    rating: 4.6,
    reviews: 201
  },

  // Chaussures femmes
  {
    id: "7",
    name: "Escarpins Élégants Femme",
    category: "chaussures",
    subcategory: "femmes",
    price: 69.99,
    originalPrice: 90.00,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
    description: "Escarpins élégants à talons moyens, confort et style assurés.",
    colors: ["Noir", "Nude", "Rouge"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    inStock: true,
    rating: 4.7,
    reviews: 134
  },
  {
    id: "8",
    name: "Sandales Été Femme",
    category: "chaussures",
    subcategory: "femmes",
    price: 55.99,
    originalPrice: 75.00,
    image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500&h=500&fit=crop",
    description: "Sandales élégantes nude, parfaites pour l'été et les occasions spéciales.",
    colors: ["Nude", "Noir", "Blanc"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    inStock: false,
    rating: 4.3,
    reviews: 78
  },

  // Chaussures enfants
  {
    id: "9",
    name: "Baskets Enfant Colorées",
    category: "chaussures",
    subcategory: "enfants",
    price: 35.99,
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
    description: "Baskets colorées et ludiques pour enfants, confort optimal.",
    colors: ["Multicolore", "Rose", "Bleu"],
    sizes: ["28", "29", "30", "31", "32", "33", "34"],
    inStock: true,
    rating: 4.8,
    reviews: 245
  },
  {
    id: "10",
    name: "Chaussures École Enfant",
    category: "chaussures",
    subcategory: "enfants",
    price: 42.99,
    originalPrice: 55.00,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop",
    description: "Chaussures robustes pour l'école, cuir véritable et semelle antidérapante.",
    colors: ["Noir", "Marron"],
    sizes: ["28", "29", "30", "31", "32", "33", "34"],
    inStock: true,
    rating: 4.4,
    reviews: 167
  },

  // Chaussures bébé
  {
    id: "11",
    name: "Premières Chaussures Bébé",
    category: "chaussures",
    subcategory: "bebe",
    price: 28.99,
    originalPrice: 40.00,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&h=500&fit=crop",
    description: "Premières chaussures douces et flexibles pour les premiers pas.",
    colors: ["Rose", "Bleu", "Blanc"],
    sizes: ["16", "17", "18", "19", "20", "21"],
    inStock: true,
    rating: 4.9,
    reviews: 189
  },
  {
    id: "12",
    name: "Chaussons Bébé Antidérapants",
    category: "chaussures",
    subcategory: "bebe",
    price: 19.99,
    originalPrice: 25.00,
    image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&h=500&fit=crop",
    description: "Chaussons antidérapants en coton bio, parfaits pour la maison.",
    colors: ["Gris", "Rose", "Bleu ciel"],
    sizes: ["16", "17", "18", "19", "20"],
    inStock: true,
    rating: 4.6,
    reviews: 123
  },

  // Chaînes et bijoux
  {
    id: "13",
    name: "Chaîne Or 18 Carats",
    category: "bijoux",
    subcategory: "chaine-or",
    price: 299.99,
    originalPrice: 399.00,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw1fHxqZXdlbHJ5fGVufDB8fHx8MTc1ODg3OTYyNXww&ixlib=rb-4.1.0&q=85",
    description: "Chaîne en or 18 carats, maille forçat, longueur 50 cm. Bijou d'exception.",
    colors: ["Or"],
    sizes: ["50cm", "55cm", "60cm"],
    inStock: true,
    rating: 4.9,
    reviews: 87
  },
  {
    id: "14",
    name: "Chaîne Argent Élégante",
    category: "bijoux",
    subcategory: "chaine-argent",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    description: "Chaîne en argent 925 rhodié, brillance et élégance.",
    colors: ["Argent"],
    sizes: ["45cm", "50cm", "55cm"],
    inStock: true,
    rating: 4.7,
    reviews: 124
  },
  {
    id: "15",
    name: "Pendentif Coeur Diamant",
    category: "bijoux",
    subcategory: "pendentifs",
    price: 199.99,
    originalPrice: 250.00,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
    description: "Pendentif en forme de cœur serti de diamants, or blanc 18 carats.",
    colors: ["Or Blanc", "Or Jaune"],
    sizes: ["Unique"],
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: "16",
    name: "Chaîne Fantaisie Dorée",
    category: "bijoux",
    subcategory: "chaine-fantaisie",
    price: 45.99,
    originalPrice: 65.00,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    description: "Chaîne fantaisie dorée avec pendentif étoile, style moderne.",
    colors: ["Doré", "Argenté"],
    sizes: ["Unique"],
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: "17",
    name: "Bracelet Chaîne Or Rose",
    category: "bijoux",
    subcategory: "chaine-or",
    price: 159.99,
    originalPrice: 200.00,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
    description: "Bracelet chaîne en or rose 14 carats, maille gourmette fine.",
    colors: ["Or Rose"],
    sizes: ["17cm", "19cm", "21cm"],
    inStock: true,
    rating: 4.6,
    reviews: 72
  },
  {
    id: "18",
    name: "Collier Perles et Chaîne",
    category: "bijoux",
    subcategory: "pendentifs",
    price: 129.99,
    originalPrice: 170.00,
    image: "https://images.unsplash.com/photo-1589674781759-c0c8e5fc3067?w=500&h=500&fit=crop",
    description: "Collier élégant combinant perles d'eau douce et chaîne en or.",
    colors: ["Or", "Argent"],
    sizes: ["45cm", "50cm"],
    inStock: true,
    rating: 4.7,
    reviews: 98
  }
];

export const categories = [
  { id: "accueil", name: "Accueil", slug: "accueil" },
  { 
    id: "sacs", 
    name: "Sacs", 
    slug: "sacs",
    subcategories: [
      { id: "sac-a-main", name: "Sac à main", slug: "sac-a-main" },
      { id: "sac-ecole", name: "Sac école", slug: "sac-ecole" },
      { id: "sac-voyage", name: "Sac voyage", slug: "sac-voyage" },
      { id: "autres-sacs", name: "Autres", slug: "autres-sacs" }
    ]
  },
  { 
    id: "chaussures", 
    name: "Chaussures", 
    slug: "chaussures",
    subcategories: [
      { id: "hommes", name: "Hommes", slug: "hommes" },
      { id: "femmes", name: "Femmes", slug: "femmes" },
      { id: "enfants", name: "Enfants", slug: "enfants" },
      { id: "bebe", name: "Bébé", slug: "bebe" }
    ]
  },
  { 
    id: "chaine", 
    name: "Chaîne", 
    slug: "chaine",
    subcategories: [
      { id: "chaine-or", name: "Chaîne Or", slug: "chaine-or" },
      { id: "chaine-argent", name: "Chaîne Argent", slug: "chaine-argent" },
      { id: "chaine-fantaisie", name: "Chaîne Fantaisie", slug: "chaine-fantaisie" },
      { id: "pendentifs", name: "Pendentifs", slug: "pendentifs" }
    ]
  }
];

// Images pour le carousel hero
export const heroImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1608060434411-0c3fa9049e7b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxoYW5kYmFnc3xlbnwwfHx8fDE3NTI5NTIzODl8MA&ixlib=rb-4.1.0&q=85",
    title: "Sacs à main élégants",
    description: "Collection premium de sacs en cuir"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
    title: "Sacs tendance",
    description: "Styles modernes et colorés"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop",
    title: "Sacs de voyage",
    description: "Parfaits pour vos déplacements"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=600&fit=crop",
    title: "Accessoires de luxe",
    description: "Finitions dorées et argentées"
  }
];

// Mock cart data (sera géré par localStorage)
export const mockCart = [];

export const mockUser = {
  id: "user1",
  name: "Tanou Karidja Ballo",
  email: "tanou@tkbshop.com"
};

// Mock orders data for profile page
export const mockUserOrders = [
  {
    id: "CMD001",
    date: "2024-01-15",
    status: "delivered",
    total: 189.99,
    items: [
      { name: "Sac à Main Élégant Noir", quantity: 1, price: 89.99 },
      { name: "Pochette de Soirée Dorée", quantity: 1, price: 100.00 }
    ]
  },
  {
    id: "CMD002", 
    date: "2024-01-08",
    status: "processing",
    total: 95.99,
    items: [
      { name: "Bottes à Talons Marron", quantity: 1, price: 95.99 }
    ]
  },
  {
    id: "CMD003",
    date: "2023-12-20",
    status: "shipped",
    total: 135.98,
    items: [
      { name: "Baskets Enfant Colorées", quantity: 1, price: 35.99 },
      { name: "Sac École Rose", quantity: 1, price: 49.99 },
      { name: "Pochette de Soirée Dorée", quantity: 1, price: 50.00 }
    ]
  }
];