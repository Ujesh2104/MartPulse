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
  ChevronUp,
  Layers,
  ShoppingBag,
  X,
  Store as StoreIcon,
  Tag,
  Coffee,
  ShoppingBasket,
  Wine,
  Apple,
} from 'lucide-react';
import RateStoreModal from '../components/Modals/RateStoreModal';
import AnimatedSection from '../components/AnimatedSection';

export const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All items');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [favorites, setFavorites] = useState({});
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  // Rating Modal
  const [ratingStore, setRatingStore] = useState(null);

  const navCategories = [
    'All items',
    'Luxury Supermarket',
    'Organic Grocery',
    'Gourmet Deli',
    'Modern Mart',
  ];

  const allAvailableCategories = [
    'Luxury Supermarket',
    'Organic Grocery',
    'Gourmet Deli',
    'Modern Mart',
    'Wine & Specialty Market',
    'Departmental & Provisions',
  ];

  const fetchStores = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory === 'All items' ? '' : selectedCategory;
      const res = await storeAPI.getAllStores({
        search: searchQuery,
        category: categoryParam,
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

  const handleCategoryCheckbox = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const resetAllFilters = () => {
    setSelectedCategory('All items');
    setSelectedCategories([]);
    setMinRatingFilter(0);
    setSearchQuery('');
    setCategorySearch('');
    setSortBy('rating_desc');
  };

  // Filter stores locally based on sidebar selections
  const filteredStores = stores.filter((s) => {
    if (minRatingFilter > 0 && (s.rating || 0) < minRatingFilter) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(s.category)) {
      return false;
    }
    return true;
  });

  const getStoreVectorIcon = (category) => {
    const cat = String(category).toLowerCase();
    if (cat.includes('luxury') || cat.includes('supermarket')) {
      return <ShoppingBasket className="w-10 h-10 text-[#CCFF00] group-hover:scale-110 transition-transform duration-300" />;
    }
    if (cat.includes('organic') || cat.includes('artisan')) {
      return <Apple className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />;
    }
    if (cat.includes('gourmet') || cat.includes('deli')) {
      return <Coffee className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
    }
    if (cat.includes('wine')) {
      return <Wine className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform duration-300" />;
    }
    return <StoreIcon className="w-10 h-10 text-[#CCFF00] group-hover:scale-110 transition-transform duration-300" />;
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 space-y-8 pb-20 selection:bg-[#CCFF00] selection:text-black">
      {/* 1. TOP BREADCRUMB & TECH HEADER SECTION (MATCHING IMAGE 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>·</span>
            <span className="text-zinc-300">Bestsellers & Verified Marts</span>
          </div>

          {/* Large Headline & Category Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-[#1A1B22]">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-tech">
                Bestsellers
              </h1>
            </div>

            {/* Category Nav Tabs Matching Image 2 */}
            <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none">
              {navCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all relative py-1.5 ${
                    selectedCategory === cat
                      ? 'text-[#CCFF00] font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort Dropdown Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 bg-[#14151B] hover:bg-[#1A1B22] text-xs font-bold text-white rounded-xl border border-[#262833] focus:border-[#CCFF00]/50 outline-none cursor-pointer transition-all"
                >
                  <option value="rating_desc">⚡ Top rated</option>
                  <option value="rating_asc">★ Lowest rated</option>
                  <option value="name_asc">A → Z Alphabetical</option>
                  <option value="name_desc">Z → A Alphabetical</option>
                </select>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#CCFF00] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN STORE DISCOVERY GRID & SIDEBAR FILTERS (EXACT IMAGE 2 LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR FILTERS MATRIX */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Active Filter Chips & Reset */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-zinc-400 hover:text-[#CCFF00] flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'All items' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16171E] border border-[#2A2B36] text-[11px] font-semibold text-white">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All items')} className="text-zinc-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategories.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16171E] border border-[#2A2B36] text-[11px] font-semibold text-white">
                    {c}
                    <button onClick={() => handleCategoryCheckbox(c)} className="text-zinc-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {minRatingFilter > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16171E] border border-[#2A2B36] text-[11px] font-semibold text-[#CCFF00]">
                    ★ {minRatingFilter}+ Stars
                    <button onClick={() => setMinRatingFilter(0)} className="text-zinc-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="bg-[#121318] p-4 rounded-2xl border border-[#1F2029] space-y-3">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                Search Marts
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Store name, street..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0C0D11] text-zinc-100 text-xs rounded-xl border border-[#23242E] focus:border-[#CCFF00]/50 outline-none transition-all placeholder:text-zinc-600"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Category / Type Filter Accordion */}
            <div className="bg-[#121318] p-4 rounded-2xl border border-[#1F2029] space-y-3">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider"
              >
                <span>Category / Type</span>
                {categoryOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>

              {categoryOpen && (
                <div className="space-y-2.5 pt-1">
                  {/* Category search inside filter */}
                  <div className="relative">
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Filter categories..."
                      className="w-full pl-7 pr-2 py-1.5 bg-[#0C0D11] text-zinc-300 text-[11px] rounded-lg border border-[#20212A] focus:border-[#CCFF00]/40 outline-none placeholder:text-zinc-600"
                    />
                    <Search className="w-3 h-3 text-zinc-600 absolute left-2 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {allAvailableCategories
                      .filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase()))
                      .map((cat) => {
                        const isChecked = selectedCategories.includes(cat);
                        return (
                          <label
                            key={cat}
                            onClick={() => handleCategoryCheckbox(cat)}
                            className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none py-1 group"
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                isChecked
                                  ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-[0_0_8px_rgba(204,255,0,0.4)]'
                                  : 'border-[#2D2F3C] bg-[#0C0D11] group-hover:border-zinc-500'
                              }`}
                            >
                              {isChecked && <span className="text-[10px] leading-none">✓</span>}
                            </div>
                            <span className="text-xs font-medium">{cat}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Star Rating Accordion */}
            <div className="bg-[#121318] p-4 rounded-2xl border border-[#1F2029] space-y-3">
              <button
                onClick={() => setRatingOpen(!ratingOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider"
              >
                <span>Minimum Rating</span>
                {ratingOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>

              {ratingOpen && (
                <div className="space-y-1.5 pt-1">
                  {[5, 4, 3, 2].map((stars) => {
                    const isSelected = minRatingFilter === stars;
                    return (
                      <button
                        key={stars}
                        onClick={() => setMinRatingFilter(isSelected ? 0 : stars)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#1C1E26] border border-[#CCFF00]/40 text-white font-bold'
                            : 'text-zinc-400 hover:bg-[#16171E] hover:text-zinc-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < stars ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-zinc-300 font-bold ml-1">{stars}★ & up</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold'
                              : 'border-[#2D2F3C] bg-[#0C0D11]'
                          }`}
                        >
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PRODUCT / STORE CARDS GRID (MATCHING IMAGE 2 EXACT TILE STYLE) */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-zinc-400 font-medium">
                Showing <strong className="text-white font-extrabold text-sm">{filteredStores.length}</strong> verified marts
              </p>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Category: <span className="text-[#CCFF00]">{selectedCategory}</span>
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-[#131419] h-80 rounded-2xl border border-[#20222A] animate-pulse p-5 space-y-4"
                  >
                    <div className="w-16 h-5 bg-[#20222A] rounded-full"></div>
                    <div className="w-full h-36 bg-[#1A1B22] rounded-xl"></div>
                    <div className="w-3/4 h-4 bg-[#20222A] rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="bg-[#121318] rounded-2xl border border-[#20222A] p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No marts found</h3>
                <p className="text-xs text-zinc-400">
                  Try adjusting your search criteria or reset filters to see all available stores.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2 rounded-xl bg-[#CCFF00] text-black text-xs font-extrabold hover:bg-[#b8e600] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store, index) => {
                  const avgRating = parseFloat(store.rating || 0).toFixed(1);
                  const isFavorited = favorites[store.id];
                  return (
                    <AnimatedSection
                      key={store.id}
                      animation="fade-up"
                      delay={(index % 3) * 80}
                      className="h-full"
                    >
                      <div className="group bg-[#131419] hover:bg-[#16171E] rounded-2xl border border-[#20222A] hover:border-[#CCFF00]/40 p-4 transition-all duration-300 flex flex-col justify-between relative hover:shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_24px_rgba(204,255,0,0.12)] hover:-translate-y-1 h-full">
                        
                        {/* Top Row: Sale/Verified Badge + Bookmark Heart */}
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                            {store.rating >= 4.8 ? 'Top Mart' : 'Verified'}
                          </span>

                          <button
                            onClick={() => toggleFavorite(store.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                              isFavorited
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                : 'bg-[#181920] border-[#2A2B36] text-zinc-400 hover:text-white hover:border-zinc-500'
                            }`}
                            title="Save Mart"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Graphic Product Visual Container (Matching Protech Card Image Frame) */}
                        <div className="relative rounded-xl bg-[#0B0C0E] border border-[#1D1E26] p-6 mb-4 flex items-center justify-center h-36 overflow-hidden group-hover:border-[#CCFF00]/20 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {getStoreVectorIcon(store.category)}
                        </div>

                        {/* Store Brand, Category & Title */}
                        <div className="space-y-1 mb-4 flex-grow">
                          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                            <span>{store.category || 'MART'}</span>
                            <div className="flex items-center gap-1 text-[#FBBF24] font-extrabold text-xs">
                              <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                              <span>{avgRating}</span>
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1">
                            {store.name}
                          </h3>

                          <p className="text-xs text-zinc-400 flex items-start gap-1 line-clamp-2 pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                            <span>{store.address}</span>
                          </p>
                        </div>

                        {/* Bottom Action Section: Reviews count + Rate Button */}
                        <div className="pt-3 border-t border-[#1F2029] flex items-center justify-between gap-2">
                          <div className="text-[11px] text-zinc-400 font-semibold">
                            {store.ratingCount || 0} reviews
                          </div>

                          <button
                            onClick={() => handleRateClick(store)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1C1E26] hover:bg-[#CCFF00] text-zinc-200 hover:text-black border border-[#2D2F3C] hover:border-[#CCFF00] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_16px_rgba(204,255,0,0.3)]"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>{store.userRating ? `Rated ${store.userRating}★` : 'Rate Mart'}</span>
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* 3. CALL TO ACTION SECTION IN SLEEK DARK STYLING */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatedSection animation="scale">
          <div className="bg-[#121318] rounded-3xl p-8 sm:p-10 border border-[#20222A] text-center space-y-4 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 mb-1">
              <ShoppingBag className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-tech">
              Discover & Grade Grocery Marts Transparently
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Join shoppers rating supermarkets, artisan bakeries, and gourmet delis across the region with verified community reviews.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#1A1B22] hover:bg-[#22242D] text-zinc-200 border border-[#2C2E3B] font-bold text-xs transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </AnimatedSection>
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

