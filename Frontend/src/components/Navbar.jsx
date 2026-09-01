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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Modern Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="group flex items-center">
                <MartPulseLogo size="md" />
              </Link>

              {/* Global Search Pill matching reference UI */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center">
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search marts, grocers..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs rounded-full border border-transparent focus:border-[#5B4DFF]/40 focus:ring-2 focus:ring-[#5B4DFF]/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </form>
            </div>

            {/* Middle Nav Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  location.pathname === '/'
                    ? 'text-[#5B4DFF] bg-[#5B4DFF]/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Explore Marts
              </Link>
              {isAuthenticated && (
                <Link
                  to={getDashboardPath()}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    location.pathname.includes('dashboard')
                      ? 'text-[#5B4DFF] bg-[#5B4DFF]/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Right Auth / Profile Controls */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#5B4DFF] hover:bg-[#4B3BE6] rounded-full shadow-[0_4px_12px_rgba(91,77,255,0.25)] transition-all hover:shadow-[0_6px_16px_rgba(91,77,255,0.35)]"
                  >
                    Register Free
                  </Link>
                </>
              ) : (
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#5B4DFF] text-white flex items-center justify-center font-bold text-[10px]">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold max-w-[120px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-[#5B4DFF] border border-slate-200">
                      {user?.role === 'ADMIN'
                        ? 'Admin'
                        : user?.role === 'STORE_OWNER'
                        ? 'Owner'
                        : 'Shopper'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>

                  {/* Profile Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-11 mt-1 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[11px] text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                        <p className="text-[10px] font-semibold text-[#5B4DFF] mt-0.5">
                          {user?.role === 'ADMIN'
                            ? 'System Administrator'
                            : user?.role === 'STORE_OWNER'
                            ? 'Verified Store Owner'
                            : 'Verified Shopper'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5B4DFF] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Role Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowPasswordModal(true);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#5B4DFF] transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          Change Password
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search marts, grocers..."
                className="w-full px-4 py-2 bg-slate-100 text-slate-800 text-xs rounded-full border border-slate-200 outline-none"
              />
            </form>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Explore Marts
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-semibold text-[#5B4DFF] py-1"
                >
                  Dashboard ({user?.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-xs font-semibold text-rose-600 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold border border-slate-200 rounded-full"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#5B4DFF] rounded-full"
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
