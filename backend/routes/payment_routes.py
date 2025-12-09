from fastapi import APIRouter, HTTPException, status, Depends, Request
from typing import List, Dict, Any, Optional
from models import PaymentTransaction, CheckoutRequest, UserResponse, OrderCreate, OrderItem
from auth import get_current_user, get_current_user_optional
from database import get_payment_transactions_collection, get_orders_collection
from datetime import datetime
import os
from dotenv import load_dotenv
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from bson import ObjectId
import uuid
import stripe

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize Stripe
stripe_api_key = os.environ.get('STRIPE_API_KEY')
print(f"Stripe API Key loaded: {'Yes' if stripe_api_key else 'No'}")

# Set Stripe API key
if stripe_api_key:
    stripe.api_key = stripe_api_key

def get_stripe_checkout(request: Request):
    """Get Stripe checkout instance"""
    if not stripe_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe payment service not configured"
        )
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe" 
    return StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)

async def create_stripe_checkout_with_bnpl(
    amount: float,
    currency: str,
    success_url: str,
    cancel_url: str,
    metadata: dict,
    enable_bnpl: bool = False
) -> dict:
    """Create Stripe checkout session with optional BNPL support using native Stripe SDK"""
    try:
        # Calculate amount in cents
        amount_cents = int(amount * 100)
        
        # Base payment method types
        payment_method_types = ["card"]
        
        # Add BNPL providers if enabled
        if enable_bnpl:
            # Add popular BNPL providers (availability depends on region and Stripe account settings)
            payment_method_types.extend(["klarna", "affirm", "afterpay_clearpay"])
        
        # Create checkout session using native Stripe SDK
        session = stripe.checkout.Session.create(
            payment_method_types=payment_method_types,
            line_items=[
                {
                    "price_data": {
                        "currency": currency,
                        "unit_amount": amount_cents,
                        "product_data": {
                            "name": "Commande TKB'SHOP",
                            "description": f"Commande de {metadata.get('items_count', '0')} article(s)"
                        }
                    },
                    "quantity": 1
                }
            ],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=metadata.get("user_email") if metadata.get("user_email") else None
        )
        
        return {
            "session_id": session.id,
            "url": session.url
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stripe error: {str(e)}"
        )

