import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Globe, Zap, Cpu, Server, Database, Layers } from 'lucide-react';

export default function Architecture() {
  const services = [
    { name: 'Auth Service', icon: Lock, color: 'bg-blue-500', desc: 'OAuth2, JWT, MFA, Session Management' },
    { name: 'Task Service', icon: Layers, color: 'bg-emerald-500', desc: 'Task Lifecycle, Media Storage, Geo-tagging' },
    { name: 'Matching Engine', icon: Cpu, color: 'bg-purple-500', desc: 'AI Ranking, Supply/Demand Analysis' },
    { name: 'Payment Service', icon: Shield, color: 'bg-amber-500', desc: 'Stripe Connect, Escrow, Payouts' },
    { name: 'AI Intelligence', icon: Zap, color: 'bg-rose-500', desc: 'Gemini/OpenAI, Fraud Detection, NLP' },
    { name: 'Notification', icon: Globe, color: 'bg-sky-500', desc: 'Push, Email, SMS, WebSockets' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="container mx-auto px-6 space-y-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold"
          >
            <Shield className="w-4 h-4" /> Enterprise-Grade Architecture
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
            Built for <span className="text-emerald-400">Scale.</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            TaskFlow is architected using a decoupled microservices pattern, ensuring high availability, fault tolerance, and independent scalability of core business modules.
          </p>
        </div>

        {/* Microservices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
              <p className="text-slate-400 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Infrastructure Stack */}
        <div className="bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10 p-12 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">The Infrastructure Stack</h2>
              <div className="space-y-6">
                {[
                  { label: 'Cloud Provider', value: 'AWS / GCP (Multi-Region)', icon: Server },
                  { label: 'Orchestration', value: 'Kubernetes (EKS / GKE)', icon: Layers },
                  { label: 'Database', value: 'PostgreSQL + Redis + Elasticsearch', icon: Database },
                  { label: 'Messaging', value: 'Apache Kafka (Event Streaming)', icon: Zap },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{item.label}</div>
                      <div className="text-lg font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-emerald-500/20 blur-[120px] absolute inset-0" />
              <div className="relative bg-slate-800 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs font-mono text-slate-500">deployment-pipeline.yaml</span>
                </div>
                <pre className="font-mono text-sm text-emerald-400/80 overflow-x-auto">
{`services:
  matching-engine:
    image: taskflow/matching:v2.4
    replicas: 12
    resources:
      limits:
        cpu: "2"
        memory: "4Gi"
    env:
      - KAFKA_BROKERS: kafka:9092
      - REDIS_URL: redis://cache:6379
      - AI_MODEL: gemini-3-pro`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
