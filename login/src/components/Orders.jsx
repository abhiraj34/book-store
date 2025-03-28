import React, { useEffect, useState } from "react";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from localStorage when component mounts
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  useEffect(() => {
    // Function to clear orders on login
    const handleLogin = () => {
      console.log("Clearing orders after login...");
      localStorage.removeItem("orders");
      setOrders([]); // Clear the orders state
    };

    // Listen for the new login event
    window.addEventListener("newLogin", handleLogin);

    return () => {
      window.removeEventListener("newLogin", handleLogin);
    };
  }, []);

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date().toLocaleDateString()}</td>
                  <td>{order.title}</td>
                  <td>₹{order.price}</td>
                  <td>{order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
