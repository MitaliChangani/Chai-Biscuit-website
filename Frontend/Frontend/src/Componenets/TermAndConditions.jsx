import React from 'react';
import Header from './Header';
import Footer from './Footer'
const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fceeea] px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4b2c20] text-center">
            Terms & Conditions
          </h1>
          <div className="space-y-4 text-[#4b2c20] text-sm sm:text-base">
            <p>
              Welcome to our online coffee shop. By placing an order or browsing our website, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </p>
            <h2 className="font-semibold text-lg">1. Use of Website</h2>
            <p>
              You agree to use our website for personal, non-commercial purposes only. Any misuse, unauthorized access, or resale of our products is strictly prohibited.
            </p>
            <h2 className="font-semibold text-lg">2. Orders & Payments</h2>
            <p>
              Orders placed through our platform are subject to availability. We reserve the right to cancel or refuse any order at our discretion. All prices are listed in INR and are inclusive of applicable taxes. Secure payment options are provided at checkout.
            </p>
            <h2 className="font-semibold text-lg">3. Delivery</h2>
            <p>
              We offer doorstep delivery within serviceable areas. Delivery times may vary due to traffic, weather, or order volume. Any delays will be communicated promptly. Free delivery may be available on orders above a specified amount.
            </p>
            <h2 className="font-semibold text-lg">4. Returns & Refunds</h2>
            <p>
              Due to the perishable nature of coffee products, returns are generally not accepted. If your order arrives damaged or incorrect, please contact our support team within 24 hours for a resolution or replacement.
            </p>
            <h2 className="font-semibold text-lg">5. Loyalty Program</h2>
            <p>
              Registered users may participate in our loyalty rewards program. Points earned are non-transferable and expire after a certain period. Terms may change at any time without prior notice.
            </p>
            <h2 className="font-semibold text-lg">6. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms & Conditions at any time. Continued use of our services constitutes your acceptance of any changes.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: July 31, 2025
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default TermsAndConditions;