from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import Product, ProductCreate, ProductUpdate, UserResponse
from auth import get_current_admin_user, get_current_user
from database import get_products_collection
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100)
):
    """Get all products with optional filtering"""
    products = await get_products_collection()
    
    # Build query
    query = {}
    if category and category != "tous":
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Execute query
    cursor = products.find(query).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for product in results:
        product["id"] = str(product["_id"])
        del product["_id"]
    
    return results

@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get single product by ID"""
    products = await get_products_collection()
    
    try:
        product = await products.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    product["id"] = str(product["_id"])
    del product["_id"]
    return product

@router.post("/", response_model=dict)
async def create_product(
    product: ProductCreate,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Create new product (admin only)"""
    products = await get_products_collection()
    
    product_dict = product.dict()
    product_dict["createdAt"] = datetime.now(timezone.utc)
    product_dict["updatedAt"] = datetime.now(timezone.utc)
    
    result = await products.insert_one(product_dict)
    
    # Return created product
    created_product = await products.find_one({"_id": result.inserted_id})
    created_product["id"] = str(created_product["_id"])
    del created_product["_id"]
    
    return created_product

@router.put("/{product_id}", response_model=dict)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Update product (admin only)"""
    products = await get_products_collection()
    
    try:
        product_obj_id = ObjectId(product_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )
    
    # Check if product exists
    existing_product = await products.find_one({"_id": product_obj_id})
    if not existing_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Build update data
    update_data = {}
    for field, value in product_update.dict(exclude_unset=True).items():
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updatedAt"] = datetime.now(timezone.utc)
        await products.update_one(
            {"_id": product_obj_id},
            {"$set": update_data}
        )
    
    # Return updated product
    updated_product = await products.find_one({"_id": product_obj_id})
    updated_product["id"] = str(updated_product["_id"])
    del updated_product["_id"]
    
    return updated_product

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    """Delete product (admin only)"""
    products = await get_products_collection()
    
    try:
        product_obj_id = ObjectId(product_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )
    
    result = await products.delete_one({"_id": product_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {"message": "Product deleted successfully"}

@router.get("/categories/list")
async def get_categories():
    """Get list of product categories"""
    return [
        {"id": "tous", "name": "Tous les produits", "slug": "tous"},
        {"id": "sacs-a-main", "name": "Sacs à Main", "slug": "sacs-a-main"},
        {"id": "chaussures-femmes", "name": "Chaussures Femmes", "slug": "chaussures-femmes"},
        {"id": "chaussures-enfants", "name": "Chaussures Enfants", "slug": "chaussures-enfants"}
    ]