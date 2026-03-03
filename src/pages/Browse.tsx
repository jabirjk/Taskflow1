import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, List, Filter, Star, Shield, ArrowRight, Zap, BrainCircuit, Briefcase, MapPin, Clock, Search, X, SlidersHorizontal, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Browse() {
  const { user } = useAuth();
  const [view, setView] = useState<'grid' | 'map' | 'split'>('split');
  const [taskers, setTaskers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiMatching, setAiMatching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const endpoint = user?.role === 'tasker' ? '/api/tasks' : '/api/users/taskers';
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (user?.role === 'tasker') {
          setTasks(data.filter((t: any) => t.status === 'open'));
        } else {
          setTaskers(data);
        }
        setLoading(false);
      });
  }, [user]);

  const triggerAiMatch = () => {
    setAiMatching(true);
    setTimeout(() => {
      if (user?.role === 'tasker') {
        const ranked = [...tasks].sort((a, b) => b.price - a.price);
        setTasks(ranked);
      } else {
        const ranked = [...taskers].sort((a, b) => b.rating - a.rating);
        setTaskers(ranked);
      }
      setAiMatching(false);
    }, 1500);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesPrice = t.price >= priceRange[0] && t.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredTaskers = taskers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || t.skills.includes(selectedCategory);
    const matchesPrice = (t.hourly_rate || 0) >= priceRange[0] && (t.hourly_rate || 0) <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-white dark:bg-slate-950">
      {/* Minimal Header / Filter Bar */}
      <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6 z-30 bg-white dark:bg-slate-950">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={user?.role === 'tasker' ? "Search tasks..." : "Search taskers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-bold ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            {[
              { id: 'grid', icon: List, label: 'List' },
              { id: 'split', icon: Map, label: 'Split' },
              { id: 'map', icon: Map, label: 'Map' }
            ].map((v) => (
              <button 
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${view === v.id ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                <v.icon className="w-3.5 h-3.5" /> {v.label}
              </button>
            ))}
          </div>

          <button 
            onClick={triggerAiMatch}
            disabled={aiMatching}
            className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {aiMatching ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
            AI Smart Match
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Filters (Overlay) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-40 p-8 space-y-8 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Smart Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-emerald-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Range</label>
                  <span className="text-xs font-bold text-emerald-600">${priceRange[0]} - ${priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-emerald-600"
                />
              </div>

              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange([0, 200]);
                }}
                className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List View */}
        {(view === 'grid' || view === 'split') && (
          <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar`}>
            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {user?.role === 'tasker' ? (
                filteredTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))
              ) : (
                filteredTaskers.map((tasker, i) => (
                  <TaskerCard key={tasker.id} tasker={tasker} index={i} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Map View */}
        {(view === 'map' || view === 'split') && (
          <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} relative bg-slate-200 dark:bg-slate-900`}>
            {/* Simulated Map */}
            <div className="absolute inset-0 opacity-40 dark:opacity-20 grayscale">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Map" />
            </div>
            
            {/* Map Markers (Simulated) */}
            {(user?.role === 'tasker' ? filteredTasks : filteredTaskers).slice(0, 8).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute"
                style={{ 
                  left: `${20 + (i * 12) % 60}%`, 
                  top: `${15 + (i * 18) % 70}%` 
                }}
              >
                <div className="group relative">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform border-2 border-white dark:border-slate-800">
                    {user?.role === 'tasker' ? <Briefcase className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 whitespace-nowrap">
                      <p className="text-xs font-bold">{(item as any).title || item.name}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">${(item as any).price || item.hourly_rate}/{user?.role === 'tasker' ? 'fixed' : 'hr'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-all">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-all">
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, index }: { task: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900 dark:text-white">${task.price}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.price_type}</div>
        </div>
      </div>
      <div className="space-y-1">
        <Link to={`/tasks/${task.id}`}>
          <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">{task.title}</h3>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-xs leading-relaxed">{task.description}</p>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">
        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {task.location}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> New</div>
      </div>
      <Link 
        to={`/tasks/${task.id}`}
        className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all block text-center"
      >
        View Details
      </Link>
    </motion.div>
  );
}

function TaskerCard({ tasker, index }: { tasker: User, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="relative h-40">
        <img src={tasker.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tasker.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center gap-1 text-white">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold">{tasker.rating}</span>
          </div>
          <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
            ${tasker.hourly_rate}/hr
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{tasker.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{tasker.bio}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tasker.skills.slice(0, 2).map(skill => (
            <span key={skill} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-wider">
              {skill}
            </span>
          ))}
        </div>

        <Link 
          to={`/profile/${tasker.id}`}
          className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-all"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

function Plus(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}

function Minus(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>;
}
