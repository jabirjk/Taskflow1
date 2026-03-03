import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, LayoutDashboard, User, Menu, X, Layers, ShieldCheck, LogOut, Briefcase, MessageSquare, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationCenter } from './NotificationCenter';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getLinks = () => {
    if (!user) return [{ name: 'Browse Taskers', path: '/browse', icon: Search }];
    
    if (user.role === 'client') {
      return [
        { name: 'Browse Taskers', path: '/browse', icon: Search },
        { name: 'Post a Task', path: '/post-task', icon: PlusCircle },
        { name: 'My Bookings', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Messages', path: '/chat', icon: MessageSquare },
      ];
    }
    
    if (user.role === 'tasker') {
      return [
        { name: 'Find Tasks', path: '/browse', icon: Search },
        { name: 'My Schedule', path: '/dashboard', icon: Briefcase },
        { name: 'Messages', path: '/chat', icon: MessageSquare },
      ];
    }

    // Admin
    return [
      { name: 'Architecture', path: '/architecture', icon: Layers },
      { name: 'Admin Panel', path: '/admin', icon: ShieldCheck },
    ];
  };

  const links = getLinks();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
            T
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">TaskFlow</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`font-semibold transition-colors flex items-center gap-2 ${location.pathname === link.path ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Link to="/settings" className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <img src={user.avatar || 'https://picsum.photos/seed/user/40'} className="w-7 h-7 rounded-full object-cover" alt={user.name} />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 space-y-6">
              {links.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-xl font-bold text-slate-900"
                >
                  <link.icon className="w-6 h-6 text-emerald-600" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-50">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold block text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
