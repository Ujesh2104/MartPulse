import React from 'react';

export const MartPulseLogo = ({ size = 'md', className = '' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSizes = isSm ? 'w-7 h-7' : isLg ? 'w-10 h-10' : 'w-8 h-8';
  const textSizes = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Minimalist Tech Icon */}
      <div className={`relative flex items-center justify-center ${iconSizes} rounded-xl bg-[#5B4DFF] text-white shadow-[0_4px_12px_rgba(91,77,255,0.35)] transition-transform duration-200 hover:scale-105`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4/6 h-4/6"
        >
          <path d="M3 12h4l3 7 4-14 3 7h4" />
        </svg>
      </div>

      {/* Modern High-End Typography */}
      <div className="flex items-baseline">
        <span className={`font-heading font-extrabold tracking-tight text-slate-900 ${textSizes}`}>
          MART<span className="text-[#5B4DFF]">PULSE</span>
        </span>
        <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#5B4DFF]"></span>
      </div>
    </div>
  );
};

export default MartPulseLogo;
