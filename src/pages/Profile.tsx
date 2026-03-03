import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Shield, CheckCircle2, MessageSquare, Calendar, ArrowLeft, Clock } from 'lucide-react';
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
                <h1 className="text-5xl font-display font-bold">{tasker.name}</h1>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Elite Tasker
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900 font-bold">{tasker.rating}</span>
                  <span>({tasker.completed_tasks} tasks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Background Checked</span>
                </div>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed">{tasker.bio}</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasker.skills.map(skill => (
                <div key={skill} className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between group hover:border-emerald-500 transition-all">
                  <div className="space-y-1">
                    <h3 className="font-bold">{skill}</h3>
                    <p className="text-sm text-slate-500">Expert level • 50+ tasks</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="p-8 rounded-[2rem] bg-slate-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src={review.reviewer_avatar} className="w-10 h-10 rounded-full object-cover" alt={review.reviewer_name} />
                      <div>
                        <h4 className="font-bold">{review.reviewer_name}</h4>
                        <p className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">"{review.comment}"</p>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400 font-bold bg-slate-50 rounded-[2rem]">
                  No reviews yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Card */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 space-y-8">
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
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="">Choose an open task...</option>
                    {myTasks.map(task => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <button className="w-full p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Select Date & Time</span>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Chat with {tasker.name.split(' ')[0]}</span>
                </div>
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Est.</span>
                <span>${(tasker.hourly_rate || 0) + 5}</span>
              </div>
            </div>

            <button 
              onClick={handleBook}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
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
