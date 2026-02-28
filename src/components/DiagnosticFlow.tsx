import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Plus, Minus, Info, ClipboardList, Zap, Layout, Monitor, Wifi, Volume2, HardDrive, Cpu, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubPhase {
    name: string;
    status: 'Good' | 'Failed' | 'Needs Replacement' | 'Untested';
    notes: string;
    photos: string[];
    specs?: any;
}

interface Phase {
    name: string;
    icon: React.ReactNode;
    subPhases: SubPhase[];
}

const DiagnosticFlow: React.FC = () => {
    const [activePhase, setActivePhase] = useState(0);

    const [phases, setPhases] = useState<Phase[]>([
        {
            name: 'Power & Charging',
            icon: <Zap size={20} />,
            subPhases: [
                { name: 'Charging Port', status: 'Untested', notes: '', photos: [] },
                { name: 'Battery', status: 'Untested', notes: '', photos: [], specs: { designCap: '', fullChargeCap: '', model: '' } },
                { name: 'Power Button', status: 'Untested', notes: '', photos: [] },
                { name: 'Charger/Adapter', status: 'Untested', notes: '', photos: [] },
            ]
        },
        {
            name: 'Display & Hinges',
            icon: <Monitor size={20} />,
            subPhases: [
                { name: 'Hinges', status: 'Untested', notes: '', photos: [] },
                { name: 'LCD Panel', status: 'Untested', notes: '', photos: [] },
            ]
        },
        {
            name: 'Connectivity',
            icon: <Wifi size={20} />,
            subPhases: [
                { name: 'Bluetooth', status: 'Untested', notes: '', photos: [] },
                { name: 'Wi-Fi', status: 'Untested', notes: '', photos: [] },
            ]
        },
        {
            name: 'Audio & Input',
            icon: <Volume2 size={20} />,
            subPhases: [
                { name: 'Speakers', status: 'Untested', notes: '', photos: [] },
                { name: 'Keyboard', status: 'Untested', notes: '', photos: [] },
                { name: 'Camera', status: 'Untested', notes: '', photos: [] },
                { name: 'USB Ports', status: 'Untested', notes: '', photos: [] },
                { name: 'Display Output', status: 'Untested', notes: '', photos: [] },
            ]
        },
        {
            name: 'Storage',
            icon: <HardDrive size={20} />,
            subPhases: [
                { name: 'Primary Storage', status: 'Untested', notes: '', photos: [], specs: { brand: '', form: '', cap: '', health: '', perf: '', temp: '' } },
            ]
        },
        {
            name: 'RAM',
            icon: <Layout size={20} />,
            subPhases: [
                { name: 'Memory Bank 1', status: 'Untested', notes: '', photos: [], specs: { brand: '', ddr: '', cap: '', freq: '', test: 'PENDING' } },
            ]
        },
        {
            name: 'Performance (CPU/GPU)',
            icon: <Cpu size={20} />,
            subPhases: [
                { name: 'CPU Thermal Check', status: 'Untested', notes: '', photos: [], specs: { before: '', after: '' } },
                { name: 'GPU Thermal Check', status: 'Untested', notes: '', photos: [], specs: { before: '', after: '' } },
            ]
        }
    ]);

    const updateSubPhase = (pIdx: number, sIdx: number, updates: Partial<SubPhase>) => {
        const newPhases = [...phases];
        newPhases[pIdx].subPhases[sIdx] = { ...newPhases[pIdx].subPhases[sIdx], ...updates };
        setPhases(newPhases);
    };

    const statusOptions = [
        { label: 'Good', color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Failed', color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'Replace', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Untested', color: 'text-text-muted', bg: 'bg-white/5' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
                {phases.map((p, i) => (
                    <button
                        key={p.name}
                        onClick={() => setActivePhase(i)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border whitespace-nowrap transition-all font-black text-xs uppercase tracking-widest ${activePhase === i ? 'bg-ltt-orange border-ltt-orange text-white shadow-lg shadow-ltt-orange/20 scale-105' : 'bg-white/5 border-glass-border text-text-muted hover:bg-white/10'
                            }`}
                    >
                        {p.icon} {p.name}
                    </button>
                ))}
            </div>

            <motion.div
                key={phases[activePhase].name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phases[activePhase].subPhases.map((sp, sIdx) => (
                        <div key={sp.name} className="glass-card border-l-4 border-l-ltt-orange/50 p-6 space-y-4 hover:border-l-ltt-orange transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{sp.name}</h3>
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Phase: {phases[activePhase].name}</p>
                                </div>
                                <button className="p-2 bg-ltt-orange text-white rounded-lg shadow-lg shadow-ltt-orange/20 hover:scale-110 active:scale-95 transition-all">
                                    <Camera size={20} />
                                </button>
                            </div>

                            {/* STATUS SELECTOR */}
                            <div className="flex gap-2">
                                {statusOptions.map(opt => (
                                    <button
                                        key={opt.label}
                                        onClick={() => updateSubPhase(activePhase, sIdx, { status: opt.label as any })}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${sp.status === opt.label ? `border-transparent ${opt.bg} ${opt.color}` : 'border-glass-border bg-transparent text-text-muted opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* SPECS INPUT IF APPLICABLE */}
                            {sp.specs && (
                                <div className="grid grid-cols-2 gap-3 p-3 bg-black/40 rounded-xl border border-glass-border/10">
                                    {Object.keys(sp.specs).map(key => (
                                        <div key={key}>
                                            <label className="text-[8px] font-black uppercase text-text-muted ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                                            <input
                                                className="input-field py-1 text-xs"
                                                placeholder={key}
                                                value={sp.specs[key]}
                                                onChange={(e) => {
                                                    const newSpecs = { ...sp.specs, [key]: e.target.value };
                                                    updateSubPhase(activePhase, sIdx, { specs: newSpecs });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <textarea
                                className="input-field text-xs min-h-[60px]"
                                placeholder="Findings, Serial mismatches, physical issues..."
                                value={sp.notes}
                                onChange={(e) => updateSubPhase(activePhase, sIdx, { notes: e.target.value })}
                            />

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-accent-blue/20 transition-all flex items-center justify-center gap-2">
                                    <Info size={14} /> Send to Inquiry
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default DiagnosticFlow;
