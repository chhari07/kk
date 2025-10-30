/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndLoadCart = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) return navigate("/login");
        setUser(data.user);
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkUserAndLoadCart();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const saveForLater = (id) => {
    const item = cartItems.find((item) => item.id === id);
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
    localStorage.setItem("savedItems", JSON.stringify([...saved, item]));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    if (!user) return navigate("/login");
    navigate("/checkout", { state: { cartItems, totalPrice } });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-gray-700">
        Checking login status...
      </div>
    );

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md border">
              <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition flex flex-col sm:flex-row gap-5 p-5"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-32 h-32 object-contain rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.type}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <p className="text-black font-bold mt-2">₹{item.price}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="px-3 font-medium">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => saveForLater(item.id)}
                        className="text-sm text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
                      >
                        Save for later
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className="text-sm text-gray-600 border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100"
                        >
                          Share
                        </button>
                        {openDropdownId === item.id && (
                          <div className="absolute mt-2 w-44 bg-white rounded-lg shadow-lg border p-2">
                            <a
                              href={`https://wa.me/?text=Check%20this%20out:%20${encodeURIComponent(window.location.href)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                            >
                              Facebook
                            </a>
                            <a
                              href="https://www.instagram.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded"
                            >
                              Instagram
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit sticky top-28 border">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Order Summary</h3>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4 border-t pt-4 font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
