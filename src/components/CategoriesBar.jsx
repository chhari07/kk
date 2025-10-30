// src/components/CategoriesBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTshirt,
  FaFeatherAlt,
  FaGem,
  FaHandHoldingHeart,
  FaCrown,
  FaShoePrints,
} from "react-icons/fa";

const categories = [
  { name: "Kurtis", icon: <FaTshirt /> },
  { name: "Sarees", icon: <FaFeatherAlt /> },
  { name: "Dupattas", icon: <FaHandHoldingHeart /> },
  { name: "Jewelry", icon: <FaGem /> },
  { name: "Footwear", icon: <FaShoePrints /> },
  { name: "Designer Collection", icon: <FaCrown /> },
];

const CategoriesBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Desktop (Horizontal Categories) */}
      <div className="hidden md:flex gap-8 bg-gradient-to-r from-pink-900 via-rose-700 to-amber-600 p-4 rounded-2xl shadow-lg mb-6 justify-center">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={`/category/${cat.name.toLowerCase().replace(/ /g, "-")}`}
            className="flex items-center gap-2 text-white text-lg font-semibold hover:text-yellow-200 transition duration-200"
          >
            <span className="text-yellow-300 text-xl">{cat.icon}</span>
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Mobile Toggle Button */}
      <div className="flex md:hidden justify-between items-center bg-gradient-to-r from-pink-900 via-rose-700 to-amber-600 p-3 rounded-xl shadow mb-4">
        <h2 className="text-white font-bold text-lg tracking-wide">Categories</h2>
        <button onClick={() => setIsOpen(true)} className="text-white text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Side Drawer (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-rose-900 via-pink-800 to-amber-700 text-white p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 shadow-2xl rounded-r-2xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-yellow-300">Shop by Category</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl hover:text-yellow-400 transition"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/category/${cat.name.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-3 text-lg font-medium hover:text-yellow-200 transition duration-200"
              onClick={() => setIsOpen(false)} // close drawer when clicked
            >
              <span className="text-yellow-300 text-xl">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        ></div>
      )}
    </div>
  );
};

export default CategoriesBar;
