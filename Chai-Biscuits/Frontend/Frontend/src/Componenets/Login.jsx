import React, { useState } from 'react';
import back from '../assets/back1.jpg';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!name || !phone) {
      alert('Please enter your full name and phone number');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be 10 digits');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/send-otp/', {
        phone_number: phone,
        name: name, // ✅ now sending name too
      });

      if (response.status === 200) {
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', name);

        // Pass both phone and name to OTP page
        navigate('/Verify', { state: { phone, name } });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.error || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="align-center">
      <div className="image" style={{ backgroundImage: `url(${back})` }}>
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold mt-10 text-[#4b2e2e]">Welcome!</h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="p-6 rounded-lg text-center relative">
            <h2 className="text-xl font-semibold text-[#4b2e2e] mb-8 mt-20">
              What's Your Mobile Number?
            </h2>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-3 rounded-full bg-[#e5d5ca] text-[#4b2e2e] placeholder-[#4b2e2e] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone No."
              className="w-full mb-4 px-4 py-3 rounded-full bg-[#e5d5ca] text-[#4b2e2e] placeholder-[#4b2e2e] focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-sm text-[#4b2e2e] mb-6">
              By clicking next you will agree to our{' '}
              <Link to="/TermAndConditions" className="underline font-medium">
                Terms & Conditions
              </Link>
            </p>
            <button
              className="w-full py-3 bg-[#4b2e2e] text-white font-semibold rounded-full"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
