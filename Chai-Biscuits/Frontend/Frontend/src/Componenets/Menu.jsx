import React from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa6";
import Header from "./Header";
import Footer from './Footer'
import { useCart } from "./CartContext"; // Adjust the path if needed

// Hot coffee images
import Capuccino from "../assets/Capuccino.jpg";
import Americo from "../assets/Americo.jpg";
import Latte from "../assets/Latte.jpg";
import Mocha from "../assets/Mocha.jpg";
import Macchiato from "../assets/Macchiato.jpg";
import Irish from "../assets/Irish.jpg";
import Cortado from "../assets/Cortado.jpg";
import Ristretto from "../assets/Ristretto.jpg";
import Espresso from "../assets/Espresso.webp";
import ColdBrew from "../assets/Brew.jpg";
import IcedLatte from "../assets/IcedLatte.jpg";
import Frappe from "../assets/Frappe.jpg";
import ColdMocha from "../assets/ColdMocha.jpg";
import IcedAmericano from "../assets/IcedAmericano.jpg";
import Nitro from "../assets/Nitro.jpg";
import IcedMacchiato from "../assets/IcedMacchiato.jpg";
import IcedCappuccino from "../assets/IcedCappuccino.jpg";
import CoffeeMilkshake from "../assets/CoffeeMilkshake.jpg";
import Affogato from "../assets/Affogato.jpg";
import ChocoColdBrew from "../assets/ChocoColdBrew.jpg";
import Lemonade from "../assets/Lemonade.jpg";
import IcedTea from "../assets/IcedTea.jpg";
import Smoothie from "../assets/Smoothie.jpg";
import Mojito from "../assets/Mojito.jpg";
import Drink1 from "../assets/Drink1.jpg";
import Drink2 from "../assets/Drink2.jpg";
import Drink3 from "../assets/Drink3.jpg";
import Drink4 from "../assets/Drink4.jpg";
import Drink5 from "../assets/Drink5.jpg";
import Drink6 from "../assets/Drink6.jpg";
import Sandwich from "../assets/Sandwich.jpg";
import Croissant from "../assets/Croissant.jpg";
import Muffin from "../assets/Muffin.jpg";
import Donut from "../assets/Donut.jpg";
import Snack1 from "../assets/Snack1.jpg";
import Snack2 from "../assets/Snack2.jpg";
import Snack3 from "../assets/Snack3.jpg";
import Snack4 from "../assets/Snack4.jpg";
import Snack5 from "../assets/Snack5.jpg";
import Snack6 from "../assets/Snack6.jpg";
const hotCoffeeItems = [
  { name: "Cappuccino", description: "Espresso, steamed milk, milk foam", price: 300, image: Capuccino },
  { name: "Americano", description: "Espresso, hot water", price: 250, image: Americo },
  { name: "Latte", description: "Espresso, milk, foam art", price: 280, image: Latte },
  { name: "Mocha", description: "Espresso, chocolate, steamed milk", price: 320, image: Mocha },
  { name: "Macchiato", description: "Espresso, milk foam", price: 270, image: Macchiato },
  { name: "Irish Coffee", description: "Coffee with Irish whiskey", price: 360, image: Irish },
  { name: "Cortado", description: "Espresso with warm milk", price: 280, image: Cortado },
  { name: "Ristretto", description: "Short espresso shot", price: 230, image: Ristretto },
  { name: "Espresso Shot", description: "Strong and bold", price: 200, image: Espresso },
  { name: "Cold Brew", description: "Slow-brewed coffee", price: 310, image: ColdBrew },
];
const coldCoffeeItems = [
  { name: "Iced Latte", description: "Espresso, ice, milk", price: 290, image: IcedLatte },
  { name: "Frappe", description: "Blended coffee with cream", price: 330, image: Frappe },
  { name: "Cold Mocha", description: "Mocha served over ice", price: 310, image: ColdMocha },
  { name: "Iced Americano", description: "Espresso, cold water, ice", price: 270, image: IcedAmericano },
  { name: "Nitro Cold Brew", description: "Infused with nitrogen", price: 350, image: Nitro },
  { name: "Iced Macchiato", description: "Chilled macchiato", price: 300, image: IcedMacchiato },
  { name: "Iced Cappuccino", description: "Cappuccino over ice", price: 320, image: IcedCappuccino },
  { name: "Coffee Milkshake", description: "Blended coffee with ice cream", price: 340, image: CoffeeMilkshake },
  { name: "Affogato", description: "Espresso over ice cream", price: 350, image: Affogato },
  { name: "Choco Cold Brew", description: "Cold brew with chocolate", price: 360, image: ChocoColdBrew },
];
const drinkItems = [
  { name: "Lemonade", description: "Fresh lemon juice", price: 180, image: Lemonade },
  { name: "Iced Tea", description: "Chilled tea with lemon", price: 170, image: IcedTea },
  { name: "Mango Smoothie", description: "Blended mango with yogurt", price: 220, image: Smoothie },
  { name: "Mint Mojito", description: "Lime, mint and soda", price: 190, image: Mojito },
  { name: "Berry Blast", description: "Berry mix drink", price: 210, image: Drink1 },
  { name: "Peach Iced Tea", description: "Peach-flavored iced tea", price: 190, image: Drink2 },
  { name: "Orange Cooler", description: "Refreshing orange drink", price: 180, image: Drink3 },
  { name: "ThumbsUp", description: "Chilled watermelon drink", price: 175, image: Drink4 },
  { name: "Cocacola", description: "Natural hydrating drink", price: 160, image: Drink5 },
  { name: "Pepsi", description: "Pineapple soda fusion", price: 195, image: Drink6 },
];
const snackItems = [
  { name: "Grilled Sandwich", description: "Stuffed with veggies", price: 150, image: Sandwich },
  { name: "Butter Croissant", description: "Flaky & buttery", price: 180, image: Croissant },
  { name: "Chocolate Muffin", description: "Soft and fresh", price: 120, image: Muffin },
  { name: "Strawberry Donut", description: "With choco glaze", price: 130, image: Donut },
  { name: "Burger", description: "Crispy and cheesy", price: 170, image: Snack1 },
  { name: "Banana Weafers", description: "Golden and crisp", price: 150, image: Snack2 },
  { name: "French Fries", description: "Spicy veg-filled pastry", price: 190, image: Snack3 },
  { name: "Rumbles", description: "Crunchy and sweet", price: 50, image: Snack4 },
  { name: "Naachos", description: "Paneer and veggies", price: 40, image: Snack5 },
  { name: "Masala Weafer", description: "Toasted with herbs", price: 20, image: Snack6 },
];
const MenuSection = ({ title, items, addToCart }) => (
  <div className="mb-10">
    <h2 className="text-3xl font-bold mb-6 text-brown-800">{title}</h2>
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-brown-700">
      <div className="flex space-x-4 min-w-[1500px] sm:min-w-[1000px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[250px] flex-shrink-0 bg-[#fbe7dd] rounded-2xl p-3 shadow"
          >
            <img src={item.image} alt={item.name} className="rounded-xl w-full h-40 object-cover mb-2" />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold">₹{item.price}.00</span>
              <button onClick={() => addToCart(item)} className="bg-brown-800 text-black p-2 rounded-full hover:bg-brown-700">
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
const Menu = () => {
  const { cartItems, addToCart } = useCart();
  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };
  return (
    <>
      <Header />
      <div className="p-6 bg-[#fef5f1]">
        <div className="font-semibold mb-4 text-[#4b2c20]">
        </div>
        <MenuSection title="Hot Coffee" items={hotCoffeeItems} addToCart={handleAddToCart} />
        <MenuSection title="Cold Coffee" items={coldCoffeeItems} addToCart={handleAddToCart} />
        <MenuSection title="Drinks" items={drinkItems} addToCart={handleAddToCart} />
        <MenuSection title="Snacks" items={snackItems} addToCart={handleAddToCart} />
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};


export default Menu;
