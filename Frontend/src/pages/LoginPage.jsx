import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import MartPulseLogo from '../components/MartPulseLogo';

export const LoginPage = () => {
  const { login, loading, authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const redirectByRole = (role) => {
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

  const handleQuickFill = (demoEmail, demoPassword, roleName) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSelectedRole(roleName);
    setFormError('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F5FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="flex justify-center mb-2">
          <MartPulseLogo size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to access your role dashboard and community ratings
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {(formError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10 text-xs text-slate-800 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10 text-xs text-slate-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white font-bold text-xs shadow-[0_4px_12px_rgba(91,77,255,0.25)] hover:shadow-[0_6px_16px_rgba(91,77,255,0.35)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
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

          {/* Quick Demo Autofill Pills */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-center text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              ⚡ Quick Autofill Demo Profiles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@martpulse.com', 'Admin@12345', 'ADMIN')}
                className={`p-2.5 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'ADMIN'
                    ? 'bg-[#5B4DFF]/10 text-[#5B4DFF] border-[#5B4DFF]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Autofill Administrator"
              >
                <ShieldCheck className="w-4 h-4 text-[#5B4DFF]" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('owner@martpulse.com', 'Owner@12345', 'STORE_OWNER')}
                className={`p-2.5 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'STORE_OWNER'
                    ? 'bg-[#5B4DFF]/10 text-[#5B4DFF] border-[#5B4DFF]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Autofill Store Owner"
              >
                <UserCheck className="w-4 h-4 text-[#5B4DFF]" />
                <span>Store Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('user@martpulse.com', 'User@12345', 'NORMAL_USER')}
                className={`p-2.5 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'NORMAL_USER'
                    ? 'bg-[#5B4DFF]/10 text-[#5B4DFF] border-[#5B4DFF]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Autofill Normal User"
              >
                <Sparkles className="w-4 h-4 text-[#5B4DFF]" />
                <span>Shopper</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-1">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#5B4DFF] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
