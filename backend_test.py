#!/usr/bin/env python3
"""
Backend Test Script for Mr. COCO Bakery File Upload System
Tests all file upload API endpoints and functionality
"""

import requests
import os
import io
from PIL import Image
import json
from pymongo import MongoClient
from datetime import datetime

# Configuration
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com/api"
UPLOAD_ENDPOINT = f"{BASE_URL}/uploads"
RAZORPAY_ORDER_ENDPOINT = f"{BASE_URL}/razorpay/order"
RAZORPAY_VERIFY_ENDPOINT = f"{BASE_URL}/razorpay/verify"
RAZORPAY_WEBHOOK_ENDPOINT = f"{BASE_URL}/razorpay/webhook"
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'mrcoco_bakery')

# Test results tracking
test_results = {
    'passed': 0,
    'failed': 0,
    'tests': []
}

def log_test(test_name, passed, message):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {test_name}")
    print(f"   {message}")
    print()
    
    test_results['tests'].append({
        'name': test_name,
        'passed': passed,
        'message': message
    })
    
    if passed:
        test_results['passed'] += 1
    else:
        test_results['failed'] += 1

def create_test_image(filename, size_kb=50):
    """Create a test image file"""
    # Create a simple colored image
    img = Image.new('RGB', (800, 600), color=(255, 200, 100))
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=85)
    img_bytes.seek(0)
    
    return img_bytes

def create_test_pdf(filename, size_kb=50):
    """Create a test PDF file"""
    # Create a simple PDF-like content
    pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n410\n%%EOF"
    
    return io.BytesIO(pdf_content)

def create_large_file(size_mb=11):
    """Create a large file for size validation testing"""
    # Create a file larger than 10MB
    size_bytes = size_mb * 1024 * 1024
    large_data = b'0' * size_bytes
    return io.BytesIO(large_data)

def test_product_image_upload():
    """Test 1: Product Image Upload"""
    try:
        # Create test image
        img_file = create_test_image('test_product.jpg')
        
        # Prepare form data
        files = {'file': ('test_product.jpg', img_file, 'image/jpeg')}
        data = {
            'kind': 'product_image',
            'userId': 'test-user-001'
        }
        
        # Upload
        response = requests.post(UPLOAD_ENDPOINT, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'id', 'url', 'filename', 'size', 'mimeType']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Product Image Upload", False, f"Missing fields in response: {missing_fields}")
                return None
            
            if result['success'] and result['mimeType'] == 'image/jpeg':
                log_test("Product Image Upload", True, 
                        f"Successfully uploaded product image. ID: {result['id']}, URL: {result['url']}")
                return result
            else:
                log_test("Product Image Upload", False, f"Unexpected response: {result}")
                return None
        else:
            log_test("Product Image Upload", False, 
                    f"Upload failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Product Image Upload", False, f"Exception: {str(e)}")
        return None

