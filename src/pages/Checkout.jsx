/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [locationFetched, setLocationFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndCart = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          navigate("/login");
          return;
        }

        setUser(data.user);

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (!storedCart.length) {
          navigate("/");
          return;
        }

        setCartItems(storedCart);
      } catch (err) {
        console.error("Checkout load error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndCart();
  }, [navigate]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const fetchGeolocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const { road, city, postcode } = data.address || {};
          setAddress((prev) => ({
            ...prev,
            street: road || "",
            city: city || "",
            pincode: postcode || "",
          }));
          setLocationFetched(true);
        } catch {
          alert("Failed to fetch address from location.");
        }
      },
      () => alert("Permission denied or error fetching location.")
    );
  };

  const isAddressValid =
    address.name && address.street && address.city && address.pincode;

  const handlePlaceOrder = () => {
    const order = {
      items: cartItems,
      address,
      total: totalPrice,
      payment: paymentMethod,
      status: paymentMethod === "cod" ? "Confirmed (COD)" : "Pending Payment",
      date: new Date().toLocaleString(),
      userId: user?.id,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.removeItem("cart");

    alert("🎉 Order placed successfully!");
    navigate("/orders");
  };

  const handleProceed = () => {
    if (!addressConfirmed) return;

    if (paymentMethod === "cod") {
      handlePlaceOrder();
    } else {
      navigate("/payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-gray-600">
        Checking login and cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>

        <div className="bg-white shadow rounded-xl p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
              {["name", "street", "city", "pincode"].map((field) => (
                <input
                  key={field}
                  name={field}
                  type="text"
                  placeholder={
                    field === "name"
                      ? "Full Name"
                      : field === "street"
                      ? "Street Address"
                      : field === "city"
                      ? "City"
                      : "PIN Code"
                  }
                  value={address[field]}
                  onChange={handleInputChange}
                  disabled={addressConfirmed}
                  className="w-full border border-gray-300 rounded-md p-2 mb-3"
                />
              ))}
              {!addressConfirmed && (
                <button
                  type="button"
                  onClick={fetchGeolocation}
                  className="text-blue-600 underline text-sm"
                >
                  📍 Use Current Location
                </button>
              )}
              {!addressConfirmed ? (
                <button
                  onClick={() => setAddressConfirmed(true)}
                  disabled={!isAddressValid}
                  className={`w-full py-2 mt-4 rounded text-white font-semibold ${
                    isAddressValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirm Address
                </button>
              ) : (
                <button
                  onClick={() => setAddressConfirmed(false)}
                  className="w-full py-2 mt-4 rounded text-blue-600 font-semibold border border-blue-600"
                >
                  ✏️ Edit Address
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <ul className="divide-y">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>

              {addressConfirmed && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>

                  <button
                    onClick={handleProceed}
                    className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                  >
                    {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
