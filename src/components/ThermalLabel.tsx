import React from 'react';
import {
    QrCode,
    User,
    Smartphone,
    AlertCircle,
    CheckCircle2,
    Receipt as ReceiptIcon
} from 'lucide-react';

interface LabelData {
    ticketNumber: string;
    customerName: string;
    customerPhone: string;
    deviceBrand: string;
    deviceModel: string;
    serialNumber: string;
    issue: string;
    diagnosis?: string;
    totalAmount?: number;
    date: string;
    type: 'Internal' | 'Claim' | 'POS';
}

const ThermalLabel: React.FC<{ data: LabelData }> = ({ data }) => {
    return (
        <div className="print-label-container bg-white text-black font-mono overflow-hidden">
            {data.type === 'Internal' && (
                <div className="p-1 h-full flex flex-col justify-between border border-black/10">
                    <div className="flex justify-between items-start border-b border-black pb-0.5 mb-1">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase leading-none opacity-50 tracking-tighter">Ticket ID</span>
                            <span className="text-sm font-black leading-none">{data.ticketNumber}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[7px] font-black uppercase leading-none opacity-50 tracking-tighter">Bin Location</span>
                            <span className="text-[9px] font-black leading-none bg-black text-white px-1 mt-0.5 uppercase tracking-tighter">SEC-14B</span>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                            <Smartphone size={8} />
                            <span className="text-[9px] font-black uppercase truncate leading-none">{data.deviceBrand} {data.deviceModel}</span>
                        </div>
                        <div className="text-[7px] font-black opacity-60 leading-tight">
                            S/N: {data.serialNumber || 'N/A'}
                        </div>
                    </div>

                    <div className="bg-black/5 p-1 rounded-sm flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle size={7} />
                            <span className="text-[6px] font-black uppercase tracking-tighter">Primary Fault</span>
                        </div>
                        <p className="text-[8px] font-black uppercase leading-tight line-clamp-2">{data.issue}</p>
                    </div>

                    <div className="flex justify-between items-end mt-1 border-t border-black/20 pt-1">
                        <div className="flex flex-col">
                            <span className="text-[6px] font-black uppercase tracking-tighter opacity-50">Intake-Date</span>
                            <span className="text-[7px] font-bold tracking-tighter">{data.date}</span>
                        </div>
                        <div className="text-[6px] font-black uppercase bg-black text-white px-1 tracking-tighter">MASTERTECH-L3</div>
                    </div>
                </div>
            )}

            {data.type === 'Claim' && (
                <div className="p-1 h-full flex flex-col items-center justify-between text-center">
                    <div className="w-full border-b border-black pb-0.5 mb-1 flex justify-between items-center text-[8px] font-black uppercase">
                        <span>TechShack</span>
                        <span>#{data.ticketNumber}</span>
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1">
                            <User size={8} />
                            <span className="text-[9px] font-black truncate max-w-[100px] uppercase">{data.customerName}</span>
                        </div>
                        <p className="text-[7px] font-bold opacity-70">PH: {data.customerPhone}</p>
                    </div>

                    <div className="my-1 border-2 border-dashed border-black p-0.5 flex flex-col items-center gap-0.5">
                        <QrCode size={24} strokeWidth={3} />
                        <span className="text-[5px] font-black uppercase tracking-tighter">Track Status Online</span>
                    </div>

                    <p className="text-[5.5px] font-black italic uppercase leading-[1.1] opacity-70">
                        Terms: Abandoned if 30D unclaimed. Techshack not liable for data loss.
                    </p>

                    <div className="w-full border-t border-black pt-0.5 mt-1 flex justify-center gap-2 items-center text-[7px] font-black uppercase italic overflow-hidden whitespace-nowrap">
                        <span>* CERTIFIED L3 SPECIALIST *</span>
                    </div>
                </div>
            )}

            {data.type === 'POS' && (
                <div className="p-1 h-full flex flex-col justify-between border-2 border-black border-double">
                    <div className="text-center space-y-0.5 border-b border-black pb-1 mb-1">
                        <h4 className="text-[9px] font-black uppercase leading-none">Official Settle Receipt</h4>
                        <p className="text-[6px] font-bold uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                            <ReceiptIcon size={6} /> TKT-ID: {data.ticketNumber}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center border-b border-black/10 pb-0.5">
                            <span className="text-[7px] font-black uppercase tracking-tighter opacity-50">Labor/Tech Fee</span>
                            <span className="text-[8px] font-black font-mono underline">PH Verified</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[7px] font-black uppercase tracking-tighter opacity-50">Parts Total</span>
                            <span className="text-[8px] font-black font-mono">INC</span>
                        </div>
                    </div>

                    <div className="bg-black p-1 rounded-sm text-center">
                        <p className="text-[6px] font-black text-white/60 uppercase tracking-widest leading-none mb-0.5">Net Grand Total</p>
                        <h2 className="text-lg font-black text-white leading-none tracking-tighter italic">₱{data.totalAmount?.toLocaleString()}</h2>
                    </div>

                    <div className="text-center space-y-0.5 mt-1">
                        <div className="flex justify-center items-center gap-1 text-[7px] font-black uppercase text-green-700">
                            <CheckCircle2 size={8} /> <span>Fully Settled</span>
                        </div>
                        <p className="text-[5px] font-bold opacity-60 uppercase italic">Thank you for trusting TechShack Mandaue!</p>
                    </div>
                </div>
            )}

            <style>{`
        @media screen {
          .print-label-container {
            width: 40mm;
            height: 46mm;
            margin: auto;
            border: 1px dashed #ccc;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          
          #thermal-print-target, 
          #thermal-print-target * {
            visibility: visible;
          }
          
          #thermal-print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 40mm !important;
            height: 46mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: 40mm 46mm;
            margin: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default ThermalLabel;