@router.post("/checkout/session", response_model=dict)
async def create_checkout_session(
    request: Request,
    checkout_data: CheckoutRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """Create Stripe checkout session"""
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in checkout_data.items)
    shipping = 0.0 if subtotal >= 50 else 4.99
    total = subtotal + shipping
    
    # Get host URL from request
    host_url = str(request.base_url).rstrip('/')
    
    # Initialize Stripe checkout
    stripe_checkout = get_stripe_checkout(request)
    
    # Build URLs (get frontend URL from request header or use default)
    frontend_url = request.headers.get("Origin") or host_url
    success_url = f"{frontend_url}/checkout-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{frontend_url}/checkout"
    
    # Create checkout session request
    # Store order data in metadata (Stripe metadata has character limit, so we'll store in transaction)
    metadata = {
        "user_id": current_user.id if current_user else "",
        "user_email": current_user.email if current_user else checkout_data.shippingAddress.get("email", ""),
        "items_count": str(len(checkout_data.items)),
        "subtotal": str(subtotal),
        "shipping": str(shipping),
        "firstName": checkout_data.shippingAddress.get("firstName", ""),
        "lastName": checkout_data.shippingAddress.get("lastName", "")
    }
    
    checkout_request = CheckoutSessionRequest(
        amount=total,
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )
    
    try:
        # Create checkout session
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Save payment transaction to database with full order data
        transaction_dict = {
            "sessionId": session.session_id,
            "userId": current_user.id if current_user else None,
            "email": current_user.email if current_user else checkout_data.shippingAddress.get("email"),
            "amount": total,
            "currency": "eur",
            "paymentStatus": "initiated",
            "status": "active",
            "metadata": metadata,
            "orderData": {
                "items": [item.dict() for item in checkout_data.items],
                "shippingAddress": checkout_data.shippingAddress,
                "subtotal": subtotal,
                "shipping": shipping
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        transactions = await get_payment_transactions_collection()
        await transactions.insert_one(transaction_dict)
        
        return {
            "url": session.url,
            "session_id": session.session_id,
            "message": "Checkout session created successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )

async def create_order_from_payment(transaction: dict, webhook_response):
    """Create order from successful payment transaction"""
    try:
        orders = await get_orders_collection()
        
        # Extract order data from transaction
        order_data = transaction.get("orderData", {})
        items = order_data.get("items", [])
        shipping_address = order_data.get("shippingAddress", {})
        metadata = transaction.get("metadata", {})
        
        # Generate order ID
        order_id = f"CMD{str(uuid.uuid4())[:8].upper()}"
        
        # Convert items to proper format with ObjectId for productId
        order_items = []
        for item in items:
            order_item = {
                "productId": item.get("id"),
                "name": item.get("name"),
                "price": item.get("price"),
                "quantity": item.get("quantity"),
                "selectedColor": item.get("selectedColor"),
                "selectedSize": item.get("selectedSize"),
                "image": item.get("image")
            }
            order_items.append(order_item)
        
        # Create complete order
        order_dict = {
            "userId": ObjectId(transaction["userId"]) if transaction.get("userId") else None,
            "orderId": order_id,
            "items": order_items,
            "status": "paid",
            "total": transaction["amount"],
            "subtotal": float(order_data.get("subtotal", 0)),
            "shipping": float(order_data.get("shipping", 0)),
            "shippingAddress": shipping_address,
            "paymentSessionId": transaction["sessionId"],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await orders.insert_one(order_dict)
        print(f"✅ Order created successfully: {order_id} (MongoDB ID: {result.inserted_id})")
        
        return order_id
        
    except Exception as e:
        print(f"❌ Error creating order from payment: {e}")
        import traceback
        traceback.print_exc()
        return None

@router.get("/checkout/status/{session_id}", response_model=dict)
async def get_checkout_status(session_id: str, request: Request):
    """Get checkout session status"""
    
    try:
        # Get Stripe checkout
        stripe_checkout = get_stripe_checkout(request)
        
        # Get checkout status from Stripe
        checkout_status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update payment transaction in database
        transactions = await get_payment_transactions_collection()
        await transactions.update_one(
            {"sessionId": session_id},
            {
                "$set": {
                    "paymentStatus": checkout_status.payment_status,
                    "status": checkout_status.status,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency,
            "metadata": checkout_status.metadata
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get checkout status: {str(e)}"
        )

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    
    try:
        # Get request body
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Stripe signature"
            )
        
        # Get Stripe checkout
        stripe_checkout = get_stripe_checkout(request)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update payment transaction in database
        transactions = await get_payment_transactions_collection()
        
        await transactions.update_one(
            {"sessionId": webhook_response.session_id},
            {
                "$set": {
                    "paymentStatus": webhook_response.payment_status,
                    "paymentId": webhook_response.event_id,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        # If payment is successful, create order
        if webhook_response.payment_status == "paid":
            # Get transaction details
            transaction = await transactions.find_one({"sessionId": webhook_response.session_id})
            
            if transaction:
                # Create order from successful payment
                order_id = await create_order_from_payment(transaction, webhook_response)
                
                if order_id:
                    # Mark order as created in transaction
                    await transactions.update_one(
                        {"sessionId": webhook_response.session_id},
                        {"$set": {"orderId": order_id, "orderCreated": True}}
                    )
                    print(f"✅ Order {order_id} linked to transaction {webhook_response.session_id}")
        
        return {"received": True}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Webhook processing failed: {str(e)}"
        )

@router.get("/transactions")
async def get_user_transactions(current_user: UserResponse = Depends(get_current_user)):
    """Get user's payment transactions"""
    transactions = await get_payment_transactions_collection()
    
    cursor = transactions.find(
        {"userId": ObjectId(current_user.id)},
        {"sessionId": 1, "amount": 1, "currency": 1, "paymentStatus": 1, "createdAt": 1}
    ).sort("createdAt", -1)
    
    results = await cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for transaction in results:
        transaction["id"] = str(transaction["_id"])
        if transaction.get("userId"):
            transaction["userId"] = str(transaction["userId"])
        del transaction["_id"]
    
    return results