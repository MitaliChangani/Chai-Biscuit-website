import React, { useState, useEffect } from 'react';
import axios from 'axios';
import back from '../assets/back1.jpg';
import './Verify.css';
import { useNavigate, useLocation } from 'react-router-dom';
const Verify = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
  const phoneFromState = location.state?.phone;
  const nameFromState = location.state?.name;

  if (phoneFromState && nameFromState) {
    setPhone(phoneFromState);
    setName(nameFromState);
    localStorage.setItem('userPhone', phoneFromState);
    localStorage.setItem('userName', nameFromState);
  } else {
    const phoneFromStorage = localStorage.getItem('userPhone');
    const nameFromStorage = localStorage.getItem('userName');
    if (phoneFromStorage && nameFromStorage) {
      setPhone(phoneFromStorage);
      setName(nameFromStorage);
    } else {
      alert('User info not found! Redirecting to login.');
      navigate('/');
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
      const res = await axios.post('http://localhost:8000/api/verify-otp/', {
        phone_number: phone,
        name: name,
        otp: otpCode,
      });
      if (res.data.message) {
        alert("OTP Verified!");
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('phone_number', res.data.phone_number);
        navigate('/home');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      alert('OTP verification failed');
    }
  };
  const handleResend = async () => {
    try {
      await axios.post('http://localhost:8000/api/send-otp/', {
        phone_number: phone,
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
    <div className="flex items-center justify-center image" style={{ backgroundImage: `url(${back})` }}>
      <div className="p-6 w-80 rounded-lg text-center relative">
        <p className="text-[#4b2e2e] font-medium mb-6">
          Enter the OTP sent via SMS to <br />
          <span className="font-semibold">+{phone}</span>
        </p>
        <div className="flex justify-center gap-4 mb-2">
          {otp.map((digit, index) => (
            <input key={index} id={`otp-${index}`} maxLength={1} className="w-10 h-10 text-center rounded bg-[#e5d5ca] text-lg font-bold" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} />
          ))}
        </div>
        <div className="text-[#4b2e2e] mb-4 text-sm font-semibold">
          {timer > 0 ? formatTime(timer) : 'You can resend OTP'}
        </div>
        <p className="text-sm text-[#4b2e2e] mb-6">
          Didn’t receive code?{" "}
          <button className={`underline font-medium ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleResend} disabled={resendDisabled}>Resend</button>
        </p>
        <button className="w-full py-3 bg-[#4b2e2e] text-white font-semibold rounded-full" onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};
export default Verify;