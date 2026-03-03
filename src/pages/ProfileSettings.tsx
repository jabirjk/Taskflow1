import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Camera, Save, Shield, CheckCircle2, Briefcase, Plus, X, Zap, CreditCard, Award, TrendingUp } from 'lucide-react';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [instantPayouts, setInstantPayouts] = useState(false);
  const [hasPremiumBadge, setHasPremiumBadge] = useState(false);
  const [hasBackgroundCheck, setHasBackgroundCheck] = useState(true);

  if (!user) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          skills,
          hourly_rate: user.hourly_rate // Keep existing or add input if needed
        })
      });
      if (res.ok) {
        alert('Profile updated successfully!');
        // In a real app, we'd update the auth context user object here
        window.location.reload();
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Account Settings</h1>
          <p className="text-slate-500">Manage your public profile and account preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Avatar Section */}
          <div className="space-y-6">
            <div className="relative group w-40 h-40 mx-auto lg:mx-0">
              <img 
                src={user.avatar} 
                className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white shadow-xl" 
                alt={user.name} 
              />
              <button className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>
            <div className="text-center lg:text-left space-y-1">
              <div className="font-bold text-lg">{user.name}</div>
              <div className="text-sm text-slate-500 capitalize">{user.role} Account</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Identity Verified</div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Biography</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {user.role === 'tasker' && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Skills & Expertise</label>
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. Plumbing)"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button type="submit" className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.role === 'tasker' && (
              <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Boost Your Profile
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upgrade your account to get more visibility and faster payments.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Premium Background Check */}
                  <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <Shield className="w-6 h-6" />
                      </div>
                      {hasBackgroundCheck ? (
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">
                          $49 / year
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">Premium Background Check</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Get the verified badge to build trust and win 3x more tasks.</p>
                    </div>
                    {!hasBackgroundCheck && (
                      <button 
                        onClick={() => setHasBackgroundCheck(true)}
                        className="w-full py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>

                  {/* Featured Tasker Badge */}
                  <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-800 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                        <Award className="w-6 h-6" />
                      </div>
                      {hasPremiumBadge ? (
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">
                          $19 / month
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">Featured Tasker Badge</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stand out in search results with a highlighted profile and priority ranking.</p>
                    </div>
                    {!hasPremiumBadge && (
                      <button 
                        onClick={() => setHasPremiumBadge(true)}
                        className="w-full py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        Boost Profile
                      </button>
                    )}
                  </div>

                  {/* Instant Payouts */}
                  <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 md:col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-white flex items-center gap-2">
                          Instant Payouts
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] rounded-md uppercase tracking-wider">1.5% Fee</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Get paid within 30 minutes of task completion instead of waiting 3-5 days.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={instantPayouts}
                        onChange={() => setInstantPayouts(!instantPayouts)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
              <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
