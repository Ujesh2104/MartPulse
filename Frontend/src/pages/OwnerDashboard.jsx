import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import {
  Store,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchReview, setSearchReview] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
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

  const store = dashboardData?.store;
  const stats = dashboardData?.stats;
  const reviews = dashboardData?.reviews || [];

  const filteredReviews = reviews.filter((r) => {
    const q = searchReview.toLowerCase();
    const matchesQuery =
      r.userName.toLowerCase().includes(q) ||
      (r.comment && r.comment.toLowerCase().includes(q));
    const matchesRating = ratingFilter === 'ALL' || r.rating === Number(ratingFilter);
    return matchesQuery && matchesRating;
  });

  const totalReviewsCount = stats?.totalRatings || reviews.length;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Ribbon */}
        <div className="bg-[#09090B] text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Store Owner Management Console</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {store?.name || 'Your Managed Store'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{store?.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOwnerData}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. STORE RATING OVERVIEW & DISTRIBUTION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Card 1: Average Rating Score Card */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between space-y-6 hover-lift">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Store Performance Overview
              </span>
              <h3 className="font-serif text-xl font-bold text-zinc-900 mt-1">
                Average Customer Score
              </h3>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-serif text-6xl font-extrabold text-zinc-900">
                {stats?.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}
              </span>
              <div className="space-y-1">
                <StarRating rating={stats?.averageRating || 0} size="md" />
                <p className="text-xs text-zinc-500 font-medium">
                  Out of 5.0 ({totalReviewsCount} ratings)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                Your store ranks in the <strong>top 10%</strong> of verified retail marts in the region!
              </span>
            </div>
          </div>

          {/* Card 2: Rating Distribution Breakdown */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Rating Breakdown
                </span>
                <h3 className="font-serif text-xl font-bold text-zinc-900 mt-1">
                  Star Distribution
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                {totalReviewsCount} Total Reviews
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats?.ratingDistribution?.[stars] || 0;
                const percentage =
                  totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-16 font-semibold text-zinc-700">
                      <span>{stars}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <div className="flex-1 h-3 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right font-mono text-zinc-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. CUSTOMER REVIEWS TABLE */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-zinc-900">
                  Customer Ratings & Feedback
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                List of authenticated users who have submitted reviews for your store.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchReview}
                  onChange={(e) => setSearchReview(e.target.value)}
                  placeholder="Filter customer reviews..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Shopper Feedback</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                      No customer reviews found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {rev.userName?.charAt(0) || 'U'}
                          </div>
                          <span>{rev.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500 font-mono">
                        {rev.userEmail}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={rev.rating} size="sm" />
                          <span className="text-xs font-bold text-zinc-900">
                            {rev.rating}.0
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-600 max-w-sm">
                        {rev.comment ? (
                          <span className="italic">"{rev.comment}"</span>
                        ) : (
                          <span className="text-zinc-400 italic">No comment provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {rev.createdAt
                              ? new Date(rev.createdAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
