"""Check and fix admin credentials"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from database import connect_to_mongo, get_users_collection
from auth import get_password_hash

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def check_and_fix_admin():
    """Check admin user and reset password if needed"""
    await connect_to_mongo()
    
    users = await get_users_collection()
    
    # List all users
    all_users = await users.find({}, {"email": 1, "role": 1, "firstName": 1, "lastName": 1}).to_list(100)
    
    print(f"\n📊 Total users in DB: {len(all_users)}")
    print("=" * 60)
    for user in all_users:
        email = user.get('email', 'N/A')
        role = user.get('role', 'N/A')
        firstName = user.get('firstName', '')
        lastName = user.get('lastName', '')
        print(f"  ✉️  {email:30} | Role: {role:10} | {firstName} {lastName}")
    print("=" * 60)
    
    # Find admin user
    admin = await users.find_one({"email": "admin@tkbshop.com"})
    
    if admin:
        print(f"\n✅ Admin found: {admin.get('email')}")
        print(f"   Resetting password to: admin123")
        
        # Update admin password
        new_password_hash = get_password_hash("admin123")
        await users.update_one(
            {"email": "admin@tkbshop.com"},
            {"$set": {"password": new_password_hash}}
        )
        
        print("   ✅ Password reset successful!")
        print("\n🔑 Admin credentials:")
        print("   Email: admin@tkbshop.com")
        print("   Password: admin123")
    else:
        print("\n❌ Admin user not found!")
        print("   Creating new admin user...")
        
        admin_user = {
            "firstName": "Admin",
            "lastName": "TKB'Shop",
            "email": "admin@tkbshop.com",
            "password": get_password_hash("admin123"),
            "role": "admin",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            "phone": "01 23 45 67 89",
            "address": "123 Rue de la Mode, 75001 Paris",
            "isActive": True
        }
        
        await users.insert_one(admin_user)
        print("   ✅ Admin user created!")
        print("\n🔑 Admin credentials:")
        print("   Email: admin@tkbshop.com")
        print("   Password: admin123")

if __name__ == "__main__":
    asyncio.run(check_and_fix_admin())
