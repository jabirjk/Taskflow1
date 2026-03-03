import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import PostTask from './pages/PostTask';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Architecture from './pages/Architecture';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import Chat from './pages/Chat';
import TaskDetails from './pages/TaskDetails';
import SubscriptionPlans from './pages/SubscriptionPlans';
import CorporatePortal from './pages/CorporatePortal';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/browse" element={<Browse />} />
                  
                  {/* Protected Routes */}
                  <Route path="/post-task" element={
                    <ProtectedRoute allowedRoles={['client']}>
                      <PostTask />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/tasks/:id" element={<TaskDetails />} />
                  <Route path="/care" element={<SubscriptionPlans />} />
                  <Route path="/corporate" element={
                    <ProtectedRoute>
                      <CorporatePortal />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Only */}
                  <Route path="/architecture" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Architecture />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            
              <footer className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="space-y-6 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        T
                      </div>
                      <span className="text-2xl font-display font-bold tracking-tight">TaskFlow</span>
                    </div>
                    <p className="text-slate-400 max-w-sm text-lg">
                      The modern way to get things done. Trusted by thousands of households for reliable, professional help.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="font-bold text-lg">Company</h4>
                    <ul className="space-y-4 text-slate-400">
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold text-lg">Support</h4>
                    <ul className="space-y-4 text-slate-400">
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Tasker Support</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Community Guidelines</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="container mx-auto px-6 pt-20 mt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
                  <p>© 2026 TaskFlow Inc. All rights reserved.</p>
                  <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
