#!/usr/bin/env python3
"""
Backend API Test Suite for Mr. COCO Bakery - Authentication Flow
Tests customer authentication including signup, login, session management, and Google OAuth setup
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://coco-premium-bakes.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

# Test data
TEST_USER = {
    "name": "Test Customer",
    "email": "test@mrcocobakery.com",
    "password": "Test123!@#",
    "phone": "9876543210"
}

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def test_signup():
    """Test 1: User Signup - Create test account if doesn't exist"""
    print_test_header("User Signup (POST /api/auth/signup)")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=TEST_USER,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            if not data.get('success'):
                print_result(False, "Response missing 'success' field")
                return None
            
            if 'user' not in data:
                print_result(False, "Response missing 'user' field")
                return None
            
            if 'token' not in data:
                print_result(False, "Response missing 'token' field")
                return None
            
            user = data['user']
            
            # Verify user data
            if 'password' in user:
                print_result(False, "User object contains password field (security issue)")
                return None
            
            if user.get('email') != TEST_USER['email'].lower():
                print_result(False, f"Email mismatch: expected {TEST_USER['email'].lower()}, got {user.get('email')}")
                return None
            
            if user.get('name') != TEST_USER['name']:
                print_result(False, f"Name mismatch: expected {TEST_USER['name']}, got {user.get('name')}")
                return None
            
            # Check for httpOnly cookie
            cookies = response.cookies
            if 'token' not in cookies:
                print_result(False, "No 'token' cookie set in response")
                return None
            
            print(f"Cookie 'token' set: {cookies['token'][:20]}...")
            
            print_result(True, f"User created successfully with ID: {user.get('_id')}")
            return data['token']
            
        elif response.status_code == 400 and 'already registered' in response.text.lower():
            print_result(True, "User already exists (expected for existing test account)")
            return "USER_EXISTS"
        else:
            print_result(False, f"Unexpected status code: {response.status_code}")
            return None
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return None

def test_login():
    """Test 2: User Login - Authenticate with email/password"""
    print_test_header("User Login (POST /api/auth/login)")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={
                "email": TEST_USER['email'],
                "password": TEST_USER['password']
            },
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            if not data.get('success'):
                print_result(False, "Response missing 'success' field")
                return None
            
            if 'user' not in data:
                print_result(False, "Response missing 'user' field")
                return None
            
            if 'token' not in data:
                print_result(False, "Response missing 'token' field")
                return None
            
            user = data['user']
            token = data['token']
            
            # Verify user data
            if 'password' in user:
                print_result(False, "User object contains password field (security issue)")
                return None
            
            if user.get('email') != TEST_USER['email'].lower():
                print_result(False, f"Email mismatch: expected {TEST_USER['email'].lower()}, got {user.get('email')}")
                return None
            
            # Check for httpOnly cookie
            cookies = response.cookies
            if 'token' not in cookies:
                print_result(False, "No 'token' cookie set in response")
                return None
            
            # Verify cookie attributes (from Set-Cookie header)
            set_cookie_header = response.headers.get('Set-Cookie', '')
            print(f"Set-Cookie header: {set_cookie_header}")
            
            if 'HttpOnly' not in set_cookie_header:
                print_result(False, "Cookie is not HttpOnly")
                return None
            
            if 'SameSite=Lax' not in set_cookie_header and 'SameSite=lax' not in set_cookie_header:
                print_result(False, "Cookie SameSite attribute not set to 'lax'")
                return None
            
            if 'Path=/' not in set_cookie_header:
                print_result(False, "Cookie Path not set to '/'")
                return None
            
            print_result(True, f"Login successful. Token: {token[:20]}...")
            print(f"✅ Cookie is HttpOnly: True")
            print(f"✅ Cookie SameSite: lax")
            print(f"✅ Cookie Path: /")
            
            return token
            
        else:
            print_result(False, f"Login failed with status: {response.status_code}")
            return None
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return None

