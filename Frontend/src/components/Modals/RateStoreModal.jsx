import React, { useState } from 'react';
import { ratingAPI } from '../../services/api';
import { Star, X, Sparkles, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export const RateStoreModal = ({
  isOpen,
  onClose,
  store,
  currentRating = 0,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !store) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ratingAPI.submitRating({
        storeId: store.id,
        rating,
        comment: comment.trim(),
      });

      if (res && res.success) {
        setSuccess('Your rating has been recorded successfully!');
        if (onRatingSubmitted) {
          onRatingSubmitted(res);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = {
    1: 'Poor / Inadequate',
    2: 'Fair / Needs Improvement',
    3: 'Average / Standard',
    4: 'Very Good / High Quality',
    5: 'Exceptional / Superb',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121318] text-white w-full max-w-md rounded-3xl shadow-2xl border border-[#282A36] overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1E2028] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-[#CCFF00]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                {currentRating ? 'Modify Store Rating' : 'Rate Grocery Mart'}
              </h3>
              <p className="text-[11px] text-slate-400">Authentic Shopper Feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#1A1C24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Store Info Banner */}
          <div className="p-4 rounded-2xl bg-[#181920] border border-[#282A36] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E202A] text-[#CCFF00] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-heading">{store.name}</h4>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{store.address}</p>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="space-y-2 text-center py-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Your Rating (1 to 5 Stars)
            </label>

            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {(hoverRating || rating) > 0 && (
              <p className="text-xs font-bold text-[#CCFF00] animate-fade-in">
                {ratingLabels[hoverRating || rating]}
              </p>
            )}
          </div>

          {/* Comment Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Feedback & Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about store hygiene, product freshness, or customer service..."
              rows={3}
              className="w-full p-3.5 bg-[#181920] border border-[#282A36] text-white text-xs rounded-2xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-[#1A1C24] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Recording...' : currentRating ? 'Update Rating' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateStoreModal;
