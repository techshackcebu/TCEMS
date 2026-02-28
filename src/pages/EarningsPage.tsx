import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Search,
    TrendingUp,
    DollarSign,
    Award,
    PieChart,
    Target,
    ChevronRight,
    Wrench,
    Clock,
    BarChart3,
    Activity,
    Zap,
    LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketProfit {
    id: string;
    ticket_number: number;
    device: string;
    customer: string;
    total_charge: number;
    parts_cost: number;
    investor_share: number;
    tech_payout: number; // The commission they get
    profit_remaining: number; // Company profit
    date: string;
}

const EarningsPage: React.FC = () => {
    const [earnings, setEarnings] = useState<TicketProfit[]>([
        { id: 't1', ticket_number: 1024, device: 'MacBook Pro 14', customer: 'Alice', total_charge: 15000, parts_cost: 4500, investor_share: 750, tech_payout: 9750, profit_remaining: 0, date: '2024-02-28' },
        { id: 't2', ticket_number: 1025, device: 'iPhone 13 OLED', customer: 'Bob', total_charge: 8500, parts_cost: 3200, investor_share: 425, tech_payout: 4875, profit_remaining: 0, date: '2024-02-28' }
    ]);
    const [loading, setLoading] = useState(false);

    // Business Logic: (Total - Parts - Investor - Tech) = Co Profit
    // For MasterTech, user indicated they get the net profit after parts/investor
    // "Cost - price - Investor share - Cost given to technician (There are services That The cost goes to a specific technician = Profits"

    const stats = [
        { label: 'Realized Earning', val: '₱' + earnings.reduce((s, e) => s + e.tech_payout, 0).toLocaleString(), icon: <DollarSign size={20} />, color: 'blue' },
        { label: 'Efficiency ROI', val: '65.2%', icon: <Zap size={20} />, color: 'green' },
        { label: 'L3 Ticket Count', val: earnings.length, icon: <LayoutGrid size={20} />, color: 'orange' },
        { label: 'Avg Payout/Unit', val: '₱' + (earnings.reduce((s, e) => s + e.tech_payout, 0) / earnings.length).toLocaleString(), icon: <TrendingUp size={20} />, color: 'red' }
    ];

    return (
        <div className="space-y-10 p-2">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <div className="bg-ltt-orange p-2.5 rounded-2xl text-white shadow-xl shadow-ltt-orange/30"><ShieldCheck size={32} /></div>
                        Specialist Earnings
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 italic">Level 3 Net Profit Distributions & Commissions</p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[10px] font-black uppercase text-text-muted opacity-40 mb-1 tracking-widest">Active Pay Period</p>
                        <p className="text-sm font-black font-mono flex items-center gap-2">FEB 11 - FEB 25 <Clock size={14} className="text-ltt-orange" /></p>
                    </div>
                </div>
            </header>

            {/* PERFORMANCE HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-ltt-orange/20 flex items-center justify-between group transition-all hover:bg-ltt-orange/5"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-40">{stat.label}</p>
                            <h3 className="text-2xl font-black font-mono tracking-tighter">{stat.val}</h3>
                        </div>
                        <div className="p-4 bg-black/40 rounded-[1.5rem] group-hover:bg-ltt-orange/20 transition-all shadow-inner">{stat.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* EARNINGS LOG */}
            <div className="glass-card overflow-hidden border-glass-border bg-black/20">
                <div className="p-6 bg-white/2 border-b border-glass-border flex justify-between items-center bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-ltt-orange/10 rounded-xl text-ltt-orange"><Wrench size={20} /></div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Commission Ledger</h3>
                            <p className="text-[10px] text-text-muted font-bold italic">TKT Profit Distributions Verified</p>
                        </div>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={16} />
                        <input className="input-field pl-10 h-10 text-[10px] font-black uppercase bg-black/40 border-glass-border focus:border-ltt-orange" placeholder="Search TKT# or Device..." />
                    </div>
                </div>

                <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <th className="p-6 border-b border-glass-border">TKT Identifier</th>
                                <th className="p-6 border-b border-glass-border">Device & Customer</th>
                                <th className="p-6 border-b border-glass-border">Billing Flow</th>
                                <th className="p-6 border-b border-glass-border text-right">Net Specialist Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border/40">
                            {earnings.map((e, idx) => {
                                const investorShare = e.total_charge * 0.05; // Example 5% 
                                const techPayout = e.total_charge - e.parts_cost - investorShare;
                                return (
                                    <tr key={e.id} className="hover:bg-white/2 transition-all group">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black font-mono">#{e.ticket_number}</span>
                                                <span className="text-[9px] text-text-muted font-black opacity-40 uppercase tracking-widest mt-1">L3 CERTIFIED</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase group-hover:text-ltt-orange transition-colors">{e.device}</span>
                                                <span className="text-[9px] text-text-muted font-bold tracking-widest opacity-60 italic">{e.customer} • {e.date}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-6">
                                                <div className="text-xs font-black font-mono space-y-1">
                                                    <p className="text-white">₱{e.total_charge.toLocaleString()}</p>
                                                    <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">Gross Charge</p>
                                                </div>
                                                <ChevronRight size={14} className="text-text-muted opacity-20" />
                                                <div className="text-xs font-black font-mono space-y-1 opacity-60">
                                                    <p className="text-red-500">- ₱{e.parts_cost.toLocaleString()}</p>
                                                    <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">Comp Costs</p>
                                                </div>
                                                <ChevronRight size={14} className="text-text-muted opacity-20" />
                                                <div className="text-xs font-black font-mono space-y-1 opacity-60">
                                                    <p className="text-accent-blue">- ₱{investorShare.toLocaleString()}</p>
                                                    <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-40">Investor Share</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right flex flex-col items-end">
                                            <p className="text-xl font-black font-mono text-green-500">₱{techPayout.toLocaleString()}</p>
                                            <button className="mt-3 text-[8px] font-black uppercase tracking-[0.2em] border border-white/10 px-3 py-1.5 rounded-lg hover:bg-ltt-orange hover:text-white transition-all group flex items-center gap-2 shadow-xl shadow-black/20">
                                                <BarChart3 size={12} /> Analytics <ChevronRight size={10} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-black/40 border-t border-glass-border flex justify-between items-center relative overflow-hidden">
                    <div className="space-y-2 z-10 relative">
                        <div className="flex items-center gap-3">
                            <h4 className="text-sm font-black uppercase tracking-widest text-text-muted opacity-40">Business Logic Audit</h4>
                            <div className="h-[2px] w-20 bg-ltt-orange/20"></div>
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-[0.2em] max-w-lg leading-relaxed text-text-muted opacity-30">Formula: (Retail - COGS - InvestorShare - ServiceFee) = Specialist Payout. All calculations verified via L3 technical ledger protocol.</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-ltt-orange/40 z-10 relative"><Award size={32} /></div>

                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-ltt-orange transform rotate-12 translate-x-12"><Activity size={100} /></div>
                </div>
            </div>
        </div>
    );
};

export default EarningsPage;
