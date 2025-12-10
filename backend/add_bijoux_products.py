"""Add bijoux products to database"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from database import connect_to_mongo, get_products_collection
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

bijoux_products = [
    {
        "name": "Chaîne Or 18 Carats",
        "category": "bijoux",
        "price": 299.99,
        "originalPrice": 399.00,
        "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw1fHxqZXdlbHJ5fGVufDB8fHx8MTc1ODg3OTYyNXww&ixlib=rb-4.1.0&q=85",
        "description": "Chaîne en or 18 carats, maille forçat, longueur 50 cm. Bijou d'exception.",
        "colors": ["Or"],
        "sizes": ["50cm", "55cm", "60cm"],
        "inStock": True,
        "rating": 4.9,
        "reviews": 87,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "name": "Chaîne Argent Élégante",
        "category": "bijoux",
        "price": 89.99,
        "originalPrice": 120.00,
        "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
        "description": "Chaîne en argent 925 rhodié, brillance et élégance.",
        "colors": ["Argent"],
        "sizes": ["45cm", "50cm", "55cm"],
        "inStock": True,
        "rating": 4.7,
        "reviews": 124,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "name": "Pendentif Coeur Diamant",
        "category": "bijoux",
        "price": 199.99,
        "originalPrice": 250.00,
        "image": "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
        "description": "Pendentif en forme de cœur serti de diamants, or blanc 18 carats.",
        "colors": ["Or Blanc", "Or Jaune"],
        "sizes": ["Unique"],
        "inStock": True,
        "rating": 4.8,
        "reviews": 156,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "name": "Chaîne Fantaisie Dorée",
        "category": "bijoux",
        "price": 45.99,
        "originalPrice": 65.00,
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
        "description": "Chaîne fantaisie dorée avec pendentif étoile, style moderne.",
        "colors": ["Doré", "Argenté"],
        "sizes": ["Unique"],
        "inStock": True,
        "rating": 4.5,
        "reviews": 89,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "name": "Bracelet Chaîne Or Rose",
        "category": "bijoux",
        "price": 159.99,
        "originalPrice": 200.00,
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
        "description": "Bracelet chaîne en or rose 14 carats, maille gourmette fine.",
        "colors": ["Or Rose"],
        "sizes": ["17cm", "19cm", "21cm"],
        "inStock": True,
        "rating": 4.6,
        "reviews": 72,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "name": "Collier Perles et Chaîne",
        "category": "bijoux",
        "price": 129.99,
        "originalPrice": 170.00,
        "image": "https://images.unsplash.com/photo-1589674781759-c0c8e5fc3067?w=500&h=500&fit=crop",
        "description": "Collier élégant combinant perles d'eau douce et chaîne en or.",
        "colors": ["Or", "Argent"],
        "sizes": ["45cm", "50cm"],
        "inStock": True,
        "rating": 4.7,
        "reviews": 98,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
]

async def add_bijoux_products():
    """Add bijoux products to database"""
    await connect_to_mongo()
    
    products_collection = await get_products_collection()
    
    # Check if bijoux products already exist
    existing_count = await products_collection.count_documents({"category": "bijoux"})
    
    if existing_count > 0:
        print(f"Bijoux products already exist: {existing_count}")
        return
    
    print("Adding bijoux products...")
    result = await products_collection.insert_many(bijoux_products)
    print(f"Successfully inserted {len(result.inserted_ids)} bijoux products")
    
    # Verify
    total_products = await products_collection.count_documents({})
    bijoux_count = await products_collection.count_documents({"category": "bijoux"})
    print(f"Total products: {total_products}")
    print(f"Bijoux products: {bijoux_count}")

if __name__ == "__main__":
    asyncio.run(add_bijoux_products())
