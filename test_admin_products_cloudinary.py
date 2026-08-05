#!/usr/bin/env python3
"""
Backend API Testing for Admin Products and Cloudinary Integration
Tests the following endpoints:
1. POST /api/cloudinary/sign - Cloudinary signature generation
2. GET /api/admin/products - Fetch all products
3. POST /api/admin/products - Create new product
4. PUT /api/admin/products - Update product
5. DELETE /api/admin/products - Delete product
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com"
ADMIN_TOKEN = "admin_logged_in"

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(test_name, passed, message, details=None):
    """Log test result"""
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"\n{status}: {test_name}")
    print(f"   {message}")
    if details:
        print(f"   Details: {details}")
    
    test_results["tests"].append({
        "name": test_name,
        "passed": passed,
        "message": message,
        "details": details
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

def print_header(title):
    """Print section header"""
    print("\n" + "="*80)
    print(title)
    print("="*80)

def test_cloudinary_sign():
    """Test Cloudinary sign endpoint"""
    print_header("TEST 1: Cloudinary Sign Endpoint - POST /api/cloudinary/sign")
    
    # Test 1.1: Valid signature request
    try:
        url = f"{BASE_URL}/api/cloudinary/sign"
        payload = {
            "paramsToSign": {
                "timestamp": str(int(datetime.now().timestamp())),
                "upload_preset": "ml_default",
                "folder": "products"
            }
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "signature" in data and data["signature"]:
                log_test(
                    "Cloudinary Sign - Valid Request",
                    True,
                    f"Signature generated successfully",
                    f"Signature length: {len(data['signature'])} chars"
                )
            else:
                log_test(
                    "Cloudinary Sign - Valid Request",
                    False,
                    "Response missing signature field",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Cloudinary Sign - Valid Request",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Cloudinary Sign - Valid Request",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 1.2: Missing parameters
    try:
        url = f"{BASE_URL}/api/cloudinary/sign"
        payload = {}
        
        response = requests.post(url, json=payload, timeout=10)
        
        # Should return error (500 or 400)
        if response.status_code >= 400:
            log_test(
                "Cloudinary Sign - Missing Parameters",
                True,
                f"Correctly rejected invalid request with status {response.status_code}",
                None
            )
        else:
            log_test(
                "Cloudinary Sign - Missing Parameters",
                False,
                f"Should reject invalid request but got status {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Cloudinary Sign - Missing Parameters",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 1.3: Authentication check (should work without auth based on code review)
    try:
        url = f"{BASE_URL}/api/cloudinary/sign"
        payload = {
            "paramsToSign": {
                "timestamp": str(int(datetime.now().timestamp())),
                "upload_preset": "ml_default"
            }
        }
        
        # No auth headers
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            log_test(
                "Cloudinary Sign - No Authentication Required",
                True,
                "Endpoint accessible without authentication (as expected for client-side uploads)",
                None
            )
        else:
            log_test(
                "Cloudinary Sign - No Authentication Required",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Cloudinary Sign - No Authentication Required",
            False,
            f"Exception occurred: {str(e)}",
            None
        )

def test_admin_products_get():
    """Test GET /api/admin/products"""
    print_header("TEST 2: Admin Products GET - Fetch All Products")
    
    # Test 2.1: Without authentication
    try:
        url = f"{BASE_URL}/api/admin/products"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 401:
            log_test(
                "Admin Products GET - No Auth",
                True,
                "Correctly rejected unauthorized request with 401",
                None
            )
        else:
            log_test(
                "Admin Products GET - No Auth",
                False,
                f"Should return 401 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products GET - No Auth",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 2.2: With Bearer token authentication
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "products" in data:
                products = data["products"]
                log_test(
                    "Admin Products GET - With Auth",
                    True,
                    f"Successfully fetched products",
                    f"Total products: {len(products)}"
                )
                return products  # Return for use in other tests
            else:
                log_test(
                    "Admin Products GET - With Auth",
                    False,
                    "Response missing 'products' field",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Admin Products GET - With Auth",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products GET - With Auth",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    return []

def test_admin_products_post():
    """Test POST /api/admin/products"""
    print_header("TEST 3: Admin Products POST - Create New Product")
    
    # Test 3.1: Without authentication
    try:
        url = f"{BASE_URL}/api/admin/products"
        payload = {
            "name": "Test Chocolate Cake",
            "price": 599,
            "category": "cakes"
        }
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test(
                "Admin Products POST - No Auth",
                True,
                "Correctly rejected unauthorized request with 401",
                None
            )
        else:
            log_test(
                "Admin Products POST - No Auth",
                False,
                f"Should return 401 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products POST - No Auth",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 3.2: Create product with valid data
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        payload = {
            "name": "Test Chocolate Cake",
            "description": "Automated test product - Rich chocolate cake with premium cocoa",
            "price": 599,
            "originalPrice": 699,
            "discount": 14,
            "category": "cakes",
            "cakeType": "chocolate",
            "occasion": "birthday",
            "flavour": "chocolate",
            "size": "1kg",
            "images": ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
            "stock": 50,
            "weight": "1kg",
            "tags": ["chocolate", "birthday", "premium"]
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "product" in data:
                product = data["product"]
                product_id = product.get("_id")
                log_test(
                    "Admin Products POST - Create Product",
                    True,
                    f"Product created successfully",
                    f"Product ID: {product_id}, Name: {product.get('name')}, Price: ₹{product.get('price')}"
                )
                return product_id  # Return for use in update/delete tests
            else:
                log_test(
                    "Admin Products POST - Create Product",
                    False,
                    "Response missing success or product field",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Admin Products POST - Create Product",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products POST - Create Product",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    return None

def test_admin_products_put(product_id):
    """Test PUT /api/admin/products"""
    print_header("TEST 4: Admin Products PUT - Update Product")
    
    if not product_id:
        log_test(
            "Admin Products PUT - Update Product",
            False,
            "Skipped: No product ID available from POST test",
            None
        )
        return
    
    # Test 4.1: Without authentication
    try:
        url = f"{BASE_URL}/api/admin/products"
        payload = {
            "_id": product_id,
            "price": 649
        }
        response = requests.put(url, json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test(
                "Admin Products PUT - No Auth",
                True,
                "Correctly rejected unauthorized request with 401",
                None
            )
        else:
            log_test(
                "Admin Products PUT - No Auth",
                False,
                f"Should return 401 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products PUT - No Auth",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 4.2: Update product with valid data
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        payload = {
            "_id": product_id,
            "price": 649,
            "stock": 75,
            "description": "Updated test product - Premium chocolate cake"
        }
        
        response = requests.put(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test(
                    "Admin Products PUT - Update Product",
                    True,
                    f"Product updated successfully",
                    f"Updated fields: price=649, stock=75"
                )
            else:
                log_test(
                    "Admin Products PUT - Update Product",
                    False,
                    "Response missing success field",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Admin Products PUT - Update Product",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products PUT - Update Product",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 4.3: Update without product ID
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        payload = {
            "price": 699
        }
        
        response = requests.put(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 400:
            log_test(
                "Admin Products PUT - Missing ID",
                True,
                "Correctly rejected request without product ID with 400",
                None
            )
        else:
            log_test(
                "Admin Products PUT - Missing ID",
                False,
                f"Should return 400 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products PUT - Missing ID",
            False,
            f"Exception occurred: {str(e)}",
            None
        )

def test_admin_products_delete(product_id):
    """Test DELETE /api/admin/products"""
    print_header("TEST 5: Admin Products DELETE - Delete Product")
    
    if not product_id:
        log_test(
            "Admin Products DELETE - Delete Product",
            False,
            "Skipped: No product ID available from POST test",
            None
        )
        return
    
    # Test 5.1: Without authentication
    try:
        url = f"{BASE_URL}/api/admin/products?id={product_id}"
        response = requests.delete(url, timeout=10)
        
        if response.status_code == 401:
            log_test(
                "Admin Products DELETE - No Auth",
                True,
                "Correctly rejected unauthorized request with 401",
                None
            )
        else:
            log_test(
                "Admin Products DELETE - No Auth",
                False,
                f"Should return 401 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products DELETE - No Auth",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 5.2: Delete without product ID
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        response = requests.delete(url, headers=headers, timeout=10)
        
        if response.status_code == 400:
            log_test(
                "Admin Products DELETE - Missing ID",
                True,
                "Correctly rejected request without product ID with 400",
                None
            )
        else:
            log_test(
                "Admin Products DELETE - Missing ID",
                False,
                f"Should return 400 but got {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products DELETE - Missing ID",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 5.3: Delete product with valid ID
    try:
        url = f"{BASE_URL}/api/admin/products?id={product_id}"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        response = requests.delete(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test(
                    "Admin Products DELETE - Delete Product",
                    True,
                    f"Product deleted successfully",
                    f"Product ID: {product_id}"
                )
            else:
                log_test(
                    "Admin Products DELETE - Delete Product",
                    False,
                    "Response missing success field",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Admin Products DELETE - Delete Product",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Admin Products DELETE - Delete Product",
            False,
            f"Exception occurred: {str(e)}",
            None
        )

def test_product_data_validation():
    """Test product data structure and validation"""
    print_header("TEST 6: Product Data Validation")
    
    # Test 6.1: Required fields validation
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        
        # Missing required fields
        payload = {
            "description": "Test product without required fields"
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        # Should fail (500 or 400) due to missing required fields
        if response.status_code >= 400:
            log_test(
                "Product Validation - Missing Required Fields",
                True,
                f"Correctly rejected product without required fields with status {response.status_code}",
                None
            )
        else:
            log_test(
                "Product Validation - Missing Required Fields",
                False,
                f"Should reject invalid product but got status {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Product Validation - Missing Required Fields",
            False,
            f"Exception occurred: {str(e)}",
            None
        )
    
    # Test 6.2: Data types validation
    try:
        url = f"{BASE_URL}/api/admin/products"
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        
        # Valid product with all data types
        payload = {
            "name": "Data Type Test Cake",
            "description": "Testing data types",
            "price": 599,  # number
            "originalPrice": 699,  # number
            "discount": 14,  # number
            "category": "cakes",  # string
            "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],  # array
            "stock": 100,  # number
            "inStock": True,  # boolean
            "tags": ["test", "validation"]  # array
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "product" in data:
                product = data["product"]
                
                # Verify data types
                validations = []
                validations.append(("price is number", isinstance(product.get("price"), (int, float))))
                validations.append(("images is array", isinstance(product.get("images"), list)))
                validations.append(("stock is number", isinstance(product.get("stock"), int)))
                validations.append(("inStock is boolean", isinstance(product.get("inStock"), bool)))
                
                all_valid = all(v[1] for v in validations)
                
                if all_valid:
                    log_test(
                        "Product Validation - Data Types",
                        True,
                        "All data types validated correctly",
                        f"Product ID: {product.get('_id')}"
                    )
                    
                    # Clean up - delete test product
                    delete_url = f"{BASE_URL}/api/admin/products?id={product.get('_id')}"
                    requests.delete(delete_url, headers=headers, timeout=10)
                else:
                    failed_validations = [v[0] for v in validations if not v[1]]
                    log_test(
                        "Product Validation - Data Types",
                        False,
                        f"Data type validation failed: {', '.join(failed_validations)}",
                        None
                    )
            else:
                log_test(
                    "Product Validation - Data Types",
                    False,
                    "Failed to create test product",
                    f"Response: {data}"
                )
        else:
            log_test(
                "Product Validation - Data Types",
                False,
                f"Unexpected status code: {response.status_code}",
                f"Response: {response.text}"
            )
    except Exception as e:
        log_test(
            "Product Validation - Data Types",
            False,
            f"Exception occurred: {str(e)}",
            None
        )

def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")
    
    total_tests = test_results["passed"] + test_results["failed"]
    pass_rate = (test_results["passed"] / total_tests * 100) if total_tests > 0 else 0
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"Pass Rate: {pass_rate:.1f}%")
    
    if test_results["failed"] > 0:
        print("\n❌ FAILED TESTS:")
        for test in test_results["tests"]:
            if not test["passed"]:
                print(f"   - {test['name']}: {test['message']}")
    
    print("\n" + "="*80)
    
    return test_results["failed"] == 0

def main():
    """Main test execution"""
    print_header("ADMIN PRODUCTS API & CLOUDINARY INTEGRATION TESTING")
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Token: {ADMIN_TOKEN}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests
    test_cloudinary_sign()
    test_admin_products_get()
    product_id = test_admin_products_post()
    test_admin_products_put(product_id)
    test_admin_products_delete(product_id)
    test_product_data_validation()
    
    # Print summary
    all_passed = print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
