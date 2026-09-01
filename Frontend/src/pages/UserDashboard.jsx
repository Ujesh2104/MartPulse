import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Search,
  MapPin,
  Building2,
  SlidersHorizontal,
  Sparkles,
  Heart,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import RateStoreModal from '../components/Modals/RateStoreModal';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [userRatings, setUserRatings] = useState({});
  const [favorites, setFavorites] = useState({});

  // Rate Modal State
  const [selectedStoreForRating, setSelectedStoreForRating] = useState(null);

  const categories = [
    'All',
    'Gourmet & Hypermarket',
    'Organic & Artisan Grocery',
    'Premium Supermarket',
    'Wine & Specialty Market',
    'Departmental & Provisions',
  ];

  const fetchStoresData = async () => {
    try {
      setLoading(true);
      const res = await storeAPI.getAllStores({
        search: searchQuery,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        sort: sortBy,
      });
      if (res && res.stores) {
        setStores(res.stores);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoresData();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStoresData();
  };

  const toggleFavorite = (storeId) => {
    setFavorites((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  };

  const filteredStores = stores.filter((s) => {
    if (minRatingFilter > 0) {
      return (s.rating || 0) >= minRatingFilter;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F5FA] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#5B4DFF]/10 text-[#5B4DFF] text-xs font-bold">
              🛍️ Shopper Community Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore & Rate Grocery Marts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Welcome back, <strong className="text-slate-800">{user?.name}</strong>! Discover top-rated marts and share your feedback.
            </p>
          </div>

          <button
            onClick={fetchStoresData}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/70 text-slate-600 transition-colors flex items-center gap-2 text-xs font-bold"
            title="Refresh Mart List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Top Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5B4DFF] text-white shadow-[0_4px_14px_rgba(91,77,255,0.3)]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Main Grid: Left Filters + Right Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Search Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Search Marts
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Store name, address..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 text-xs rounded-2xl border border-slate-200 focus:border-[#5B4DFF]/40 focus:ring-2 focus:ring-[#5B4DFF]/10 outline-none transition-all placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Star Rating Filter */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Star Rating
                </span>
                {minRatingFilter > 0 && (
                  <button
                    onClick={() => setMinRatingFilter(0)}
                    className="text-[11px] font-semibold text-[#5B4DFF] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRatingFilter(minRatingFilter === stars ? 0 : stars)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      minRatingFilter === stars
                        ? 'bg-[#5B4DFF]/10 text-[#5B4DFF] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-500 font-semibold">{stars} Stars & up</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        minRatingFilter === stars
                          ? 'bg-[#5B4DFF] border-[#5B4DFF] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {minRatingFilter === stars && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sort Marts
              </span>
              <div className="space-y-1">
                {[
                  { label: 'Highest Rated First', val: 'rating_desc' },
                  { label: 'Lowest Rated First', val: 'rating_asc' },
                  { label: 'Name (A to Z)', val: 'name_asc' },
                  { label: 'Name (Z to A)', val: 'name_desc' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSortBy(s.val)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      sortBy === s.val
                        ? 'bg-[#5B4DFF] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Store Card Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-800">
                Displaying <span className="text-[#5B4DFF]">{filteredStores.length}</span> Marts
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white h-72 rounded-3xl border border-slate-200/80 animate-pulse p-5 space-y-4"
                  >
                    <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
                    <div className="w-full h-28 bg-slate-100 rounded-2xl"></div>
                    <div className="w-3/4 h-4 bg-slate-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No stores found</h3>
                <p className="text-xs text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="group bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1"
                  >
                    {/* Top Row: Category + Heart */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#5B4DFF]/10 text-[#5B4DFF]">
                        {store.category || 'Supermarket'}
                      </span>
                      <button
                        onClick={() => toggleFavorite(store.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                          favorites[store.id]
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites[store.id] ? 'fill-rose-500' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Middle Graphic / Visual */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 mb-4 flex items-center justify-center h-32 border border-slate-100">
                      <Building2 className="w-12 h-12 text-[#5B4DFF]/40 group-hover:scale-110 group-hover:text-[#5B4DFF] transition-all duration-300" />
                      
                      {/* Overall Average Rating Score */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white shadow-sm border border-slate-200/80 text-xs font-extrabold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{parseFloat(store.rating || 0).toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Store Title & Address */}
                    <div className="space-y-1.5 mb-4 flex-grow">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#5B4DFF] transition-colors line-clamp-1">
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-start gap-1 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                    </div>

                    {/* Bottom Action Pill Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 font-semibold">
                        {store.userRating ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Your: {store.userRating}★
                          </span>
                        ) : (
                          <span>{store.ratingCount || 0} ratings</span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedStoreForRating(store)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          store.userRating
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            : 'bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white shadow-[0_4px_10px_rgba(91,77,255,0.25)]'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{store.userRating ? 'Edit Rating' : 'Rate Mart'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Store Modal */}
      {selectedStoreForRating && (
        <RateStoreModal
          isOpen={!!selectedStoreForRating}
          onClose={() => setSelectedStoreForRating(null)}
          store={selectedStoreForRating}
          currentRating={selectedStoreForRating.userRating || 0}
          onRatingSubmitted={() => {
            fetchStoresData();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
