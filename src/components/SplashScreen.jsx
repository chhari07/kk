/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds splash time

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-white to-yellow-50 text-center px-4 overflow-hidden">
      {/* Decorative Circle Background */}
      <motion.div
        className="absolute w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 top-10 left-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-30 bottom-10 right-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      />

      {/* Animated Kurti Logo (optional) */}
 

      {/* Brand Name */}
      <motion.h1
        className="text-5xl sm:text-6xl font-extrabold font-serif tracking-wide text-gray-800"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <span className="text-pink-600">Kurti</span>{" "}
        <span className="text-yellow-700">Kala</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-4 text-base sm:text-lg text-gray-600 italic font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        “Elegance Stitched in Every Thread”
      </motion.p>

     
    </div>
  );
};

export default SplashScreen;
