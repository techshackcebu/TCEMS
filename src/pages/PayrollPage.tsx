import React, { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    DollarSign,
    PieChart,
    Download,
    Calculator,
    Target,
    ChevronRight,
    TrendingUp,
    Receipt,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PayoutDetail {
    id: string;
    employee_name: string;
    role: string;
    days_worked: number;
    daily_wage: number;
    deminimis_daily: number;
    lates: number; // in counts
    commissions: number;
    gross_pay: number;
    net_pay: number;
    period: string;
}

const PayrollPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState<PayoutDetail[]>([]);
    const [search, setSearch] = useState('');
    const [dailyTarget] = useState(7040); // Admin Adjustment Only
    const [activePeriod] = useState('11th-25th (Payout 30th)');

    // Business Logic Constants (TechShack Standard)
    const MONTHLY_DEMINIMIS = 2500;
    const DEMINIMIS_PER_PAYOUT = MONTHLY_DEMINIMIS / 2; // 1250
    const DAYS_PER_PERIOD = 15;
    const DAILY_DEMINIMIS = DEMINIMIS_PER_PAYOUT / DAYS_PER_PERIOD; // ~₱83.33

    // Subsidy Breakdown (Static Metadata)
    const SUBSIDIES = [
        { name: 'Rice Subsidy', val: 889 },
        { name: 'Laundry Allowance', val: 412 },
        { name: 'Medical Allowance', val: 574 },
        { name: 'Uniform Allowance', val: 625 }
    ];

    useEffect(() => {
        fetchPayrollData();
    }, []);

    const fetchPayrollData = async () => {
        setLoading(true);
        // Real logic: Fetch from 'attendance' and 'tickets' tables for commissions
        const mockPayouts: PayoutDetail[] = [
            { id: 'p1', employee_name: 'John Doe', role: 'MasterTechnician', days_worked: 13, daily_wage: 540, deminimis_daily: DAILY_DEMINIMIS, lates: 2, commissions: 4200, gross_pay: 0, net_pay: 0, period: 'Aug 11-25' },
            { id: 'p2', employee_name: 'Althea Reyes', role: 'Customer Service', days_worked: 15, daily_wage: 540, deminimis_daily: DAILY_DEMINIMIS, lates: 0, commissions: 850, gross_pay: 0, net_pay: 0, period: 'Aug 11-25' },
            { id: 'p3', employee_name: 'Kyle Tech', role: 'OJT/Trainee', daily_wage: 150, days_worked: 12, deminimis_daily: 0, lates: 1, commissions: 0, gross_pay: 0, net_pay: 0, period: 'Aug 11-25' },
        ];

        const calculated = mockPayouts.map(p => {
            const isOJT = p.role === 'OJT/Trainee';
            const basic = p.days_worked * p.daily_wage;

            // LOGIC: If late/absent/undertime, manual removal of that day's deminimis
            const deminimisTotal = isOJT ? 0 : (p.days_worked - p.lates) * p.deminimis_daily;
            const gross = basic + deminimisTotal + p.commissions;

            return { ...p, gross_pay: gross, net_pay: gross };
        });

        setTimeout(() => {
            setPayouts(calculated);
            setLoading(false);
        }, 800);
    };

    const stats = [
        { label: 'Total Payroll', val: '₱' + payouts.reduce((s, p) => s + p.net_pay, 0).toLocaleString(), icon: <DollarSign size={18} />, color: 'blue' },
        { label: 'Penalty Savings', val: '₱' + (payouts.reduce((s, p) => s + p.lates, 0) * DAILY_DEMINIMIS).toFixed(2), icon: <TrendingUp size={18} />, color: 'green' },
        { label: 'Net Commissions', val: '₱' + payouts.reduce((s, p) => s + p.commissions, 0).toLocaleString(), icon: <PieChart size={18} />, color: 'orange' },
        { label: 'Revenue Target', val: '₱' + dailyTarget.toLocaleString(), icon: <Target size={18} />, color: 'red' },
    ];

    const filteredPayouts = payouts.filter(p => p.employee_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 p-2">
            {/* HEADER SECTION */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 justify-start">
                        <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-600/20"><Calculator size={28} /></div>
                        Payroll Ledger
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2 justify-start">
                        Disbursal Control <ChevronRight size={12} /> {activePeriod}
                    </p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                        <input
                            className="input-field pl-10 h-12 text-sm font-bold bg-black/20"
                            placeholder="Identify personnel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="bg-ltt-orange hover:bg-ltt-orange/90 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-ltt-orange/20 transition-all hover:scale-105 active:scale-95">
                        <Receipt size={14} /> Process Batch
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 text-white border border-glass-border px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95">
                        <Download size={14} /> Export
                    </button>
                </div>
            </header>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-5 border-l-4 border-glass-border flex items-center justify-between group transition-all hover:border-ltt-orange"
                    >
                        <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">{stat.label}</p>
                            <h3 className="text-xl font-black font-mono">{stat.val}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* PAYROLL TABLE */}
            <div className="glass-card overflow-hidden border-glass-border">
                <div className="p-6 bg-white/2 border-b border-glass-border flex justify-between items-center bg-black/40">
                    <div className="flex items-center gap-4 text-left">
                        <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue"><Calendar size={20} /></div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest text-left">Period Configuration</h3>
                            <p className="text-[10px] text-text-muted font-bold italic text-left">Monthly Cap: ₱{MONTHLY_DEMINIMIS.toLocaleString()} (Divided into 2 Payouts)</p>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-4">
                        {SUBSIDIES.map(sub => (
                            <div key={sub.name} className="px-3 py-2 bg-black/40 border border-white/5 rounded-xl text-center">
                                <p className="text-[7px] font-black uppercase text-text-muted opacity-40">{sub.name}</p>
                                <p className="text-[9px] font-black font-mono">₱{sub.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <th className="p-5 border-b border-glass-border">Personnel Node</th>
                                <th className="p-5 border-b border-glass-border text-center">Duty Cycle</th>
                                <th className="p-5 border-b border-glass-border text-center">Base Remuneration</th>
                                <th className="p-5 border-b border-glass-border text-center">De-minimis Portion</th>
                                <th className="p-5 border-b border-glass-border text-center">Profit Share</th>
                                <th className="p-5 border-b border-glass-border text-right">Net Liquidity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border/50">
                            {loading ? (
                                <tr><td colSpan={6} className="p-20 text-center"><div className="w-8 h-8 border-2 border-ltt-orange border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : filteredPayouts.map((p) => (
                                <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex flex-col text-left">
                                            <span className="font-black text-sm uppercase group-hover:text-ltt-orange transition-colors">{p.employee_name}</span>
                                            <span className="text-[9px] text-text-muted font-black tracking-widest">{p.role}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <p className="text-xs font-black font-mono">{p.days_worked} <span className="text-text-muted opacity-40 uppercase ml-1">DAYS</span></p>
                                        <p className={`text-[9px] font-black uppercase mt-1 ${p.lates > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {p.lates > 0 ? `${p.lates} PENALTY TRIGGERS` : 'PERFECT INTEGRITY'}
                                        </p>
                                    </td>
                                    <td className="p-5 text-center">
                                        <p className="text-xs font-black font-mono">₱{(p.days_worked * p.daily_wage).toLocaleString()}</p>
                                        <p className="text-[9px] text-text-muted opacity-40 font-bold uppercase tracking-widest mt-1">@ ₱{p.daily_wage}/DAY</p>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className={`text-xs font-black font-mono ${p.deminimis_daily === 0 ? 'text-text-muted opacity-20 line-through' : ''}`}>
                                                ₱{((p.days_worked - p.lates) * p.deminimis_daily).toFixed(2)}
                                            </p>
                                            {p.role !== 'OJT/Trainee' && (
                                                <div className="flex gap-0.5 mt-2">
                                                    {[1, 2, 3, 4].map(cat => (
                                                        <div key={cat} className={`w-1.5 h-1.5 rounded-full ${p.lates > 0 ? 'bg-red-500/30' : 'bg-green-500/50'}`}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <p className="text-xs font-black font-mono text-accent-blue">₱{p.commissions.toLocaleString()}</p>
                                        <p className="text-[9px] text-text-muted opacity-40 font-bold uppercase mt-1 tracking-tighter">TECH PORTION</p>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <p className="text-lg font-black font-mono text-green-500">₱{p.net_pay.toLocaleString()}</p>
                                            <button className="mt-2 text-[8px] font-black uppercase tracking-widest border border-white/10 px-2 py-1 rounded hover:bg-white/5">VOUCHER #PX-{p.id.slice(-2)}</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-black/40 border-t border-glass-border flex justify-between items-center text-left">
                    <p className="text-[9px] font-black uppercase text-text-muted opacity-40 italic tracking-widest max-w-sm leading-relaxed text-left">Protocol: System locks daily de-minimis for any lateness/undertime triggers. OJT/Trainee nodes operate on a ₱150 daily fixed rate without subsidy eligibility.</p>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black tracking-tight uppercase opacity-40">System Integrity Verified</span>
                        <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-green-500"><ShieldCheck size={20} /></div>
                    </div>
                </div>
            </div>

            {/* COMMISSION LOGIC REMINDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/5 space-y-4 text-left">
                    <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-accent-blue"><TrendingUp size={16} /> Profit Share Engine</h4>
                    <p className="text-[10px] font-medium leading-relaxed italic text-text-muted text-left">Commission = (Client Fee - Component Cost - Investor Share - Tech Overhead). Primary Technician is credited 100% of the calculated profit portion.</p>
                </div>
                <div className="glass-card p-6 border-ltt-orange/20 bg-ltt-orange/5 space-y-4 flex flex-col justify-center text-left">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-ltt-orange"><Target size={16} /> Daily Revenue Node</h4>
                        <span className="text-sm font-black font-mono">₱{dailyTarget.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-ltt-orange rounded-full shadow-[0_0_10px_#f97316]" />
                    </div>
                    <p className="text-[9px] font-black uppercase text-text-muted tracking-widest opacity-60 text-center">Target strictly controlled by Master Admin</p>
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;
