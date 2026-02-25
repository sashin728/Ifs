import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  PiggyBank, 
  Clock, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const Pension: React.FC = () => {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    try {
      // Fetch plans
      const { data: plansData, error: plansError } = await supabase
        .from('pension_plans')
        .select('*')
        .order('name');

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch user subscriptions
      if (profile?.id) {
        const { data: subsData, error: subsError } = await supabase
          .from('pension_subscriptions')
          .select('*, plan:pension_plans(*)')
          .eq('user_id', profile.id);

        if (subsError) throw subsError;
        setSubscriptions(subsData || []);
      }
    } catch (error) {
      console.error('Error fetching pension data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setError('');
    setSuccess('');
    setSubscribing(planId);

    try {
      // In a real app, this would involve a payment gateway or deducting from wallet balance
      // For this demo, we'll just create the subscription record directly
      
      const { error } = await supabase
        .from('pension_subscriptions')
        .insert([{
          user_id: profile.id,
          plan_id: planId,
          status: 'active',
          start_date: new Date().toISOString(),
          next_payment_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          total_invested: 50 // Initial payment
        }]);

      if (error) throw error;
      
      setSuccess('Successfully subscribed to pension plan!');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe to plan');
    } finally {
      setSubscribing(null);
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pension Plans</h1>
          <p className="text-slate-500 mt-1">Secure your future with our unique investment options</p>
        </div>
      </div>

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

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Your Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">
                      {sub.plan.name.split(' ')[1]}
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{sub.plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">Started {new Date(sub.start_date).toLocaleDateString()}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Total Invested</span>
                      <span className="font-bold text-slate-900">${sub.total_invested.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Next Payment</span>
                      <span className="font-medium text-amber-600">{new Date(sub.next_payment_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                    Make Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isSubscribed = subscriptions.some(sub => sub.plan_id === plan.id);
            
            return (
              <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border ${isSubscribed ? 'border-indigo-200 opacity-75' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'} p-6 transition-all flex flex-col`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                    {plan.name.split(' ')[1]}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Monthly</p>
                    <p className="text-xl font-bold text-indigo-600">${plan.monthly_investment}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4">{plan.name}</h3>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>Pay for <strong className="text-slate-900">{plan.payment_years} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Wait <strong className="text-slate-900">{plan.wait_years} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <PiggyBank className="w-5 h-5 text-emerald-400" />
                    <span>Receive Pension for <strong className="text-slate-900">{plan.pension_years} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 pt-4 border-t border-slate-100">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Expected Returns</span>
                      <span className="font-bold text-emerald-600">${plan.expected_return_min.toLocaleString()} - ${plan.expected_return_max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isSubscribed || subscribing === plan.id}
                  className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2
                    ${isSubscribed 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'}`}
                >
                  {subscribing === plan.id ? 'Processing...' : isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
