import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Hash, 
  Wallet, 
  ShieldCheck, 
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, user } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          wallet_address: walletAddress
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <span className="text-4xl font-bold text-indigo-600">
                {profile?.name?.charAt(0).toUpperCase() || <User className="w-10 h-10" />}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{profile?.email}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              {profile?.is_active ? 'Active Member' : 'Inactive Member'}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Referral Code</p>
                <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Hash className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-slate-700">{profile?.referral_code}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Sponsor ID</p>
                <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{profile?.sponsor_id || 'None'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Join Date</p>
                <div className="text-sm font-medium text-slate-700">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Edit Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-start gap-3 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || ''}
                      className="bg-slate-50 text-slate-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-lg py-2.5 border cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">USDT Wallet Address (TRC20)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="T..."
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border font-mono"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Used for receiving withdrawals.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
