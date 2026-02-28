import React, { useState, useEffect } from 'react';
import {
    Search,
    MoreHorizontal,
    Wrench,
    ShieldAlert,
    Activity,
    AlertCircle,
    Clock,
    ArrowUpRight,
    Zap,
    XCircle,
    Package,
    Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertView from '../components/ExpertView';
import TesterView from '../components/TesterView';

interface Ticket {
    id: string;
    ticket_number: number;
    status: 'Pending' | 'In Progress' | 'Checking' | 'MT-Expert Review' | 'Testing (L2)' | 'Waiting for Parts' | 'Repairing' | 'Done' | 'Released' | 'Cancelled' | 'RTO' | 'BER';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    customer_id: string;
    customers: { full_name: string; phone: string };
    device_id: string;
    devices: { brand: string; model: string };
    created_at: string;
    probing_history?: any;
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
    const [selectedTesterTicket, setSelectedTesterTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        fetchTickets();
        const channel = supabase.channel('ticket_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'repair_tickets' }, () => fetchTickets()).subscribe();
        return () => { supabase.removeChannel(channel); };
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

        if (!error && data) setTickets(data as any);
        setLoading(false);
    };

    const statusColors: Record<string, string> = {
        'Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        'Checking': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
        'MT-Expert Review': 'bg-red-500/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/5',
        'Testing (L2)': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
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
        if (status === 'Testing (L2)') return <Activity size={14} className="text-blue-400" />;
        if (status === 'BER') return <Zap size={14} className="text-yellow-600" />;
        if (status === 'RTO') return <XCircle size={14} className="text-gray-500" />;
        return <AlertCircle size={14} className="text-text-muted" />;
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch =
            t.ticket_number?.toString()?.includes(search) ||
            t.customers?.full_name?.toLowerCase()?.includes(search.toLowerCase()) ||
            t.customers?.phone?.includes(search);

        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleInspect = (ticket: Ticket) => {
        if (ticket.status === 'MT-Expert Review') {
            setSelectedExpertTicket(ticket);
        } else if (ticket.status === 'Testing (L2)') {
            setSelectedTesterTicket(ticket);
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
                probing_history: { ...selectedExpertTicket.probing_history, expert_data: data }
            })
            .eq('id', selectedExpertTicket.id);

        if (!error) {
            setSelectedExpertTicket(null);
            fetchTickets();
        }
    };

    const handleUpdateTesterStatus = async (status: string, data: any) => {
        if (!selectedTesterTicket) return;

        const { error } = await supabase
            .from('repair_tickets')
            .update({
                status,
                probing_history: { ...selectedTesterTicket.probing_history, tester_data: data }
            })
            .eq('id', selectedTesterTicket.id);

        if (!error) {
            setSelectedTesterTicket(null);
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
            <div className="flex gap-2 items-center overflow-x-auto pb-2 scrollbar-none font-bold">
                <Filter size={18} className="text-text-muted flex-shrink-0 mr-2" />
                {['All', 'Pending', 'MT-Expert Review', 'Testing (L2)', 'Checking', 'Waiting for Parts', 'Repairing', 'Done', 'Released', 'RTO', 'BER'].map(status => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTickets.map((ticket, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={ticket.id}
                                className={`glass-card p-6 h-full flex flex-col hover:border-ltt-orange/50 transition-all group overflow-hidden ${ticket.status === 'MT-Expert Review' ? 'border-red-500/30 bg-red-500/5 shadow-2xl shadow-red-500/5' : ''} ${ticket.status === 'Testing (L2)' ? 'border-blue-500/30 bg-blue-500/5 shadow-2xl shadow-blue-500/5' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${statusColors[ticket.status] || statusColors['Pending']}`}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status}
                                    </span>
                                    <button className="text-text-muted hover:text-white transition-all">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center justify-between tracking-tight">
                                            {ticket.devices?.brand || 'Unknown'} {ticket.devices?.model || 'Device'}
                                            <span className="text-text-muted text-[10px] font-black font-mono">#{ticket.ticket_number}</span>
                                        </h3>
                                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1 opacity-60">
                                            {ticket.customers?.full_name || 'Unknown'} • {ticket.customers?.phone || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-black/30 rounded-xl text-xs italic text-text-muted border-l-2 border-ltt-orange group-hover:bg-black/50 transition-all font-medium leading-relaxed">
                                        "{ticket.probing_history?.faults?.join(', ') || 'Pending initial diagnostic check'}"
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-glass-border mt-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                        {getPriorityIcon(ticket.priority)}
                                        <span className={ticket.priority === 'Urgent' ? 'text-red-500 animate-pulse' : 'text-text-muted opacity-60'}>
                                            {ticket.priority} Priority
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleInspect(ticket)}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-1 ${ticket.status === 'MT-Expert Review' ? 'text-red-500 font-black' : ticket.status === 'Testing (L2)' ? 'text-blue-400 font-black' : 'text-ltt-orange'}`}
                                    >
                                        {ticket.status === 'MT-Expert Review' ? 'MT-RESOLVE' : ticket.status === 'Testing (L2)' ? 'QA-TEST' : 'Inspect'} <ArrowUpRight size={16} />
                                    </button>
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
                            fault: selectedExpertTicket.probing_history?.faults?.join(', ') || 'System Dead',
                            csTroubleshooting: selectedExpertTicket.probing_history?.cs_best_practices || [],
                            probing: selectedExpertTicket.probing_history
                        }}
                        onUpdateStatus={handleUpdateExpertStatus}
                        onClose={() => setSelectedExpertTicket(null)}
                    />
                )}
            </AnimatePresence>

            {/* TESTER VIEW MODAL */}
            <AnimatePresence>
                {selectedTesterTicket && (
                    <TesterView
                        ticket={{
                            id: selectedTesterTicket.id,
                            number: selectedTesterTicket.ticket_number.toString(),
                            customer: selectedTesterTicket.customers.full_name,
                            device: `${selectedTesterTicket.devices.brand} ${selectedTesterTicket.devices.model}`,
                            diagnosis: selectedTesterTicket.probing_history?.expert_data?.diagnosis || ''
                        }}
                        onUpdateStatus={handleUpdateTesterStatus}
                        onClose={() => setSelectedTesterTicket(null)}
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
