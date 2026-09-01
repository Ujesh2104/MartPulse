import React from 'react';

export const MartPulseLogo = ({ size = 'md', className = '', showSubtitle = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconContainerSize = isSm ? 'w-9 h-9' : isLg ? 'w-12 h-12' : 'w-10 h-10';
  const textTitleSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Glowing 3D Vector Emblem with Neon Pulse Aura */}
      <div className="relative group flex items-center justify-center">
        {/* Live Ambient Neon Pulse Glow Behind Icon */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5B4DFF] via-[#7C3AED] to-[#4F46E5] opacity-75 blur-md group-hover:opacity-100 transition duration-500 group-hover:blur-lg animate-pulse-subtle"></div>

        {/* Glossy Cyber Emblem Tile */}
        <div
          className={`relative ${iconContainerSize} rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] p-0.5 shadow-[0_4px_20px_rgba(91,77,255,0.45)] border border-[#7C3AED]/50 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105`}
        >
          {/* Internal Glassmorphic Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>

          {/* Razor-Sharp Glowing Vector SVG */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(91,77,255,0.9)) drop-shadow(0 0 12px rgba(124,58,237,0.7))',
            }}
          >
            <defs>
              {/* Neon Indigo-Violet Gradient */}
              <linearGradient id="neonPulseGrad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#C084FC" />
              </linearGradient>

              {/* Gold Accent Gradient */}
              <linearGradient id="goldNodeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FDE047" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>

              {/* Glowing Drop Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Shopping Mart Geometric Structure */}
            <path
              d="M5 8H8.5L11.5 22H26.5L29 12H10.5"
              stroke="url(#neonPulseGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Vibrant EKG Neon Pulse Waveform Rising through Cart */}
            <path
              d="M4 17H11L14.5 9L18.5 25L22.5 13L25 17H31"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gold Apex Spark Node */}
            <circle cx="14.5" cy="9" r="2.2" fill="url(#goldNodeGrad)" filter="url(#neonGlow)" />

            {/* Cart Wheels */}
            <circle cx="14" cy="27" r="2" fill="url(#neonPulseGrad)" />
            <circle cx="24" cy="27" r="2" fill="url(#neonPulseGrad)" />
          </svg>
        </div>
      </div>

      {/* Brand Typography with Live Glowing Dot */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-heading font-black tracking-tight text-slate-900 ${textTitleSize}`}>
            MART
          </span>
          <span
            className={`font-heading font-black tracking-tight text-[#5B4DFF] ml-0.5 ${textTitleSize}`}
            style={{
              textShadow: '0 0 20px rgba(91,77,255,0.4)',
            }}
          >
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
