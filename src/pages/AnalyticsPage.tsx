import React, { useState } from 'react';
import {
    Activity,
    CreditCard,
    DollarSign,
    TrendingUp,
    Users,
    PackageSearch,
    ChevronDown,
    BarChart3,
    PieChart,
    Award,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsPage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'Hour' | 'Day' | 'Week' | 'Month' | 'Year'>('Month');

    // Mock Data for Analytics
    const overviewStats = [
        { label: 'Gross Revenue', val: '₱245,050.00', icon: <DollarSign size={20} />, trend: '+12.5%' },
        { label: 'Total Ticket Volume (Sales)', val: '142', icon: <Activity size={20} />, trend: '+5.2%' },
        { label: 'Avg. Ticket Size', val: '₱1,725.70', icon: <CreditCard size={20} />, trend: '-1.4%' },
        { label: 'Net Profit Margin', val: '42.8%', icon: <TrendingUp size={20} />, trend: '+8.1%' }
    ];

    const topCustomers = [
        { name: 'John Doe', spend: 25000, visits: 4 },
        { name: 'Alice Tech', spend: 18400, visits: 2 },
        { name: 'Bob Cyber', spend: 12100, visits: 5 },
    ];

    const topServices = [
        { name: 'LCD Replacement (Laptop)', revenue: 85000, count: 18 },
        { name: 'SSD Upgrade + OS', revenue: 45000, count: 25 },
        { name: 'Motherboard Repair', revenue: 32000, count: 8 },
        { name: 'Thermal Repaste', revenue: 15000, count: 30 },
    ];

    const paymentMethods = [
        { method: 'GCash', percentage: 55, color: 'bg-blue-500' },
        { method: 'Cash', percentage: 30, color: 'bg-green-500' },
        { method: 'Bank Transfer', percentage: 15, color: 'bg-orange-500' }
    ];

    // Admin Verification Mock
    const isAdmin = true; // In real app, check role from profile

    if (!isAdmin) {
        return (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert size={64} className="text-red-500 animate-pulse" />
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Access Violation</h1>
                <p className="text-text-muted italic">This module requires Master Admin clearance.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2 pb-24">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-left">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 justify-start text-white">
                        <div className="bg-ltt-orange p-2.5 rounded-2xl text-white shadow-xl shadow-ltt-orange/30"><BarChart3 size={32} /></div>
                        Enterprise Analytics
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 justify-start italic">Master Admin Telemetry & Financial Hub</p>
                </div>

                {/* TEMPORAL FILTER (Hour, Day, Week, Month) */}
                <div className="flex bg-black/40 rounded-xl p-1 border border-glass-border shadow-inner hidden md:flex">
                    {['Hour', 'Day', 'Week', 'Month', 'Year'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${timeFilter === filter ? 'bg-ltt-orange text-white shadow-md' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </header>

            {/* OVERVIEW METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-ltt-orange/40 flex flex-col justify-between group transition-all hover:border-ltt-orange hover:bg-ltt-orange/5 text-left"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-black/40 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">{stat.icon}</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="space-y-1 text-left">
                            <h3 className="text-2xl font-black font-mono tracking-tighter text-white">{stat.val}</h3>
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-60">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {/* LEFT COLUMN: CHARTS & PAYMENT */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Graph Placeholder */}
                    <div className="glass-card p-6 border-glass-border space-y-6">
                        <div className="flex justify-between items-center border-b border-glass-border pb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-ltt-orange" /> Revenue Trajectory ({timeFilter})</h3>
                            <button className="text-[10px] font-black uppercase flex items-center gap-1 text-text-muted hover:text-white transition-colors">Export CSV <ChevronDown size={12} /></button>
                        </div>
                        <div className="h-64 flex items-end gap-2 justify-between px-2 pt-10 relative">
                            {/* Fake Graph Bars */}
                            {[40, 70, 45, 90, 65, 85, 100, 60, 75, 50, 80, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05 + 0.3 }}
                                    className="w-full bg-gradient-to-t from-ltt-orange/20 to-ltt-orange rounded-t-sm relative group cursor-pointer"
                                    style={{ opacity: h > 80 ? 1 : 0.6 }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] font-bold p-1 rounded z-10 whitespace-nowrap">₱{(h * 1500).toLocaleString()}</div>
                                </motion.div>
                            ))}
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                {[1, 2, 3, 4, 5].map(l => <div key={l} className="w-full border-t border-white border-dashed h-0" />)}
                            </div>
                        </div>
                    </div>

                    {/* PAYMENT METHODS */}
                    <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/5">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6"><PieChart size={16} className="text-accent-blue" /> Tender Distribution</h3>
                        <div className="flex h-4 rounded-full overflow-hidden mb-6 shadow-inner border border-white/5">
                            {paymentMethods.map(pm => (
                                <motion.div
                                    key={pm.method}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pm.percentage}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full ${pm.color}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-around">
                            {paymentMethods.map(pm => (
                                <div key={pm.method} className="text-center space-y-1">
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className={`w-2 h-2 rounded-full ${pm.color}`} />
                                        <span className="text-xs font-black uppercase text-white">{pm.method}</span>
                                    </div>
                                    <p className="text-xl font-black font-mono">{pm.percentage}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: LEADERBOARDS */}
                <div className="space-y-8">
                    {/* TOP PRODUCTS / SERVICES */}
                    <div className="glass-card p-6 border-glass-border">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-glass-border pb-4"><PackageSearch size={16} className="text-ltt-orange" /> Top Revenue Nodes</h3>
                        <div className="space-y-4">
                            {topServices.map((svc, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-text-muted">{i + 1}</div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-white truncate max-w-[150px]">{svc.name}</p>
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{svc.count} Executions</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black font-mono text-green-500">₱{svc.revenue.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOP CUSTOMERS */}
                    <div className="glass-card p-6 border-glass-border">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-glass-border pb-4"><Award size={16} className="text-accent-blue" /> Elite Clientele</h3>
                        <div className="space-y-4">
                            {topCustomers.map((cust, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue/40 to-black border border-white/5 flex items-center justify-center text-white"><Users size={14} /></div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-white">{cust.name}</p>
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{cust.visits} Visits</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black font-mono text-white">₱{cust.spend.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-dashed border-glass-border rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:border-white/20 transition-all">View All Ledger</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AnalyticsPage;
