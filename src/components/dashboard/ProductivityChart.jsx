import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Award, Zap, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import Card from '../ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <div className="text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          {payload[0].value} Tasks Completed
        </div>
      </div>
    );
  }
  return null;
};

const ProductivityChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/api/v1/analytics/productivity');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch productivity stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !isMounted) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center glass rounded-[2.5rem] border-dashed border-2">
        <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Analyzing Performance...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">
      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-border shadow-soft overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
             <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Completion Rate</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{data.summary.completionRate}</h4>
          </div>
        </Card>

        <Card hover className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-border shadow-soft overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
             <Award size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Most Productive Day</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{data.summary.mostProductiveDay}</h4>
          </div>
        </Card>

        <Card hover className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-border shadow-soft overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
             <Zap size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
              <Zap size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Average Velocity</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter line-clamp-1">{data.summary.averageVelocity}</h4>
          </div>
        </Card>
      </div>

      {/* Main Chart */}
      <div className="glass rounded-[2.5rem] p-10 border border-border/50 shadow-premium">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Productivity Trends</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Tasks completed over the last 14 days</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Insights</span>
          </div>
        </div>

        <div className="h-[300px] w-full min-h-[300px] relative">
          <ResponsiveContainer width="99%" height={300}>
            <AreaChart data={data.dailyStats}>
              <defs>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="completions" 
                stroke="#7c3aed" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCompletions)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
