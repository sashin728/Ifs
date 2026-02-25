import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const { profile } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('crypto');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const walletBalance = (profile?.total_income || 0) - (profile?.total_withdrawn || 0);
  const fee = amount ? parseFloat(amount) * 0.05 : 0; // 5% fee
  const payable = amount ? parseFloat(amount) - fee : 0;

  useEffect(() => {
    if (profile?.id) {
      fetchWithdrawals();
    }
  }, [profile?.id]);

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > walletBalance) {
      setError('Insufficient balance');
      return;
    }
    
    if (withdrawAmount < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert([{
          user_id: profile.id,
          amount: withdrawAmount,
          payout_method: payoutMethod,
          status: 'pending'
        }]);

      if (error) throw error;
      
      setSuccess('Withdrawal request submitted successfully');
      setAmount('');
      fetchWithdrawals();
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Wallet & Withdrawals</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <WalletIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-slate-300">Available Balance</span>
            </div>
            
            <div className="mb-6 relative z-10">
              <span className="text-4xl font-bold tracking-tight">${walletBalance.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 relative z-10">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Earned</p>
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3" />
                  ${profile?.total_income?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Withdrawn</p>
                <p className="text-sm font-semibold text-rose-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  ${profile?.total_withdrawn?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Request Withdrawal</h2>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button"
                      onClick={() => setAmount(walletBalance.toString())}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border"
                >
                  <option value="crypto">USDT (TRC20)</option>
                  <option value="bank_upi">Bank Transfer / UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {payoutMethod === 'crypto' ? 'Wallet Address' : 'Bank Details / UPI ID'}
                </label>
                <input
                  type="text"
                  required
                  value={payoutAddress}
                  onChange={(e) => setPayoutAddress(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                  placeholder={payoutMethod === 'crypto' ? 'T...' : 'Account No / UPI'}
                />
              </div>

              {amount && !isNaN(parseFloat(amount)) && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Withdrawal Amount:</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fee (5%):</span>
                    <span className="text-rose-500">-${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>You will receive:</span>
                    <span className="text-emerald-600">${payable.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || walletBalance < 10}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Withdrawal History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">${withdrawal.amount.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">Payable: ${(withdrawal.amount * 0.95).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {withdrawal.payout_method === 'crypto' ? 'USDT' : 'Bank/UPI'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full flex items-center gap-1.5 w-fit
                            ${withdrawal.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                              withdrawal.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 
                              'bg-amber-100 text-amber-800'}`}
                          >
                            {withdrawal.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                            {withdrawal.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {withdrawal.status === 'pending' && <Clock className="w-3 h-3" />}
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        <WalletIcon className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                        <p>No withdrawal history found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
