import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Scale, Lock, Trash2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAgree }) => {
    const [agreed, setAgreed] = useState(false);

    if (!isOpen) return null;

    const sections = [
        {
            title: "1. Authorization for Inspection",
            icon: <Zap size={18} className="text-ltt-orange" />,
            content: "The Customer hereby grants TechShack permission to perform a comprehensive physical and digital diagnostic on the provided hardware. This process may include, but is not limited to, hardware stress tests, disassembly, and the use of diagnostic software. The Customer acknowledges that opening a device may void existing manufacturer warranties and agrees to hold TechShack harmless for such outcomes."
        },
        {
            title: "2. Data Integrity and Liability",
            icon: <AlertTriangle size={18} className="text-yellow-500" />,
            content: "TechShack prioritizes data security; however, we do not guarantee the integrity of data during the repair process. The Customer assumes full responsibility for backing up all software, personal files, and confidential data prior to submission. TechShack shall not be held liable for any data loss, corruption, or inability to recover files resulting from hardware failure or repair procedures."
        },
        {
            title: "3. Access and Privacy",
            icon: <Lock size={18} className="text-blue-500" />,
            content: "To ensure full hardware functionality and verify successful repairs, Technicians may require the device passcode. TechShack adheres to strict privacy standards. Customers may choose to withhold passcodes, but acknowledge that doing so may prevent TechShack from fully testing the device and may void any repair warranties."
        },
        {
            title: "4. Policy on Abandoned Property",
            icon: <Trash2 size={18} className="text-red-500" />,
            content: "Devices must be collected within 30 calendar days following notification. After the 30-day grace period, the device will be considered abandoned. TechShack reserves the right to recycle the hardware or sell the device to recoup unpaid service fees."
        },
        {
            title: "5. Pre-existing Conditions",
            icon: <Scale size={18} className="text-purple-500" />,
            content: "The Customer acknowledges that devices previously subjected to physical impact or liquid exposure may possess unseen internal damage. TechShack is not responsible for the total failure of a device that occurs during standard disassembly or repair if such failure is a direct result of prior damage."
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border-ltt-orange/30 shadow-2xl shadow-ltt-orange/10"
            >
                <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-slate">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <ShieldCheck className="text-ltt-orange" /> Repair Terms & Conditions
                    </h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-ltt-orange">
                    {sections.map((sec, i) => (
                        <div key={i} className="space-y-2">
                            <h3 className="text-sm font-black uppercase flex items-center gap-2 text-white">
                                {sec.icon} {sec.title}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed pl-7">
                                {sec.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-glass-border bg-bg-slate space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="mt-1 w-5 h-5 rounded border-glass-border bg-black/40 text-ltt-orange focus:ring-ltt-orange"
                        />
                        <span className="text-sm font-bold text-text-muted group-hover:text-white transition-colors">
                            I have read, understood, and agree to the TechShack Professional Service Terms as stated above.
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-6 rounded-lg border border-glass-border font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!agreed}
                            onClick={onAgree}
                            className={`flex-[2] py-3 px-6 rounded-lg font-black uppercase tracking-widest text-xs transition-all ${agreed ? 'bg-ltt-orange text-white shadow-lg shadow-ltt-orange/20 hover:scale-[1.02]' : 'bg-white/5 text-text-muted cursor-not-allowed'
                                }`}
                        >
                            Accept and Create Ticket
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsModal;
