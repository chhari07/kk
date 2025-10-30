import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    email: '',
    password: '',
    phone: '',
    role: 'normal',
    shop_name: '',
    shop_address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) return alert(signUpError.message);

    const user = authData?.user;
    if (!user) return alert('Check your email to confirm the sign-up.');

    const { error: userInsertError } = await supabase.from('users').insert({
      id: user.id,
      first_name: formData.first_name,
      middle_name: formData.middle_name || null,
      last_name: formData.last_name,
      dob: formData.dob,
      email: formData.email,
      phone: formData.phone || null,
      role: formData.role,
    });

    if (userInsertError) {
      console.error('User insert error:', userInsertError);
      return alert('Error inserting user data.');
    }

    if (formData.role === 'shop_owner' || formData.role === 'both') {
      const { error: shopInsertError } = await supabase.from('shops').insert({
        owner_id: user.id,
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      if (shopInsertError) {
        console.error('Shop insert error:', shopInsertError);
        return alert('Error inserting shop data.');
      }
    }

    alert('Signup successful! Check your email to confirm.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fef9f5] to-[#f9efe7] px-4 py-10">
      <div className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-[#e3d5ca]">
        {/* Kurtikala Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif font-extrabold text-[#6a4c3b] tracking-wide">
            Kurtikala
          </h1>
          <p className="text-[#9c7e68] italic mt-2">
            Embrace the beauty of Indian craftsmanship ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              onChange={handleChange}
              className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
            />
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
            />
          </div>

          {/* Contact Info */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
          />

          {/* Role Selector */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg bg-[#fdf9f6] focus:ring-2 focus:ring-[#c79a63] focus:outline-none"
          >
            <option value="normal">Normal User</option>
            <option value="shop_owner">Shop Owner</option>
            <option value="both">Both</option>
          </select>

          {/* Shop Info */}
          {(formData.role === 'shop_owner' || formData.role === 'both') && (
            <div className="bg-[#fdf5ef] border border-[#e3d5ca] rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-[#6a4c3b]">Shop Details</h3>
              <input
                type="text"
                name="shop_name"
                placeholder="Shop Name"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63]"
              />
              <input
                type="text"
                name="shop_address"
                placeholder="Shop Address"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63]"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  onChange={handleChange}
                  className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63]"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  onChange={handleChange}
                  className="px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63]"
                />
              </div>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#e3d5ca] rounded-lg focus:ring-2 focus:ring-[#c79a63]"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-3 bg-[#c79a63] hover:bg-[#b78b58] text-white py-2 rounded-xl font-semibold text-lg tracking-wide shadow-md transition-all"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
