import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Store, 
  PiggyBank, 
  TrendingUp, 
  ShieldCheck, 
  UserCircle,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isAdmin }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Team Tree', href: '/team-tree', icon: Users },
    { name: 'Wallet & Withdraw', href: '/wallet', icon: Wallet },
    { name: 'P2P Merchant', href: '/p2p', icon: Store },
    { name: 'Pension Plan', href: '/pension', icon: PiggyBank },
    { name: 'Rank Progress', href: '/rank-progress', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: UserCircle },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            Infinity MLM
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 bg-slate-950/50">
          <div className="bg-slate-800 rounded-xl p-4 text-sm">
            <p className="text-slate-400 mb-1">Need help?</p>
            <a href="mailto:support@infinitymlm.com" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
