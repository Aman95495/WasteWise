import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 text-2xl font-bold mb-4">
              WasteWise
            </h2>
            <p className="text-sm leading-relaxed">
              Empowering sustainable living through intelligent waste segregation and eco-friendly practices.
            </p>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-500 transition duration-300"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="hover:text-green-500 transition duration-300"
                >
                  Recycling Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/eco-tips"
                  className="hover:text-green-500 transition duration-300"
                >
                  Eco Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-500 transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-green-500 transition duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-green-500 transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Updated Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-md bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:border-green-500 transition duration-300"
            />
            <button className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left mb-4 md:mb-0">
            © 2024 WasteWise. Committed to a sustainable future.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-green-500 transition duration-300"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-500 transition duration-300"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-500 transition duration-300"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}