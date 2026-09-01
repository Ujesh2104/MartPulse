import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const redirectByRole = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'STORE_OWNER') {
      navigate('/owner/dashboard', { replace: true });
    } else {
      navigate('/user/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setFormError(emailCheck.message);
      return;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      redirectByRole(res.user.role);
    }
  };

  // Demo accounts helper
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
    const res = await login(demoEmail, demoPassword);
    if (res.success && res.user) {
      redirectByRole(res.user.role);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-zinc-800/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#09090B] border border-amber-500/40 shadow-gold-glow mb-4 hover:scale-105 transition-transform">
          <Activity className="w-8 h-8 text-amber-500 animate-pulse-glow" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Welcome to <span className="text-amber-600">MartPulse</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Sign in to access your customized role dashboard and community ratings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0 animate-fade-in-up">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-zinc-200 shadow-xl space-y-6 hover-lift">
          {(formError || authError) && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all bg-zinc-50/50"
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Password
                </label>
                <span className="text-xs text-amber-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all bg-zinc-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Role Testing */}
          <div className="pt-4 border-t border-zinc-100">
            <p className="text-center text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
              ⚡ Quick Demo One-Click Sign In
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@martpulse.com', 'Admin@12345')}
                className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800 text-[11px] font-bold hover:bg-zinc-800 transition-all flex flex-col items-center gap-1"
                title="Login as Administrator"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('owner@martpulse.com', 'Owner@12345')}
                className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800 text-[11px] font-bold hover:bg-zinc-800 transition-all flex flex-col items-center gap-1"
                title="Login as Store Owner"
              >
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>Store Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user@martpulse.com', 'User@12345')}
                className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800 text-[11px] font-bold hover:bg-zinc-800 transition-all flex flex-col items-center gap-1"
                title="Login as Normal User"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Normal User</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-500 pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-amber-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
