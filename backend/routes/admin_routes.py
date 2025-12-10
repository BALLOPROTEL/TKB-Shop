from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import User, UserCreate, UserUpdate, UserResponse, Order
from auth import get_current_admin_user, get_password_hash, user_to_response
from database import get_users_collection, get_orders_collection
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter()

# User Management
@router.get("/users", response_model=List[dict])
async def get_all_users(
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Get all users (admin only)"""
    users = await get_users_collection()
    
    # Build query
    query = {}
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    
    # Execute query
    cursor = users.find(query, {"password": 0}).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for user in results:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    return results

@router.post("/users", response_model=dict)
async def create_user(
    user_data: UserCreate,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Create new user (admin only)"""
    users = await get_users_collection()
    
    # Check if user already exists
    existing_user = await users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user_dict["avatar"] = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    user_dict["joinDate"] = datetime.utcnow()
    user_dict["isActive"] = True
    
    result = await users.insert_one(user_dict)
    
    # Return created user (without password)
    created_user = await users.find_one({"_id": result.inserted_id}, {"password": 0})
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]
    
    return created_user

@router.put("/users/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Update user (admin only)"""
    users = await get_users_collection()
    
    try:
        user_obj_id = ObjectId(user_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if user exists
    existing_user = await users.find_one({"_id": user_obj_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build update data
    update_data = {}
    for field, value in user_update.dict(exclude_unset=True).items():
        if value is not None:
            update_data[field] = value
    
    # Check email uniqueness if email is being updated
    if "email" in update_data:
        email_check = await users.find_one({
            "email": update_data["email"],
            "_id": {"$ne": user_obj_id}
        })
        if email_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
    
    if update_data:
        await users.update_one(
            {"_id": user_obj_id},
            {"$set": update_data}
        )
    
    # Return updated user (without password)
    updated_user = await users.find_one({"_id": user_obj_id}, {"password": 0})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    
    return updated_user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Delete user (admin only)"""
    users = await get_users_collection()
    
    try:
        user_obj_id = ObjectId(user_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if user exists and is not admin
    existing_user = await users.find_one({"_id": user_obj_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if existing_user.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin users"
        )
    
    result = await users.delete_one({"_id": user_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}

# Order Management
@router.get("/orders", response_model=List[dict])
async def get_all_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Get all orders (admin only)"""
    orders = await get_orders_collection()
    
    cursor = orders.find().skip(skip).limit(limit).sort("createdAt", -1)
    results = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for order in results:
        order["id"] = str(order["_id"])
        order["userId"] = str(order["userId"])
        del order["_id"]
    
    return results

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Update order status (admin only)"""
    orders = await get_orders_collection()
    
    valid_statuses = ["processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )
    
    result = await orders.update_one(
        {"_id": order_obj_id},
        {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return {"message": "Order status updated successfully"}

@router.delete("/orders/{order_id}")
async def delete_order(
    order_id: str,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Delete order (admin only)"""
    orders = await get_orders_collection()
    
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )
    
    result = await orders.delete_one({"_id": order_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return {"message": "Order deleted successfully"}

# Dashboard Stats
@router.get("/stats")
async def get_dashboard_stats(current_admin: UserResponse = Depends(get_current_admin_user)):
    """Get dashboard statistics (admin only)"""
    users = await get_users_collection()
    orders = await get_orders_collection()
    from database import get_products_collection
    products = await get_products_collection()
    
    # Count documents
    total_users = await users.count_documents({})
    total_orders = await orders.count_documents({})
    total_products = await products.count_documents({})
    
    # Calculate total revenue
    pipeline = [
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
    ]
    revenue_result = await orders.aggregate(pipeline).to_list(length=1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
    
    return {
        "totalUsers": total_users,
        "totalOrders": total_orders,
        "totalProducts": total_products,
        "totalRevenue": total_revenue
    }