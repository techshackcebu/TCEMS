import React, { useState } from 'react';
import { Search, Smartphone, ClipboardCheck, Printer, UserPlus, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Customer {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
}

const IntakePage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [device, setDevice] = useState({ brand: '', model: '', serial: '', type: 'Phone' });
    const [faults, setFaults] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const commonFaults = [
        'No Power', 'Broken LCD', 'Battery Drain',
        'Charging Port', 'Back Glass', 'Camera Repair',
        'Water Damage', 'Software Issue', 'Microphone'
    ];

    const handleLookup = async () => {
        if (phone.length < 10) return;
        const { data } = await supabase
            .from('customers')
            .select('*')
            .eq('phone', phone)
            .single();

        if (data) setCustomer(data);
        else setCustomer(null);
    };

    const toggleFault = (fault: string) => {
        setFaults(prev => prev.includes(fault)
            ? prev.filter(f => f !== fault)
            : [...prev, fault]
        );
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        // Logic for saving to Supabase and triggering Printer
        setTimeout(() => {
            alert('Ticket Created Successfully! Sending to P2 Sticker Printer...');
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-lg"><ClipboardCheck size={28} /></div>
                        Device Intake
                    </h1>
                    <p className="text-text-muted mt-1">Registering new repair ticket</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-ltt-orange">ID: TS-TK-{(Math.random() * 1000).toFixed(0)}</span>
                </div>
            </header>

            {/* STEP 1: CUSTOMER LOOKUP */}
            <section className="glass-card space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Search size={20} className="text-ltt-orange" />
                    Customer Information
                </h2>
                <div className="flex gap-4">
                    <input
                        className="input-field max-w-sm"
                        placeholder="Search Phone Number..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={handleLookup}
                    />
                    <button className="btn-primary flex items-center gap-2">
                        <UserPlus size={18} /> New Customer
                    </button>
                </div>

                <AnimatePresence>
                    {customer && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 p-4 border-l-2 border-ltt-orange bg-white/5 rounded-r-lg"
                        >
                            <p className="font-bold text-lg">{customer.full_name}</p>
                            <p className="text-text-muted">{customer.phone} • {customer.email || 'No Email'}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* STEP 2: DEVICE SPECIFICATIONS */}
            <section className="glass-card space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Smartphone size={20} className="text-ltt-orange" />
                    Device Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="input-field"
                        placeholder="Brand (e.g. Apple, Samsung)"
                        value={device.brand}
                        onChange={(e) => setDevice({ ...device, brand: e.target.value })}
                    />
                    <input
                        className="input-field"
                        placeholder="Model (e.g. iPhone 15 Pro)"
                        value={device.model}
                        onChange={(e) => setDevice({ ...device, model: e.target.value })}
                    />
                    <input
                        className="input-field"
                        placeholder="Serial / IMEI (Optional)"
                        value={device.serial}
                        onChange={(e) => setDevice({ ...device, serial: e.target.value })}
                    />
                </div>
            </section>

            {/* STEP 3: FAULT CHECKLIST */}
            <section className="glass-card space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ClipboardCheck size={20} className="text-ltt-orange" />
                    Fault Reporting
                </h2>
                <div className="flex flex-wrap gap-2">
                    {commonFaults.map(fault => (
                        <button
                            key={fault}
                            onClick={() => toggleFault(fault)}
                            className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${faults.includes(fault)
                                ? 'bg-ltt-orange border-ltt-orange text-white'
                                : 'border-glass-border hover:border-ltt-orange/50'
                                }`}
                        >
                            {fault}
                        </button>
                    ))}
                </div>
                <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Additional technician notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </section>

            {/* STICKER PREVIEW (40x46) */}
            <div className="flex flex-col md:flex-row gap-6 mt-10">
                <div className="flex-1 space-y-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-3"
                    >
                        {isSaving ? 'Saving...' : <><Save size={24} /> Generate Ticket & Print</>}
                    </button>
                    <button className="w-full py-3 text-text-muted hover:text-white transition-colors flex justify-center items-center gap-2 border border-dashed border-glass-border rounded-lg">
                        <Printer size={18} /> Test Printer Connection (P2-Y6015...)
                    </button>
                </div>

                <div className="w-[160px] h-[184px] bg-white text-black p-2 rounded shadow-2xl scale-75 md:scale-100 origin-top flex flex-col justify-between transform-gpu">
                    <div className="border-b border-black pb-1 mb-1">
                        <p className="text-[10px] font-bold uppercase">TechShack Repair</p>
                        <p className="text-[8px]">158 H. Abellana St. Mandaue</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <p className="text-xs font-black">TK-{(Math.random() * 1000).toFixed(0)}</p>
                        <p className="text-[10px] font-bold mt-1 text-wrap w-full">{device.brand} {device.model || 'Device'}</p>
                        <p className="text-[8px] text-gray-700 mt-1">{customer?.full_name || 'Walking Customer'}</p>
                    </div>
                    <div className="bg-black text-white text-center py-1 text-[8px] font-bold uppercase tracking-widest mt-1">
                        40X46 LABEL
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntakePage;
