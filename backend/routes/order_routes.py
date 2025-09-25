from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models import Order, OrderCreate, OrderItem, UserResponse
from auth import get_current_user
from database import get_orders_collection, get_products_collection
from bson import ObjectId
from datetime import datetime
import string
import random

router = APIRouter()

def generate_order_id():
    """Generate human readable order ID like CMD001"""
    prefix = "CMD"
    suffix = ''.join(random.choices(string.digits, k=3))
    return f"{prefix}{suffix}"

@router.post("/", response_model=dict)
async def create_order(
    order_data: OrderCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create new order"""
    orders = await get_orders_collection()
    products = await get_products_collection()
    
    # Validate products and calculate totals
    total_items = []
    subtotal = 0.0
    
    for item in order_data.items:
        # Get product details from database
        try:
            product = await products.find_one({"_id": ObjectId(item.productId)})
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid product ID: {item.productId}"
            )
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product not found: {item.productId}"
            )
        
        if not product.get("inStock", True):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product out of stock: {product['name']}"
            )
        
        # Create order item with validated data
        order_item = OrderItem(
            productId=item.productId,
            name=item.name,
            price=item.price,
            quantity=item.quantity,
            selectedColor=item.selectedColor,
            selectedSize=item.selectedSize,
            image=item.image
        )
        total_items.append(order_item)
        subtotal += item.price * item.quantity
    
    # Calculate shipping
    shipping = 0.0 if subtotal >= 50 else 4.99
    total = subtotal + shipping
    
    # Create order
    order_dict = {
        "userId": ObjectId(current_user.id),
        "orderId": generate_order_id(),
        "items": [item.dict() for item in total_items],
        "status": "processing",
        "total": total,
        "subtotal": subtotal,
        "shipping": shipping,
        "shippingAddress": order_data.shippingAddress,
        "paymentSessionId": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await orders.insert_one(order_dict)
    
    # Return created order
    created_order = await orders.find_one({"_id": result.inserted_id})
    created_order["id"] = str(created_order["_id"])
    created_order["userId"] = str(created_order["userId"])
    del created_order["_id"]
    
    return created_order

@router.get("/", response_model=List[dict])
async def get_user_orders(current_user: UserResponse = Depends(get_current_user)):
    """Get current user's orders"""
    orders = await get_orders_collection()
    
    cursor = orders.find({"userId": ObjectId(current_user.id)}).sort("createdAt", -1)
    results = await cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for order in results:
        order["id"] = str(order["_id"])
        order["userId"] = str(order["userId"])
        del order["_id"]
    
    return results

@router.get("/{order_id}", response_model=dict)
async def get_order(
    order_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get specific order by ID"""
    orders = await get_orders_collection()
    
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )
    
    order = await orders.find_one({
        "_id": order_obj_id,
        "userId": ObjectId(current_user.id)
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order["id"] = str(order["_id"])
    order["userId"] = str(order["userId"])
    del order["_id"]
    
    return order

@router.put("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Cancel order (if still processing)"""
    orders = await get_orders_collection()
    
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )
    
    # Check if order exists and belongs to user
    order = await orders.find_one({
        "_id": order_obj_id,
        "userId": ObjectId(current_user.id)
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order["status"] != "processing":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order cannot be cancelled"
        )
    
    # Update order status
    await orders.update_one(
        {"_id": order_obj_id},
        {"$set": {"status": "cancelled", "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Order cancelled successfully"}