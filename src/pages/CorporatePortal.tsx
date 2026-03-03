import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Users, FileText, Key, BarChart3, 
  Plus, Search, Filter, ArrowUpRight, 
  Settings, Download, Briefcase, ShieldCheck,
  Mail, MoreVertical, Trash2, Edit2, CreditCard,
  ArrowDownRight, CheckCircle2, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function CorporatePortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'api' | 'billing'>('overview');
  const [apiKey, setApiKey] = useState('tf_live_xxxxxxxxxxxxxxxxxxxx');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin' && !user.is_corporate) {
      // navigate('/dashboard');
    }
  }, [user]);

  const stats = [
    { label: 'Active Tasks', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Team Members', value: '8', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Monthly Spend', value: '$4,250', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Insurance Coverage', value: 'Active', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 dark:bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Enterprise Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Managing: Acme Corp Global</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <Link to="/post-task" className="bg-slate-900 dark:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20">
              <Plus className="w-4 h-4" /> New Corporate Task
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'team', label: 'Team Management', icon: Users },
            { id: 'api', label: 'API & Integrations', icon: Key },
            { id: 'billing', label: 'Billing & Invoices', icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white">Recent Team Activity</h3>
                    <button className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <img src={`https://picsum.photos/seed/user${i}/40`} alt="User" />
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-white">John Wilson <span className="text-slate-400 font-normal">posted a new task</span></p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Office Maintenance • 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded-full uppercase">In Progress</span>
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <ArrowUpRight className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold dark:text-white">Team Members</h3>
                  <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all">
                    <Plus className="w-4 h-4" /> Invite Member
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Member</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tasks</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {[
                        { name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', status: 'Active', tasks: 12 },
                        { name: 'Michael Ross', email: 'michael@acme.com', role: 'Manager', status: 'Active', tasks: 8 },
                        { name: 'Elena Gilbert', email: 'elena@acme.com', role: 'Member', status: 'Pending', tasks: 0 },
                        { name: 'David Kim', email: 'david@acme.com', role: 'Member', status: 'Active', tasks: 5 },
                      ].map((member, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <img src={`https://picsum.photos/seed/member${i}/40`} alt="" />
                              </div>
                              <div>
                                <p className="text-sm font-bold dark:text-white">{member.name}</p>
                                <p className="text-xs text-slate-400">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-medium dark:text-slate-300">{member.role}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${member.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold dark:text-white">{member.tasks}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div 
                key="api"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-slate-900 dark:bg-emerald-600 text-white p-10 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-emerald-900/20">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold">Enterprise API Access</h3>
                    <p className="text-slate-400 dark:text-emerald-50 max-w-lg">Integrate TaskFlow directly into your internal ERP or property management software. Automate task creation and reporting at scale.</p>
                    <div className="flex gap-4 pt-4">
                      <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm">Documentation</button>
                      <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm border border-white/10">API Reference</button>
                    </div>
                  </div>
                  <Key className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold dark:text-white">Live API Key</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Use this key to authenticate your server-side requests.</p>
                    </div>
                    <button className="text-emerald-600 text-sm font-bold">Regenerate Key</button>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <code className="flex-1 font-mono text-sm dark:text-emerald-400">
                      {showKey ? apiKey : 'tf_live_••••••••••••••••••••••••'}
                    </code>
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Plan</p>
                        <h4 className="text-2xl font-bold dark:text-white">Enterprise Pro</h4>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <CreditCard className="w-5 h-5" />
                      <span>Visa ending in 4242</span>
                    </div>
                    <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm">
                      Manage Subscription
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Invoice</p>
                      <h4 className="text-2xl font-bold dark:text-white">$1,250.00</h4>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Due on {format(new Date(Date.now() + 15 * 86400000), 'MMMM d, yyyy')}</p>
                    <button className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all text-sm">
                      Pay Now
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white">Invoice History</h3>
                    <button className="text-emerald-600 text-sm font-bold hover:underline">Download All</button>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {[
                      { id: 'INV-2026-001', date: '2026-01-01', amount: 1250, status: 'Paid' },
                      { id: 'INV-2025-012', date: '2025-12-01', amount: 1250, status: 'Paid' },
                      { id: 'INV-2025-011', date: '2025-11-01', amount: 1250, status: 'Paid' },
                    ].map((inv) => (
                      <div key={inv.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-white">{inv.id}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(inv.date), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-sm font-bold dark:text-white">${inv.amount.toFixed(2)}</span>
                          <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full uppercase">{inv.status}</span>
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
