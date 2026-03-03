import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES = [
  'Cleaning',
  'Furniture Assembly',
  'Moving',
  'Mounting',
  'Yard Work',
  'Repairs',
  'Organization',
  'Laundry',
  'Other'
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'tasker' | 'admin';
  avatar?: string;
  bio?: string;
  rating: number;
  completed_tasks: number;
  hourly_rate?: number;
  skills: string[];
  balance: number;
  is_corporate?: boolean;
  subscription_plan?: 'basic' | 'premium' | 'enterprise';
  api_key?: string;
}

export interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  price_type: 'hourly' | 'fixed';
  price: number;
  location: string;
  created_at: string;
  is_recurring?: boolean;
  recurrence_pattern?: 'weekly' | 'biweekly' | 'monthly';
  insurance_status?: 'none' | 'active' | 'claimed';
  surge_multiplier?: number;
}

export interface Bid {
  id: string;
  task_id: string;
  tasker_id: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  tasker_name?: string;
  tasker_avatar?: string;
  tasker_rating?: number;
}

export interface Review {
  id: string;
  task_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'earnings';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  task_id: string;
  tasker_id: string;
  client_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string;
  created_at: string;
  task_title?: string;
  other_party_name?: string;
  other_party_avatar?: string;
}
