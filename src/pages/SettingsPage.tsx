import React, { useState, useEffect } from 'react';
import {
    Settings,
    Shield,
    Globe,
    Smartphone,
    Cpu,
    Lock,
    ChevronRight,
    Save,
    MapPin,
    Building2,
    Zap,
    Coins,
    Target,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'Profile' | 'Security' | 'Operational' | 'Technical'>('Profile');
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    const fetchConfig = async () => {
        setLoading(true);
        const { data } = await supabase.from('system_config').select('*');
        if (data) setConfig(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const getConfigValue = (key: string) => config.find(c => c.key === key)?.value || {};

    const updateConfig = async (key: string, newValue: any) => {
        setSaving(true);
        const { error } = await supabase
            .from('system_config')
            .upsert({ key, value: newValue }, { onConflict: 'key' });

        if (!error) {
            await fetchConfig();
            alert(`Global Configuration Updated: ${key}`);
        }
        setSaving(false);
    };

    const sections = [
        { id: 'Profile', icon: <Building2 size={18} />, label: 'Business Profile' },
        { id: 'Security', icon: <Shield size={18} />, label: 'Auth & Encryption' },
        { id: 'Operational', icon: <Zap size={18} />, label: 'Workflows' },
        { id: 'Technical', icon: <Cpu size={18} />, label: 'System Kernel' },
    ];

    const branchInfo = getConfigValue('BRANCH_INFO');
    const currency = getConfigValue('BASE_CURRENCY');
    const target = config.find(c => c.key === 'DAILY_REVENUE_TARGET')?.value || '7040';

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-left">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-accent-blue p-2 rounded-xl text-white shadow-lg shadow-accent-blue/20">
                            <Settings size={28} />
                        </div>
                        Control Matrix
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
                        System Configuration <ChevronRight size={12} /> Global Scaling Engine v3.1
                    </p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <button
                        onClick={fetchConfig}
                        className="bg-white/5 border border-glass-border text-white px-6 h-14 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Sync
                    </button>
                    <button
                        disabled={saving}
                        className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3 shadow-2xl shadow-accent-blue/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />} Deploy Configuration
                    </button>
                </div>
            </header>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* NAV SIDEBAR */}
                <aside className="xl:w-80 space-y-2 text-left">
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

                    <div className="mt-10 p-6 glass-card bg-red-500/5 border-red-500/20 space-y-4 text-left">
                        <div className="flex items-center gap-3 text-red-500 text-left">
                            <Lock size={18} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Restricted Access</h4>
                        </div>
                        <p className="text-[9px] font-medium italic text-text-muted opacity-60 leading-relaxed text-left">Admin elevation required for binary-level changes to database schemas.</p>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 text-left">
                    <AnimatePresence mode="wait">
                        {activeSection === 'Profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6 text-left">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Building2 size={24} className="text-accent-blue" /> Physical Node Identity
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Public branding and logistic vectors.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-accent-blue tracking-widest ml-2 flex items-center gap-2 text-left"><Globe size={14} /> Branch Name</label>
                                        <input
                                            className="input-field h-14 bg-black/40 text-sm font-bold"
                                            value={branchInfo.name || ''}
                                            onChange={(e) => setConfig(prev => prev.map(c => c.key === 'BRANCH_INFO' ? { ...c, value: { ...c.value, name: e.target.value } } : c))}
                                            onBlur={() => updateConfig('BRANCH_INFO', { ...branchInfo, name: branchInfo.name })}
                                        />
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><Coins size={14} /> Local Currency</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="input-field h-14 bg-black/40 text-sm font-bold w-20 text-center"
                                                value={currency.symbol || ''}
                                                placeholder="₱"
                                                onChange={(e) => setConfig(prev => prev.map(c => c.key === 'BASE_CURRENCY' ? { ...c, value: { ...c.value, symbol: e.target.value } } : c))}
                                                onBlur={() => updateConfig('BASE_CURRENCY', { ...currency, symbol: currency.symbol })}
                                            />
                                            <input
                                                className="input-field h-14 bg-black/40 text-sm font-bold flex-1"
                                                value={currency.code || ''}
                                                placeholder="PHP"
                                                onChange={(e) => setConfig(prev => prev.map(c => c.key === 'BASE_CURRENCY' ? { ...c, value: { ...c.value, code: e.target.value } } : c))}
                                                onBlur={() => updateConfig('BASE_CURRENCY', { ...currency, code: currency.code })}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-2"><MapPin size={14} /> Global Coordinates</label>
                                        <textarea
                                            className="input-field min-h-[100px] bg-black/40 text-sm font-bold p-4"
                                            value={branchInfo.address || ''}
                                            onChange={(e) => setConfig(prev => prev.map(c => c.key === 'BRANCH_INFO' ? { ...c, value: { ...c.value, address: e.target.value } } : c))}
                                            onBlur={() => updateConfig('BRANCH_INFO', { ...branchInfo, address: branchInfo.address })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'Operational' && (
                            <motion.div
                                key="operational"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 space-y-10"
                            >
                                <div className="space-y-2 border-b border-glass-border pb-6 text-left">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Zap size={24} className="text-ltt-orange" /> Operational Targets
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Business logic thresholds and goals.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase text-ltt-orange tracking-widest ml-2 flex items-center gap-2"><Target size={14} /> Daily Revenue Goal</label>
                                        <input
                                            type="number"
                                            className="input-field h-14 bg-black/40 text-sm font-bold"
                                            value={target}
                                            onChange={(e) => setConfig(prev => prev.map(c => c.key === 'DAILY_REVENUE_TARGET' ? { ...c, value: e.target.value } : c))}
                                            onBlur={() => updateConfig('DAILY_REVENUE_TARGET', target)}
                                        />
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
                                <div className="space-y-2 border-b border-glass-border pb-6 text-left">
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                        <Lock size={24} className="text-red-500" /> Perimeter Protocol
                                    </h3>
                                    <p className="text-text-muted text-xs font-bold italic opacity-40">Encryption layers and personnel authentication.</p>
                                </div>

                                <div className="space-y-8 text-left">
                                    <div className="p-6 bg-white/2 rounded-[2rem] border border-glass-border flex justify-between items-center group hover:bg-white/5 transition-all text-left">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-blue"><Smartphone size={24} /></div>
                                            <div className="text-left text-left">
                                                <h4 className="text-sm font-black uppercase tracking-tight">Two-Factor Shield</h4>
                                                <p className="text-[10px] text-text-muted font-bold opacity-60">Force mobile verification on global admin sessions.</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-14 bg-black/40 border border-glass-border rounded-full p-1 relative cursor-pointer">
                                            <div className="h-6 w-6 bg-white/10 rounded-full transition-all translate-x-0" />
                                        </div>
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
