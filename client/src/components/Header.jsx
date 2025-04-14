import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-md bg-white fixed top-0 w-full z-50 border-b-4 border-green-600">
      {/* Logo */}
      <Link to="/">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 cursor-pointer">
          WasteWise
        </div>
      </Link>

      {/* Navigation and Button Container */}
      <div className="flex items-center space-x-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link
            to="/about"
            className="relative group transition duration-300 hover:text-green-600"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/rewards"
            className="relative group transition duration-300 hover:text-green-600"
          >
            Rewards
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/reedeem"
            className="relative group transition duration-300 hover:text-green-600"
          >
            Reedeem
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="relative group transition duration-300 hover:text-green-600"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="relative group transition duration-300 hover:text-green-600"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {currentUser ? (
            <Link
              to={currentUser.userType=='user'? "/profile" : "/vendor/profile"}
              className="relative group transition duration-300 hover:text-green-600"
            >
              <img
                className="rounded-full h-8 w-8 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="relative group transition duration-300 hover:text-green-600"
              >
                Login
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/signup"
                className="relative group transition duration-300 hover:text-green-600"
              >
                Sign Up
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 flex flex-col space-y-4">
          <button
            onClick={toggleMenu}
            className="self-end text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Link
            to="/about"
            className="text-gray-700 hover:text-green-600 transition duration-300"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-green-600 transition duration-300"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          {currentUser ? (
            <Link
              to="/profile"
              className="text-gray-700 hover:text-green-600 transition duration-300"
              onClick={toggleMenu}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 transition duration-300"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-green-600 transition duration-300"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}