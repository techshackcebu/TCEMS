import React, { useState, useEffect } from 'react';
import {
    Search,
    PieChart,
    Download,
    Calculator,
    Target,
    ChevronRight,
    TrendingUp,
    Receipt,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../lib/supabase';

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
    const [dailyTarget, setDailyTarget] = useState(7040);
    const [activePeriod] = useState('11th-25th (Payout 30th)');
    const [currencySymbol, setCurrencySymbol] = useState('₱');

    // Business Logic State (Fetched from Engine)
    const [payrollBasics, setPayrollBasics] = useState({
        monthly_deminimis: 2500,
        base_daily_wage: 540,
        regular_days_per_period: 15
    });

    const DEMINIMIS_PER_PAYOUT = payrollBasics.monthly_deminimis / 2; // 1250
    const DAILY_DEMINIMIS = DEMINIMIS_PER_PAYOUT / payrollBasics.regular_days_per_period; // ~₱83.33

    // Subsidy Breakdown (Static Metadata)
    const SUBSIDIES = [
        { name: 'Rice Subsidy', val: 889 },
        { name: 'Laundry Allowance', val: 412 },
        { name: 'Medical Allowance', val: 574 },
        { name: 'Uniform Allowance', val: 625 }
    ];

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('system_config').select('*');
            if (data) {
                const payrollConfig = data.find((c: any) => c.key === 'PAYROLL_BASICS');
                const targetConfig = data.find((c: any) => c.key === 'DAILY_REVENUE_TARGET');
                const currencyConfig = data.find((c: any) => c.key === 'BASE_CURRENCY');
                if (payrollConfig) setPayrollBasics(payrollConfig.value);
                if (targetConfig) setDailyTarget(Number(targetConfig.value));
                if (currencyConfig) setCurrencySymbol(currencyConfig.value.symbol);
            }
        };
        fetchConfig();
        fetchPayrollData();
    }, []);

    const fetchPayrollData = async () => {
        setLoading(true);
        // Real logic: Fetch from 'attendance' and 'tickets' tables for commissions
        const mockPayouts: PayoutDetail[] = [
            { id: 'p1', employee_name: 'John Doe', role: 'MasterTechnician', days_worked: 13, daily_wage: payrollBasics.base_daily_wage, deminimis_daily: DAILY_DEMINIMIS, lates: 2, commissions: 4200, gross_pay: 0, net_pay: 0, period: 'Aug 11-25' },
            { id: 'p2', employee_name: 'Althea Reyes', role: 'Customer Service', days_worked: 15, daily_wage: payrollBasics.base_daily_wage, deminimis_daily: DAILY_DEMINIMIS, lates: 0, commissions: 850, gross_pay: 0, net_pay: 0, period: 'Aug 11-25' },
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

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFillColor(34, 40, 49); // Dark background feel
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TECHSHACK TCEMS', 14, 20);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Payroll Disbursal Ledger: ${activePeriod}`, 14, 40);

        const tableColumn = ["Personnel", "Duty Cycle", "Base Pay", "De-minimis", "Commission", "Net Pay"];
        const tableRows = payouts.map(p => [
            `${p.employee_name} (${p.role})`,
            `${p.days_worked} Days / ${p.lates} Lates`,
            `${currencySymbol}${p.daily_wage * p.days_worked}`,
            `${currencySymbol}${((p.days_worked - p.lates) * p.deminimis_daily).toFixed(0)}`,
            `${currencySymbol}${p.commissions}`,
            `${currencySymbol}${p.net_pay.toLocaleString()}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [241, 90, 36] }
        });

        doc.save(`TechShack_Payroll_${activePeriod.replace(/ /g, '_')}.pdf`);
    };

    const filteredPayouts = payouts.filter(p => p.employee_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-10 p-2 pb-20">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-xl text-white shadow-lg shadow-ltt-orange/20">
                            <Calculator size={28} />
                        </div>
                        Payroll Ledger
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
                        Financial Hub <ChevronRight size={12} /> Cycle: {activePeriod}
                    </p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <button
                        onClick={handleExportPDF}
                        disabled={loading}
                        className="flex-1 lg:flex-none bg-white/5 hover:bg-white/10 border border-glass-border text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                        <Download size={20} /> Export PDF
                    </button>
                    <button className="flex-1 lg:flex-none bg-ltt-orange hover:bg-ltt-orange/90 text-white px-8 h-14 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-ltt-orange/30 transition-all hover:scale-105 active:scale-95">
                        <ShieldCheck size={20} /> Finalize Payout
                    </button>
                </div>
            </header>

            {/* PERFORMANCE HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 border-l-4 border-ltt-orange space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-ltt-orange/10 rounded-2xl text-ltt-orange"><Target size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">Operational</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest opacity-40">Monthly De-minimis Cap</p>
                        <h3 className="text-3xl font-black font-mono">{currencySymbol}{payrollBasics.monthly_deminimis.toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-text-muted mt-2 uppercase italic leading-none">Shared across Rice, Laundry, Medical, & Uniform</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 border-l-4 border-accent-blue space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-accent-blue/10 rounded-2xl text-accent-blue"><TrendingUp size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">+12% vs LY</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest opacity-40">Daily Sales Baseline</p>
                        <h3 className="text-3xl font-black font-mono">{currencySymbol}{dailyTarget.toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-text-muted mt-2 uppercase italic leading-none">Target threshold for commission multipliers</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 border-l-4 border-purple-500 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><PieChart size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg">Est. Disbursement</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest opacity-40">Current Period Payout</p>
                        <h3 className="text-3xl font-black font-mono">{currencySymbol}{payouts.reduce((sum, p) => sum + p.net_pay, 0).toLocaleString()}</h3>
                        <p className="text-[9px] font-bold text-text-muted mt-2 uppercase italic leading-none">Allocated for 30th payment window</p>
                    </div>
                </motion.div>
            </div>

            {/* PAYROLL TABLE */}
            <div className="glass-card p-0 overflow-hidden border-glass-border">
                <div className="p-6 border-b border-glass-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Find Specialist..."
                            className="input-field pl-12 h-14 bg-black/40 text-sm font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-bg-carbon bg-ltt-orange flex items-center justify-center text-[10px] font-black">JD</div>
                            <div className="w-10 h-10 rounded-full border-2 border-bg-carbon bg-accent-blue flex items-center justify-center text-[10px] font-black">AR</div>
                            <div className="w-10 h-10 rounded-full border-2 border-bg-carbon bg-white/10 flex items-center justify-center text-[10px] font-black">+5</div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-text-muted opacity-60">Verified Personnel Only</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-[10px] font-black uppercase text-text-muted tracking-widest border-b border-glass-border">
                                <th className="px-8 py-5">Personnel Portfolio</th>
                                <th className="px-8 py-5">Cycle Stats</th>
                                <th className="px-8 py-5">Base Earnings</th>
                                <th className="px-8 py-5">Subsidies (De-minimis)</th>
                                <th className="px-8 py-5">Commissions</th>
                                <th className="px-8 py-5 text-right">Net Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border">
                            <AnimatePresence>
                                {filteredPayouts.map((p) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-text-muted font-black text-xs group-hover:bg-ltt-orange/20 group-hover:text-ltt-orange transition-all">
                                                    {p.employee_name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-black text-sm uppercase tracking-tight">{p.employee_name}</p>
                                                    <p className="text-[9px] font-bold text-text-muted uppercase opacity-60">{p.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1 text-left">
                                                <p className="text-xs font-black font-mono">{p.days_worked} <span className="text-[9px] text-text-muted uppercase">Duty Days</span></p>
                                                <p className={`text-[9px] font-black uppercase ${p.lates > 0 ? 'text-red-500' : 'text-green-500 opacity-60'}`}>{p.lates} Penalty Incidents</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <p className="text-sm font-black font-mono">{currencySymbol}{(p.daily_wage * p.days_worked).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black font-mono text-blue-400">+{currencySymbol}{((p.days_worked - p.lates) * p.deminimis_daily).toFixed(0)}</span>
                                                {p.lates > 0 && <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-1 rounded uppercase tracking-tighter">Penalty Applied</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <p className="text-sm font-black font-mono text-purple-400">+{currencySymbol}{p.commissions.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className="text-lg font-black font-mono text-white">{currencySymbol}{p.net_pay.toLocaleString()}</p>
                                                <div className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase tracking-widest">
                                                    <ShieldCheck size={10} /> Escrow Ready
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-ltt-orange border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted animate-pulse">Computing Disbursal Ledger...</p>
                    </div>
                )}
            </div>

            {/* BREAKDOWN PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                <div className="glass-card p-10 border-glass-border space-y-8">
                    <div className="space-y-2 text-left">
                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <Receipt size={24} className="text-ltt-orange" /> Subsidy Mapping
                        </h3>
                        <p className="text-text-muted text-xs font-bold italic opacity-40">Monthly de-minimis allocation for Regular personnel.</p>
                    </div>

                    <div className="space-y-4">
                        {SUBSIDIES.map((sub, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white/[0.02] border border-glass-border rounded-2xl hover:bg-white/[0.05] transition-all">
                                <span className="text-xs font-black uppercase text-text-muted">{sub.name}</span>
                                <span className="text-sm font-black font-mono">{currencySymbol}{sub.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-10 border-accent-blue/20 bg-accent-blue/5 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-[-20px] left-[-20px] opacity-10 text-accent-blue rotate-12"><ShieldCheck size={120} /></div>
                    <div className="w-20 h-20 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue shadow-inner animate-pulse"><Calculator size={40} /></div>
                    <div className="z-10">
                        <h4 className="text-lg font-black uppercase tracking-widest text-white">Manual Disbursal override</h4>
                        <p className="text-[11px] text-text-muted italic max-w-sm mt-3 leading-relaxed opacity-60">Authorize manual payout outside of the standard 15th/30th window. Requires L-Admin clearance token.</p>
                    </div>
                    <button className="z-10 px-8 py-3 bg-white/5 border border-accent-blue/40 text-accent-blue rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-accent-blue hover:text-white transition-all">Elevate Session</button>
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;
