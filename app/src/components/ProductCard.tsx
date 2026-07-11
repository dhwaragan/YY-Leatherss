/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, navigateTo, setSelectedProductDetail } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates between -0.5 and 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Rotate multiplier (max tilt 10 degrees)
    setRotate({
      x: -mouseY * 18,
      y: mouseX * 18
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleViewDetails = () => {
    setSelectedProductDetail(product);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'none' : 'transform 0.7s ease-in-out',
      }}
      className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-sm hover:border-[#5C3317] hover:shadow-md transition-all duration-500 ease-in-out flex flex-col h-full group select-none relative"
    >
      {/* Dynamic ribbon tags */}
      {product.is_new_arrival && (
        <span className="absolute top-3 left-3 bg-[#5C3317] text-white font-sans text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded z-20 shadow-sm">
          NEW ARRIVAL
        </span>
      )}
      {product.is_best_seller && (
        <span className="absolute top-3 left-3 bg-[#c5a059] text-black font-sans text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded z-20 shadow-sm">
          BEST SELLER
        </span>
      )}

      {/* Product Image Stage */}
      <div className="relative overflow-hidden aspect-[4/5] bg-neutral-100 flex-shrink-0">
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 z-10 transition-colors duration-500 ease-in-out" />

        {/* Product Image */}
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out will-change-transform"
        />


        {/* Floating Quick Action Overlay buttons */}
        <div className="absolute inset-0 z-20 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={handleViewDetails}
            className="w-10 h-10 bg-white hover:bg-[#5C3317] text-neutral-800 hover:text-white rounded-full flex items-center justify-center shadow-md border border-neutral-100 hover:border-transparent transition-all duration-300 cursor-pointer"
            title="Examine Specs"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            id={`btn-quick-cart-${product.id}`}
            onClick={() => addToCart(product, "9")} // default standard size
            className="w-10 h-10 bg-white hover:bg-[#5C3317] text-neutral-800 hover:text-white rounded-full flex items-center justify-center shadow-md border border-neutral-100 hover:border-transparent transition-all duration-300 delay-75 cursor-pointer"
            title="Buy Sovereign"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        
        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#5C3317] font-semibold block mb-1">
            {product.category}
          </span>
          <button 
            onClick={handleViewDetails}
            className="font-serif text-sm font-bold text-neutral-900 group-hover:text-[#5C3317] text-left transition-colors duration-300 cursor-pointer line-clamp-1 block"
          >
            {product.name}
          </button>
          <p className="text-xs text-neutral-500 font-sans line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-100">
          <span className="font-sans text-sm font-bold text-[#5C3317]">
            { (product as any).mrp && (product as any).mrp > product.price ? (
                            <><span className="text-xs text-neutral-400 line-through mr-2">{(product as any).mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>{product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</>
            ) : (
              <>₹{product.price.toLocaleString('en-IN')}</>
            )}
          </span>
          
        </div>

      </div>

    </motion.div>
  );
};
