import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, AlertCircle, Wrench, Package, ArrowUpRight, MoreHorizontal, ShieldAlert, Zap, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertView from '../components/ExpertView';

interface Ticket {
    id: string;
    ticket_number: number;
    status: 'Pending' | 'In Progress' | 'Checking' | 'MT-Expert Review' | 'Waiting for Parts' | 'Repairing' | 'Done' | 'Released' | 'Cancelled' | 'RTO' | 'BER';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    customer_id: string;
    customers: { full_name: string; phone: string };
    device_id: string;
    devices: { brand: string; model: string };
    created_at: string;
    fault_report?: string;
    probing?: any;
}

interface TicketsPageProps {
    onSelectTicket: (id: string) => void;
}

const TicketsPage: React.FC<TicketsPageProps> = ({ onSelectTicket }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedExpertTicket, setSelectedExpertTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        fetchTickets();

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
        'Checking': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
        'MT-Expert Review': 'bg-red-500/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/5',
        'Repairing': 'bg-ltt-orange/10 text-ltt-orange border-ltt-orange/20',
        'Waiting for Parts': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        'Done': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Released': 'bg-white/10 text-white/50 border-white/20',
        'RTO': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        'BER': 'bg-yellow-900/10 text-yellow-600 border-yellow-900/20',
        'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const getPriorityIcon = (p: string) => {
        if (p === 'Urgent') return <AlertCircle size={14} className="text-red-500 animate-pulse" />;
        return <Clock size={14} className="text-text-muted" />;
    };

    const getStatusIcon = (status: string) => {
        if (status === 'MT-Expert Review') return <ShieldAlert size={14} className="text-red-500" />;
        if (status === 'BER') return <Zap size={14} className="text-yellow-600" />;
        if (status === 'RTO') return <XCircle size={14} className="text-gray-500" />;
        return <AlertCircle size={14} className="text-text-muted" />;
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch =
            t.ticket_number.toString().includes(search) ||
            t.customers.full_name.toLowerCase().includes(search.toLowerCase()) ||
            t.customers.phone.includes(search);

        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleInspect = (ticket: Ticket) => {
        if (ticket.status === 'MT-Expert Review') {
            setSelectedExpertTicket(ticket);
        } else {
            onSelectTicket(ticket.id);
        }
    };

    const handleUpdateExpertStatus = async (status: string, data: any) => {
        if (!selectedExpertTicket) return;

        const { error } = await supabase
            .from('repair_tickets')
            .update({
                status,
                probing: { ...selectedExpertTicket.probing, ...data }
            })
            .eq('id', selectedExpertTicket.id);

        if (!error) {
            setSelectedExpertTicket(null);
            fetchTickets();
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-lg text-white"><Wrench size={28} /></div>
                        Repair Board
                    </h1>
                    <p className="text-text-muted mt-1 font-medium">L3 Specialist & Hybrid Tech Queue</p>
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
                </div>
            </header>

            {/* STATUS FILTER TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['All', 'Pending', 'MT-Expert Review', 'Checking', 'Waiting for Parts', 'Repairing', 'Done', 'Released', 'RTO', 'BER'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg border whitespace-nowrap text-sm font-bold transition-all ${statusFilter === status
                            ? 'bg-white/10 border-ltt-orange text-ltt-orange shadow-lg shadow-ltt-orange/10 scale-105'
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
                                className={`glass-card hover:border-ltt-orange/50 transition-all group overflow-hidden ${ticket.status === 'MT-Expert Review' ? 'border-red-500/30 bg-red-500/5' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${statusColors[ticket.status] || statusColors['Pending']}`}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status}
                                    </span>
                                    <button className="text-text-muted hover:text-white transition-all">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center justify-between tracking-tight">
                                            {ticket.devices.brand} {ticket.devices.model}
                                            <span className="text-text-muted text-[10px] font-black font-mono">#{ticket.ticket_number}</span>
                                        </h3>
                                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{ticket.customers.full_name} • {ticket.customers.phone}</p>
                                    </div>

                                    <div className="p-3 bg-black/30 rounded-xl text-xs italic text-text-muted border-l-2 border-ltt-orange group-hover:bg-black/50 transition-all">
                                        "{ticket.fault_report || 'Default diagnostic check needed'}"
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-glass-border">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                            {getPriorityIcon(ticket.priority)}
                                            <span className={ticket.priority === 'Urgent' ? 'text-red-500 animate-pulse' : 'text-text-muted'}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleInspect(ticket)}
                                            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-1 ${ticket.status === 'MT-Expert Review' ? 'text-red-500' : 'text-ltt-orange'}`}
                                        >
                                            {ticket.status === 'MT-Expert Review' ? 'MT-RESOLVE' : 'Inspect'} <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* EXPERT VIEW MODAL */}
            <AnimatePresence>
                {selectedExpertTicket && (
                    <ExpertView
                        ticket={{
                            id: selectedExpertTicket.id,
                            number: selectedExpertTicket.ticket_number.toString(),
                            customer: selectedExpertTicket.customers.full_name,
                            device: `${selectedExpertTicket.devices.brand} ${selectedExpertTicket.devices.model}`,
                            fault: selectedExpertTicket.fault_report || '',
                            csTroubleshooting: (selectedExpertTicket as any).probing?.csTroubleshooting || [],
                            probing: selectedExpertTicket.probing
                        }}
                        onUpdateStatus={handleUpdateExpertStatus}
                        onClose={() => setSelectedExpertTicket(null)}
                    />
                )}
            </AnimatePresence>

            {!loading && filteredTickets.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-glass-border">
                    <Package size={48} className="mx-auto text-text-muted mb-4 opacity-10" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-xs">Queue Clear: Level 3 Locked</p>
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
