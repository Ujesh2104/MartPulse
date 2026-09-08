import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Users,
  Building2,
  RefreshCw,
  Search,
  MessageSquare,
  TrendingUp,
  Award,
  Filter,
  Sparkles,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState('all');
  const [searchFeedback, setSearchFeedback] = useState('');

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const res = await ownerAPI.getOwnerDashboard();
      if (res && res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const store = dashboardData?.store;
  const ratingStats = dashboardData?.ratingStats;
  const reviews = dashboardData?.reviews || [];

  const filteredReviews = reviews.filter((r) => {
    const matchesStar = starFilter === 'all' || r.rating === parseInt(starFilter);
    const matchesSearch =
      !searchFeedback ||
      (r.userName && r.userName.toLowerCase().includes(searchFeedback.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(searchFeedback.toLowerCase()));
    return matchesStar && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#121318] rounded-3xl p-6 sm:p-8 border border-[#1E2028] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Store Owner Console
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                {store?.name || 'Your Retail Mart'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {store?.address} • Category: <strong className="text-[#CCFF00]">{store?.category}</strong>
              </p>
            </div>

            <button
              onClick={fetchOwnerData}
              className="px-4 py-2.5 rounded-2xl bg-[#1A1C24] hover:bg-[#252834] text-slate-300 hover:text-[#CCFF00] border border-[#2A2C38] transition-all flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95"
              title="Refresh Ratings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#CCFF00]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </AnimatedSection>

        {/* 2 Main Overview Cards: Average Score + Star Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Average Rating Card */}
          <AnimatedSection animation="fade-up" delay={100} className="h-full">
            <div className="bg-[#121318] rounded-3xl p-6 sm:p-7 border border-[#1E2028] shadow-lg space-y-4 flex flex-col justify-between h-full hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Average Customer Score
              </span>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-white font-mono">
                    {parseFloat(ratingStats?.averageRating || store?.rating || 0).toFixed(1)}
                  </span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(ratingStats?.averageRating || store?.rating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Based on <strong className="text-white font-mono">{ratingStats?.totalRatings || reviews.length}</strong> authenticated shopper reviews
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-xs text-[#CCFF00] font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
                <span>Verified Mart Performance</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Star Distribution Curve */}
          <AnimatedSection animation="fade-up" delay={200} className="md:col-span-2 h-full">
            <div className="bg-[#121318] rounded-3xl p-6 sm:p-7 border border-[#1E2028] shadow-lg space-y-4 h-full hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Star Rating Breakdown
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {reviews.length} Total Submissions
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingStats?.distribution?.[star] || 0;
                  const total = ratingStats?.totalRatings || (reviews.length > 0 ? reviews.length : 1);
                  const percent = Math.round((count / (total || 1)) * 100);

                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-6 font-bold text-slate-300 flex items-center gap-1">
                        <span>{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>

                      <div className="flex-grow h-2.5 bg-[#181920] rounded-full overflow-hidden border border-[#282A36]">
                        <div
                          className="h-full bg-[#CCFF00] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <span className="w-16 text-right font-medium text-slate-400 text-[11px] font-mono">
                        {count} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <AnimatedSection animation="fade-up" delay={250}>
          <div className="bg-[#121318] rounded-3xl border border-[#1E2028] shadow-xl p-6 space-y-5">
            {/* Header + Filter Pill Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2028]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                  <MessageSquare className="w-4 h-4 text-[#CCFF00]" />
                  Customer Ratings & Feedback
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authenticated shoppers who have submitted reviews for your store
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFeedback}
                    onChange={(e) => setSearchFeedback(e.target.value)}
                    placeholder="Filter reviews..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#181920] hover:bg-[#1E202A] text-white text-xs rounded-full border border-[#282A36] focus:border-[#CCFF00] outline-none"
                  />
                </div>

                <select
                  value={starFilter}
                  onChange={(e) => setStarFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#181920] border border-[#282A36] text-slate-300 text-xs rounded-full outline-none focus:border-[#CCFF00]"
                >
                  <option value="all">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Review Cards Grid */}
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs animate-pulse">
                Loading reviews...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">No customer reviews yet.</p>
                <p className="text-[11px] text-slate-500">
                  Shoppers who rate your mart will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((rev, index) => (
                  <AnimatedSection
                    key={rev.id}
                    animation="fade-up"
                    delay={(index % 2) * 100}
                  >
                    <div className="p-5 rounded-2xl bg-[#16171F] border border-[#1E2028] space-y-3 hover:border-[#CCFF00]/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#181920] border border-[#282A36] text-[#CCFF00] font-bold text-xs flex items-center justify-center">
                            {rev.userName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white font-heading">{rev.userName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {rev.createdAt
                                ? new Date(rev.createdAt).toLocaleDateString()
                                : 'Verified Buyer'}
                            </div>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="text-xs text-slate-300 italic bg-[#121318] p-3 rounded-xl border border-[#1E2028]">
                          "{rev.comment}"
                        </p>
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default OwnerDashboard;
