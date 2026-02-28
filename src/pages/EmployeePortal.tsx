import React, { useState } from 'react';
import {
    User,
    Clock,
    History,
    Download,
    ArrowUpRight,
    TrendingUp,
    Activity,
    ChevronRight,
    Target,
    FileText,
    Zap,
    LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendanceRecord {
    id: string;
    date: string;
    clockIn: string;
    clockOut: string;
    lunchOut: string;
    lunchIn: string;
    status: 'COMPLETE' | 'LATE' | 'UNDERTIME' | 'ABSENT';
}

interface RequestItem {
    id: string;
    type: 'SIL' | 'CASH_ADVANCE';
    amount?: number;
    days?: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
}

const EmployeePortal: React.FC = () => {
    const [attendance] = useState<AttendanceRecord[]>([
        { id: '1', date: 'Feb 28, 2024', clockIn: '08:55 AM', clockOut: '05:05 PM', lunchOut: '12:00 PM', lunchIn: '01:00 PM', status: 'COMPLETE' },
        { id: '2', date: 'Feb 27, 2024', clockIn: '09:15 AM', clockOut: '05:30 PM', lunchOut: '12:05 PM', lunchIn: '01:05 PM', status: 'LATE' },
    ]);

    const [requests] = useState<RequestItem[]>([
        { id: 'r1', type: 'CASH_ADVANCE', amount: 2000, status: 'APPROVED', date: 'Feb 25, 2024' },
        { id: 'r2', type: 'SIL', days: 1, status: 'PENDING', date: 'Feb 24, 2024' },
    ]);

    const stats = [
        { label: 'Current Running Pay', val: '₱5,480.00', sub: 'Feb 11 - Feb 25 Period', icon: <TrendingUp size={20} />, color: 'blue' },
        { label: 'Clock Efficiency', val: '92%', sub: 'Avg Attendance Speed', icon: <Activity size={20} />, color: 'green' },
        { label: 'SIL Credits', val: '4.0', sub: 'Available Leave Days', icon: <FileText size={20} />, color: 'orange' },
        { label: 'Outstanding Balance', val: '₱2,000.00', sub: 'Cash Advance Repayment', icon: <Zap size={20} />, color: 'red' },
    ];

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* PERSONAL HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <div className="bg-accent-blue p-2.5 rounded-2xl text-white shadow-xl shadow-accent-blue/30"><User size={32} /></div>
                        Personnel Terminal
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 italic">Welcome back, John Doe <ChevronRight size={10} /> Specialist #1024</p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none h-14 px-8 bg-white/5 hover:bg-white/10 border border-glass-border rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all">
                        <Download size={18} /> Download Payslip
                    </button>
                    <button className="flex-1 lg:flex-none h-14 px-8 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-accent-blue/40">
                        <Target size={18} /> Request Leave
                    </button>
                </div>
            </header>

            {/* FINANCIAL HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-accent-blue/20 hover:border-accent-blue transition-all group flex items-center justify-between"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40">{stat.label}</p>
                            <h3 className="text-2xl font-black font-mono tracking-tighter">{stat.val}</h3>
                            <p className="text-[9px] font-black italic text-text-muted opacity-60">{stat.sub}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-[1.5rem] group-hover:bg-accent-blue/20 transition-all shadow-inner">{stat.icon}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center border-b border-glass-border pb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3"><History size={20} className="text-accent-blue" /> T&A Record History</h3>
                        <div className="flex items-center gap-3 text-xs font-black text-text-muted opacity-40 uppercase tracking-widest italic">Feb 2024 Pay Period</div>
                    </div>

                    <div className="glass-card overflow-hidden bg-white/2 border-glass-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest opacity-60">
                                        <th className="p-5 border-b border-glass-border">Date & Timeline</th>
                                        <th className="p-5 border-b border-glass-border">Primary Shift</th>
                                        <th className="p-5 border-b border-glass-border">Interval Session</th>
                                        <th className="p-5 border-b border-glass-border text-right">Verification Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass-border/40">
                                    {attendance.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-white/2 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black group-hover:text-accent-blue transition-colors uppercase italic">{rec.date}</span>
                                                    <span className="text-[9px] text-text-muted font-bold tracking-widest uppercase mt-1 leading-none opacity-40 italic">9AM-5PM Enterprise Standard</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-black font-mono text-white/80"><Clock size={12} className="text-green-500" /> {rec.clockIn}</div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black font-mono text-white/80"><Clock size={12} className="text-red-500" /> {rec.clockOut}</div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-black font-mono text-text-muted opacity-60 italic">Break Out: {rec.lunchOut}</div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black font-mono text-text-muted opacity-60 italic">Break In: {rec.lunchIn}</div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${rec.status === 'COMPLETE' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 border-l-4 border-ltt-orange/40 bg-white/2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3"><ArrowUpRight size={20} className="text-ltt-orange" /> Advance Hub</h3>
                            <Zap size={20} className="text-ltt-orange animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-text-muted opacity-40 tracking-widest italic leading-relaxed">Limit: 100% of Current Running Pay (Max ₱5,480)</p>

                        <div className="space-y-4 pt-4 border-t border-glass-border">
                            <div className="relative group">
                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-ltt-orange opacity-40 group-focus-within:opacity-100 transition-opacity" size={20} />
                                <input className="input-field pl-10 h-14 text-xl font-black font-mono bg-black/40 border-glass-border focus:border-ltt-orange/60" placeholder="0.00" type="number" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-ltt-orange transition-all">Settle Next Cutoff</button>
                                <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-ltt-orange transition-all font-black">Split (1 Month)</button>
                            </div>
                            <button className="w-full py-4 bg-ltt-orange hover:bg-ltt-orange/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-ltt-orange/40">Request Liquidity</button>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-text-muted opacity-40 italic"><LayoutGrid size={16} /> Pending Directives</h3>
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="p-4 bg-black/40 rounded-2xl border border-glass-border group hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg text-white ${req.type === 'SIL' ? 'bg-accent-blue/40' : 'bg-ltt-orange/40'}`}><FileText size={14} /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase">{req.type.replace('_', ' ')}</p>
                                                <p className="text-[8px] font-black opacity-30 italic">{req.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'text-green-500' : req.status === 'REJECTED' ? 'text-red-500' : 'text-accent-blue opacity-100'}`}>{req.status}</span>
                                    </div>
                                    {req.amount && <p className="text-sm font-black font-mono mt-3">₱{req.amount.toLocaleString()}</p>}
                                    {req.days && <p className="text-sm font-black font-mono mt-3">{req.days} FULL DAY CREDIT</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 border-glass-border space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3"><FileText size={16} className="text-accent-blue" /> Disbursal History</h3>
                        <div className="space-y-2">
                            {[
                                { period: 'Jan 26 - Feb 10', amount: 9420 },
                                { period: 'Jan 11 - Jan 25', amount: 8250 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl cursor-not-allowed group transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-text-muted opacity-60 italic">{item.period}</p>
                                        <p className="text-xs font-black font-mono">₱{item.amount.toLocaleString()}</p>
                                    </div>
                                    <Download size={14} className="text-text-muted opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployeePortal;
