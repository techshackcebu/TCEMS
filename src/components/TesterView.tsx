import React, { useState } from 'react';
import {
    ShieldCheck,
    Activity,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Terminal,
    Zap,
    Monitor,
    Cpu,
    Battery,
    Wifi,
    Volume2,
    MousePointer2,
    Keyboard as KeyboardIcon,
    PlayCircle,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TesterViewProps {
    ticket: {
        id: string;
        number: string;
        customer: string;
        device: string;
        diagnosis: string;
    };
    onUpdateStatus: (status: string, data: any) => void;
    onClose: () => void;
}

const TesterView: React.FC<TesterViewProps> = ({ ticket, onUpdateStatus, onClose }) => {
    const [activeTab, setActiveTab] = useState<'checklist' | 'stress' | 'action'>('checklist');
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [logs, setLogs] = useState<string[]>(['[TEST_SEQ] Initializing...', '[HW_DETECT] Identifying components...']);
    const [testMode, setTestMode] = useState<'idle' | 'running' | 'done'>('idle');

    const checkItems = [
        { id: 'lcd', label: 'LCD Panel & Dimming', icon: <Monitor size={14} /> },
        { id: 'battery', label: 'Battery Cycle & Charge', icon: <Battery size={14} /> },
        { id: 'wifi', label: 'Network & Bluetooth', icon: <Wifi size={14} /> },
        { id: 'audio', label: 'Speaker & Mic Test', icon: <Volume2 size={14} /> },
        { id: 'kbd', label: 'Keyboard & Input Keys', icon: <KeyboardIcon size={14} /> },
        { id: 'touch', label: 'Touchpad & Gestures', icon: <MousePointer2 size={14} /> },
        { id: 'ports', label: 'I/O Ports & USB Detect', icon: <Zap size={14} /> },
    ];

    const startBurnIn = () => {
        setTestMode('running');
        setLogs(prev => [...prev, '[LOG] Starting Burn-in Stress Test...', '[THERMAL] Monitoring CPU/GPU temps...']);
        setTimeout(() => {
            setLogs(prev => [...prev, '[LOG] Stress Test PASSED.', '[SEQ_DONE] System stable at 75°C average.']);
            setTestMode('done');
        }, 2000);
    };

    const toggleCheck = (id: string) => {
        setResults(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const allPassed = checkItems.every(i => results[i.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl h-[85vh] bg-carbon-black border border-glass-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
                {/* HEADER */}
                <header className="p-6 bg-accent-blue/10 border-b border-accent-blue/20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-accent-blue p-3 rounded-2xl text-white shadow-lg shadow-accent-blue/20">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                Level 2 <span className="opacity-40">/</span> Stress Test <span className="text-accent-blue text-sm">#{ticket.number}</span>
                            </h2>
                            <p className="text-text-muted text-xs font-black uppercase tracking-widest opacity-60">QUALITY_ASSURANCE_LOG v2.1</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted">
                        <XCircle size={24} />
                    </button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* SIDEBAR */}
                    <aside className="w-80 border-r border-glass-border p-6 space-y-6 bg-black/20">
                        <div className="space-y-4">
                            <div className="p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl space-y-2">
                                <p className="text-[10px] font-black uppercase text-accent-blue tracking-widest flex items-center gap-1"><Cpu size={12} /> MT Diagnosis</p>
                                <p className="text-xs font-medium italic overflow-hidden text-ellipsis line-clamp-3">"{ticket.diagnosis || 'Replaced board components, needs full verify.'}"</p>
                            </div>
                            <div className="space-y-2">
                                <button onClick={() => setActiveTab('checklist')} className={`w-full p-4 rounded-2xl font-black text-xs uppercase tracking-widest text-left flex items-center gap-3 transition-all ${activeTab === 'checklist' ? 'bg-accent-blue text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}>
                                    <Activity size={18} /> Functional Checklist
                                </button>
                                <button onClick={() => setActiveTab('stress')} className={`w-full p-4 rounded-2xl font-black text-xs uppercase tracking-widest text-left flex items-center gap-3 transition-all ${activeTab === 'stress' ? 'bg-accent-blue text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}>
                                    <Zap size={18} /> Burn-In Test
                                </button>
                                <button onClick={() => setActiveTab('action')} className={`w-full p-4 rounded-2xl font-black text-xs uppercase tracking-widest text-left flex items-center gap-3 transition-all ${activeTab === 'action' ? 'bg-accent-blue text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'}`}>
                                    <Send size={18} /> Pass / Fail Report
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-glass-border">
                            <div className="flex justify-between items-center px-1 mb-2">
                                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Progress</p>
                                <p className="text-[10px] font-black uppercase text-accent-blue tracking-widest">{Object.keys(results).filter(k => results[k]).length} / {checkItems.length}</p>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.keys(results).filter(k => results[k]).length / checkItems.length) * 100}%` }}
                                    className="h-full bg-accent-blue"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* MAIN */}
                    <main className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'checklist' && (
                                <motion.div key="check" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-10 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Post-Repair Verification</h3>
                                        <p className="text-text-muted text-sm italic mt-1">Check off all components to ensure 100% functionality before release.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {checkItems.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleCheck(item.id)}
                                                className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${results[item.id] ? 'border-green-500 bg-green-500/10' : 'border-glass-border hover:border-white/20'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl ${results[item.id] ? 'bg-green-500 text-white' : 'bg-white/5 text-text-muted'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className={`text-sm font-black uppercase tracking-tight ${results[item.id] ? 'text-green-500' : 'text-text-muted'}`}>{item.label}</span>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${results[item.id] ? 'bg-green-500 border-green-500 text-white' : 'border-glass-border'}`}>
                                                    {results[item.id] && <CheckCircle2 size={14} />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'stress' && (
                                <motion.div key="stress" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-10 space-y-8 h-full flex flex-col">
                                    <header className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">System Stress Sequence</h3>
                                            <p className="text-text-muted text-sm italic mt-1">Run automated stress tests to verify thermal stability and power draw.</p>
                                        </div>
                                        <button
                                            onClick={startBurnIn}
                                            disabled={testMode === 'running'}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl ${testMode === 'running' ? 'bg-accent-blue/20 text-accent-blue cursor-not-allowed' : 'bg-red-500 text-white shadow-red-500/20 hover:scale-105'}`}
                                        >
                                            <PlayCircle size={18} /> {testMode === 'running' ? 'Stress Running...' : 'Deploy Stress Loop'}
                                        </button>
                                    </header>

                                    <div className="flex-1 bg-black rounded-3xl border border-glass-border p-6 font-mono text-xs overflow-hidden flex flex-col">
                                        <div className="flex items-center gap-2 text-text-muted mb-4 border-b border-white/5 pb-3">
                                            <Terminal size={14} /> <span>SYSTEM_CONSOLE_OUTPUT</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                                            {logs.map((log, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <span className="opacity-20">[{i + 1}]</span>
                                                    <span className={log.includes('PASSED') ? 'text-green-400' : 'text-accent-blue/80'}>{log}</span>
                                                </div>
                                            ))}
                                            {testMode === 'running' && (
                                                <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-accent-blue ml-10 inline-block"></motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'action' && (
                                <motion.div key="action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-10 space-y-10">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Final Routing</h3>
                                        <p className="text-text-muted text-sm italic mt-1">Deploy the quality report and update the owner.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => onUpdateStatus('Done', { tests: results })}
                                            disabled={!allPassed}
                                            className={`p-10 rounded-[3rem] border-2 flex flex-col items-center text-center gap-6 transition-all group ${allPassed ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10' : 'opacity-20 grayscale border-glass-border'}`}
                                        >
                                            <div className="bg-green-500 p-6 rounded-3xl text-white shadow-2xl shadow-green-500/40 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 size={42} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black uppercase tracking-tighter text-white">READY FOR RELEASE</p>
                                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Pass to Billing / Counter</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onUpdateStatus('MT-Expert Review', { tests: results, retest_fail: true })}
                                            className="p-10 rounded-[3rem] border-2 border-red-500/30 bg-red-500/5 flex flex-col items-center text-center gap-6 transition-all group hover:bg-red-500/10"
                                        >
                                            <div className="bg-red-500 p-6 rounded-3xl text-white shadow-2xl shadow-red-500/40 group-hover:scale-110 transition-transform">
                                                <ArrowLeft size={42} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black uppercase tracking-tighter text-white">RETURN TO MASTERTECH</p>
                                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Regression Found during Testing</p>
                                            </div>
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

export default TesterView;
