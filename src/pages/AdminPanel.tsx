import React from 'react';
import { motion } from 'motion/react';
import { Activity, Users, ShoppingBag, AlertTriangle, TrendingUp, Map as MapIcon, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', tasks: 400, revenue: 2400 },
  { name: 'Tue', tasks: 300, revenue: 1398 },
  { name: 'Wed', tasks: 200, revenue: 9800 },
  { name: 'Thu', tasks: 278, revenue: 3908 },
  { name: 'Fri', tasks: 189, revenue: 4800 },
  { name: 'Sat', tasks: 239, revenue: 3800 },
  { name: 'Sun', tasks: 349, revenue: 4300 },
];

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="container mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Platform Overview</h1>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium">
              Last 24 Hours
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all">
              Export Report
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Users', value: '12,842', change: '+12%', icon: Users, color: 'text-blue-400' },
            { label: 'Total Revenue', value: '$42,920', change: '+8%', icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Open Tasks', value: '1,204', change: '-3%', icon: ShoppingBag, color: 'text-purple-400' },
            { label: 'System Health', value: '99.98%', change: 'Stable', icon: Activity, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">AI Fraud Alerts</h3>
              <div className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">High Priority</div>
            </div>
            <div className="space-y-4">
              {[
                { user: 'User #9281', issue: 'Rapid rating manipulation detected', time: '2m ago' },
                { user: 'User #1029', issue: 'Suspicious messaging pattern', time: '14m ago' },
                { user: 'User #4492', issue: 'Multiple account collusion flag', time: '1h ago' },
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-all cursor-pointer">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">{alert.user}</div>
                    <div className="text-xs text-slate-500">{alert.issue}</div>
                    <div className="text-[10px] text-slate-600 font-mono uppercase">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all">
              View All Security Logs
            </button>
          </div>
        </div>

        {/* Demand Heatmap Simulation */}
        <div className="p-12 rounded-[3rem] bg-emerald-600/10 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
            <MapIcon className="w-full h-full text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl font-bold text-white">Demand Heatmapping</h2>
            <p className="text-slate-400 leading-relaxed">
              TaskFlow AI predicts demand spikes in real-time. Currently, San Francisco is experiencing a 40% surge in 'Furniture Assembly' requests. Dynamic pricing has been automatically adjusted by +15% to balance the marketplace.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm">View Live Heatmap</button>
              <button className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold text-sm border border-white/10">Adjust Surge Multiplier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
