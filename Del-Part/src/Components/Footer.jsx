import React from "react";
import fbIcon from "../assets/fbIcon.png";
import instaIcon from "../assets/instaIcon.jpg";
import twitterIcon from "../assets/twitterIcon.png";
import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-[#FCE9D8] text-gray-800 pt-10">

            <hr className="border-gray-400 mb-8" />

            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-10 items-center md:items-start text-center md:text-left">

                <div className="md:w-1/3">
                    <img src={logo} alt="Chai-Biscuits Logo" className="w-24 mb-4 mx-auto md:mx-0" />
                    <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                        Your one-stop shop for freshly brewed coffee, calming teas, and crunchy snacks.
                        Sip & Snack with love!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row md:w-2/3 gap-10 items-center md:items-start">

                    <div>
                        <h4 className="text-lg font-semibold text-black mb-3">Explore</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-brown-700 transition">Coffee</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Tea</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Snacks</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">About Us</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-black mb-3">Customer Service</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-brown-700 transition">FAQs</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brown-700 transition">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-black mb-3">Follow Us</h4>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={fbIcon} alt="Facebook" className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={instaIcon} alt="Instagram" className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={twitterIcon} alt="Twitter" className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-[#E5C4A1] text-center py-4 text-sm text-gray-700">
                © {new Date().getFullYear()} Chai-Biscuits. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;