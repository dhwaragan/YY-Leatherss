import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Offer } from '../types';

interface PromoSliderProps {
  offers: Offer[];
  navigateTo: (page: string) => void;
}

export const PromoSlider: React.FC<PromoSliderProps> = ({ offers, navigateTo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (offers.length <= 1) return;
    // Removed automatic rotation so it stays until removed/changed manually
  }, [offers.length]);

  if (offers.length === 0) {
    return (
      <section id="discount-hero-section" className="w-full px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative bg-gradient-to-br from-[#FAF6F0] to-[#F1E4D3] border border-[#E5CD82]/30 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between shadow-xs group gap-8">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#E5CD82]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#5C3317]/5 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4 text-center lg:text-left select-none">
            <span className="inline-block bg-leather text-white font-sans text-[10px] font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full shadow-xs">
              LIMITED SEASON CELEBRATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#361904] leading-tight">
              Best Sale Discount <br/>
              <span className="italic text-leather font-serif font-normal">Up to 60% Off</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Experience luxury without compromise. Secure Chennai's peak bespoke leather footwear, hand-constructed using our heritage 150-step double-welted craftsmanship.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigateTo('shop')}
                className="bg-leather hover:bg-[#FAF6F0] hover:text-[#5C3317] border border-leather text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded shadow-md transition-all duration-300"
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white group/banner bg-neutral-150">
            <img
              src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop"
              alt="Sovereign Handcrafted Chelsea Boot"
              className="w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-[1200ms] ease-out filter brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
              <span className="text-white font-sans text-[11px] font-bold uppercase tracking-widest bg-[#c5a059]/90 px-3 py-1 rounded backdrop-blur-xs">
                Sovereign Masterpiece
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const offer = offers[currentIndex];

  return (
    <section id="discount-hero-section" className="w-full px-4 sm:px-6 lg:px-8 pt-10 overflow-hidden relative">
      <div className="relative min-h-[400px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="w-full relative bg-gradient-to-br from-[#FAF6F0] to-[#F1E4D3] border border-[#E5CD82]/30 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between shadow-xs group gap-8"
          >
            {/* Decorative circle highlights */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#E5CD82]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#5C3317]/5 rounded-full blur-xl pointer-events-none" />

            {/* Outer Left content block: promo detail */}
            <div className="relative z-10 max-w-xl space-y-4 text-center lg:text-left select-none w-full lg:w-1/2">
              <span className="inline-block bg-leather text-white font-sans text-[10px] font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full shadow-xs">
                {offer.discount_percent > 0 ? `LIMITED OFFER - ${offer.discount_percent}% OFF` : 'LIMITED SEASON CELEBRATION'}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#361904] leading-tight">
                {offer.title.split(' ').slice(0, -1).join(' ')} <br/>
                <span className="italic text-leather font-serif font-normal">{offer.title.split(' ').slice(-1).join(' ')}</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal min-h-[60px]">
                {offer.description} 
                {new Date(offer.valid_until).getTime() > Date.now() && (
                  <span className="block mt-2 font-bold text-leather">Valid until {new Date(offer.valid_until).toLocaleDateString()}</span>
                )}
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-leather hover:bg-[#FAF6F0] hover:text-[#5C3317] border border-leather text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded shadow-md transition-all duration-300"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Floating product overlay in luxury image block */}
            <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white group/banner bg-neutral-150">
              <img
                src={offer.banner_url || "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop"}
                alt="Special Offer"
                className="w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-[1200ms] ease-out filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
                <span className="text-white font-sans text-[11px] font-bold uppercase tracking-widest bg-[#c5a059]/90 px-3 py-1 rounded backdrop-blur-xs">
                  Sovereign Masterpiece
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {offers.length > 1 && (
          <div className="absolute inset-y-0 left-4 sm:left-6 lg:left-10 flex items-center z-20 pointer-events-none">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#361904] flex items-center justify-center shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {offers.length > 1 && (
          <div className="absolute inset-y-0 right-4 sm:right-6 lg:right-10 flex items-center z-20 pointer-events-none">
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#361904] flex items-center justify-center shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {offers.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {offers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#361904] w-4' : 'bg-[#361904]/30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
