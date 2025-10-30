import React from 'react';

const Recommandations = () => {
  return (
    <div className="w-full h-[450px] lg:h-[450px] bg-gradient-to-br from-[#fffaf0] to-[#fdebd0] py-20 lg:py-28 lg:px-24 md:px-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between">
        {/* Left Section */}
        <div className="max-w-xl">
          <span className="text-sm text-[#b66a00] font-semibold uppercase tracking-widest">
            Recommendations
          </span>
          <h2 className="text-[#4b2e05] font-extrabold mt-6 text-4xl lg:text-5xl tracking-tight leading-tight">
            Discover styles crafted
            <span className="block text-[#b66a00]">for your unique taste</span>
          </h2>
          <p className="mt-5 text-lg text-gray-700">
            Sign up to explore personalized Kurti Kala recommendations — from handwoven kurtis to elegant Indo-fusion wear. 
            Find collections that resonate with your style and celebrate Indian craftsmanship.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col lg:ml-auto mt-12 lg:mt-0">
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-4 text-white text-lg font-semibold rounded-xl bg-[#b66a00] hover:bg-[#4b2e05] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Join Kurti Kala &nbsp;
            <span className="font-bold text-2xl">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Recommandations;
