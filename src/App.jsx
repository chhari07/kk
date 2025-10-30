import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import SplashScreen from '../src/components/SplashScreen';
import Home from '../src/pages/Home';
import ProductDetails from '../src/pages/Product_details'; 
import Login from '../src/pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders  from './pages/Orders';
import Payment from './pages/Payment';
import ShopDashboard from './pages/ShopDashboard';


const App = () => {
  const [loading, setLoading] = useState(true);

  const handleSplashFinish = () => {
    setLoading(false);
  };

  if (loading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className="flex flex-col min-h-screen    bg-gray-200   ">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} /> 
          <Route path="/login" element={<Login/>} />
          <Route path="/signup"  element={<Signup/>}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/shop" element={<ShopDashboard/>}/>
    



        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
