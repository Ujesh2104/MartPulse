import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import RateStoreModal from '../components/Modals/RateStoreModal';
import {
  Search,
  Star,
  Sparkles,
  MapPin,
  Building2,
  Filter,
  CheckCircle2,
  Heart,
  LayoutGrid,
  List,
  RefreshCw,
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeModalStore, setActiveModalStore] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [storesRes, ratingsRes] = await Promise.all([
        storeAPI.getAllStores(),
        ratingAPI.getUserRatings(),
      ]);

      if (storesRes && storesRes.stores) {
        setStores(storesRes.stores);
      }

      if (ratingsRes && ratingsRes.ratings) {
        const ratingMap = {};
        ratingsRes.ratings.forEach((r) => {
          ratingMap[r.storeId] = {
            rating: r.rating,
            comment: r.comment,
            ratingId: r.id,
          };
        });
        setUserRatings(ratingMap);
      }
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'Gourmet & Hypermarket', 'Organic & Artisan Grocery', 'Premium Supermarket', 'Wine & Specialty Market'];

  const filteredStores = stores.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRateModal = (store) => {
    setActiveModalStore(store);
  };

  const handleRatingSaved = ({ storeId, rating, comment, storeAverage }) => {
    setUserRatings((prev) => ({
      ...prev,
      [storeId]: { rating, comment },
    }));

    // Update store average in local state
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, averageRating: storeAverage } : s))
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#09090B] text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shopper Experience Hub</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Explore stores around you, submit your authentic shopper ratings, and help others find the best marts.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/80 px-5 py-3.5 rounded-2xl border border-zinc-800">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Your Reviews
              </span>
              <span className="font-serif text-2xl font-bold text-amber-400">
                {Object.keys(userRatings).length} Stores Rated
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, address, city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-amber-400'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 border border-zinc-200 rounded-xl p-1 bg-zinc-50 ml-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'table' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* STORE DISPLAY */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 animate-pulse">
                <div className="h-36 bg-zinc-200 rounded-xl"></div>
                <div className="h-5 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-zinc-800">No Stores Found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your search keywords or removing filters.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => {
              const myRatingInfo = userRatings[store.id];
              const hasRated = !!myRatingInfo;

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-zinc-200 hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden hover-lift animate-scale-in"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {store.category || 'General Mart'}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-zinc-900 mt-2 line-clamp-1">
                          {store.name}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg text-white text-xs font-bold">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{store.averageRating ? store.averageRating.toFixed(1) : 'New'}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                          {store.totalRatings || 0} ratings
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 flex items-start gap-1.5 line-clamp-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </p>

                    {/* User's Rating Banner */}
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                          Your Submitted Rating
                        </span>
                        {hasRated ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StarRating rating={myRatingInfo.rating} size="sm" />
                            <span className="text-xs font-bold text-zinc-900">
                              {myRatingInfo.rating} / 5
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Not rated yet</span>
                        )}
                      </div>

                      {hasRated && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Rated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-4 bg-zinc-50/50 border-t border-zinc-100">
                    <button
                      onClick={() => handleOpenRateModal(store)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        hasRated
                          ? 'bg-zinc-900 text-amber-400 hover:bg-zinc-800'
                          : 'bg-gold-gradient text-zinc-950 shadow-gold-glow hover:shadow-gold-glow-lg'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{hasRated ? 'Modify My Rating' : 'Submit Rating'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-700">
                <thead className="bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4">Store Name</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Community Rating</th>
                    <th className="px-6 py-4">Your Rating</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredStores.map((store) => {
                    const myRatingInfo = userRatings[store.id];
                    const hasRated = !!myRatingInfo;

                    return (
                      <tr key={store.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-zinc-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-amber-400 flex-shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">{store.name}</p>
                              <span className="text-[11px] text-zinc-400 font-normal">
                                {store.category || 'General Mart'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-600 max-w-xs truncate">
                          {store.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StarRating rating={store.averageRating || 0} size="sm" />
                            <span className="text-xs font-bold text-zinc-900">
                              {store.averageRating ? store.averageRating.toFixed(1) : '0.0'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {hasRated ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{myRatingInfo.rating} / 5</span>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400 italic">Not rated</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenRateModal(store)}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-amber-500 text-zinc-100 hover:text-zinc-950 font-semibold text-xs transition-all"
                          >
                            {hasRated ? 'Modify' : 'Rate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 1-5 Star Interactive Rating Modal */}
      {activeModalStore && (
        <RateStoreModal
          isOpen={!!activeModalStore}
          onClose={() => setActiveModalStore(null)}
          store={activeModalStore}
          initialRating={userRatings[activeModalStore.id]?.rating || 0}
          initialComment={userRatings[activeModalStore.id]?.comment || ''}
          onRatingSubmitted={handleRatingSaved}
        />
      )}
    </div>
  );
};

export default UserDashboard;
