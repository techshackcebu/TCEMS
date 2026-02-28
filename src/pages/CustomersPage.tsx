import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    UserPlus,
    Phone,
    Mail,
    MapPin,
    History,
    ChevronRight,
    Smartphone,
    Clock,
    User,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Customer {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    address?: string;
    created_at: string;
    tickets_count?: number;
    active_tickets?: number;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerHistory, setCustomerHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('customers')
            .select(`
                *,
                repair_tickets(count)
            `)
            .order('full_name');

        if (!error && data) {
            const formatted = data.map((c: any) => ({
                ...c,
                tickets_count: c.repair_tickets?.[0]?.count || 0
            }));
            setCustomers(formatted);
        }
        setLoading(false);
    };

    const fetchCustomerHistory = async (customerId: string) => {
        const { data, error } = await supabase
            .from('repair_tickets')
            .select(`
                *,
                devices (brand, model)
            `)
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (!error && data) setCustomerHistory(data);
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        fetchCustomerHistory(customer.id);
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const stats = [
        { label: 'Total Base', val: customers.length, icon: <Users size={18} />, color: 'blue' },
        { label: 'Loyalty index', val: '84%', icon: <ShieldCheck size={18} />, color: 'green' },
        { label: 'Growth rate', val: '+12.5%', icon: <CheckCircle2 size={18} />, color: 'orange' },
    ];

    return (
        <div className="space-y-8 p-2">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-xl text-white shadow-lg shadow-ltt-orange/20">
                            <Users size={28} />
                        </div>
                        Customer Registry
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
                        Client Database <ChevronRight size={12} /> TechShack CRM
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                        <input
                            className="input-field pl-10 h-12 text-sm font-bold bg-black/20"
                            placeholder="Identify client entity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="bg-ltt-orange hover:bg-ltt-orange/90 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-ltt-orange/20 transition-all hover:scale-105 active:scale-95">
                        <UserPlus size={18} /> Add Client
                    </button>
                </div>
            </header>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-5 border-l-4 border-ltt-orange/20 flex items-center justify-between group transition-all hover:border-ltt-orange"
                    >
                        <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black font-mono tracking-tighter">{stat.val}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* CUSTOMERS LIST/GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-10 h-10 border-4 border-ltt-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : filteredCustomers.map((customer, idx) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelectCustomer(customer)}
                            className="glass-card p-6 border-glass-border group hover:border-ltt-orange/30 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6 z-10 relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-bg-slate to-black rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                    <User size={28} className="text-text-muted opacity-40 group-hover:text-ltt-orange transition-colors" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <h3 className="text-lg font-black uppercase truncate group-hover:text-ltt-orange transition-colors">{customer.full_name}</h3>
                                    <div className="flex items-center gap-2 text-text-muted opacity-60 text-[10px] font-bold uppercase tracking-widest">
                                        <Clock size={10} /> Joined {new Date(customer.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-glass-border/40 z-10 relative">
                                <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
                                    <Phone size={14} className="text-ltt-orange/60" /> {customer.phone}
                                </div>
                                {customer.address && (
                                    <div className="flex items-center gap-3 text-xs font-bold text-text-muted truncate">
                                        <MapPin size={14} className="text-accent-blue/60" /> {customer.address}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest z-10 relative">
                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    {customer.tickets_count} Lifetime Repairs
                                </div>
                                <button className="text-ltt-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Inspect <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="absolute -bottom-10 -right-10 opacity-5 text-ltt-orange transform rotate-12 scale-[3] pointer-events-none group-hover:scale-[3.5] transition-transform">
                                <Users size={100} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* CUSTOMER DETAIL MODAL */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-4xl bg-bg-slate border border-glass-border rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh] shadow-2xl"
                        >
                            <header className="p-8 bg-black/20 border-b border-glass-border flex justify-between items-center text-left">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-ltt-orange to-black rounded-3xl flex items-center justify-center border-4 border-white/5">
                                        <User size={40} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase text-ltt-orange tracking-[0.4em] italic mb-1">Entity Profile v1.2</p>
                                        <h2 className="text-3xl font-black uppercase tracking-tight">{selectedCustomer.full_name}</h2>
                                        <p className="text-xs font-bold text-text-muted mt-1">ID: CLIENT-{selectedCustomer.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <ChevronRight size={24} className="rotate-90" />
                                </button>
                            </header>

                            <div className="flex-1 flex overflow-hidden">
                                <aside className="w-80 border-r border-glass-border p-8 space-y-8 bg-black/20">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest opacity-40">Direct Contact</p>
                                            <p className="font-bold flex items-center gap-3"><Phone size={16} className="text-ltt-orange" /> {selectedCustomer.phone}</p>
                                            {selectedCustomer.email && <p className="font-bold flex items-center gap-3 mt-2"><Mail size={16} className="text-accent-blue" /> {selectedCustomer.email}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest opacity-40">Mailing Address</p>
                                            <p className="text-sm font-bold flex items-start gap-3 italic"><MapPin size={16} className="text-red-500 mt-0.5 shrink-0" /> {selectedCustomer.address || 'No registered coordinate.'}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-ltt-orange/5 border border-ltt-orange/10 rounded-2xl space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-ltt-orange tracking-widest flex items-center gap-2"><Smartphone size={14} /> Quick Logs</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <p className="text-xl font-black font-mono">{selectedCustomer.tickets_count}</p>
                                                <p className="text-[7px] font-black uppercase opacity-40">Lifetime Jobs</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-black font-mono text-green-500">100%</p>
                                                <p className="text-[7px] font-black uppercase opacity-40">Payment Integrity</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-text-muted">Modify Entity Identity</button>
                                </aside>

                                <main className="flex-1 p-8 overflow-y-auto bg-black/40">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 opacity-60">
                                            <History size={20} className="text-ltt-orange" /> Job Evolution History
                                        </h3>

                                        <div className="space-y-4 text-left">
                                            {customerHistory.length === 0 ? (
                                                <div className="p-10 border-2 border-dashed border-glass-border rounded-3xl text-center opacity-20">
                                                    <p className="text-xs font-black uppercase tracking-widest">No previous nodes recorded.</p>
                                                </div>
                                            ) : customerHistory.map(ticket => (
                                                <div key={ticket.id} className="p-6 bg-black/40 rounded-3xl border border-glass-border flex justify-between items-center group hover:border-ltt-orange/20 transition-all">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-ltt-orange/60">
                                                            <Smartphone size={24} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="font-black uppercase tracking-tight">{ticket.devices.brand} {ticket.devices.model}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-black tracking-widest text-text-muted opacity-40 uppercase">TKT-{ticket.ticket_number}</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${ticket.status === 'Released' || ticket.status === 'Done' ? 'bg-green-500/10 text-green-500' : 'bg-ltt-orange/10 text-ltt-orange'}`}>
                                                                    {ticket.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-text-muted uppercase opacity-40">Recorded</p>
                                                        <p className="text-xs font-black font-mono">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomersPage;
