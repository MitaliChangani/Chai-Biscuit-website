import React, { useState, useEffect } from 'react';
import axios from 'axios';
import back from '../assets/back1.jpg';
import { useNavigate, useLocation } from 'react-router-dom';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(''); // ✅ Store the name here
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve phone & name from state or localStorage
    const phoneFromState = location.state?.phone;
    const nameFromState = location.state?.name;

    if (phoneFromState) {
      setPhone(phoneFromState);
      localStorage.setItem('userPhone', phoneFromState);
    } else {
      const phoneFromStorage = localStorage.getItem('userPhone');
      if (phoneFromStorage) {
        setPhone(phoneFromStorage);
      } else {
        alert('Phone number not found! Redirecting to login.');
        navigate('/');
      }
    }

    if (nameFromState) {
      setName(nameFromState);
      localStorage.setItem('userName', nameFromState);
    } else {
      const nameFromStorage = localStorage.getItem('userName');
      if (nameFromStorage) {
        setName(nameFromStorage);
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (/^\d$/.test(value) || value === '') {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    try {
      const otpCode = otp.join('');

      const res = await axios.post('http://localhost:8000/api/verify-otp-partner/', {
        phone_number: phone,
        name: name, // ✅ Now using state
        otp: otpCode,
      });

      if (res.data.message) {
        alert('OTP Verified!');
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('phone_number', res.data.phone_number);
        navigate('/dash');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      alert('OTP verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:8000/api/send-otp-partner/', {
        phone_number: phone,
        name: name, // ✅ Include name in resend if backend requires it
      });

      alert('OTP resent successfully');
      setOtp(['', '', '', '']);
      setTimer(30);
      setResendDisabled(true);
    } catch (err) {
      console.error('Error resending OTP:', err);
      alert('Failed to resend OTP');
    }
  };

  const formatTime = (t) => `00:${t.toString().padStart(2, '0')}`;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${back})` }}
    >
      <div className="bg-white/90 rounded-xl shadow-lg w-full max-w-md p-6 text-center">
        <p className="text-lg font-medium mb-2">
          Enter the OTP sent via SMS to
        </p>
        <p className="text-xl font-bold text-indigo-600 mb-6">
          +{phone}
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              className="w-14 h-14 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="mb-4 text-gray-600">
          {timer > 0 ? (
            <span>{formatTime(timer)}</span>
          ) : (
            <span className="text-green-600 font-medium">You can resend OTP</span>
          )}
        </div>

        <p className="mb-6">
          Didn’t receive code?{' '}
          <button
            className={`font-semibold ${resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:underline'}`}
            onClick={handleResend}
            disabled={resendDisabled}
          >
            Resend
          </button>
        </p>

        <button
          className="w-full bg-yellow-900 text-white py-3 rounded-lg font-semibold hover:bg-yellow-800 transition"
          onClick={handleVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Otp;
