import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  LayoutDashboard,
  LogOut,
  KeyRound,
  ChevronDown,
  Menu,
  X,
  Store,
  Heart,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import ChangePasswordModal from './Modals/ChangePasswordModal';
import MartPulseLogo from './MartPulseLogo';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'STORE_OWNER') return '/owner/dashboard';
    return '/user/dashboard';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?q=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  // Determine dynamic display name and avatar initial
  const getDisplayName = () => {
    if (!user) return '';
    if (user.role === 'ADMIN') return 'Admin';
    if (user.role === 'STORE_OWNER') return user.name?.split(' ')[0] || 'Store Owner';
    return user.name?.split(' ')[0] || 'Shopper';
  };

  const getAvatarInitial = () => {
    if (!user) return 'U';
    if (user.role === 'ADMIN') return 'A';
    return user.name?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0A0B0E]/90 backdrop-blur-xl border-b border-[#1C1D24] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Brand Logo & Catalog Pill Button */}
            <div className="flex items-center gap-6">
              <Link to="/" className="group flex items-center">
                <MartPulseLogo size="md" />
              </Link>

              {/* Catalog Pill Button matching Image 2 */}
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14151B] hover:bg-[#1C1E26] border border-[#262833] text-xs font-semibold text-white transition-all hover:border-[#CCFF00]/40"
              >
                <Menu className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>Catalog</span>
              </Link>
            </div>

            {/* Middle Nav Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-xs font-semibold tracking-wide transition-all relative py-1 ${
                  location.pathname === '/'
                    ? 'text-[#CCFF00] font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Bestsellers
                {location.pathname === '/' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] rounded-full"></span>
                )}
              </Link>

              <Link
                to="/#marts-catalog"
                className="text-xs font-semibold text-zinc-400 hover:text-white tracking-wide transition-all"
              >
                Discover Stores
              </Link>

              {isAuthenticated && (
                <Link
                  to={getDashboardPath()}
                  className={`text-xs font-semibold tracking-wide transition-all relative py-1 flex items-center gap-1.5 ${
                    location.pathname.includes('dashboard')
                      ? 'text-[#CCFF00] font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Portal</span>
                  {location.pathname.includes('dashboard') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] rounded-full"></span>
                  )}
                </Link>
              )}
            </nav>

            {/* Right: Search, Favorites, Auth / Profile Controls */}
            <div className="flex items-center gap-3">
              {/* Global Search Pill matching Image 2 */}
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center">
                <div className="relative w-56 lg:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search marts & groceries..."
                    className="w-full pl-9 pr-4 py-2 bg-[#121318] hover:bg-[#171820] focus:bg-[#171820] text-zinc-200 text-xs rounded-full border border-[#232530] focus:border-[#CCFF00]/50 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all placeholder:text-zinc-500"
                  />
                </div>
              </form>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-[#181920] rounded-full border border-[#262833] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-xs font-extrabold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-full shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all hover:shadow-[0_0_28px_rgba(204,255,0,0.4)]"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14151B] hover:bg-[#1C1E26] border border-[#262833] text-zinc-200 transition-all hover:border-[#CCFF00]/40"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-extrabold text-[11px]">
                      {getAvatarInitial()}
                    </div>
                    <span className="text-xs font-bold text-white max-w-[110px] truncate">
                      {getDisplayName()}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-[#20222C] text-[#CCFF00] border border-[#2D2F3C]">
                      {user?.role === 'ADMIN'
                        ? 'Admin'
                        : user?.role === 'STORE_OWNER'
                        ? 'Owner'
                        : 'User'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-[#262833] transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>

                  {/* Profile Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-11 mt-1 w-64 rounded-2xl bg-[#14151B] border border-[#262833] shadow-[0_16px_40px_rgba(0,0,0,0.8)] py-2 z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-[#20222C]">
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Signed In As</p>
                        <p className="text-xs font-bold text-white truncate mt-0.5">{user?.email}</p>
                        <p className="text-[10px] font-bold text-[#CCFF00] mt-1">
                          {user?.role === 'ADMIN'
                            ? '👑 System Administrator'
                            : user?.role === 'STORE_OWNER'
                            ? '🛒 Verified Store Owner'
                            : '🛍️ Registered Shopper'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-[#1C1E26] hover:text-[#CCFF00] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#CCFF00]" />
                          Role Management Portal
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowPasswordModal(true);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-[#1C1E26] hover:text-[#CCFF00] transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#CCFF00]" />
                          Change Password
                        </button>
                      </div>

                      <div className="border-t border-[#20222C] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-zinc-300 hover:bg-[#1C1E26] border border-[#262833]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1C1D24] bg-[#0E0F14] px-4 pt-3 pb-5 space-y-3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search marts, grocers..."
                className="w-full px-4 py-2 bg-[#171820] text-zinc-200 text-xs rounded-full border border-[#262833] outline-none"
              />
            </form>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-zinc-300 py-1 hover:text-[#CCFF00]"
            >
              Bestsellers & Catalog
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-semibold text-[#CCFF00] py-1"
                >
                  Portal Dashboard ({getDisplayName()})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-xs font-semibold text-rose-400 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold border border-[#262833] rounded-full text-zinc-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-black bg-[#CCFF00] rounded-full"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;

