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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4DFF]/10 text-[#5B4DFF] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Grocery Store</h3>
              <p className="text-[11px] text-slate-400">Expand MartPulse Certified Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {globalError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Store Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Store Name (20 to 60 chars) *
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
              placeholder="e.g. The Obsidian Grand Hypermarket & Emporium"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Store Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Official Store Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@storename.com"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 outline-none"
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Store Owner Name
            </label>
            <input
              type="text"
              list="owners-list"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder="Type Store Owner Name (e.g. Rajesh Sharma or Alexander Sterling)"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10"
            />
            {owners && owners.length > 0 && (
              <datalist id="owners-list">
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.name} />
                ))}
              </datalist>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Enter the name of the store owner / retailer managing this mart
            </p>
          </div>

          {/* Physical Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Physical Address (Max 400 chars) *
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {formData.address.trim().length}/400
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 1000 Luxury Boulevard, Golden Plaza, Downtown District, New York, NY 10001"
              className={`w-full px-4 py-2.5 rounded-2xl border text-xs resize-none outline-none transition-all ${
                errors.address
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10'
              }`}
            />
            {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white text-xs font-bold shadow-[0_4px_12px_rgba(91,77,255,0.25)] transition-all disabled:opacity-50"
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