def test_customer_photo_upload():
    """Test 2: Customer Photo Upload"""
    try:
        # Create test image
        img_file = create_test_image('customer_photo.jpg')
        
        # Prepare form data
        files = {'file': ('customer_photo.jpg', img_file, 'image/jpeg')}
        data = {
            'kind': 'customer_photo',
            'userId': 'customer-123'
        }
        
        # Upload
        response = requests.post(UPLOAD_ENDPOINT, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and result.get('url'):
                # Check if URL contains 'customers' folder
                if 'customers' in result['url']:
                    log_test("Customer Photo Upload", True, 
                            f"Successfully uploaded to customers folder. URL: {result['url']}")
                    return result
                else:
                    log_test("Customer Photo Upload", False, 
                            f"File not stored in customers folder. URL: {result['url']}")
                    return None
            else:
                log_test("Customer Photo Upload", False, f"Upload failed: {result}")
                return None
        else:
            log_test("Customer Photo Upload", False, 
                    f"Upload failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Customer Photo Upload", False, f"Exception: {str(e)}")
        return None

def test_document_upload():
    """Test 3: Document Upload"""
    try:
        # Create test PDF
        pdf_file = create_test_pdf('test_document.pdf')
        
        # Prepare form data
        files = {'file': ('test_document.pdf', pdf_file, 'application/pdf')}
        data = {
            'kind': 'document',
            'userId': 'test-user-001'
        }
        
        # Upload
        response = requests.post(UPLOAD_ENDPOINT, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and result.get('url'):
                # Check if URL contains 'documents' folder
                if 'documents' in result['url']:
                    log_test("Document Upload", True, 
                            f"Successfully uploaded to documents folder. URL: {result['url']}")
                    return result
                else:
                    log_test("Document Upload", False, 
                            f"File not stored in documents folder. URL: {result['url']}")
                    return None
            else:
                log_test("Document Upload", False, f"Upload failed: {result}")
                return None
        else:
            log_test("Document Upload", False, 
                    f"Upload failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Document Upload", False, f"Exception: {str(e)}")
        return None

def test_file_type_validation():
    """Test 4: File Type Validation"""
    try:
        # Create an unsupported file type (.txt)
        txt_content = b"This is a text file that should not be allowed"
        txt_file = io.BytesIO(txt_content)
        
        # Prepare form data
        files = {'file': ('test.txt', txt_file, 'text/plain')}
        data = {
            'kind': 'document',
            'userId': 'test-user-001'
        }
        
        # Upload
        response = requests.post(UPLOAD_ENDPOINT, files=files, data=data)
        
        # Should return 400 error
        if response.status_code == 400:
            result = response.json()
            if 'error' in result and 'not allowed' in result['error'].lower():
                log_test("File Type Validation", True, 
                        f"Correctly rejected unsupported file type: {result['error']}")
                return True
            else:
                log_test("File Type Validation", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("File Type Validation", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("File Type Validation", False, f"Exception: {str(e)}")
        return False

def test_file_size_validation():
    """Test 5: File Size Validation"""
    try:
        # Create a file larger than 10MB
        large_file = create_large_file(11)
        
        # Prepare form data
        files = {'file': ('large_file.jpg', large_file, 'image/jpeg')}
        data = {
            'kind': 'product_image',
            'userId': 'test-user-001'
        }
        
        # Upload
        response = requests.post(UPLOAD_ENDPOINT, files=files, data=data)
        
        # Should return 400 error
        if response.status_code == 400:
            result = response.json()
            if 'error' in result and ('large' in result['error'].lower() or 'size' in result['error'].lower()):
                log_test("File Size Validation", True, 
                        f"Correctly rejected oversized file: {result['error']}")
                return True
            else:
                log_test("File Size Validation", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("File Size Validation", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("File Size Validation", False, f"Exception: {str(e)}")
        return False

def test_get_uploaded_files():
    """Test 6: GET Uploaded Files"""
    try:
        # Test 6a: Get files by kind
        response = requests.get(f"{UPLOAD_ENDPOINT}?kind=product_image&limit=10")
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and 'files' in result:
                files = result['files']
                log_test("GET Uploaded Files (by kind)", True, 
                        f"Successfully retrieved {len(files)} product images")
            else:
                log_test("GET Uploaded Files (by kind)", False, 
                        f"Unexpected response structure: {result}")
                return False
        else:
            log_test("GET Uploaded Files (by kind)", False, 
                    f"Request failed with status {response.status_code}")
            return False
        
        # Test 6b: Get all files
        response = requests.get(f"{UPLOAD_ENDPOINT}?limit=20")
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and 'files' in result:
                files = result['files']
                log_test("GET Uploaded Files (all)", True, 
                        f"Successfully retrieved {len(files)} total files")
                return True
            else:
                log_test("GET Uploaded Files (all)", False, 
                        f"Unexpected response structure: {result}")
                return False
        else:
            log_test("GET Uploaded Files (all)", False, 
                    f"Request failed with status {response.status_code}")
            return False
            
    except Exception as e:
        log_test("GET Uploaded Files", False, f"Exception: {str(e)}")
        return False

def test_mongodb_integration():
    """Test 7: MongoDB Integration"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Check if media collection exists
        collections = db.list_collection_names()
        
        if 'media' not in collections:
            log_test("MongoDB Integration", False, 
                    "Media collection does not exist in database")
            return False
        
        # Get a sample document from media collection
        media_collection = db['media']
        sample_doc = media_collection.find_one()
        
        if not sample_doc:
            log_test("MongoDB Integration", False, 
                    "Media collection is empty - no uploaded files found")
            return False
        
        # Verify required fields
        required_fields = ['userId', 'kind', 'filename', 'storedName', 'path', 
                          'url', 'mimeType', 'size', 'status', 'createdAt', 'updatedAt']
        missing_fields = [f for f in required_fields if f not in sample_doc]
        
        if missing_fields:
            log_test("MongoDB Integration", False, 
                    f"Missing required fields in media document: {missing_fields}")
            return False
        
        # Count documents
        total_docs = media_collection.count_documents({})
        
        log_test("MongoDB Integration", True, 
                f"MongoDB connected successfully. Media collection has {total_docs} documents. All required fields present.")
        
        client.close()
        return True
        
    except Exception as e:
        log_test("MongoDB Integration", False, f"Exception: {str(e)}")
        return False

def test_file_storage_structure():
    """Test 8: File Storage Structure"""
    try:
        # Check if upload directories exist
        base_path = '/app/public/uploads'
        required_dirs = ['products', 'customers', 'documents']
        
        missing_dirs = []
        existing_dirs = []
        
        for dir_name in required_dirs:
            dir_path = os.path.join(base_path, dir_name)
            if os.path.exists(dir_path):
                existing_dirs.append(dir_name)
                # Count files in directory
                files = os.listdir(dir_path)
                print(f"   {dir_name}/: {len(files)} files")
            else:
                missing_dirs.append(dir_name)
        
        if missing_dirs:
            log_test("File Storage Structure", False, 
                    f"Missing directories: {missing_dirs}")
            return False
        
        log_test("File Storage Structure", True, 
                f"All required directories exist: {existing_dirs}")
        return True
        
    except Exception as e:
        log_test("File Storage Structure", False, f"Exception: {str(e)}")
        return False

def test_razorpay_order_creation():
    """Test 9: Razorpay Order Creation"""
    try:
        # Prepare test data
        order_data = {
            "amount": 899,
            "currency": "INR",
            "customerInfo": {
                "name": "Priya Sharma",
                "email": "priya.sharma@example.com",
                "phone": "9876543210"
            },
            "cartItems": [
                {
                    "id": 1,
                    "name": "Chocolate Truffle Cake",
                    "price": 899,
                    "quantity": 1
                }
            ]
        }
        
        # Create order
        response = requests.post(RAZORPAY_ORDER_ENDPOINT, json=order_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'orderId', 'amount', 'currency', 'keyId']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Razorpay Order Creation", False, f"Missing fields in response: {missing_fields}")
                return None
            
            # Verify orderId starts with 'order_'
            if not result['orderId'].startswith('order_'):
                log_test("Razorpay Order Creation", False, f"Invalid orderId format: {result['orderId']}")
                return None
            
            # Verify amount is in paise (899 * 100 = 89900)
            if result['amount'] != 89900:
                log_test("Razorpay Order Creation", False, f"Amount mismatch. Expected 89900, got {result['amount']}")
                return None
            
            # Verify keyId starts with 'rzp_test_'
            if not result['keyId'].startswith('rzp_test_'):
                log_test("Razorpay Order Creation", False, f"Invalid keyId format: {result['keyId']}")
                return None
            
            log_test("Razorpay Order Creation", True, 
                    f"Successfully created Razorpay order. OrderID: {result['orderId']}, Amount: ₹{result['amount']/100}, KeyID: {result['keyId']}")
            return result
        else:
            log_test("Razorpay Order Creation", False, 
                    f"Order creation failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Razorpay Order Creation", False, f"Exception: {str(e)}")
        return None

def test_razorpay_order_invalid_amount():
    """Test 10: Razorpay Order Creation with Invalid Amount"""
    try:
        # Test with invalid amount (less than ₹1)
        order_data = {
            "amount": 0.5,
            "currency": "INR",
            "customerInfo": {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "9876543210"
            },
            "cartItems": []
        }
        
        response = requests.post(RAZORPAY_ORDER_ENDPOINT, json=order_data)
        
        # Should return 400 error
        if response.status_code == 400:
            result = response.json()
            if 'error' in result:
                log_test("Razorpay Order Invalid Amount", True, 
                        f"Correctly rejected invalid amount: {result['error']}")
                return True
            else:
                log_test("Razorpay Order Invalid Amount", False, 
                        f"Missing error message in response: {result}")
                return False
        else:
            log_test("Razorpay Order Invalid Amount", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Razorpay Order Invalid Amount", False, f"Exception: {str(e)}")
        return False

def test_razorpay_order_missing_data():
    """Test 11: Razorpay Order Creation with Missing Data"""
    try:
        # Test with missing required data
        order_data = {}
        
        response = requests.post(RAZORPAY_ORDER_ENDPOINT, json=order_data)
        
        # Should return error (400 or 500)
        if response.status_code in [400, 500]:
            result = response.json()
            if 'error' in result:
                log_test("Razorpay Order Missing Data", True, 
                        f"Correctly rejected missing data: {result['error']}")
                return True
            else:
                log_test("Razorpay Order Missing Data", False, 
                        f"Missing error message in response: {result}")
                return False
        else:
            log_test("Razorpay Order Missing Data", False, 
                    f"Should return error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Razorpay Order Missing Data", False, f"Exception: {str(e)}")
        return False

def test_razorpay_verify_endpoint():
    """Test 12: Razorpay Payment Verification Endpoint"""
    try:
        # Test with missing signature (should return error)
        verify_data = {
            "razorpay_order_id": "order_test123",
            "razorpay_payment_id": "pay_test123"
            # Missing razorpay_signature
        }
        
        response = requests.post(RAZORPAY_VERIFY_ENDPOINT, json=verify_data)
        
        # Should return error (400 or 500)
        if response.status_code in [400, 500]:
            result = response.json()
            if 'error' in result:
                log_test("Razorpay Verify Endpoint", True, 
                        f"Endpoint exists and validates input correctly: {result['error']}")
                return True
            else:
                log_test("Razorpay Verify Endpoint", False, 
                        f"Endpoint exists but missing error message: {result}")
                return False
        else:
            log_test("Razorpay Verify Endpoint", False, 
                    f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Razorpay Verify Endpoint", False, f"Exception: {str(e)}")
        return False

def test_razorpay_webhook_endpoint():
    """Test 13: Razorpay Webhook Endpoint"""
    try:
        # Test with missing signature header
        webhook_data = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_test123",
                        "order_id": "order_test123"
                    }
                }
            }
        }
        
        response = requests.post(RAZORPAY_WEBHOOK_ENDPOINT, json=webhook_data)
        
        # Should return 400 error for missing signature
        if response.status_code == 400:
            result = response.json()
            if 'error' in result and 'signature' in result['error'].lower():
                log_test("Razorpay Webhook Endpoint", True, 
                        f"Endpoint exists and validates signature: {result['error']}")
                return True
            else:
                log_test("Razorpay Webhook Endpoint", False, 
                        f"Endpoint exists but wrong error message: {result}")
                return False
        else:
            log_test("Razorpay Webhook Endpoint", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Razorpay Webhook Endpoint", False, f"Exception: {str(e)}")
        return False

def test_razorpay_mongodb_orders():
    """Test 14: Razorpay MongoDB Orders Collection"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Check if orders collection exists
        collections = db.list_collection_names()
        
        if 'orders' not in collections:
            log_test("Razorpay MongoDB Orders", False, 
                    "Orders collection does not exist in database")
            client.close()
            return False
        
        # Get a sample order document
        orders_collection = db['orders']
        sample_order = orders_collection.find_one()
        
        if not sample_order:
            log_test("Razorpay MongoDB Orders", False, 
                    "Orders collection is empty - no orders found")
            client.close()
            return False
        
        # Verify required fields
        required_fields = ['orderId', 'receiptId', 'amount', 'currency', 'status', 
                          'customerInfo', 'cartItems', 'razorpayOrderData', 'createdAt', 'updatedAt']
        missing_fields = [f for f in required_fields if f not in sample_order]
        
        if missing_fields:
            log_test("Razorpay MongoDB Orders", False, 
                    f"Missing required fields in order document: {missing_fields}")
            client.close()
            return False
        
        # Verify orderId format
        if not sample_order['orderId'].startswith('order_'):
            log_test("Razorpay MongoDB Orders", False, 
                    f"Invalid orderId format in database: {sample_order['orderId']}")
            client.close()
            return False
        
        # Count orders
        total_orders = orders_collection.count_documents({})
        
        log_test("Razorpay MongoDB Orders", True, 
                f"MongoDB orders collection verified. Total orders: {total_orders}. OrderID: {sample_order['orderId']}, Status: {sample_order['status']}, Amount: ₹{sample_order['amount']/100}")
        
        client.close()
        return True
        
    except Exception as e:
        log_test("Razorpay MongoDB Orders", False, f"Exception: {str(e)}")
        return False

def test_razorpay_environment_variables():
    """Test 15: Razorpay Environment Variables"""
    try:
        # Read .env file
        env_path = '/app/.env'
        if not os.path.exists(env_path):
            log_test("Razorpay Environment Variables", False, 
                    ".env file not found")
            return False
        
        with open(env_path, 'r') as f:
            env_content = f.read()
        
        # Check for required variables
        required_vars = {
            'RAZORPAY_KEY_ID': 'rzp_test_',
            'RAZORPAY_KEY_SECRET': None,
            'NEXT_PUBLIC_RAZORPAY_KEY_ID': 'rzp_test_'
        }
        
        missing_vars = []
        invalid_vars = []
        
        for var_name, expected_prefix in required_vars.items():
            if var_name not in env_content:
                missing_vars.append(var_name)
            elif expected_prefix:
                # Extract value
                for line in env_content.split('\n'):
                    if line.startswith(f"{var_name}="):
                        value = line.split('=', 1)[1].strip()
                        if not value.startswith(expected_prefix):
                            invalid_vars.append(f"{var_name} (should start with {expected_prefix})")
        
        if missing_vars:
            log_test("Razorpay Environment Variables", False, 
                    f"Missing environment variables: {missing_vars}")
            return False
        
        if invalid_vars:
            log_test("Razorpay Environment Variables", False, 
                    f"Invalid environment variables: {invalid_vars}")
            return False
        
        log_test("Razorpay Environment Variables", True, 
                "All Razorpay environment variables are set correctly (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID)")
        return True
        
    except Exception as e:
        log_test("Razorpay Environment Variables", False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Total Tests: {test_results['passed'] + test_results['failed']}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print("="*70)
    
    if test_results['failed'] > 0:
        print("\nFailed Tests:")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"  - {test['name']}: {test['message']}")
    
    print("\n")

def test_auth_signup():
    """Test 1: User Registration (POST /api/auth/signup)"""
    try:
        # Test data
        signup_data = {
            "name": "Priya Sharma",
            "email": "priya.sharma.test@example.com",
            "password": "password123",
            "phone": "9876543210"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'user', 'token']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Auth Signup", False, f"Missing fields in response: {missing_fields}")
                return None
            
            # Verify user object doesn't contain password
            if 'password' in result['user']:
                log_test("Auth Signup", False, "Password should not be in response")
                return None
            
            # Verify user fields
            user = result['user']
            user_checks = []
            if 'referralCode' not in user:
                user_checks.append("Missing referralCode")
            if user.get('walletBalance') != 0:
                user_checks.append(f"walletBalance should be 0, got {user.get('walletBalance')}")
            if user.get('loyaltyPoints') != 0:
                user_checks.append(f"loyaltyPoints should be 0, got {user.get('loyaltyPoints')}")
            
            if user_checks:
                log_test("Auth Signup", False, f"User validation failed: {', '.join(user_checks)}")
                return None
            
            log_test("Auth Signup", True, 
                    f"User registered successfully. Email: {user['email']}, Referral Code: {user['referralCode']}, Token received")
            return result
        elif response.status_code == 400:
            # This might be duplicate email - that's okay for testing
            result = response.json()
            if 'already registered' in result.get('error', '').lower():
                log_test("Auth Signup", True, 
                        f"Duplicate email validation working: {result['error']}")
                return {'duplicate': True, 'email': signup_data['email']}
            else:
                log_test("Auth Signup", False, f"Unexpected error: {result}")
                return None
        else:
            log_test("Auth Signup", False, 
                    f"Signup failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Auth Signup", False, f"Exception: {str(e)}")
        return None

def test_auth_signup_duplicate():
    """Test 2: Duplicate Email Validation"""
    try:
        # Try to register with same email again
        signup_data = {
            "name": "Another User",
            "email": "priya.sharma.test@example.com",
            "password": "password456",
            "phone": "9999999999"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        
        if response.status_code == 400:
            result = response.json()
            if 'already registered' in result.get('error', '').lower():
                log_test("Auth Signup Duplicate Email", True, 
                        f"Correctly rejected duplicate email: {result['error']}")
                return True
            else:
                log_test("Auth Signup Duplicate Email", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("Auth Signup Duplicate Email", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth Signup Duplicate Email", False, f"Exception: {str(e)}")
        return False

def test_auth_login():
    """Test 3: User Login (POST /api/auth/login)"""
    try:
        # Login with registered user
        login_data = {
            "email": "priya.sharma.test@example.com",
            "password": "password123"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'user', 'token']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Auth Login", False, f"Missing fields in response: {missing_fields}")
                return None
            
            # Verify password not in response
            if 'password' in result['user']:
                log_test("Auth Login", False, "Password should not be in response")
                return None
            
            log_test("Auth Login", True, 
                    f"Login successful. Email: {result['user']['email']}, Token received")
            return result
        else:
            log_test("Auth Login", False, 
                    f"Login failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Auth Login", False, f"Exception: {str(e)}")
        return None

def test_auth_login_wrong_password():
    """Test 4: Login with Wrong Password"""
    try:
        login_data = {
            "email": "priya.sharma.test@example.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 401:
            result = response.json()
            if 'error' in result:
                log_test("Auth Login Wrong Password", True, 
                        f"Correctly rejected wrong password: {result['error']}")
                return True
            else:
                log_test("Auth Login Wrong Password", False, 
                        f"Missing error message: {result}")
                return False
        else:
            log_test("Auth Login Wrong Password", False, 
                    f"Should return 401 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth Login Wrong Password", False, f"Exception: {str(e)}")
        return False

def test_auth_login_nonexistent():
    """Test 5: Login with Non-existent Email"""
    try:
        login_data = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 401:
            result = response.json()
            if 'error' in result:
                log_test("Auth Login Non-existent Email", True, 
                        f"Correctly rejected non-existent email: {result['error']}")
                return True
            else:
                log_test("Auth Login Non-existent Email", False, 
                        f"Missing error message: {result}")
                return False
        else:
            log_test("Auth Login Non-existent Email", False, 
                    f"Should return 401 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth Login Non-existent Email", False, f"Exception: {str(e)}")
        return False

def test_auth_otp_send():
    """Test 6: Send OTP (POST /api/auth/otp/send)"""
    try:
        otp_data = {
            "phone": "9123456789"
        }
        
        response = requests.post(f"{BASE_URL}/auth/otp/send", json=otp_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'message', 'otp', 'expiresIn']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Auth OTP Send", False, f"Missing fields in response: {missing_fields}")
                return None
            
            # Verify OTP is 6 digits
            otp = result['otp']
            if not (isinstance(otp, str) and len(otp) == 6 and otp.isdigit()):
                log_test("Auth OTP Send", False, f"Invalid OTP format: {otp}")
                return None
            
            # Verify expiry is 600 seconds (10 minutes)
            if result['expiresIn'] != 600:
                log_test("Auth OTP Send", False, f"Wrong expiry time: {result['expiresIn']}")
                return None
            
            log_test("Auth OTP Send", True, 
                    f"OTP sent successfully. Phone: {otp_data['phone']}, OTP: {otp}, Expires in: {result['expiresIn']}s")
            return result
        else:
            log_test("Auth OTP Send", False, 
                    f"OTP send failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Auth OTP Send", False, f"Exception: {str(e)}")
        return None

def test_auth_otp_send_invalid_phone():
    """Test 7: Send OTP with Invalid Phone"""
    try:
        otp_data = {
            "phone": "123"  # Invalid phone
        }
        
        response = requests.post(f"{BASE_URL}/auth/otp/send", json=otp_data)
        
        if response.status_code == 400:
            result = response.json()
            if 'error' in result:
                log_test("Auth OTP Send Invalid Phone", True, 
                        f"Correctly rejected invalid phone: {result['error']}")
                return True
            else:
                log_test("Auth OTP Send Invalid Phone", False, 
                        f"Missing error message: {result}")
                return False
        else:
            log_test("Auth OTP Send Invalid Phone", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth OTP Send Invalid Phone", False, f"Exception: {str(e)}")
        return False

def test_auth_otp_verify():
    """Test 8: Verify OTP (POST /api/auth/otp/verify)"""
    try:
        # First send OTP
        otp_send_data = {
            "phone": "9111222333"
        }
        
        send_response = requests.post(f"{BASE_URL}/auth/otp/send", json=otp_send_data)
        
        if send_response.status_code != 200:
            log_test("Auth OTP Verify", False, "Failed to send OTP for verification test")
            return None
        
        otp = send_response.json()['otp']
        
        # Now verify OTP
        verify_data = {
            "phone": "9111222333",
            "otp": otp,
            "name": "Rajesh Kumar"
        }
        
        response = requests.post(f"{BASE_URL}/auth/otp/verify", json=verify_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            required_fields = ['success', 'user', 'token']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                log_test("Auth OTP Verify", False, f"Missing fields in response: {missing_fields}")
                return None
            
            # Verify phoneVerified is true
            if not result['user'].get('phoneVerified'):
                log_test("Auth OTP Verify", False, "phoneVerified should be true")
                return None
            
            log_test("Auth OTP Verify", True, 
                    f"OTP verified successfully. User created/logged in. Phone: {result['user']['phone']}, phoneVerified: {result['user']['phoneVerified']}")
            return result
        else:
            log_test("Auth OTP Verify", False, 
                    f"OTP verification failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Auth OTP Verify", False, f"Exception: {str(e)}")
        return None

def test_auth_otp_verify_wrong():
    """Test 9: Verify OTP with Wrong OTP"""
    try:
        verify_data = {
            "phone": "9111222333",
            "otp": "000000",  # Wrong OTP
            "name": "Test User"
        }
        
        response = requests.post(f"{BASE_URL}/auth/otp/verify", json=verify_data)
        
        if response.status_code == 400:
            result = response.json()
            if 'error' in result and ('invalid' in result['error'].lower() or 'expired' in result['error'].lower()):
                log_test("Auth OTP Verify Wrong OTP", True, 
                        f"Correctly rejected wrong OTP: {result['error']}")
                return True
            else:
                log_test("Auth OTP Verify Wrong OTP", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("Auth OTP Verify Wrong OTP", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth OTP Verify Wrong OTP", False, f"Exception: {str(e)}")
        return False

def test_auth_me_with_token():
    """Test 10: Get Current User with Valid Token (GET /api/auth/me)"""
    try:
        # First login to get token
        login_data = {
            "email": "priya.sharma.test@example.com",
            "password": "password123"
        }
        
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if login_response.status_code != 200:
            log_test("Auth Get Me (with token)", False, "Failed to login for /me test")
            return None
        
        token = login_response.json()['token']
        
        # Now call /me with token
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            if not result.get('success') or 'user' not in result:
                log_test("Auth Get Me (with token)", False, f"Invalid response structure: {result}")
                return None
            
            # Verify password not in response
            if 'password' in result['user']:
                log_test("Auth Get Me (with token)", False, "Password should not be in response")
                return None
            
            log_test("Auth Get Me (with token)", True, 
                    f"Successfully retrieved user. Email: {result['user']['email']}")
            return result
        else:
            log_test("Auth Get Me (with token)", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Auth Get Me (with token)", False, f"Exception: {str(e)}")
        return None

def test_auth_me_without_token():
    """Test 11: Get Current User without Token"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me")
        
        if response.status_code == 401:
            result = response.json()
            if 'error' in result:
                log_test("Auth Get Me (without token)", True, 
                        f"Correctly rejected request without token: {result['error']}")
                return True
            else:
                log_test("Auth Get Me (without token)", False, 
                        f"Missing error message: {result}")
                return False
        else:
            log_test("Auth Get Me (without token)", False, 
                    f"Should return 401 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Auth Get Me (without token)", False, f"Exception: {str(e)}")
        return False

def test_auth_logout():
    """Test 12: Logout (POST /api/auth/logout)"""
    try:
        response = requests.post(f"{BASE_URL}/auth/logout")
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and 'message' in result:
                log_test("Auth Logout", True, 
                        f"Logout successful: {result['message']}")
                return True
            else:
                log_test("Auth Logout", False, f"Invalid response: {result}")
                return False
        else:
            log_test("Auth Logout", False, 
                    f"Logout failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Auth Logout", False, f"Exception: {str(e)}")
        return False

def test_auth_mongodb_users():
    """Test 13: MongoDB Users Collection"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Check if users collection exists
        collections = db.list_collection_names()
        
        if 'users' not in collections:
            log_test("Auth MongoDB Users", False, 
                    "Users collection does not exist in database")
            client.close()
            return False
        
        # Get a sample user document
        users_collection = db['users']
        sample_user = users_collection.find_one({'email': 'priya.sharma.test@example.com'})
        
        if not sample_user:
            log_test("Auth MongoDB Users", False, 
                    "Test user not found in database")
            client.close()
            return False
        
        # Verify required fields
        required_fields = ['name', 'email', 'password', 'phone', 'walletBalance', 
                          'loyaltyPoints', 'referralCode', 'phoneVerified', 'emailVerified', 
                          'status', 'createdAt', 'updatedAt']
        missing_fields = [f for f in required_fields if f not in sample_user]
        
        if missing_fields:
            log_test("Auth MongoDB Users", False, 
                    f"Missing required fields in user document: {missing_fields}")
            client.close()
            return False
        
        # Verify password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        password = sample_user['password']
        if not (password.startswith('$2a$') or password.startswith('$2b$') or password.startswith('$2y$')):
            log_test("Auth MongoDB Users", False, 
                    f"Password not properly hashed: {password[:10]}...")
            client.close()
            return False
        
        # Verify referral code format (MRC + 6 chars)
        referral_code = sample_user['referralCode']
        if not (referral_code.startswith('MRC') and len(referral_code) == 9):
            log_test("Auth MongoDB Users", False, 
                    f"Invalid referral code format: {referral_code}")
            client.close()
            return False
        
        # Count users
        total_users = users_collection.count_documents({})
        
        log_test("Auth MongoDB Users", True, 
                f"Users collection verified. Total users: {total_users}. Password hashed with bcrypt, Referral code: {referral_code}, Wallet: ₹{sample_user['walletBalance']}, Loyalty: {sample_user['loyaltyPoints']}")
        
        client.close()
        return True
        
    except Exception as e:
        log_test("Auth MongoDB Users", False, f"Exception: {str(e)}")
        return False

def test_auth_mongodb_otps():
    """Test 14: MongoDB OTPs Collection"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Check if otps collection exists
        collections = db.list_collection_names()
        
        if 'otps' not in collections:
            log_test("Auth MongoDB OTPs", False, 
                    "OTPs collection does not exist in database")
            client.close()
            return False
        
        # Get a sample OTP document
        otps_collection = db['otps']
        sample_otp = otps_collection.find_one()
        
        if not sample_otp:
            log_test("Auth MongoDB OTPs", False, 
                    "OTPs collection is empty - no OTPs found")
            client.close()
            return False
        
        # Verify required fields
        required_fields = ['phone', 'otp', 'expiresAt', 'verified', 'createdAt']
        missing_fields = [f for f in required_fields if f not in sample_otp]
        
        if missing_fields:
            log_test("Auth MongoDB OTPs", False, 
                    f"Missing required fields in OTP document: {missing_fields}")
            client.close()
            return False
        
        # Verify OTP is 6 digits
        otp = sample_otp['otp']
        if not (isinstance(otp, str) and len(otp) == 6 and otp.isdigit()):
            log_test("Auth MongoDB OTPs", False, 
                    f"Invalid OTP format in database: {otp}")
            client.close()
            return False
        
        # Count OTPs
        total_otps = otps_collection.count_documents({})
        
        log_test("Auth MongoDB OTPs", True, 
                f"OTPs collection verified. Total OTPs: {total_otps}. Phone: {sample_otp['phone']}, Verified: {sample_otp['verified']}, Expires: {sample_otp['expiresAt']}")
        
        client.close()
        return True
        
    except Exception as e:
        log_test("Auth MongoDB OTPs", False, f"Exception: {str(e)}")
        return False

def test_admin_products_unauthorized():
    """Test 1: Admin Products API - Unauthorized Access"""
    try:
        # Try to access without admin token
        response = requests.get(f"{BASE_URL}/admin/products")
        
        if response.status_code == 401:
            result = response.json()
            if 'error' in result and 'unauthorized' in result['error'].lower():
                log_test("Admin Products - Unauthorized", True, 
                        f"Correctly rejected unauthorized access: {result['error']}")
                return True
            else:
                log_test("Admin Products - Unauthorized", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("Admin Products - Unauthorized", False, 
                    f"Should return 401 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Admin Products - Unauthorized", False, f"Exception: {str(e)}")
        return False

def test_admin_products_create():
    """Test 2: Admin Products API - Create Product"""
    try:
        # Create product with admin token
        product_data = {
            "name": "Test Chocolate Cake",
            "description": "Delicious chocolate cake for testing",
            "price": 599,
            "originalPrice": 699,
            "discount": 14,
            "category": "cakes",
            "cakeType": "chocolate",
            "occasion": "birthday",
            "flavour": "Rich Chocolate",
            "size": "500g",
            "images": ["https://example.com/cake1.jpg"],
            "stock": 50,
            "inStock": True
        }
        
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.post(f"{BASE_URL}/admin/products", json=product_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            # Verify response structure
            if not result.get('success') or 'product' not in result:
                log_test("Admin Products - Create", False, f"Invalid response structure: {result}")
                return None
            
            product = result['product']
            
            # Verify product fields
            if product['name'] != product_data['name']:
                log_test("Admin Products - Create", False, f"Name mismatch: {product['name']}")
                return None
            
            if product['price'] != product_data['price']:
                log_test("Admin Products - Create", False, f"Price mismatch: {product['price']}")
                return None
            
            if '_id' not in product:
                log_test("Admin Products - Create", False, "Missing _id field")
                return None
            
            if 'slug' not in product:
                log_test("Admin Products - Create", False, "Missing slug field")
                return None
            
            log_test("Admin Products - Create", True, 
                    f"Product created successfully. ID: {product['_id']}, Name: {product['name']}, Price: ₹{product['price']}, Slug: {product['slug']}")
            return product
        else:
            log_test("Admin Products - Create", False, 
                    f"Product creation failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Admin Products - Create", False, f"Exception: {str(e)}")
        return None

def test_admin_products_get_all():
    """Test 3: Admin Products API - Get All Products"""
    try:
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if 'products' not in result:
                log_test("Admin Products - Get All", False, f"Missing products field: {result}")
                return None
            
            products = result['products']
            
            log_test("Admin Products - Get All", True, 
                    f"Successfully retrieved {len(products)} products")
            return products
        else:
            log_test("Admin Products - Get All", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Admin Products - Get All", False, f"Exception: {str(e)}")
        return None

def test_admin_products_get_by_category():
    """Test 4: Admin Products API - Get Products by Category"""
    try:
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.get(f"{BASE_URL}/admin/products?category=cakes", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if 'products' not in result:
                log_test("Admin Products - Get by Category", False, f"Missing products field: {result}")
                return False
            
            products = result['products']
            
            # Verify all products are cakes
            non_cakes = [p for p in products if p.get('category') != 'cakes']
            if non_cakes:
                log_test("Admin Products - Get by Category", False, 
                        f"Found {len(non_cakes)} non-cake products in cakes filter")
                return False
            
            log_test("Admin Products - Get by Category", True, 
                    f"Successfully retrieved {len(products)} cake products")
            return True
        else:
            log_test("Admin Products - Get by Category", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Admin Products - Get by Category", False, f"Exception: {str(e)}")
        return False

def test_admin_products_update():
    """Test 5: Admin Products API - Update Product"""
    try:
        # First create a product
        product = test_admin_products_create()
        if not product:
            log_test("Admin Products - Update", False, "Failed to create product for update test")
            return False
        
        product_id = product['_id']
        
        # Update the product
        update_data = {
            "_id": product_id,
            "price": 649,
            "stock": 75
        }
        
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.put(f"{BASE_URL}/admin/products", json=update_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if not result.get('success'):
                log_test("Admin Products - Update", False, f"Update failed: {result}")
                return False
            
            log_test("Admin Products - Update", True, 
                    f"Product updated successfully. ID: {product_id}, New price: ₹{update_data['price']}, New stock: {update_data['stock']}")
            return True
        else:
            log_test("Admin Products - Update", False, 
                    f"Update failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Admin Products - Update", False, f"Exception: {str(e)}")
        return False

def test_admin_products_delete():
    """Test 6: Admin Products API - Delete Product"""
    try:
        # First create a product
        product = test_admin_products_create()
        if not product:
            log_test("Admin Products - Delete", False, "Failed to create product for delete test")
            return False
        
        product_id = product['_id']
        
        # Delete the product
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.delete(f"{BASE_URL}/admin/products?id={product_id}", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if not result.get('success'):
                log_test("Admin Products - Delete", False, f"Delete failed: {result}")
                return False
            
            log_test("Admin Products - Delete", True, 
                    f"Product deleted successfully. ID: {product_id}")
            return True
        else:
            log_test("Admin Products - Delete", False, 
                    f"Delete failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Admin Products - Delete", False, f"Exception: {str(e)}")
        return False

def test_orders_create():
    """Test 7: Orders API - Create Order"""
    try:
        order_data = {
            "name": "Anjali Verma",
            "email": "anjali.verma@example.com",
            "phone": "9876543210",
            "address": "123 Main Street, Sector 5",
            "city": "Haldwani",
            "state": "Uttarakhand",
            "pincode": "263139",
            "items": [{
                "productId": "test-product-id",
                "productName": "Chocolate Truffle Cake",
                "productImage": "https://example.com/cake.jpg",
                "price": 599,
                "quantity": 1,
                "category": "cakes"
            }],
            "subtotal": 599,
            "deliveryFee": 0,
            "total": 599,
            "deliveryDate": "2025-02-01",
            "deliveryTime": "10am-12pm",
            "expressDelivery": False,
            "paymentMethod": "online",
            "paymentStatus": "pending"
        }
        
        response = requests.post(f"{BASE_URL}/orders", json=order_data)
        
        if response.status_code == 200:
            result = response.json()
            
            if not result.get('success') or 'orderId' not in result:
                log_test("Orders - Create", False, f"Invalid response structure: {result}")
                return None
            
            order_id = result['orderId']
            
            log_test("Orders - Create", True, 
                    f"Order created successfully. Order ID: {order_id}, Customer: {order_data['name']}, Total: ₹{order_data['total']}")
            return order_id
        else:
            log_test("Orders - Create", False, 
                    f"Order creation failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Orders - Create", False, f"Exception: {str(e)}")
        return None

def test_orders_get_all():
    """Test 8: Orders API - Get All Orders"""
    try:
        response = requests.get(f"{BASE_URL}/orders")
        
        if response.status_code == 200:
            result = response.json()
            
            if 'orders' not in result:
                log_test("Orders - Get All", False, f"Missing orders field: {result}")
                return False
            
            orders = result['orders']
            
            log_test("Orders - Get All", True, 
                    f"Successfully retrieved {len(orders)} orders")
            return True
        else:
            log_test("Orders - Get All", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Orders - Get All", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_unauthorized():
    """Test 9: Admin Orders API - Unauthorized Access"""
    try:
        # Try to access without admin token
        response = requests.get(f"{BASE_URL}/admin/orders")
        
        if response.status_code == 401:
            result = response.json()
            if 'error' in result and 'unauthorized' in result['error'].lower():
                log_test("Admin Orders - Unauthorized", True, 
                        f"Correctly rejected unauthorized access: {result['error']}")
                return True
            else:
                log_test("Admin Orders - Unauthorized", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("Admin Orders - Unauthorized", False, 
                    f"Should return 401 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Admin Orders - Unauthorized", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_get_all():
    """Test 10: Admin Orders API - Get All Orders"""
    try:
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if 'orders' not in result:
                log_test("Admin Orders - Get All", False, f"Missing orders field: {result}")
                return None
            
            orders = result['orders']
            
            log_test("Admin Orders - Get All", True, 
                    f"Successfully retrieved {len(orders)} orders")
            return orders
        else:
            log_test("Admin Orders - Get All", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        log_test("Admin Orders - Get All", False, f"Exception: {str(e)}")
        return None

def test_admin_orders_get_by_status():
    """Test 11: Admin Orders API - Get Orders by Status"""
    try:
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.get(f"{BASE_URL}/admin/orders?status=pending", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if 'orders' not in result:
                log_test("Admin Orders - Get by Status", False, f"Missing orders field: {result}")
                return False
            
            orders = result['orders']
            
            # Verify all orders have pending status
            non_pending = [o for o in orders if o.get('status') != 'pending']
            if non_pending:
                log_test("Admin Orders - Get by Status", False, 
                        f"Found {len(non_pending)} non-pending orders in pending filter")
                return False
            
            log_test("Admin Orders - Get by Status", True, 
                    f"Successfully retrieved {len(orders)} pending orders")
            return True
        else:
            log_test("Admin Orders - Get by Status", False, 
                    f"Request failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Admin Orders - Get by Status", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_update_status():
    """Test 12: Admin Orders API - Update Order Status"""
    try:
        # First create an order
        order_id = test_orders_create()
        if not order_id:
            log_test("Admin Orders - Update Status", False, "Failed to create order for update test")
            return False
        
        # Update order status
        update_data = {
            "orderId": order_id,
            "status": "processing"
        }
        
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.put(f"{BASE_URL}/admin/orders", json=update_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            if not result.get('success'):
                log_test("Admin Orders - Update Status", False, f"Update failed: {result}")
                return False
            
            log_test("Admin Orders - Update Status", True, 
                    f"Order status updated successfully. Order ID: {order_id}, New status: {update_data['status']}")
            return True
        else:
            log_test("Admin Orders - Update Status", False, 
                    f"Update failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Admin Orders - Update Status", False, f"Exception: {str(e)}")
        return False

def test_admin_orders_invalid_status():
    """Test 13: Admin Orders API - Invalid Status"""
    try:
        # Try to update with invalid status
        update_data = {
            "orderId": "test-order-id",
            "status": "invalid_status"
        }
        
        headers = {
            "Authorization": "Bearer admin_logged_in"
        }
        
        response = requests.put(f"{BASE_URL}/admin/orders", json=update_data, headers=headers)
        
        if response.status_code == 400:
            result = response.json()
            if 'error' in result and 'invalid' in result['error'].lower():
                log_test("Admin Orders - Invalid Status", True, 
                        f"Correctly rejected invalid status: {result['error']}")
                return True
            else:
                log_test("Admin Orders - Invalid Status", False, 
                        f"Wrong error message: {result}")
                return False
        else:
            log_test("Admin Orders - Invalid Status", False, 
                    f"Should return 400 error, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Admin Orders - Invalid Status", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("Mr. COCO Bakery - Admin Product & Order Management API Tests")
    print("="*70)
    print(f"Backend URL: {BASE_URL}")
    print(f"MongoDB: {MONGO_URL}/{DB_NAME}")
    print("="*70 + "\n")
    
    # Run Admin Products API tests
    print("Running Admin Products API Tests...\n")
    
    # Test 1: Unauthorized access
    test_admin_products_unauthorized()
    
    # Test 2: Create product
    test_admin_products_create()
    
    # Test 3: Get all products
    test_admin_products_get_all()
    
    # Test 4: Get products by category
    test_admin_products_get_by_category()
    
    # Test 5: Update product
    test_admin_products_update()
    
    # Test 6: Delete product
    test_admin_products_delete()
    
    # Run Orders API tests
    print("\nRunning Orders API Tests...\n")
    
    # Test 7: Create order
    test_orders_create()
    
    # Test 8: Get all orders
    test_orders_get_all()
    
    # Run Admin Orders API tests
    print("\nRunning Admin Orders API Tests...\n")
    
    # Test 9: Unauthorized access
    test_admin_orders_unauthorized()
    
    # Test 10: Get all orders
    test_admin_orders_get_all()
    
    # Test 11: Get orders by status
    test_admin_orders_get_by_status()
    
    # Test 12: Update order status
    test_admin_orders_update_status()
    
    # Test 13: Invalid status
    test_admin_orders_invalid_status()
    
    # Print summary
    print_summary()
    
    # Return exit code
    return 0 if test_results['failed'] == 0 else 1

if __name__ == "__main__":
    exit(main())
