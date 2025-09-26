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