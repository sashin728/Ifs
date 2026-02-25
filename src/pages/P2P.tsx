import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';

export const P2P: React.FC = () => {
  const { profile } = useAuth();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('p2p_merchants')
        .select('*, user:users!p2p_merchants_user_id_fkey(name)')
        .eq('is_active', true);

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">P2P Trading</h1>
          <p className="text-slate-500 mt-1">Buy and sell funds directly with verified merchants</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'buy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Buy Funds
          </button>
          <button 
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sell' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sell Funds
          </button>
        </div>
      </div>

      {activeTab === 'buy' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
                />
              </div>
              <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors flex-shrink-0">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              All merchants are verified
            </div>
          </div>

          {/* Merchant List */}
          <div className="space-y-4">
            {merchants.length > 0 ? (
              merchants.map((merchant) => (
                <div key={merchant.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                        {merchant.user?.name?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{merchant.user?.name || 'Verified Merchant'}</h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            {merchant.rating || '5.0'}
                          </span>
                          <span>•</span>
                          <span>{merchant.total_deals || 0} deals</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">99% completion</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                      <div className="text-sm text-slate-500">Available Limits</div>
                      <div className="font-medium text-slate-900">
                        ${merchant.min_deal_amount} - ${merchant.max_deal_amount}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {merchant.accepted_payment_methods?.map((method: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium uppercase">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:w-48">
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                        Buy Funds
                      </button>
                      <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <Store className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No merchants available</h3>
                <p className="text-slate-500">There are currently no active merchants selling funds.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'sell' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Become a Merchant</h2>
          <p className="text-slate-600 mb-8">
            Want to sell your funds to other users? Apply to become a verified P2P merchant and earn extra income by providing liquidity to the community.
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-700">Set your own minimum and maximum deal limits</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-700">Choose your preferred payment methods (UPI, Bank Transfer, Crypto)</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-700">Build your reputation and get featured to buyers</p>
            </div>
          </div>

          <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};
