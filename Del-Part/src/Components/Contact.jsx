import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center align-center bg-[#FCE9D8] px-4 py-12 mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Contact Us
          </h2>
          <form className="space-y-5">

            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default Contact;