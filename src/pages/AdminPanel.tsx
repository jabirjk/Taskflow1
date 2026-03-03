import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Users, ShoppingBag, AlertTriangle, TrendingUp, Map as MapIcon, 
  ShieldCheck, Settings, FileText, Scale, BrainCircuit, Zap, CheckCircle2, 
  XCircle, Search, Filter, MoreVertical, DollarSign, ShieldAlert, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', tasks: 400, revenue: 2400, demand: 65 },
  { name: 'Tue', tasks: 300, revenue: 1398, demand: 50 },
  { name: 'Wed', tasks: 200, revenue: 9800, demand: 80 },
  { name: 'Thu', tasks: 278, revenue: 3908, demand: 55 },
  { name: 'Fri', tasks: 189, revenue: 4800, demand: 40 },
  { name: 'Sat', tasks: 239, revenue: 3800, demand: 70 },
  { name: 'Sun', tasks: 349, revenue: 4300, demand: 90 },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tasks' | 'fraud' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-white/5 p-6 space-y-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">Super Panel</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Admin Access</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Analytics & Heatmaps', icon: BarChart3 },
            { id: 'users', label: 'Users & KYC', icon: Users },
            { id: 'tasks', label: 'Tasks & Disputes', icon: Scale },
            { id: 'fraud', label: 'Fraud & AI Alerts', icon: ShieldAlert },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Engine Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Dynamic Pricing</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Risk Scoring</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Demand Forecast</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-display font-bold text-white">Analytics Dashboard</h1>
                  <p className="text-slate-400 mt-1">Real-time platform metrics and demand forecasting.</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all">
                  Export Report
                </button>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Users', value: '12,842', change: '+12%', icon: Users, color: 'text-blue-400' },
                  { label: 'Total Revenue', value: '$42,920', change: '+8%', icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Open Tasks', value: '1,204', change: '-3%', icon: ShoppingBag, color: 'text-purple-400' },
                  { label: 'AI Match Rate', value: '94.2%', change: '+2.1%', icon: BrainCircuit, color: 'text-indigo-400' },
                ].map((stat, i) => (
                  <div key={stat.label} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Revenue & Task Volume</h3>
                    <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-300 outline-none">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
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
                  <h3 className="text-xl font-bold text-white">Demand Forecasting</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{fill: '#ffffff05'}}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        />
                        <Bar dataKey="demand" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <BrainCircuit className="w-4 h-4" /> AI Prediction
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Expect a 25% surge in 'Moving Help' this weekend. Dynamic pricing will automatically adjust to +15% to incentivize taskers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Demand Heatmap Simulation */}
              <div className="p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-6 max-w-xl">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <MapIcon className="w-8 h-8 text-emerald-500" /> Live Demand Heatmap
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                      Visualize real-time task requests across regions. Our ML models identify underserved areas and automatically deploy targeted push notifications to nearby taskers.
                    </p>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-colors">Open Interactive Map</button>
                    </div>
                  </div>
                  <div className="w-full md:w-72 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <span className="text-sm font-bold">San Francisco</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-md">High Demand</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <span className="text-sm font-bold">New York</span>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-md">Surging</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <span className="text-sm font-bold">Austin</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md">Balanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-display font-bold text-white">Users & KYC</h1>
                  <p className="text-slate-400 mt-1">Manage accounts, approve verifications, and monitor risk scores.</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-emerald-500" />
                  </div>
                  <button className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </header>

              <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">KYC Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">AI Risk Score</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { name: 'Alex Johnson', email: 'alex@example.com', role: 'Tasker', kyc: 'Pending', risk: 'Low (12/100)', riskColor: 'text-emerald-400' },
                      { name: 'Sarah Smith', email: 'sarah@example.com', role: 'Client', kyc: 'Approved', risk: 'Low (5/100)', riskColor: 'text-emerald-400' },
                      { name: 'Mike Davis', email: 'mike@example.com', role: 'Tasker', kyc: 'Rejected', risk: 'High (89/100)', riskColor: 'text-red-400' },
                      { name: 'Emily Chen', email: 'emily@example.com', role: 'Tasker', kyc: 'Approved', risk: 'Medium (45/100)', riskColor: 'text-orange-400' },
                    ].map((user, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
                              <img src={`https://picsum.photos/seed/user${i}/40`} alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-300">{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            user.kyc === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                            user.kyc === 'Pending' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {user.kyc}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className={`w-4 h-4 ${user.riskColor}`} />
                            <span className={`text-sm font-bold ${user.riskColor}`}>{user.risk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.kyc === 'Pending' && (
                              <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500">Approve KYC</button>
                            )}
                            {user.risk.includes('High') && (
                              <button className="px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg hover:bg-red-600/40">Suspend</button>
                            )}
                            <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-display font-bold text-white">Tasks & Disputes</h1>
                  <p className="text-slate-400 mt-1">Monitor all platform activity and mediate disputes with AI assistance.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-white">Active Disputes</h3>
                  {[
                    { id: 'DSP-8921', task: 'Deep Clean 3BR Apartment', client: 'Sarah S.', tasker: 'Mike D.', status: 'Needs Review', aiSuggestion: 'Refund Client (Tasker no-show)' },
                    { id: 'DSP-8922', task: 'Assemble IKEA Wardrobe', client: 'John W.', tasker: 'Alex J.', status: 'In Mediation', aiSuggestion: 'Split 50/50 (Miscommunication)' },
                  ].map((dispute, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase rounded-md">{dispute.status}</span>
                            <span className="text-xs text-slate-500 font-mono">{dispute.id}</span>
                          </div>
                          <h4 className="font-bold text-white text-lg">{dispute.task}</h4>
                          <p className="text-sm text-slate-400">Client: {dispute.client} • Tasker: {dispute.tasker}</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700">Review</button>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                        <BrainCircuit className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">AI Mediation Assistant</p>
                          <p className="text-sm text-slate-300">Based on chat history and platform policies, the suggested resolution is: <strong className="text-white">{dispute.aiSuggestion}</strong></p>
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500">Apply Suggestion</button>
                            <button className="px-3 py-1.5 bg-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/10">Override</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                    {[
                      { title: 'Fix Leaky Faucet', status: 'Completed', price: '$85' },
                      { title: 'Move Heavy Sofa', status: 'In Progress', price: '$120' },
                      { title: 'Yard Cleanup', status: 'Open', price: '$150' },
                      { title: 'TV Mounting', status: 'Assigned', price: '$90' },
                    ].map((task, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-white">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.status}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">{task.price}</span>
                      </div>
                    ))}
                    <button className="w-full py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">View All Tasks</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'fraud' && (
            <motion.div 
              key="fraud"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-display font-bold text-white">Fraud & AI Alerts</h1>
                  <p className="text-slate-400 mt-1">Real-time monitoring of suspicious activities and platform abuse.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">12</h3>
                    <p className="text-sm text-red-400 font-medium">Critical Alerts</p>
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">45</h3>
                    <p className="text-sm text-orange-400 font-medium">Warnings</p>
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">99.9%</h3>
                    <p className="text-sm text-emerald-400 font-medium">Platform Safety Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-xl font-bold text-white">Recent AI Security Alerts</h3>
                <div className="space-y-4">
                  {[
                    { type: 'Unusual Cancellation Spike', desc: 'Tasker #8829 cancelled 4 tasks in the last hour.', severity: 'High', time: '10m ago' },
                    { type: 'Suspicious Messaging', desc: 'User #1029 attempting to take payment off-platform.', severity: 'Critical', time: '25m ago' },
                    { type: 'Rapid Rating Manipulation', desc: 'Multiple 5-star reviews from same IP for Tasker #4492.', severity: 'High', time: '1h ago' },
                    { type: 'Identity Verification Failure', desc: 'Face mismatch detected during KYC for User #9921.', severity: 'Medium', time: '2h ago' },
                  ].map((alert, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg mt-1 ${
                          alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                          alert.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{alert.type}</h4>
                          <p className="text-sm text-slate-400 mt-1">{alert.desc}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-2">{alert.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700">Investigate</button>
                        {alert.severity === 'Critical' && (
                          <button className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-600/40">Auto-Suspend</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <header>
                <h1 className="text-3xl font-display font-bold text-white">Platform Settings</h1>
                <p className="text-slate-400 mt-1">Configure core platform economics and AI behaviors.</p>
              </header>

              <div className="space-y-8">
                {/* Economics */}
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold text-white">Platform Economics</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Base Commission Rate (%)</label>
                      <input type="number" defaultValue={5.0} className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                      <p className="text-xs text-slate-500">Standard fee applied to all completed tasks.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Instant Payout Fee (%)</label>
                      <input type="number" defaultValue={1.5} className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Boost Listing Price ($)</label>
                      <input type="number" defaultValue={4.99} className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Premium Badge Monthly ($)</label>
                      <input type="number" defaultValue={19.00} className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors">Save Economic Settings</button>
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCircuit className="w-6 h-6 text-indigo-500" />
                    <h3 className="text-xl font-bold text-white">AI Intelligence Layer</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5">
                      <div>
                        <h4 className="font-bold text-white">Dynamic Pricing Engine</h4>
                        <p className="text-sm text-slate-400">Automatically adjust prices based on real-time demand and supply.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5">
                      <div>
                        <h4 className="font-bold text-white">Automatic Task Categorization</h4>
                        <p className="text-sm text-slate-400">Use NLP to categorize tasks and suggest prices/duration.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5">
                      <div>
                        <h4 className="font-bold text-white">Personalized Homepage Feed</h4>
                        <p className="text-sm text-slate-400">Use ML models to rank taskers and tasks based on user preferences.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
