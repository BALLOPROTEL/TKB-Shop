// Mock data pour le site e-commerce
export const mockProducts = [
  // Sacs à main
  {
    id: "1",
    name: "Sac à Main Élégant Noir",
    category: "sacs-a-main",
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
    category: "sacs-a-main",
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
    name: "Sac Tote Minimaliste",
    category: "sacs-a-main", 
    price: 45.99,
    originalPrice: 60.00,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    description: "Grand sac tote en toile robuste, parfait pour le travail ou les courses.",
    colors: ["Beige", "Noir", "Gris"],
    sizes: ["Grand"],
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: "4",
    name: "Pochette de Soirée Dorée",
    category: "sacs-a-main",
    price: 39.99,
    originalPrice: 55.00,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop",
    description: "Élégante pochette dorée avec chaîne, parfaite pour vos soirées.",
    colors: ["Doré", "Argenté", "Rose Gold"],
    sizes: ["Unique"],
    inStock: true,
    rating: 4.7,
    reviews: 92
  },

  // Chaussures femmes
  {
    id: "5",
    name: "Escarpins Classiques Noirs",
    category: "chaussures-femmes",
    price: 79.99,
    originalPrice: 110.00,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
    description: "Escarpins classiques à talons moyens, confort et élégance assurés.",
    colors: ["Noir", "Nude", "Rouge"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    inStock: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: "6",
    name: "Baskets Blanches Tendance", 
    category: "chaussures-femmes",
    price: 69.99,
    originalPrice: 90.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    description: "Baskets blanches ultra-confortables avec détails colorés.",
    colors: ["Blanc", "Blanc/Rose", "Blanc/Bleu"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    inStock: true,
    rating: 4.6,
    reviews: 201
  },
  {
    id: "7",
    name: "Bottes à Talons Marron",
    category: "chaussures-femmes",
    price: 95.99,
    originalPrice: 130.00,
    image: "https://images.unsplash.com/photo-1608256246200-53e8b47b2397?w=500&h=500&fit=crop",
    description: "Bottes en cuir marron avec talon confortable, style automne parfait.",
    colors: ["Marron", "Noir", "Cognac"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    inStock: true,
    rating: 4.7,
    reviews: 134
  },
  {
    id: "8",
    name: "Sandales à Talons Nude",
    category: "chaussures-femmes", 
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
    category: "chaussures-enfants",
    price: 35.99,
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
    description: "Baskets colorées et ludiques pour enfants, confort optimal.",
    colors: ["Multicolore", "Rose", "Bleu"],
    sizes: ["24", "25", "26", "27", "28", "29", "30"],
    inStock: true,
    rating: 4.8,
    reviews: 245
  },
  {
    id: "10",
    name: "Chaussures École Noires",
    category: "chaussures-enfants",
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
  {
    id: "11",
    name: "Sandales Enfant Été",
    category: "chaussures-enfants",
    price: 28.99,
    originalPrice: 40.00,
    image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&h=500&fit=crop",
    description: "Sandales d'été légères et respirantes pour enfants.",
    colors: ["Rose", "Bleu", "Vert"],
    sizes: ["24", "25", "26", "27", "28", "29"],
    inStock: true,
    rating: 4.2,
    reviews: 89
  },
  {
    id: "12",
    name: "Bottes de Pluie Rigolotes",
    category: "chaussures-enfants",
    price: 24.99,
    originalPrice: 35.00,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&h=500&fit=crop",
    description: "Bottes de pluie amusantes avec motifs colorés, étanches garanties.",
    colors: ["Jaune", "Rouge", "Vert"],
    sizes: ["25", "26", "27", "28", "29", "30"],
    inStock: true,
    rating: 4.6,
    reviews: 123
  }
];

export const categories = [
  { id: "tous", name: "Tous les produits", slug: "tous" },
  { id: "sacs-a-main", name: "Sacs à Main", slug: "sacs-a-main" },
  { id: "chaussures-femmes", name: "Chaussures Femmes", slug: "chaussures-femmes" },
  { id: "chaussures-enfants", name: "Chaussures Enfants", slug: "chaussures-enfants" }
];

// Mock cart data (sera géré par localStorage)
export const mockCart = [];

export const mockUser = {
  id: "user1",
  name: "Marie Dupont",
  email: "marie.dupont@email.com"
};