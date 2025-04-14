import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from '../pages/Chatbot';
import { FiMessageSquare, FiX } from 'react-icons/fi';

const ChatbotContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl border border-green-100 mb-2 w-80 h-[420px] flex flex-col"
            style={{
              position: 'fixed',
              bottom: '70px',
              right: '20px',
            }}
          >
            {/* Chat Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold text-lg">Eco Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-green-100 transition-colors p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden border-t border-green-50">
              <Chatbot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
        style={{ width: '56px', height: '56px' }}
      >
        {isOpen ? (
          <FiX size={24} className="transform transition-transform" />
        ) : (
          <FiMessageSquare size={24} />
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotContainer;