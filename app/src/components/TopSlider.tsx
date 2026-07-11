import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TopSlider: React.FC<{ messages: string[] }> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    // Removed automatic rotation so it stays until removed/changed manually
  }, [messages.length]);

  if (!messages || messages.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="bg-gradient-to-r from-[#1A120B] via-[#361904] to-[#1A120B] border-b border-[#c5a059]/30 text-white py-2 px-4 text-center overflow-hidden flex items-center justify-center relative select-none z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      {messages.length > 1 && (
        <button onClick={handlePrev} className="absolute left-2 sm:left-6 p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer text-[#c5a059] group-hover:opacity-100 opacity-70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      <div className="w-full max-w-4xl mx-12 overflow-hidden relative h-5 flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="absolute text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-[0.2em] w-full text-center text-[#EBEBEB]"
          >
            {messages[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {messages.length > 1 && (
        <button onClick={handleNext} className="absolute right-2 sm:right-6 p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer text-[#c5a059] group-hover:opacity-100 opacity-70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};
