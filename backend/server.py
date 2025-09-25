from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import logging
from database import connect_to_mongo, close_mongo_connection

# Import route modules
from routes.auth_routes import router as auth_router
from routes.product_routes import router as product_router
from routes.admin_routes import router as admin_router
from routes.order_routes import router as order_router
from routes.payment_routes import router as payment_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="ChicBoutique API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include all route modules
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(product_router, prefix="/products", tags=["Products"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
api_router.include_router(order_router, prefix="/orders", tags=["Orders"])
api_router.include_router(payment_router, prefix="/payments", tags=["Payments"])

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "ChicBoutique API is running"}

# Legacy root endpoint
@api_router.get("/")
async def root():
    return {"message": "ChicBoutique API v1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection on startup"""
    await connect_to_mongo()
    logger.info("ChicBoutique API started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    await close_mongo_connection()
    logger.info("ChicBoutique API shutdown complete")
