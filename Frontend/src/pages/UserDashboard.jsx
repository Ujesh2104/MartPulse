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
  Award,
} from 'lucide-react';
import RateStoreModal from '../components/Modals/RateStoreModal';
import AnimatedSection from '../components/AnimatedSection';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('rating_desc');
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
    <div className="min-h-screen bg-[#0A0B0E] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#121318] rounded-3xl p-6 sm:p-8 border border-[#1E2028] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Shopper Community Hub
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Explore & Rate Grocery Marts
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Welcome back, <strong className="text-white">{user?.name}</strong>! Discover certified premium marts and submit verified reviews.
              </p>
            </div>

            <button
              onClick={fetchStoresData}
              className="px-4 py-2.5 rounded-2xl bg-[#1A1C24] hover:bg-[#252834] text-slate-300 hover:text-[#CCFF00] border border-[#2A2C38] transition-all flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95"
              title="Refresh Mart List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#CCFF00]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Top Category Pill Bar */}
        <AnimatedSection animation="fade-up" delay={100} className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] font-extrabold scale-105'
                  : 'bg-[#121318] text-slate-400 hover:text-white hover:bg-[#1A1C24] border border-[#1E2028]'
              }`}
            >
              {cat === 'All' ? 'All Marts' : cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Main Grid: Left Filters + Right Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Filter Sidebar */}
          <AnimatedSection animation="fade-up" delay={150} className="lg:col-span-1 space-y-5">
            {/* Search Box */}
            <div className="bg-[#121318] p-5 rounded-3xl border border-[#1E2028] space-y-3 shadow-lg">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Search Marts
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Store name, address..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#181920] hover:bg-[#1E202A] focus:bg-[#181920] text-white text-xs rounded-2xl border border-[#282A36] focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all placeholder:text-slate-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Star Rating Filter */}
            <div className="bg-[#121318] p-5 rounded-3xl border border-[#1E2028] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Star Rating
                </span>
                {minRatingFilter > 0 && (
                  <button
                    onClick={() => setMinRatingFilter(0)}
                    className="text-[11px] font-bold text-[#CCFF00] hover:underline"
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      minRatingFilter === stars
                        ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-[#181920]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-300 font-medium">{stars} Stars & up</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        minRatingFilter === stars
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {minRatingFilter === stars && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-[#121318] p-5 rounded-3xl border border-[#1E2028] space-y-3 shadow-lg">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      sortBy === s.val
                        ? 'bg-[#CCFF00] text-black font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-[#181920]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Store Card Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-300">
                Displaying <span className="text-[#CCFF00] font-mono">{filteredStores.length}</span> Marts
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-[#121318] h-72 rounded-3xl border border-[#1E2028] animate-pulse p-5 space-y-4"
                  >
                    <div className="w-16 h-5 bg-[#1E2028] rounded-full"></div>
                    <div className="w-full h-28 bg-[#181920] rounded-2xl"></div>
                    <div className="w-3/4 h-4 bg-[#1E2028] rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length === 0 ? (
              <AnimatedSection animation="scale" className="bg-[#121318] rounded-3xl border border-[#1E2028] p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No stores found</h3>
                <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
              </AnimatedSection>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStores.map((store, index) => (
                  <AnimatedSection
                    key={store.id}
                    animation="fade-up"
                    delay={(index % 3) * 100}
                    className="h-full"
                  >
                    <div className="group bg-[#121318] rounded-3xl border border-[#1E2028] hover:border-[#CCFF00]/40 p-5 shadow-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.12)] transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1.5 h-full">
                      {/* Top Row: Category badge + Heart */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#CCFF00] text-black shadow-xs">
                          {store.category?.split(' ')[0] || 'Supermarket'}
                        </span>
                        <button
                          onClick={() => toggleFavorite(store.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                            favorites[store.id]
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : 'bg-[#181920] border-[#2A2C38] text-slate-500 hover:text-rose-400 hover:border-rose-500/30'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites[store.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Middle Graphic / Visual */}
                      <div className="relative rounded-2xl bg-[#0D0E12] p-4 mb-4 flex items-center justify-center h-32 border border-[#1E2028] overflow-hidden group-hover:border-[#CCFF00]/20 transition-colors">
                        <Building2 className="w-12 h-12 text-slate-600 group-hover:scale-110 group-hover:text-[#CCFF00] transition-all duration-300" />
                        
                        {/* Rating Score */}
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181920] border border-[#2A2C38] text-xs font-extrabold text-white">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-mono">{parseFloat(store.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Store Title & Address */}
                      <div className="space-y-1.5 mb-4 flex-grow">
                        <h3 className="text-sm font-bold text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1 font-heading">
                          {store.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-start gap-1 line-clamp-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                          <span>{store.address}</span>
                        </p>
                      </div>

                      {/* Bottom Action Pill Button */}
                      <div className="pt-3 border-t border-[#1E2028] flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-400 font-semibold">
                          {store.userRating ? (
                            <span className="text-[#CCFF00] flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Your: {store.userRating}★
                            </span>
                          ) : (
                            <span className="text-slate-500">{store.ratingCount || 0} reviews</span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedStoreForRating(store)}
                          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                            store.userRating
                              ? 'bg-[#181920] hover:bg-[#252834] text-[#CCFF00] border border-[#CCFF00]/40 shadow-xs'
                              : 'bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:scale-105'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{store.userRating ? 'Edit Rating' : 'Rate Mart'}</span>
                        </button>
                      </div>
                    </div>
                  </AnimatedSection>
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
