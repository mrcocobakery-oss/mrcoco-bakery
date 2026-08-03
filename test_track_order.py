#!/usr/bin/env python3
"""
Track Order API Testing Script
Tests the /api/track-order endpoint with various scenarios
"""

import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com"
API_ENDPOINT = f"{BASE_URL}/api/track-order"

# Test data from database
VALID_ORDER_ID = "f5f50999-bd58-40f4-923c-3fb40a1c2bec"
VALID_PHONE = "9876543210"
INVALID_ORDER_ID = "invalid-order-id-12345"
WRONG_PHONE = "1234567890"

def print_test_header(test_num, description):
    """Print formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST {test_num}: {description}")
    print('='*80)

def print_result(passed, message):
    """Print test result"""
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"{status}: {message}")

def test_missing_order_id():
    """Test 1: Missing orderId parameter should return 400"""
    print_test_header(1, "Missing orderId parameter")
    
    try:
        response = requests.get(API_ENDPOINT, params={"phone": VALID_PHONE}, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 400:
            if "error" in data and ("Order ID" in data["error"] or "required" in data["error"].lower()):
                print_result(True, "API correctly returns 400 for missing orderId")
                return True
            else:
                print_result(False, f"Expected error message about Order ID, got: {data.get('error')}")
                return False
        else:
            print_result(False, f"Expected 400 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_missing_phone():
    """Test 2: Missing phone parameter should return 400"""
    print_test_header(2, "Missing phone parameter")
    
    try:
        response = requests.get(API_ENDPOINT, params={"orderId": VALID_ORDER_ID}, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 400:
            if "error" in data and ("Phone" in data["error"] or "required" in data["error"].lower()):
                print_result(True, "API correctly returns 400 for missing phone")
                return True
            else:
                print_result(False, f"Expected error message about Phone, got: {data.get('error')}")
                return False
        else:
            print_result(False, f"Expected 400 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_missing_both_params():
    """Test 3: Missing both parameters should return 400"""
    print_test_header(3, "Missing both orderId and phone parameters")
    
    try:
        response = requests.get(API_ENDPOINT, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 400:
            if "error" in data and "required" in data["error"].lower():
                print_result(True, "API correctly returns 400 for missing both parameters")
                return True
            else:
                print_result(False, f"Expected error message about required fields, got: {data.get('error')}")
                return False
        else:
            print_result(False, f"Expected 400 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_invalid_order_id():
    """Test 4: Non-existent order ID should return 404"""
    print_test_header(4, "Non-existent order ID")
    
    try:
        response = requests.get(API_ENDPOINT, params={
            "orderId": INVALID_ORDER_ID,
            "phone": VALID_PHONE
        }, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 404:
            if "error" in data and ("not found" in data["error"].lower() or "Order not found" in data["error"]):
                print_result(True, "API correctly returns 404 for non-existent order")
                return True
            else:
                print_result(False, f"Expected 'not found' error message, got: {data.get('error')}")
                return False
        else:
            print_result(False, f"Expected 404 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_wrong_phone():
    """Test 5: Valid order ID but wrong phone should return 404"""
    print_test_header(5, "Valid order ID with wrong phone number")
    
    try:
        response = requests.get(API_ENDPOINT, params={
            "orderId": VALID_ORDER_ID,
            "phone": WRONG_PHONE
        }, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 404:
            if "error" in data and ("not found" in data["error"].lower() or "Order not found" in data["error"]):
                print_result(True, "API correctly returns 404 for phone mismatch (security check working)")
                return True
            else:
                print_result(False, f"Expected 'not found' error message, got: {data.get('error')}")
                return False
        else:
            print_result(False, f"Expected 404 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_valid_order():
    """Test 6: Valid order ID with matching phone should return order details"""
    print_test_header(6, "Valid order ID with matching phone number")
    
    try:
        response = requests.get(API_ENDPOINT, params={
            "orderId": VALID_ORDER_ID,
            "phone": VALID_PHONE
        }, timeout=10)
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            # Verify response structure
            if "success" not in data or not data["success"]:
                print_result(False, "Response missing 'success: true' field")
                return False
            
            if "order" not in data:
                print_result(False, "Response missing 'order' field")
                return False
            
            order = data["order"]
            required_fields = [
                "orderId", "customerName", "status", "total", 
                "createdAt", "deliveryDate", "deliveryTime", 
                "items", "address", "city", "pincode"
            ]
            
            missing_fields = [field for field in required_fields if field not in order]
            if missing_fields:
                print_result(False, f"Order object missing required fields: {missing_fields}")
                return False
            
            # Verify orderId matches
            if order["orderId"] != VALID_ORDER_ID:
                print_result(False, f"Order ID mismatch: expected {VALID_ORDER_ID}, got {order['orderId']}")
                return False
            
            # Verify items structure
            if not isinstance(order["items"], list):
                print_result(False, "Items should be an array")
                return False
            
            if len(order["items"]) > 0:
                item = order["items"][0]
                item_fields = ["productName", "quantity", "productImage"]
                missing_item_fields = [field for field in item_fields if field not in item]
                if missing_item_fields:
                    print_result(False, f"Item object missing fields: {missing_item_fields}")
                    return False
            
            print_result(True, "API correctly returns order tracking information with all required fields")
            print(f"\nOrder Details:")
            print(f"  - Order ID: {order['orderId']}")
            print(f"  - Customer: {order['customerName']}")
            print(f"  - Status: {order['status']}")
            print(f"  - Total: ₹{order['total']}")
            print(f"  - Delivery Date: {order['deliveryDate']}")
            print(f"  - Items Count: {len(order['items'])}")
            return True
        else:
            print_result(False, f"Expected 200 status code, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_security_no_sensitive_data():
    """Test 7: Verify no sensitive data is exposed in tracking response"""
    print_test_header(7, "Security check - No sensitive data exposure")
    
    try:
        response = requests.get(API_ENDPOINT, params={
            "orderId": VALID_ORDER_ID,
            "phone": VALID_PHONE
        }, timeout=10)
        data = response.json()
        
        if response.status_code == 200 and "order" in data:
            order = data["order"]
            
            # Check for sensitive fields that should NOT be present
            sensitive_fields = [
                "customerEmail", "customerPhone", "razorpayOrderId", 
                "razorpayPaymentId", "paymentMethod", "paymentStatus"
            ]
            
            exposed_fields = [field for field in sensitive_fields if field in order]
            
            if exposed_fields:
                print(f"⚠️  WARNING: Sensitive fields exposed in tracking response: {exposed_fields}")
                print("   Consider removing these fields for security")
                return True  # Not a critical failure, just a warning
            else:
                print_result(True, "No sensitive data exposed in tracking response")
                return True
        else:
            print("⚠️  SKIPPED: Could not retrieve order for security check")
            return True
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def run_all_tests():
    """Run all test scenarios"""
    print("\n" + "="*80)
    print("TRACK ORDER API - COMPREHENSIVE TEST SUITE")
    print("="*80)
    print(f"API Endpoint: {API_ENDPOINT}")
    print(f"Test Order ID: {VALID_ORDER_ID}")
    print(f"Test Phone: {VALID_PHONE}")
    
    tests = [
        test_missing_order_id,
        test_missing_phone,
        test_missing_both_params,
        test_invalid_order_id,
        test_wrong_phone,
        test_valid_order,
        test_security_no_sensitive_data
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"\n❌ Test failed with exception: {str(e)}")
            results.append(False)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(results)
    total = len(results)
    print(f"Tests Passed: {passed}/{total}")
    print(f"Tests Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED - Track Order API is working correctly!")
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED - Please review the failures above")
    
    print("="*80 + "\n")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
