import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { validateName, validateEmail, validateAddress } from '../../utils/validators';
import { X, Store, CheckCircle2, AlertCircle, Building2, Mail, MapPin, Sparkles } from 'lucide-react';

export const AddStoreModal = ({ isOpen, onClose, onStoreCreated, owners = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    category: 'Gourmet & Hypermarket',
    ownerName: '',
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
    if (!nameVal.isValid) newErrors.name = nameVal.message;

    const emailVal = validateEmail(formData.email);
    if (!emailVal.isValid) newErrors.email = emailVal.message;

    const addressVal = validateAddress(formData.address);
    if (!addressVal.isValid) newErrors.address = addressVal.message;

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
      const res = await adminAPI.createStore(formData);

      if (res && res.success) {
        setSuccessMsg('Store registered successfully in MartPulse catalog!');
        if (onStoreCreated) {
          onStoreCreated(res.store);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setGlobalError(err.response?.data?.message || err.message || 'Failed to register store.');
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
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">Add New Grocery Store</h3>
              <p className="text-[11px] text-slate-400">Expand MartPulse Certified Network</p>
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

          {/* Store Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Store Name (20 to 60 chars) *
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
              placeholder="e.g. The Obsidian Grand Hypermarket & Emporium"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all bg-[#181920] text-white ${
                errors.name
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Store Email */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Official Store Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@storename.com"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all bg-[#181920] text-white ${
                errors.email
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#282A36] bg-[#181920] text-xs text-white outline-none focus:border-[#CCFF00]"
            >
              <option value="Gourmet & Hypermarket">Gourmet & Hypermarket</option>
              <option value="Organic & Artisan Grocery">Organic & Artisan Grocery</option>
              <option value="Premium Supermarket">Premium Supermarket</option>
              <option value="Wine & Specialty Market">Wine & Specialty Market</option>
              <option value="Departmental & Provisions">Departmental & Provisions</option>
            </select>
          </div>

          {/* Store Owner Name Direct Input */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Store Owner Name
            </label>
            <input
              type="text"
              list="owners-list"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder="Type Store Owner Name (e.g. Rajesh Sharma or Alexander Sterling)"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#282A36] bg-[#181920] text-xs text-white outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30"
            />
            {owners && owners.length > 0 && (
              <datalist id="owners-list">
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.name} />
                ))}
              </datalist>
            )}
            <p className="text-[10px] text-slate-500 mt-1">
              Enter the name of the store owner / retailer managing this mart
            </p>
          </div>

          {/* Physical Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Physical Address (Max 400 chars) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {formData.address.trim().length}/400
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 1000 Luxury Boulevard, Golden Plaza, Downtown District, New York, NY 10001"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs resize-none outline-none transition-all bg-[#181920] text-white ${
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
              {submitting ? 'Registering...' : 'Register Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
