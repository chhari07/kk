import React from "react";
import ProductPage from "../pages/ProductPage"; 
// import Banner from "../components/Banner";
import Recommandations from "../components/Recommandations";

const Home = () => {
  return (
    <div  className="  bg-gray-200   ">
      {/* <Banner/> */}
      <ProductPage />
      <Recommandations/>
    </div>
  );
};

export default Home;
