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
  Activity,
  User,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateAll = () => {
    const newErrors = {};

    const nameVal = validateName(formData.name);
    if (!nameVal.isValid) {
      newErrors.name = nameVal.message;
    }

    const emailVal = validateEmail(formData.email);
    if (!emailVal.isValid) {
      newErrors.email = emailVal.message;
    }

    const passVal = validatePassword(formData.password);
    if (!passVal.isValid) {
      newErrors.password = passVal.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const addressVal = validateAddress(formData.address);
    if (!addressVal.isValid) {
      newErrors.address = addressVal.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateAll()) {
      return;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      role: 'NORMAL_USER',
    });

    if (res.success) {
      navigate('/user/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#09090B] border border-amber-500/40 shadow-gold-glow mb-4 hover:scale-105 transition-transform">
          <Activity className="w-8 h-8 text-amber-500 animate-pulse-glow" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Create Your <span className="text-amber-600">MartPulse</span> Account
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Join a community of verified shoppers rating marts with complete transparency
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0 animate-fade-in-up">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-zinc-200 shadow-xl space-y-6 hover-lift">
          {(formError || authError) && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Legal Name (20 to 60 characters) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Full Name *
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    formData.name.trim().length < 20 || formData.name.trim().length > 60
                      ? 'text-amber-600 font-semibold'
                      : 'text-emerald-600'
                  }`}
                >
                  {formData.name.trim().length}/60 (min 20)
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Harrison Montgomery Cole"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-zinc-50/50 ${
                  errors.name
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                    : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.name@domain.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-zinc-50/50 ${
                  errors.email
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                    : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="8-16 chars, 1 uppercase, 1 special"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-zinc-50/50 ${
                      errors.password
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                        : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-zinc-50/50 ${
                    errors.confirmPassword
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                      : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address (Max 400 characters) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  Address *
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    formData.address.trim().length > 400 ? 'text-rose-600' : 'text-zinc-500'
                  }`}
                >
                  {formData.address.trim().length}/400
                </span>
              </div>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. 1204 Pinecrest Haven Way, Crystal Lake District, IL 60014"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-none focus:ring-2 bg-zinc-50/50 ${
                  errors.address
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                    : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
