import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Receipt,
    DollarSign,
    Wallet,
    X,
    ArrowRight,
    Printer,
    Calculator,
    Download,
    FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReceiptPDF } from '../lib/pdf';
import ThermalLabel from '../components/ThermalLabel';

interface Ticket {
    id: string;
    ticket_number: number;
    customers: { full_name: string; phone: string };
    devices: { brand: string; model: string };
    status: string;
    probing_history: any;
    final_price?: number;
}

const POSBoard: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'GCash' | 'Card'>('Cash');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchActiveTickets();
    }, []);

    const fetchActiveTickets = async () => {
        setLoading(true);
        // Fetch tickets that are Done, Fixed, or Repairing (anything that might need billing)
        const { data, error } = await supabase
            .from('repair_tickets')
            .select(`
        *,
        customers (full_name, phone),
        devices (brand, model)
      `)
            .in('status', ['Done', 'Fixed', 'Repairing', 'Testing (L2)', 'Waiting for Parts'])
            .order('created_at', { ascending: false });

        if (!error && data) setTickets(data as any);
        setLoading(false);
    };

    const calculateTotals = (ticket: Ticket) => {
        const expertData = ticket.probing_history?.expert_data || {};
        const parts = expertData.parts || [];
        // `price` is the property used in ExpertView bounds for retail pricing
        const partsTotal = parts.reduce((sum: number, p: any) => sum + (Number(p.price) || 0), 0);
        const labor = Number(expertData.laborPrice) || 0;
        return { partsTotal, labor, grandTotal: partsTotal + labor };
    };

    const handleProcessPayment = async () => {
        if (!selectedTicket || paymentAmount <= 0) return;
        setProcessing(true);

        const { grandTotal } = calculateTotals(selectedTicket);
        const prevPaid = Number(selectedTicket.probing_history?.payment_history?.total_paid) || 0;
        const newTotalPaid = prevPaid + paymentAmount;

        const paymentRecord = {
            date: new Date().toISOString(),
            amount: paymentAmount,
            method: paymentMethod,
            type: newTotalPaid >= grandTotal ? 'Full' : 'Partial'
        };

        const newPaymentHistory = {
            total_paid: newTotalPaid,
            history: [...(selectedTicket.probing_history?.payment_history?.history || []), paymentRecord]
        };

        const isFullyPaid = newTotalPaid >= grandTotal;

        const { error } = await supabase
            .from('repair_tickets')
            .update({
                probing_history: {
                    ...selectedTicket.probing_history,
                    payment_history: newPaymentHistory,
                    payment_status: isFullyPaid ? 'Paid' : 'Partial'
                },
                status: isFullyPaid ? 'Released' : selectedTicket.status // Auto-move to release
            })
            .eq('id', selectedTicket.id);

        if (!error) {
            // Refresh list and clear selection
            fetchActiveTickets();
            setSelectedTicket(null);
            setPaymentAmount(0);
            alert(`Payment of ₱${paymentAmount} Recorded Successfully.`);
        }
        setProcessing(false);
    };

    const filteredTickets = tickets.filter(t =>
        t.ticket_number.toString().includes(search) ||
        t.customers.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-full gap-8 p-6">
            {/* LEFT: TICKET SELECTION area */}
            <div className="flex-1 space-y-6 flex flex-col min-w-0">
                <header className="flex justify-between items-center bg-black/20 p-6 rounded-3xl border border-glass-border backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                            <div className="bg-ltt-orange p-2 rounded-xl text-white shadow-lg shadow-ltt-orange/20"><CreditCard size={28} /></div>
                            Point of Sale
                        </h1>
                        <p className="text-text-muted mt-1 font-bold text-xs uppercase tracking-widest opacity-60">Terminal-ID: TS-MN01 (Mandaue)</p>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40 text-xs" size={14} />
                        <input
                            className="input-field pl-10 h-10 text-xs"
                            placeholder="Search Ticket # or Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto scrollbar-none pr-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-ltt-orange border-t-transparent rounded-full animate-spin"></div></div>
                    ) : filteredTickets.map(ticket => {
                        const { grandTotal } = calculateTotals(ticket);
                        const paid = ticket.probing_history?.payment_history?.total_paid || 0;
                        const balance = grandTotal - paid;

                        return (
                            <motion.button
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full glass-card p-5 border-l-4 text-left transition-all hover:translate-x-1 flex justify-between items-center group ${selectedTicket?.id === ticket.id ? 'border-ltt-orange bg-ltt-orange/5 ring-1 ring-ltt-orange/20' : 'border-glass-border hover:border-white/20'}`}
                            >
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-text-muted">Ticket #{ticket.ticket_number}</span>
                                    <h3 className="text-lg font-black leading-none">{ticket.customers.full_name}</h3>
                                    <p className="text-xs font-bold text-text-muted uppercase italic">{ticket.devices.brand} {ticket.devices.model}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xs font-black uppercase text-text-muted">Remaining Balance</p>
                                    <p className={`text-xl font-black font-mono leading-none ${balance <= 0 ? 'text-green-500' : 'text-white'}`}>₱{balance.toLocaleString()}</p>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${balance <= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {balance <= 0 ? 'Fully Paid' : 'Pending Payment'}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: BILLING DETAILS area */}
            <AnimatePresence mode="wait">
                {selectedTicket ? (
                    <motion.aside
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                        className="w-[420px] glass-card flex flex-col p-6 space-y-8 bg-black/40 border-ltt-orange/10 relative overflow-hidden"
                    >
                        {/* Visual Flair */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 text-ltt-orange transform rotate-12 scale-[3] pointer-events-none">
                            <Receipt size={100} />
                        </div>

                        <div className="flex justify-between items-start z-10">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Checkout Summary</h2>
                                <p className="text-xs text-text-muted font-bold uppercase italic mt-1 tracking-widest opacity-60">Verified Order Flow</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted"><X size={20} /></button>
                        </div>

                        {/* BILL BREAKDOWN */}
                        <div className="space-y-4 z-10">
                            <div className="bg-black/50 p-5 rounded-2xl border border-glass-border space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-text-muted flex items-center gap-2 uppercase tracking-widest"><DollarSign size={14} /> Labor Service</span>
                                    <span>₱{calculateTotals(selectedTicket).labor.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-start text-xs font-bold border-t border-glass-border/50 pt-3">
                                    <span className="text-text-muted flex items-center gap-2 uppercase tracking-widest"><Receipt size={14} /> Parts (Retail)</span>
                                    <div className="text-right">
                                        <span>₱{calculateTotals(selectedTicket).partsTotal.toLocaleString()}</span>
                                        <div className="text-[9px] text-text-muted italic opacity-40 mt-0.5">
                                            {(selectedTicket.probing_history?.expert_data?.parts || []).length} components required
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-glass-border mt-2">
                                    <span className="text-sm font-black uppercase tracking-tighter">Grand Total</span>
                                    <span className="text-2xl font-black font-mono text-ltt-orange">₱{calculateTotals(selectedTicket).grandTotal.toLocaleString()}</span>
                                </div>
                                {selectedTicket.probing_history?.payment_history?.total_paid > 0 && (
                                    <div className="bg-green-500/5 border border-green-500/20 p-2 rounded-lg flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Already Paid</span>
                                        <span className="text-xs font-black font-mono text-green-500">- ₱{Number(selectedTicket.probing_history.payment_history.total_paid).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAYMENT ZONE */}
                        <div className="space-y-6 z-10 flex-1 flex flex-col justify-end">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest px-1">Payment Method</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Cash', 'GCash', 'Card'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setPaymentMethod(m)}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all flex flex-col items-center gap-2 ${paymentMethod === m ? 'bg-ltt-orange text-white border-ltt-orange shadow-lg shadow-ltt-orange/20' : 'border-glass-border text-text-muted hover:bg-white/5'}`}
                                        >
                                            {m === 'Cash' && <Wallet size={16} />}
                                            {m === 'GCash' && <Calculator size={16} />}
                                            {m === 'Card' && <CreditCard size={16} />}
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest px-1">Payment Amount (₱)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-ltt-orange opacity-40 group-focus-within:opacity-100 transition-opacity" size={24} />
                                    <input
                                        type="number"
                                        className="input-field pl-12 h-16 text-3xl font-black font-mono tracking-tighter bg-black/40 border-ltt-orange/20 focus:border-ltt-orange/60"
                                        placeholder="0.00"
                                        value={paymentAmount || ''}
                                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setPaymentAmount(calculateTotals(selectedTicket).grandTotal - (selectedTicket.probing_history?.payment_history?.total_paid || 0))} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-glass-border rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all">Full Payment</button>
                                    <button onClick={() => setPaymentAmount((calculateTotals(selectedTicket).grandTotal - (selectedTicket.probing_history?.payment_history?.total_paid || 0)) / 2)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-glass-border rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all">Half Pay (50%)</button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-glass-border">
                                <button
                                    onClick={() => window.print()}
                                    className="p-4 bg-white/5 rounded-2xl text-text-muted hover:text-white hover:bg-white/10 transition-all shadow-xl shadow-black/20"
                                    title="Quick Print"
                                >
                                    <Printer size={20} />
                                </button>

                                <button
                                    onClick={() => generateReceiptPDF(selectedTicket, calculateTotals(selectedTicket))}
                                    className="p-4 bg-white/5 rounded-2xl text-text-muted hover:text-white hover:bg-white/10 transition-all shadow-xl shadow-black/20"
                                    title="Download PDF Receipt"
                                >
                                    <FileText size={20} />
                                </button>

                                {/* Hidden print target */}
                                <div id="thermal-print-target" className="hidden print:block">
                                    {selectedTicket && (
                                        <ThermalLabel
                                            data={{
                                                ticketNumber: selectedTicket.ticket_number.toString(),
                                                customerName: selectedTicket.customers.full_name,
                                                customerPhone: selectedTicket.customers.phone,
                                                deviceBrand: selectedTicket.devices.brand,
                                                deviceModel: selectedTicket.devices.model,
                                                serialNumber: selectedTicket.probing_history?.serial || 'N/A',
                                                issue: selectedTicket.probing_history?.faults || 'Repair complete',
                                                totalAmount: calculateTotals(selectedTicket).grandTotal,
                                                date: new Date().toLocaleDateString(),
                                                type: 'POS'
                                            }}
                                        />
                                    )}
                                </div>

                                <button
                                    onClick={handleProcessPayment}
                                    disabled={processing || paymentAmount <= 0}
                                    className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl ${processing || paymentAmount <= 0 ? 'bg-white/10 text-text-muted grayscale' : 'bg-ltt-orange text-white shadow-ltt-orange/20 hover:scale-105 active:scale-95'}`}
                                >
                                    {processing ? 'Processing TX...' : 'Settle Invoice'} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                ) : (
                    <div className="hidden lg:flex w-[420px] flex-col items-center justify-center p-10 text-center glass-card bg-white/2 space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-text-muted opacity-20 transform rotate-12 scale-110"><Receipt size={40} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest text-text-muted opacity-40">Payment Terminal Standby</h3>
                            <p className="text-xs text-text-muted italic max-w-[200px] mx-auto mt-2 opacity-30 tracking-tight font-medium leading-relaxed">Select a ticket from the left queue to begin the billing sequence for the client.</p>
                        </div>
                        <div className="flex gap-2 opacity-5">
                            <CreditCard size={18} />
                            <DollarSign size={18} />
                            <Wallet size={18} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default POSBoard;
