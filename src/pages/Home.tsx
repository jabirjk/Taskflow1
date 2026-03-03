import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Shield, Clock, ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES, User } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [taskers, setTaskers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/users/taskers')
      .then(res => res.json())
      .then(data => setTaskers(data.slice(0, 3)));

    if (user) {
      fetch(`/api/users/${user.id}/suggestions`)
        .then(res => res.json())
        .then(data => setSuggestions(data));
    }
  }, [user]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 via-slate-50/50 to-slate-50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tight text-slate-900"
          >
            Your tasks, <br />
            <span className="text-emerald-600">handled with care.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Connect with trusted local taskers for everything from furniture assembly to home repairs. Modern, reliable, and professional.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto glass p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link 
              to={`/browse?q=${searchQuery}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Find a Tasker
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {suggestions.length > 0 && (
              <div className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Suggested for you</div>
            )}
            {(suggestions.length > 0 ? suggestions : CATEGORIES.slice(0, 5)).map((cat) => (
              <Link 
                key={cat}
                to={`/browse?category=${cat}`}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm font-medium flex items-center gap-2"
              >
                {suggestions.length > 0 && <Sparkles className="w-3 h-3 text-emerald-500" />}
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Vetted Professionals", desc: "Every tasker undergoes a rigorous background check and skill verification." },
            { icon: Star, title: "Top Rated Service", desc: "Our community ratings ensure you get the highest quality of work every time." },
            { icon: Clock, title: "Instant Booking", desc: "Find help in minutes. Schedule at your convenience with real-time availability." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Taskers */}
      <section className="container mx-auto px-6 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold">Top Rated Taskers</h2>
            <p className="text-slate-600">The most reliable hands in your neighborhood.</p>
          </div>
          <Link to="/browse" className="text-emerald-600 font-semibold hover:underline flex items-center gap-2">
            View all taskers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {taskers.map((tasker, i) => (
            <motion.div 
              key={tasker.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden card-hover"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={tasker.avatar} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={tasker.name}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {tasker.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{tasker.name}</h3>
                  <p className="text-slate-500 text-sm">{tasker.bio?.substring(0, 80)}...</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tasker.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">${tasker.hourly_rate}/hr</span>
                  <Link 
                    to={`/profile/${tasker.id}`}
                    className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1"
                  >
                    View Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section className="container mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-transparent" />
            <div className="grid grid-cols-8 gap-4 p-8">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="h-12 w-12 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Powered by TaskFlow AI
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Not sure what you need? <br />
              <span className="text-emerald-400">Let our AI help.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Describe your task in plain English, and our smart matching engine will suggest the right category, estimated duration, and the best taskers for the job.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/post-task" className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all">
                Try AI Assistant
              </Link>
              <Link to="/care" className="px-8 py-4 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400" />
                Explore Care Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
