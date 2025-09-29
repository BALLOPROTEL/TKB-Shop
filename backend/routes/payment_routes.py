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

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize Stripe
stripe_api_key = os.environ.get('STRIPE_API_KEY')
print(f"Stripe API Key loaded: {'Yes' if stripe_api_key else 'No'}")

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
    metadata = {
        "user_id": current_user.id if current_user else "",
        "user_email": current_user.email if current_user else "",
        "items_count": str(len(checkout_data.items)),
        "subtotal": str(subtotal),
        "shipping": str(shipping)
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
        
        # Save payment transaction to database
        payment_transaction = PaymentTransaction(
            sessionId=session.session_id,
            userId=ObjectId(current_user.id) if current_user else None,
            email=current_user.email if current_user else None,
            amount=total,
            currency="eur",
            paymentStatus="initiated",
            status="active",
            metadata=metadata,
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )
        
        transactions = await get_payment_transactions_collection()
        await transactions.insert_one(payment_transaction.dict(exclude={'id'}))
        
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

@router.get("/checkout/status/{session_id}", response_model=dict)
async def get_checkout_status(session_id: str):
    """Get checkout session status"""
    
    try:
        # Get Stripe checkout
        stripe_checkout = get_stripe_checkout()
        
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
        stripe_checkout = get_stripe_checkout()
        
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
            
            if transaction and transaction.get("userId"):
                # Create order from successful payment
                await create_order_from_payment(transaction, webhook_response)
                
                # Mark order as created in transaction
                await transactions.update_one(
                    {"sessionId": webhook_response.session_id},
                    {"$set": {"orderId": f"CMD{str(uuid.uuid4())[:8].upper()}"}}
                )
        
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