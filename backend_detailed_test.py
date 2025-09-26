#!/usr/bin/env python3
"""
Detailed Backend Testing for TKB'Shop - Focus on Specific Corrections
Tests the specific fixes mentioned in the review request
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://tkbshop-market.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@chicboutique.com"
ADMIN_PASSWORD = "admin123"
TEST_PRODUCT_ID = "68d59c8326f2400d13ac6122"

def test_pyobjectid_fix():
    """Test that PyObjectId validation fix is working"""
    print("🔍 Testing PyObjectId Fix in Authentication...")
    
    try:
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ PyObjectId Fix SUCCESSFUL")
            print(f"   - JWT Token Generated: {data['access_token'][:50]}...")
            print(f"   - User Data Retrieved: {data['user']['firstName']} {data['user']['lastName']}")
            print(f"   - User Role: {data['user']['role']}")
            print(f"   - User Email: {data['user']['email']}")
            return True, data['access_token']
        else:
            print("❌ PyObjectId Fix FAILED")
            print(f"   - Error: {response.text}")
            return False, None
            
    except Exception as e:
        print("❌ PyObjectId Fix FAILED")
        print(f"   - Exception: {str(e)}")
        return False, None

def test_product_detail_api():
    """Test GET /api/products/{id} with specific product ID"""
    print(f"\n🔍 Testing Product Detail API with ID: {TEST_PRODUCT_ID}...")
    
    try:
        response = requests.get(f"{BASE_URL}/products/{TEST_PRODUCT_ID}", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Product Detail API SUCCESSFUL")
            print(f"   - Product ID: {data.get('id')}")
            print(f"   - Product Name: {data.get('name')}")
            print(f"   - Product Price: {data.get('price')}€")
            print(f"   - Product Category: {data.get('category')}")
            print(f"   - In Stock: {data.get('inStock')}")
            print(f"   - Colors Available: {data.get('colors', [])}")
            print(f"   - Sizes Available: {data.get('sizes', [])}")
            return True
        else:
            print("❌ Product Detail API FAILED")
            print(f"   - Error: {response.text}")
            return False
            
    except Exception as e:
        print("❌ Product Detail API FAILED")
        print(f"   - Exception: {str(e)}")
        return False

def test_general_apis():
    """Test all general API routes"""
    print("\n🔍 Testing General API Routes...")
    
    results = {}
    
    # Test Health Check
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ GET /api/health - WORKING")
            print(f"   - Status: {data.get('status')}")
            print(f"   - Message: {data.get('message')}")
            results['health'] = True
        else:
            print("❌ GET /api/health - FAILED")
            results['health'] = False
    except Exception as e:
        print(f"❌ GET /api/health - EXCEPTION: {str(e)}")
        results['health'] = False
    
    # Test Products List
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/products - WORKING")
            print(f"   - Products Count: {len(data)}")
            if len(data) > 0:
                print(f"   - Sample Product: {data[0].get('name', 'N/A')}")
            results['products'] = True
        else:
            print("❌ GET /api/products - FAILED")
            results['products'] = False
    except Exception as e:
        print(f"❌ GET /api/products - EXCEPTION: {str(e)}")
        results['products'] = False
    
    return results

def test_jwt_token_validation(token):
    """Test JWT token validation with protected endpoint"""
    print(f"\n🔍 Testing JWT Token Validation...")
    
    if not token:
        print("❌ No token available for testing")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/profile", headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ JWT Token Validation SUCCESSFUL")
            print(f"   - User Profile Retrieved: {data.get('firstName')} {data.get('lastName')}")
            print(f"   - Email: {data.get('email')}")
            print(f"   - Role: {data.get('role')}")
            return True
        else:
            print("❌ JWT Token Validation FAILED")
            print(f"   - Error: {response.text}")
            return False
            
    except Exception as e:
        print("❌ JWT Token Validation FAILED")
        print(f"   - Exception: {str(e)}")
        return False

def test_error_handling():
    """Test error handling scenarios"""
    print(f"\n🔍 Testing Error Handling...")
    
    results = {}
    
    # Test invalid product ID
    try:
        response = requests.get(f"{BASE_URL}/products/invalid-id", timeout=10)
        if response.status_code == 400:
            print("✅ Invalid Product ID Handling - WORKING")
            results['invalid_id'] = True
        else:
            print(f"❌ Invalid Product ID Handling - Expected 400, got {response.status_code}")
            results['invalid_id'] = False
    except Exception as e:
        print(f"❌ Invalid Product ID Handling - EXCEPTION: {str(e)}")
        results['invalid_id'] = False
    
    # Test non-existent product ID
    try:
        fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but non-existent
        response = requests.get(f"{BASE_URL}/products/{fake_id}", timeout=10)
        if response.status_code == 404:
            print("✅ Non-existent Product ID Handling - WORKING")
            results['nonexistent_id'] = True
        else:
            print(f"❌ Non-existent Product ID Handling - Expected 404, got {response.status_code}")
            results['nonexistent_id'] = False
    except Exception as e:
        print(f"❌ Non-existent Product ID Handling - EXCEPTION: {str(e)}")
        results['nonexistent_id'] = False
    
    # Test invalid login credentials
    try:
        login_data = {"email": "invalid@test.com", "password": "wrongpassword"}
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=10)
        if response.status_code == 401:
            print("✅ Invalid Login Credentials Handling - WORKING")
            results['invalid_login'] = True
        else:
            print(f"❌ Invalid Login Credentials Handling - Expected 401, got {response.status_code}")
            results['invalid_login'] = False
    except Exception as e:
        print(f"❌ Invalid Login Credentials Handling - EXCEPTION: {str(e)}")
        results['invalid_login'] = False
    
    return results

def main():
    """Run all detailed tests"""
    print("=" * 70)
    print("TKB'Shop Backend - Detailed Testing of Specific Corrections")
    print("=" * 70)
    print(f"Backend URL: {BASE_URL}")
    print(f"Admin Credentials: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    print(f"Test Product ID: {TEST_PRODUCT_ID}")
    print("=" * 70)
    
    # Track all test results
    all_results = {}
    
    # Test 1: PyObjectId Fix in Authentication
    auth_success, token = test_pyobjectid_fix()
    all_results['pyobjectid_fix'] = auth_success
    
    # Test 2: Product Detail API
    product_detail_success = test_product_detail_api()
    all_results['product_detail'] = product_detail_success
    
    # Test 3: General APIs
    general_results = test_general_apis()
    all_results.update(general_results)
    
    # Test 4: JWT Token Validation
    jwt_success = test_jwt_token_validation(token)
    all_results['jwt_validation'] = jwt_success
    
    # Test 5: Error Handling
    error_results = test_error_handling()
    all_results.update(error_results)
    
    # Final Summary
    print("\n" + "=" * 70)
    print("DETAILED TEST SUMMARY")
    print("=" * 70)
    
    print("\n🔧 SPECIFIC CORRECTIONS TESTED:")
    print(f"   ✅ PyObjectId Fix in Authentication: {'PASS' if all_results.get('pyobjectid_fix') else 'FAIL'}")
    print(f"   ✅ Product Detail API (ID: {TEST_PRODUCT_ID}): {'PASS' if all_results.get('product_detail') else 'FAIL'}")
    
    print("\n🌐 GENERAL API ROUTES:")
    print(f"   ✅ Health Check (/api/health): {'PASS' if all_results.get('health') else 'FAIL'}")
    print(f"   ✅ Products List (/api/products): {'PASS' if all_results.get('products') else 'FAIL'}")
    print(f"   ✅ JWT Token Validation: {'PASS' if all_results.get('jwt_validation') else 'FAIL'}")
    
    print("\n🛡️ ERROR HANDLING:")
    print(f"   ✅ Invalid Product ID: {'PASS' if all_results.get('invalid_id') else 'FAIL'}")
    print(f"   ✅ Non-existent Product ID: {'PASS' if all_results.get('nonexistent_id') else 'FAIL'}")
    print(f"   ✅ Invalid Login Credentials: {'PASS' if all_results.get('invalid_login') else 'FAIL'}")
    
    # Calculate overall success
    total_tests = len(all_results)
    passed_tests = sum(1 for result in all_results.values() if result)
    success_rate = (passed_tests / total_tests) * 100
    
    print(f"\n📊 OVERALL RESULTS:")
    print(f"   Total Tests: {total_tests}")
    print(f"   Passed: {passed_tests}")
    print(f"   Failed: {total_tests - passed_tests}")
    print(f"   Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("\n🎉 BACKEND IS FULLY FUNCTIONAL!")
        print("   All critical corrections are working properly.")
    elif success_rate >= 75:
        print("\n⚠️ BACKEND IS MOSTLY FUNCTIONAL")
        print("   Minor issues detected but core functionality works.")
    else:
        print("\n❌ BACKEND HAS CRITICAL ISSUES")
        print("   Major problems detected that need immediate attention.")
    
    print("=" * 70)
    
    return success_rate >= 90

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)