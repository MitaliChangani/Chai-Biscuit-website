import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Logo from "../assets/logo.png";
import ProfilePlaceholder from "../assets/p1.png";
import HomeIcon from "../assets/home2.png";

function Header() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    profileImage: ProfilePlaceholder,
  });

  const home = () => navigate("/Dash");

  const handleClick = (label) => {
    const routes = {
      "Assigned Deliveries" : "/AssignedDeliveries",
      "Order History": "/OrderHistory",
      "Terms & Conditions": "/TermAndConditions",
      "Contact Us": "/Contact",
    };
    if (routes[label]) {
      navigate(routes[label]);
      setShowProfile(false);
    }
  };

  useEffect(() => {
    const phone = localStorage.getItem("phone_number");
    if (!phone) return;

    axios
      .get(`http://localhost:8000/api/get-partner-profile/?phone=${phone}`, {
        withCredentials: true,
      })
      .then((res) => {
        const { name, phone_number, profile_image } = res.data;
        setUserData({
          name: name || "User",
          phone: phone_number || "",
          profileImage: profile_image
            ? profile_image.startsWith("http")
              ? profile_image
              : `http://localhost:8000${profile_image}`
            : ProfilePlaceholder,
        });
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [showProfile]);

  return (
    <header className="bg-[#a67b5b] fixed top-0 w-full z-50 shadow-md">

      <div className="flex items-center justify-between px-4 sm:px-6 py-1 max-w-screen-xl mx-auto">

        <img
          src={Logo}
          alt="logo"
          onClick={() => navigate("/Dash")}
          className="w-20 h-20 cursor-pointer hover:scale-105 transition-transform"
        />

        <div className="flex items-center gap-5 sm:gap-7">
          <img
            src={HomeIcon}
            alt="home"
            onClick={home}
            className="w-17 h-10 cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        <img
          src={userData.profileImage}
          alt="profile"
          onClick={() => setShowProfile(true)}
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full cursor-pointer border border-gray-300 object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showProfile ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <button
            onClick={() => setShowProfile(false)}
            className="text-2xl font-bold hover:text-red-500 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center p-4 gap-3">
          <img
            src={userData.profileImage}
            alt="user"
            className="w-20 h-20 rounded-full border border-gray-300 object-cover"
          />
          <h3 className="text-lg font-medium">{userData.name}</h3>
          <p className="text-gray-600">{userData.phone}</p>

          <div className="w-full flex flex-col gap-2 mt-4">
            {[
              "Order History",
              "Assigned Deliveries",
              "Terms & Conditions",
              "Contact Us",
            ].map((label, i) => (
              <button
                key={i}
                onClick={() => handleClick(label)}
                className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                {label} <span>&gt;</span>
              </button>
            ))}
          </div>

          <button
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
            onClick={() => {
              localStorage.clear();
              setShowProfile(false);
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;