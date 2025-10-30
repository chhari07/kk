/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const userOrders = allOrders
        .filter((order) => order.userId === currentUser.id)
        .reverse();

      setOrders(userOrders);
    };

    fetchUserAndOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-12">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl overflow-hidden border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-100 px-6 py-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Placed on:
                      </span>{" "}
                      {order.date}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-gray-800">
                        Order ID:
                      </span>{" "}
                      #{orders.length - index}
                    </p>
                  </div>
                  <span
                    className={`mt-3 md:mt-0 px-4 py-1 text-sm font-semibold rounded-full 
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="md:col-span-2 space-y-6">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-5 items-center border border-gray-200 bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-28 h-28 object-contain border rounded-lg bg-white shadow-sm"
                        />
                        <div className="flex-1 text-left">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500">{item.type}</p>
                          <p className="text-green-600 font-bold text-md mt-1">
                            ₹{item.price}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <button
                              className="px-4 py-1 text-sm font-medium border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              View Item
                            </button>
                            <button
                              className="px-4 py-1 text-sm font-medium border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                              onClick={() => {
                                const cart =
                                  JSON.parse(localStorage.getItem("cart")) ||
                                  [];
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([...cart, item])
                                );
                                alert("Item added to cart again!");
                              }}
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.address.name} <br />
                        {order.address.street}, {order.address.city} <br />
                        PIN: {order.address.pincode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Payment</h4>
                      <p className="capitalize text-sm text-gray-600">
                        {order.payment}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Total</h4>
                      <p className="text-xl font-extrabold text-gray-900">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
