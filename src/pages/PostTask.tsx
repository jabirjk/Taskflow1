import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, DollarSign, Clock, Tag, ShieldCheck, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../types';

export default function PostTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('weekly');
  const [withInsurance, setWithInsurance] = useState(true);
  const [instantMatch, setInstantMatch] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      setAiResult(data);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const taskData = {
      client_id: user.id,
      title: formData.get('title'),
      description,
      category: aiResult?.category || formData.get('category'),
      price_type: 'hourly',
      price: aiResult?.suggestedPrice || 40,
      location: formData.get('location'),
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : null,
      insurance_status: withInsurance ? 'active' : 'none'
    };

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    const data = await res.json();
    if (res.ok) {
      if (instantMatch) {
        // Trigger instant match
        await fetch(`/api/tasks/${data.id}/instant-match`, { method: 'POST' });
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display font-bold">What do you need help with?</h1>
          <p className="text-slate-600 text-lg">Our AI will help you structure your task and find the best matches.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Describe your task</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., I need someone to help me move a heavy sofa from my living room to the second floor, and then assemble a new IKEA desk."
                      className="w-full h-48 p-6 rounded-3xl border-slate-100 bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500 text-lg resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={analyzing || !description.trim()}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing with TaskFlow AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                        Analyze Task
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
                        <input name="title" required defaultValue={description.substring(0, 40) + '...'} className="w-full p-4 rounded-xl border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Category</label>
                        <select name="category" defaultValue={aiResult?.category} className="w-full p-4 rounded-xl border-slate-200">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Location</label>
                        <input name="location" required placeholder="Enter your address" className="w-full p-4 rounded-xl border-slate-200" />
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="text-sm font-bold">Add Task Insurance</p>
                              <p className="text-[10px] text-slate-400">Coverage up to $1M</p>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={withInsurance}
                            onChange={(e) => setWithInsurance(e.target.checked)}
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-bold">Recurring Task</p>
                              <p className="text-[10px] text-slate-400">Automate your schedule</p>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        {isRecurring && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-2">
                            <select 
                              value={recurrencePattern}
                              onChange={(e) => setRecurrencePattern(e.target.value)}
                              className="w-full p-3 rounded-xl border-slate-200 text-sm"
                            >
                              <option value="weekly">Every Week</option>
                              <option value="biweekly">Every 2 Weeks</option>
                              <option value="monthly">Every Month</option>
                            </select>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-3xl p-8 space-y-6">
                      <h3 className="font-bold flex items-center gap-2 text-emerald-900">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                        AI Suggestions
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-slate-600">Suggested Rate</span>
                          </div>
                          <span className="font-bold text-emerald-600">${aiResult?.suggestedPrice}/hr</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-slate-600">Est. Duration</span>
                          </div>
                          <span className="font-bold text-emerald-600">{aiResult?.estimatedHours} hours</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 px-1">
                            <Tag className="w-4 h-4 text-emerald-600" />
                            Recommended Tags
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aiResult?.tags?.map((tag: string) => (
                              <span key={tag} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-emerald-100">
                          <button 
                            type="button"
                            onClick={() => setInstantMatch(!instantMatch)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                              instantMatch 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'bg-white border-emerald-200 text-emerald-900 hover:border-emerald-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Zap className={`w-5 h-5 ${instantMatch ? 'text-white' : 'text-emerald-600'}`} />
                              <div className="text-left">
                                <p className="text-sm font-bold">AI Instant Match</p>
                                <p className={`text-[10px] ${instantMatch ? 'text-emerald-100' : 'text-slate-400'}`}>Auto-assign best tasker</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${instantMatch ? 'border-white bg-white' : 'border-emerald-200'}`}>
                              {instantMatch && <Check className="w-4 h-4 text-emerald-600" />}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Back to Edit
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                      Post Task & Find Taskers
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
