import React from 'react';

export const MartPulseLogo = ({ size = 'md', className = '', showSubtitle = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconContainerSize = isSm ? 'w-9 h-9' : isLg ? 'w-12 h-12' : 'w-10 h-10';
  const textTitleSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Clean Glowing Shopping Mart Emblem (Without Middle Zigzag Lines) */}
      <div className="relative group flex items-center justify-center">
        {/* Soft Ambient Neon Aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5B4DFF] via-[#818CF8] to-[#6366F1] opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>

        {/* Clean Purple Gradient Tile */}
        <div
          className={`relative ${iconContainerSize} rounded-2xl bg-[#5B4DFF] p-1.5 shadow-[0_4px_16px_rgba(91,77,255,0.4)] border border-white/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105`}
        >
          {/* Razor-Sharp Pure Glowing Shopping Cart Vector */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white"
          >
            {/* Elegant Minimalist Shopping Cart */}
            <path
              d="M3 4H5.5L7.5 15H18.5L20.5 7H6.5"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Golden Quality Star Accent Inside Cart */}
            <path
              d="M13.5 8.5L14.5 10.5L16.5 10.8L15 12.3L15.4 14.5L13.5 13.5L11.6 14.5L12 12.3L10.5 10.8L12.5 10.5L13.5 8.5Z"
              fill="#FDE047"
            />

            {/* Cart Wheels */}
            <circle cx="9" cy="18.5" r="1.5" fill="#FFFFFF" />
            <circle cx="17" cy="18.5" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Brand Typography with Clean Indigo Accent */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-heading font-black tracking-tight text-slate-900 ${textTitleSize}`}>
            MART
          </span>
          <span className={`font-heading font-black tracking-tight text-[#5B4DFF] ml-0.5 ${textTitleSize}`}>
            PULSE
          </span>
          <span className="ml-1.5 w-2 h-2 rounded-full bg-[#5B4DFF] shadow-[0_0_8px_#5B4DFF] animate-pulse-subtle"></span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
            Verified Grocery Ratings
          </span>
        )}
      </div>
    </div>
  );
};

export default MartPulseLogo;
