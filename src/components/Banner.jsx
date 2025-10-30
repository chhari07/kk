/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaHandHoldingHeart,
  FaLeaf,
  FaGift,
  FaUsers,
  FaTruck,
} from "react-icons/fa";

const slides = [
  {
    title: "Kurti Kala.",
    subtitle: "Where Tradition Meets Trend.",
    description:
      "Discover handcrafted kurtis and ethnic wear made by skilled artisans. Celebrate Indian elegance with every stitch and color.",
    buttons: [
      { label: "Shop Collection", to: "/products", style: "bg-[#8B5E3C] text-white" },
      { label: "Join as Artisan", to: "/signup", style: "border border-[#8B5E3C] text-[#8B5E3C]" },
    ],
    bgGradient: "from-[#FFF8F0] via-[#FBEDE1] to-[#F6F0E4]",
    features: [
      {
        icon: <FaHandHoldingHeart className="text-3xl text-[#C68B59]" />,
        title: "Handcrafted with Love",
        desc: "Each piece tells a story of craftsmanship and culture.",
      },
      {
        icon: <FaLeaf className="text-3xl text-[#9A6B3E]" />,
        title: "Sustainable Fabric",
        desc: "Made from eco-friendly materials and ethical processes.",
      },
      {
        icon: <FaUsers className="text-3xl text-[#B76E41]" />,
        title: "Empowering Artisans",
        desc: "Supporting local artisans and rural craftsmanship.",
      },
    ],
  },
  {
    title: "Festive Elegance.",
    subtitle: "Adorn Every Moment.",
    description:
      "From everyday grace to festive sparkle, Kurti Kala brings you designs that reflect timeless beauty and modern comfort.",
    buttons: [
      { label: "View New Arrivals", to: "/products", style: "bg-[#9A6B3E] text-white" },
      { label: "Customize Outfit", to: "/customize", style: "border border-[#9A6B3E] text-[#9A6B3E]" },
    ],
    bgGradient: "from-[#F9F3ED] via-[#FFF9F5] to-[#F1E4D1]",
    features: [
      {
        icon: <FaGift className="text-3xl text-[#C68B59]" />,
        title: "Festive Offers",
        desc: "Special handcrafted pieces for every celebration.",
      },
      {
        icon: <FaTruck className="text-3xl text-[#9A6B3E]" />,
        title: "Nationwide Delivery",
        desc: "From artisans’ hands to your wardrobe, safely delivered.",
      },
      {
        icon: <FaShoppingBag className="text-3xl text-[#B76E41]" />,
        title: "Elegant Collections",
        desc: "Modern silhouettes with traditional charm.",
      },
    ],
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full mt-12">
      <div
        className={`w-full bg-gradient-to-r ${slide.bgGradient} text-[#3A2A1B] py-16 px-6 md:px-20 rounded-3xl shadow-lg transition-all duration-700`}
      >
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left Section - Text */}
          <div className="z-10">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 leading-snug text-[#8B5E3C]">
              {slide.title}
            </h1>
            <h2 className="text-2xl md:text-3xl italic mb-4 text-[#B76E41]">
              {slide.subtitle}
            </h2>
            <p className="text-lg mb-6 opacity-80 font-light leading-relaxed">
              {slide.description}
            </p>

            <div className="flex gap-4 flex-wrap">
              {slide.buttons.map((btn, i) => (
                <Link
                  key={i}
                  to={btn.to}
                  className={`${btn.style} px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl hover:scale-105 transition`}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Features */}
          <div className="flex flex-col gap-5">
            {slide.features.map((feature, i) => (
              <div
                key={i}
                className="group flex items-center gap-5 bg-white/70 p-5 rounded-2xl border border-[#E6D9C5] hover:shadow-lg transition-all"
              >
                <div className="transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#8B5E3C]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#5A4632] opacity-80">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-6 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-[#8B5E3C] w-8" : "bg-[#C9B7A5]"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;
