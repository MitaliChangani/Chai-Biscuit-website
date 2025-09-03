import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const TermAndConditions = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
            Terms & Conditions
          </h1>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Welcome to our online coffee shop. By placing an order or browsing our
              website, you agree to be bound by these Terms and Conditions. Please
              read them carefully before using our services.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Use of Website
              </h2>
              <p>
                You agree to use our website for personal, non-commercial purposes
                only. Any misuse, unauthorized access, or resale of our products is
                strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Orders & Payments
              </h2>
              <p>
                Orders placed through our platform are subject to availability. We
                reserve the right to cancel or refuse any order at our discretion.
                All prices are listed in INR and are inclusive of applicable taxes.
                Secure payment options are provided at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Delivery
              </h2>
              <p>
                We offer doorstep delivery within serviceable areas. Delivery times
                may vary due to traffic, weather, or order volume. Any delays will be
                communicated promptly. Free delivery may be available on orders above
                a specified amount.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Returns & Refunds
              </h2>
              <p>
                Due to the perishable nature of coffee products, returns are
                generally not accepted. If your order arrives damaged or incorrect,
                please contact our support team within 24 hours for a resolution or
                replacement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                5. Loyalty Program
              </h2>
              <p>
                Registered users may participate in our loyalty rewards program.
                Points earned are non-transferable and expire after a certain period.
                Terms may change at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                6. Modifications to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms & Conditions at any time.
                Continued use of our services constitutes your acceptance of any
                changes.
              </p>
            </section>

            <p className="text-sm text-gray-500 italic">
              Last updated: July 31, 2025
            </p>
          </div>
        </div>
      </div>

    </>
  );
};

export default TermAndConditions;