
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Activity, Shield, Zap, Box } from 'lucide-react';
import KPICard from '../components/KPICard';
import { COLORS } from '../constants';

const trendData = [
  { name: '10am', val: 12 }, { name: '11am', val: 18 }, { name: '12pm', val: 14 },
  { name: '1pm', val: 22 }, { name: '2pm', val: 32 }, { name: '3pm', val: 28 },
  { name: '4pm', val: 30 }, { name: '5pm', val: 24 }
];

const hostMap = Array.from({ length: 40 }, (_, i) => ({
  id: `H-${i + 1}`,
  status: Math.random() > 0.9 ? 'critical' : Math.random() > 0.75 ? 'elevated' : 'nominal'
}));

const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Active Assets" value="2,401" icon={Box} color="sky" trend="12%" trendUp />
        <KPICard title="Security Score" value="94" icon={Shield} color="emerald" trend="2pts" trendUp />
        <KPICard title="Threat Activity" value="12" icon={Zap} color="rose" trend="5%" trendUp={false} />
        <KPICard title="System Pulse" value="99.9" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Visualization */}
        <div className={`${COLORS.panel} lg:col-span-2 p-8 rounded-[2rem] border ${COLORS.border} shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-slate-400">Activity Pulse</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className={`${COLORS.panel} p-8 rounded-[2rem] border ${COLORS.border} shadow-sm flex flex-col justify-between`}>
          <h3 className="text-sm font-semibold text-slate-400 mb-6">Threat Vectors</h3>
          <div className="space-y-6">
            {[
              { label: 'PowerShell', val: 78, color: 'bg-emerald-500' },
              { label: 'WMI Exec', val: 45, color: 'bg-sky-500' },
              { label: 'Registry', val: 23, color: 'bg-amber-500' }
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] text-slate-500 italic">Data processed via Sentinel Engine v2.4.1</p>
          </div>
        </div>
      </div>

      {/* Host Risk Map - Minimal & Pretty Version */}
      <div className={`${COLORS.panel} p-8 rounded-[2rem] border ${COLORS.border} shadow-sm`}>
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">Host Risk Distribution</h3>
            <p className="text-xs text-slate-400">Spatial overview of terminal criticality</p>
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span> Critical</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span> Elevated</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800"></span> Nominal</div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-20 gap-3">
          {hostMap.map((host) => (
            <div 
              key={host.id}
              className={`aspect-square rounded-xl transition-all duration-500 cursor-pointer hover:scale-110 hover:-translate-y-1
                ${host.status === 'critical' ? 'bg-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.3)]' : 
                  host.status === 'elevated' ? 'bg-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : 
                  'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              title={`${host.id}: ${host.status.toUpperCase()}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
