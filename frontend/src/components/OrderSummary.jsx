// components/OrderSummary.jsx - ENHANCED WITH BETTER ORDER DISPLAY
import React from 'react';

const OrderSummary = ({ order, sessionId }) => {
  const completeOrder = async () => {
    if (!sessionId) {
      alert('No active session found');
      return;
    }
    
    try {
      const response = await fetch('/api/order/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      if (response.ok) {
        const completedOrder = await response.json();
        alert(`Order confirmed! Order ID: ${completedOrder.order_id}\nTotal: $${completedOrder.total.toFixed(2)}`);
        // Optionally refresh the page or redirect
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Error completing order: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Error completing order. Please try again.');
    }
  };

  // Helper function to format toppings
  const formatToppings = (toppings) => {
    if (!toppings || toppings.length === 0) return 'None';
    return toppings.map(t => t.name || t).join(', ');
  };

  // Helper function to calculate item total
  const getItemTotal = (item) => {
    if (item.price) return item.price;
    
    // Fallback calculation
    let total = item.base_price || 0;
    
    // Apply size multiplier
    const sizeMultiplier = item.size === 'Small' ? 0.8 : item.size === 'Large' ? 1.3 : 1.0;
    total *= sizeMultiplier;
    
    // Add toppings
    if (item.toppings) {
      total += item.toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
    }
    
    return total;
  };

  console.log('OrderSummary received order:', order);

  return (
    <div className="order-summary">
      <h2>Your Order</h2>
      
      {!order || order.items.length === 0 ? (
        <div className="empty-order">
          <p>No items in your order yet.</p>
          <p>Start chatting with Tony to add pizzas!</p>
        </div>
      ) : (
        <div className="order-content">
          <div className="order-items">
            <h3>Items ({order.items.length})</h3>
            {order.items.map((item, index) => {
              const itemTotal = getItemTotal(item);
              return (
                <div key={index} className="order-item">
                  <div className="item-details">
                    <h4>{item.pizza}</h4>
                    <p><strong>Size:</strong> {item.size || 'Medium'}</p>
                    <p><strong>Toppings:</strong> {formatToppings(item.toppings)}</p>
                    {item.special_requests && (
                      <p className="special-requests">
                        <strong>Special:</strong> {item.special_requests}
                      </p>
                    )}
                    {/* Debug info - helpful for development */}
                    <div className="debug-info" style={{fontSize: '0.8em', color: '#666', marginTop: '0.5em'}}>
                      Base: ${item.base_price?.toFixed(2) || 'N/A'} | 
                      Calculated: ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="item-price">
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {order.customer && Object.keys(order.customer).length > 0 && (
            <div className="customer-info">
              <h3>Delivery Information</h3>
              {order.customer.address && (
                <p><strong>Address:</strong> {order.customer.address}</p>
              )}
              {order.customer.phone && (
                <p><strong>Phone:</strong> {order.customer.phone}</p>
              )}
              {order.customer.name && (
                <p><strong>Name:</strong> {order.customer.name}</p>
              )}
            </div>
          )}

          <div className="order-total">
            <h3>Total: ${order.total ? order.total.toFixed(2) : '0.00'}</h3>
            {order.total === 0 && order.items.length > 0 && (
              <p style={{fontSize: '0.9em', color: '#e74c3c'}}>
                Price calculation in progress...
              </p>
            )}
          </div>

          {order.status === 'building' && order.items.length > 0 && (
            <button 
              className="complete-order-btn"
              onClick={completeOrder}
              disabled={!order.customer || !order.customer.address}
            >
              {order.customer && order.customer.address ? 'Complete Order' : 'Address Required'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;