/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  ShoppingBag, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Hammer, 
  HeartHandshake,
  ArrowRight,
  MoveDown,
  Footprints,
  Instagram
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

let globalAppHasLoaded = false;

export const HeroSection: React.FC = () => {
  const { navigateTo, products, setSelectedProductDetail, heroSlides, setShopCategory } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    setShopCategory(category);
    navigateTo('shop');
  };

  // Track page-level scroll progress for subtle background animations
  const { scrollYProgress } = useScroll();
  
  // Rotate decorative circular backdrop ring based on scroll
  const backdropRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Custom decorative Sparkles/Dust particles drifting upwards
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number }>>([]);

  const isInitialLoad = !globalAppHasLoaded;

  useEffect(() => {
    if (!globalAppHasLoaded) {
      const timer = setTimeout(() => {
        globalAppHasLoaded = true;
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  const dBase = isInitialLoad ? 1.2 : 0;

  useEffect(() => {
    // Generate constant premium floating specs
    const specs = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 3
    }));
    setParticles(specs);
  }, []);

  return (
    <div
      ref={heroRef}
      id="luxury-3d-hero-container"
      className="relative w-full min-h-[60vh] lg:min-h-[70vh] bg-[#1a0b02] overflow-hidden flex items-center justify-center selection:bg-leather/20 border-b border-leather/20 pt-16 sm:pt-20 lg:pt-0"
      style={{
        // Smooth cinematic dark luxury aesthetic
        backgroundImage: `
          radial-gradient(ellipse 120% 80% at 50% -10%, rgba(229, 205, 130, 0.15) 0%, transparent 70%),
          radial-gradient(circle at 80% 50%, rgba(201, 168, 76, 0.1) 0%, transparent 60%),
          radial-gradient(ellipse 120% 60% at 50% 100%, #361904 20%, #0a0401 100%)
        `
      }}
    >
      {/* ── Subtitle Watermarks & Fine Lines ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* Floating Sparks Layer */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold/30 blur-[0.2px]"
            style={{
              left: p.left,
              bottom: '-5%',
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: ['-110vh'],
              opacity: [0, 0.8, 0.8, 0],
              x: ['0px', `${Math.sin(p.id) * 45}px`, `${Math.sin(p.id) * -30}px`]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Diagonal elegant brand identity lines */}
        <div className="absolute top-1/4 left-[15%] w-[1px] h-96 bg-gradient-to-b from-leather/10 via-leather/4 to-transparent transform -rotate-12" />
        <div className="absolute top-1/3 right-[15%] w-[1px] h-96 bg-gradient-to-b from-[#E5CD82]/30 via-[#E5CD82]/10 to-transparent transform rotate-12" />

        {/* Vintage Craft Compass Grid rotating silently */}
        <motion.div 
          style={{ rotate: backdropRotate }}
          className="absolute -right-32 top-10 w-[600px] h-[600px] rounded-full border border-leather/[0.04] flex items-center justify-center opacity-70"
        >
          <div className="w-[450px] h-[450px] rounded-full border border-dashed border-[#C9A84C]/15" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-leather/[0.03]" />
          <div className="absolute w-12 h-[1px] bg-gold/25" />
          <div className="absolute h-12 w-[1px] bg-gold/25" />
        </motion.div>
      </div>

      {/* ── Foreground Branding, Stats & CTA Layout ── */}
      <div className="relative z-25 w-full mx-auto px-4 sm:px-12 lg:px-24 py-4 sm:py-6 flex flex-col justify-center gap-4 h-full min-h-[60vh] lg:min-h-[70vh]">
        
        {/* Top Header Margin spacing */}
        <div className="hidden lg:block h-4" />

        {/* Main Content Splitting */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4 w-full max-w-[1600px] mx-auto">
          
          {/* Left Column: Elegant Copious Typographic Presentation */}
          <div className="relative z-10 lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left select-none lg:pl-4 xl:pl-4 -mt-4 sm:-mt-2 lg:mt-12">
            
            {/* Giant Title Layout with gold-gradient fills */}
            <div className="space-y-4 lg:space-y-6 w-full flex flex-col items-center lg:items-start">
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: dBase + 0.2, ease: "easeOut" }}
                className="flex items-center justify-center lg:justify-start w-full"
              >
                <div className="inline-flex flex-col items-center justify-center gap-1 sm:gap-2">
                  <div 
                    className="leading-none font-normal select-none relative w-full text-center"
                    style={{ color: '#D4AF37', fontSize: 'clamp(4.5rem, 12vw, 8.5rem)', fontFamily: '"Times New Roman", Times, serif', letterSpacing: '-0.02em', textShadow: '0 4px 25px rgba(0,0,0,0.4)', lineHeight: '0.9' }}
                  >
                    YY
                  </div>
                  <div 
                    className="uppercase font-sans font-medium opacity-90 select-none tracking-[0.4em] lg:tracking-[0.6em] text-center w-full pl-[0.4em] lg:pl-[0.6em]"
                    style={{ 
                      color: '#FDFBF7', 
                      fontSize: 'clamp(0.85rem, 2vw, 1.3rem)', 
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    LEATHERS
                  </div>
                </div>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: dBase + 0.35, type: "spring", bounce: 0.4 }}
                className="font-sans text-xs sm:text-sm lg:text-base tracking-[0.25em] lg:tracking-[0.35em] font-bold text-[#FAF6F0] uppercase px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-lg inline-block text-center lg:text-left mt-3 sm:mt-4 border border-[#320000]/50 shadow-2xl"
                style={{ backgroundColor: '#2a0000' }}
              >
                THE INDIA'S FIRST BUY BACK STORE.
              </motion.h2>
            </div>

            {/* Spec Badge Micro-Grid for visual attraction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: dBase + 0.65, type: "spring", bounce: 0.4 }}
              className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-sm sm:max-w-xl mx-auto lg:mx-0 pt-4 text-left"
            >
              {[
                { icon: Footprints, title: '100% LEATHER', desc: 'Sartorial Grade' },
                { icon: Hammer, title: 'CUSTOMIZABLE SHOE', desc: 'Handcrafted Fit' },
                { icon: ShieldCheck, title: 'TRUSTABLE STORE', desc: 'Secure & Verified' }
              ].map((spec, sidx) => (
                <div key={sidx} className="bg-white/85 shadow-sm border border-leather/5 rounded-2xl p-3 flex flex-col gap-1 backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-leather/5 flex items-center justify-center text-leather">
                    <spec.icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans text-[10px] sm:text-[11px] font-bold text-[#361904] mt-1 tracking-tight leading-none">{spec.title}</span>
                  <span className="font-sans text-[9px] text-[#7c5B41] leading-none">{spec.desc}</span>
                </div>
              ))}
            </motion.div>

            {/* Clean Interactive CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: dBase + 0.75, type: "spring", bounce: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4 pt-[200px] sm:pt-8 w-full max-w-xl mx-auto lg:mx-0"
            >
              {/* Instagram link */}
              <a
                href="https://www.instagram.com/yy_leathers/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto flex-none flex items-center justify-center bg-white border border-neutral-200 text-[#E1306C] hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] py-4 sm:py-5 px-6 rounded-xl shadow-xl transition-all duration-500"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget;
                  b.style.transform = 'translateY(-4px) scale(1.02)';
                  b.style.boxShadow = '0 20px 40px rgba(225, 48, 108, 0.25)';
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget;
                  b.style.transform = 'none';
                  b.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                }}
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="ml-2 font-sans font-bold tracking-wider">INSTAGRAM</span>
              </a>

              {/* Luxury Primary */}
              <button
                id="hero-ux-shop-btn"
                onClick={() => navigateTo('shop')}
                className="group w-full sm:w-auto max-w-sm sm:max-w-md bg-gold border border-gold text-white font-sans text-base sm:text-lg uppercase tracking-widest font-black py-4 sm:py-5 px-8 rounded-xl shadow-2xl flex items-center justify-center gap-3 cursor-pointer duration-500 overflow-hidden relative flex-1"
                style={{
                  boxShadow: '0 15px 40px rgba(212, 175, 55, 0.3)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget;
                  b.style.background = '#FFFFFF';
                  b.style.color = '#C5A017';
                  b.style.transform = 'translateY(-4px) scale(1.02)';
                  b.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.4)';
                  b.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget;
                  b.style.background = '#D4AF37';
                  b.style.color = '#FFFFFF';
                  b.style.transform = 'none';
                  b.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.3)';
                  b.style.borderColor = '#D4AF37';
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700 ease-in-out"></div>
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                <span className="relative z-10 whitespace-nowrap">Explore More</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Premium showcase video player replacing empty placeholder */}
          {/* Mobile: absolute positioned behind text. Desktop: static column flow */}
          <motion.div
            initial={{ opacity: 0, x: 100, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: dBase + 0.3, type: "spring", bounce: 0.4 }}
            className="absolute lg:static top-0 sm:top-[-3%] left-0 w-full h-full lg:col-span-6 xl:col-span-5 flex justify-center lg:items-center z-0 pointer-events-none lg:pointer-events-auto opacity-100 lg:translate-x-8 xl:translate-x-0"
          >
            {/* Centered directly on mobile so the shoe rotates fully in view */}
            <div className="relative w-full max-w-lg aspect-[1/1] flex items-center justify-center translate-x-0 lg:translate-x-0 lg:-mt-12 mt-[120px] sm:mt-10">
               
               {/* Mobile: Warm Amber & Gold Radial Gradient Spotlight */}
               <div className="absolute inset-0 rounded-full lg:hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e5cd82]/60 via-[#8b5a2b]/30 to-transparent blur-[40px] scale-[1.7]" />
               
               {/* Desktop: Luxury Circular Halo/Rings & Particles */}
               <div className="absolute inset-0 rounded-full hidden lg:block border-[1.5px] border-[#e5cd82]/30 scale-[1.3] animate-[spin_60s_linear_infinite]" />
               <div className="absolute inset-8 rounded-full hidden lg:block border-[0.5px] border-[#8b5a2b]/40 scale-[1.25] animate-[spin_40s_linear_infinite_reverse]" />
               <div className="absolute inset-0 rounded-full hidden lg:block bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c9a84c]/20 to-transparent blur-[40px] scale-[1.2]" />

               {/* Desktop: Floating golden particles */}
               <div className="absolute top-[10%] left-[20%] w-2.5 h-2.5 bg-[#e5cd82]/60 rounded-full hidden lg:block blur-[1px] animate-[pulse_3s_ease-in-out_infinite]" />
               <div className="absolute bottom-[25%] right-[5%] w-3.5 h-3.5 bg-gold/50 rounded-full hidden lg:block blur-[1.5px] animate-[pulse_4s_ease-in-out_infinite_1s]" />
               <div className="absolute top-[45%] right-[-5%] w-1.5 h-1.5 bg-[#8b5a2b]/80 rounded-full hidden lg:block animate-[pulse_2.5s_ease-in-out_infinite_0.5s]" />

               {/* Premium floating effect with up-down animation */}
               {/* Mobile: scale 155%, opacity ~40%. Desktop: scale 150%, opacity 100% */}
               <motion.div 
                 className="w-full h-full relative bg-transparent scale-[1.5] lg:scale-[1.5] opacity-100 transition-all duration-700 pointer-events-auto"
                 animate={{ y: [-15, 15, -15] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                 <video
                   src="https://res.cloudinary.com/domuelr1f/video/upload/v1781184045/animate_202606101949_202606102216-Picsart-BackgroundRemover_wdifyz.webm"
                   autoPlay
                   loop
                   muted
                   playsInline
                   style={{
                     maskImage: "radial-gradient(ellipse at center, black 85%, transparent 100%)",
                     WebkitMaskImage: "radial-gradient(ellipse at center, black 85%, transparent 100%)"
                   }}
                   // Soft shadow underneath shoe for desktop with gold hint
                   className="w-full h-full object-contain filter drop-shadow-none lg:drop-shadow-[0_45px_35px_rgba(229,205,130,0.25)]"
                 />
                 {/* Desktop: Subtle golden glow around edges */}
                 <div className="absolute inset-0 rounded-full hidden lg:block shadow-[0_0_80px_rgba(229,205,130,0.3)] mix-blend-overlay pointer-events-none scale-[1.2]" />
               </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Full Width Slider */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: dBase + 0.85, type: "spring", bounce: 0.4 }}
            className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] z-20 pt-1 lg:mt-0 overflow-hidden"
          >
            <div className="text-[10px] sm:text-xs font-bold text-leather uppercase tracking-[0.2em] mb-4 flex items-center justify-center pl-4 sm:pl-12 lg:pl-24 md:justify-start">
              <div className="h-[2px] w-6 bg-gold mr-3 hidden md:block" />
              Explore Silhouettes
            </div>
            <div 
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x select-none cursor-grab active:cursor-grabbing relative px-4 sm:px-12 lg:px-24 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                .overflow-x-auto::-webkit-scrollbar { display: none; }
              `}</style>
              {heroSlides && heroSlides.length > 0 ? (
                heroSlides.map((slide) => (
                  <div key={slide.id} onClick={() => handleCategoryClick(slide.category)} className="flex flex-col items-center gap-3 snap-center sm:snap-start flex-shrink-0 group cursor-pointer">
                    <div 
                      className="w-[160px] h-[100px] sm:w-[220px] sm:h-[130px] bg-white rounded-[100px] border border-leather/10 flex items-center justify-center hover:border-gold hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)] transition-all relative overflow-hidden duration-300 transform group-hover:-translate-y-2 shadow-md"
                    >
                      <img 
                        src={slide.image_url} 
                        alt={slide.category} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-white tracking-widest text-center drop-shadow-md">{slide.category}</span>
                  </div>
                ))
              ) : (
                products.filter(p => p.is_published).slice(0, 8).map(prod => (
                  <div key={prod.id} onClick={() => {
                      setSelectedProductDetail(prod);
                      navigateTo('shop');
                    }} className="flex flex-col items-center gap-3 snap-center sm:snap-start flex-shrink-0 group cursor-pointer">
                    <div 
                      className="w-[160px] h-[100px] sm:w-[220px] sm:h-[130px] bg-white rounded-[100px] border border-leather/10 flex items-center justify-center hover:border-gold hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)] transition-all relative overflow-hidden duration-300 transform group-hover:-translate-y-2 shadow-md"
                    >
                      <img 
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop'} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-white tracking-widest text-center drop-shadow-md">{prod.category}</span>
                  </div>
                ))
              )}
              
              <div onClick={() => navigateTo('shop')} className="flex flex-col items-center gap-3 snap-center sm:snap-start flex-shrink-0 group cursor-pointer">
                <div 
                    className="w-[160px] h-[100px] sm:w-[220px] sm:h-[130px] rounded-[100px] border-2 border-dashed border-leather/30 bg-leather/5 flex-shrink-0 cursor-pointer group-hover:border-gold group-hover:text-gold group-hover:bg-gold/10 text-leather transition-all flex flex-col items-center justify-center gap-2 duration-300 transform group-hover:-translate-y-2"
                >
                   <ArrowRight className="w-6 h-6" />
                </div>
                <span className="text-[10px] sm:text-xs uppercase font-bold text-white tracking-widest text-center drop-shadow-md">View All</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Animated Slide prompting user scroll */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: dBase + 0.95 }}
          className="flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer pointer-events-auto py-2 group w-max mx-auto"
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
        >
          <span className="font-sans text-[9px] font-bold tracking-[0.35em] text-[#7c5B41] uppercase group-hover:text-leather duration-300">
            Scroll Down to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MoveDown className="w-4 h-4 text-leather/80 group-hover:text-leather" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export const HeroVideo = HeroSection;