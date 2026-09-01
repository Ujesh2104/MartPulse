import React from 'react';
import { Sparkles } from 'lucide-react';
import MartPulseLogo from './MartPulseLogo';

export const Footer = () => {
  return (
    <footer className="bg-[#09090B] text-zinc-400 border-t border-zinc-800/80 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/60">
          {/* Logo and simple description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <MartPulseLogo size="md" />
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
              A simple platform to discover, rate, and review local stores easily.
            </p>
          </div>

          {/* Slogan highlight badge */}
          <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-gold-glow hover:border-amber-500/60 transition-all">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-amber-400 tracking-wide italic">
              "Discover the Best. Rate with Trust."
            </span>
          </div>
        </div>

        {/* Simple Bottom Bar */}
        <div className="pt-6 text-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MartPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
