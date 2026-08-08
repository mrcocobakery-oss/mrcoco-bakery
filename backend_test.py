#!/usr/bin/env python3
"""
Backend API Testing Script for Mr. COCO Bakery - Catalogue Management
Tests all catalogue-related endpoints with authentication and database validation
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://coco-premium-bakes.preview.emergentagent.com/api"

# Admin credentials
ADMIN_TOKEN = "admin_logged_in"

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

# ============================================================================
# TEST 1: GET /api/catalogue - Public Endpoint (No Auth Required)
# ============================================================================
def test_get_catalogue_public():
    print_test_header("GET /api/catalogue - Public Catalogue Fetch")
    
    try:
        response = requests.get(f"{BASE_URL}/catalogue", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            # Check response structure
            if 'success' in data and data['success'] == True:
                if 'catalogue' in data:
                    if data['catalogue'] is None:
                        record_test("GET /api/catalogue", True, "No catalogue uploaded yet (returns null as expected)")
                    else:
                        # Validate catalogue structure
                        catalogue = data['catalogue']
                        required_fields = ['fileUrl', 'fileName', 'uploadedAt']
                        missing_fields = [f for f in required_fields if f not in catalogue]
                        
                        if missing_fields:
                            record_test("GET /api/catalogue", False, f"Missing fields in catalogue: {missing_fields}")
                        else:
                            record_test("GET /api/catalogue", True, f"Catalogue fetched successfully: {catalogue['fileName']}")
                else:
                    record_test("GET /api/catalogue", False, "Response missing 'catalogue' field")
            else:
                record_test("GET /api/catalogue", False, "Response missing 'success' field or success is false")
        else:
            record_test("GET /api/catalogue", False, f"Unexpected status code: {response.status_code}")
            
    except Exception as e:
        record_test("GET /api/catalogue", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 2: POST /api/admin/catalogue - Unauthorized (No Token)
# ============================================================================
def test_post_catalogue_unauthorized():
    print_test_header("POST /api/admin/catalogue - Unauthorized Access")
    
    try:
        payload = {
            "fileUrl": "https://example.com/test-catalogue.pdf",
            "fileName": "test-catalogue.pdf",
            "fileSize": 1024000
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/catalogue",
            json=payload,
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if 'error' in data and 'Unauthorized' in data['error']:
                record_test("POST /api/admin/catalogue (No Auth)", True, "Correctly rejected unauthorized request with 401")
            else:
                record_test("POST /api/admin/catalogue (No Auth)", True, "Rejected with 401 but different error message")
        else:
            record_test("POST /api/admin/catalogue (No Auth)", False, f"Expected 401, got {response.status_code}")
            
    except Exception as e:
        record_test("POST /api/admin/catalogue (No Auth)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 3: POST /api/admin/catalogue - Missing Required Fields
# ============================================================================
def test_post_catalogue_missing_fields():
    print_test_header("POST /api/admin/catalogue - Missing Required Fields")
    
    try:
        # Missing fileName
        payload = {
            "fileUrl": "https://example.com/test-catalogue.pdf"
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/catalogue",
            json=payload,
            headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if 'error' in data:
                record_test("POST /api/admin/catalogue (Missing Fields)", True, f"Correctly rejected with 400: {data['error']}")
            else:
                record_test("POST /api/admin/catalogue (Missing Fields)", True, "Rejected with 400")
        else:
            record_test("POST /api/admin/catalogue (Missing Fields)", False, f"Expected 400, got {response.status_code}")
            
    except Exception as e:
        record_test("POST /api/admin/catalogue (Missing Fields)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 4: POST /api/admin/catalogue - Valid Upload with Admin Token
# ============================================================================
def test_post_catalogue_valid():
    print_test_header("POST /api/admin/catalogue - Valid Catalogue Upload")
    
    try:
        payload = {
            "fileUrl": "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
            "fileName": "Mr-COCO-Product-Catalogue-2025.pdf",
            "fileSize": 2048576
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/catalogue",
            json=payload,
            headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            # Validate response structure
            if data.get('success') == True:
                if 'message' in data and 'catalogue' in data:
                    catalogue = data['catalogue']
                    
                    # Validate catalogue fields
                    if catalogue.get('fileUrl') == payload['fileUrl'] and \
                       catalogue.get('fileName') == payload['fileName'] and \
                       catalogue.get('fileSize') == payload['fileSize'] and \
                       'uploadedAt' in catalogue:
                        record_test("POST /api/admin/catalogue (Valid)", True, f"Catalogue uploaded successfully: {catalogue['fileName']}")
                        return catalogue  # Return for use in other tests
                    else:
                        record_test("POST /api/admin/catalogue (Valid)", False, "Catalogue data doesn't match uploaded data")
                else:
                    record_test("POST /api/admin/catalogue (Valid)", False, "Response missing 'message' or 'catalogue' field")
            else:
                record_test("POST /api/admin/catalogue (Valid)", False, "Response success is false")
        else:
            data = response.json() if response.headers.get('content-type') == 'application/json' else {}
            record_test("POST /api/admin/catalogue (Valid)", False, f"Expected 200, got {response.status_code}: {data}")
            
    except Exception as e:
        record_test("POST /api/admin/catalogue (Valid)", False, f"Exception occurred: {str(e)}")
    
    return None

# ============================================================================
# TEST 5: GET /api/catalogue - Verify Uploaded Catalogue
# ============================================================================
def test_get_catalogue_after_upload():
    print_test_header("GET /api/catalogue - Verify Uploaded Catalogue")
    
    try:
        response = requests.get(f"{BASE_URL}/catalogue", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('success') == True and data.get('catalogue') is not None:
                catalogue = data['catalogue']
                
                # Verify it's the catalogue we just uploaded
                if catalogue.get('fileName') == "Mr-COCO-Product-Catalogue-2025.pdf":
                    record_test("GET /api/catalogue (After Upload)", True, f"Catalogue retrieved successfully: {catalogue['fileName']}")
                else:
                    record_test("GET /api/catalogue (After Upload)", True, f"Catalogue exists but different file: {catalogue.get('fileName')}")
            else:
                record_test("GET /api/catalogue (After Upload)", False, "No catalogue found after upload")
        else:
            record_test("GET /api/catalogue (After Upload)", False, f"Unexpected status code: {response.status_code}")
            
    except Exception as e:
        record_test("GET /api/catalogue (After Upload)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 6: POST /api/admin/catalogue - Replace Existing Catalogue
# ============================================================================
def test_post_catalogue_replace():
    print_test_header("POST /api/admin/catalogue - Replace Existing Catalogue")
    
    try:
        payload = {
            "fileUrl": "https://res.cloudinary.com/demo/raw/upload/sample2.pdf",
            "fileName": "Mr-COCO-Updated-Catalogue-2025.pdf",
            "fileSize": 3145728
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/catalogue",
            json=payload,
            headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('success') == True and data.get('catalogue', {}).get('fileName') == payload['fileName']:
                record_test("POST /api/admin/catalogue (Replace)", True, "Old catalogue replaced with new one successfully")
                
                # Verify only one catalogue exists
                get_response = requests.get(f"{BASE_URL}/catalogue", timeout=10)
                if get_response.status_code == 200:
                    get_data = get_response.json()
                    if get_data.get('catalogue', {}).get('fileName') == payload['fileName']:
                        print_info("✓ Verified: Only new catalogue exists (old one was deleted)")
                    else:
                        print_info("⚠ Warning: Retrieved catalogue doesn't match uploaded one")
            else:
                record_test("POST /api/admin/catalogue (Replace)", False, "Failed to replace catalogue")
        else:
            record_test("POST /api/admin/catalogue (Replace)", False, f"Expected 200, got {response.status_code}")
            
    except Exception as e:
        record_test("POST /api/admin/catalogue (Replace)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 7: DELETE /api/admin/catalogue - Unauthorized
# ============================================================================
def test_delete_catalogue_unauthorized():
    print_test_header("DELETE /api/admin/catalogue - Unauthorized Access")
    
    try:
        response = requests.delete(f"{BASE_URL}/admin/catalogue", timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            record_test("DELETE /api/admin/catalogue (No Auth)", True, "Correctly rejected unauthorized delete with 401")
        else:
            record_test("DELETE /api/admin/catalogue (No Auth)", False, f"Expected 401, got {response.status_code}")
            
    except Exception as e:
        record_test("DELETE /api/admin/catalogue (No Auth)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 8: DELETE /api/admin/catalogue - Valid Delete with Admin Token
# ============================================================================
def test_delete_catalogue_valid():
    print_test_header("DELETE /api/admin/catalogue - Valid Catalogue Delete")
    
    try:
        response = requests.delete(
            f"{BASE_URL}/admin/catalogue",
            headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('success') == True and 'message' in data:
                record_test("DELETE /api/admin/catalogue (Valid)", True, f"Catalogue deleted successfully: {data['message']}")
                
                # Verify catalogue is deleted
                get_response = requests.get(f"{BASE_URL}/catalogue", timeout=10)
                if get_response.status_code == 200:
                    get_data = get_response.json()
                    if get_data.get('catalogue') is None:
                        print_info("✓ Verified: Catalogue is null after deletion")
                    else:
                        print_info("⚠ Warning: Catalogue still exists after deletion")
            else:
                record_test("DELETE /api/admin/catalogue (Valid)", False, "Response missing success or message")
        else:
            record_test("DELETE /api/admin/catalogue (Valid)", False, f"Expected 200, got {response.status_code}")
            
    except Exception as e:
        record_test("DELETE /api/admin/catalogue (Valid)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# TEST 9: GET /api/catalogue - Verify Catalogue Deleted
# ============================================================================
def test_get_catalogue_after_delete():
    print_test_header("GET /api/catalogue - Verify Catalogue Deleted")
    
    try:
        response = requests.get(f"{BASE_URL}/catalogue", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('success') == True and data.get('catalogue') is None:
                record_test("GET /api/catalogue (After Delete)", True, "Catalogue is null as expected after deletion")
            else:
                record_test("GET /api/catalogue (After Delete)", False, "Catalogue still exists after deletion")
        else:
            record_test("GET /api/catalogue (After Delete)", False, f"Unexpected status code: {response.status_code}")
            
    except Exception as e:
        record_test("GET /api/catalogue (After Delete)", False, f"Exception occurred: {str(e)}")

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================
def main():
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}Mr. COCO Bakery - Catalogue Management API Testing{RESET}")
    print(f"{BLUE}Base URL: {BASE_URL}{RESET}")
    print(f"{BLUE}Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    # Run all tests in sequence
    test_get_catalogue_public()
    test_post_catalogue_unauthorized()
    test_post_catalogue_missing_fields()
    test_post_catalogue_valid()
    test_get_catalogue_after_upload()
    test_post_catalogue_replace()
    test_delete_catalogue_unauthorized()
    test_delete_catalogue_valid()
    test_get_catalogue_after_delete()
    
    # Print summary
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    print(f"{GREEN}Tests Passed: {tests_passed}{RESET}")
    print(f"{RED}Tests Failed: {tests_failed}{RESET}")
    print(f"Total Tests: {tests_passed + tests_failed}")
    print(f"Success Rate: {(tests_passed / (tests_passed + tests_failed) * 100):.1f}%")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    # Exit with appropriate code
    sys.exit(0 if tests_failed == 0 else 1)

if __name__ == "__main__":
    main()
