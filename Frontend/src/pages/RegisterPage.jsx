import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators';
import {
  User,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import MartPulseLogo from '../components/MartPulseLogo';
import AnimatedSection from '../components/AnimatedSection';

export const RegisterPage = () => {
  const { register, loading, authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateAll = () => {
    const newErrors = {};

    const nameVal = validateName(formData.name);
    if (!nameVal.isValid) newErrors.name = nameVal.message;

    const emailVal = validateEmail(formData.email);
    if (!emailVal.isValid) newErrors.email = emailVal.message;

    const passVal = validatePassword(formData.password);
    if (!passVal.isValid) newErrors.password = passVal.message;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    const addrVal = validateAddress(formData.address);
    if (!addrVal.isValid) newErrors.address = addrVal.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateAll()) return;

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
    });

    if (res.success && res.user) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (res.user.role === 'STORE_OWNER') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0A0B0E] text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none animate-pulse-subtle"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <AnimatedSection animation="fade-down" className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="flex justify-center mb-2">
          <MartPulseLogo size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-tech">
          Create Shopper Account
        </h2>
        <p className="text-xs text-zinc-400">
          Join MartPulse to rate grocery marts and discover top-rated stores
        </p>
      </AnimatedSection>

      <AnimatedSection animation="scale" delay={150} className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-[#121318] py-8 px-6 sm:px-10 rounded-3xl border border-[#20222A] shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-5">
          {(globalError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{globalError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Full Name (20 to 60 chars) *
                </label>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    formData.name.trim().length < 20 || formData.name.trim().length > 60
                      ? 'text-amber-400'
                      : 'text-[#CCFF00]'
                  }`}
                >
                  {formData.name.trim().length}/60
                </span>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Ramesh Sharma Verified Shopper"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 ${
                  errors.name
                    ? 'border-rose-500/60 bg-rose-500/5'
                    : 'border-[#232530] focus:border-[#CCFF00]/50'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 ${
                  errors.email
                    ? 'border-rose-500/60 bg-rose-500/5'
                    : 'border-[#232530] focus:border-[#CCFF00]/50'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="8-16 chars (1 Upper, 1 Spec)"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 ${
                      errors.password
                        ? 'border-rose-500/60 bg-rose-500/5'
                        : 'border-[#232530] focus:border-[#CCFF00]/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#0C0D11] border text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 ${
                    errors.confirmPassword
                      ? 'border-rose-500/60 bg-rose-500/5'
                      : 'border-[#232530] focus:border-[#CCFF00]/50'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  Address (Max 400 chars) *
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {formData.address.trim().length}/400
                </span>
              </div>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. 101 Marine Drive, Nariman Point, Mumbai 400021"
                className={`w-full px-4 py-2 rounded-xl bg-[#0C0D11] border text-xs text-zinc-100 resize-none outline-none transition-all placeholder:text-zinc-600 ${
                  errors.address
                    ? 'border-rose-500/60 bg-rose-500/5'
                    : 'border-[#232530] focus:border-[#CCFF00]/50'
                }`}
              />
              {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_28px_rgba(204,255,0,0.45)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <span>Creating Account...</span> : <span>Register Now</span>}
            </button>
          </form>

          <div className="text-center text-xs text-zinc-400 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[#CCFF00] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default RegisterPage;

