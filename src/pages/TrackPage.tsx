import React, { useState } from 'react';
import {
    Search,
    MapPin,
    Phone,
    Package,
    Wrench,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Cpu,
    Box,
    Activity,
    MessageCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const TrackPage: React.FC = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [phoneSuffix, setPhoneSuffix] = useState('');
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async () => {
        setLoading(true);
        setError('');
        setTicket(null);

        const { data, error: sbError } = await supabase
            .from('repair_tickets')
            .select(`
                *,
                customers (full_name, phone),
                devices (brand, model)
            `)
            .eq('ticket_number', ticketNumber)
            .single();

        if (sbError || !data) {
            setError('Ticket not found. Check number & phone.');
            setLoading(false);
            return;
        }

        // Validate phone (last 4 digits)
        const lastFour = data.customers.phone.slice(-4);
        if (lastFour !== phoneSuffix) {
            setError('Phone verification failed.');
            setLoading(false);
            return;
        }

        setTicket(data);
        setLoading(false);
    };

    const steps = [
        { id: 'Intake', label: 'Received', icon: <Package size={18} />, status: ['Pending', 'Checking', 'Repairing', 'Done', 'Released'] },
        { id: 'Diagnosis', label: 'In Diagnosis', icon: <Cpu size={18} />, status: ['Checking', 'Repairing', 'Done', 'Released'] },
        { id: 'Repair', label: 'Being Repaired', icon: <Wrench size={18} />, status: ['Repairing', 'Done', 'Released'] },
        { id: 'QA', label: 'Quality Testing', icon: <Activity size={18} />, status: ['Testing (L2)', 'Done', 'Released'] },
        { id: 'Ready', label: 'Ready for Pickup', icon: <CheckCircle2 size={18} />, status: ['Done', 'Released'] }
    ];

    let currentStepIndex = -1;
    for (let i = steps.length - 1; i >= 0; i--) {
        if (steps[i].status.includes(ticket?.status)) {
            currentStepIndex = i;
            break;
        }
    }
    if (currentStepIndex === -1) currentStepIndex = 0;

    return (
        <div className="min-h-screen bg-bg-carbon text-text-main font-sans selection:bg-ltt-orange/30">
            {/* PUBLIC HEADER */}
            <nav className="p-6 border-b border-glass-border flex justify-between items-center bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ltt-orange rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-ltt-orange/20">TS</div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight uppercase leading-none">TechShack TRACKER</h1>
                        <p className="text-[10px] font-black tracking-[0.2em] text-text-muted uppercase italic opacity-40 mt-1">Official Status Portal</p>
                    </div>
                </div>
                <button
                    onClick={() => { setTicket(null); setTicketNumber(''); setPhoneSuffix(''); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-glass-border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                    New Search
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
                {!ticket ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 md:p-16 border-ltt-orange/20 shadow-2xl space-y-10 text-center relative overflow-hidden"
                    >
                        {/* Design Decor */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-ltt-orange/10 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-blue/10 blur-[80px] rounded-full"></div>

                        <div className="space-y-3 z-10 relative text-center">
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Track Your Repair</h2>
                            <p className="text-text-muted text-sm font-medium italic opacity-60">Enter your credentials below to view live technical status.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto z-10 relative">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest px-1 flex items-center gap-2"><Box size={14} /> Ticket Number</label>
                                <input
                                    className="input-field h-14 text-xl font-black tracking-widest text-center focus:border-ltt-orange transition-all bg-black/40"
                                    placeholder="TKT-XXXX"
                                    value={ticketNumber}
                                    onChange={(e) => setTicketNumber(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest px-1 flex items-center gap-2"><Phone size={14} /> Phone (Last 4)</label>
                                <input
                                    className="input-field h-14 text-xl font-black tracking-widest text-center focus:border-ltt-orange transition-all bg-black/40"
                                    placeholder="0000"
                                    maxLength={4}
                                    value={phoneSuffix}
                                    onChange={(e) => setPhoneSuffix(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-500 p-4 rounded-xl text-xs font-bold uppercase border border-red-500/20 max-w-xs mx-auto flex items-center gap-3">
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        <button
                            onClick={handleTrack}
                            disabled={loading || ticketNumber.length < 3 || phoneSuffix.length < 4}
                            className={`w-full max-w-xs h-16 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl relative overflow-hidden group ${loading || ticketNumber.length < 3 ? 'bg-white/10 text-text-muted cursor-not-allowed opacity-40' : 'bg-ltt-orange text-white shadow-ltt-orange/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            {loading ? (<div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>) : (
                                <>
                                    <Search size={18} /> Locate Repair
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                </>
                            )}
                        </button>

                        <div className="flex justify-center gap-8 pt-6 opacity-30">
                            <div className="flex flex-col items-center gap-1"><MapPin size={14} /><span className="text-[8px] font-black uppercase">Mandaue Center</span></div>
                            <div className="flex flex-col items-center gap-1"><Phone size={14} /><span className="text-[8px] font-black uppercase">Contact Support</span></div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* HERO BUNDLE */}
                        <div className="glass-card p-10 flex flex-col md:flex-row justify-between items-center bg-ltt-orange/5 border-ltt-orange/20">
                            <div>
                                <span className="text-[10px] font-black uppercase text-ltt-orange bg-ltt-orange/10 px-3 py-1 rounded-full mb-3 inline-block tracking-widest">Repair in Progress</span>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">{ticket.devices.brand} {ticket.devices.model}</h1>
                                <p className="text-text-muted text-sm font-bold uppercase italic mt-1 flex items-center gap-2 opacity-60">
                                    Owned by {ticket.customers.full_name.split(' ')[0]} <ChevronRight size={12} /> TKT-{ticket.ticket_number}
                                </p>
                            </div>
                            <div className="text-right mt-6 md:mt-0">
                                <p className="text-xs font-black uppercase text-text-muted opacity-40 mb-1 tracking-widest">Est. Completion</p>
                                <p className="text-2xl font-black font-mono">24 - 48 HRS</p>
                            </div>
                        </div>

                        {/* PROGRESS STEPS */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {steps.map((step, i) => {
                                const active = i <= currentStepIndex;
                                const current = i === currentStepIndex;
                                return (
                                    <div key={step.id} className="relative group">
                                        <div className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-500 ${active ? 'bg-ltt-orange text-white border-ltt-orange shadow-xl shadow-ltt-orange/10 scale-105' : 'bg-black/20 border-glass-border opacity-40'}`}>
                                            <div className={`${active ? 'text-white' : 'text-text-muted'} transition-colors`}>{step.icon}</div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-center">{step.label}</span>
                                            {current && <motion.div layoutId="pulse" className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping z-20"></motion.div>}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`hidden md:block absolute top-1/2 left-[calc(100%-8px)] w-4 h-[2px] z-0 ${active ? 'bg-ltt-orange' : 'bg-glass-border opacity-20'}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* TECHNICAL UPDATE */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 glass-card p-8 border-white/5 space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-glass-border pb-4">
                                    <Activity size={16} className="text-ltt-orange" /> Technical Summary
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ltt-orange/60 transition-colors group-hover:bg-ltt-orange/10 shrink-0"><Clock size={18} /></div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-text-muted opacity-40 tracking-widest">Phase Diagnosis</p>
                                            <p className="text-sm font-medium italic italic">"{ticket.probing?.expert_data?.diagnosis || 'Unit accepted and queued for Level 3 assessment. No critical failures identified yet.'}"</p>
                                        </div>
                                    </div>

                                    {ticket.status === 'Done' && (
                                        <div className="flex gap-4 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
                                            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20"><CheckCircle2 size={18} /></div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">PICK-UP READY</p>
                                                <p className="text-xs font-bold leading-relaxed">Repairs successfully verified & certified. Please present your claim slip at the counter.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card p-8 border-white/5 space-y-6 bg-black/20">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-glass-border pb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full h-14 rounded-xl border border-glass-border flex items-center gap-4 px-5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"><MessageCircle size={18} className="text-accent-blue" /> Chat with Tech</button>
                                    <button className="w-full h-14 rounded-xl border border-glass-border flex items-center gap-4 px-5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"><Phone size={18} className="text-green-500" /> Call Support</button>
                                    <button className="w-full h-14 rounded-xl bg-ltt-orange text-white flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-ltt-orange/20 hover:scale-105 active:scale-95 transition-all mt-6">Pay Bill Online</button>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-[8px] font-bold text-text-muted/40 uppercase tracking-widest">Secured by TechShack Cloud</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* FLOATING ACTION */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-accent-blue/40 lg:hidden"><MessageCircle size={24} /></button>
            </div>
        </div>
    );
};

export default TrackPage;
