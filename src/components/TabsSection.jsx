import React from "react";

const TabsSection = ({ tabs = [], activeTab, setActiveTab }) => {
  // If no tabs are available, show a fallback message
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tabs available.
      </div>
    );
  }

  return (
    <div className="lg:ml-60 flex overflow-x-auto gap-6 p-4 scrollbar-hide">
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => setActiveTab(tab.label)}
          className={`flex-shrink-0 cursor-pointer relative overflow-hidden ${tab.color} rounded-lg w-64 h-40 shadow-lg transform hover:scale-105 transition-all duration-300 ${
            activeTab === tab.label ? "ring-4 ring-white/50" : ""
          }`}
        >
          <div className="relative z-10 flex flex-col items-start justify-between h-full p-5 text-white">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                {tab.icon || "🧩"}
              </div>
              <span className="text-sm font-medium opacity-90">
                {tab.tag || "Untitled"}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-bold">
              {tab.label || "Unnamed Tab"}
            </h3>

            <p className="text-xs opacity-80 leading-snug">
              {tab.description || "No description available"}
            </p>
          </div>

          {tab.img && (
            <img
              className="absolute bottom-2 right-2 w-14 opacity-80"
              src={tab.img}
              alt={tab.label || "tab image"}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TabsSection;
