# 🍕 Pizza AI Agent - Complete Implementation

A full-stack AI-powered pizza ordering system with speech recognition capabilities.

## 📋 Features

- **AI-Powered Chat**: Natural conversation with OpenAI GPT
- **Speech Recognition**: Voice input for hands-free ordering
- **Text-to-Speech**: AI responses are spoken aloud
- **Real-time Order Tracking**: Live order summary updates
- **Menu Integration**: Complete pizza menu with prices
- **Order Management**: JSON/CSV export functionality
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite
- **AI**: OpenAI GPT-3.5/GPT-4
- **Database**: SQLite
- **Speech**: Web Speech API
- **Styling**: Custom CSS with modern design

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd pizza-ai-agent

# Create project structure
mkdir -p backend frontend/{src/{components,services,hooks},public} docs
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn openai python-dotenv pydantic sqlalchemy python-multipart

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "OPENAI_MODEL=gpt-3.5-turbo" >> .env
echo "DATABASE_URL=sqlite:///./orders.db" >> .env
```

### 3. Frontend Setup
```bash
cd ../frontend

# Initialize React project
npm create vite@latest . -- --template react
npm install

# Install additional dependencies
npm install axios lucide-react
```

### 4. Copy Implementation Files

Copy the backend files into `/backend/`:
- `main.py`
- `models.py` 
- `prompt_template.py`
- `pizza_menu.py`
- `database.py`

Copy the frontend files into `/frontend/src/`:
- `App.jsx`
- `App.css`
- `main.jsx`
- `components/ChatInterface.jsx`
- `components/MenuDisplay.jsx`
- `components/OrderSummary.jsx`
- `hooks/useSpeech.js`
- `services/api.js`

### 5. Update Configuration Files

**frontend/vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

**frontend/index.html:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/pizza.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pizza AI Agent</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 6. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
# Activate virtual environment first
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to use the application!

## 📱 Usage

1. **Start Conversation**: The AI will greet you automatically
2. **Voice Input**: Click the microphone button to use speech recognition
3. **Order Pizza**: Tell the AI what pizza you want
4. **Customize**: Add toppings, specify size, mention dietary requirements
5. **Provide Details**: Give delivery address and contact information
6. **Confirm Order**: Review your order and complete the purchase

## 🗂️ Project Structure

```
pizza-ai-agent/
├── backend/
│   ├── main.py              # FastAPI app and routes
│   ├── models.py            # Pydantic data models
│   ├── prompt_template.py   # AI prompt engineering
│   ├── pizza_menu.py        # Menu catalog
│   ├── database.py          # SQLite operations
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MenuDisplay.jsx
│   │   │   └── OrderSummary.jsx
│   │   ├── hooks/
│   │   │   └── useSpeech.js # Speech recognition hook
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Styling
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── flowchart.md         # Conversation flow diagram
│   └── report.pdf           # Project report
└── README.md
```

## 🔧 Configuration

### Environment Variables (.env)
```env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
DATABASE_URL=sqlite:///./orders.db
```

### Menu Customization
Edit `pizza_menu.py` to add/modify:
- Pizza varieties and prices
- Available toppings
- Size options
- Dietary categories

### AI Prompt Tuning
Modify `prompt_template.py` to:
- Change conversation flow
- Adjust AI personality
- Add new features
- Handle edge cases

## 📊 Order Data Format

Orders are stored in JSON format:
```json
{
  "order_id": "ORD-20240115-abc12345",
  "timestamp": "2024-01-15T10:30:00Z",
  "customer": {
    "address": "123 Main St, City, State 12345",
    "phone": "+1234567890"
  },
  "items": [
    {
      "pizza": "Margherita",
      "size": "Large",
      "toppings": ["Extra Cheese"],
      "special_requests": "Light sauce",
      "price": 16.99
    }
  ],
  "total": 16.99,
  "status": "confirmed"
}
```

## 🎯 API Endpoints

- `GET /api/menu` - Retrieve pizza menu
- `POST /api/chat` - Send message to AI agent
- `POST /api/order/complete` - Complete and save order
- `GET /api/order/{order_id}` - Retrieve order details
- `GET /docs` - Interactive API documentation

## 🧪 Testing

### Manual Testing
1. Test conversation flow with various inputs
2. Verify speech recognition accuracy
3. Test order completion with missing information
4. Try dietary restrictions and special requests

### Browser Compatibility
- Chrome/Edge: Full speech support
- Firefox: Limited speech support
- Safari: Partial speech support
- Mobile: Touch-friendly interface

## 🔍 Troubleshooting

### Common Issues

**API Key Error:**
```
Make sure your OpenAI API key is correctly set in backend/.env
```

**CORS Errors:**
```
Ensure backend is running on port 8000 and frontend on port 3000
```

**Speech Not Working:**
```
- Check browser compatibility
- Enable microphone permissions
- Use HTTPS in production
```

**Database Errors:**
```
The SQLite database is created automatically on first run
```

## 📈 Future Enhancements

- [ ] User authentication and order history
- [ ] Real-time order tracking with delivery updates
- [ ] Payment integration (Stripe/PayPal)
- [ ] Multi-language support
- [ ] Restaurant admin dashboard
- [ ] SMS/Email notifications
- [ ] Advanced dietary filtering
- [ ] Order scheduling/pre-ordering

## 📝 Documentation

For detailed implementation information, see:
- `docs/flowchart.md` - Conversation flow diagram
- `docs/report.pdf` - Complete project report
- `/docs` endpoint - Interactive API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes.

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all dependencies are installed
4. Ensure environment variables are set correctly

---

**Happy Pizza Ordering! 🍕🤖**