import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const Login = () => {
  const [method, setMethod] = useState("email_password");
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (method === "email_password") {
        if (!form.email || !form.password)
          return alert("Email and password required.");
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) return alert(error.message);
        fetchUserRole();
      } else if (method === "email_otp") {
        if (!form.email) return alert("Email required.");
        const { error } = await supabase.auth.signInWithOtp({ email: form.email });
        if (error) return alert(error.message);
        alert("📩 Magic link sent to your email.");
      } else if (method === "phone_otp") {
        if (!form.phone.startsWith("+"))
          return alert("Include country code (e.g., +91...).");
        const { error } = await supabase.auth.signInWithOtp({ phone: form.phone });
        if (error) return alert(error.message);
        alert("📲 OTP sent to your phone.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    }
  };

  const verifyOtp = async () => {
    if (!form.otp || !form.phone)
      return alert("Both OTP and phone are required");
    const { error } = await supabase.auth.verifyOtp({
      phone: form.phone,
      token: form.otp,
      type: "sms",
    });
    if (error) return alert(error.message);
    fetchUserRole();
  };

  const fetchUserRole = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("User not found");
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (error) return alert("Could not fetch role");
    alert(`✨ Logged in as ${data.role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] to-[#f9e8da] flex items-center justify-center px-4 font-serif">
      <div className="w-full max-w-md bg-[#fff9f3] rounded-3xl shadow-xl border border-[#d8b99c]/50 overflow-hidden">
        {/* 🌸 Header */}
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-[#4b2e05] tracking-wide">
            Kurti<span className="text-[#b97a57]">Kala</span>
          </h1>
          <p className="mt-2 text-[#7c5b48] italic">
            Handcrafted Elegance Awaits You ✨
          </p>
        </div>

        {/* 🪔 Form */}
        <div className="px-8 pb-10">
          <form>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-[#4b2e05] mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#d8b99c] focus:ring-2 focus:ring-[#b97a57] outline-none bg-white/70"
              />
            </div>

            {/* Password */}
            {method === "email_password" && (
              <div className="mb-4">
                <label className="block text-sm text-[#4b2e05] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#d8b99c] focus:ring-2 focus:ring-[#b97a57] outline-none bg-white/70"
                />
              </div>
            )}

            {/* Login Method */}
            <div className="mb-4">
              <label className="block text-sm text-[#4b2e05] mb-1">
                Login Method
              </label>
              <select
                onChange={(e) => setMethod(e.target.value)}
                value={method}
                className="w-full px-3 py-2 rounded-xl border border-[#d8b99c] focus:ring-2 focus:ring-[#b97a57] outline-none bg-white/70"
              >
                <option value="email_password">Email + Password</option>
                <option value="email_otp">Magic Link (Email)</option>
                <option value="phone_otp">Phone OTP</option>
              </select>
            </div>

            {/* Phone + OTP */}
            {method === "phone_otp" && (
              <div className="mb-4">
                <label className="block text-sm text-[#4b2e05] mb-1">
                  Phone Number (+country code)
                </label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  placeholder="+91..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#d8b99c] focus:ring-2 focus:ring-[#b97a57] outline-none bg-white/70"
                />
                <label className="block mt-3 text-sm text-[#4b2e05] mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 rounded-xl border border-[#d8b99c] focus:ring-2 focus:ring-[#8b5e34] outline-none bg-white/70"
                />
              </div>
            )}

            {/* Buttons */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-2 mt-2 bg-gradient-to-r from-[#d8b99c] to-[#b97a57] text-white rounded-xl font-semibold hover:opacity-90 transition shadow-md"
            >
              {method === "email_password" ? "Login" : "Send"}
            </button>

            {method === "phone_otp" && (
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full py-2 mt-3 bg-gradient-to-r from-[#b97a57] to-[#8b5e34] text-white rounded-xl font-semibold hover:opacity-90 transition shadow-md"
              >
                Verify OTP
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
