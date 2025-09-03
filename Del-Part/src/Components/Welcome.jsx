import React from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const next = () => {
    navigate("/Register");
  };

  const login = () => {
    navigate("/Login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 relative">

      <div className="absolute top-4 right-4">
        <button
          onClick={login}
          className="px-4 py-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition"
        >
          Login
        </button>
      </div>

      <div className="flex flex-col flex-grow items-center justify-center text-center px-4">
        <img
          src={Logo}
          alt="logo"
          className="w-32 sm:w-40 md:w-48 lg:w-56 mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Welcome to Chai-Biscuits!
        </h1>
        <p className="text-gray-600 max-w-md text-base sm:text-lg mb-8">
          Drive with purpose, earn with every delivery.
        </p>
        <button
          onClick={next}
          className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Welcome;