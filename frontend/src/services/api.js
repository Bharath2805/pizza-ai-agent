const API_BASE_URL = '/api';

export const chatAPI = {
  sendMessage: async (message, sessionId) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  getMenu: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    
    return response.json();
  },

  completeOrder: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/order/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete order');
    }
    
    return response.json();
  },

  getOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/order/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }
    
    return response.json();
  }
};