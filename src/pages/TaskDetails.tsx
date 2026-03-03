import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, DollarSign, User, Star, Shield, 
  ArrowLeft, MessageSquare, CheckCircle2, AlertCircle, ShieldCheck, 
  Zap, Repeat, Activity, ArrowRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Bid } from '../types';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetch(`/api/tasks`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((t: Task) => t.id === id);
        setTask(found);
        if (found) {
          if (found.status === 'open') setActiveStep(0);
          else if (found.status === 'assigned') setActiveStep(1);
          else if (found.status === 'completed') setActiveStep(3);
        }
        setLoading(false);
      });

    fetch(`/api/tasks/${id}/bids`)
      .then(res => res.json())
      .then(setBids);
  }, [id]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !task) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task.id,
          tasker_id: user.id,
          amount: parseFloat(bidAmount),
          message: bidMessage
        })
      });

      if (res.ok) {
        setBidAmount('');
        setBidMessage('');
        fetch(`/api/tasks/${id}/bids`)
          .then(res => res.json())
          .then(setBids);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const acceptBid = async (bidId: string) => {
    const res = await fetch(`/api/bids/${bidId}/accept`, { method: 'POST' });
    if (res.ok) {
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="p-20 text-center dark:text-white">Loading task details...</div>;
  if (!task) return <div className="p-20 text-center dark:text-white">Task not found.</div>;

  const isOwner = user?.id === task.client_id;
  const hasBid = bids.some(b => b.tasker_id === user?.id);

  const steps = [
    { label: 'Open', desc: 'Accepting bids' },
    { label: 'Assigned', desc: 'Tasker hired' },
    { label: 'In Progress', desc: 'Work started' },
    { label: 'Completed', desc: 'Task finished' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      {/* Dynamic Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pt-12 pb-12">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition-colors text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </button>

          <div className="flex flex-col lg:flex-row justify-between gap-12">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  {task.status}
                </span>
                {task.surge_multiplier && task.surge_multiplier > 1 && (
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Surge x{task.surge_multiplier}
                  </span>
                )}
                {task.insurance_status === 'active' && (
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Insured
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h1>
              <div className="flex flex-wrap gap-8 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-500" /> {task.location}</div>
                <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-500" /> {format(new Date(task.created_at), 'MMM d, yyyy')}</div>
                <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> {task.category}</div>
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200 dark:shadow-emerald-900/10 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Budget</p>
                    <span className="text-4xl font-bold text-emerald-600">${task.price}</span>
                    <span className="text-slate-400 font-bold text-sm uppercase ml-2">{task.price_type}</span>
                  </div>
                </div>
                
                {user?.role === 'tasker' && task.status === 'open' && !hasBid && (
                  <button className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    Place a Bid <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {hasBid && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold">Your bid is active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {/* Task Timeline */}
            <section className="space-y-8">
              <h2 className="text-2xl font-bold dark:text-white">Task Timeline</h2>
              <div className="relative flex justify-between">
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step, i) => (
                  <div key={step.label} className="relative z-10 flex flex-col items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center transition-all duration-500 ${i <= activeStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      {i < activeStep ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold uppercase tracking-widest ${i <= activeStep ? 'text-emerald-600' : 'text-slate-400'}`}>{step.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 hidden md:block">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold dark:text-white">Description</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{task.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Insurance</p>
                    <p className="font-bold dark:text-white">{task.insurance_status === 'active' ? 'Fully Protected' : 'Standard Protection'}</p>
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Frequency</p>
                    <p className="font-bold dark:text-white">{task.is_recurring ? task.recurrence_pattern : 'One-time Task'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Bids Received</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-bold">{bids.length} Total</span>
              </div>
              <div className="space-y-6">
                {bids.map((bid, i) => (
                  <motion.div 
                    key={bid.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center hover:shadow-2xl transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={bid.tasker_avatar} className="w-20 h-20 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg" alt="" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white dark:border-slate-800 flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold dark:text-white group-hover:text-emerald-600 transition-colors">{bid.tasker_name}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {bid.tasker_rating} Rating • 50+ Jobs
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600">${bid.amount}</div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">"{bid.message}"</p>
                    </div>
                    {isOwner && task.status === 'open' && (
                      <button 
                        onClick={() => acceptBid(bid.id)}
                        className="w-full md:w-auto px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20"
                      >
                        Hire Now
                      </button>
                    )}
                  </motion.div>
                ))}
                {bids.length === 0 && (
                  <div className="p-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Be the first to bid on this task!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-bold dark:text-white">Safety & Trust</h3>
              <div className="space-y-6">
                {[
                  { title: 'Identity Verified', icon: User },
                  { title: 'Secure Payments', icon: DollarSign },
                  { title: '24/7 Support', icon: MessageSquare }
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold dark:text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-emerald-900/20">
              <h3 className="text-xl font-bold">Need help?</h3>
              <p className="text-emerald-50 text-sm leading-relaxed">Our AI concierge is available 24/7 to help you with task details or matching.</p>
              <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all">
                Chat with Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
