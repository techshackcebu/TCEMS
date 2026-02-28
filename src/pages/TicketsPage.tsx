import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, AlertCircle, Wrench, Package, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Ticket {
    id: string;
    ticket_number: number;
    status: 'Pending' | 'In Progress' | 'Waiting for Parts' | 'Done' | 'Released' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    customer_id: string;
    customers: { full_name: string; phone: string };
    device_id: string;
    devices: { brand: string; model: string };
    created_at: string;
    fault_report?: string;
}

const TicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchTickets();

        // Set up real-time subscription
        const channel = supabase
            .channel('repair_tickets_changes')
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'repair_tickets'
                },
                () => {
                    fetchTickets();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('repair_tickets')
            .select(`
        *,
        customers (full_name, phone),
        devices (brand, model)
      `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setTickets(data as unknown as Ticket[]);
        }
        setLoading(false);
    };

    const statusColors: Record<string, string> = {
        'Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        'In Progress': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
        'Waiting for Parts': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        'Done': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Released': 'bg-white/10 text-white/50 border-white/20',
        'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const getPriorityIcon = (p: string) => {
        if (p === 'Urgent') return <AlertCircle size={14} className="text-red-500 animate-pulse" />;
        return <Clock size={14} className="text-text-muted" />;
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch =
            t.ticket_number.toString().includes(search) ||
            t.customers.full_name.toLowerCase().includes(search.toLowerCase()) ||
            t.customers.phone.includes(search);

        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-lg"><Wrench size={28} /></div>
                        Repair Management
                    </h1>
                    <p className="text-text-muted mt-1">Real-time technician board for active repairs</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            className="input-field pl-10"
                            placeholder="Search ticket, name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            {/* STATUS FILTER TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['All', 'Pending', 'In Progress', 'Waiting for Parts', 'Done', 'Released'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg border whitespace-nowrap text-sm font-bold transition-all ${statusFilter === status
                            ? 'bg-white/10 border-ltt-orange text-ltt-orange'
                            : 'border-glass-border text-text-muted hover:bg-white/5'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-ltt-orange border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTickets.map((ticket, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={ticket.id}
                                className="glass-card hover:border-ltt-orange/50 transition-all group overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[ticket.status]}`}>
                                        {ticket.status}
                                    </span>
                                    <button className="text-text-muted hover:text-white transition-all">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center justify-between">
                                            {ticket.devices.brand} {ticket.devices.model}
                                            <span className="text-text-muted text-xs font-mono">#{ticket.ticket_number}</span>
                                        </h3>
                                        <p className="text-text-muted text-sm">{ticket.customers.full_name} • {ticket.customers.phone}</p>
                                    </div>

                                    <div className="p-3 bg-black/30 rounded-lg text-xs italic text-text-muted border-l-2 border-ltt-orange">
                                        "{ticket.fault_report || 'Default diagnostic check needed'}"
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-glass-border">
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            {getPriorityIcon(ticket.priority)}
                                            <span className={ticket.priority === 'Urgent' ? 'text-red-500' : 'text-text-muted'}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <button className="text-ltt-orange flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
                                            Inspect <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* VISUAL ACCENT PIECE (LTT STYLE) */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-ltt-orange/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-ltt-orange/10 transition-all"></div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {!loading && filteredTickets.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-glass-border">
                    <Package size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
                    <p className="text-text-muted text-lg">No tickets found tracking your filters.</p>
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
