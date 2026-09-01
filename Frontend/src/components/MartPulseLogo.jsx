import React from 'react';

/**
 * Unique & Futuristic MartPulse Cyber-Luxury Vector Logo
 */
export const MartPulseLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { box: 'w-9 h-9', icon: 'w-6 h-6', text: 'text-lg', sub: 'text-[8px]', dot: 'w-1.5 h-1.5' },
    md: { box: 'w-11 h-11', icon: 'w-7 h-7', text: 'text-xl', sub: 'text-[9px]', dot: 'w-2 h-2' },
    lg: { box: 'w-14 h-14', icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]', dot: 'w-2.5 h-2.5' },
    xl: { box: 'w-18 h-18', icon: 'w-12 h-12', text: 'text-4xl', sub: 'text-xs', dot: 'w-3 h-3' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Crazy 3D Futuristic Hexagon Shield Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Pulsing Gold Aura */}
        <div className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-md group-hover:bg-amber-400/50 transition-all duration-500 animate-pulse-glow" />

        {/* Outer Rotating/Angled Border Frame */}
        <div
          className={`${s.box} rounded-2xl bg-gradient-to-br from-zinc-900 via-[#121215] to-[#09090B] p-[1.5px] relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          {/* Inner Glowing Glass Chamber */}
          <div className="w-full h-full rounded-[14px] bg-[#09090B] border border-amber-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-amber-400 transition-colors">
            {/* Background Cyber Grid Lines in SVG */}
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${s.icon} relative z-10 transition-transform duration-500 group-hover:scale-110`}
            >
              <defs>
                {/* Gold Neon Gradient */}
                <linearGradient id="goldNeon" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Violet-Obsidian Accent Gradient */}
                <linearGradient id="cyberAccent" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="pulseGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Geometric Faceted Mart Diamond / Bag Matrix */}
              <polygon
                points="32,6 54,18 54,46 32,58 10,46 10,18"
                stroke="url(#goldNeon)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="url(#cyberAccent)"
                fillOpacity="0.15"
                className="transition-all duration-300 group-hover:fill-opacity-30"
              />

              {/* Inner Diamond facet lines */}
              <path
                d="M32 6V58M10 18L54 46M10 46L54 18"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="2 3"
              />

              {/* Heartbeat EKG Pulse Wave with Electric Lightning Surge */}
              <path
                d="M8 32H20L25 18L32 46L39 24L44 32H56"
                stroke="url(#goldNeon)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pulseGlow)"
                className="drop-shadow-[0_0_8px_#F59E0B]"
              />

              {/* Center Energy Pulse Node */}
              <circle
                cx="32"
                cy="32"
                r="3.5"
                fill="#FFFBEB"
                className="animate-ping origin-center"
                style={{ animationDuration: '2s' }}
              />
              <circle cx="32" cy="32" r="2.5" fill="#F59E0B" />
            </svg>

            {/* Corner Hologram Sparkle */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-400/40 rounded-full blur-sm group-hover:scale-150 transition-transform" />
          </div>
        </div>
      </div>

      {/* Futuristic Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-white uppercase font-sans ${s.text} group-hover:text-amber-50 transition-colors`}
            >
              MART
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                PULSE
              </span>
            </span>
            {/* Live Indicator Dot */}
            <span className={`${s.dot} rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse`} />
          </div>

          <div className="flex items-center gap-1.5 -mt-1">
            <span className={`font-mono font-bold tracking-[0.25em] text-amber-500/90 uppercase ${s.sub}`}>
              SMART RETAIL
            </span>
            <span className="text-[8px] text-zinc-600 font-mono">⚡ 5.0</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MartPulseLogo;
