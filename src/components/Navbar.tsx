import React from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
  profile: any;
}

export const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen, profile }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
          Welcome back, {profile?.name || 'User'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-500 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">{profile?.name}</span>
            <span className="text-xs text-slate-500">{profile?.email}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {profile?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
