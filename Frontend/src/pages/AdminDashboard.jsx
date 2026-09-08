import React, { useState, useEffect } from 'react';
import { adminAPI, storeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import AddStoreModal from '../components/Modals/AddStoreModal';
import AddUserModal from '../components/Modals/AddUserModal';
import AnimatedSection from '../components/AnimatedSection';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('stores');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [stores, setStores] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Stores Filtering & Sorting
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortField, setStoreSortField] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState('asc');

  // Users Filtering & Sorting
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortField, setUserSortField] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('asc');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, storesRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        storeAPI.getAllStores(),
        adminAPI.getUsers(),
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes.stats);
      if (storesRes && storesRes.stores) setStores(storesRes.stores);
      if (usersRes && usersRes.users) setUsersList(usersRes.users);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStoreSort = (field) => {
    if (storeSortField === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortOrder('asc');
    }
  };

  const handleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  const processedStores = stores
    .filter((s) => {
      const q = storeSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA = a[storeSortField];
      let valB = b[storeSortField];

      if (storeSortField === 'rating') {
        valA = parseFloat(valA || 0);
        valB = parseFloat(valB || 0);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return storeSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return storeSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const processedUsers = usersList
    .filter((u) => {
      const q = userSearch.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.address && u.address.toLowerCase().includes(q));
      const matchesRole = !userRoleFilter || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let valA = a[userSortField];
      let valB = b[userSortField];

      if (userSortField === 'storeRating') {
        valA = parseFloat(valA || 0);
        valB = parseFloat(valB || 0);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return userSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return userSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const storeOwnersList = usersList.filter((u) => u.role === 'STORE_OWNER');

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#121318] rounded-3xl p-6 sm:p-8 border border-[#1E2028] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> System Administrator Console
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Platform Master Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Welcome, <strong className="text-white">Admin</strong>! Oversee marts, verified ratings, and system users.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setShowAddStoreModal(true)}
                className="px-4 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Store</span>
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2.5 rounded-full bg-[#1A1C24] hover:bg-[#252834] text-white hover:text-[#CCFF00] text-xs font-bold border border-[#2A2C38] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button
                onClick={fetchDashboardData}
                className="p-2.5 rounded-full bg-[#1A1C24] hover:bg-[#252834] text-slate-400 hover:text-white border border-[#2A2C38] transition-colors hover:scale-105"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#CCFF00]' : ''}`} />
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* 3 Metrics Cards with Stagger Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="bg-[#121318] rounded-3xl p-6 border border-[#1E2028] shadow-lg flex items-center gap-4 hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Total Users</p>
                <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalUsers}</h3>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="bg-[#121318] rounded-3xl p-6 border border-[#1E2028] shadow-lg flex items-center gap-4 hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Registered Stores</p>
                <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalStores}</h3>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="bg-[#121318] rounded-3xl p-6 border border-[#1E2028] shadow-lg flex items-center gap-4 hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-bold">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Total Ratings</p>
                <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalRatings}</h3>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Section Pill Tabs */}
        <AnimatedSection animation="fade-up" delay={150} className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'stores'
                ? 'bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] scale-105'
                : 'bg-[#121318] text-slate-400 hover:text-white border border-[#1E2028]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stores Catalog ({stores.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] scale-105'
                : 'bg-[#121318] text-slate-400 hover:text-white border border-[#1E2028]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({usersList.length})</span>
          </button>
        </AnimatedSection>

        {/* Tab 1: Stores Catalog */}
        {activeTab === 'stores' && (
          <AnimatedSection animation="fade-up" delay={200} className="bg-[#121318] rounded-3xl border border-[#1E2028] shadow-xl overflow-hidden">
            {/* Table Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-[#1E2028] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Filter by store name, address..."
                  className="w-full pl-9 pr-4 py-2 bg-[#181920] hover:bg-[#1E202A] focus:bg-[#181920] text-white text-xs rounded-full border border-[#282A36] focus:border-[#CCFF00] outline-none transition-all placeholder:text-slate-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Showing <strong className="text-[#CCFF00] font-mono">{processedStores.length}</strong> of {stores.length} stores
              </span>
            </div>

            {/* Clean Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#16171F] border-b border-[#1E2028] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-heading">
                    <th
                      onClick={() => handleStoreSort('name')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Store Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('email')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('address')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Physical Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('rating')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Overall Rating</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2028] text-xs text-slate-300">
                  {processedStores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                        No stores found matching your query.
                      </td>
                    </tr>
                  ) : (
                    processedStores.map((s) => (
                      <tr key={s.id} className="hover:bg-[#181920]/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-white font-heading">{s.name}</div>
                          <div className="text-[11px] text-[#CCFF00] font-medium">{s.category}</div>
                        </td>
                        <td className="py-4 px-5 text-slate-400">{s.email}</td>
                        <td className="py-4 px-5 text-slate-400 max-w-xs truncate">{s.address}</td>
                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181920] border border-[#2A2C38] text-xs font-bold text-white">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-mono">{parseFloat(s.rating || 0).toFixed(1)}</span>
                            <span className="text-[10px] text-slate-500">({s.ratingCount || 0})</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <AnimatedSection animation="fade-up" delay={200} className="bg-[#121318] rounded-3xl border border-[#1E2028] shadow-xl overflow-hidden">
            {/* User Filter Controls */}
            <div className="p-4 sm:p-5 border-b border-[#1E2028] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 bg-[#181920] hover:bg-[#1E202A] focus:bg-[#181920] text-white text-xs rounded-full border border-[#282A36] focus:border-[#CCFF00] outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-[#181920] border border-[#282A36] text-slate-300 text-xs rounded-full outline-none focus:border-[#CCFF00]"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="NORMAL_USER">Normal User</option>
                </select>
              </div>

              <span className="text-xs text-slate-500">
                Showing <strong className="text-[#CCFF00] font-mono">{processedUsers.length}</strong> users
              </span>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#16171F] border-b border-[#1E2028] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-heading">
                    <th
                      onClick={() => handleUserSort('name')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>User Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('email')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('address')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('role')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#CCFF00]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Role / Store Rating</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2028] text-xs text-slate-300">
                  {processedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                        No users found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    processedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#181920]/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#181920] border border-[#282A36] text-[#CCFF00] font-bold flex items-center justify-center text-xs">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-white font-heading">{u.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-400">{u.email}</td>
                        <td className="py-4 px-5 text-slate-400 max-w-xs truncate">{u.address}</td>
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                u.role === 'ADMIN'
                                  ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30'
                                  : u.role === 'STORE_OWNER'
                                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                  : 'bg-[#181920] text-slate-300 border border-[#282A36]'
                              }`}
                            >
                              {u.role}
                            </span>
                            {u.role === 'STORE_OWNER' && u.storeRating !== undefined && (
                              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="font-mono">{parseFloat(u.storeRating || 0).toFixed(1)}</span>
                                {u.storeName && (
                                  <span className="text-slate-500 text-[10px] truncate max-w-[120px]">
                                    ({u.storeName})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
      </div>

      {/* Add Store Modal */}
      {showAddStoreModal && (
        <AddStoreModal
          isOpen={showAddStoreModal}
          onClose={() => setShowAddStoreModal(false)}
          owners={storeOwnersList}
          onStoreCreated={() => {
            fetchDashboardData();
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserCreated={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
