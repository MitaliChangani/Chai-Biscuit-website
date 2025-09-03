import React, { useEffect } from 'react';
import { useCart } from './CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import hotco from '../assets/hot.png';
import coldco from '../assets/cold.png';
import coldd from '../assets/colddrink.png';
import food from '../assets/food3.png';

import Capuccino from '../assets/Capuccino.jpg';
import Americo from '../assets/Americo.jpg';
import ColdMocha from "../assets/ColdMocha.jpg";
import IcedAmericano from "../assets/IcedAmericano.jpg";
import Smoothie from "../assets/Smoothie.jpg";
import Mojito from "../assets/Mojito.jpg";
import Muffin from "../assets/Muffin.jpg";
import Donut from "../assets/Donut.jpg";
import Espresso from '../assets/Espresso.webp';
import Brew from '../assets/Brew.jpg';

import Header from './Header';
import Footer from './Footer';
import { FaPlus } from "react-icons/fa6";
import backg1 from '../assets/backg1.png';
import backg2 from '../assets/backg2.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Show cancellation notification if order is cancelled by delivery partner
  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) return;
    const ws = new WebSocket(`ws://localhost:8001/ws/orders/user_${userPhone}/`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.order && data.order.delivery_status === 'cancelled') {
          toast.error('Your order has been cancelled by the delivery partner.', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, []);

  const notify = (name) => toast.success(`${name} added to cart`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "light",
  });

  const menu = () => navigate("/menu");
  const offer = () => navigate("/offer");
  const offer2 = () => navigate("/offer2");

  const coffeeItems = [
    { name: "Cappuccino", description: "Espresso, steamed milk, milk foam", price: 300, image: Capuccino },
    { name: "Americano", description: "Espresso, hot water", price: 250, image: Americo },
    { name: "Cold Mocha", description: "Espresso, milk, foam art", price: 280, image: ColdMocha },
    { name: "Iced Americano", description: "Espresso, chocolate, steamed milk", price: 320, image: IcedAmericano },
    { name: "Smoothie", description: "Fruit smoothie delight", price: 270, image: Smoothie },
    { name: "Mojito", description: "Minty mojito cooler", price: 260, image: Mojito },
    { name: "Muffin", description: "Blueberry muffin", price: 120, image: Muffin },
    { name: "Donut", description: "Chocolate glazed donut", price: 130, image: Donut },
    { name: "Espresso Shot", description: "Strong and bold", price: 200, image: Espresso },
    { name: "Cold Brew", description: "Slow-brewed coffee", price: 310, image: Brew },
  ];

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="min-h-screen bg-[#fdf3ef] p-4">
      

        <h2 className="flex justify-center text-3xl font-semibold text-[#4b2e2e] mb-4">Our Menu</h2>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
          {[{ icon: hotco, label: "Hot Coffee", action: menu },
          { icon: coldco, label: "Cold Coffee", action: menu },
          { icon: coldd, label: "Drinks", action: menu },
          { icon: food, label: "Snacks", action: menu },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-[#4b2e2e]">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e5d5ca] rounded-full flex items-center justify-center mb-2 cursor-pointer"
                onClick={item.action}
              >
                <img src={item.icon} alt={item.label} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <span className="text-sm text-center">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="w-full mt-10 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:justify-center sm:overflow-visible scrollbar-hide">
            {[{
              bg: backg1,
              title: "Today's",
              subtitle: "Special Offer",
              button: "Buy Now →",
              action: offer,
            },
            {
              bg: backg2,
              title: "Flat 30% Off",
              button: "Buy Now →",
              action: offer2,
            }].map((item, i) => (
              <div key={i}
                className="snap-start shrink-0 w-[280px] sm:w-[360px] h-48 bg-cover bg-center rounded-2xl overflow-hidden relative"
                style={{ backgroundImage: `url(${item.bg})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-5 text-white">
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  {item.subtitle && <h2 className="text-2xl font-bold">{item.subtitle}</h2>}
                  <button
                    onClick={item.action}
                    className="mt-2 font-medium underline underline-offset-4 text-left cursor-pointer"
                  >
                    {item.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 px-4">
          <h2 className="text-2xl font-semibold text-[#4b2e2e] mb-6">Best Items</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {coffeeItems.map((item, i) => (
              <div key={i} className="bg-[#f9eae2] rounded-xl shadow p-3 flex flex-col items-center text-[#4b2e2e]">
                <div className="w-full h-36 sm:h-40 bg-[#d9c2b4] rounded-t-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="mt-2 w-full">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>

                <div className="mt-2 flex justify-between items-center w-full">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <button
                    onClick={() => {
                      addToCart(item);
                      notify(item.name);
                    }}
                    className="bg-[#4b2e2e] text-white p-2 rounded-full hover:bg-[#3a221c] transition"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;