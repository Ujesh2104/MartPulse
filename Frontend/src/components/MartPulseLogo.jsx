import React from 'react';

export const MartPulseLogo = ({ size = 'md', className = '', showSubtitle = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDimension = isSm ? 'w-8 h-8' : isLg ? 'w-11 h-11' : 'w-9 h-9';
  const textTitleSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Glowing MartPulse Brand Emblem */}
      <div className={`relative ${iconDimension} rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(91,77,255,0.35)] border border-indigo-100 flex-shrink-0 transition-transform duration-300 hover:scale-105 group bg-white`}>
        <img
          src="/logo.png"
          alt="MartPulse 3D Logo"
          className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // High-precision SVG Fallback if image path fails
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Modern High-End Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-heading font-black tracking-tight text-slate-900 ${textTitleSize}`}>
            MART
          </span>
          <span className={`font-heading font-black tracking-tight text-[#5B4DFF] ml-0.5 ${textTitleSize}`}>
            PULSE
          </span>
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#5B4DFF] animate-pulse-subtle"></span>
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
