import React, { useState, useEffect } from 'react';
import {
    Landmark,
    TrendingUp,
    PieChart,
    ChevronRight,
    BarChart3,
    Award,
    X,
    Receipt,
    History,
    Calendar,
    ArrowDownRight,
    ArrowRight,
    Search,
    ShieldCheck,
    Users,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface PayoutEntry {
    date: string;
    amount: number;
    type: 'Passive' | 'Term';
    period: string;
}

interface Investor {
    id: string;
    name: string;
    investment: number;
    passive_share: number;
    term_share: number;
    status: 'Active' | 'Holding' | 'Exited';
    joinedDate: string;
    total_payout: number;
    running_payout: number; // Current accumulated but unpaid ROI
    history: PayoutEntry[];
}

const InvestorPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const [isAddingInvestor, setIsAddingInvestor] = useState(false);
    const [newInvestor, setNewInvestor] = useState({ name: '', investment: 0, passive_share: 0, term_share: 0 });
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchInvestors = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('investors').select('*');
        if (!error && data) {
            setInvestors(data.map((i: any) => ({
                id: i.id,
                name: i.name,
                investment: Number(i.investment),
                passive_share: i.passive_share,
                term_share: i.term_share,
                status: (i.status as any) || 'Active',
                joinedDate: i.joined_date || i.created_at,
                total_payout: Number(i.total_payout || 0),
                running_payout: Number(i.running_payout || 0),
                history: i.history || []
            })));
        }
        setLoading(false);
    };

    const handleAddInvestor = async () => {
        if (!newInvestor.name || newInvestor.investment <= 0) return;
        setSubmitting(true);

        const { error } = await supabase.from('investors').insert([{
            name: newInvestor.name,
            investment: newInvestor.investment,
            passive_share: newInvestor.passive_share,
            term_share: newInvestor.term_share,
            status: 'Active',
            total_payout: 0,
            running_payout: 0,
            history: []
        }]);

        setSubmitting(false);

        if (!error) {
            setIsAddingInvestor(false);
            setNewInvestor({ name: '', investment: 0, passive_share: 0, term_share: 0 });
            fetchInvestors();
        } else {
            console.error("Failed to add investor:", error);
        }
    };

    useEffect(() => {
        fetchInvestors();
    }, []);

    const stats = [
        { label: 'Total AUM', val: '₱' + (investors.reduce((s, i) => s + i.investment, 0) || 0).toLocaleString(), icon: <Landmark size={20} />, color: 'blue' },
        { label: 'Network Yield', val: '12.4%', icon: <TrendingUp size={20} />, color: 'green' },
        { label: 'Active Shares', val: investors.length, icon: <PieChart size={20} />, color: 'orange' },
        { label: 'Running Payouts', val: '₱' + (investors.reduce((s, i) => s + i.running_payout, 0) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), icon: <Landmark size={20} />, color: 'red' }
    ];

    const shareTiers = [
        { amount: '₱50,000', passive: '5%', term: '15%' },
        { amount: '₱100,000', passive: '8%', term: '20%' },
        { amount: '₱150,000', passive: '12%', term: '25%' },
        { amount: '₱200,000+', passive: '15%', term: '30%' }
    ];

    const filteredInvestors = investors.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4 justify-start">
                        <div className="bg-accent-blue p-2.5 rounded-2xl text-white shadow-xl shadow-accent-blue/30"><Landmark size={32} /></div>
                        Investor Capital
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 justify-start italic">Equity Ledger & Yield Tracking Center <ChevronRight size={10} /></p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <button onClick={() => setIsAddingInvestor(true)} className="flex-1 lg:flex-none h-14 px-8 bg-white/5 hover:bg-white/10 border border-glass-border rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all">
                        <Landmark size={18} /> Capital Injection
                    </button>
                    <button className="flex-1 lg:flex-none h-14 px-8 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-accent-blue/40">
                        <TrendingUp size={18} /> Global ROI Report
                    </button>
                </div>
            </header>

            {/* QUICK STAT BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-accent-blue/20 flex items-center justify-between group transition-all hover:bg-accent-blue/5"
                    >
                        <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40">{stat.label}</p>
                            <h3 className="text-2xl font-black font-mono tracking-tighter">{stat.val}</h3>
                        </div>
                        <div className="p-4 bg-black/40 rounded-[1.5rem] group-hover:bg-accent-blue/20 transition-all">{stat.icon}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* INVESTOR ROSTER */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center border-b border-glass-border pb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-left"><Users size={20} className="text-accent-blue" /> Shareholder Registry</h3>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={16} />
                            <input
                                className="input-field pl-10 h-10 text-[10px] font-black uppercase tracking-[0.2em] bg-black/40 border-glass-border focus:border-accent-blue"
                                placeholder="Search Equity Source..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredInvestors.map((inv, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                key={inv.id}
                                onClick={() => setSelectedInvestor(inv)}
                                className="glass-card p-8 border-ltt-orange/10 bg-black/20 space-y-8 relative overflow-hidden group cursor-pointer hover:border-accent-blue/40 transition-all active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start z-10 relative text-left">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-14 h-14 bg-gradient-to-br from-bg-slate to-black rounded-[1.8rem] flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={28} className="text-accent-blue opacity-50 shadow-blue-500/50" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-xl font-black uppercase tracking-tight text-left">{inv.name}</h4>
                                            <p className="text-[9px] uppercase font-black tracking-widest text-text-muted opacity-40 italic text-left">EST. {new Date(inv.joinedDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">STAKE: {inv.status}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 z-10 relative">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[9px] font-black uppercase text-text-muted opacity-40 tracking-widest">Active Infusion</p>
                                        <p className="text-lg font-black font-mono">₱{inv.investment.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-black uppercase text-green-500/40 tracking-widest">Accumulated ROI</p>
                                        <p className="text-lg font-black font-mono text-green-500">₱{inv.total_payout.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-accent-blue/5 rounded-2xl border border-accent-blue/10 flex justify-between items-center z-10 relative group-hover:bg-accent-blue/10 transition-colors">
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase text-accent-blue tracking-[0.2em] mb-1 text-left">Running Yield (Unpaid)</p>
                                        <p className="text-sm font-black font-mono text-white animate-pulse">₱{inv.running_payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-accent-blue opacity-40 group-hover:translate-x-1 transition-transform" />
                                </div>

                                <div className="absolute -bottom-8 -right-8 opacity-5 text-accent-blue pointer-events-none transform rotate-12 scale-[1.5] group-hover:scale-[2] transition-transform"><Award size={120} /></div>
                            </motion.div>
                        ))}
                        {loading && <div className="col-span-full py-20 text-center italic text-text-muted opacity-40 tracking-widest">Synchronizing Capital Nodes...</div>}
                    </div>
                </div>

                {/* YIELD TIERS & ANALYTICS */}
                <div className="space-y-10">
                    <div className="glass-card p-8 border-accent-blue/30 bg-accent-blue/5 space-y-8 text-left">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 justify-start text-left"><ArrowUpRight size={24} className="text-accent-blue" /> Yield Algorithms</h3>
                        <div className="space-y-4 text-left">
                            {shareTiers.map(tier => (
                                <div key={tier.amount} className="flex justify-between items-center p-4 bg-black/40 rounded-[1.5rem] border border-glass-border transition-all hover:bg-white/5 group text-left">
                                    <div className="space-y-1 text-left">
                                        <p className="text-xs font-black font-mono text-white group-hover:text-accent-blue text-left">{tier.amount}</p>
                                        <p className="text-[9px] font-black uppercase text-text-muted opacity-40 tracking-widest text-left">Capital Level</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-xs font-black font-mono text-green-500">{tier.passive} / {tier.term}</p>
                                        <p className="text-[9px] font-black uppercase text-text-muted opacity-40 tracking-widest">Share Cap</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-10 space-y-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-bg-slate to-black group">
                        <div className="w-20 h-20 bg-accent-blue/10 rounded-[2rem] flex items-center justify-center text-accent-blue/40 shadow-inner group-hover:scale-110 transition-transform"><BarChart3 size={40} /></div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest">Portfolio Analytics Hub</h4>
                            <p className="text-xs text-text-muted italic opacity-40 mt-3 max-w-[200px] leading-relaxed">Enterprise-grade yield forecasting & predictive injection models currently active.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INVESTOR DETAIL MODAL */}
            <AnimatePresence>
                {selectedInvestor && (
                    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-4xl bg-bg-slate rounded-[3rem] border border-glass-border p-10 h-auto space-y-10 shadow-2xl text-left"
                        >
                            <div className="flex justify-between items-start text-left">
                                <div className="flex gap-6 text-left">
                                    <div className="w-24 h-24 bg-gradient-to-br from-accent-blue to-black rounded-[2.5rem] flex items-center justify-center border-4 border-white/5 shadow-2xl"><ShieldCheck size={48} className="text-white" /></div>
                                    <div className="text-left space-y-2">
                                        <p className="text-[10px] font-black uppercase text-accent-blue tracking-[0.4em] text-left italic">Capital Partner Portfolio</p>
                                        <h2 className="text-4xl font-black uppercase tracking-tight text-left">{selectedInvestor.name}</h2>
                                        <div className="flex gap-4">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest italic opacity-60">ID: {selectedInvestor.id.slice(0, 8).toUpperCase()}</span>
                                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-green-500">NETWORK NODE ACTIVE</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedInvestor(null)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24} /></button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                                <div className="lg:col-span-2 space-y-8 text-left">
                                    {/* LEDGER HUD */}
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="glass-card p-6 border-white/5 bg-black/40 space-y-2 text-left">
                                            <p className="text-[9px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40 flex items-center gap-2 text-left"><ArrowDownRight size={12} className="text-green-500" /> Capital Infused</p>
                                            <p className="text-2xl font-black font-mono text-left">₱{selectedInvestor.investment.toLocaleString()}</p>
                                        </div>
                                        <div className="glass-card p-6 border-white/5 bg-black/40 space-y-2 text-left">
                                            <p className="text-[9px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40 flex items-center gap-2 text-left"><PieChart size={12} className="text-accent-blue" /> Share Calibration</p>
                                            <div className="flex gap-3 text-sm font-black font-mono justify-start">
                                                <span className="text-accent-blue">{selectedInvestor.passive_share}% PASSIVE</span>
                                                <span className="text-ltt-orange">{selectedInvestor.term_share}% TERM</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RUNNING PAYOUT HUB */}
                                    <div className="glass-card p-8 border-accent-blue/30 bg-accent-blue/5 overflow-hidden relative">
                                        <div className="flex justify-between items-center z-10 relative">
                                            <div className="text-left space-y-1">
                                                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-accent-blue text-left"><Receipt size={16} /> Current Running Payout</h4>
                                                <p className="text-5xl font-black font-mono tracking-tighter text-white text-left">₱{selectedInvestor.running_payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                <p className="text-[10px] text-text-muted font-bold tracking-widest opacity-60 text-left">Cycle Accumulation: Feb 1st - Feb 28th, 2026</p>
                                            </div>
                                            <button className="h-16 px-10 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-accent-blue/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                                <Landmark size={20} /> Disburse Funds
                                            </button>
                                        </div>
                                        <div className="absolute -right-20 -top-20 opacity-5 text-accent-blue pointer-events-none transform rotate-12 scale-[3]"><PieChart size={100} /></div>
                                    </div>

                                    {/* HISTORICAL LEDGER */}
                                    <div className="space-y-4 text-left">
                                        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 opacity-40 text-left"><History size={16} /> Disbursal Audit Trail</h4>
                                        <div className="space-y-3 text-left">
                                            {selectedInvestor.history.map((entry: any, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-all text-left">
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="p-3 bg-white/5 rounded-xl text-text-muted"><Calendar size={16} /></div>
                                                        <div className="text-left">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-white text-left">{entry.period}</p>
                                                            <p className="text-[9px] text-text-muted font-bold opacity-40 italic text-left">Released on {entry.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black font-mono text-green-500">+ ₱{entry.amount.toLocaleString()}</p>
                                                        <p className="text-[8px] font-black uppercase text-text-muted opacity-40 tracking-widest">P{entry.type} YIELD</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 text-left">
                                    <div className="glass-card p-6 border-glass-border space-y-6 text-left">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 text-left"><TrendingUp size={14} /> Performance Node</h5>
                                        <div className="text-center py-6 space-y-4">
                                            <div className="relative w-32 h-32 mx-auto">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                                                    <circle className="text-accent-blue" strokeWidth="8" strokeDasharray={Math.PI * 116} strokeDashoffset={Math.PI * 116 * (1 - 0.72)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <p className="text-2xl font-black font-mono">72%</p>
                                                    <p className="text-[7px] font-black uppercase opacity-40">ROI PA</p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] font-black uppercase text-text-muted italic opacity-60">High-Velocity Growth Node</p>
                                        </div>
                                    </div>

                                    <div className="glass-card p-8 border-ltt-orange/20 bg-ltt-orange/5 space-y-4 text-left">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-ltt-orange flex items-center gap-2 text-left"><Award size={14} /> Specialist Bonus</h5>
                                        <p className="text-[10px] font-bold text-text-muted leading-relaxed italic text-left opacity-60">This investor is currently linked to the <strong>MasterTechnician</strong> surplus overhead pool for additional 2.5% quarterly bonuses.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ADD INVESTOR MODAL */}
            <AnimatePresence>
                {isAddingInvestor && (
                    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-bg-slate rounded-[3rem] border border-glass-border p-10 h-auto space-y-8 shadow-2xl text-left"
                        >
                            <div className="flex justify-between items-start text-left">
                                <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4"><Landmark className="text-accent-blue" /> Inject Capital Node</h2>
                                <button onClick={() => setIsAddingInvestor(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Entity/Partner Name</label>
                                    <input
                                        type="text"
                                        className="input-field h-14"
                                        placeholder="Tech Capital Inc."
                                        value={newInvestor.name}
                                        onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Initial Capital Infusion (₱)</label>
                                    <input
                                        type="number"
                                        className="input-field h-14 font-mono text-accent-blue font-black"
                                        placeholder="50000"
                                        value={newInvestor.investment || ''}
                                        onChange={(e) => setNewInvestor({ ...newInvestor, investment: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Passive Share (%)</label>
                                        <input
                                            type="number"
                                            className="input-field h-14 font-mono"
                                            placeholder="5"
                                            value={newInvestor.passive_share || ''}
                                            onChange={(e) => setNewInvestor({ ...newInvestor, passive_share: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Term Share (%)</label>
                                        <input
                                            type="number"
                                            className="input-field h-14 font-mono text-ltt-orange"
                                            placeholder="15"
                                            value={newInvestor.term_share || ''}
                                            onChange={(e) => setNewInvestor({ ...newInvestor, term_share: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAddInvestor}
                                disabled={submitting || !newInvestor.name || newInvestor.investment <= 0}
                                className="w-full h-16 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/20 disabled:text-white/40 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all"
                            >
                                {submitting ? 'Authenticating Node...' : 'Authorize Injection'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvestorPage;
