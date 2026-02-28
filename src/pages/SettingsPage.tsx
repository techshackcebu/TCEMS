import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Bell,
    Database,
    Globe,
    Smartphone,
    Cpu,
    Lock,
    Eye,
    ChevronRight,
    Clock,
    Save,
    MapPin,
    Phone,
    Mail,
    Building2,
    Terminal,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'Profile' | 'Security' | 'Operational' | 'Technical'>('Profile');

    const sections = [
        { id: 'Profile', icon: <Building2 size={18} />, label: 'Business Profile' },
        { id: 'Security', icon: <Shield size={18} />, label: 'Auth & Encryption' },
        { id: 'Operational', icon: <Zap size={18} />, label: 'Workflows' },
        { id: 'Technical', icon: <Cpu size={18} />, label: 'System Kernel' },
    ];

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-accent-blue p-2 rounded-xl text-white shadow-lg shadow-accent-blue/20">
                            <Settings size={28} />
                        </div>
                        Control Matrix
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
                        System Configuration <ChevronRight size={12} /> TechShack OS 2.0
                    </p>
                </div>

                <button
                    onClick={() => alert("Deploying System Kernel: Global configuration sync with Supabase cloud initiated... [OK]")}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3 shadow-2xl shadow-accent-blue/40 transition-all hover:scale-105 active:scale-95"
                >
                    <Save size={20} /> Deploy Configuration
                </button>
            </header>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* NAV SIDEBAR */}
                <aside className="xl:w-80 space-y-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${activeSection === section.id
                                ? 'border-accent-blue bg-accent-blue/10 text-white shadow-xl shadow-accent-blue/10'
                                : 'border-glass-border text-text-muted hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl transition-colors ${activeSection === section.id ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-muted opacity-40 group-hover:opacity-100'}`}>
                                    {section.icon}
                                </div>
                                <span className="font-black uppercase text-[11px] tracking-widest">{section.label}</span>
                            </div>
                            <ChevronRight size={16} className={`transition-transform ${activeSection === section.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                        </button>
                    ))}

                    <div className="mt-10 p-6 glass-card bg-red-500/5 border-red-500/20 space-y-4">
                        <div className="flex items-center gap-3 text-red-500">
                            <Lock size={18} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Restricted Access</h4>
                        </div>
                        <p className="text-[9px] font-medium italic text-text-muted opacity-60 leading-relaxed">Admin elevation required for binary-level changes to database schemas.</p>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeSection === 'Profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Building2 size={24} className="text-accent-blue" /> Physical Node Identity
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Public branding and logistic vectors.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-accent-blue tracking-widest ml-2 flex items-center gap-2"><Globe size={14} /> Branch Name</label>
                                        <input className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="TechShack Cebu (Main)" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><Phone size={14} /> Operational Lines</label>
                                        <input className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="+63 927 7686 245" />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><MapPin size={14} /> Global Coordinates</label>
                                        <textarea className="input-field min-h-[100px] bg-black/40 text-sm font-bold p-4" defaultValue="123 Canduman St., Mandaue City, Cebu, Philippines 6014" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><Mail size={14} /> Digital Mailbox</label>
                                        <input className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="support@techshack.ph" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><Smartphone size={14} /> WhatsApp ID</label>
                                        <input className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="ts_cebu_official" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'Security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Lock size={24} className="text-red-500" /> Perimeter Protocol
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Encryption layers and personnel authentication.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-6 bg-white/2 rounded-[2rem] border border-glass-border flex justify-between items-center group hover:bg-white/5 transition-all">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-blue"><Smartphone size={24} /></div>
                                            <div className="text-left">
                                                <h4 className="text-sm font-black uppercase tracking-tight">Two-Factor Shield</h4>
                                                <p className="text-[10px] text-text-muted font-bold opacity-60">Force mobile verification on global admin sessions.</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-8 bg-black/40 rounded-full border border-glass-border p-1 relative cursor-pointer group-hover:border-accent-blue/40 transition-all">
                                            <div className="w-6 h-6 bg-accent-blue rounded-full absolute right-1"></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/2 rounded-[2rem] border border-glass-border flex justify-between items-center group hover:bg-white/5 transition-all">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-blue"><Eye size={24} /></div>
                                            <div className="text-left">
                                                <h4 className="text-sm font-black uppercase tracking-tight">Encryption Masking</h4>
                                                <p className="text-[10px] text-text-muted font-bold opacity-60">Hide sensitive PII across public technical dashboards.</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-8 bg-black/40 rounded-full border border-glass-border p-1 relative cursor-pointer group-hover:border-accent-blue/40 transition-all">
                                            <div className="w-6 h-6 bg-white/20 rounded-full absolute left-1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-3xl flex flex-col items-center gap-4">
                                    <Terminal size={32} className="text-red-500 opacity-40" />
                                    <div className="text-center space-y-2">
                                        <h5 className="text-[11px] font-black uppercase text-white tracking-widest leading-none">Root Authorization Console</h5>
                                        <p className="text-[9px] text-text-muted italic max-w-sm">Requires physical access token or biometric override from primary shareholder Althea Reyes.</p>
                                    </div>
                                    <button className="mt-4 px-8 py-3 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Request Elevation</button>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'Operational' && (
                            <motion.div
                                key="operational"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10 text-left"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Zap size={24} className="text-ltt-orange" /> Workflow Kinematics
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Automated routing and service logic triggers.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-ltt-orange tracking-widest ml-2 flex items-center gap-2"><Clock size={14} /> Diagnostic TTL (Hours)</label>
                                        <input type="number" className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="24" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><Database size={14} /> Auto-Archive Period (Days)</label>
                                        <input type="number" className="input-field h-14 bg-black/40 text-sm font-bold" defaultValue="90" />
                                    </div>
                                    <div className="md:col-span-2 p-6 bg-ltt-orange/5 border border-ltt-orange/20 rounded-2xl flex items-center justify-between text-left">
                                        <div className="flex gap-4 text-left">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-ltt-orange"><Bell size={24} /></div>
                                            <div className="text-left">
                                                <h4 className="text-sm font-black uppercase tracking-tight">SMS Alert Integration</h4>
                                                <p className="text-[10px] text-text-muted font-bold opacity-60">Notify clients automatically on status phase transitions.</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-8 bg-black/40 rounded-full border border-glass-border p-1 relative cursor-pointer group-hover:border-ltt-orange/40 transition-all">
                                            <div className="w-6 h-6 bg-ltt-orange rounded-full absolute right-1 shadow-[0_0_10px_#f97316]"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'Technical' && (
                            <motion.div
                                key="technical"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10 text-left"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Cpu size={24} className="text-accent-blue" /> System Kernel
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Core API keys and database connectivity nodes.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-accent-blue tracking-widest ml-2">Supabase Project URL</label>
                                        <div className="flex gap-2">
                                            <input className="input-field h-14 bg-black/40 text-xs font-mono opacity-60" readOnly defaultValue="https://tcems-production.supabase.co" />
                                            <button className="h-14 px-4 bg-white/5 rounded-xl border border-glass-border hover:bg-white/10 transition-colors"><Shield size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-accent-blue tracking-widest ml-2">Secure API Token (V4)</label>
                                        <div className="flex gap-2">
                                            <input className="input-field h-14 bg-black/40 text-xs font-mono opacity-60" type="password" readOnly defaultValue="••••••••••••••••••••••••••••••••" />
                                            <button className="h-14 px-4 bg-white/5 rounded-xl border border-glass-border hover:bg-white/10 transition-colors"><Eye size={18} /></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-glass-border">
                                    <div className="p-6 bg-white/2 rounded-2xl text-center space-y-2">
                                        <p className="text-xs font-black font-mono">2.4.1</p>
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-widest">Build ID</p>
                                    </div>
                                    <div className="p-6 bg-white/2 rounded-2xl text-center space-y-2 text-green-500">
                                        <p className="text-xs font-black font-mono">14ms</p>
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-widest">API Latency</p>
                                    </div>
                                    <div className="p-6 bg-white/2 rounded-2xl text-center space-y-2">
                                        <p className="text-xs font-black font-mono">102MB</p>
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-widest">D-Base Weight</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
