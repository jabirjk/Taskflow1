import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to /api/auth/login
      const res = await fetch('/api/users/taskers'); // Just to get some users for demo
      const users = await res.json();
      
      // Also check if it's the mock client
      if (userId === 'c1') {
        const client = {
          id: 'c1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'client',
          avatar: 'https://picsum.photos/seed/jane/200',
          rating: 5.0,
          completed_tasks: 0,
          skills: []
        } as User;
        setUser(client);
        localStorage.setItem('taskflow_user', JSON.stringify(client));
      } else {
        const found = users.find((u: User) => u.id === userId);
        if (found) {
          setUser(found);
          localStorage.setItem('taskflow_user', JSON.stringify(found));
        }
      }
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
