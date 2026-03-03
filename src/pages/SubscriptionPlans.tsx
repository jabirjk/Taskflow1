import React, { useState } from 'react';
import { Check, Zap, Shield, Building2, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: 29,
    description: 'Perfect for occasional help around the house.',
    features: [
      '1 Priority Task per month',
      'Standard Support',
      'Basic Insurance Coverage',
      'No Surge Pricing'
    ],
    icon: Star,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'premium',
    name: 'Premium Home',
    price: 79,
    description: 'Comprehensive care for busy households.',
    features: [
      '4 Priority Tasks per month',
      '24/7 VIP Support',
      'Full Insurance Coverage',
      'Recurring Task Automation',
      '10% Discount on all tasks'
    ],
    icon: Zap,
    color: 'bg-emerald-50 text-emerald-600',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Corporate',
    price: 299,
    description: 'Scalable solutions for property managers and offices.',
    features: [
      'Unlimited Priority Tasks',
      'Dedicated Account Manager',
      'Multi-user Corporate Portal',
      'API Access for Integrations',
      'Custom Billing & Reporting'
    ],
    icon: Building2,
    color: 'bg-slate-900 text-white'
  }
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch(`/api/users/${user.id}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      });

      if (res.ok) {
        alert(`Successfully subscribed to ${planId} plan!`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-display font-bold">Home Care, <span className="text-emerald-600">Simplified.</span></h1>
        <p className="text-xl text-slate-600">Choose a subscription plan that fits your lifestyle. Save money, get priority service, and enjoy peace of mind with TaskFlow Care.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative p-10 rounded-[3rem] border ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-100' : 'border-slate-100 bg-white'} space-y-8 flex flex-col`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.color}`}>
                <plan.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-slate-400 font-medium">/month</span>
            </div>

            <ul className="space-y-4 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading === plan.id}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                plan.id === 'enterprise' 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
              } disabled:opacity-50`}
            >
              {loading === plan.id ? 'Processing...' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <section className="bg-slate-50 rounded-[3rem] p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-display font-bold">Why TaskFlow Care?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Insurance Included</h4>
                <p className="text-slate-500 text-sm">Every task booked under a Care plan is automatically insured up to $1M.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Priority Matching</h4>
                <p className="text-slate-500 text-sm">Your tasks go to the top of the queue, matching you with Elite taskers 3x faster.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000" 
            className="rounded-[2.5rem] shadow-2xl"
            alt="Happy Family"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
            <p className="text-sm italic text-slate-600">"The Premium plan has been a lifesaver. I don't even have to think about yard work anymore, it just happens."</p>
            <p className="mt-2 text-xs font-bold text-slate-900">— Michael T., Premium Member</p>
          </div>
        </div>
      </section>
    </div>
  );
}
