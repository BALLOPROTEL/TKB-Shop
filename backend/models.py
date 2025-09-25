from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId

# Custom ObjectId type for Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

# User Models
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    firstName: str
    lastName: str
    email: str
    password: str  # Will be hashed
    role: str = "customer"  # customer or admin
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar: Optional[str] = None
    joinDate: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = True

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar: Optional[str] = None
    joinDate: datetime
    isActive: bool

# Product Models
class Product(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    image: str
    description: str
    colors: List[str] = []
    sizes: List[str] = []
    inStock: bool = True
    rating: float = 4.0
    reviews: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    image: str
    description: str
    colors: List[str] = []
    sizes: List[str] = []
    inStock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    inStock: Optional[bool] = None

# Order Models
class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    selectedColor: str
    selectedSize: str
    image: str

class Order(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    orderId: str  # Human readable order ID like CMD001
    items: List[OrderItem]
    status: str = "processing"  # processing, shipped, delivered, cancelled
    total: float
    subtotal: float
    shipping: float
    shippingAddress: Dict[str, str]
    paymentSessionId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shippingAddress: Dict[str, str]

# Payment Models
class PaymentTransaction(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    sessionId: str  # Stripe checkout session ID
    paymentId: Optional[str] = None
    userId: Optional[PyObjectId] = None
    email: Optional[str] = None
    orderId: Optional[str] = None
    amount: float
    currency: str = "eur"
    paymentStatus: str = "initiated"  # initiated, pending, paid, failed, expired
    status: str = "active"  # active, expired, complete
    metadata: Optional[Dict[str, str]] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

# Cart Models (for checkout)
class CartItem(BaseModel):
    id: str
    name: str
    price: float
    image: str
    selectedColor: str
    selectedSize: str
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    shippingAddress: Dict[str, str]