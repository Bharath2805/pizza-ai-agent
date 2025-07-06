# test_api.py - Run this to test your API
import requests
import json

BASE_URL = "http://localhost:8000"

def test_menu():
    """Test the menu endpoint"""
    print("🍕 Testing Menu Endpoint...")
    response = requests.get(f"{BASE_URL}/api/menu")
    if response.status_code == 200:
        print("✅ Menu endpoint working!")
        menu = response.json()
        print(f"   Found {len(menu['pizzas'])} pizzas")
        return True
    else:
        print(f"❌ Menu endpoint failed: {response.status_code}")
        return False

def test_chat():
    """Test the chat endpoint"""
    print("\n💬 Testing Chat Endpoint...")
    
    # Test message
    chat_data = {
        "message": "Hi, I want to order a pizza",
        "session_id": None
    }
    
    response = requests.post(
        f"{BASE_URL}/api/chat", 
        json=chat_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        print("✅ Chat endpoint working!")
        data = response.json()
        print(f"   AI Response: {data['message'][:100]}...")
        print(f"   Session ID: {data['session_id']}")
        return data['session_id']
    else:
        print(f"❌ Chat endpoint failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None

def test_order_flow(session_id):
    """Test a complete order flow"""
    if not session_id:
        return
        
    print("\n🛒 Testing Order Flow...")
    
    messages = [
        "I want a Margherita pizza",
        "Large size please",
        "My address is 123 Main Street, New York, NY 10001",
        "My phone is 555-123-4567"
    ]
    
    for msg in messages:
        print(f"   Sending: {msg}")
        chat_data = {
            "message": msg,
            "session_id": session_id
        }
        
        response = requests.post(
            f"{BASE_URL}/api/chat", 
            json=chat_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   AI: {data['message'][:80]}...")
            if data.get('order') and data['order'].get('items'):
                print(f"   Order items: {len(data['order']['items'])}")
        else:
            print(f"   ❌ Failed: {response.status_code}")

def main():
    print("🧪 API Testing Script")
    print("=" * 50)
    
    # Test 1: Menu
    menu_ok = test_menu()
    
    # Test 2: Chat
    session_id = test_chat()
    
    # Test 3: Order flow
    if session_id:
        test_order_flow(session_id)
    
    print("\n" + "=" * 50)
    if menu_ok and session_id:
        print("🎉 All tests passed! Your API is working correctly.")
        print("\n📋 Next steps:")
        print("1. Go to http://localhost:8000/docs for Swagger UI")
        print("2. Test the frontend chat interface")
        print("3. Try the speech features")
    else:
        print("❌ Some tests failed. Check your backend setup.")

if __name__ == "__main__":
    main()