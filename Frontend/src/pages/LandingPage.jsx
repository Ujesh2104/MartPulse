import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import ScrollReveal from '../components/ScrollReveal';
import RateStoreModal from '../components/Modals/RateStoreModal';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingUp,
  MapPin,
  Store,
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
  Star,
  Quote,
  Activity,
  Zap,
  BarChart3,
  Layers,
  ChevronDown,
  HelpCircle,
  ShoppingBag,
  Sliders,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [ratingStore, setRatingStore] = useState(null);

  // Interactive Live Demo Simulator State
  const [demoRating, setDemoRating] = useState(5);
  const [demoStore, setDemoStore] = useState('The Obsidian Grand Hypermarket');

  // Interactive Feature Tab State
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await storeAPI.getAllStores({ sort: 'averageRating:desc' });
      if (data && data.stores) {
        setStores(data.stores);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    'Gourmet & Hypermarket',
    'Organic & Artisan Grocery',
    'Premium Supermarket',
    'Wine & Specialty Market',
  ];

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRateClick = (store) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRatingStore(store);
  };

  const featureTabs = [
    {
      title: 'Real-Time Verification',
      badge: 'Anti-Tamper Shield',
      icon: ShieldCheck,
      headline: 'Authentic Feedback Without Manipulation',
      description:
        'Every review in MartPulse is tied to verified customer accounts. Store ratings are protected with automated anomaly detection, ensuring transparent scores.',
      highlights: [
        'Single authentic rating per user per store',
        'Real-time recalculation of store averages',
        'Strict character & authenticity thresholds',
      ],
      stats: '100% Verified Community',
    },
    {
      title: 'Luminous Rating Engine',
      badge: '5-Star Precision',
      icon: Star,
      headline: 'Clear, Visual & Granular Score Breakdowns',
      description:
        'Explore stores with high-definition star distributions, sentiment breakdowns, and detailed shopper reviews highlighting produce freshness and checkout speed.',
      highlights: [
        'Interactive 1 to 5 star rating selectors',
        'Detailed category-specific performance metrics',
        'Instant live score recalculations',
      ],
      stats: '50,000+ Ratings Cast',
    },
    {
      title: 'Store Owner Intelligence',
      badge: 'Executive Analytics',
      icon: BarChart3,
      headline: 'Actionable Insights for Retail Excellence',
      description:
        'Store owners receive a dedicated dashboard with customer review streams, star distribution curves, and community benchmark rankings to elevate their mart.',
      highlights: [
        'Direct customer feedback audit stream',
        'Competitive benchmark scoring',
        'Verified store owner badge certification',
      ],
      stats: '500+ Enrolled Marts',
    },
  ];

  const faqs = [
    {
      q: 'How does MartPulse ensure ratings are 100% authentic?',
      a: 'MartPulse requires verified user accounts with strict validation constraints. A user can only submit one active rating per store (which they can modify anytime), preventing bot manipulation or duplicate spam.',
    },
    {
      q: 'Can store owners delete or alter customer ratings?',
      a: 'No. Store owners have access to view customer feedback, ratings, and analytics on their dedicated dashboard, but cannot edit or remove ratings. This ensures 100% transparency for shoppers.',
    },
    {
      q: 'How does the store overall average score get calculated?',
      a: 'The store average is calculated dynamically in real-time as the arithmetic mean of all submitted ratings from verified users, updated instantaneously with 1-decimal precision.',
    },
    {
      q: 'How can a new supermarket or grocery mart get listed?',
      a: 'Administrators can register new stores with official name, address, category, and assign store owner accounts through the secure Admin Console.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-amber-500 selection:text-white">
      {/* 1. PRODUCT HERO SECTION (Obsidian Luxury & Amber Gold) */}
      <section className="relative overflow-hidden bg-obsidian-gradient text-white pt-20 pb-32 border-b border-zinc-800">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-zinc-800/40 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <ScrollReveal direction="down" delay={100}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 shadow-gold-glow animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                    Real Shoppers. Honest Ratings.
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={200}>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12]">
                  Discover & Rate the <br />
                  <span className="text-gold-gradient italic">Best Stores</span> Around You.
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={300}>
                <p className="text-base sm:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed">
                  Find top-rated grocery stores, supermarkets, and hypermarkets near you — backed by authentic feedback from real local shoppers.
                </p>
              </ScrollReveal>

              {/* Search Box */}
              <ScrollReveal direction="up" delay={400}>
                <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                  <div className="relative flex items-center shadow-2xl rounded-2xl bg-zinc-900/95 border border-zinc-700 p-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all">
                    <Search className="w-5 h-5 text-zinc-400 ml-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by store name, city, or address..."
                      className="w-full px-4 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm sm:text-base"
                    />
                    <a
                      href="#discover"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex-shrink-0"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA Action Buttons */}
              <ScrollReveal direction="up" delay={500}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#simulator"
                    className="px-6 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Try Live Rating Simulator</span>
                  </a>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-semibold transition-all"
                  >
                    Join as Member
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Col: Floating Product UI Mockup Card */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal direction="zoom" delay={300}>
                {/* Floating Certification Badge */}
                <div className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-obsidian-card text-white shadow-2xl animate-float-slow">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Obsidian Verified</p>
                    <p className="text-[10px] text-amber-400 font-semibold">100% Anti-Fraud Score</p>
                  </div>
                </div>

                {/* Floating Live Pulse Badge */}
                <div className="absolute -bottom-6 -right-4 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-obsidian-card text-white shadow-2xl animate-float-reverse">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Live Community Pulse</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">+1,240 Ratings Today</p>
                  </div>
                </div>

                {/* Main Product Card Mockup */}
                <div className="relative rounded-3xl bg-zinc-900/90 border border-zinc-700/80 p-6 shadow-2xl backdrop-blur-xl overflow-hidden group">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-mono text-zinc-500 ml-2">martpulse.live/preview</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                      Live Demo
                    </span>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div className="relative h-44 rounded-2xl overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
                        alt="Store Mockup"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Top Tier Mart
                          </span>
                          <h4 className="font-serif text-base font-bold text-white">
                            The Obsidian Grand Hypermarket
                          </h4>
                        </div>
                        <div className="bg-black/80 px-2.5 py-1 rounded-xl border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>

                    {/* Star breakdown mini */}
                    <div className="bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Verified Shopper Score</span>
                        <StarRating rating={4.9} size="sm" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
                        <span>Recent Feedback:</span>
                        <span className="text-amber-400 italic text-[11px]">
                          "Exquisite concierge checkout & truffles"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS RIBBON WITH SCROLL REVEAL */}
      <section id="metrics" className="bg-[#121215] border-b border-zinc-800 text-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Metric 1 */}
            <ScrollReveal direction="up" delay={100}>
              <div className="flex flex-col items-center justify-center p-4 group">
                <div className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    500<span className="text-amber-500">+</span>
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Verified Stores Registered
                </p>
                <p className="text-xs text-zinc-500 mt-1">Across 40+ premier shopping districts</p>
              </div>
            </ScrollReveal>

            {/* Metric 2 */}
            <ScrollReveal direction="up" delay={250}>
              <div className="flex flex-col items-center justify-center p-4 group">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    50,000<span className="text-amber-500">+</span>
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Verified Shopper Ratings
                </p>
                <p className="text-xs text-zinc-500 mt-1">Unfiltered, authenticated reviews</p>
              </div>
            </ScrollReveal>

            {/* Metric 3 */}
            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-col items-center justify-center p-4 group">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                    100<span className="text-amber-500">%</span>
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Authentic Feedback
                </p>
                <p className="text-xs text-zinc-500 mt-1">Strict anti-tamper fraud prevention</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT CAPABILITIES (Feature Experience Tabs) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Product Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900">
              Engineered for Transparency
            </h2>
            <p className="text-base text-zinc-600">
              Experience the three pillars that make MartPulse the benchmark in retail store discovery and community trust.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Tab Navigation */}
        <ScrollReveal direction="up" delay={200}>
          <div className="flex justify-center mb-10">
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200">
              {featureTabs.map((tab, idx) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveFeatureTab(idx)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeFeatureTab === idx
                        ? 'bg-zinc-900 text-amber-400 shadow-md'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Active Tab Showcase Box */}
        <ScrollReveal direction="zoom" delay={300}>
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                  {featureTabs[activeFeatureTab].badge}
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900">
                  {featureTabs[activeFeatureTab].headline}
                </h3>
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                  {featureTabs[activeFeatureTab].description}
                </p>
                <ul className="space-y-3 pt-2">
                  {featureTabs[activeFeatureTab].highlights.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 bg-obsidian-gradient rounded-2xl p-8 text-white border border-zinc-800 text-center space-y-4">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                  Platform Benchmark
                </span>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-400">
                  {featureTabs[activeFeatureTab].stats}
                </p>
                <div className="h-0.5 w-16 bg-amber-500 mx-auto"></div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Audited continuously with cryptographic authorization tokens and real-time backend persistence.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. INTERACTIVE LIVE RATING SIMULATOR WIDGET */}
      <section id="simulator" className="py-20 bg-zinc-900 text-white relative overflow-hidden border-t border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Live Simulator</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Try the Rating Experience Live
              </h2>
              <p className="text-sm text-zinc-400">
                Select star levels to see how our luminous score engine and sentiment calculations respond in real-time.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="zoom" delay={200}>
            <div className="bg-zinc-950/90 rounded-3xl border border-zinc-800 p-8 sm:p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Simulator Control */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-zinc-400 block mb-2">
                      Select Target Mart:
                    </label>
                    <select
                      value={demoStore}
                      onChange={(e) => setDemoStore(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="The Obsidian Grand Hypermarket">The Obsidian Grand Hypermarket</option>
                      <option value="Elysian Artisan Food Hall & Mart">Elysian Artisan Food Hall & Mart</option>
                      <option value="Aura Prime Organic Supercenter">Aura Prime Organic Supercenter</option>
                    </select>
                  </div>

                  <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                      Your Rating (1 - 5 Stars)
                    </span>
                    <div className="flex justify-center py-2">
                      <StarRating
                        rating={demoRating}
                        interactive={true}
                        size="xl"
                        onChange={(v) => setDemoRating(v)}
                      />
                    </div>
                    <p className="text-xs font-semibold text-amber-400">
                      {demoRating === 5
                        ? '★ Exceptional Luxury Standard'
                        : demoRating === 4
                        ? '★ High Quality Shopper Experience'
                        : demoRating === 3
                        ? '★ Average Mart Experience'
                        : '★ Below Community Expectations'}
                    </p>
                  </div>
                </div>

                {/* Right Simulator Output */}
                <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Live Score Simulator
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                      Active
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white truncate">{demoStore}</h4>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-5xl font-extrabold text-amber-400">
                      {((4.5 + demoRating) / 2).toFixed(1)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Simulated overall score with your vote
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed italic">
                    "Rating submitted with cryptographic token authorization. Store owner dashboard updated instantly."
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. TOP RATED MARTS SHOWCASE */}
      <section id="discover" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Curated Selection</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
                Top Rated Marts & Supercenters
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Browse top-performing supermarkets with the highest community ratings
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-zinc-900 text-amber-400 shadow-sm'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Store Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 animate-pulse"
              >
                <div className="h-44 bg-zinc-200 rounded-xl"></div>
                <div className="h-5 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                <div className="h-10 bg-zinc-200 rounded-xl mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-16 text-center max-w-lg mx-auto shadow-sm">
            <Store className="w-14 h-14 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-zinc-900">No Stores Found</h3>
            <p className="text-sm text-zinc-500 mt-2">
              We couldn't find any marts matching "{searchQuery}". Try adjusting your search query or selected category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-zinc-900 text-amber-400 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store, index) => (
              <ScrollReveal key={store.id} direction="up" delay={(index % 3) * 150}>
                <div className="group bg-white rounded-2xl border border-zinc-200 hover:border-amber-500/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 h-full">
                  {/* Store Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={store.imageUrl}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-semibold text-amber-400 border border-amber-500/30">
                      {store.category}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-xs text-white">
                          {store.averageRating ? store.averageRating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ({store.totalRatings || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {store.name}
                      </h3>
                      <p className="text-xs text-zinc-500 flex items-start gap-1.5 mt-2 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                          Community Score
                        </span>
                        <StarRating rating={store.averageRating || 0} size="sm" />
                      </div>

                      <button
                        onClick={() => handleRateClick(store)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-amber-500 text-zinc-100 hover:text-zinc-950 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Rate Store</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-canvas-subtle border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Real Shopper Experiences</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
                Trusted by Discerning Shoppers
              </h2>
              <p className="text-sm text-zinc-600">
                See what verified customers are saying about marts in the MartPulse network.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'The Obsidian Grand Hypermarket sets the standard for grocery shopping. The fresh truffle aisle and sommelier assistance made my weekend dinner party a triumph.',
                author: 'Harrison Montgomery Cole',
                role: 'Verified Gourmet Shopper',
                store: 'The Obsidian Grand Hypermarket',
                rating: 5,
              },
              {
                quote:
                  'Finding farm-to-table organic sourdough and raw artisanal cheeses is effortless with MartPulse rating breakdowns. The transparency is refreshing.',
                author: 'Genevieve Celeste Dupont',
                role: 'Culinary Enthusiast',
                store: 'Elysian Artisan Food Hall & Mart',
                rating: 5,
              },
              {
                quote:
                  'As a store owner, the MartPulse dashboard gives us unvarnished customer feedback that has allowed our staff to continuously refine our service and aisles.',
                author: 'Sebastian Raphael Drake',
                role: 'Proprietor, HavenMart',
                store: 'Crown Heritage Provisions',
                rating: 5,
              },
            ].map((review, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 150}>
                <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6 hover:-translate-y-1 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} size="sm" />
                      <Quote className="w-8 h-8 text-amber-500/20" />
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed italic">
                      "{review.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900">{review.author}</p>
                    <p className="text-[11px] text-zinc-500">{review.role}</p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-1">
                      Review for: {review.store}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (Interactive Accordion) */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={100}>
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-zinc-50/80 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-zinc-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-24 bg-obsidian-gradient text-white border-t border-zinc-800 text-center relative overflow-hidden">
        <ScrollReveal direction="zoom" delay={150}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-amber-500/40 text-xs font-bold uppercase tracking-widest text-amber-400">
              <span>Ready to Explore?</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Elevate Your Retail Experience. <br />
              <span className="text-gold-gradient">Join MartPulse Today.</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Discover verified stores, rate with complete transparency, and join thousands of conscious shoppers in your city.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Interactive Rating Modal */}
      {ratingStore && (
        <RateStoreModal
          isOpen={!!ratingStore}
          onClose={() => setRatingStore(null)}
          store={ratingStore}
          onRatingSubmitted={() => fetchStores()}
        />
      )}
    </div>
  );
};

export default LandingPage;
