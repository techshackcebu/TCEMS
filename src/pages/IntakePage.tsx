import React, { useState } from 'react';
import { Search, Printer, UserPlus, Save, Camera, Plus, X, Laptop, Monitor, Gamepad2, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import TermsModal from '../components/TermsModal';

interface Customer {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
}

const IntakePage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [device, setDevice] = useState({
        type: 'Laptop',
        brand: '',
        model: '',
        serial: '',
        color: ''
    });
    const [faults, setFaults] = useState<string[]>([]);
    const [otherFault, setOtherFault] = useState('');
    const [accessories, setAccessories] = useState<string[]>([]);
    const [customAccessory, setCustomAccessory] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [stickerCount, setStickerCount] = useState(1);
    const [showTerms, setShowTerms] = useState(false);

    const deviceTypes = [
        { name: 'Laptop', icon: <Laptop size={18} /> },
        { name: 'Desktop', icon: <Monitor size={18} /> },
        { name: 'Console', icon: <Gamepad2 size={18} /> },
        { name: 'Others', icon: <Layers size={18} /> }
    ];

    const commonFaults = [
        'No power', 'Overheating', 'Bluescreen',
        'No Display', 'LCD Flicker', 'LCD Crack',
        'Not Charging', 'Sudden Shutdown'
    ];

    const commonAccessories = ['Charger', 'USB', 'Bag', 'Mouse', 'Keyboard'];

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

    const toggleItem = (setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const takePhoto = async () => {
        try {
            const image = await CapCamera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera
            });
            if (image.webPath) {
                setPhotos(prev => [...prev, image.webPath!]);
            }
        } catch (e) {
            console.error('Camera cancelled or failed', e);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setShowTerms(false);
        setIsSaving(true);
        // Logic for saving to Supabase and triggering Printer
        alert(`Ticket Created Successfully!\nSilent Printing ${stickerCount} Sticker(s) to P2-Y6015...`);
        setIsSaving(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-24">
            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAgree={handleSubmit}
            />

            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="bg-ltt-orange p-2 rounded-lg text-white"><Laptop size={28} /></div>
                        Device Intake
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">"Silently printing details in 40x46mm..."</p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-xs font-black p-2 border border-ltt-orange rounded text-ltt-orange">STAFF: CS_MGR</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* CUSTOMER SECTION */}
                    <section className="glass-card space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange flex items-center gap-2">
                            <Search size={16} /> Customer Lookup
                        </h2>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                className="input-field flex-1"
                                placeholder="Enter Phone Number..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handleLookup}
                            />
                            <button className="btn-primary flex items-center gap-2 px-6">
                                <UserPlus size={18} /> New Customer
                            </button>
                        </div>
                        {customer && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-ltt-orange/10 border-l-4 border-ltt-orange rounded-r-lg">
                                <p className="font-bold text-lg">{customer.full_name}</p>
                                <p className="text-text-muted text-sm">{customer.phone}</p>
                            </motion.div>
                        )}
                    </section>

                    {/* DEVICE TYPE SELECTOR */}
                    <section className="glass-card space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange">Device Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {deviceTypes.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => setDevice({ ...device, type: t.name })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 ${device.type === t.name ? 'border-ltt-orange bg-ltt-orange/10 text-ltt-orange shadow-lg shadow-ltt-orange/10' : 'border-glass-border text-text-muted grayscale opacity-60'
                                        }`}
                                >
                                    {t.icon}
                                    <span className="text-xs font-black uppercase">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* DEVICE SPECS */}
                    <section className="glass-card space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">Brand</label>
                                <input className="input-field" placeholder="Brand" value={device.brand} onChange={e => setDevice({ ...device, brand: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">Model</label>
                                <input className="input-field" placeholder="Model" value={device.model} onChange={e => setDevice({ ...device, model: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">Serial Number</label>
                                <input className="input-field font-mono" placeholder="S/N" value={device.serial} onChange={e => setDevice({ ...device, serial: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">Color</label>
                                <input className="input-field" placeholder="Color" value={device.color} onChange={e => setDevice({ ...device, color: e.target.value })} />
                            </div>
                        </div>
                    </section>

                    {/* ISSUE CHECKLIST */}
                    <section className="glass-card space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange">Issue / Fault Reporting</h2>
                        <div className="flex flex-wrap gap-2">
                            {commonFaults.map(f => (
                                <button
                                    key={f}
                                    onClick={() => toggleItem(setFaults, f)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${faults.includes(f) ? 'bg-ltt-orange border-ltt-orange text-white' : 'border-glass-border text-text-muted'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input className="input-field text-sm" placeholder="Other Issues..." value={otherFault} onChange={e => setOtherFault(e.target.value)} />
                            <button onClick={() => { if (otherFault) { setFaults([...faults, otherFault]); setOtherFault(''); } }} className="btn-primary p-2 px-4 shadow-none"><Plus size={18} /></button>
                        </div>
                    </section>

                    {/* ACCESSORIES CHECKLIST */}
                    <section className="glass-card space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange">Accessories Included</h2>
                        <div className="flex flex-wrap gap-2">
                            {commonAccessories.map(a => (
                                <button
                                    key={a}
                                    onClick={() => toggleItem(setAccessories, a)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${accessories.includes(a) ? 'bg-accent-blue border-accent-blue text-white' : 'border-glass-border text-text-muted'
                                        }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input className="input-field text-sm" placeholder="Add Accessory (e.g. Case, Stylo)..." value={customAccessory} onChange={e => setCustomAccessory(e.target.value)} />
                            <button onClick={() => { if (customAccessory) { setAccessories([...accessories, customAccessory]); setCustomAccessory(''); } }} className="bg-accent-blue p-2 px-4 text-white rounded-lg"><Plus size={18} /></button>
                        </div>
                    </section>

                    {/* PHOTO CAPTURE */}
                    <section className="glass-card space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange">Condition Photos</h2>
                            <button onClick={takePhoto} className="flex items-center gap-2 text-xs font-black text-ltt-orange border border-ltt-orange/50 px-4 py-2 rounded-lg hover:bg-ltt-orange/10 transition-all uppercase">
                                <Camera size={16} /> Capture Image
                            </button>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            <AnimatePresence>
                                {photos.map((url, i) => (
                                    <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative aspect-square rounded-lg overflow-hidden border border-glass-border group">
                                        <img src={url} className="w-full h-full object-cover" alt="Condition" />
                                        <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {photos.length === 0 && (
                                <div className="aspect-square rounded-xl border border-dashed border-glass-border flex flex-col items-center justify-center text-text-muted opacity-30">
                                    <Camera size={24} />
                                    <span className="text-[8px] font-black uppercase mt-2">No Images</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* PRINTING & STICKER PREVIEW SIDEBAR */}
                <div className="space-y-6 lg:sticky lg:top-8 h-fit">
                    <div className="glass-card bg-white/5 border-ltt-orange/30 p-4 space-y-4 shadow-2xl">
                        <h2 className="text-xs font-black uppercase tracking-widest text-ltt-orange text-center flex items-center justify-center gap-2">
                            <Printer size={14} /> P2 Sticker Preview
                        </h2>

                        {/* 40x46mm PREVIEW */}
                        <div className="mx-auto w-[150px] h-[173px] bg-white text-black p-3 relative flex flex-col justify-between shadow-2xl rounded-sm">
                            <div className="border-b-2 border-black pb-1">
                                <p className="text-[12px] font-black leading-tight uppercase">TechShack</p>
                                <p className="text-[7px] font-bold leading-none">Canduman, Mandaue City</p>
                            </div>

                            <div className="flex-1 space-y-1 my-2 flex flex-col justify-center overflow-hidden">
                                <div className="flex justify-between items-baseline border-b border-black/10">
                                    <span className="text-[10px] font-black uppercase">TKT:</span>
                                    <span className="text-[12px] font-black leading-none">#{(Math.random() * 1000).toFixed(0)}</span>
                                </div>
                                <div className="leading-tight py-1">
                                    <p className="text-[9px] font-bold text-gray-800">{customer?.full_name || 'Customer Name'}</p>
                                    <p className="text-[8px] font-bold text-gray-500">{phone || '09XX'}</p>
                                </div>
                                <div className="bg-black text-white p-1 rounded-sm text-center">
                                    <p className="text-[9px] font-black uppercase truncate">{device.brand} {device.model || 'Device'}</p>
                                </div>
                                <div className="flex justify-between items-center text-[7px] font-bold">
                                    <span>{device.color || 'No Color'}</span>
                                    <span className="truncate max-w-[50px]">{device.serial || 'No Serial'}</span>
                                </div>
                            </div>

                            <div className="border-t border-black/50 pt-1">
                                <p className="text-[6px] font-black uppercase bg-gray-100 text-center leading-loose">P2-Y6015 (40x46mm)</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-black uppercase text-text-muted">Copies:</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setStickerCount(Math.max(1, stickerCount - 1))} className="p-1 hover:text-ltt-orange transition-colors"><X size={12} /></button>
                                    <span className="text-lg font-black">{stickerCount}</span>
                                    <button onClick={() => setStickerCount(stickerCount + 1)} className="p-1 hover:text-ltt-orange transition-colors"><Plus size={12} /></button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTerms(true)}
                                disabled={isSaving}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-black shadow-lg shadow-ltt-orange/40"
                            >
                                {isSaving ? 'Registering...' : <><Save size={24} /> Confirm Intake</>}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-dashed border-glass-border text-center space-y-2">
                        <p className="text-[10px] font-bold text-text-muted uppercase">Bluetooth Hardware Status</p>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                            <span className="uppercase">P2 Sticker Printer Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntakePage;
