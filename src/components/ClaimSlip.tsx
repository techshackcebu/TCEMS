import React from 'react';
import { MapPin, Phone, Hash, ReceiptText } from 'lucide-react';

interface ClaimSlipProps {
    ticket: {
        number: string;
        date: string;
        customer: string;
        phone: string;
        device: string;
        serial: string;
        troubleshooting: string[];
        isFastTrack: boolean;
    };
}

const ClaimSlip: React.FC<ClaimSlipProps> = ({ ticket }) => {
    return (
        <div className="w-[300px] bg-white text-black p-4 font-mono text-[10px] space-y-4 shadow-xl border border-gray-200">
            <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-sm font-black uppercase">TechShack TCEMS</h1>
                <p className="text-[8px] font-bold">PROFESSIONAL REPAIR CENTER</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <MapPin size={8} /> <span className="text-[7px]">Canduman, Mandaue City</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Phone size={8} /> <span className="text-[7px]">+63 927 7686 245</span>
                </div>
            </div>

            <div className="space-y-2 border-b border-black/10 pb-2">
                <div className="flex justify-between font-black border-2 border-black p-1 bg-black text-white text-xs">
                    <span>CLAIM SLIP</span>
                    <span>#{ticket.number}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">DATE:</span>
                    <span>{ticket.date}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="font-black uppercase border-b border-black/5 pb-1 flex items-center gap-1">
                    <Hash size={10} /> Customer Info
                </p>
                <p className="font-black text-[12px]">{ticket.customer}</p>
                <p className="text-gray-600 font-bold">{ticket.phone}</p>
            </div>

            <div className="space-y-1">
                <p className="font-black uppercase border-b border-black/5 pb-1">Unit Details</p>
                <p className="font-black text-[11px]">{ticket.device}</p>
                <p className="text-[8px] font-bold">S/N: {ticket.serial}</p>
            </div>

            <div className="space-y-2 py-2 bg-gray-50 rounded p-2">
                <p className="font-black uppercase text-[8px] flex items-center gap-1 text-red-600">
                    <ReceiptText size={10} /> {ticket.isFastTrack ? 'FAST-TRACK DROP-OFF (DEAD UNIT)' : 'DIAGNOSTIC INTAKE'}
                </p>
                <div className="space-y-1">
                    <p className="text-[7px] font-black underline italic">TROUBLESHOOTING DONE (CS):</p>
                    <ul className="list-none space-y-0.5">
                        {ticket.troubleshooting.map((item, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="font-black"> [X] </span>
                                <span className="uppercase leading-none">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-[7px] font-bold space-y-1 pt-2">
                <p className="text-center font-black uppercase text-[8px] border-t border-black pt-2">IMPORTANT NOTICE</p>
                <p>1. Present this slip to claim your unit after repair.</p>
                <p>2. Units not claimed within 30 days will be considered ABANDONED.</p>
                <p>3. TechShack is not liable for data loss. Backup is customer responsibility.</p>
                <p className="text-center font-black mt-2">ASSIGNED: <span className="text-sm">MASTER_TECH</span></p>
            </div>

            <div className="text-center pt-4 opacity-30 border-t border-dashed border-black">
                <p className="text-[6px]">PRINTED VIA PT-210_9C36 (58MM)</p>
            </div>
        </div>
    );
};

export default ClaimSlip;
