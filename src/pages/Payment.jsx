import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const handleFakePayment = () => {
    const order = {
      items: orderData.cartItems,
      address: orderData.address,
      total: orderData.total,
      payment: "Online Payment",
      status: "Paid",
      date: new Date().toLocaleString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.removeItem("cart");

    alert("Payment successful! 🎉 Order Placed.");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🧾 Payment Page</h2>

      <p className="text-lg mb-4 text-gray-600">
        Order Total: <span className="font-bold text-black">₹{orderData?.total}</span>
      </p>

      <p className="text-sm text-gray-500 mb-6">
        (This is a mock payment. Integrate Razorpay/Stripe here.)
      </p>

      <button
        onClick={handleFakePayment}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition"
      >
        ✅ Simulate Payment Success
      </button>
    </div>
  );
};

export default Payment;
