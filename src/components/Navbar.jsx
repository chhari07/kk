/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaStore,
} from "react-icons/fa";
import { supabase } from "../supabase/supabaseClient";
import { useSearch } from "../Context/SearchContext";

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", authUser.id)
          .maybeSingle();

        setUser({
          ...authUser,
          role: profile?.role || null,
        });
      } else {
        setUser(null);
      }
    };

    fetchUserData();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user;
        if (authUser) {
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("id", authUser.id)
            .maybeSingle();

          setUser({
            ...authUser,
            role: data?.role || null,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-100 via-white to-yellow-50 shadow-md">
      <div className="px-5 py-3 max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          
          <h1 className="text-2xl font-extrabold font-serif text-gray-800 tracking-wide">
            <span className="text-pink-600">Kurti</span>{" "}
            <span className="text-yellow-700">Kala</span>
          </h1>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center relative w-[300px]">
          <FaSearch className="absolute left-3 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search kurtis, sarees, collections..."
            className="w-full py-2 pl-10 pr-3 border border-pink-300 rounded-full text-sm outline-none bg-white text-gray-700 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link
            to="/shop"
            className="hover:text-pink-600 flex items-center gap-1"
          >
            <FaStore /> <span>Shop</span>
          </Link>

          <Link
            to="/cart"
            className="hover:text-pink-600 flex items-center gap-1"
          >
            <FaShoppingCart /> <span>Cart</span>
          </Link>

          {user ? (
            <>
              <div className="flex flex-col text-right">
                <span className="text-pink-700 font-medium">
                  {user.email}
                </span>
                {user.role && (
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm hover:bg-pink-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-pink-500 text-pink-600 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-pink-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-pink-600 text-white font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-pink-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 bg-white p-5 text-gray-700 shadow-lg border-t border-pink-100">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search kurtis, sarees..."
              className="w-full py-2 pl-10 pr-3 border border-pink-300 rounded-full text-sm outline-none bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
          >
            <FaStore /> Shop
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
          >
            <FaShoppingCart /> Cart
          </Link>

          {user ? (
            <>
              <div className="text-sm text-pink-700">
                {user.email}
                {user.role && (
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="bg-pink-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-pink-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="border border-pink-500 text-pink-600 font-semibold px-4 py-1.5 rounded-full text-center text-sm hover:bg-pink-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-pink-600 text-white font-semibold px-4 py-1.5 rounded-full text-center text-sm hover:bg-pink-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
