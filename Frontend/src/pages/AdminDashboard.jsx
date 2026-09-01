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
} from 'lucide-react';
import AddStoreModal from '../components/Modals/AddStoreModal';
import AddUserModal from '../components/Modals/AddUserModal';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'users'
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
  const [storeSortOrder, setStoreSortOrder] = useState('asc'); // 'asc' | 'desc'

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
    <div className="min-h-screen bg-[#F4F5FA] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#5B4DFF]/10 text-[#5B4DFF] text-xs font-bold">
              👑 System Administrator Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Master Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Welcome, <strong className="text-slate-800">{user?.name}</strong>! Oversee marts, ratings, and registered users.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="px-4 py-2.5 rounded-full bg-[#5B4DFF] hover:bg-[#4B3BE6] text-white text-xs font-bold shadow-[0_4px_12px_rgba(91,77,255,0.25)] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Store</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards (Matching Reference Card Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5B4DFF]/10 text-[#5B4DFF] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Stores</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalStores}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ratings</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalRatings}</h3>
            </div>
          </div>
        </div>

        {/* Section Pill Tabs: Stores vs Users */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stores'
                ? 'bg-[#5B4DFF] text-white shadow-[0_4px_12px_rgba(91,77,255,0.3)]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stores Catalog ({stores.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#5B4DFF] text-white shadow-[0_4px_12px_rgba(91,77,255,0.3)]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({usersList.length})</span>
          </button>
        </div>

        {/* Tab 1: Stores Catalog */}
        {activeTab === 'stores' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Filter by store name, address..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs rounded-full border border-slate-200 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <span className="text-xs text-slate-400">
                Showing <strong className="text-slate-700">{processedStores.length}</strong> of {stores.length} stores
              </span>
            </div>

            {/* Clean Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th
                      onClick={() => handleStoreSort('name')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Store Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('email')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('address')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Physical Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort('rating')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Overall Rating</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {processedStores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No stores found matching your query.
                      </td>
                    </tr>
                  ) : (
                    processedStores.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-[#5B4DFF] font-medium">{s.category}</div>
                        </td>
                        <td className="py-4 px-5 text-slate-600">{s.email}</td>
                        <td className="py-4 px-5 text-slate-500 max-w-xs truncate">{s.address}</td>
                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{parseFloat(s.rating || 0).toFixed(1)}</span>
                            <span className="text-[10px] text-slate-400">({s.ratingCount || 0})</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* User Filter Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs rounded-full border border-slate-200 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-full outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="NORMAL_USER">Normal User</option>
                </select>
              </div>

              <span className="text-xs text-slate-400">
                Showing <strong className="text-slate-700">{processedUsers.length}</strong> users
              </span>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th
                      onClick={() => handleUserSort('name')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>User Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('email')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('address')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Address</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleUserSort('role')}
                      className="py-3.5 px-5 cursor-pointer hover:text-[#5B4DFF]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Role / Store Rating</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {processedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No users found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    processedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[10px] text-slate-400">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-600">{u.email}</td>
                        <td className="py-4 px-5 text-slate-500 max-w-xs truncate">{u.address}</td>
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'ADMIN'
                                  ? 'bg-[#5B4DFF]/10 text-[#5B4DFF]'
                                  : u.role === 'STORE_OWNER'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {u.role}
                            </span>
                            {u.role === 'STORE_OWNER' && u.storeRating !== undefined && (
                              <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{parseFloat(u.storeRating || 0).toFixed(1)}</span>
                                {u.storeName && (
                                  <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
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
          </div>
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
