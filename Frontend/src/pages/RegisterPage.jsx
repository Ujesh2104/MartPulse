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
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F5FA] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="flex justify-center mb-2">
          <MartPulseLogo size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Shopper Account
        </h2>
        <p className="text-xs text-slate-500">
          Join MartPulse to rate grocery marts and discover top-rated stores
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          {(globalError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{globalError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name (20 to 60 chars) *
                </label>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    formData.name.trim().length < 20 || formData.name.trim().length > 60
                      ? 'text-amber-600'
                      : 'text-emerald-600'
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
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                  errors.name
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                  errors.email
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="8-16 chars (1 Upper, 1 Spec)"
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                      errors.password
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-rose-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Address (Max 400 chars) *
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {formData.address.trim().length}/400
                </span>
              </div>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. 101 Marine Drive, Nariman Point, Mumbai 400021"
                className={`w-full px-4 py-2 rounded-2xl border text-xs resize-none outline-none transition-all ${
                  errors.address
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
                }`}
              />
              {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white font-bold text-xs shadow-[0_4px_12px_rgba(91,77,255,0.25)] hover:shadow-[0_6px_16px_rgba(91,77,255,0.35)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? <span>Creating Account...</span> : <span>Register Now</span>}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5B4DFF] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
