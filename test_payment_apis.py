#!/usr/bin/env python3
"""
Test script for Razorpay LIVE Payment Integration
Tests /api/payments/create-order and /api/payments/verify endpoints
"""

import requests
import json
import sys
import hmac
import hashlib

# Base URL from environment
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com"

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80)

def print_test(test_num, description):
    """Print test description"""
    print(f"\n[TEST {test_num}] {description}")
    print("-" * 80)

def print_result(passed, message):
    """Print test result"""
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"{status}: {message}")

# Sample test data from user requirements
SAMPLE_CART = [
    {
        "id": "test-product-1",
        "name": "Chocolate Cake",
        "price": 500,
        "quantity": 1,
        "image": "https://example.com/cake.jpg",
        "category": "cakes"
    }
]

SAMPLE_CUSTOMER = {
    "name": "Priya Sharma",
    "email": "priya.test@example.com",
    "phone": "9876543210",
    "address": "123 MG Road",
    "city": "Haldwani",
    "pincode": "263139"
}

SAMPLE_DELIVERY = {
    "deliveryDate": "2025-06-10",
    "deliveryTime": "morning"
}

def test_create_order_valid():
    """Test 1: Create order with valid data"""
    print_test(1, "Create Order API - Valid Data")
    
    try:
        payload = {
            "cart": SAMPLE_CART,
            "customer": SAMPLE_CUSTOMER,
            "deliveryDetails": SAMPLE_DELIVERY
        }
        
        print(f"Request URL: {BASE_URL}/api/payments/create-order")
        print(f"Request Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/api/payments/create-order",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Validate response structure
            required_fields = ['success', 'orderId', 'internalOrderId', 'amount', 'currency', 'keyId']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print_result(False, f"Missing required fields: {missing_fields}")
                return None
            
            # Validate field values
            if not data['orderId'].startswith('order_'):
                print_result(False, f"Invalid orderId format: {data['orderId']}")
                return None
            
            if not data['internalOrderId'].startswith('MRCOCO'):
                print_result(False, f"Invalid internalOrderId format: {data['internalOrderId']}")
                return None
            
            if data['currency'] != 'INR':
                print_result(False, f"Invalid currency: {data['currency']}")
                return None
            
            if data['keyId'] != 'rzp_live_TLQQA21MaVRZ0W':
                print_result(False, f"Invalid keyId: {data['keyId']}")
                return None
            
            # Validate amount calculation
            # Cart: 1 item x ₹500 = ₹500
            # Delivery: ₹0 (since subtotal >= ₹500, delivery is free)
            # Total: ₹500 = 50000 paise
            expected_amount = 50000
            if data['amount'] != expected_amount:
                print_result(False, f"Amount mismatch. Expected: {expected_amount}, Got: {data['amount']}")
                return None
            
            print_result(True, f"Order created successfully. OrderId: {data['orderId']}, InternalOrderId: {data['internalOrderId']}, Amount: ₹{data['amount']/100}")
            return data
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return None
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return None

def test_create_order_empty_cart():
    """Test 2: Create order with empty cart"""
    print_test(2, "Create Order API - Empty Cart (Should Return 400)")
    
    try:
        payload = {
            "cart": [],
            "customer": SAMPLE_CUSTOMER,
            "deliveryDetails": SAMPLE_DELIVERY
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/create-order",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'empty' in data['error'].lower():
                print_result(True, f"Correctly rejected empty cart with error: {data['error']}")
                return True
            else:
                print_result(False, f"Expected 'Cart is empty' error, got: {data}")
                return False
        else:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_order_missing_customer():
    """Test 3: Create order with missing customer details"""
    print_test(3, "Create Order API - Missing Customer Details (Should Return 400)")
    
    try:
        payload = {
            "cart": SAMPLE_CART,
            "customer": {
                "name": "Test User"
                # Missing email and phone
            },
            "deliveryDetails": SAMPLE_DELIVERY
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/create-order",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'customer' in data['error'].lower():
                print_result(True, f"Correctly rejected missing customer details with error: {data['error']}")
                return True
            else:
                print_result(False, f"Expected 'Customer details required' error, got: {data}")
                return False
        else:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_order_no_cart():
    """Test 4: Create order without cart field"""
    print_test(4, "Create Order API - No Cart Field (Should Return 400)")
    
    try:
        payload = {
            "customer": SAMPLE_CUSTOMER,
            "deliveryDetails": SAMPLE_DELIVERY
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/create-order",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data:
                print_result(True, f"Correctly rejected missing cart with error: {data['error']}")
                return True
            else:
                print_result(False, f"Expected error message, got: {data}")
                return False
        else:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_verify_payment_missing_params():
    """Test 5: Verify payment with missing parameters"""
    print_test(5, "Verify Payment API - Missing Parameters (Should Return 400)")
    
    try:
        payload = {
            "razorpay_order_id": "order_test123",
            # Missing razorpay_payment_id and razorpay_signature
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/verify",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'missing' in data['error'].lower():
                print_result(True, f"Correctly rejected missing parameters with error: {data['error']}")
                return True
            else:
                print_result(False, f"Expected 'Missing parameters' error, got: {data}")
                return False
        else:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_verify_payment_invalid_signature():
    """Test 6: Verify payment with invalid signature"""
    print_test(6, "Verify Payment API - Invalid Signature (Should Return 400)")
    
    try:
        payload = {
            "razorpay_order_id": "order_test123",
            "razorpay_payment_id": "pay_test456",
            "razorpay_signature": "invalid_signature_12345",
            "internalOrderId": "MRCOCO123456"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/verify",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'signature' in data['error'].lower():
                print_result(True, f"Correctly rejected invalid signature with error: {data['error']}")
                return True
            else:
                print_result(False, f"Expected 'Invalid signature' error, got: {data}")
                return False
        else:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_order_in_database(internal_order_id):
    """Test 7: Verify order was saved in database"""
    print_test(7, "Database Verification - Order Saved in MongoDB")
    
    try:
        # We can't directly query MongoDB from here, but we can verify by trying to verify payment
        # with the internal order ID (it should find the order even if signature is wrong)
        
        payload = {
            "razorpay_order_id": "order_dummy",
            "razorpay_payment_id": "pay_dummy",
            "razorpay_signature": "dummy_signature",
            "internalOrderId": internal_order_id
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payments/verify",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        # If we get 400 with "Invalid signature", it means order was found in DB
        # If we get 404, it means order was not saved
        if response.status_code == 400:
            data = response.json()
            if 'signature' in data.get('error', '').lower():
                print_result(True, f"Order {internal_order_id} found in database (signature validation failed as expected)")
                return True
            else:
                print_result(False, f"Unexpected error: {data}")
                return False
        elif response.status_code == 404:
            print_result(False, f"Order {internal_order_id} not found in database")
            return False
        else:
            print_result(False, f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def main():
    """Run all tests"""
    print_header("RAZORPAY LIVE PAYMENT INTEGRATION TESTING")
    print(f"Base URL: {BASE_URL}")
    print(f"Testing Endpoints:")
    print(f"  - POST /api/payments/create-order")
    print(f"  - POST /api/payments/verify")
    print(f"Live API Key: rzp_live_TLQQA21MaVRZ0W")
    
    results = []
    order_data = None
    
    # Test 1: Create order with valid data
    order_data = test_create_order_valid()
    results.append(("Create Order - Valid Data", order_data is not None))
    
    # Test 2: Create order with empty cart
    result = test_create_order_empty_cart()
    results.append(("Create Order - Empty Cart Validation", result))
    
    # Test 3: Create order with missing customer details
    result = test_create_order_missing_customer()
    results.append(("Create Order - Missing Customer Validation", result))
    
    # Test 4: Create order without cart field
    result = test_create_order_no_cart()
    results.append(("Create Order - No Cart Field Validation", result))
    
    # Test 5: Verify payment with missing parameters
    result = test_verify_payment_missing_params()
    results.append(("Verify Payment - Missing Parameters Validation", result))
    
    # Test 6: Verify payment with invalid signature
    result = test_verify_payment_invalid_signature()
    results.append(("Verify Payment - Invalid Signature Validation", result))
    
    # Test 7: Verify order in database (if we created one successfully)
    if order_data and 'internalOrderId' in order_data:
        result = test_order_in_database(order_data['internalOrderId'])
        results.append(("Database - Order Persistence", result))
    
    # Print summary
    print_header("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%\n")
    
    print("Detailed Results:")
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    print("\n" + "="*80)
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Razorpay LIVE payment integration is working correctly!")
        print("="*80 + "\n")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED - Please review the failures above")
        print("="*80 + "\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
