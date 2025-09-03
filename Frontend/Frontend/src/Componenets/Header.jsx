import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logo from '../assets/logo.png';
import Notification from '../assets/N1.png';
import ProfilePlaceholder from '../assets/p1.png';
import Cart from '../assets/cart2.png';
import MenuIcon from '../assets/menu3.png';
import HomeIcon from '../assets/home2.png';

function Header() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    profileImage: ProfilePlaceholder,
  });

  const menu = () => navigate('/Menu');
  const home = () => navigate('/home');

  const handleClick = (label) => {
    const routes = {
      'My Addresses': '/address',
      'Track Order': '/track-order',
      'Order History': '/orderhistory',
      'Terms & Conditions': '/term-conditions',
      'Contact Us': '/contact-us',
    };

    if (routes[label]) {
      navigate(routes[label]);
    }
  };

  useEffect(() => {
    const phone = localStorage.getItem('phone_number');
    if (!phone) {
      console.warn('No phone number found in localStorage');
      return;
    }

    axios.get(`http://localhost:8000/api/get-user-profile/?phone=${phone}`, {
      withCredentials: true,
    })
      .then(res => {
        const { name, phone_number, profile_image } = res.data;
        setUserData({
          name: name || 'User',
          phone: phone_number || '',
          profileImage: profile_image
            ? (profile_image.startsWith('http') ? profile_image : `http://localhost:8000${profile_image}`)
            : ProfilePlaceholder,
        });
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
      });
  }, [showProfile]);

  return (
    <div className="sticky top-0 z-50 bg-[#b08968] h-20">
      <div className="flex items-center px-4 sm:px-6 py-3 h-20">
        <div className="flex items-center z-10">
          <img src={userData.profileImage} alt="profile" onClick={() => setShowProfile(true)} className="sm:w-9 md:w-10 lg:w-11 h-8 sm:h-9 md:h-10 lg:h-11 object-cover rounded-full cursor-pointer" />
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center sm:gap-3 z-0">
          <img src={HomeIcon} alt="home" onClick={home} className="w-6 sm:w-7 md:w-9 lg:w-10 h-10 object-cover rounded-full cursor-pointer" />
          <img src={MenuIcon} alt="menu" onClick={menu} className="w-6 sm:w-7 md:w-9 lg:w-10 h-10 object-cover rounded-full cursor-pointer" />
          <img src={Cart} alt="cart" onClick={() => navigate('/Cart')} className="w-5 sm:w-7 md:w-9 lg:w-10 h-auto object-cover rounded-full cursor-pointer" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 ml-auto z-10">
          <img src={Logo} alt="logo" onClick={() => navigate('/home')} className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto object-contain cursor-pointer" />
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-[#fceeea] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${showProfile ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#4b2c20]">My Profile</h2>
          <button
            className="text-2xl text-[#4b2c20]"
            onClick={() => setShowProfile(false)}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-4">
          <img
            src={userData.profileImage}
            alt="user"
            className="w-20 h-20 rounded-full border border-gray-300 mb-2 object-cover"
          />
          <h3 className="text-lg font-semibold text-[#4b2c20]">{userData.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{userData.phone}</p>

          <div className="w-full space-y-3">
            {[
              'My Addresses',
              'Track Order',
              'Order History',
              'Terms & Conditions',
              'Contact Us',
            ].map((label, i) => (
              <button
                onClick={() => handleClick(label)}
                key={i}
                className="w-full flex justify-between items-center px-4 py-2 rounded-full bg-[#f3e7e3] text-[#4b2c20] text-sm hover:bg-[#e9d6cf] transition"
              >
                {label}
                <span className="text-lg">&gt;</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
               localStorage.clear();
              setShowProfile(false);
              navigate('/');
            }}
            className="mt-6 w-full py-2 bg-[#4b2c20] text-white rounded-full hover:bg-[#3a241b] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;