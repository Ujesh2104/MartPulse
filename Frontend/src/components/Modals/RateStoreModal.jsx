import React, { useState, useEffect } from 'react';
import { StarRating } from '../StarRating';
import { ratingAPI } from '../../services/api';
import { validateRating } from '../../utils/validators';
import { X, Sparkles, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const RateStoreModal = ({ isOpen, onClose, store, initialRating = 0, initialComment = '', onRatingSubmitted }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment || '');
    setError('');
    setSuccessMsg('');
  }, [initialRating, initialComment, isOpen]);

  if (!isOpen || !store) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const ratingCheck = validateRating(rating);
    if (!ratingCheck.isValid) {
      setError(ratingCheck.message || 'Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ratingAPI.submitRating({
        storeId: store.id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      if (response && response.success) {
        setSuccessMsg('Thank you! Your rating has been recorded.');
        if (onRatingSubmitted) {
          onRatingSubmitted({
            storeId: store.id,
            rating: Number(rating),
            comment: comment.trim(),
            storeAverage: response.storeAverage,
          });
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

  const getRatingFeedback = (val) => {
    switch (val) {
      case 5:
        return 'Exceptional luxury experience! Highly recommended.';
      case 4:
        return 'Very good quality and great service.';
      case 3:
        return 'Average experience with room for improvement.';
      case 2:
        return 'Below expectations in product or service.';
      case 1:
        return 'Disappointing visit.';
      default:
        return 'Click on the stars above to select your rating';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-backdrop-animate">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden modal-content-animate">
        {/* Obsidian Header */}
        <div className="bg-[#09090B] px-6 py-5 text-white flex items-center justify-between border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif text-lg font-bold text-white">Rate & Review Store</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-sm">{store.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Star Selection Area */}
          <div className="flex flex-col items-center justify-center py-4 px-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Select Your Rating (1 - 5 Stars)
            </span>
            <div className="py-2">
              <StarRating
                rating={rating}
                interactive={true}
                size="xl"
                onChange={(val) => setRating(val)}
              />
            </div>
            <p className="text-xs font-medium text-amber-700 mt-2 text-center h-4">
              {getRatingFeedback(rating)}
            </p>
          </div>

          {/* Review comments */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                Shopper Review / Feedback (Optional)
              </span>
              <span className="text-zinc-400 text-[11px]">{comment.length}/300</span>
            </label>
            <textarea
              rows={3}
              maxLength={300}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience, product freshness, cleanliness, and staff courtesy..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-zinc-950 font-semibold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : initialRating > 0 ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateStoreModal;
