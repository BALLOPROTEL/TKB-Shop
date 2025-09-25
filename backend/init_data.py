"""Initialize database with mock data"""
import asyncio
from database import connect_to_mongo, get_users_collection, get_products_collection, get_orders_collection
from auth import get_password_hash
from datetime import datetime
from bson import ObjectId

# Mock data
mock_users = [
    {
        "firstName": "Admin",
        "lastName": "ChicBoutique",
        "email": "admin@chicboutique.com",
        "password": "admin123",
        "role": "admin",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        "phone": "01 23 45 67 89",
        "address": "123 Rue de la Mode, 75001 Paris",
        "joinDate": datetime(2023, 1, 15),
        "isActive": True
    },
    {
        "firstName": "Marie",
        "lastName": "Dupont",
        "email": "marie@email.com",
        "password": "marie123",
        "role": "customer",
        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        "phone": "06 12 34 56 78",
        "address": "456 Avenue des Champs, 75008 Paris",
        "joinDate": datetime(2024, 3, 20),
        "isActive": True
    },
    {
        "firstName": "Sophie",
        "lastName": "Martin",
        "email": "sophie@email.com",
        "password": "sophie123",
        "role": "customer",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        "phone": "07 98 76 54 32",
        "address": "789 Boulevard Saint-Germain, 75007 Paris",
        "joinDate": datetime(2024, 6, 10),
        "isActive": True
    }
]

