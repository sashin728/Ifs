import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, PiggyBank, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-white">Infinity MLM</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white font-medium">
                Log in
              </Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Build Your Future with <span className="text-indigo-400">Infinity MLM</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              The most transparent, rewarding, and sustainable multi-level marketing platform. Earn direct commissions, gap commissions, and secure your future with our pension plans.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                Start Earning Today <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="#features" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Infinity MLM?</h2>
            <p className="mt-4 text-lg text-slate-600">Multiple streams of income designed for your success.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Direct Commission',
                description: 'Earn instant commissions for every direct referral you bring to the platform.',
                icon: TrendingUp,
              },
              {
                title: 'Gap Commission',
                description: 'Earn from your entire downline based on rank differences.',
                icon: Users,
              },
              {
                title: 'Pension Plan',
                description: 'Secure your future with our unique 6-option pension investment plans.',
                icon: PiggyBank,
              },
              {
                title: 'P2P Trading',
                description: 'Buy and sell funds directly with other users safely and securely.',
                icon: Shield,
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600">Start your journey to financial freedom in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-indigo-100" />
            
            {[
              { step: '01', title: 'Register Account', desc: 'Sign up using a referral code and activate your account.' },
              { step: '02', title: 'Build Your Team', desc: 'Share your referral link and invite others to join your network.' },
              { step: '03', title: 'Earn & Grow', desc: 'Climb the ranks, earn commissions, and invest in your pension.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-indigo-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-white">Infinity MLM</span>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Infinity MLM System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm">Terms</Link>
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
