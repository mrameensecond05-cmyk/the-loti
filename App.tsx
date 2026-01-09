
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import AnalystPanel from './views/AnalystPanel';
import AdminPanel from './views/AdminPanel';
import { Bell, User, Search, Shield, Zap } from 'lucide-react';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <ExecutiveDashboard />;
      case 'analyst': return <AnalystPanel />;
      case 'admin': return <AdminPanel theme={theme} onThemeChange={setTheme} />;
      default: return <ExecutiveDashboard />;
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-700 ${COLORS.bg}`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Minimal Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-10 z-10 transition-all duration-500">
          <div className="flex items-center gap-10">
             <h2 className={`text-xl font-bold tracking-tight ${COLORS.text}`}>
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'analyst' ? 'Intelligence' : 'Systems'}
             </h2>
             <div className="hidden lg:flex items-center bg-white dark:bg-slate-900/50 border ${COLORS.border} rounded-2xl px-5 py-2.5 gap-3 w-80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search assets, logs..." 
                  className="bg-transparent border-none text-xs font-medium focus:outline-none w-full text-slate-500 placeholder-slate-400"
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Low Latency Mode</span>
             </div>
             
             <button className={`relative p-2 text-slate-400 hover:text-emerald-500 transition-colors`}>
                <Bell size={20} strokeWidth={1.5} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
             </button>

             <div className="flex items-center gap-3 pl-4 border-l ${COLORS.border}">
                <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
                  <User size={20} className="text-slate-500" strokeWidth={1.5} />
                </div>
             </div>
          </div>
        </header>

        {/* Minimal Viewport */}
        <div className="flex-1 overflow-y-auto px-10 pb-10">
           {renderContent()}
        </div>

        {/* Subtle AI Hub */}
        <div className="absolute bottom-10 right-10 z-30">
          <button className="w-16 h-16 bg-white dark:bg-slate-900 border ${COLORS.border} rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group">
             <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
             <Shield size={24} className="text-emerald-500" strokeWidth={2.5} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
