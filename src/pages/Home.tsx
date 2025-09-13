import React from "react";
import { Link } from "react-router";

const Home: React.FC = () => {
  return (
    <div className="home bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            SeedX – Farmers ka Apna Bazaar
          </h1>
          <p className="text-xl text-gray-600">
            By Farmers, For Farmers | Smart India Hackathon 2025
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <section className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Problem</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                60% farmers face fake/low-quality seeds every year
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                ₹10,000 crore annual loss due to seed frauds
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Farmers dependent on govt/private middlemen
              </li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Solution – SeedX
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Direct farmer-to-buyer connect
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                AI-powered seed quality verification
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Multi-language voice assistant
              </li>
            </ul>
          </section>
        </div>

        <div className="text-center">
          <div className="space-x-4 mb-8">
            <Link
              to="/marketplace"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
            >
              Browse Seeds
            </Link>
          </div>
          <p className="text-gray-500">
            Join the revolution in seed trading. Secure, transparent, and
            farmer-centric.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
