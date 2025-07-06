import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import MenuDisplay from './components/MenuDisplay';
import OrderSummary from './components/OrderSummary';
import './App.css';

function App() {
  const [menu, setMenu] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({
    items: [],
    customer: {},
    total: 0,
    status: 'building'
  });
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      console.log("Fetching menu...");
      const response = await fetch('/api/menu');
      const menuData = await response.json();
      console.log("Menu loaded:", menuData);
      setMenu(menuData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  const handleOrderUpdate = (order, session_id) => {
    console.log("Order updated:", order);
    setCurrentOrder(order || {
      items: [],
      customer: {},
      total: 0,
      status: 'building'
    });
    if (session_id) {
      setSessionId(session_id);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍕 Tony's Pizza AI Assistant</h1>
        <p>Order your favorite pizza with our AI-powered assistant</p>
      </header>
      
      <div className="app-container">
        <div className="left-panel">
          <MenuDisplay menu={menu} />
        </div>
        
        <div className="center-panel">
          <ChatInterface 
            onOrderUpdate={handleOrderUpdate}
            sessionId={sessionId}
          />
        </div>
        
        <div className="right-panel">
          <OrderSummary 
            order={currentOrder}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;