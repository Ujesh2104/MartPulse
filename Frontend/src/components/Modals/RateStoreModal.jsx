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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4DFF]/10 text-[#5B4DFF] flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-[#5B4DFF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentRating ? 'Modify Store Rating' : 'Rate Grocery Mart'}
              </h3>
              <p className="text-[11px] text-slate-400">Authentic Shopper Feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Store Name Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
              <Building2 className="w-5 h-5 text-[#5B4DFF]" />
            </div>
            <div className="flex-grow">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{store.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">{store.address}</p>
            </div>
          </div>

          {/* Interactive Star Selection */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Score (1 to 5 Stars)
            </label>

            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-slate-200 hover:text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-bold text-slate-700 h-5">
              {(hoverRating || rating) > 0 ? (
                <span>
                  {hoverRating || rating} Star{(hoverRating || rating) > 1 ? 's' : ''} —{' '}
                  <span className="text-[#5B4DFF]">{ratingLabels[hoverRating || rating]}</span>
                </span>
              ) : (
                <span className="text-slate-400 font-normal">Click a star to grade this store</span>
              )}
            </p>
          </div>

          {/* Optional Feedback */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Review & Experience Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe produce freshness, checkout speed, staff helpfulness..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#5B4DFF]/50 focus:ring-2 focus:ring-[#5B4DFF]/10 text-xs text-slate-800 outline-none resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-6 py-2 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white text-xs font-bold shadow-[0_4px_12px_rgba(91,77,255,0.25)] transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateStoreModal;
