import React, { useState, useEffect } from 'react';
import { adminAPI, storeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import AddStoreModal from '../components/Modals/AddStoreModal';
import AddUserModal from '../components/Modals/AddUserModal';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
  Building2,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'users'
  
  // Stores Table State
  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortField, setStoreSortField] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Users Table State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortField, setUserSortField] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('asc');

  const [loading, setLoading] = useState(true);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
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

  // Store Sorting handler
  const handleStoreSort = (field) => {
    if (storeSortField === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortOrder('asc');
    }
  };

  // User Sorting handler
  const handleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  // Filtered and Sorted Stores
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
      let valA = a[storeSortField] || '';
      let valB = b[storeSortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return storeSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return storeSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Filtered and Sorted Users
  const processedUsers = usersList
    .filter((u) => {
      const q = userSearch.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q);
      const matchesRole = !userRoleFilter || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let valA = a[userSortField] || '';
      let valB = b[userSortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return userSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return userSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            ADMIN
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            STORE OWNER
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
            NORMAL USER
          </span>
        );
    }
  };

  const storeOwnersList = usersList.filter((u) => u.role === 'STORE_OWNER');

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090B] text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>System Administrator Console</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Platform Master Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Welcome back, {user?.name}. Oversee catalog items, users, and audit ratings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Store</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Add New User</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. 3 STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between hover-lift">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Registered Users
              </p>
              <h3 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
                {stats.totalUsers || usersList.length}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Across 3 role levels</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Total Stores */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between hover-lift">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Verified Stores / Marts
              </p>
              <h3 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
                {stats.totalStores || stores.length}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active verified catalog</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-400 hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
          </div>

          {/* Total Ratings */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between hover-lift">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Submitted Ratings
              </p>
              <h3 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
                {stats.totalRatings}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                From authenticated shoppers
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 hover:scale-110 transition-transform">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
          </div>
        </div>

        {/* Tab Switcher & Management View */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Navigation Bar */}
          <div className="px-6 pt-5 pb-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'stores'
                    ? 'bg-zinc-900 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Stores Catalog ({stores.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-zinc-900 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>User Management ({usersList.length})</span>
              </button>
            </div>

            {/* Quick Actions based on active tab */}
            {activeTab === 'stores' ? (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Search stores by name, address..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="NORMAL_USER">Normal User</option>
                </select>
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: STORES TABLE */}
          {activeTab === 'stores' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-700">
                <thead className="bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleStoreSort('name')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Store Name</span>
                        {storeSortField === 'name' ? (
                          storeSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleStoreSort('email')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        {storeSortField === 'email' ? (
                          storeSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleStoreSort('address')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Address</span>
                        {storeSortField === 'address' ? (
                          storeSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleStoreSort('averageRating')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Overall Rating</span>
                        {storeSortField === 'averageRating' ? (
                          storeSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {processedStores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                        No stores found matching your query.
                      </td>
                    </tr>
                  ) : (
                    processedStores.map((store) => (
                      <tr key={store.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-zinc-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 flex-shrink-0">
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
                        <td className="px-6 py-4 text-xs text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{store.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-600 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{store.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StarRating rating={store.averageRating || 0} size="sm" />
                            <span className="text-xs font-bold text-zinc-900">
                              {store.averageRating ? store.averageRating.toFixed(1) : '0.0'}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              ({store.totalRatings || 0})
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: USERS TABLE */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-700">
                <thead className="bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleUserSort('name')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>User Name</span>
                        {userSortField === 'name' ? (
                          userSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleUserSort('email')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email Address</span>
                        {userSortField === 'email' ? (
                          userSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleUserSort('address')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Address</span>
                        {userSortField === 'address' ? (
                          userSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
                      onClick={() => handleUserSort('role')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Role / Store Rating</span>
                        {userSortField === 'role' ? (
                          userSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {processedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                        No users found matching your query.
                      </td>
                    </tr>
                  ) : (
                    processedUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-zinc-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold text-xs flex-shrink-0">
                              {item.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">{item.name}</p>
                              <span className="text-[11px] text-zinc-400 font-normal">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{item.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-600 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{item.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {getRoleBadge(item.role)}
                            {item.role === 'STORE_OWNER' && item.storeRating !== undefined && (
                              <div className="flex items-center gap-1.5 text-xs text-zinc-700 mt-1">
                                <span className="text-amber-500 font-bold">★ {Number(item.storeRating).toFixed(1)}</span>
                                {item.storeName && (
                                  <span className="text-[11px] text-zinc-400 truncate max-w-[130px]" title={item.storeName}>
                                    ({item.storeName})
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
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddStoreModal && (
        <AddStoreModal
          isOpen={showAddStoreModal}
          onClose={() => setShowAddStoreModal(false)}
          owners={storeOwnersList}
          onStoreCreated={(newStore) => {
            setStores((prev) => [newStore, ...prev]);
            setStats((prev) => ({ ...prev, totalStores: prev.totalStores + 1 }));
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserCreated={(newUser) => {
            setUsersList((prev) => [newUser, ...prev]);
            setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
