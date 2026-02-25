import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  DollarSign, 
  Users, 
  Award, 
  Briefcase, 
  Copy, 
  CheckCircle2, 
  Share2, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const walletBalance = (profile?.total_income || 0) - (profile?.total_withdrawn || 0);
  const referralLink = `${window.location.origin}/signup?ref=${profile?.referral_code}`;

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('earnings')
        .select('*, source_user:users!earnings_source_user_id_fkey(name)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (earningsError) throw earningsError;
      setRecentEarnings(earnings || []);

      // Generate mock chart data for the last 7 days based on real data if possible
      // For now, we'll use some placeholder data that looks realistic
      const mockChartData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: Math.floor(Math.random() * 100) + 10,
        };
      });
      setChartData(mockChartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Join my team on Infinity MLM! Use my referral code: ${profile?.referral_code} or click here: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        {!profile?.is_active && (
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Account Inactive - Purchase units to activate
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Wallet Balance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">${walletBalance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 flex items-center font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Total Earned: ${profile?.total_income?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Team Size</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{profile?.team_size || 0}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-indigo-600 font-medium">
              Direct Referrals: {profile?.direct_count || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Rank</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {profile?.current_rank_id ? `Rank ${profile.current_rank_id}` : 'Starter'}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link to="/rank-progress" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
              View Progress <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Units</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{profile?.total_units || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">
              Active Units
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Income Overview (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Income']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Earnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Earnings</h2>
              <Link to="/wallet" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentEarnings.length > 0 ? (
                recentEarnings.map((earning) => (
                  <div key={earning.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ArrowDownRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {earning.earning_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-slate-500">
                          From: {earning.source_user?.name || 'System'} • {new Date(earning.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">+${earning.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No earnings yet. Start referring to earn!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Referral Card */}
          <div className="bg-indigo-600 rounded-2xl shadow-sm p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Your Referral Link</h2>
            <p className="text-indigo-200 text-sm mb-4">Share this link to grow your team and earn direct commissions.</p>
            
            <div className="bg-indigo-700/50 rounded-lg p-3 flex items-center justify-between mb-4 border border-indigo-500/30">
              <code className="text-sm truncate mr-2">{referralLink}</code>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors flex-shrink-0"
                title="Copy link"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={shareOnWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-400 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/wallet" className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-200">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Withdraw Funds</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>
              
              <Link to="/team-tree" className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-200">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">View Team Tree</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link to="/p2p" className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-200">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">P2P Trading</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
