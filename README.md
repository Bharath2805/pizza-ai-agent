# Pizza AI Agent - Complete Implementation
https://www.mermaidchart.com/app/projects/0f052ec8-4a50-4db5-9721-49e062d81108/diagrams/71205c70-82cb-4327-8efa-90bae2e55218/version/v0.1/edit

A full-stack pizza ordering system powered by AI, featuring voice recognition and text-to-speech capabilities.

## Project Overview

This project is a web application that allows users to order pizzas using text or voice input. It includes a menu display, a chat interface with AI assistance, and an order summary that updates in real time. The app is designed to be user-friendly on both desktop and mobile devices.

### Frontend
- Built with React 18 for a dynamic user interface
- Uses Vite as the build tool for fast development
- Includes voice input (Web Speech API) and text-to-speech (Speech Synthesis API)
- Features a responsive design with custom CSS styling
- Uses Lucide React for icons

### Backend
- Built with FastAPI, a Python web framework
- Uses OpenAI GPT-3.5 for AI-powered chat
- Stores data in an SQLite database
- Includes data validation with Pydantic
- Supports cross-origin requests with CORS middleware

How It Works
A visual representation of the workflow can be found in the 
https://www.mermaidchart.com/app/projects/0f052ec8-4a50-4db5-9721-49e062d81108/diagrams/71205c70-82cb-4327-8efa-90bae2e55218/version/v0.1/edit.

### Main Features
- **Voice Input**: Users can speak their order using a microphone button
- **Text-to-Speech**: The AI responds with spoken messages
- **Auto-Submit**: Voice messages are sent automatically when the user stops speaking
- **Menu Slider**: Browse pizzas with left/right navigation arrows
- **Category Filter**: Filter pizzas by type (e.g., Classic, Vegetarian, Vegan)
- **Real-Time Order**: The order summary updates as the user interacts with the AI
- **Smart Parsing**: The AI understands natural language to extract pizza type, size, toppings, address, and phone number

## Project Structure
```
pizza-ai-agent/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx    # Handles voice and text chat
│   │   │   ├── MenuDisplay.jsx      # Displays menu with slider
│   │   │   └── OrderSummary.jsx     # Shows real-time order updates
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Application styles
│   │   └── main.jsx                 # Entry point for React
│   └── package.json
├── backend/
│   ├── main.py                      # FastAPI application
│   ├── pizza_menu.py                # Menu data
│   ├── prompt_template.py           # AI prompt templates
│   └── requirements.txt
└── README.md
```

## How It Works

### User Interaction
- The app opens with a pizza menu display
- The AI greets the user with "Hello! I'd like to order a pizza"
- Users can type or speak their order

### Voice Features
- Click the microphone button to use voice input
- Toggle the speaker button to enable or disable AI voice responses
- Toggle the auto-submit button to send voice messages automatically

### Order Processing
The AI understands natural language inputs like:
- "I want a pepperoni pizza"
- "Make it large"
- "Add olives"
- "My address is 123 Main Street"
- "Phone number is 555-1234"

### Menu Navigation
- Click the filter button to view category options
- Select a category (e.g., Vegetarian) to filter pizzas
- Use arrow buttons to browse pizzas in a slider
- View visual size indicators to compare pizza sizes

### Order Completion
- The order summary updates in real time as the user adds items
- Displays pizza details, customer information, and total price
- The "Complete Order" button activates once an address is provided
- Orders are saved to the database with a unique order ID

## Installation and Setup

### Requirements
- Python 3.8 or higher
- Node.js 16 or higher
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn openai python-dotenv pydantic sqlalchemy
   ```
4. Create a `.env` file with your OpenAI API key:
   ```bash
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Features Demo

### Voice Interaction
1. Click the microphone button
2. Say "I want a margherita pizza"
3. The AI responds and asks for the size
4. Say "medium please"
5. The order updates automatically

### Menu Browsing
1. Click the filter button in the menu
2. Select the "Vegetarian" category
3. Use arrow buttons to browse pizzas
4. View visual indicators for pizza sizes

### Order Management
1. Watch the order summary update in real time
2. Provide delivery address and phone number
3. Click the "Complete Order" button
4. Receive an order confirmation with a unique ID

## Data Format

### Order JSON Structure
```json
{
  "order_id": "ORD-20240115-abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "customer": {
    "address": "123 Main Street, Berlin 13158",
    "phone": "+49 15223 350056"
  },
  "items": [
    {
      "pizza": "Margherita",
      "size": "Medium",
      "toppings": [{"name": "Olives", "price": 1.50}],
      "price": 14.49
    }
  ],
  "total": 14.49,
  "status": "confirmed"
}
```

### Menu Structure
- **Pizza Types**: Margherita, Pepperoni, Vegetarian, Hawaiian, Meat Lovers, Vegan Delight
- **Sizes**: Small (0.8x price), Medium (1.0x price), Large (1.3x price)
- **Toppings**: Extra cheese, mushrooms, pepperoni, etc.
- **Categories**: Classic, Vegetarian, Specialty, Vegan

## Browser Compatibility

### Voice Features
- Chrome/Edge: Full support
- Safari: Partial support
- Firefox: Limited support
- Mobile: Touch-friendly interface

### Responsive Design
- **Desktop**: Three-column layout (Menu, Chat, Order)
- **Tablet**: Stacked layout
- **Mobile**: Single-column layout with touch-optimized controls

## Project Highlights

### Technical Features
- Real-time voice recognition and text-to-speech
- AI-powered natural language processing
- Responsive design with custom CSS animations
- RESTful API with automatic documentation
- Real-time order tracking and updates
- Session management for continuous conversations

### User Experience
- Easy-to-use voice controls with visual feedback
- Smooth menu navigation with a slider
- Automatic voice message submission for hands-free ordering
- Visual indicators for pizza sizes
- Real-time order summary updates
- Mobile-friendly design

## Future Improvements
- Add payment integration
- Include order tracking with delivery status
- Support user authentication and order history
- Add multi-language support
- Include advanced dietary filters
- Send SMS or email notifications

## Authors
This project was built as a team effort to showcase modern web development with AI integration, voice recognition, and responsive design principles.
