import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import back1 from "../assets/back1.jpg";

const Login = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async (e) => {
  e.preventDefault();

  if (!name || !phone) {
    alert("Please enter your full name and phone number");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be 10 digits");
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("http://localhost:8000/api/send-otp-partner/", {
      phone_number: phone,
      name: name, // ✅ Send name along with phone
    });

    if (response.status === 200) {
      localStorage.setItem("userPhone", phone);
      localStorage.setItem("userName", name);
      navigate("/otp", { state: { phone } });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    if (error.response?.status === 404) {
      alert("User not found with this name and phone number. Please register.");
      navigate("/register");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${back1})` }}
    >
      <form
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-full max-w-md"
        onSubmit={handleNext}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-yellow-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-900 hover:bg-yellow-800 text-white py-2 rounded-lg transition"
        >
          {loading ? "Sending OTP..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/Register")}
            className="text-yellow-800 hover:underline"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