mock_products = [
    {
        "name": "Sac à Main Élégant Noir",
        "category": "sacs-a-main",
        "price": 89.99,
        "originalPrice": 120.00,
        "image": "https://images.unsplash.com/photo-1608060434411-0c3fa9049e7b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxoYW5kYmFnc3xlbnwwfHx8fDE3NTI5NTIzODl8MA&ixlib=rb-4.1.0&q=85",
        "description": "Sac à main en cuir véritable avec finitions dorées. Parfait pour toutes vos occasions spéciales.",
        "colors": ["Noir", "Marron", "Beige"],
        "sizes": ["Petit", "Moyen", "Grand"],
        "inStock": True,
        "rating": 4.8,
        "reviews": 124,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Sac Bandoulière Rose",
        "category": "sacs-a-main",
        "price": 65.99,
        "originalPrice": 85.00,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        "description": "Sac bandoulière compact et stylé, idéal pour vos sorties quotidiennes.",
        "colors": ["Rose", "Blanc", "Noir"],
        "sizes": ["Unique"],
        "inStock": True,
        "rating": 4.6,
        "reviews": 89,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Sac Tote Minimaliste",
        "category": "sacs-a-main",
        "price": 45.99,
        "originalPrice": 60.00,
        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
        "description": "Grand sac tote en toile robuste, parfait pour le travail ou les courses.",
        "colors": ["Beige", "Noir", "Gris"],
        "sizes": ["Grand"],
        "inStock": True,
        "rating": 4.4,
        "reviews": 67,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Pochette de Soirée Dorée",
        "category": "sacs-a-main",
        "price": 39.99,
        "originalPrice": 55.00,
        "image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop",
        "description": "Élégante pochette dorée avec chaîne, parfaite pour vos soirées.",
        "colors": ["Doré", "Argenté", "Rose Gold"],
        "sizes": ["Unique"],
        "inStock": True,
        "rating": 4.7,
        "reviews": 92,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    # Chaussures femmes
    {
        "name": "Escarpins Classiques Noirs",
        "category": "chaussures-femmes",
        "price": 79.99,
        "originalPrice": 110.00,
        "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
        "description": "Escarpins classiques à talons moyens, confort et élégance assurés.",
        "colors": ["Noir", "Nude", "Rouge"],
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "inStock": True,
        "rating": 4.5,
        "reviews": 156,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Baskets Blanches Tendance",
        "category": "chaussures-femmes",
        "price": 69.99,
        "originalPrice": 90.00,
        "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        "description": "Baskets blanches ultra-confortables avec détails colorés.",
        "colors": ["Blanc", "Blanc/Rose", "Blanc/Bleu"],
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "inStock": True,
        "rating": 4.6,
        "reviews": 201,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Bottes à Talons Marron",
        "category": "chaussures-femmes",
        "price": 95.99,
        "originalPrice": 130.00,
        "image": "https://images.unsplash.com/photo-1608256246200-53e8b47b2397?w=500&h=500&fit=crop",
        "description": "Bottes en cuir marron avec talon confortable, style automne parfait.",
        "colors": ["Marron", "Noir", "Cognac"],
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "inStock": True,
        "rating": 4.7,
        "reviews": 134,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Sandales à Talons Nude",
        "category": "chaussures-femmes",
        "price": 55.99,
        "originalPrice": 75.00,
        "image": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500&h=500&fit=crop",
        "description": "Sandales élégantes nude, parfaites pour l'été et les occasions spéciales.",
        "colors": ["Nude", "Noir", "Blanc"],
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "inStock": False,
        "rating": 4.3,
        "reviews": 78,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    # Chaussures enfants
    {
        "name": "Baskets Enfant Colorées",
        "category": "chaussures-enfants",
        "price": 35.99,
        "originalPrice": 45.00,
        "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
        "description": "Baskets colorées et ludiques pour enfants, confort optimal.",
        "colors": ["Multicolore", "Rose", "Bleu"],
        "sizes": ["24", "25", "26", "27", "28", "29", "30"],
        "inStock": True,
        "rating": 4.8,
        "reviews": 245,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Chaussures École Noires",
        "category": "chaussures-enfants",
        "price": 42.99,
        "originalPrice": 55.00,
        "image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop",
        "description": "Chaussures robustes pour l'école, cuir véritable et semelle antidérapante.",
        "colors": ["Noir", "Marron"],
        "sizes": ["28", "29", "30", "31", "32", "33", "34"],
        "inStock": True,
        "rating": 4.4,
        "reviews": 167,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Sandales Enfant Été",
        "category": "chaussures-enfants",
        "price": 28.99,
        "originalPrice": 40.00,
        "image": "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&h=500&fit=crop",
        "description": "Sandales d'été légères et respirantes pour enfants.",
        "colors": ["Rose", "Bleu", "Vert"],
        "sizes": ["24", "25", "26", "27", "28", "29"],
        "inStock": True,
        "rating": 4.2,
        "reviews": 89,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "name": "Bottes de Pluie Rigolotes",
        "category": "chaussures-enfants",
        "price": 24.99,
        "originalPrice": 35.00,
        "image": "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&h=500&fit=crop",
        "description": "Bottes de pluie amusantes avec motifs colorés, étanches garanties.",
        "colors": ["Jaune", "Rouge", "Vert"],
        "sizes": ["25", "26", "27", "28", "29", "30"],
        "inStock": True,
        "rating": 4.6,
        "reviews": 123,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
]

async def init_database():
    """Initialize database with mock data"""
    await connect_to_mongo()
    
    users_collection = await get_users_collection()
    products_collection = await get_products_collection()
    
    # Check if data already exists
    user_count = await users_collection.count_documents({})
    product_count = await products_collection.count_documents({})
    
    if user_count == 0:
        print("Initializing users...")
        # Hash passwords
        for user in mock_users:
            user["password"] = get_password_hash(user["password"])
        
        await users_collection.insert_many(mock_users)
        print(f"Inserted {len(mock_users)} users")
    else:
        print(f"Users already exist: {user_count}")
    
    if product_count == 0:
        print("Initializing products...")
        await products_collection.insert_many(mock_products)
        print(f"Inserted {len(mock_products)} products")
    else:
        print(f"Products already exist: {product_count}")
    
    print("Database initialization complete!")

if __name__ == "__main__":
    asyncio.run(init_database())