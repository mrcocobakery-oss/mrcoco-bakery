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

def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("Mr. COCO Bakery - Backend API Tests")
    print("="*70)
    print(f"Backend URL: {BASE_URL}")
    print(f"MongoDB: {MONGO_URL}/{DB_NAME}")
    print("="*70 + "\n")
    
    # Run tests in order
    print("Running Razorpay Payment Gateway Tests...\n")
    
    # Test 9: Razorpay Environment Variables
    test_razorpay_environment_variables()
    
    # Test 10: Razorpay Order Creation
    test_razorpay_order_creation()
    
    # Test 11: Razorpay Order Invalid Amount
    test_razorpay_order_invalid_amount()
    
    # Test 12: Razorpay Order Missing Data
    test_razorpay_order_missing_data()
    
    # Test 13: Razorpay Verify Endpoint
    test_razorpay_verify_endpoint()
    
    # Test 14: Razorpay Webhook Endpoint
    test_razorpay_webhook_endpoint()
    
    # Test 15: Razorpay MongoDB Orders
    test_razorpay_mongodb_orders()
    
    # Print summary
    print_summary()
    
    # Return exit code
    return 0 if test_results['failed'] == 0 else 1

if __name__ == "__main__":
    exit(main())
