from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from models import User, UserResponse
from database import get_users_collection
from bson import ObjectId
import os

# Security setup
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("❌ CRITICAL: SECRET_KEY environment variable must be set for security")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
oauth2_scheme_optional = HTTPBearer(auto_error=False)  # Optional authentication

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(email: str) -> Optional[User]:
    """Get user by email"""
    users = await get_users_collection()
    user_data = await users.find_one({"email": email})
    if user_data:
        user_data["id"] = str(user_data["_id"])
        del user_data["_id"]
        return User(**user_data)
    return None

async def get_user_by_id(user_id: str) -> Optional[User]:
    """Get user by ID"""
    users = await get_users_collection()
    user_data = await users.find_one({"_id": ObjectId(user_id)})
    if user_data:
        user_data["id"] = str(user_data["_id"])
        del user_data["_id"]
        return User(**user_data)
    return None

async def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = await get_user(email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    return UserResponse(
        id=str(user.id),
        firstName=user.firstName,
        lastName=user.lastName,
        email=user.email,
        role=user.role,
        phone=user.phone,
        address=user.address,
        avatar=user.avatar,
        joinDate=user.joinDate,
        isActive=user.isActive
    )

async def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[UserResponse]:
    """Get current user if authenticated, otherwise return None"""
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None
    
    user = await get_user_by_id(user_id)
    if user is None:
        return None
    
    return UserResponse(
        id=str(user.id),
        firstName=user.firstName,
        lastName=user.lastName,
        email=user.email,
        role=user.role,
        phone=user.phone,
        address=user.address,
        avatar=user.avatar,
        joinDate=user.joinDate,
        isActive=user.isActive
    )

async def get_current_admin_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    """Get current user and verify admin role"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def user_to_response(user: User) -> UserResponse:
    """Convert User model to UserResponse"""
    return UserResponse(
        id=str(user.id),
        firstName=user.firstName,
        lastName=user.lastName,
        email=user.email,
        role=user.role,
        phone=user.phone,
        address=user.address,
        avatar=user.avatar,
        joinDate=user.joinDate,
        isActive=user.isActive
    )