import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../supabase/supabaseClient";
import ProductCard from "../components/Product_card";
import {
  ShoppingCart,
  MessageCircle,
  Tag,
  Star,
  CheckCircle,
  XCircle,
  IndianRupee,
  Gift,
} from "lucide-react";

const Product_details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ✅ Safe Supabase session & user fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // first check session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("⚠️ Supabase user fetch warning:", err.message);
        setUser(null);
      }
    };

    fetchUser();

    // ✅ listen for login/logout updates
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Fetch products & find selected one
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://chhari07.github.io/ladies_kurti_/ladies_kurti.json");
        const products = Array.isArray(response.data) ? response.data : [];

        if (isMounted) {
          setAllProducts(products);
          const found = products.find((p) => String(p.id) === String(id));
          setProduct(found || null);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        if (isMounted) setProduct(null);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!user) return navigate("/login");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.some((item) => item.id === product.id);

    if (!exists) {
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { ...product, quantity: 1 }])
      );
      alert("🛍️ Added to your bag!");
    } else {
      alert("🧺 Item already in your bag.");
    }
  };

  // ✅ Chat with Artisan (Placeholder)
  const handleChat = () => {
    if (!user) return navigate("/login");
    alert("💬 Chat with Artisan feature coming soon!");
  };

  // ✅ Handle Rating
  const handleRating = (rating) => {
    if (!user) return alert("Login to rate this product.");
    setUserRating(rating);

    const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
    ratings[`${user.id}_${product.id}`] = rating;
    localStorage.setItem("ratings", JSON.stringify(ratings));
  };

  // ⏳ Loading
  if (!product) {
    return (
      <p className="p-10 text-center text-lg text-[#8b5e34] font-medium animate-pulse">
        Loading KurtiKala magic...
      </p>
    );
  }

  // ✅ Related products
  const relatedProducts = allProducts.filter(
    (p) => p.type === product.type && p.id !== product.id
  );

  return (
    <div className="mt-32 px-4 max-w-7xl mx-auto font-serif text-[#3c2a21]">
      <Link
        to="/"
        className="text-sm text-[#7c5b48] hover:text-[#b97a57] mb-6 inline-flex items-center transition"
      >
        ← Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#fffaf5]/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-[#d8b99c]">
        <div className="flex justify-center items-center">
          <div className="border-4 border-[#d8b99c] rounded-3xl p-4 bg-gradient-to-br from-[#fff9f3] to-[#f9e8da] shadow-lg hover:shadow-amber-300 transition-all">
            <img
              src={product.image || "/fallback.jpg"}
              alt={product.title || "KurtiKala Product"}
              className="object-contain h-[450px] w-full rounded-2xl hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.src = "/fallback.jpg")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold text-[#4b2e05] leading-snug">
            {product.title || "Beautiful Handcrafted Kurti"}
          </h1>

          <p className="text-sm text-[#7b5b3e] flex items-center gap-2 italic">
            <Tag size={16} className="text-[#b97a57]" />
            {product.type || "Traditional Wear"}
          </p>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  onClick={() => handleRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`w-7 h-7 cursor-pointer transition-transform hover:scale-125 ${
                    i <= (hoverRating || userRating)
                      ? "fill-yellow-500"
                      : "fill-none stroke-yellow-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#7b5b3e]">({userRating}/5)</span>
          </div>

          {Array.isArray(product.cardStatusTag) &&
            product.cardStatusTag.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.cardStatusTag.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#f9e8da] text-[#4b2e05] px-3 py-1 rounded-full flex items-center gap-1 border border-[#d8b99c]"
                  >
                    <CheckCircle size={14} /> {tag}
                  </span>
                ))}
              </div>
            )}

          <p className="text-md text-[#4b2e05] leading-relaxed">
            {product.description ||
              "Experience handcrafted elegance and timeless Indian artistry with this beautiful piece from KurtiKala."}
          </p>

          <span
            className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full w-max ${
              product.cardStatus === "Available"
                ? "bg-[#e9f5e6] text-[#2e6b3f]"
                : "bg-[#fceaea] text-[#b93d3d]"
            }`}
          >
            {product.cardStatus === "Available" ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            {product.cardStatus || "Status Unknown"}
          </span>

          {product.price ? (
            <p className="text-3xl font-bold text-[#b97a57] mt-2 flex items-center gap-2">
              <IndianRupee size={28} /> {product.price}
            </p>
          ) : (
            <p className="text-lg text-[#b97a57] font-semibold mt-2 flex items-center gap-2">
              <Gift size={22} /> Free / Donate
            </p>
          )}

          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-[#d8b99c] to-[#b97a57] hover:opacity-90 text-white font-semibold px-6 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <ShoppingCart size={18} /> Add to Bag
            </button>

            <button
              onClick={handleChat}
              className="bg-gradient-to-r from-[#b97a57] to-[#8b5e34] hover:opacity-90 text-white font-semibold px-6 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <MessageCircle size={18} /> Chat with Artisan
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-[#4b2e05]">
            Explore More from KurtiKala
          </h2>
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto sm:overflow-visible snap-x snap-mandatory">
            {relatedProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-72 sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-2xl snap-start"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product_details;
