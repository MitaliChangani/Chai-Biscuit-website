import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from "./CartContext";
import offer1 from "../assets/offer1.jpg";
import offer2 from "../assets/offer2.avif";
import offer3 from "../assets/offer3.jpg";
import offer4 from "../assets/offer4.jpg";
import offer5 from "../assets/offer5.jpg";
import offer6 from "../assets/offer6.jpg";
import offer7 from "../assets/offer7.jpg";
import offer8 from "../assets/offer8.jpg";
import offer9 from "../assets/offer9.jpg";
import offer10 from "../assets/offer10.jpg";
import offer11 from "../assets/offer11.jpg";
import offer12 from "../assets/offer12.jpg";
const offerImages = [
  { image: offer1, name: "50% Off Latte", price: 220 },
  { image: offer2, name: "Buy 1 Get 1 Free", price: 280 },
  { image: offer3, name: "Iced Coffee Combo", price: 250 },
  { image: offer4, name: "Summer Special", price: 240 },
  { image: offer5, name: "Espresso Deal", price: 200 },
  { image: offer6, name: "Choco Mocha Treat", price: 260 },
  { image: offer7, name: "Holiday Offer", price: 200 },
  { image: offer8, name: "Cold Brew Boost", price: 230 },
  { image: offer9, name: "Free Add-ons", price: 290 },
  { image: offer10, name: "Macchiato Magic", price: 270 },
  { image: offer11, name: "Daily Brew Discount", price: 210 },
  { image: offer12, name: "Weekend Only Offer", price: 250 },
];
const Offer = () => {
  const { cartItems, addToCart } = useCart();
  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`, {
      position: "top-right",
      autoClose: 2000,
      theme: "light",
    });
  };
  return (
    <>
      <Header />
      <div className="bg-[#fef5f1] min-h-screen py-10 px-4">
        <h2 className="text-3xl font-bold text-brown-800 mb-8 text-center">
          Special Offers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {offerImages.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white flex flex-col">
              <div className="w-full h-48 flex items-center justify-center bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <p className="text-center text-brown-800 font-semibold mb-2">
                  {item.name}
                </p>
                <p className="text-center text-gray-700 font-medium mb-4">
                  ₹{item.price}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-white border border-brown-800 text-black py-2 rounded-lg hover:bg-brown-100 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};
export default Offer;