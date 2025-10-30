import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 xl:mt-32 mx-auto w-full relative text-center bg-[#2e1a0f] text-[#fdf6ef]">
      <div className="px-6 py-10 md:py-16 xl:pt-20 xl:pb-14">
        <h2 className="font-bold text-3xl xl:text-4xl leading-snug">
          Embrace timeless elegance with <br />
          <span className="text-[#e3a857]">Kurti Kala</span>
        </h2>

        <Link
          to="/signup"
          className="mt-8 xl:mt-12 px-12 py-5 text-lg font-medium leading-tight inline-block bg-[#e3a857] text-[#2e1a0f] rounded-full shadow-xl border border-transparent hover:bg-[#c98a38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2e1a0f] focus:ring-[#e3a857] transition"
        >
          Join Kurti Kala
        </Link>

        <div className="mt-14 xl:mt-20">
          <nav className="flex flex-wrap justify-center text-lg font-medium">
            <div className="px-5 py-2">
              <Link to="/about">About Us</Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/collections">Collections</Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact">Contact</Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy">Privacy Policy</Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms">Terms & Conditions</Link>
            </div>
            <div className="px-5 py-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-sm text-[#d3c2ae]">
          &copy; {new Date().getFullYear()} <span className="text-[#e3a857] font-semibold">Kurti Kala</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
