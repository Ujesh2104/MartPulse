import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Sparkles,
  User,
  LogOut,
  KeyRound,
  LayoutDashboard,
  Store,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import ChangePasswordModal from './Modals/ChangePasswordModal';
import MartPulseLogo from './MartPulseLogo';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            System Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Store Owner
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            Verified Member
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#09090B] border-b border-zinc-800/80 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Clean & Minimal Logo */}
            <Link to="/" className="group flex items-center">
              <MartPulseLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-amber-400 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Explore Marts
              </Link>
              {isAuthenticated && (
                <Link
                  to={getDashboardPath()}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.includes('dashboard')
                      ? 'text-amber-400 font-semibold'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-500" />
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="relative group overflow-hidden rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      Register Now
                    </span>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  {/* Quick Direct Logout Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all duration-200 focus:outline-none"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white max-w-[120px] truncate">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-amber-400/80 font-medium">
                          {user?.role === 'ADMIN'
                            ? 'Admin'
                            : user?.role === 'STORE_OWNER'
                            ? 'Store Owner'
                            : 'Normal User'}
                        </p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                      title="Log Out & Switch Account"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-xs text-zinc-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                        <div className="mt-2">{getRoleBadge(user?.role)}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-500" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowPasswordModal(true);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                        >
                          <KeyRound className="w-4 h-4 text-amber-500" />
                          Change Password
                        </button>
                      </div>

                      <div className="border-t border-zinc-800 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-[#09090B] border-b border-zinc-800 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-850"
            >
              Explore Marts
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-zinc-850"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  My Dashboard ({user?.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowPasswordModal(true);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:bg-zinc-850"
                >
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-zinc-900 border border-zinc-800 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-zinc-950 bg-gold-gradient rounded-xl shadow-gold-glow"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Navbar;
