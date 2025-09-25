import motor.motor_asyncio
import os
from typing import Optional

class Database:
    client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ.get('DB_NAME', 'chicboutique')
    
    db.client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db.database = db.client[db_name]
    
    # Test connection
    try:
        await db.client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

# Collection getters
async def get_users_collection():
    database = await get_database()
    return database.users

async def get_products_collection():
    database = await get_database()
    return database.products

async def get_orders_collection():
    database = await get_database()
    return database.orders

async def get_payment_transactions_collection():
    database = await get_database()
    return database.payment_transactions