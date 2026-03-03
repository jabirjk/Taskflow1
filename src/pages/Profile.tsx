import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Shield, CheckCircle2, MessageSquare, Calendar, ArrowLeft, Clock, Activity, AlertTriangle, ShieldCheck, Award, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { User, Review, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [tasker, setTasker] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setTasker(data);
        setLoading(false);
      });

    // Fetch reviews
    fetch(`/api/users/${id}/reviews`)
      .then(res => res.json())
      .then(setReviews);

    // Fetch current user's open tasks if they are a client
    if (currentUser?.role === 'client') {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          setMyTasks(data.filter((t: Task) => t.client_id === currentUser.id && t.status === 'open'));
        });
    }
  }, [id, currentUser]);

  const handleBook = async () => {
    if (!currentUser || !selectedTask) {
      alert('Please select one of your open tasks to book this tasker.');
      return;
    }

    const bookingData = {
      task_id: selectedTask,
      tasker_id: id,
      client_id: currentUser.id,
      scheduled_at: new Date(Date.now() + 86400000).toISOString()
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (res.ok) {
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading profile...</div>;
  if (!tasker) return <div className="p-20 text-center">Tasker not found.</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-12">
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
              <img src={tasker.avatar} className="w-full h-full object-cover" alt={tasker.name} />
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-5xl font-display font-bold dark:text-white">{tasker.name}</h1>
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Elite Tier
                </div>
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-full text-sm font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Badge
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900 dark:text-white font-bold">{tasker.rating}</span>
                  <span>({tasker.completed_tasks} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">{tasker.bio}</p>
            </div>
          </section>

          {/* Trust & Performance Metrics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold dark:text-white">98%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold dark:text-white">95%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">On-Time</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold dark:text-white">1.2%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cancellation</div>
            </div>
            <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full" />
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center mb-2 z-10">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 z-10">99/100</div>
              <div className="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400 uppercase tracking-widest z-10">AI Behavior Score</div>
            </div>
          </section>

          {/* AI Trust Report (Visible to all for transparency, or just admins/clients) */}
          <section className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 border border-slate-800 space-y-6 text-white">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold">AI Trust & Safety Report</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <MessageSquare className="w-4 h-4" /> Fake Review Check
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Passed (0 detected)
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <Users className="w-4 h-4" /> Collusion Detection
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Clear Network
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <AlertTriangle className="w-4 h-4" /> Behavioral Anomalies
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Normal Patterns
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasker.skills.map(skill => (
                <div key={skill} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
                  <div className="space-y-1">
                    <h3 className="font-bold dark:text-white">{skill}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Expert level • 50+ tasks</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-500/10 transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Written Reviews</h2>
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src={review.reviewer_avatar} className="w-10 h-10 rounded-full object-cover" alt={review.reviewer_name} />
                      <div>
                        <h4 className="font-bold dark:text-white">{review.reviewer_name}</h4>
                        <p className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">"{review.comment}"</p>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  No reviews yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Card */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-bold text-emerald-600">${tasker.hourly_rate}</span>
                <span className="text-slate-400 font-medium">/hr</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">Available Today</div>
                <div className="text-xs text-slate-400">Next slot: 2:00 PM</div>
              </div>
            </div>

            <div className="space-y-4">
              {currentUser?.role === 'client' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select your task</label>
                  <select 
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  >
                    <option value="">Choose an open task...</option>
                    {myTasks.map(task => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <button className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-medium dark:text-white">Select Date & Time</span>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  <span className="font-medium dark:text-white">Chat with {tasker.name.split(' ')[0]}</span>
                </div>
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Service Fee</span>
                <span className="font-medium dark:text-white">$5.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="dark:text-white">Total Est.</span>
                <span className="dark:text-white">${(tasker.hourly_rate || 0) + 5}</span>
              </div>
            </div>

            <button 
              onClick={handleBook}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              Confirm Booking
            </button>

            <p className="text-center text-xs text-slate-400">
              You won't be charged until the task is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
