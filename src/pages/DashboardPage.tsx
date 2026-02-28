import React, { useState } from 'react';
import {
    LayoutDashboard,
    TrendingUp,
    Target,
    Users,
    ShieldCheck,
    Activity,
    ChevronRight,
    AlertCircle,
    Zap,
    ArrowUpRight,
    Settings2,
    PieChart,
    History,
    Terminal,
    RefreshCw,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface WarRoomStats {
    dailyRevenue: number;
    monthlyRevenue: number;
    activeTickets: number;
    l3Efficiency: number;
    investorYieldTotal: number;
}

const DashboardPage: React.FC = () => {
    const [target, setTarget] = useState(7040);
    const [isEditingTarget, setIsEditingTarget] = useState(false);
    const [stats, setStats] = useState<WarRoomStats>({
        dailyRevenue: 5450,
        monthlyRevenue: 142800,
        activeTickets: 12,
        l3Efficiency: 98.5,
        investorYieldTotal: 28400
    });
    const [loading, setLoading] = useState(false);
    const [showAudit, setShowAudit] = useState(false);

    React.useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Fetch Daily Revenue
            const { data: dailyPayments } = await supabase
                .from('payments')
                .select('amount_paid')
                .gte('created_at', today.toISOString());

            // Fetch Monthly Revenue
            const { data: monthlyPayments } = await supabase
                .from('payments')
                .select('amount_paid')
                .gte('created_at', firstDayOfMonth.toISOString());

            // Fetch Active Tickets
            const { count: activeTicketsCount } = await supabase
                .from('repair_tickets')
                .select('*', { count: 'exact', head: true })
                .in('status', ['Pending', 'Checking', 'Repairing', 'Waiting for Parts']);

            const dailyRev = dailyPayments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
            const monthlyRev = monthlyPayments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;

            setStats(prev => ({
                ...prev,
                dailyRevenue: dailyRev,
                monthlyRevenue: monthlyRev,
                activeTickets: activeTicketsCount || 0,
                investorYieldTotal: monthlyRev * 0.05
            }));
            setLoading(false);
        };

        fetchStats();
    }, []);

    const missingProfit = Math.max(0, target - stats.dailyRevenue);
    const surplus = Math.max(0, stats.dailyRevenue - target);
    const performancePct = Math.min(100, (stats.dailyRevenue / target) * 100);

    const cards = [
        { label: 'MTD Revenue', val: '₱' + stats.monthlyRevenue.toLocaleString(), sub: '+12.4%', icon: <TrendingUp size={20} /> },
        { label: 'Active Queue', val: stats.activeTickets, sub: 'L3 Specialist', icon: <Activity size={20} /> },
        { label: 'Efficiency', val: stats.l3Efficiency + '%', sub: 'Technical', icon: <Zap size={20} /> },
        { label: 'Investor Yield', val: '₱' + stats.investorYieldTotal.toLocaleString(), sub: 'Equity', icon: <PieChart size={20} /> },
    ];

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* HEADER / WAR ROOM HUB */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4 justify-start">
                        <div className="bg-ltt-orange p-2.5 rounded-2xl text-white shadow-xl shadow-ltt-orange/30"><LayoutDashboard size={32} /></div>
                        War Room Dashboard
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 italic justify-start">Real-Time Enterprise Intelligence <ChevronRight size={10} /> v2.4a</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    {/* TEMPORAL HUB / DATE RANGE */}
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-2xl px-4 h-14 group hover:border-ltt-orange/30 transition-all cursor-pointer">
                        <Calendar size={18} className="text-text-muted group-hover:text-ltt-orange" />
                        <div className="text-left">
                            <p className="text-[7px] font-black uppercase text-text-muted opacity-40">Temporal Hub</p>
                            <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Feb 28, 2026 - Live</p>
                        </div>
                        <Settings2 size={12} className="ml-2 text-text-muted opacity-20" />
                    </div>

                    <button
                        onClick={() => setShowAudit(true)}
                        className="flex-1 lg:flex-none h-14 px-8 bg-white/5 hover:bg-white/10 border border-glass-border rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                        <History size={18} /> Audit Ledger
                    </button>

                    {/* AUDIT MODAL */}
                    <AnimatePresence>
                        {showAudit && (
                            <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-card w-full max-w-4xl p-10 space-y-6"
                                >
                                    <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
                                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2"><History className="text-ltt-orange" /> Enterprise Audit Ledger</h2>
                                        <button onClick={() => setShowAudit(false)} className="text-text-muted hover:text-white">✕</button>
                                    </div>
                                    <div className="overflow-x-auto text-left">
                                        <table className="w-full text-xs font-bold uppercase tracking-widest text-left">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="py-4 opacity-40">Timestamp</th>
                                                    <th className="py-4 opacity-40">Descriptor</th>
                                                    <th className="py-4 opacity-40">Entity</th>
                                                    <th className="py-4 text-right opacity-40">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {[
                                                    { time: '2026-03-01 04:30', desc: 'Repair Ticket Release', ent: 'Cathy Clumsy', val: '₱2,500' },
                                                    { time: '2026-03-01 04:15', desc: 'Warranty Validation', ent: 'Arthur Pendragon', val: '₱0' },
                                                    { time: '2026-03-01 02:45', desc: 'Part Sourcing Order', ent: 'Kowloon Parts', val: '-₱12,400' },
                                                    { time: '2026-02-28 22:15', desc: 'L3 Specialist Payout', ent: 'MasterTech Alpha', val: '-₱8,500' },
                                                    { time: '2026-02-28 20:00', desc: 'Consolidated Daily Drop', ent: 'Mandaue Center', val: '₱45,400' },
                                                ].map((row, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="py-4 text-text-muted">{row.time}</td>
                                                        <td className="py-4">{row.desc}</td>
                                                        <td className="py-4 text-accent-blue">{row.ent}</td>
                                                        <td className={`py-4 text-right font-mono ${row.val.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{row.val}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10px] text-text-muted italic opacity-40 pt-4 text-center">System Hash: SHA256/tcems-prod-audit-node-A1</p>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    <button className="flex-1 lg:flex-none h-14 px-8 bg-ltt-orange hover:bg-ltt-orange/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-ltt-orange/40">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Sync Data
                    </button>
                </div>
            </header>

            {/* PERFORMANCE GAUGES */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* DAILY REVENUE TARGET SECTION */}
                <div className={`xl:col-span-2 glass-card p-10 relative overflow-hidden flex flex-col justify-between transition-all duration-700 ${surplus > 0 ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-ltt-orange/20'}`}>
                    {/* CHEERING OVERLAY */}
                    {surplus > 0 && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] animate-pulse" />
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-4 right-10 text-[60px] font-black text-green-500/10 italic select-none">OVER TARGET!</motion.div>
                        </div>
                    )}

                    <div className="flex justify-between items-start z-10 text-left">
                        <div className="space-y-2 text-left">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted opacity-60 flex items-center gap-2 italic justify-start">
                                <Target size={14} className={surplus > 0 ? 'text-green-500 animate-bounce' : 'text-ltt-orange'} /> Daily Performance Velocity
                            </h3>
                            <div className="flex items-baseline gap-4 mt-4 justify-start">
                                <h2 className="text-6xl font-black tracking-tighter font-mono">₱{stats.dailyRevenue.toLocaleString()}</h2>
                                <span className="text-text-muted font-black text-xl opacity-20">/</span>
                                <div className="flex flex-col text-left">
                                    {isEditingTarget ? (
                                        <input
                                            type="number"
                                            autoFocus
                                            className="bg-transparent border-b-2 border-ltt-orange text-2xl font-black font-mono w-32 outline-none text-left"
                                            value={target}
                                            onChange={(e) => setTarget(parseInt(e.target.value))}
                                            onBlur={() => setIsEditingTarget(false)}
                                        />
                                    ) : (
                                        <div onClick={() => setIsEditingTarget(true)} className="group cursor-pointer flex items-center gap-2 justify-start">
                                            <span className="text-2xl font-black font-mono text-text-muted opacity-40 group-hover:text-ltt-orange group-hover:opacity-100 transition-all">₱{target.toLocaleString()}</span>
                                            <Settings2 size={14} className="text-text-muted opacity-0 group-hover:opacity-100" />
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black uppercase text-text-muted opacity-30 tracking-[0.2em] text-left">Target Objective</span>
                                </div>
                            </div>

                            {/* DELTA HUD */}
                            <div className="mt-6 flex gap-4">
                                {missingProfit > 0 ? (
                                    <div className="px-4 py-2 bg-ltt-orange/10 border border-ltt-orange/20 rounded-xl">
                                        <p className="text-[8px] font-black uppercase text-ltt-orange tracking-widest mb-1">Missing Profit</p>
                                        <p className="text-sm font-black font-mono text-white">- ₱{missingProfit.toLocaleString()}</p>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl animate-pulse">
                                        <p className="text-[8px] font-black uppercase text-green-500 tracking-widest mb-1">Surplus Profit</p>
                                        <p className="text-sm font-black font-mono text-white">+ ₱{surplus.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-4xl font-black italic tracking-tighter ${performancePct >= 100 ? 'text-green-500' : 'text-ltt-orange'}`}>{performancePct.toFixed(1)}%</p>
                            <p className="text-[10px] font-black uppercase text-text-muted opacity-40">Quota Attainment</p>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4 z-10">
                        <div className="h-6 bg-black/40 rounded-full border border-white/5 p-1 relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${performancePct}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-full transition-all duration-500 relative ${performancePct >= 100 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-r from-ltt-orange/50 to-ltt-orange shadow-[0_0_20px_rgba(249,115,22,0.3)]'}`}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:50px_50px] animate-[slide_2s_linear_infinite]" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">
                            <span>Alpha Baseline</span>
                            <span className={surplus > 0 ? 'text-green-400' : 'text-ltt-orange'}>{surplus > 0 ? 'GOAL EXCEEDED' : 'REVENUE DEFICIT'} <ChevronRight size={10} className="inline ml-1" /></span>
                            <span className="text-white">Daily Cap</span>
                        </div>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-ltt-orange pointer-events-none transform rotate-12 scale-[1.8]">
                        <Terminal size={240} />
                    </div>
                </div>

                {/* STAFF STATUS / HUB */}
                <div className="glass-card p-10 border-accent-blue/20 bg-accent-blue/5 flex flex-col justify-between group">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                            <Users size={18} className="text-accent-blue" /> Specialist Roster
                        </h4>
                        <button
                            onClick={() => alert("Roster Management: Standard L3 Specialist roles are currently fixed in this build.")}
                            className="text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-accent-blue/40 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue shadow-inner"><ShieldCheck size={20} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black uppercase">MasterTechnician</p>
                                    <p className="text-[9px] font-bold text-accent-blue opacity-80 uppercase italic">100% Profit Linked</p>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-glass-border/50 text-left">
                        <p className="text-[9px] font-black uppercase text-text-muted opacity-40 leading-relaxed">Directive: MasterTechnician owns all linked services and retains 100% of the overhead/labor node profit.</p>
                    </div>
                </div>
            </div>

            {/* QUICK STATS HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={card.label}
                        className="glass-card p-6 border-l-4 border-ltt-orange/10 hover:border-ltt-orange transition-all group cursor-default"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-black/40 rounded-[1.2rem] group-hover:bg-ltt-orange/20 transition-all text-text-muted group-hover:text-ltt-orange">{card.icon}</div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{card.sub}</span>
                        </div>
                        <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40">{card.label}</p>
                            <h3 className="text-2xl font-black font-mono tracking-tighter">{card.val}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* LOWER INTEL PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 border-glass-border space-y-6 text-left">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><ArrowUpRight size={20} className="text-ltt-orange" /> Enterprise Directives</h3>
                    <div className="space-y-4">
                        {[
                            { task: 'Calibrate L3 Tech Commission (MasterTech: 100%)', status: 'In Review' },
                            { task: 'Verify P2 Thermal Printer DPI Scaling for QR-Tags', status: 'Completed' },
                            { task: 'Sync Investor Share percentages for FEB-2 Pay Cycle', status: 'Flagged' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-ltt-orange/20 transition-all">
                                <span className="text-xs font-bold text-text-muted group-hover:text-white transition-colors">{item.task}</span>
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'bg-green-500/10 text-green-500' : item.status === 'Flagged' ? 'bg-red-500/10 text-red-500' : 'bg-accent-blue/10 text-accent-blue'}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8 border-glass-border bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.05),transparent_70%)] relative flex flex-col items-center justify-center text-center space-y-6 group">
                    <div className="w-16 h-16 bg-ltt-orange/10 rounded-full flex items-center justify-center text-ltt-orange/40 group-hover:scale-110 transition-transform duration-500"><AlertCircle size={32} /></div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Daily History Auditing Hub</h4>
                        <p className="text-[10px] text-text-muted italic max-w-xs mt-3 leading-relaxed opacity-40">Use the Temporal Hub above to toggle specific date ranges for historical performance reviews.</p>
                    </div>
                    <div className="flex gap-4 opacity-10">
                        <Terminal size={14} />
                        <Activity size={14} />
                        <Zap size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
