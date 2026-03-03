import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Shield, Briefcase, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [taskers, setTaskers] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    fetch('/api/users/taskers')
      .then(res => res.json())
      .then(setTaskers);
  }, [user, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold">Welcome back to <span className="text-emerald-600">TaskFlow</span></h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Sign in to manage your tasks, connect with professionals, or grow your tasking business.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-100 space-y-2">
              <div className="text-emerald-600 font-bold text-2xl">10k+</div>
              <div className="text-slate-500 text-sm">Active Taskers</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-100 space-y-2">
              <div className="text-emerald-600 font-bold text-2xl">99%</div>
              <div className="text-slate-500 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Choose your role</h2>
            <p className="text-slate-500">Select a mock account to explore the platform</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => login('c1')}
              className="w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">I'm a Client</div>
                  <div className="text-sm text-slate-500">Jane Doe (Mock Client)</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-slate-400 bg-white px-4">Or sign in as Tasker</div>
            </div>

            <div className="space-y-3">
              {taskers.map(tasker => (
                <button 
                  key={tasker.id}
                  onClick={() => login(tasker.id)}
                  className="w-full p-4 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img src={tasker.avatar} className="w-10 h-10 rounded-full object-cover" alt={tasker.name} />
                    <div className="text-left">
                      <div className="font-bold">{tasker.name}</div>
                      <div className="text-xs text-slate-500">{tasker.skills[0]} Expert</div>
                    </div>
                  </div>
                  <Briefcase className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>

            <button 
              onClick={() => login('admin')}
              className="w-full p-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
            >
              <Shield className="w-5 h-5" />
              Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
