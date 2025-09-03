import React from "react";
import fbIcon from "../assets/fbIcon.png";
import instaIcon from "../assets/instaIcon.jpg";
import twitterIcon from "../assets/twitterIcon.png";
import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-[#fef5f1] text-black py-10 px-4 sm:px-6">
            <hr className="opacity-0.05" />
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 mt-5 gap-10 ">
                <div className="flex flex-col">
                    <img src={logo} alt="Chai-Biscuits Logo" className="w-24 h-auto mb-4" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Your one-stop shop for freshly brewed coffee, calming teas, and crunchy snacks. Sip & Snack with love!
                    </p>
                </div>
                <div className="flex direction-row gap-10">
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Coffee</a></li>
                            <li><a href="#" className="hover:underline">Tea</a></li>
                            <li><a href="#" className="hover:underline">Snacks</a></li>
                            <li><a href="#" className="hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">FAQs</a></li>
                            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex items-center space-x-4">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={fbIcon} alt="Facebook" className="w-6 h-6 hover:opacity-70" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={instaIcon} alt="Instagram" className="w-6 h-6 hover:opacity-70" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={twitterIcon} alt="Twitter" className="w-6 h-6 hover:opacity-70" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} Chai-Biscuits. All rights reserved.
            </div>
        </footer>
    );
};
export default Footer;