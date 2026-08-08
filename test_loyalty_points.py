#!/usr/bin/env python3
"""
Backend API Testing Script for Mr. COCO Bakery - Loyalty Points Earning Ratio
Tests POST /api/orders/complete endpoint with new 10:100 ratio (10 points per ₹100)
"""

import requests
import json
import sys
from datetime import datetime
from pymongo import MongoClient

# Base URL from environment
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com/api"

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "mrcoco_bakery"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test_header(test_name):
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST: {test_name}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")

def print_success(message):
    print(f"{GREEN}✅ SUCCESS: {message}{RESET}")

def print_error(message):
    print(f"{RED}❌ FAILED: {message}{RESET}")

def print_info(message):
    print(f"{YELLOW}ℹ️  INFO: {message}{RESET}")

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []

def record_test(test_name, passed, message):
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        print_success(f"{test_name}: {message}")
    else:
        tests_failed += 1
        print_error(f"{test_name}: {message}")
    test_results.append({
        'test': test_name,
        'passed': passed,
        'message': message
    })

# MongoDB connection
def get_db():
    client = MongoClient(MONGO_URL)
    return client[DB_NAME]

# ============================================================================
# TEST 1: Order ₹100 should earn 10 points
# ============================================================================
def test_order_100_rupees():
    print_test_header("Order ₹100 - Should Earn 10 Points")
    
    try:
        db = get_db()
        
        # Create test user with 0 loyalty points
        user_id = f"test_user_{datetime.now().timestamp()}"
        db.users.insert_one({
            "_id": user_id,
            "name": "Test User 100",
            "email": f"{user_id}@test.com",
            "loyaltyPoints": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test user: {user_id} with 0 loyalty points")
        
        # Create test order with total ₹100
        order_id = f"test_order_{datetime.now().timestamp()}"
        db.orders.insert_one({
            "_id": order_id,
            "userId": user_id,
            "total": 100,
            "status": "paid",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test order: {order_id} with total ₹100")
        
        # Call POST /api/orders/complete
        payload = {
            "orderId": order_id,
            "userId": user_id,
            "loyaltyPointsUsed": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/orders/complete",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response
            if data.get('success') == True:
                points_earned = data.get('pointsEarned')
                
                if points_earned == 10:
                    # Verify user's loyalty points in database
                    user = db.users.find_one({"_id": user_id})
                    if user and user.get('loyaltyPoints') == 10:
                        # Verify transaction record
                        transaction = db.transactions.find_one({
                            "userId": user_id,
                            "orderId": order_id,
                            "type": "credit",
                            "category": "loyalty_points"
                        })
                        
                        if transaction and transaction.get('loyaltyPoints') == 10:
                            record_test("Order ₹100", True, f"Earned 10 points correctly. User points: {user.get('loyaltyPoints')}, Transaction: {transaction.get('loyaltyPoints')}")
                        else:
                            record_test("Order ₹100", False, f"Transaction record incorrect or missing. Found: {transaction}")
                    else:
                        record_test("Order ₹100", False, f"User loyalty points incorrect. Expected 10, got {user.get('loyaltyPoints') if user else 'User not found'}")
                else:
                    record_test("Order ₹100", False, f"Points earned incorrect. Expected 10, got {points_earned}")
            else:
                record_test("Order ₹100", False, f"Response success is false: {data}")
        else:
            record_test("Order ₹100", False, f"Unexpected status code: {response.status_code}")
        
        # Cleanup
        db.users.delete_one({"_id": user_id})
        db.orders.delete_one({"_id": order_id})
        db.transactions.delete_many({"userId": user_id})
        
    except Exception as e:
        record_test("Order ₹100", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 2: Order ₹250 should earn 20 points
# ============================================================================
def test_order_250_rupees():
    print_test_header("Order ₹250 - Should Earn 20 Points")
    
    try:
        db = get_db()
        
        # Create test user with 0 loyalty points
        user_id = f"test_user_{datetime.now().timestamp()}"
        db.users.insert_one({
            "_id": user_id,
            "name": "Test User 250",
            "email": f"{user_id}@test.com",
            "loyaltyPoints": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test user: {user_id} with 0 loyalty points")
        
        # Create test order with total ₹250
        order_id = f"test_order_{datetime.now().timestamp()}"
        db.orders.insert_one({
            "_id": order_id,
            "userId": user_id,
            "total": 250,
            "status": "paid",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test order: {order_id} with total ₹250")
        
        # Call POST /api/orders/complete
        payload = {
            "orderId": order_id,
            "userId": user_id,
            "loyaltyPointsUsed": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/orders/complete",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response
            if data.get('success') == True:
                points_earned = data.get('pointsEarned')
                
                # Math.floor(250/100) * 10 = 2 * 10 = 20
                if points_earned == 20:
                    # Verify user's loyalty points in database
                    user = db.users.find_one({"_id": user_id})
                    if user and user.get('loyaltyPoints') == 20:
                        # Verify transaction record
                        transaction = db.transactions.find_one({
                            "userId": user_id,
                            "orderId": order_id,
                            "type": "credit",
                            "category": "loyalty_points"
                        })
                        
                        if transaction and transaction.get('loyaltyPoints') == 20:
                            record_test("Order ₹250", True, f"Earned 20 points correctly. User points: {user.get('loyaltyPoints')}, Transaction: {transaction.get('loyaltyPoints')}")
                        else:
                            record_test("Order ₹250", False, f"Transaction record incorrect or missing. Found: {transaction}")
                    else:
                        record_test("Order ₹250", False, f"User loyalty points incorrect. Expected 20, got {user.get('loyaltyPoints') if user else 'User not found'}")
                else:
                    record_test("Order ₹250", False, f"Points earned incorrect. Expected 20, got {points_earned}")
            else:
                record_test("Order ₹250", False, f"Response success is false: {data}")
        else:
            record_test("Order ₹250", False, f"Unexpected status code: {response.status_code}")
        
        # Cleanup
        db.users.delete_one({"_id": user_id})
        db.orders.delete_one({"_id": order_id})
        db.transactions.delete_many({"userId": user_id})
        
    except Exception as e:
        record_test("Order ₹250", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 3: Order ₹500 should earn 50 points
# ============================================================================
def test_order_500_rupees():
    print_test_header("Order ₹500 - Should Earn 50 Points")
    
    try:
        db = get_db()
        
        # Create test user with 0 loyalty points
        user_id = f"test_user_{datetime.now().timestamp()}"
        db.users.insert_one({
            "_id": user_id,
            "name": "Test User 500",
            "email": f"{user_id}@test.com",
            "loyaltyPoints": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test user: {user_id} with 0 loyalty points")
        
        # Create test order with total ₹500
        order_id = f"test_order_{datetime.now().timestamp()}"
        db.orders.insert_one({
            "_id": order_id,
            "userId": user_id,
            "total": 500,
            "status": "paid",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test order: {order_id} with total ₹500")
        
        # Call POST /api/orders/complete
        payload = {
            "orderId": order_id,
            "userId": user_id,
            "loyaltyPointsUsed": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/orders/complete",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response
            if data.get('success') == True:
                points_earned = data.get('pointsEarned')
                
                # Math.floor(500/100) * 10 = 5 * 10 = 50
                if points_earned == 50:
                    # Verify user's loyalty points in database
                    user = db.users.find_one({"_id": user_id})
                    if user and user.get('loyaltyPoints') == 50:
                        # Verify transaction record
                        transaction = db.transactions.find_one({
                            "userId": user_id,
                            "orderId": order_id,
                            "type": "credit",
                            "category": "loyalty_points"
                        })
                        
                        if transaction and transaction.get('loyaltyPoints') == 50:
                            record_test("Order ₹500", True, f"Earned 50 points correctly. User points: {user.get('loyaltyPoints')}, Transaction: {transaction.get('loyaltyPoints')}")
                        else:
                            record_test("Order ₹500", False, f"Transaction record incorrect or missing. Found: {transaction}")
                    else:
                        record_test("Order ₹500", False, f"User loyalty points incorrect. Expected 50, got {user.get('loyaltyPoints') if user else 'User not found'}")
                else:
                    record_test("Order ₹500", False, f"Points earned incorrect. Expected 50, got {points_earned}")
            else:
                record_test("Order ₹500", False, f"Response success is false: {data}")
        else:
            record_test("Order ₹500", False, f"Unexpected status code: {response.status_code}")
        
        # Cleanup
        db.users.delete_one({"_id": user_id})
        db.orders.delete_one({"_id": order_id})
        db.transactions.delete_many({"userId": user_id})
        
    except Exception as e:
        record_test("Order ₹500", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 4: Order ₹999 should earn 90 points
# ============================================================================
def test_order_999_rupees():
    print_test_header("Order ₹999 - Should Earn 90 Points")
    
    try:
        db = get_db()
        
        # Create test user with 0 loyalty points
        user_id = f"test_user_{datetime.now().timestamp()}"
        db.users.insert_one({
            "_id": user_id,
            "name": "Test User 999",
            "email": f"{user_id}@test.com",
            "loyaltyPoints": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test user: {user_id} with 0 loyalty points")
        
        # Create test order with total ₹999
        order_id = f"test_order_{datetime.now().timestamp()}"
        db.orders.insert_one({
            "_id": order_id,
            "userId": user_id,
            "total": 999,
            "status": "paid",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test order: {order_id} with total ₹999")
        
        # Call POST /api/orders/complete
        payload = {
            "orderId": order_id,
            "userId": user_id,
            "loyaltyPointsUsed": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/orders/complete",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response
            if data.get('success') == True:
                points_earned = data.get('pointsEarned')
                
                # Math.floor(999/100) * 10 = 9 * 10 = 90
                if points_earned == 90:
                    # Verify user's loyalty points in database
                    user = db.users.find_one({"_id": user_id})
                    if user and user.get('loyaltyPoints') == 90:
                        # Verify transaction record
                        transaction = db.transactions.find_one({
                            "userId": user_id,
                            "orderId": order_id,
                            "type": "credit",
                            "category": "loyalty_points"
                        })
                        
                        if transaction and transaction.get('loyaltyPoints') == 90:
                            record_test("Order ₹999", True, f"Earned 90 points correctly. User points: {user.get('loyaltyPoints')}, Transaction: {transaction.get('loyaltyPoints')}")
                        else:
                            record_test("Order ₹999", False, f"Transaction record incorrect or missing. Found: {transaction}")
                    else:
                        record_test("Order ₹999", False, f"User loyalty points incorrect. Expected 90, got {user.get('loyaltyPoints') if user else 'User not found'}")
                else:
                    record_test("Order ₹999", False, f"Points earned incorrect. Expected 90, got {points_earned}")
            else:
                record_test("Order ₹999", False, f"Response success is false: {data}")
        else:
            record_test("Order ₹999", False, f"Unexpected status code: {response.status_code}")
        
        # Cleanup
        db.users.delete_one({"_id": user_id})
        db.orders.delete_one({"_id": order_id})
        db.transactions.delete_many({"userId": user_id})
        
    except Exception as e:
        record_test("Order ₹999", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 5: Order ₹1000 should earn 100 points
# ============================================================================
def test_order_1000_rupees():
    print_test_header("Order ₹1000 - Should Earn 100 Points")
    
    try:
        db = get_db()
        
        # Create test user with 0 loyalty points
        user_id = f"test_user_{datetime.now().timestamp()}"
        db.users.insert_one({
            "_id": user_id,
            "name": "Test User 1000",
            "email": f"{user_id}@test.com",
            "loyaltyPoints": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test user: {user_id} with 0 loyalty points")
        
        # Create test order with total ₹1000
        order_id = f"test_order_{datetime.now().timestamp()}"
        db.orders.insert_one({
            "_id": order_id,
            "userId": user_id,
            "total": 1000,
            "status": "paid",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print_info(f"Created test order: {order_id} with total ₹1000")
        
        # Call POST /api/orders/complete
        payload = {
            "orderId": order_id,
            "userId": user_id,
            "loyaltyPointsUsed": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/orders/complete",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response
            if data.get('success') == True:
                points_earned = data.get('pointsEarned')
                
                # Math.floor(1000/100) * 10 = 10 * 10 = 100
                if points_earned == 100:
                    # Verify user's loyalty points in database
                    user = db.users.find_one({"_id": user_id})
                    if user and user.get('loyaltyPoints') == 100:
                        # Verify transaction record
                        transaction = db.transactions.find_one({
                            "userId": user_id,
                            "orderId": order_id,
                            "type": "credit",
                            "category": "loyalty_points"
                        })
                        
                        if transaction and transaction.get('loyaltyPoints') == 100:
                            record_test("Order ₹1000", True, f"Earned 100 points correctly. User points: {user.get('loyaltyPoints')}, Transaction: {transaction.get('loyaltyPoints')}")
                        else:
                            record_test("Order ₹1000", False, f"Transaction record incorrect or missing. Found: {transaction}")
                    else:
                        record_test("Order ₹1000", False, f"User loyalty points incorrect. Expected 100, got {user.get('loyaltyPoints') if user else 'User not found'}")
                else:
                    record_test("Order ₹1000", False, f"Points earned incorrect. Expected 100, got {points_earned}")
            else:
                record_test("Order ₹1000", False, f"Response success is false: {data}")
        else:
            record_test("Order ₹1000", False, f"Unexpected status code: {response.status_code}")
        
        # Cleanup
        db.users.delete_one({"_id": user_id})
        db.orders.delete_one({"_id": order_id})
        db.transactions.delete_many({"userId": user_id})
        
    except Exception as e:
        record_test("Order ₹1000", False, f"Exception occurred: {str(e)}")

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================
def main():
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}Mr. COCO Bakery - Loyalty Points Earning Ratio Testing{RESET}")
    print(f"{BLUE}Testing POST /api/orders/complete with 10:100 ratio (10 points per ₹100){RESET}")
    print(f"{BLUE}Base URL: {BASE_URL}{RESET}")
    print(f"{BLUE}Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    # Run all tests in sequence
    test_order_100_rupees()
    test_order_250_rupees()
    test_order_500_rupees()
    test_order_999_rupees()
    test_order_1000_rupees()
    
    # Print summary
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    print(f"{GREEN}Tests Passed: {tests_passed}{RESET}")
    print(f"{RED}Tests Failed: {tests_failed}{RESET}")
    print(f"Total Tests: {tests_passed + tests_failed}")
    if tests_passed + tests_failed > 0:
        print(f"Success Rate: {(tests_passed / (tests_passed + tests_failed) * 100):.1f}%")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    # Exit with appropriate code
    sys.exit(0 if tests_failed == 0 else 1)

if __name__ == "__main__":
    main()
