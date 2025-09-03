import React from 'react';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
function Welcome() {
  const navigate = useNavigate();
  const next = () => {
    navigate('/Register')
  }
  const login = () => {
    navigate('./login')
  }
  return (
    <div className="h-screen w-full bg-[#4B2E2B] text-white flex flex-col justify-between overflow-hidden relative ">
      <div className="w-full flex justify-end px-6 pt-4">
        <button className=" text-[#d4a373] px-4 py-2 rounded-lg font-medium" onClick={login}>Login</button>
      </div>

      <div className="text-center px-6 flex flex-col items-center mt-[-60px]">
        <img src={Logo} alt="logo" className="w-[450px] h-[350px] object-contain" />
        <h1 className="text-2xl font-bold ">Welcome to Chai-Biscuits!</h1>
        <p className="mt-2 text-base text-white/80 max-w-md">Discover your favorite coffee blends and more. Let’s get started on your</p>
      </div>
      <button className="bg-[#EADBC8] text-[#4B2E2B] px-6 py-3 mb-20 rounded-xl font-semibold block mx-auto" onClick={next}>Get Start</button>
    </div>
  );
}
export default Welcome;