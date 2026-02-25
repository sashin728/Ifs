import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBusiness: 0,
    pendingWithdrawals: 0
  });
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('withdrawals'); // 'withdrawals', 'users'

  useEffect(() => {
    if (profile?.is_admin) {
      fetchAdminData();
    }
  }, [profile]);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: activeUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { data: businessData } = await supabase.from('activations').select('amount_paid');
      const totalBusiness = businessData?.reduce((acc, curr) => acc + curr.amount_paid, 0) || 0;
      
      const { count: pendingWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalBusiness,
        pendingWithdrawals: pendingWithdrawals || 0
      });

      // Fetch pending withdrawals
      const { data: withdrawalsData } = await supabase
        .from('withdrawal_requests')
        .select('*, user:users(name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      setWithdrawals(withdrawalsData || []);

      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (id: string, status: 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // If completed, we should ideally deduct from user's total_withdrawn via RPC
      // For this demo, we'll just update the status
      
      fetchAdminData();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      alert('Failed to update withdrawal status');
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage users, withdrawals, and system settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Business</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">${stats.totalBusiness.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingWithdrawals}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'withdrawals' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Pending Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'users' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          User Management
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'withdrawals' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Withdrawal Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{w.user?.name}</div>
                          <div className="text-sm text-slate-500">{w.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-900">${w.amount.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">Payable: ${(w.amount * 0.95).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium uppercase">
                            {w.payout_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(w.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleWithdrawalAction(w.id, 'completed')}
                            className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg mr-2 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleWithdrawalAction(w.id, 'rejected')}
                            className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No pending withdrawals.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
              <h3 className="font-bold text-slate-900">Recent Users</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Income</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {user.current_rank_id || 'Starter'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {user.team_size || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        ${(user.total_income || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
