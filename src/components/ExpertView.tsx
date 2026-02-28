import React, { useState } from 'react';
import {
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Truck,
    DollarSign,
    MessageSquare,
    Send,
    ArrowRight,
    ClipboardList,
    Camera,
    Plus,
    Zap,
    Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpertViewProps {
    ticket: {
        id: string;
        number: string;
        customer: string;
        device: string;
        fault: string;
        csTroubleshooting: string[];
        probing: any;
    };
    onUpdateStatus: (status: string, data: any) => void;
    onClose: () => void;
}

const ExpertView: React.FC<ExpertViewProps> = ({ ticket, onUpdateStatus, onClose }) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [parts, setParts] = useState([{ name: '', cost: 0, price: 0 }]);
    const [activeTab, setActiveTab] = useState<'diagnosis' | 'parts' | 'action'>('diagnosis');
    const [selectedStatus, setSelectedStatus] = useState('');

    const statuses = [
        { id: 'Fixed', label: 'Fixed (Pass to L2)', icon: <CheckCircle2 size={16} />, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'RTO', label: 'RTO (Unfixable)', icon: <XCircle size={16} />, color: 'text-red-500', bg: 'bg-red-500/10' },
        { id: 'Waiting for Parts', label: 'Waiting for Parts', icon: <Truck size={16} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'BER', label: 'BER (Beyond Econ. Repair)', icon: <Zap size={16} />, color: 'text-yellow-600', bg: 'bg-yellow-600/10' },
        { id: 'Testing (L2)', label: 'Fixed - Move to L2 Testing', icon: <ArrowRight size={16} />, color: 'text-accent-blue', bg: 'bg-accent-blue/10' }
    ];

    const addPart = () => setParts([...parts, { name: '', cost: 0, price: 0 }]);
    const updatePart = (index: number, field: string, value: any) => {
        const newParts = [...parts];
        (newParts[index] as any)[field] = value;
        setParts(newParts);
    };

    const currentTotal = parts.reduce((sum, p) => sum + p.price, 0);
    const currentCost = parts.reduce((sum, p) => sum + p.cost, 0);
    const profit = currentTotal - currentCost;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-4xl h-[90vh] bg-carbon-black border border-glass-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
                {/* HEADER */}
                <header className="p-6 bg-red-500/10 border-b border-red-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-500/20">
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                MT-Expert Review <span className="text-red-500 text-sm">#{ticket.number}</span>
                            </h2>
                            <p className="text-text-muted text-xs font-black uppercase tracking-widest opacity-60">MASTER_TECH INTERFACE v1.0</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted">
                        <XCircle size={24} />
                    </button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT SIDEBAR: TICKET CONTEXT */}
                    <aside className="w-80 border-r border-glass-border p-6 space-y-6 overflow-y-auto bg-black/20">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Device / Customer</label>
                            <p className="font-black text-lg text-white">{ticket.device}</p>
                            <p className="text-sm font-bold text-ltt-orange">{ticket.customer}</p>
                        </div>

                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
                            <p className="text-[10px] font-black uppercase text-red-500 flex items-center gap-1">
                                <Hammer size={12} /> Reported Fault
                            </p>
                            <p className="text-xs font-medium italic">"{ticket.fault || 'System Dead / No Power'}"</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center gap-1">
                                <ClipboardList size={12} /> CS Troubleshooting Report
                            </p>
                            <div className="space-y-1">
                                {ticket.csTroubleshooting?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase bg-green-500/5 p-2 rounded border border-green-500/10">
                                        <CheckCircle2 size={10} /> {item}
                                    </div>
                                )) || <p className="text-[10px] italic text-text-muted opacity-40">No CS checks recorded.</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-glass-border space-y-2">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Master Action Tabs</p>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setActiveTab('diagnosis')}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'diagnosis' ? 'bg-ltt-orange text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}
                                >
                                    <MessageSquare size={16} /> Write Diagnosis
                                </button>
                                <button
                                    onClick={() => setActiveTab('parts')}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'parts' ? 'bg-ltt-orange text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}
                                >
                                    <DollarSign size={16} /> Parts & Pricing
                                </button>
                                <button
                                    onClick={() => setActiveTab('action')}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'action' ? 'bg-ltt-orange text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}
                                >
                                    <Send size={16} /> Pass Down / Sync
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 p-8 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'diagnosis' && (
                                <motion.div key="diag" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <header className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Technical Diagnosis</h3>
                                            <p className="text-text-muted text-sm italic">Identify the core failure and required board-level work.</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase p-2 border border-glass-border rounded-lg text-text-muted hover:text-white transition-all">
                                            <Camera size={14} /> Attach Board Photo
                                        </button>
                                    </header>
                                    <textarea
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        className="input-field min-h-[300px] text-base font-medium p-6 bg-black/40 border-2 border-glass-border focus:border-red-500/50 transition-all font-mono"
                                        placeholder="Describe findings (e.g., Short in 19V rail, Pu10 burned, Replaced PC45...)"
                                    />
                                    <div className="flex gap-2">
                                        <button className="flex-1 p-3 rounded-xl bg-accent-blue text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-accent-blue/20">Analyze Thermal Loop</button>
                                        <button className="flex-1 p-3 rounded-xl bg-purple-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">Probe Schematic</button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'parts' && (
                                <motion.div key="parts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <header>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Parts Invoicing & Sourcing</h3>
                                        <p className="text-text-muted text-sm italic">Define cost prices (internal) and retail prices (customer).</p>
                                    </header>

                                    <div className="space-y-4">
                                        {parts.map((part, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-3 items-end bg-black/30 p-4 rounded-2xl border border-glass-border">
                                                <div className="col-span-6">
                                                    <label className="text-[10px] font-black uppercase text-text-muted ml-2 mb-1 block tracking-widest text-accent-blue">Required Item / SKU</label>
                                                    <input
                                                        placeholder="e.g. IC Chip, LCD Panel..."
                                                        className="input-field text-sm"
                                                        value={part.name}
                                                        onChange={(e) => updatePart(i, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-text-muted ml-2 mb-1 block tracking-widest">Internal Cost</label>
                                                    <input
                                                        type="number"
                                                        className="input-field text-sm font-mono text-center"
                                                        value={part.cost}
                                                        onChange={(e) => updatePart(i, 'cost', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-[10px] font-black uppercase text-text-muted ml-2 mb-1 block tracking-widest text-ltt-orange">Retail (Customer)</label>
                                                    <input
                                                        type="number"
                                                        className="input-field text-sm font-mono text-center border-ltt-orange/50"
                                                        value={part.price}
                                                        onChange={(e) => updatePart(i, 'price', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <button onClick={() => setParts(parts.filter((_, idx) => idx !== i))} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><XCircle size={20} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addPart} className="w-full p-4 border-2 border-dashed border-glass-border rounded-2xl text-text-muted hover:border-ltt-orange/50 hover:text-ltt-orange transition-all font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2">
                                            <Plus size={16} /> Add Another Component
                                        </button>
                                    </div>

                                    <div className="p-6 bg-ltt-orange/10 border-l-4 border-ltt-orange rounded-xl flex justify-between items-center">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1">Internal Cost</p>
                                                <p className="text-xl font-mono">P{currentCost.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-ltt-orange tracking-widest mb-1">Customer Price</p>
                                                <p className="text-2xl font-black font-mono">P{currentTotal.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-green-500 tracking-widest mb-1">Est. Direct Profit</p>
                                            <p className="text-xl font-black font-mono text-green-500">+P{profit.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'action' && (
                                <motion.div key="action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <header>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Final Decision & Routing</h3>
                                        <p className="text-text-muted text-sm italic">Change ticket status and assign next employee.</p>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {statuses.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedStatus(s.id)}
                                                className={`p-6 rounded-3xl border-2 text-left flex items-start gap-4 transition-all ${selectedStatus === s.id ? 'border-ltt-orange bg-ltt-orange/10 shadow-xl' : 'border-glass-border hover:bg-white/5 opacity-60'}`}
                                            >
                                                <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                                                    {s.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-sm tracking-tight mb-1">{s.label}</p>
                                                    <p className="text-[10px] text-text-muted font-bold texture-uppercase opacity-60">Status ID: {s.id}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-6 border-t border-glass-border flex justify-end gap-3 pt-10">
                                        <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white">Save Draft</button>
                                        <button
                                            onClick={() => onUpdateStatus(selectedStatus, { diagnosis, parts })}
                                            className="px-10 py-4 bg-red-500 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 flex items-center gap-3 active:scale-95 transition-all"
                                        >
                                            <Zap size={20} /> Deploy Update
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

export default ExpertView;
