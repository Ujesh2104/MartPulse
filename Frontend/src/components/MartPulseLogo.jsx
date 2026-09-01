import React from 'react';

export const MartPulseLogo = ({ size = 'md', className = '', showSubtitle = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDimension = isSm ? 'w-8 h-8' : isLg ? 'w-11 h-11' : 'w-9 h-9';
  const textTitleSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Ultra-Modern M-Pulse Geometric Glyph */}
      <div className={`relative ${iconDimension} flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#5B4DFF] to-[#4338CA] p-0.5 shadow-[0_4px_16px_rgba(91,77,255,0.38)] transition-transform duration-300 hover:scale-105 group`}>
        {/* Inner subtle bevel border */}
        <div className="w-full h-full rounded-[14px] bg-[#5B4DFF] flex items-center justify-center overflow-hidden relative">
          {/* Subtle background ambient light */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none"></div>

          {/* Precision SVG Brand Mark */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5/6 h-5/6 text-white drop-shadow-sm"
          >
            {/* Background interconnected grid nodes */}
            <circle cx="6" cy="18" r="1.5" fill="rgba(255,255,255,0.5)" />
            <circle cx="26" cy="18" r="1.5" fill="rgba(255,255,255,0.5)" />

            {/* Glowing Pulse Waveform Path */}
            <path
              d="M5 18H10L13 10L17 24L20 14L22 18H27"
              stroke="white"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pulse Apex Star Glow */}
            <circle cx="13" cy="10" r="1.8" fill="#FCD34D" />
          </svg>
        </div>
      </div>

      {/* Modern High-End Typography */}
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
