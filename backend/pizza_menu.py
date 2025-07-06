MENU = {
    "pizzas": [
        {
            "id": 1,
            "name": "Margherita",
            "price": 12.99,
            "description": "Fresh tomato sauce, mozzarella cheese, fresh basil",
            "category": "classic"
        },
        {
            "id": 2,
            "name": "Pepperoni",
            "price": 14.99,
            "description": "Tomato sauce, mozzarella cheese, pepperoni",
            "category": "classic"
        },
        {
            "id": 3,
            "name": "Vegetarian",
            "price": 15.99,
            "description": "Tomato sauce, mozzarella, bell peppers, mushrooms, onions, olives",
            "category": "vegetarian"
        },
        {
            "id": 4,
            "name": "Hawaiian",
            "price": 16.99,
            "description": "Tomato sauce, mozzarella, ham, pineapple",
            "category": "specialty"
        },
        {
            "id": 5,
            "name": "Meat Lovers",
            "price": 18.99,
            "description": "Tomato sauce, mozzarella, pepperoni, sausage, bacon, ham",
            "category": "specialty"
        },
        {
            "id": 6,
            "name": "Vegan Delight",
            "price": 17.99,
            "description": "Tomato sauce, vegan cheese, mushrooms, peppers, onions, spinach",
            "category": "vegan"
        }
    ],
    "sizes": [
        {"id": 1, "name": "Small", "multiplier": 0.8},
        {"id": 2, "name": "Medium", "multiplier": 1.0},
        {"id": 3, "name": "Large", "multiplier": 1.3}
    ],
    "toppings": [
        {"id": 1, "name": "Extra Cheese", "price": 2.00},
        {"id": 2, "name": "Mushrooms", "price": 1.50},
        {"id": 3, "name": "Pepperoni", "price": 2.50},
        {"id": 4, "name": "Bell Peppers", "price": 1.50},
        {"id": 5, "name": "Onions", "price": 1.00},
        {"id": 6, "name": "Olives", "price": 1.50},
        {"id": 7, "name": "Bacon", "price": 3.00},
        {"id": 8, "name": "Sausage", "price": 2.50},
        {"id": 9, "name": "Spinach", "price": 1.50},
        {"id": 10, "name": "Pineapple", "price": 2.00}
    ]
}

def get_menu_text():
    """Format menu for AI prompt"""
    menu_text = "PIZZA MENU:\n\n"
    
    menu_text += "PIZZAS:\n"
    for pizza in MENU["pizzas"]:
        menu_text += f"- {pizza['name']}: ${pizza['price']:.2f} - {pizza['description']}\n"
    
    menu_text += "\nSIZES:\n"
    for size in MENU["sizes"]:
        menu_text += f"- {size['name']}: {size['multiplier']}x base price\n"
    
    menu_text += "\nEXTRA TOPPINGS:\n"
    for topping in MENU["toppings"]:
        menu_text += f"- {topping['name']}: +${topping['price']:.2f}\n"
    
    return menu_text