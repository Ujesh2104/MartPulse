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
import AnimatedSection from '../components/AnimatedSection';

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
    <div className="min-h-[calc(100vh-80px)] bg-[#0A0B0E] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none animate-pulse-subtle"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <AnimatedSection animation="fade-down" className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="flex justify-center mb-2">
          <MartPulseLogo size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-tech">
          Welcome Back
        </h2>
        <p className="text-xs text-zinc-400">
          Sign in to access your role dashboard and community ratings
        </p>
      </AnimatedSection>

      <AnimatedSection animation="scale" delay={150} className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121318] py-8 px-6 sm:px-10 rounded-3xl border border-[#20222A] shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-6">
          {(formError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border border-[#232530] focus:border-[#CCFF00]/50 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border border-[#232530] focus:border-[#CCFF00]/50 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_28px_rgba(204,255,0,0.45)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
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
          <div className="pt-4 border-t border-[#1F2029] space-y-2.5">
            <p className="text-center text-[10px] uppercase tracking-wider font-extrabold text-zinc-500">
              ⚡ Quick Autofill Demo Profiles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@martpulse.com', 'Admin@12345', 'ADMIN')}
                className={`p-2.5 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border hover:scale-105 active:scale-95 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-[#1C1E26] text-[#CCFF00] border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'bg-[#14151B] text-zinc-300 border-[#262833] hover:bg-[#1A1B22]'
                }`}
                title="Autofill Administrator"
              >
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('owner@martpulse.com', 'Owner@12345', 'STORE_OWNER')}
                className={`p-2.5 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border hover:scale-105 active:scale-95 ${
                  selectedRole === 'STORE_OWNER'
                    ? 'bg-[#1C1E26] text-[#CCFF00] border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'bg-[#14151B] text-zinc-300 border-[#262833] hover:bg-[#1A1B22]'
                }`}
                title="Autofill Store Owner"
              >
                <UserCheck className="w-4 h-4 text-[#CCFF00]" />
                <span>Store Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('user@martpulse.com', 'User@12345', 'NORMAL_USER')}
                className={`p-2.5 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 border hover:scale-105 active:scale-95 ${
                  selectedRole === 'NORMAL_USER'
                    ? 'bg-[#1C1E26] text-[#CCFF00] border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.2)]'
                    : 'bg-[#14151B] text-zinc-300 border-[#262833] hover:bg-[#1A1B22]'
                }`}
                title="Autofill Normal User"
              >
                <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                <span>Shopper</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-400 pt-1">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#CCFF00] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default LoginPage;

