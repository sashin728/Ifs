import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Briefcase, 
  ChevronRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const RankProgress: React.FC = () => {
  const { profile } = useAuth();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .order('level_number');

      if (error) throw error;
      setRanks(data || []);
    } catch (error) {
      console.error('Error fetching ranks:', error);
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

  const currentRankLevel = profile?.current_rank_id ? parseInt(profile.current_rank_id.replace('R', '')) : 0;
  const nextRank = ranks.find(r => r.level_number === currentRankLevel + 1);

  // Mock requirements for demo purposes (in a real app, these would come from the DB)
  const getRequirements = (level: number) => {
    return {
      units: level * 10,
      directs: level * 2,
      teamSize: level * 10
    };
  };

  const nextReqs = nextRank ? getRequirements(nextRank.level_number) : null;
  
  const unitsProgress = nextReqs ? Math.min(100, ((profile?.total_units || 0) / nextReqs.units) * 100) : 100;
  const directsProgress = nextReqs ? Math.min(100, ((profile?.direct_count || 0) / nextReqs.directs) * 100) : 100;
  const teamProgress = nextReqs ? Math.min(100, ((profile?.team_size || 0) / nextReqs.teamSize) * 100) : 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rank Progress</h1>
          <p className="text-slate-500 mt-1">Track your journey to the top</p>
        </div>
      </div>

      {/* Current Rank Card */}
      <div className="bg-slate-900 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full opacity-20 blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-xl flex-shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-900">
              <Award className="w-12 h-12 text-amber-400" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <p className="text-indigo-300 font-medium tracking-wide uppercase text-sm mb-1">Current Status</p>
            <h2 className="text-4xl font-extrabold text-white mb-2">
              {profile?.current_rank_id ? `Rank ${profile.current_rank_id.replace('R', '')}` : 'Starter'}
            </h2>
            <p className="text-slate-400 max-w-md mx-auto md:mx-0">
              {nextRank 
                ? `You are on your way to ${nextRank.name}. Complete the requirements below to rank up and unlock higher commissions.`
                : 'Congratulations! You have reached the highest rank.'}
            </p>
          </div>
          
          {nextRank && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-64 flex-shrink-0">
              <p className="text-sm text-slate-300 mb-1">Next Milestone</p>
              <p className="text-xl font-bold text-white mb-4">{nextRank.name}</p>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+${nextRank.direct_commission} Direct Comm.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress to Next Rank */}
      {nextRank && nextReqs && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Requirements for {nextRank.name}
          </h3>
          
          <div className="space-y-8">
            {/* Units Progress */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Total Units</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{profile?.total_units || 0} / {nextReqs.units}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${unitsProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{ width: `${unitsProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Directs Progress */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Direct Referrals</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{profile?.direct_count || 0} / {nextReqs.directs}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${directsProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{ width: `${directsProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Team Size Progress */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Total Team Size</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{profile?.team_size || 0} / {nextReqs.teamSize}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${teamProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{ width: `${teamProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Ranks Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Rank Benefits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Direct Comm.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Fee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {ranks.map((rank) => {
                const isAchieved = currentRankLevel >= rank.level_number;
                const isNext = currentRankLevel + 1 === rank.level_number;
                
                return (
                  <tr key={rank.id} className={`${isNext ? 'bg-indigo-50/50' : ''} hover:bg-slate-50 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAchieved ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <span className={`font-medium ${isAchieved ? 'text-slate-900' : 'text-slate-500'}`}>
                          {rank.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-emerald-600">${rank.direct_commission}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-500">${rank.monthly_fee}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAchieved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Achieved
                        </span>
                      ) : isNext ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <TrendingUp className="w-3.5 h-3.5" /> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
