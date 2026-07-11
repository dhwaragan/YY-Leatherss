// In-memory database for orders
let orders = [];

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { user_id, items, total, address, customer_name, customer_email, razorpay_order_id, razorpay_payment_id } = body;
      
      const newOrder = {
        id: `YY-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        user_id,
        customer_name,
        customer_email,
        items,
        total,
        status: "Pending",
        address,
        razorpay_order_id: razorpay_order_id || `order_rp_${Date.now()}`,
        razorpay_payment_id: razorpay_payment_id || `pay_rp_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      orders.unshift(newOrder);
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, order: newOrder })
      };
    } catch (error) {
      console.error('Error saving order:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message || 'Failed to save order' })
      };
    }
  }
  
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders)
    };
  }
  
  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, error: 'Not found' })
  };
};