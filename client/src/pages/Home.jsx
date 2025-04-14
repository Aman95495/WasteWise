import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Chatbot from "./Chatbot";
import { useState } from "react";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [showChatbot, setShowChatbot] = useState(false); // Add state for chatbot visibility


  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-10 px-2 bg-gradient-to-r from-green-50 to-blue-50">
        {currentUser ? (
          // Logged-in version
          <motion.div
            className="max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={containerVariants}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Text Content */}
              <motion.div
                className="flex-1 text-left gap-4"
                variants={itemVariants}
              >
                <motion.h1
                  className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
                  variants={textVariants}
                >
                  Make Smart Disposal Choices,
                  <br />
                  {currentUser.username}
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mb-8"
                  variants={textVariants}
                >
                  Classify waste instantly and get eco-friendly disposal
                  guidance
                </motion.p>
                <div className="flex gap-4">
                  <Link to="/upload">
                    <motion.button
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      variants={buttonVariants}
                    >
                      Upload Waste Photo
                    </motion.button>
                  </Link>

                  {currentUser.userType == "vendor" ? (
                    <Link to="/dashboard">
                      <motion.button
                        className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        variants={buttonVariants}
                      >
                        Go to Dashboard
                      </motion.button>
                    </Link>
                  ) : (
                    <Link to="/search-vendors">
                      <motion.button
                        className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        variants={buttonVariants}
                      >
                        Search Vendors
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Illustration */}
              <motion.div className="flex-1 mx-auto" variants={itemVariants}>
                <img
                  src="https://i.pinimg.com/736x/cf/e8/0a/cfe80a78ca36a7521b26caa2f2b69cf4.jpg"
                  alt="Waste segregation"
                  className="w-full max-w-md mx-auto border-2 border-green-200 rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Guest version
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Smart Waste Segregation Made Simple
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Upload a photo of any waste item and instantly learn how to
              dispose of it responsibly
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/signup"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors text-center"
              >
                How It Works
              </Link>
            </motion.div>
          </div>
        )}
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="text-green-600 text-4xl mb-4">♻️</div>
            <h3 className="text-2xl font-semibold mb-4">
              AI-Powered Classification
            </h3>
            <p className="text-gray-600">
              Instant waste categorization using advanced machine learning
              models
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="text-green-600 text-4xl mb-4">🌱</div>
            <h3 className="text-2xl font-semibold mb-4">
              Eco-Friendly Guidance
            </h3>
            <p className="text-gray-600">
              Get tailored disposal tips and sustainable alternatives
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="text-green-600 text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-semibold mb-4">Real-Time Analysis</h3>
            <p className="text-gray-600">
              Immediate results with detailed environmental impact data
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How WasteWise Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-green-600 text-5xl mb-4">1</div>
              <h3 className="text-2xl font-semibold mb-4">Upload Photo</h3>
              <p className="text-gray-600">
                Snap a picture of your waste item using your smartphone or
                camera
              </p>
            </motion.div>
            <motion.div
              className="text-center p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-green-600 text-5xl mb-4">2</div>
              <h3 className="text-2xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our machine learning model instantly categorizes the waste type
              </p>
            </motion.div>
            <motion.div
              className="text-center p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-green-600 text-5xl mb-4">3</div>
              <h3 className="text-2xl font-semibold mb-4">Get Guidance</h3>
              <p className="text-gray-600">
                Receive detailed disposal instructions and eco-friendly tips
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose WasteWise?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                🌍 Reduce Environmental Impact
              </h3>
              <p className="text-gray-600">
                Proper waste segregation helps reduce landfill waste and
                promotes recycling
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                🧠 Smart AI Technology
              </h3>
              <p className="text-gray-600">
                State-of-the-art machine learning models with 95%+ accuracy
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </motion.div>

      {/* Chatbot Container */}
      {showChatbot && (
        <motion.div
          className="fixed bottom-20 right-4 w-[350px] max-w-md h-[400px] bg-green-200 rounded-lg shadow-xl overflow-hidden border border-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Chatbot />
          <button
            onClick={() => setShowChatbot(false)}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
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
        </motion.div>
      )}
    </div>
  );
}
