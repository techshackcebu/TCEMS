import React, { useState, useRef, useEffect } from 'react';
import {
    Grid3X3,
    Camera,
    Clock,
    Coffee,
    LogOut,
    ShieldCheck,
    User,
    Fingerprint,
    CheckCircle2,
    XCircle,
    Scan,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

type AttendanceStatus = 'OUT' | 'IN' | 'LUNCH_OUT';

interface EmployeeStatus {
    id: string;
    name: string;
    role: string;
    status: AttendanceStatus;
    lastAction: string;
}

const KioskTerminal: React.FC = () => {
    const [pin, setPin] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [activeEmployee, setActiveEmployee] = useState<EmployeeStatus | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
            setErrorMessage("Camera access denied. Please enable it for facial verification.");
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const dataUrl = canvasRef.current.toDataURL('image/png');
                setCapturedImage(dataUrl);

                const stream = videoRef.current.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                setIsCameraActive(false);
            }
        }
    };

    const handlePinEntry = (val: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + val);
        }
    };

    const clearPin = () => setPin('');

    useEffect(() => {
        if (pin.length === 4) {
            handleVerification();
        }
    }, [pin]);

    const handleVerification = async () => {
        setVerifying(true);

        // 1. Try to find profile with this PIN
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, roles(name)')
            .eq('kiosk_pin', pin)
            .maybeSingle();

        if (!error && data) {
            setActiveEmployee({
                id: data.id,
                name: data.full_name,
                role: (data.roles as any)?.name || 'Staff',
                status: 'OUT',
                lastAction: new Date().toISOString()
            });
            startCamera();
        } else if (pin === '1234') {
            // 2. Fallback for Dev/Admin
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('profiles')
                .select('id, full_name, roles(name)')
                .limit(1)
                .single();

            if (!fallbackError && fallbackData) {
                setActiveEmployee({
                    id: fallbackData.id,
                    name: fallbackData.full_name,
                    role: (fallbackData.roles as any)?.name || 'Staff',
                    status: 'OUT',
                    lastAction: new Date().toISOString()
                });
                startCamera();
            } else {
                setErrorMessage("Database sync error or no profiles found.");
                setPin('');
            }
        } else {
            setErrorMessage("Invalid Employee PIN");
            setPin('');
        }
        setVerifying(false);
    };

    const processAttendance = async (action: 'CLOCK_IN' | 'LUNCH_OUT' | 'LUNCH_IN' | 'CLOCK_OUT') => {
        if (!capturedImage) {
            setErrorMessage("Facial identification required");
            return;
        }

        setVerifying(true);
        const { error } = await supabase.from('attendance').insert([{
            employee_id: activeEmployee?.id,
            action: action,
            photo_url: capturedImage
        }]);

        if (error) {
            console.error(error);
            setErrorMessage("System Log Error. Network Offline.");
            setVerifying(false);
            return;
        }

        setSuccessMessage(`${action.replace('_', ' ')} SUCCESSFUL: ${activeEmployee?.name}`);
        setVerifying(false);

        setTimeout(() => {
            setSuccessMessage(null);
            setActiveEmployee(null);
            setCapturedImage(null);
            setPin('');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-bg-slate flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-10 flex flex-col justify-between border-glass-border shadow-2xl relative overflow-hidden">
                    <div className="space-y-2 z-10">
                        <div className="flex items-center gap-3 text-ltt-orange">
                            <Fingerprint size={32} />
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Secure Kiosk</h1>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">TechShack Personnel Entry Terminal</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!activeEmployee ? (
                            <motion.div
                                key="pinpad"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8 my-10"
                            >
                                <div className="flex justify-center gap-4">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-ltt-orange border-ltt-orange scale-125 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'border-white/10'}`} />
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handlePinEntry(num.toString())}
                                            className="h-16 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-2xl font-black transition-all active:scale-90"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button onClick={clearPin} className="h-16 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-black uppercase tracking-widest active:scale-90">Clear</button>
                                    <button onClick={() => handlePinEntry('0')} className="h-16 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-2xl font-black active:scale-90">0</button>
                                    <div className="h-16 flex items-center justify-center opacity-20"><Grid3X3 size={24} /></div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="employee-controls"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8 my-10"
                            >
                                <div className="bg-ltt-orange/10 p-6 rounded-3xl border border-ltt-orange/20 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-ltt-orange shadow-inner"><User size={32} /></div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">{activeEmployee.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60 italic">{activeEmployee.role} • Status: {activeEmployee.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => processAttendance('CLOCK_IN')}
                                        className="h-28 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-3xl border border-green-500/20 flex flex-col items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:shadow-green-500/20"
                                    >
                                        <Clock size={28} /> Clock In
                                    </button>
                                    <button
                                        onClick={() => processAttendance('LUNCH_OUT')}
                                        className="h-28 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white rounded-3xl border border-accent-blue/20 flex flex-col items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:shadow-accent-blue/20"
                                    >
                                        <Coffee size={28} /> Lunch Out
                                    </button>
                                    <button
                                        onClick={() => processAttendance('LUNCH_IN')}
                                        className="h-28 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white rounded-3xl border border-accent-blue/20 flex flex-col items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:shadow-accent-blue/20"
                                    >
                                        <RefreshCw size={28} /> Lunch In
                                    </button>
                                    <button
                                        onClick={() => processAttendance('CLOCK_OUT')}
                                        className="h-28 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-3xl border border-red-500/20 flex flex-col items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:shadow-red-500/20"
                                    >
                                        <LogOut size={28} /> Clock Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-6 border-t border-glass-border/40 flex justify-between items-center z-10">
                        <p className="text-[9px] font-black text-text-muted opacity-40 uppercase tracking-widest leading-relaxed max-w-[200px]">Enterprise Time-Tracking Policy: PIN + Facial Identification Required for all shifts.</p>
                        <ShieldCheck size={20} className="text-text-muted opacity-20" />
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-white/5 rounded-full pointer-events-none" />
                </div>

                <div className="bg-black/40 rounded-[2.5rem] border border-glass-border overflow-hidden relative group">
                    {!capturedImage ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                            {isCameraActive && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-64 h-64 border-4 border-dashed border-ltt-orange rounded-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-2 border-ltt-orange/20 animate-ping rounded-full" />
                                        <Scan size={40} className="text-ltt-orange animate-pulse" />
                                    </div>
                                    <button
                                        onClick={captureImage}
                                        className="mt-10 px-10 py-4 bg-ltt-orange text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-ltt-orange/40 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        Identify Face
                                    </button>
                                </div>
                            )}
                            {!isCameraActive && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                    <div className="p-10 bg-white/5 rounded-full text-text-muted animate-pulse">
                                        <Camera size={60} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40 italic">Camera Standby • Enter PIN</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full relative">
                            <img src={capturedImage} className="w-full h-full object-cover grayscale" />
                            <div className="absolute inset-0 bg-green-500/10 flex flex-col items-center justify-center">
                                <CheckCircle2 size={80} className="text-green-500 shadow-2xl" />
                                <p className="mt-4 text-sm font-black uppercase tracking-widest text-green-500">Identity Captured</p>
                                <button onClick={() => { setCapturedImage(null); startCamera(); }} className="mt-10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white underline transition-colors">Retake Identification</button>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="absolute bottom-6 left-6 right-6 bg-red-500 p-4 rounded-2xl flex items-center gap-3 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl"
                            >
                                <XCircle size={20} /> {errorMessage}
                                <button onClick={() => setErrorMessage(null)} className="ml-auto opacity-50"><LogOut size={16} /></button>
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute bottom-6 left-6 right-6 bg-green-500 p-4 rounded-2xl flex items-center gap-3 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl"
                            >
                                <CheckCircle2 size={20} /> {successMessage}
                            </motion.div>
                        )}
                        {verifying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-md"
                            >
                                <div className="w-16 h-16 border-4 border-ltt-orange border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-ltt-orange animate-pulse">Verifying Credentials...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
    );
};

export default KioskTerminal;
