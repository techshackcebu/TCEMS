import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { LayoutGrid, Fingerprint, Lock, ShieldCheck } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-radial from-bg-slate to-bg-carbon relative overflow-hidden">
            {/* LTT INSPIRED BACKGROUND DECORATION */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-ltt-orange/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-10 border-ltt-orange/20 shadow-2xl relative"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="bg-ltt-orange w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-ltt-orange/40 mb-4 animate-bounce">
                        <LayoutGrid size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">TechShack TCEMS</h1>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Operational Environment v2.0</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted block ml-2">Secure Link ID (Email)</label>
                        <div className="relative group">
                            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-ltt-orange transition-colors" size={18} />
                            <input
                                className="input-field pl-10"
                                type="email"
                                placeholder="name@techshack.ph"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text-muted block ml-2">Access Key (Password)</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-ltt-orange transition-colors" size={18} />
                            <input
                                className="input-field pl-10"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-ltt-orange/20"
                    >
                        {loading ? 'Authenticating...' : <><ShieldCheck size={20} /> Authorize Access</>}
                    </button>
                </form>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => {
                            localStorage.setItem('sales_demo', 'true');
                            window.location.reload();
                        }}
                        className="w-full py-3 bg-white/5 border border-dashed border-ltt-orange/40 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-ltt-orange hover:bg-ltt-orange/10 transition-all flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={14} /> Buyer Review: Rapid Boot Mode
                    </button>
                    <p className="text-[8px] text-text-muted text-center italic opacity-60">Allows instant dashboard inspection without auth credentials (Sales Mode)</p>
                </div>

                <div className="mt-10 border-t border-glass-border pt-6 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-text-muted opacity-40">
                    <span>Encrypted Socket SHA-256</span>
                    <span>Mandaue Center HUB</span>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
