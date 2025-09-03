import React from 'react';
import Header from './Header';
import Footer from './Footer'
const ContactUs = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fceeea] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#4b2c20] text-center">
            Contact Us
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4b2c20] mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f3c4b2]"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4b2c20] mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f3c4b2]"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4b2c20] mb-1">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#f3c4b2]"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#4b2c20] text-white rounded-full hover:bg-[#3a231a] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ContactUs;