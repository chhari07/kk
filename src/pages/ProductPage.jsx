import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner from "../components/Banner";
import ProductCard from "../components/Product_card";
import { supabase } from "../supabase/supabaseClient";
import { useSearch } from "../Context/SearchContext";
import CategoryBar from "../components/CategoriesBar";
import TabsSection from "../components/TabsSection";
import { ShoppingBag, Heart, Star, Sparkles, Gem } from "lucide-react";

const ProductPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All");

  // 🌸 KurtiKala categories
  const categories = [
    { label: "All", value: "All" },
    { label: "Kurtis", value: "Kurtis" },
    { label: "Sarees", value: "Sarees" },
    { label: "Dupattas", value: "Dupattas" },
    { label: "Jewelry", value: "Jewelry" },
    { label: "Footwear", value: "Footwear" },
    { label: "Designer Collection", value: "Designer Collection" },
  ];

  // 💫 Experience tabs
  const tabs = [
    {
      label: "All",
      description: "Explore all the latest collections",
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-rose-400 to-amber-400",
      img: "https://cdn-icons-png.flaticon.com/512/711/711284.png",
      tag: "All Styles",
    },
    {
      label: "New Arrivals",
      description: "Freshly launched ethnic wear",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
      img: "https://cdn-icons-png.flaticon.com/512/751/751463.png",
      tag: "New",
    },
    {
      label: "Best Sellers",
      description: "Most loved by our customers",
      icon: <Star className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-yellow-500 to-orange-400",
      img: "https://cdn-icons-png.flaticon.com/512/616/616655.png",
      tag: "Popular",
    },
    {
      label: "Festive Collection",
      description: "Perfect for celebrations & occasions",
      icon: <Gem className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-red-500 to-rose-600",
      img: "https://cdn-icons-png.flaticon.com/512/3082/3082031.png",
      tag: "Festive",
    },
    {
      label: "Wishlist",
      description: "Your saved favourites",
      icon: <Heart className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-indigo-600",
      img: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
      tag: "Wishlist",
    },
  ];

  // 🪔 Fetch products (marketplace + user uploads)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
     
          data: { user },
        } = await supabase.auth.getUser();

        const res = await axios.get(
          "https://chhari07.github.io/ladies_kurti_/ladies_kurti.json"
        );
        const fetchedData = Array.isArray(res.data) ? res.data : [];
        setProducts(fetchedData);

        if (user) {
          const localData = JSON.parse(localStorage.getItem(`products-${user.id}`)) || [];
          setUserProducts(Array.isArray(localData) ? localData : []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
        setProducts([]);
        setUserProducts([]);
      }
    };

    fetchData();
  }, []);

  // 💃 Filtering logic (safe & case-insensitive)
  const applyFilters = (arr) => {
    if (!Array.isArray(arr)) return [];

    return arr.filter((p) => {
      const category = categoryFilter?.toLowerCase() || "all";
      const matchesCategory =
        category === "all" || p.category?.toLowerCase() === category;
      const matchesSearch =
        !searchTerm ||
        p.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "All" || p.tabCategory === activeTab;

      return matchesCategory && matchesSearch && matchesTab;
    });
  };

  const filteredMarketplaceProducts = applyFilters(products);
  const filteredUserProducts = applyFilters(userProducts);

  return (
    <div className="flex flex-col mt-20 min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fde8e8] to-[#fff0e0] relative">
      {/* 🪔 Category Bar */}
      <CategoryBar
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 🌸 Tabs Section */}
      <TabsSection tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 💎 Main Content */}
      <div className="px-4 py-8">
        <Banner />

        {/* User Uploads */}
        {filteredUserProducts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-center text-[#a0522d]">
              Your Latest Creations ✨
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {filteredUserProducts.map((p, i) => (
                <ProductCard key={`user-${i}`} product={p} />
              ))}
            </div>
          </>
        )}

        {/* Marketplace Products */}
        {filteredMarketplaceProducts.length === 0 &&
        filteredUserProducts.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 text-lg italic">
            No products found matching your filters 🌺
          </p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center mt-10 text-[#8b4513]">
              Explore KurtiKala’s Signature Styles 💃
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {filteredMarketplaceProducts.map((p) => (
                <ProductCard key={p.id || p.title} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
