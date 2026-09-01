import React from 'react';
import MartPulseLogo from './MartPulseLogo';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <MartPulseLogo size="sm" />
          <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500 font-medium">
            Smart Grocery & Retail Rating Platform
          </span>
        </div>

        {/* Minimal Slogan Badge & Copyright */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px] border border-slate-200">
            Discover the Best. Rate with Trust.
          </span>
          <span>© {new Date().getFullYear()} MartPulse. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
