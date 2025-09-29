#!/usr/bin/env python3
"""
Backend API Testing for TKB'Shop ChicBoutique
Tests authentication, product APIs, and general endpoints
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://tkbshop-market.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@chicboutique.com"
ADMIN_PASSWORD = "admin123"
TEST_PRODUCT_ID = "68d59c8326f2400d13ac6122"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "response_data": response_data
        }
        self.test_results.append(result)
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        print()

    def test_health_endpoint(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"API is healthy: {data.get('message', '')}")
                else:
                    self.log_test("Health Check", False, f"Unexpected health status: {data}", data)
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")

    def test_admin_authentication(self):
        """Test POST /api/auth/login with admin credentials"""
        try:
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Admin Authentication", False, f"Missing fields: {missing_fields}", data)
                    return
                
                # Check token type
                if data["token_type"] != "bearer":
                    self.log_test("Admin Authentication", False, f"Invalid token type: {data['token_type']}", data)
                    return
                
                # Check user data
                user = data["user"]
                if user.get("email") != ADMIN_EMAIL:
                    self.log_test("Admin Authentication", False, f"Email mismatch: {user.get('email')}", data)
                    return
                
                if user.get("role") != "admin":
                    self.log_test("Admin Authentication", False, f"Role mismatch: {user.get('role')}", data)
                    return
                
                # Store token for future requests
                self.admin_token = data["access_token"]
                
                self.log_test("Admin Authentication", True, 
                            f"Login successful - User: {user.get('firstName', '')} {user.get('lastName', '')}, Role: {user.get('role')}")
                
            else:
                self.log_test("Admin Authentication", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Request failed: {str(e)}")

    def test_products_list(self):
        """Test GET /api/products endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/products", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check first product structure
                        first_product = data[0]
                        required_fields = ["id", "name", "category", "price", "image", "description"]
                        missing_fields = [field for field in required_fields if field not in first_product]
                        
                        if missing_fields:
                            self.log_test("Products List", False, f"Missing fields in product: {missing_fields}", first_product)
                        else:
                            self.log_test("Products List", True, 
                                        f"Retrieved {len(data)} products. Sample: {first_product.get('name', 'N/A')}")
                    else:
                        self.log_test("Products List", False, "No products found in database")
                else:
                    self.log_test("Products List", False, f"Expected list, got {type(data)}", data)
                    
            else:
                self.log_test("Products List", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Products List", False, f"Request failed: {str(e)}")

    def test_product_detail(self):
        """Test GET /api/products/{id} endpoint with specific product ID"""
        try:
            response = self.session.get(f"{self.base_url}/products/{TEST_PRODUCT_ID}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check product structure
                required_fields = ["id", "name", "category", "price", "image", "description"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Product Detail", False, f"Missing fields: {missing_fields}", data)
                else:
                    # Verify the ID matches
                    if data.get("id") == TEST_PRODUCT_ID:
                        self.log_test("Product Detail", True, 
                                    f"Product found: {data.get('name', 'N/A')} - {data.get('price', 'N/A')}€")
                    else:
                        self.log_test("Product Detail", False, f"ID mismatch: expected {TEST_PRODUCT_ID}, got {data.get('id')}", data)
                        
            elif response.status_code == 404:
                self.log_test("Product Detail", False, f"Product {TEST_PRODUCT_ID} not found", response.text)
            elif response.status_code == 400:
                self.log_test("Product Detail", False, f"Invalid product ID format", response.text)
            else:
                self.log_test("Product Detail", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Product Detail", False, f"Request failed: {str(e)}")

    def test_invalid_product_id(self):
        """Test GET /api/products/{id} with invalid ID"""
        try:
            invalid_id = "invalid-id-123"
            response = self.session.get(f"{self.base_url}/products/{invalid_id}", timeout=10)
            
            if response.status_code == 400:
                self.log_test("Invalid Product ID Handling", True, "Correctly rejected invalid product ID")
            else:
                self.log_test("Invalid Product ID Handling", False, 
                            f"Expected HTTP 400, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Invalid Product ID Handling", False, f"Request failed: {str(e)}")

    def test_protected_endpoint_without_auth(self):
        """Test accessing admin endpoint without authentication"""
        try:
            response = self.session.get(f"{self.base_url}/admin/users", timeout=10)
            
            if response.status_code == 401:
                self.log_test("Protected Endpoint Security", True, "Correctly rejected unauthenticated request")
            else:
                self.log_test("Protected Endpoint Security", False, 
                            f"Expected HTTP 401, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Protected Endpoint Security", False, f"Request failed: {str(e)}")

    def test_admin_endpoint_with_auth(self):
        """Test accessing admin endpoint with authentication"""
        if not self.admin_token:
            self.log_test("Admin Endpoint Access", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/users", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Admin Endpoint Access", True, f"Retrieved {len(data)} users")
                else:
                    self.log_test("Admin Endpoint Access", False, f"Expected list, got {type(data)}", data)
            else:
                self.log_test("Admin Endpoint Access", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Endpoint Access", False, f"Request failed: {str(e)}")

    def test_customer_authentication(self):
        """Test authentication with customer credentials"""
        try:
            # Try with a potential customer account
            login_data = {
                "email": "marie.dubois@email.com",
                "password": "password123"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                user = data.get("user", {})
                if user.get("role") == "customer":
                    self.log_test("Customer Authentication", True, 
                                f"Customer login successful: {user.get('firstName', '')} {user.get('lastName', '')}")
                else:
                    self.log_test("Customer Authentication", False, f"Expected customer role, got {user.get('role')}", data)
            elif response.status_code == 401:
                self.log_test("Customer Authentication", True, "Customer credentials not found (expected for test)")
            else:
                self.log_test("Customer Authentication", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Customer Authentication", False, f"Request failed: {str(e)}")

    def test_stripe_checkout_session(self):
        """Test POST /api/payments/checkout/session - Stripe integration"""
        if not self.admin_token:
            self.log_test("Stripe Checkout Session", False, "No admin token available")
            return
            
        try:
            # Sample checkout data
            checkout_data = {
                "items": [
                    {
                        "productId": TEST_PRODUCT_ID,
                        "name": "Sac à Main Élégant Noir",
                        "price": 89.99,
                        "quantity": 1,
                        "selectedColor": "Noir",
                        "selectedSize": "Moyen",
                        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
                    }
                ]
            }
            
            headers = {
                "Authorization": f"Bearer {self.admin_token}",
                "Content-Type": "application/json",
                "Origin": "https://tkbshop-market.preview.emergentagent.com"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/checkout/session",
                json=checkout_data,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["url", "session_id", "message"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Stripe Checkout Session", False, f"Missing fields: {missing_fields}", data)
                else:
                    # Store session_id for status test
                    self.stripe_session_id = data["session_id"]
                    self.log_test("Stripe Checkout Session", True, 
                                f"Session created: {data['session_id'][:20]}... URL: {data['url'][:50]}...")
            else:
                self.log_test("Stripe Checkout Session", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Stripe Checkout Session", False, f"Request failed: {str(e)}")

    def test_stripe_checkout_status(self):
        """Test GET /api/payments/checkout/status/{session_id}"""
        if not hasattr(self, 'stripe_session_id'):
            self.log_test("Stripe Checkout Status", False, "No session_id from previous test")
            return
            
        try:
            response = self.session.get(
                f"{self.base_url}/payments/checkout/status/{self.stripe_session_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["status", "payment_status", "amount_total", "currency"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Stripe Checkout Status", False, f"Missing fields: {missing_fields}", data)
                else:
                    self.log_test("Stripe Checkout Status", True, 
                                f"Status: {data['status']}, Payment: {data['payment_status']}, Amount: {data['amount_total']} {data['currency']}")
            else:
                self.log_test("Stripe Checkout Status", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Stripe Checkout Status", False, f"Request failed: {str(e)}")

    def test_stripe_webhook_endpoint(self):
        """Test POST /api/webhook/stripe endpoint structure"""
        try:
            # Test webhook endpoint without signature (should fail gracefully)
            response = self.session.post(
                f"{self.base_url}/webhook/stripe",
                json={"test": "data"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should return 400 for missing signature
            if response.status_code == 400:
                data = response.json()
                if "Missing Stripe signature" in data.get("detail", ""):
                    self.log_test("Stripe Webhook Endpoint", True, "Correctly validates Stripe signature requirement")
                else:
                    self.log_test("Stripe Webhook Endpoint", False, f"Unexpected error message: {data}", data)
            else:
                self.log_test("Stripe Webhook Endpoint", False, f"Expected HTTP 400, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Stripe Webhook Endpoint", False, f"Request failed: {str(e)}")

    def test_payment_transactions_collection(self):
        """Test payment transactions endpoint"""
        if not self.admin_token:
            self.log_test("Payment Transactions", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(
                f"{self.base_url}/payments/transactions",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Payment Transactions", True, f"Retrieved {len(data)} payment transactions")
                else:
                    self.log_test("Payment Transactions", False, f"Expected list, got {type(data)}", data)
            else:
                self.log_test("Payment Transactions", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Payment Transactions", False, f"Request failed: {str(e)}")

    def test_orders_api(self):
        """Test orders API endpoints"""
        if not self.admin_token:
            self.log_test("Orders API", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test GET /api/orders/
            response = self.session.get(
                f"{self.base_url}/orders/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Orders API - List", True, f"Retrieved {len(data)} orders")
                else:
                    self.log_test("Orders API - List", False, f"Expected list, got {type(data)}", data)
            else:
                self.log_test("Orders API - List", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Orders API", False, f"Request failed: {str(e)}")

    def test_create_order(self):
        """Test POST /api/orders/ - Create order"""
        if not self.admin_token:
            self.log_test("Create Order", False, "No admin token available")
            return
            
        try:
            # Sample order data
            order_data = {
                "items": [
                    {
                        "productId": TEST_PRODUCT_ID,
                        "name": "Sac à Main Élégant Noir",
                        "price": 89.99,
                        "quantity": 1,
                        "selectedColor": "Noir",
                        "selectedSize": "Moyen",
                        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
                    }
                ],
                "shippingAddress": {
                    "firstName": "Admin",
                    "lastName": "ChicBoutique",
                    "address": "123 Test Street",
                    "city": "Paris",
                    "postalCode": "75001",
                    "country": "France"
                }
            }
            
            headers = {
                "Authorization": f"Bearer {self.admin_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.post(
                f"{self.base_url}/orders/",
                json=order_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "orderId", "items", "status", "total"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Create Order", False, f"Missing fields: {missing_fields}", data)
                else:
                    self.log_test("Create Order", True, 
                                f"Order created: {data['orderId']}, Status: {data['status']}, Total: {data['total']}€")
            else:
                self.log_test("Create Order", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Create Order", False, f"Request failed: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("TKB'Shop Backend API Testing - Stripe Integration Focus")
        print("=" * 60)
        print(f"Base URL: {self.base_url}")
        print(f"Admin Email: {ADMIN_EMAIL}")
        print(f"Test Product ID: {TEST_PRODUCT_ID}")
        print("=" * 60)
        print()

        # Core API tests (Priority 1 - Homepage)
        self.test_health_endpoint()
        self.test_products_list()
        self.test_product_detail()
        
        # Authentication tests (Priority 2)
        self.test_admin_authentication()
        
        # Stripe Payment Integration tests (Priority 3 - New Integration)
        self.test_stripe_checkout_session()
        self.test_stripe_checkout_status()
        self.test_stripe_webhook_endpoint()
        self.test_payment_transactions_collection()
        
        # Orders API tests (Priority 4)
        self.test_orders_api()
        self.test_create_order()
        
        # Additional validation tests
        self.test_invalid_product_id()
        self.test_protected_endpoint_without_auth()
        self.test_admin_endpoint_with_auth()
        self.test_customer_authentication()

        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        # List failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("FAILED TESTS:")
            for result in failed_tests:
                print(f"  ❌ {result['test']}: {result['details']}")
        else:
            print("🎉 ALL TESTS PASSED!")
        
        print("=" * 60)
        
        return passed == total

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)