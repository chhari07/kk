import React from "react";
import { useNavigate } from "react-router-dom";

const Product_card = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="cursor-pointer bg-[#fff9f4] text-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 flex flex-col border border-[#f3e0c8]"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.cardTitle}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-[#e0c097]/80 backdrop-blur-sm text-white rounded-full shadow-sm">
          {product.cardStatus || "New Arrival"}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow p-5 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold tracking-wide text-[#4a3c2a]">
          {product.cardTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {product.description ||
            "Experience handcrafted elegance and timeless beauty with our premium Kurtikala collection."}
        </p>

        {/* Tags */}
        {product.cardStatusTag && (
          <div className="flex flex-wrap gap-2">
            {product.cardStatusTag.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-[#fff1e1] text-[#a66a2c] px-2 py-0.5 rounded-full font-medium border border-[#e0b27a]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f3e0c8]">
          <div className="flex flex-col">
            <time
              dateTime={product.dateTime || "2025-02-17T19:10:07.818Z"}
              className="text-xs text-gray-500"
            >
              {product.date || "17 Feb 2025"} • {product.readTime || "4"} min read
            </time>
            {product.price ? (
              <span className="text-base font-bold text-[#a66a2c] mt-1">
                ₹{product.price}
              </span>
            ) : (
              <span className="text-xs bg-[#e6c49f] text-white px-3 py-1 rounded-full w-fit">
                Free / Donate
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="text-xs font-medium bg-gradient-to-r from-[#d5a86e] to-[#b98b59] text-white px-5 py-2 rounded-full hover:from-[#c6985e] hover:to-[#a97d4b] shadow-md transition"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product_card;
