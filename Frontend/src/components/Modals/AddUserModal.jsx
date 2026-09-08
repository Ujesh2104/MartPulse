import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../../utils/validators';
import {
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

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

    const addrVal = validateAddress(formData.address);
    if (!addrVal.isValid) newErrors.address = addrVal.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccessMsg('');

    if (!validateAll()) return;

    setSubmitting(true);
    try {
      const res = await adminAPI.createUser(formData);
      if (res && res.success) {
        setSuccessMsg(`User ${res.user.name} registered with role ${res.user.role}!`);
        if (onUserCreated) {
          onUserCreated(res.user);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setGlobalError(err.response?.data?.message || err.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121318] text-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#282A36] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-[#1E2028] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">Provision User Account</h3>
              <p className="text-[11px] text-slate-400">Admin Security Provisioning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#1A1C24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {globalError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Selection Pills */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Assign Platform Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'NORMAL_USER', label: 'Normal User' },
                { id: 'STORE_OWNER', label: 'Store Owner' },
                { id: 'ADMIN', label: 'System Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleChange('role', r.id)}
                  className={`py-2 px-3 rounded-2xl text-xs font-extrabold border transition-all text-center ${
                    formData.role === r.id
                      ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : 'bg-[#181920] text-slate-400 border-[#282A36] hover:bg-[#1E202A] hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Full Legal Name (20 to 60 chars) *
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
              placeholder="e.g. Rajesh Sharma (Store Owner)"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all bg-[#181920] text-white ${
                errors.name
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="user@example.com"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all bg-[#181920] text-white ${
                errors.email
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Initial Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="8-16 chars (1 Upper, 1 Spec)"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all bg-[#181920] text-white ${
                  errors.password
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Address (Max 400 chars) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {formData.address.trim().length}/400
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 500 Park Avenue, Upper East Side, New York, NY 10022"
              className={`w-full px-4 py-2 rounded-2xl border text-xs resize-none outline-none transition-all bg-[#181920] text-white ${
                errors.address
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
              }`}
            />
            {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1E2028]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1A1C24] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {submitting ? 'Creating User...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
