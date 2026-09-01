import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import { X, UserPlus, Sparkles, CheckCircle2, AlertCircle, User, Mail, Lock, MapPin, Shield } from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER',
  });

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

    const addressVal = validateAddress(formData.address);
    if (!addressVal.isValid) {
      newErrors.address = addressVal.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccessMsg('');

    if (!validateAll()) {
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-backdrop-animate">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden modal-content-animate">
        {/* Obsidian Header */}
        <div className="bg-[#09090B] px-6 py-5 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Create New User Account</h3>
              <p className="text-xs text-zinc-400">Provision roles for Admin, Store Owner, or User</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {globalError && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              Account Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'NORMAL_USER', label: 'Normal User' },
                { id: 'STORE_OWNER', label: 'Store Owner' },
                { id: 'ADMIN', label: 'Administrator' },
              ].map((roleOption) => (
                <button
                  key={roleOption.id}
                  type="button"
                  onClick={() => handleChange('role', roleOption.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formData.role === roleOption.id
                      ? 'bg-zinc-900 text-amber-400 border-amber-500 shadow-sm'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {roleOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name (20 to 60 characters) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Full Legal Name *
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
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Rajesh Sharma (Store Owner)"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                  : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="user@martpulse.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                  : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
              }`}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Temporary Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              Initial Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="8-16 chars, 1 uppercase, 1 special (e.g. Pulse@2025)"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                  : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
              }`}
            />
            {errors.password ? (
              <p className="text-xs text-rose-600 mt-1">{errors.password}</p>
            ) : (
              <p className="text-[11px] text-zinc-500 mt-1">
                8–16 characters with uppercase and special character.
              </p>
            )}
          </div>

          {/* Address (Max 400 characters) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                Physical Address *
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
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace, North Boulevard, Springfield, OR 97477"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-none focus:ring-2 ${
                errors.address
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20'
                  : 'border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20'
              }`}
            />
            {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-zinc-950 font-semibold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50"
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