def test_get_current_user_with_cookie(token):
    """Test 3: Get Current User with Cookie - Verify session with httpOnly cookie"""
    print_test_header("Get Current User with Cookie (GET /api/auth/me)")
    
    try:
        # Simulate cookie being sent by browser
        cookies = {'token': token}
        
        response = requests.get(
            f"{API_BASE}/auth/me",
            cookies=cookies,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 200:
            data = response.json()
            
            if not data.get('success'):
                print_result(False, "Response missing 'success' field")
                return False
            
            if 'user' not in data:
                print_result(False, "Response missing 'user' field")
                return False
            
            user = data['user']
            
            # Verify user data
            if 'password' in user:
                print_result(False, "User object contains password field (security issue)")
                return False
            
            if '_id' not in user:
                print_result(False, "User object missing '_id' field")
                return False
            
            if user.get('email') != TEST_USER['email'].lower():
                print_result(False, f"Email mismatch: expected {TEST_USER['email'].lower()}, got {user.get('email')}")
                return False
            
            print_result(True, f"User data retrieved successfully. User ID: {user.get('_id')}")
            print(f"✅ User email: {user.get('email')}")
            print(f"✅ User name: {user.get('name')}")
            print(f"✅ Password field excluded: True")
            
            return True
            
        else:
            print_result(False, f"Failed to get user with status: {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_current_user_without_token():
    """Test 4: Get Current User without Token - Should return 401"""
    print_test_header("Get Current User without Token (GET /api/auth/me)")
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 401:
            data = response.json()
            if 'error' in data:
                print_result(True, f"Correctly returned 401 Unauthorized: {data['error']}")
                return True
            else:
                print_result(False, "401 response missing 'error' field")
                return False
        else:
            print_result(False, f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_login_wrong_password():
    """Test 5: Login with Wrong Password - Should return 401"""
    print_test_header("Login with Wrong Password (POST /api/auth/login)")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={
                "email": TEST_USER['email'],
                "password": "WrongPassword123"
            },
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 401:
            data = response.json()
            if 'error' in data:
                print_result(True, f"Correctly rejected wrong password: {data['error']}")
                return True
            else:
                print_result(False, "401 response missing 'error' field")
                return False
        else:
            print_result(False, f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_google_oauth_callback_endpoint():
    """Test 6: Google OAuth Callback Endpoint - Verify endpoint exists and configuration"""
    print_test_header("Google OAuth Callback Endpoint (GET /api/auth/google/callback)")
    
    try:
        # We can't test the full OAuth flow, but we can verify the endpoint exists
        # and returns appropriate error for missing parameters
        response = requests.get(
            f"{API_BASE}/auth/google/callback",
            timeout=10,
            allow_redirects=False
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        # Should redirect (302/307) due to missing OAuth parameters
        if response.status_code in [302, 307, 308]:
            location = response.headers.get('Location', '')
            print(f"Redirect Location: {location}")
            
            if 'error=oauth_state' in location or 'error=oauth_failed' in location:
                print_result(True, "Google OAuth callback endpoint exists and handles missing parameters correctly")
                print(f"✅ Endpoint redirects to login with error parameter")
                return True
            else:
                print_result(True, "Google OAuth callback endpoint exists (redirects)")
                return True
        else:
            print_result(False, f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_cookie_configuration():
    """Test 7: Verify Cookie Configuration"""
    print_test_header("Cookie Configuration Verification")
    
    try:
        # Login to get cookie
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={
                "email": TEST_USER['email'],
                "password": TEST_USER['password']
            },
            timeout=10
        )
        
        if response.status_code != 200:
            print_result(False, "Login failed, cannot test cookie configuration")
            return False
        
        set_cookie_header = response.headers.get('Set-Cookie', '')
        print(f"Set-Cookie header: {set_cookie_header}")
        
        checks = {
            "Cookie name is 'token'": 'token=' in set_cookie_header,
            "HttpOnly": 'HttpOnly' in set_cookie_header,
            "SameSite=lax": 'SameSite=Lax' in set_cookie_header or 'SameSite=lax' in set_cookie_header,
            "Path=/": 'Path=/' in set_cookie_header,
            "Max-Age set": 'Max-Age=' in set_cookie_header
        }
        
        all_passed = True
        for check_name, passed in checks.items():
            status = "✅" if passed else "❌"
            print(f"{status} {check_name}: {passed}")
            if not passed:
                all_passed = False
        
        # Check Max-Age value (should be 30 days = 2592000 seconds or 7 days = 604800 seconds)
        if 'Max-Age=' in set_cookie_header:
            max_age_str = set_cookie_header.split('Max-Age=')[1].split(';')[0]
            max_age = int(max_age_str)
            days = max_age / (24 * 60 * 60)
            print(f"✅ Max-Age: {max_age} seconds ({days:.0f} days)")
            
            if days >= 7 and days <= 30:
                print(f"✅ Max-Age is within acceptable range (7-30 days)")
            else:
                print(f"⚠️  Max-Age is {days:.0f} days (expected 7-30 days)")
        
        if all_passed:
            print_result(True, "All cookie configuration checks passed")
            return True
        else:
            print_result(False, "Some cookie configuration checks failed")
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_session_persistence():
    """Test 8: Session Persistence - Verify token works across multiple requests"""
    print_test_header("Session Persistence Verification")
    
    try:
        # Login to get token
        login_response = requests.post(
            f"{API_BASE}/auth/login",
            json={
                "email": TEST_USER['email'],
                "password": TEST_USER['password']
            },
            timeout=10
        )
        
        if login_response.status_code != 200:
            print_result(False, "Login failed")
            return False
        
        token = login_response.json()['token']
        cookies = {'token': token}
        
        # Make multiple requests with the same token
        print("Making 3 consecutive requests with same token...")
        
        for i in range(1, 4):
            response = requests.get(
                f"{API_BASE}/auth/me",
                cookies=cookies,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                user = data.get('user', {})
                print(f"  Request {i}: ✅ Success - User: {user.get('email')}")
            else:
                print(f"  Request {i}: ❌ Failed - Status: {response.status_code}")
                print_result(False, f"Session persistence failed on request {i}")
                return False
        
        print_result(True, "Session persists across multiple requests")
        return True
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def run_all_tests():
    """Run all authentication tests"""
    print("\n" + "="*80)
    print("AUTHENTICATION FLOW TEST SUITE - Mr. COCO Bakery")
    print(f"Base URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    results = {}
    
    # Test 1: Signup
    token = test_signup()
    results['signup'] = token is not None or token == "USER_EXISTS"
    
    # Test 2: Login
    token = test_login()
    results['login'] = token is not None
    
    if token:
        # Test 3: Get current user with cookie
        results['get_user_with_cookie'] = test_get_current_user_with_cookie(token)
    else:
        results['get_user_with_cookie'] = False
        print_result(False, "Skipping get_user_with_cookie test (no token)")
    
    # Test 4: Get current user without token
    results['get_user_without_token'] = test_get_current_user_without_token()
    
    # Test 5: Login with wrong password
    results['login_wrong_password'] = test_login_wrong_password()
    
    # Test 6: Google OAuth callback endpoint
    results['google_oauth_callback'] = test_google_oauth_callback_endpoint()
    
    # Test 7: Cookie configuration
    results['cookie_configuration'] = test_cookie_configuration()
    
    # Test 8: Session persistence
    results['session_persistence'] = test_session_persistence()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    failed_tests = total_tests - passed_tests
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "-"*80)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {failed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    print("="*80 + "\n")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
