import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, TrendingUp, CheckCircle2, XCircle, Clock, Truck, ShieldAlert, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface InquiryRequest {
    id: string;
    ticket_id: string;
    part_name: string;
    supplier_info?: string;
    cost_price?: number;
    status: 'Pending' | 'Sourced' | 'Ordered' | 'Unavailable';
    created_at: string;
    repair_tickets: {
        ticket_number: number;
        devices: { brand: string; model: string };
    };
}

const PartsBoard: React.FC = () => {
    const [requests, setRequests] = useState<InquiryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchRequests();
        const channel = supabase.channel('parts_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'parts_inquiry' }, () => fetchRequests()).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('parts_inquiry')
            .select(`
                *,
                repair_tickets (
                    ticket_number,
                    devices (brand, model)
                )
            `)
            .order('created_at', { ascending: false });

        if (!error && data) setRequests(data as any);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string, additionalData = {}) => {
        const { error } = await supabase
            .from('parts_inquiry')
            .update({ status, ...additionalData })
            .eq('id', id);
        if (!error) fetchRequests();
    };

    const statusStyles: Record<string, string> = {
        'Pending': 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500',
        'Sourced': 'border-accent-blue/30 bg-accent-blue/5 text-accent-blue',
        'Ordered': 'border-purple-500/30 bg-purple-500/5 text-purple-500',
        'Unavailable': 'border-red-500/30 bg-red-500/5 text-red-500',
    };

    return (
        <div className="space-y-8 p-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-purple-600 p-2 rounded-xl text-white shadow-lg shadow-purple-600/20"><Package size={28} /></div>
                        Parts Sourcing Board
                    </h1>
                    <p className="text-text-muted mt-1 font-bold text-xs uppercase tracking-widest opacity-60">Procurement & Component Fulfillment Center</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Pending', 'Sourced', 'Ordered'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase border transition-all ${filter === s ? 'bg-purple-600 border-purple-600 text-white' : 'border-glass-border text-text-muted hover:bg-white/5'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.filter(r => filter === 'All' || r.status === filter).map((req, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={req.id}
                            className={`glass-card border-l-4 p-5 space-y-4 group transition-all hover:translate-y-[-4px] ${statusStyles[req.status]}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Ticket #{req.repair_tickets.ticket_number}</span>
                                    <h3 className="text-lg font-black leading-none mt-1">{req.part_name}</h3>
                                    <p className="text-xs font-bold mt-1 text-text-muted uppercase italic">{req.repair_tickets.devices.brand} {req.repair_tickets.devices.model}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${statusStyles[req.status]} border bg-black/20`}>
                                    {req.status === 'Pending' && <Clock size={16} />}
                                    {req.status === 'Sourced' && <Truck size={16} />}
                                    {req.status === 'Ordered' && <CheckCircle2 size={16} />}
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-40">Supplier / URL</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            className="input-field text-xs h-8 py-0 bg-black/40"
                                            placeholder="Enter link or supplier name..."
                                            defaultValue={req.supplier_info}
                                            onBlur={(e) => updateStatus(req.id, req.status, { supplier_info: e.target.value })}
                                        />
                                        <button className="p-2 bg-white/5 rounded-lg hover:text-purple-400 transition-colors"><ExternalLink size={14} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Est. Cost</label>
                                        <div className="relative">
                                            <TrendingUp className="absolute left-2 top-1/2 -translate-y-1/2 opacity-40" size={12} />
                                            <input
                                                type="number"
                                                className="input-field text-xs h-8 pl-6 py-0 bg-black/40 font-mono"
                                                placeholder="0.00"
                                                defaultValue={req.cost_price}
                                                onBlur={(e) => updateStatus(req.id, req.status, { cost_price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-1">
                                        {req.status === 'Pending' && (
                                            <button onClick={() => updateStatus(req.id, 'Sourced')} className="flex-1 bg-accent-blue text-white h-8 rounded-lg text-[9px] font-black uppercase shadow-lg shadow-accent-blue/20">Mark Sourced</button>
                                        )}
                                        {req.status === 'Sourced' && (
                                            <button onClick={() => updateStatus(req.id, 'Ordered')} className="flex-1 bg-purple-600 text-white h-8 rounded-lg text-[9px] font-black uppercase shadow-lg shadow-purple-600/20">Mark Ordered</button>
                                        )}
                                        {req.status === 'Ordered' && (
                                            <div className="flex-1 bg-green-500/10 text-green-500 h-8 rounded-lg text-[9px] font-black uppercase border border-green-500/20 flex items-center justify-center">Arrived</div>
                                        )}
                                        <button onClick={() => updateStatus(req.id, 'Unavailable')} className="p-2 hover:text-red-500 transition-colors"><XCircle size={14} /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-glass-border flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString()}</span>
                                <button
                                    onClick={() => alert("Procurement Intel: Full inquiry history sub-frame is currently being calculated...")}
                                    className="text-text-muted hover:text-white transition-colors"
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && requests.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-glass-border">
                    <ShieldAlert size={48} className="mx-auto text-text-muted mb-4 opacity-10" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-xs">No Pending Parts Requests</p>
                </div>
            )}
        </div>
    );
};

export default PartsBoard;
