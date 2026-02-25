import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Users, Search, Filter, ChevronDown, ChevronRight, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  sponsor_id: string | null;
  is_active: boolean;
  total_units: number;
  level: number;
  children?: TeamMember[];
}

export const TeamTree: React.FC = () => {
  const { profile } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (profile?.id) {
      fetchTeamTree();
    }
  }, [profile?.id]);

  const fetchTeamTree = async () => {
    try {
      // In a real app, you'd use a recursive CTE or a specific RPC function to fetch the tree.
      // For this example, we'll fetch all users and build the tree client-side (not ideal for huge trees, but works for demo).
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, referral_code, sponsor_id, is_active, total_units');

      if (error) throw error;

      if (data) {
        const buildTree = (parentId: string | null, level: number): TeamMember[] => {
          return data
            .filter(user => user.sponsor_id === parentId)
            .map(user => ({
              ...user,
              level,
              children: buildTree(user.id, level + 1)
            }));
        };

        // Start tree from current user
        const myTeam = buildTree(profile.id, 1);
        setTeam(myTeam);
        
        // Auto-expand first level
        const initialExpanded = new Set<string>();
        myTeam.forEach(member => initialExpanded.add(member.id));
        setExpandedNodes(initialExpanded);
      }
    } catch (error) {
      console.error('Error fetching team tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTree = (members: TeamMember[]) => {
    if (!members || members.length === 0) return null;

    return (
      <ul className="pl-6 mt-2 space-y-2 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
        {members.map((member) => {
          const isExpanded = expandedNodes.has(member.id);
          const hasChildren = member.children && member.children.length > 0;
          
          // Simple search filter
          const matchesSearch = searchTerm === '' || 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            member.referral_code?.toLowerCase().includes(searchTerm.toLowerCase());

          if (!matchesSearch && searchTerm !== '') {
            // If it doesn't match, still render children if they might match
            return renderTree(member.children || []);
          }

          return (
            <li key={member.id} className="relative">
              <div className="absolute left-[-1.5rem] top-4 w-6 h-px bg-slate-200"></div>
              <div 
                className={`flex items-center gap-3 p-3 rounded-xl border ${member.is_active ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-white'} hover:shadow-sm transition-all cursor-pointer`}
                onClick={() => hasChildren && toggleNode(member.id)}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {hasChildren ? (
                    <button className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  )}
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${member.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>Level {member.level}</span>
                    <span>•</span>
                    <span>Ref: {member.referral_code || 'N/A'}</span>
                    <span>•</span>
                    <span>Units: {member.total_units || 0}</span>
                  </div>
                </div>
              </div>
              
              {isExpanded && hasChildren && (
                <div className="ml-4">
                  {renderTree(member.children!)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Tree</h1>
          <p className="text-slate-500 mt-1">View and manage your downline network</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search team..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Team</p>
            <p className="text-xl font-bold text-slate-900">{profile?.team_size || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Direct Referrals</p>
            <p className="text-xl font-bold text-slate-900">{profile?.direct_count || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
        {team.length > 0 ? (
          <div className="min-w-[600px]">
            {/* Root Node (Current User) */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{profile?.name} (You)</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                  <span className="font-medium text-indigo-600">Rank: {profile?.current_rank_id || 'Starter'}</span>
                  <span>•</span>
                  <span>Ref: {profile?.referral_code}</span>
                </div>
              </div>
            </div>
            
            {/* Children Tree */}
            <div className="ml-6">
              {renderTree(team)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No team members yet</h3>
            <p className="text-slate-500">Share your referral link to start building your team.</p>
          </div>
        )}
      </div>
    </div>
  );
};
