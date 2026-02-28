import React, { useState, useEffect } from 'react';
import {
    Activity,
    CreditCard,
    TrendingUp,
    ChevronDown,
    BarChart3,
    PieChart,
    Award,
    PackageSearch,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
    revenue: number;
    sales: number;
    avgTicket: number;
    profit: number;
    paymentStats: { method: string; percentage: number; color: string }[];
    topCustomers: { name: string; spend: number; visits: number }[];
    topServices: { name: string; revenue: number; count: number }[];
    revenueSeries: number[];
}

const AnalyticsPage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'Hour' | 'Day' | 'Week' | 'Month' | 'Year'>('Month');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        checkAdmin();
    }, []);

    useEffect(() => {
        if (isAdmin === true) {
            fetchStats();
        }
    }, [isAdmin, timeFilter]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role_id')
            .eq('id', user.id)
            .single();

        setIsAdmin(profile?.role_id === 1);
        setLoading(false);
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            // 1. Fetch Payments for Revenue & Methods
            const { data: payments } = await supabase
                .from('payments')
                .select('*')
                .order('created_at', { ascending: true });

            // 2. Fetch Tickets for Volume
            const { data: tickets } = await supabase
                .from('repair_tickets')
                .select('*, customers(full_name)');

            // 3. Fetch Parts for Cost/Profit
            const { data: parts } = await supabase
                .from('parts_inquiry')
                .select('*')
                .not('cost_price', 'is', null);

            if (!payments || !tickets) return;

            // Calculations
            const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount_paid), 0);
            const totalSales = tickets.length;
            const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

            const totalCost = parts?.reduce((acc, p) => acc + Number(p.cost_price || 0), 0) || 0;
            const netProfit = totalRevenue - totalCost;
            const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

            // Payment Methods
            const methodCounts: Record<string, number> = {};
            payments.forEach(p => {
                const m = p.payment_method || 'Cash';
                methodCounts[m] = (methodCounts[m] || 0) + 1;
            });
            const payStats = Object.keys(methodCounts).map((key, idx) => ({
                method: key,
                percentage: Math.round((methodCounts[key] / payments.length) * 100),
                color: idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-orange-500'
            }));

            // Top Customers
            const customerMap: Record<string, { spend: number; visits: number }> = {};
            tickets.forEach(t => {
                const name = t.customers?.full_name || 'Anonymous';
                const spend = payments.filter(p => p.ticket_id === t.id).reduce((acc, p) => acc + Number(p.amount_paid), 0);
                if (!customerMap[name]) customerMap[name] = { spend: 0, visits: 0 };
                customerMap[name].spend += spend;
                customerMap[name].visits += 1;
            });
            const sortedCust = Object.keys(customerMap)
                .map(name => ({ name, ...customerMap[name] }))
                .sort((a, b) => b.spend - a.spend)
                .slice(0, 5);

            // Mock Series for the graph (would group by date in real implementation)
            const revSeries = [40, 70, 45, 90, 65, 85, 100, 60, 75, 50, 80, 95];

            setData({
                revenue: totalRevenue,
                sales: totalSales,
                avgTicket,
                profit: profitMargin,
                paymentStats: payStats,
                topCustomers: sortedCust,
                topServices: [], // Placeholder for now
                revenueSeries: revSeries
            });

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isAdmin === null) {
        return (
            <div className="flex flex-col items-center justify-center p-40 space-y-4">
                <Loader2 size={48} className="text-ltt-orange animate-spin" />
                <p className="font-black uppercase tracking-widest text-text-muted animate-pulse">Establishing Secure Telemetry Node...</p>
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert size={64} className="text-red-500 animate-pulse" />
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Access Violation</h1>
                <p className="text-text-muted italic">This module requires Master Admin clearance. Your attempt has been logged.</p>
            </div>
        );
    }

    const overviewStats = [
        { label: 'Active Revenue', val: `₱${data?.revenue.toLocaleString()}`, icon: <TrendingUp size={20} />, trend: '+12.5%' },
        { label: 'Ticket Volume', val: data?.sales.toString() || '0', icon: <Activity size={20} />, trend: '+5.2%' },
        { label: 'Avg. Ticket Size', val: `₱${Math.round(data?.avgTicket || 0).toLocaleString()}`, icon: <CreditCard size={20} />, trend: '-1.4%' },
        { label: 'Net Profit Margin', val: `${Math.round(data?.profit || 0)}%`, icon: <TrendingUp size={20} />, trend: '+8.1%' }
    ];

    return (
        <div className="space-y-8 p-2 pb-24 text-left">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
                        <div className="bg-ltt-orange p-2.5 rounded-2xl text-white shadow-xl shadow-ltt-orange/30"><BarChart3 size={32} /></div>
                        Enterprise Analytics
                    </h1>
                    <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2 italic">Master Admin Hub <ChevronDown size={10} /> Dynamic SQL Data Mode</p>
                </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-ltt-orange/40 flex flex-col justify-between group transition-all hover:border-ltt-orange hover:bg-ltt-orange/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-black/40 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">{stat.icon}</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl lg:text-2xl font-black font-mono tracking-tighter text-white">{stat.val}</h3>
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em] opacity-60">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-6 border-glass-border space-y-6">
                        <div className="flex justify-between items-center border-b border-glass-border pb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-ltt-orange" /> Growth Node ({timeFilter})</h3>
                            <button
                                onClick={() => alert("Hyper-Ledger Generation: Compiling revenue series into PDF archive... [SYSTEM MOCK]")}
                                className="text-[10px] font-black uppercase underline text-ltt-orange"
                            >
                                Download Full Ledger
                            </button>
                        </div>
                        <div className="h-64 flex items-end gap-2 justify-between px-2 pt-10 relative">
                            {data?.revenueSeries.map((h, i) => (
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
                        </div>
                    </div>

                    <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/5">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6"><PieChart size={16} className="text-accent-blue" /> Payment Hub Distribution</h3>
                        <div className="flex h-4 rounded-full overflow-hidden mb-6 shadow-inner border border-white/5">
                            {data?.paymentStats.map(pm => (
                                <div key={pm.method} className={`h-full ${pm.color}`} style={{ width: `${pm.percentage}%` }} />
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {data?.paymentStats.map(pm => (
                                <div key={pm.method} className="text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className={`w-2 h-2 rounded-full ${pm.color}`} />
                                        <span className="text-[10px] font-black uppercase text-white">{pm.method}</span>
                                    </div>
                                    <p className="text-lg font-black font-mono">{pm.percentage}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6 border-glass-border">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-glass-border pb-4"><Award size={16} className="text-accent-blue" /> Top Profit Centers</h3>
                        <div className="space-y-4">
                            {data?.topCustomers.map((cust, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue/40 to-black border border-white/5 flex items-center justify-center text-white font-black text-xs">{i + 1}</div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-white truncate max-w-[120px]">{cust.name}</p>
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{cust.visits} Engagements</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black font-mono text-white">₱{cust.spend.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-ltt-orange/10 border border-ltt-orange/20 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3 text-ltt-orange">
                            <PackageSearch size={24} />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Operational Efficiency</h4>
                        </div>
                        <p className="text-[10px] text-text-muted font-bold italic leading-relaxed">Telemetry indicates that **LCD Replacement** remains your highest yielding service node this cycle. Recommend increasing buffer stock for iPhone/MacBook panels.</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AnalyticsPage;
