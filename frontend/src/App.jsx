import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";

// 📄 Import new pages for footer links
import FAQ from "./pages/FAQ";
import Delivery from "./pages/Delivery";
import Privacy from "./pages/Privacy";

import Returns from "./pages/Delivery"; 
import SizeGuide from "./pages/Delivery";
import TrackOrder from "./pages/Delivery"; 
import Terms from "./pages/Privacy"; 
import Cookies from "./pages/Privacy"; 

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <ScrollToTop /> 
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />

        {/* 📄 NEW ROUTES FOR FOOTER LINKS */}
        {/* Company links */}
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Support links */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/track-order" element={<TrackOrder />} />
        
        {/* Bottom links */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;