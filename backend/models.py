from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatResponse(BaseModel):
    message: str
    session_id: str
    order: Dict[str, Any]
    order_updated: bool = False

class OrderItem(BaseModel):
    pizza: str
    size: str
    toppings: List[str] = []
    special_requests: Optional[str] = None
    price: float

class Customer(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    name: Optional[str] = None

class Order(BaseModel):
    order_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    customer: Customer
    items: List[OrderItem]
    total: float
    dietary_notes: Optional[str] = None
    delivery_instructions: Optional[str] = None
    status: str = "building"