import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Search,
  MapPin,
  Building2,
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import RateStoreModal from '../components/Modals/RateStoreModal';
import MartPulseLogo from '../components/MartPulseLogo';

export const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [favorites, setFavorites] = useState({});

  // Rating Modal
  const [ratingStore, setRatingStore] = useState(null);

  const categories = [
    'All',
    'Gourmet & Hypermarket',
    'Organic & Artisan Grocery',
    'Premium Supermarket',
    'Wine & Specialty Market',
    'Departmental & Provisions',
  ];

  const fetchStores = async () => {
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
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const toggleFavorite = (storeId) => {
    setFavorites((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  };

  const handleRateClick = (store) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRatingStore(store);
  };

  const filteredStores = stores.filter((s) => {
    if (minRatingFilter > 0) {
      return (s.rating || 0) >= minRatingFilter;
    }
    return true;
  });

  const scrollToCatalog = () => {
    const el = document.getElementById('marts-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5FA] space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION (Clean Lavender Theme with Floating Badges & Animations) */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background soft glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-[#5B4DFF]/8 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 animate-fade-in-up">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-bold text-[#5B4DFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Grocery & Retail Rating Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover & Rate the Finest <br />
            <span className="text-[#5B4DFF]">Grocery Stores</span> Near You
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MartPulse empowers shoppers with verified, transparent ratings for local supermarkets,
            gourmet delis, and artisan markets. Browse honest community feedback or share your own experience.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToCatalog}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(91,77,255,0.35)] hover:shadow-[0_6px_20px_rgba(91,77,255,0.45)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>Explore All Marts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to={isAuthenticated ? '/user/dashboard' : '/register'}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{isAuthenticated ? 'Open Dashboard' : 'Rate a Mart (Free)'}</span>
            </Link>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="pt-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-2xs">
              <div className="text-base sm:text-xl font-extrabold text-slate-900">4.9 ★</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Avg Verified Score</div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-2xs">
              <div className="text-base sm:text-xl font-extrabold text-slate-900">100%</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Authentic Feedback</div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-2xs">
              <div className="text-base sm:text-xl font-extrabold text-slate-900">3 Roles</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Dedicated Portals</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (3 Clean White Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B4DFF]">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How MartPulse Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-[#5B4DFF]/10 text-[#5B4DFF] flex items-center justify-center font-extrabold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Explore Nearby Marts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search by mart name, address, or category. View average star ratings and authentic customer review streams.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Grade with 1-5 Stars</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rate produce freshness, staff courtesy, and checkout speed. Modify your rating anytime as services evolve.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Empower Local Retailers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Store owners receive dedicated analytics consoles with review curves to continuously refine their supermarket aisles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LIVE INTERACTIVE MARTS CATALOG (Matching Reference Image Grid) */}
      <section id="marts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B4DFF]">
              Live Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Retail Marts Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time community database updated via MySQL & Sequelize
          </p>
        </div>

        {/* Top Category Filter Pill Bar (Matching Reference Image) */}
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

        {/* Main Grid: Left Sidebar Filters + Right Store Card Grid */}
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
                  placeholder="Store name, street..."
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

          {/* Right Store Card Grid (Matching Reference Image Grid) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-800">
                Showing <span className="text-[#5B4DFF]">{filteredStores.length}</span> Verified Marts
              </h3>
              <span className="text-xs text-slate-400">
                Category: <strong className="text-slate-700">{selectedCategory}</strong>
              </span>
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
                <p className="text-xs text-slate-500">
                  Try adjusting your search query or choosing another category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="group bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1"
                  >
                    {/* Top Row: Category + Heart Favorite */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#5B4DFF]/10 text-[#5B4DFF]">
                        {store.category || 'Supermarket'}
                      </span>
                      <button
                        onClick={() => toggleFavorite(store.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                          favorites[store.id]
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites[store.id] ? 'fill-rose-500' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Middle Graphic */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 mb-4 flex items-center justify-center h-32 border border-slate-100">
                      <Building2 className="w-12 h-12 text-[#5B4DFF]/40 group-hover:scale-110 group-hover:text-[#5B4DFF] transition-all duration-300" />
                      
                      {/* Rating Score Badge */}
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
                      <div className="text-[11px] text-slate-400 font-medium">
                        {store.ratingCount || 0} reviews
                      </div>

                      <button
                        onClick={() => handleRateClick(store)}
                        className="px-4 py-2 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white text-xs font-bold shadow-[0_4px_10px_rgba(91,77,255,0.25)] hover:shadow-[0_6px_14px_rgba(91,77,255,0.35)] transition-all flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>{store.userRating ? `Rated: ${store.userRating}★` : 'Rate Mart'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm text-center space-y-5 relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5B4DFF]/10 text-[#5B4DFF] mb-1">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Rate Your Favorite Grocery Marts?
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Join thousands of smart shoppers rating supermarket aisles, artisan bakeries, and gourmet delis across the region.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white font-bold text-xs shadow-[0_4px_16px_rgba(91,77,255,0.35)] transition-all"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Rating Modal */}
      {ratingStore && (
        <RateStoreModal
          isOpen={!!ratingStore}
          onClose={() => setRatingStore(null)}
          store={ratingStore}
          currentRating={ratingStore.userRating || 0}
          onRatingSubmitted={() => {
            fetchStores();
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
