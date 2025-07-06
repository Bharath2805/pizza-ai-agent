import sqlite3
import json
from datetime import datetime

DATABASE_FILE = "orders.db"

def init_db():
    """Initialize the database"""
    conn = sqlite3.connect(DATABASE_FILE)
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
    conn = sqlite3.connect(DATABASE_FILE)
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

def get_order(order_id):
    """Get order from database"""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM orders WHERE order_id = ?', (order_id,))
    row = cursor.fetchone()
    
    conn.close()
    
    if row:
        return {
            "order_id": row[1],
            "timestamp": row[2],
            "customer": json.loads(row[3]),
            "items": json.loads(row[4]),
            "total": row[5],
            "status": row[6]
        }
    return None