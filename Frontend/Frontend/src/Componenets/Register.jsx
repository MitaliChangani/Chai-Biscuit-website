import React, { useState } from "react";
import back from '../assets/back1.jpg';
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/register/", formData);
            alert("Registration successful!");
            navigate("/Login");
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#fef5f1] px-4 image"
            style={{ backgroundImage: `url(${back})` }}>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-md" >
                <h2 className="text-2xl font-bold mb-6 text-center text-brown-800">Register </h2>
                <div className="mb-4">
                    <label className="block mb-1 text-brown-700 font-medium">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brown-300" placeholder="Enter your name" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-brown-700 font-medium">Phone Number</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brown-300" placeholder="Enter your phone number" />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-brown-700 font-medium">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-brown-300" placeholder="Enter your address"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brown-800 text-black py-2 rounded-md hover:bg-brown-700 transition" >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};
export default Register;