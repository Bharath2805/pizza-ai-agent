# main.py - FIXED ORDER PARSING VERSION
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import sqlite3
from datetime import datetime
import uuid
import re

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Pizza AI Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Import menu and models
from pizza_menu import MENU, get_menu_text
from prompt_template import get_system_prompt

# Simple in-memory database for demo
conversation_sessions = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

def init_db():
    """Initialize the database"""
    conn = sqlite3.connect("orders.db")
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            timestamp TEXT NOT NULL,
            customer_data TEXT NOT NULL,
            items_data TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def save_order(order_data):
    """Save order to database"""
    conn = sqlite3.connect("orders.db")
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO orders (order_id, timestamp, customer_data, items_data, total, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        order_data["order_id"],
        order_data["timestamp"],
        json.dumps(order_data["customer"]),
        json.dumps(order_data["items"]),
        order_data["total"],
        order_data["status"],
        datetime.now().isoformat()
    ))
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

@app.get("/")
async def root():
    return {"message": "Pizza AI Agent API is running!"}

@app.get("/api/menu")
async def get_menu():
    """Get the pizza menu"""
    return MENU

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Handle chat conversation with the AI agent"""
    try:
        print(f"Received message: {request.message}")
        
        # Get or create session
        session_id = request.session_id or str(uuid.uuid4())
        
        if session_id not in conversation_sessions:
            conversation_sessions[session_id] = {
                "messages": [],
                "order": {
                    "items": [],
                    "customer": {},
                    "total": 0,
                    "status": "building"
                }
            }
        
        session = conversation_sessions[session_id]
        
        # Add user message to conversation
        session["messages"].append({
            "role": "user",
            "content": request.message
        })
        
        # Enhanced order parsing BEFORE AI call
        order_updated = enhanced_order_parsing(session["order"], request.message, session["messages"])
        
        # Prepare system prompt with current order context
        system_prompt = get_system_prompt(
            menu=get_menu_text(),
            current_order=session["order"]
        )
        
        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt}
        ] + session["messages"]
        
        print("Calling OpenAI API...")
        
        # Get response from OpenAI
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_message = response.choices[0].message.content
        print(f"AI Response: {ai_message}")
        
        # Add AI response to conversation
        session["messages"].append({
            "role": "assistant",
            "content": ai_message
        })
        
        # Update order total
        session["order"]["total"] = calculate_order_total(session["order"]["items"])
        
        print(f"Current order: {session['order']}")
        
        return {
            "message": ai_message,
            "session_id": session_id,
            "order": session["order"],
            "order_updated": order_updated
        }
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


      
# backend/main.py - FIXED ORDER PARSING
# Replace the enhanced_order_parsing function in your main.py with this improved version

def enhanced_order_parsing(order: Dict, user_message: str, conversation_history: List) -> bool:
    """Enhanced order parsing with better logic"""
    order_updated = False
    user_msg_lower = user_message.lower()
    
    print(f"Parsing message: {user_message}")
    
    # 1. Parse Pizza Selection
    for pizza in MENU["pizzas"]:
        if pizza["name"].lower() in user_msg_lower:
            # Check if this pizza is already in the order
            existing_item = None
            for item in order["items"]:
                if item.get("pizza") == pizza["name"]:
                    existing_item = item
                    break
            
            if not existing_item:
                new_item = {
                    "pizza": pizza["name"],
                    "size": "Medium",  # Default
                    "toppings": [],
                    "special_requests": "",
                    "base_price": pizza["price"],
                    "price": pizza["price"]  # Will be updated with size/toppings
                }
                order["items"].append(new_item)
                order_updated = True
                print(f"Added pizza: {pizza['name']}")
    
    # 2. Parse Size (look for the most recent size mention)
    sizes = ["small", "medium", "large"]
    for size in sizes:
        if size in user_msg_lower and order["items"]:
            # Update the last pizza's size
            last_item = order["items"][-1]
            last_item["size"] = size.capitalize()
            
            # Update price based on size multiplier
            size_multiplier = next((s["multiplier"] for s in MENU["sizes"] if s["name"].lower() == size), 1.0)
            base_price = last_item["base_price"]
            toppings_price = sum(t.get("price", 0) for t in last_item.get("toppings", []))
            last_item["price"] = round((base_price * size_multiplier) + toppings_price, 2)
            
            order_updated = True
            print(f"Updated size to: {size.capitalize()}, new price: {last_item['price']}")
    
    # 3. Parse Toppings
    for topping in MENU["toppings"]:
        if topping["name"].lower() in user_msg_lower and order["items"]:
            last_item = order["items"][-1]
            
            # Check if topping already exists
            existing_topping = next((t for t in last_item.get("toppings", []) if t["name"] == topping["name"]), None)
            
            if not existing_topping:
                if "toppings" not in last_item:
                    last_item["toppings"] = []
                
                last_item["toppings"].append({
                    "name": topping["name"],
                    "price": topping["price"]
                })
                
                # Recalculate price
                size_multiplier = next((s["multiplier"] for s in MENU["sizes"] 
                                     if s["name"].lower() == last_item["size"].lower()), 1.0)
                base_price = last_item["base_price"]
                toppings_price = sum(t["price"] for t in last_item["toppings"])
                last_item["price"] = round((base_price * size_multiplier) + toppings_price, 2)
                
                order_updated = True
                print(f"Added topping: {topping['name']}, new price: {last_item['price']}")
    
    # 4. Parse Address - IMPROVED PATTERNS
    address_indicators = ["address", "delivery", "berlin", "street", "str", "avenue", "ave", "road", "rd"]
    
    # Check if message contains address-like content
    has_address_indicator = any(indicator in user_msg_lower for indicator in address_indicators)
    has_numbers = any(char.isdigit() for char in user_message)
    
    if has_address_indicator or has_numbers:
        # Enhanced address patterns
        patterns_to_try = [
            # Berlin specific pattern
            r'berlin\s+.*?\s*(\d+)',
            # General street pattern
            r'(\d+\s+\w+(?:\s+\w+)*\s*(?:street|str|avenue|ave|road|rd|straße|strasse))',
            # Address with numbers
            r'([a-zA-Z]+(?:\s+[a-zA-Z]+)*\s+\d+(?:\s+\d+)*)',
            # Any text with city/location indicators
            r'(.*(?:berlin|address|delivery).*)',
        ]
        
        address_captured = False
        for pattern in patterns_to_try:
            match = re.search(pattern, user_message, re.IGNORECASE)
            if match and not address_captured:
                captured_address = user_message.strip()
                # Clean up the address
                if len(captured_address) > 5:  # Minimum reasonable address length
                    order["customer"]["address"] = captured_address
                    order_updated = True
                    address_captured = True
                    print(f"Captured address: {captured_address}")
                    break
    
    # 5. Parse Phone Number - IMPROVED PATTERNS
    phone_patterns = [
        r'\+?\d{2,3}[-\s]?\d{4,5}[-\s]?\d{4,6}',  # International format with spaces/dashes
        r'\b\d{5,6}[-\s]?\d{6}\b',  # German format: 12345 678901
        r'\b\d{4,5}[-\s]?\d{3}[-\s]?\d{4}\b',  # US format: 1234-567-8901
        r'\b\d{10,15}\b',  # Just digits
    ]
    
    for pattern in phone_patterns:
        phone_match = re.search(pattern, user_message)
        if phone_match:
            phone_number = phone_match.group().strip()
            # Clean up phone number
            cleaned_phone = re.sub(r'[^\d+]', '', phone_number)
            if len(cleaned_phone) >= 8:  # Minimum reasonable phone length
                # Format nicely
                if not phone_number.startswith('+') and len(cleaned_phone) > 10:
                    formatted_phone = f"+{cleaned_phone}"
                else:
                    formatted_phone = phone_number
                
                order["customer"]["phone"] = formatted_phone
                order_updated = True
                print(f"Captured phone: {formatted_phone}")
                break
    
    # 6. Parse Name
    name_patterns = [
        r'(?:name is|i\'m|i am|call me)\s+([a-zA-Z\s]+)',
        r'my name is\s+([a-zA-Z\s]+)',
    ]
    
    for pattern in name_patterns:
        name_match = re.search(pattern, user_message, re.IGNORECASE)
        if name_match:
            name = name_match.group(1).strip()
            if len(name) > 1:
                order["customer"]["name"] = name
                order_updated = True
                print(f"Captured name: {name}")
                break
    
    return order_updated


@app.post("/api/order/complete")
async def complete_order(request: dict):
    """Complete and save the order"""
    try:
        session_id = request.get("session_id")
        if not session_id or session_id not in conversation_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = conversation_sessions[session_id]
        order_data = session["order"]
        
        # Validate order
        if not order_data["items"]:
            raise HTTPException(status_code=400, detail="No items in order")
        
        if not order_data["customer"].get("address"):
            raise HTTPException(status_code=400, detail="Delivery address required")
        
        # Generate order ID and save
        order_id = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}"
        
        final_order = {
            "order_id": order_id,
            "timestamp": datetime.now().isoformat(),
            "customer": order_data["customer"],
            "items": order_data["items"],
            "total": calculate_order_total(order_data["items"]),
            "status": "confirmed"
        }
        
        # Save to database
        save_order(final_order)
        
        # Clean up session
        del conversation_sessions[session_id]
        
        return final_order
        
    except Exception as e:
        print(f"Error completing order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/order/{order_id}")
async def get_order(order_id: str):
    """Get order details"""
    try:
        return {"order_id": order_id, "status": "Order lookup not implemented"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_order_total(items: List[Dict]) -> float:
    """Calculate total order price"""
    total = 0
    for item in items:
        total += item.get("price", 0)
    return round(total, 2)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)