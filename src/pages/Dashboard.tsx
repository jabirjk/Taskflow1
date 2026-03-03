import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MessageSquare, CheckCircle2, ChevronRight, Star, 
  TrendingUp, DollarSign, Briefcase, MapPin, Wallet, ArrowUpRight, 
  ArrowDownLeft, Building2, ShieldCheck, Zap, Repeat, ListTodo, 
  Activity, Bell, Settings as SettingsIcon, Plus, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, Task, Transaction } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ReviewModal } from '../components/ReviewModal';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [wallet, setWallet] = useState<{ balance: number, transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tasks' | 'wallet'>('overview');
  const [reviewingTask, setReviewingTask] = useState<{ id: string, title: string, tasker_id: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setLoading(true);
      // Fetch bookings
      fetch(`/api/bookings/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        });

      // Fetch wallet
      fetch(`/api/users/${user.id}/wallet`)
        .then(res => res.json())
        .then(setWallet);

      // Fetch client's tasks
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          const myTasks = data.filter((t: Task) => t.client_id === user.id);
          setTasks(myTasks);
          
          // Fetch bids for each task (simplified for demo)
          if (myTasks.length > 0) {
            fetch(`/api/tasks/${myTasks[0].id}/bids`)
              .then(res => res.json())
              .then(setBids);
          }
        });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || loading) return <div className="p-20 text-center dark:text-white">Loading your workspace...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Personalized Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img src={user.avatar} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl" alt={user.name} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white dark:border-slate-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  {user.subscription_plan && (
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {user.subscription_plan}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> San Francisco, CA • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/settings')} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-slate-700">
                <SettingsIcon className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-slate-700">
                <Bell className="w-5 h-5" />
              </button>
              {user.role === 'client' && (
                <Link to="/post-task" className="bg-slate-900 dark:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20">
                  <Plus className="w-5 h-5" /> Post Task
                </Link>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-8 mt-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'bookings', label: user.role === 'client' ? 'My Bookings' : 'My Schedule', icon: Calendar },
              { id: 'tasks', label: 'My Tasks', icon: ListTodo },
              { id: 'wallet', label: 'Wallet', icon: Wallet }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 font-bold pb-4 transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Earnings" value={`$${user.completed_tasks * 45}`} icon={DollarSign} color="text-emerald-600" />
                <StatCard label="Active Jobs" value={bookings.length.toString()} icon={Briefcase} color="text-blue-600" />
                <StatCard label="Rating" value={user.rating.toString()} icon={Star} color="text-yellow-500" />
                <StatCard label="Wallet" value={`$${wallet?.balance.toFixed(2) || '0.00'}`} icon={Wallet} color="text-purple-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Task Timeline / Progress */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold dark:text-white">Active Progress</h3>
                    <Link to="/browse" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
                      View all <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {bookings.length > 0 ? bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="text-xl font-bold dark:text-white">{booking.task_title}</h4>
                                <p className="text-sm text-slate-500">With {booking.other_party_name}</p>
                              </div>
                              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                {booking.status}
                              </span>
                            </div>

                            {/* Timeline Component */}
                            <div className="relative pt-4 pb-8">
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-1000" 
                                style={{ width: booking.status === 'confirmed' ? '50%' : booking.status === 'completed' ? '100%' : '25%' }}
                              />
                              <div className="relative flex justify-between">
                                {[
                                  { label: 'Booked', done: true },
                                  { label: 'In Progress', done: booking.status !== 'pending' },
                                  { label: 'Review', done: booking.status === 'completed' },
                                  { label: 'Paid', done: booking.status === 'completed' }
                                ].map((step, i) => (
                                  <div key={step.label} className="flex flex-col items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center z-10 transition-all ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step.done ? 'text-emerald-600' : 'text-slate-400'}`}>{step.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="md:w-48 flex flex-col gap-3">
                            <button onClick={() => navigate('/chat')} className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                              <MessageSquare className="w-4 h-4" /> Message
                            </button>
                            <Link to={`/tasks/${booking.task_id}`} className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all text-center">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No active tasks at the moment</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar: Quick Stats / Tips */}
                <div className="space-y-8">
                  <div className="bg-slate-900 dark:bg-emerald-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-200 dark:shadow-emerald-900/20">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-emerald-400 dark:text-white" />
                      <h3 className="text-xl font-bold">AI Insights</h3>
                    </div>
                    <p className="text-slate-300 dark:text-emerald-50 text-sm leading-relaxed">
                      "Based on your profile, you're 40% more likely to be hired for <b>Plumbing</b> tasks this weekend. Consider updating your availability."
                    </p>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-sm">
                      View Full Report
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6">
                    <h3 className="font-bold dark:text-white">Recent Activity</h3>
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-white">New bid received</p>
                            <p className="text-xs text-slate-500">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6"
            >
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-center">
                  <img src={booking.other_party_avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold dark:text-white">{booking.task_title}</h4>
                    <p className="text-sm text-slate-500">{booking.other_party_name} • {format(new Date(booking.scheduled_at), 'MMM d, h:mm a')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/chat')} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6"
            >
              {tasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold dark:text-white">{task.title}</h4>
                    <p className="text-sm text-slate-500">{task.category} • {task.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">${task.price}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{task.status}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'wallet' && wallet && (
            <motion.div 
              key="wallet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-800 rounded-[3rem] p-12 text-white shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-slate-400 dark:text-emerald-100 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                    <h2 className="text-6xl font-bold">${wallet.balance.toFixed(2)}</h2>
                  </div>
                  <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-xl">
                    <Wallet className="w-10 h-10" />
                  </div>
                </div>
                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    Withdraw Funds
                  </button>
                  <button className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">
                    Add Card
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold px-4 dark:text-white">Transaction History</h3>
                {wallet.transactions.map(tx => (
                  <div key={tx.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">{tx.description}</p>
                        <p className="text-xs text-slate-500">{format(new Date(tx.created_at), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'dark:text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">{label}</div>
        <div className="text-3xl font-bold dark:text-white mt-1">{value}</div>
      </div>
    </div>
  );
}
