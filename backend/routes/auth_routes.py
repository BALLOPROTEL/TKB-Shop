from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from models import LoginRequest, UserCreate, Token, UserResponse, UserUpdate
from auth import (
    authenticate_user, create_access_token, get_password_hash, 
    get_current_user, user_to_response, get_user
)
from database import get_users_collection
from bson import ObjectId
import os

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(user_credentials: LoginRequest):
    """Authenticate user and return JWT token"""
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_to_response(user)
    )

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register new user"""
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
    
    result = await users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    user_dict["id"] = str(result.inserted_id)
    
    # Create token
    access_token_expires = timedelta(minutes=int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    access_token = create_access_token(
        data={"sub": str(result.inserted_id)}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user_dict)
    )

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update current user profile"""
    users = await get_users_collection()
    
    # Build update data
    update_data = {}
    if user_update.firstName is not None:
        update_data["firstName"] = user_update.firstName
    if user_update.lastName is not None:
        update_data["lastName"] = user_update.lastName
    if user_update.email is not None:
        # Check if email is already taken by another user
        existing_user = await users.find_one({
            "email": user_update.email,
            "_id": {"$ne": ObjectId(current_user.id)}
        })
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
        update_data["email"] = user_update.email
    if user_update.phone is not None:
        update_data["phone"] = user_update.phone
    if user_update.address is not None:
        update_data["address"] = user_update.address
    if user_update.avatar is not None:
        update_data["avatar"] = user_update.avatar
    
    if update_data:
        await users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
        
        # Return updated user data
        updated_user = await users.find_one({"_id": ObjectId(current_user.id)})
        updated_user["id"] = str(updated_user["_id"])
        return UserResponse(**updated_user)
    
    return current_user