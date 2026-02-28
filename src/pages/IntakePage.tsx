import React, { useState } from 'react';
import { Search, Printer, UserPlus, Save, Camera, Plus, X, Laptop, Monitor, Gamepad2, Layers, ClipboardCheck, Lock, AlertCircle, RotateCcw, ShieldCheck, HeartPulse } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import TermsModal from '../components/TermsModal';
import ClaimSlip from '../components/ClaimSlip';

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
    const [password, setPassword] = useState('');
    const [probing, setProbing] = useState({
        occurrence: '',
        previousRepair: 'No',
        troubleshooting: ''
    });
    const [faults, setFaults] = useState<string[]>([]);
    const [otherFault, setOtherFault] = useState('');
    const [accessories, setAccessories] = useState<string[]>([]);
    const [customAccessory, setCustomAccessory] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [stickerCount, setStickerCount] = useState(1);
    const [showTerms, setShowTerms] = useState(false);
    const [isFastTrack, setIsFastTrack] = useState(false);
    const [csTroubleshooting, setCsTroubleshooting] = useState<string[]>([]);

    const deviceTypes = [
        { name: 'Laptop', icon: <Laptop size={18} /> },
        { name: 'Desktop', icon: <Monitor size={18} /> },
        { name: 'Console', icon: <Gamepad2 size={18} /> },
        { name: 'Others', icon: <Layers size={18} /> }
    ];

    const csBestPractices = [
        'Hard Reset (Static Discharge)', 'Test with Shop Adapter',
        'External Display Output', 'Battery Isolation',
        'Flashlight Test (Dim LCD)', 'CMOS/RTC Recovery'
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
        const status = isFastTrack ? 'MT-Expert Review' : 'Pending';
        alert(`Ticket Created Successfully! [Status: ${status}]\nAuto-Assigned to MasterTech: ${isFastTrack ? 'YES' : 'STAGED'}\nSilent Printing Sticker & Claim Slip...`);
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
                <div className="flex items-center gap-4">
                    <div className="bg-ltt-orange p-3 rounded-2xl text-white shadow-lg shadow-ltt-orange/20"><Laptop size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight leading-none">Device Intake</h1>
                        <p className="text-text-muted mt-2 font-black text-[10px] uppercase tracking-[0.2em] italic opacity-60">Professional Diagnostics & Fast-Track Service</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsFastTrack(!isFastTrack)}
                        className={`px-6 py-3 rounded-xl border flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest ${isFastTrack ? 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/20 scale-105' : 'bg-white/5 border-glass-border text-text-muted hover:border-red-500/50 hover:text-red-400'}`}
                    >
                        {isFastTrack ? <HeartPulse size={16} className="animate-pulse" /> : <ShieldCheck size={16} />}
                        {isFastTrack ? 'FAST-TRACK (DEAD UNIT)' : 'Diagnostic Mode'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* FAST TRACK WARNING */}
                    <AnimatePresence>
                        {isFastTrack && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-lg space-y-3 mb-6">
                                <h3 className="text-red-500 font-black uppercase flex items-center gap-2">
                                    <AlertCircle size={20} /> MasterTech Fast-Track Active
                                </h3>
                                <p className="text-sm text-text-muted font-medium">Unit is marked as **DEAD** or failed preliminary diagnostics. This ticket will be assigned directly to Expert L3/MasterTech.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CS TROUBLESHOOTING CHECKLIST */}
                    {isFastTrack && (
                        <section className="glass-card space-y-4 border-l-4 border-ltt-orange overflow-hidden">
                            <h2 className="text-sm font-black uppercase tracking-widest text-ltt-orange flex items-center gap-2">
                                <RotateCcw size={16} /> CS Best-Practice Troubleshooting
                            </h2>
                            <p className="text-[10px] font-bold text-text-muted italic">Check off what was attempted before dropping off:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {csBestPractices.map(bp => (
                                    <button
                                        key={bp}
                                        onClick={() => toggleItem(setCsTroubleshooting, bp)}
                                        className={`p-3 rounded-lg text-[10px] font-black uppercase border text-left flex items-center justify-between transition-all ${csTroubleshooting.includes(bp) ? 'bg-ltt-orange border-ltt-orange text-white' : 'border-glass-border text-text-muted hover:bg-white/5'}`}
                                    >
                                        {bp}
                                        {csTroubleshooting.includes(bp) && <ShieldCheck size={12} />}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

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

                    {/* PROBING & SECURITY */}
                    <section className="glass-card space-y-4 border-l-4 border-accent-blue">
                        <h2 className="text-sm font-black uppercase tracking-widest text-accent-blue flex items-center gap-2">
                            <ClipboardCheck size={16} /> Probing & Security
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">Device Password / PIN</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                    <input className="input-field pl-9 font-mono text-sm" placeholder="Ask customer for password..." value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-text-muted ml-2">When did the issue start?</label>
                                <input className="input-field text-sm" placeholder="e.g. Yesterday after update..." value={probing.occurrence} onChange={e => setProbing({ ...probing, occurrence: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-black text-text-muted ml-2">Previous Technician Access?</label>
                            <div className="flex gap-2">
                                {['No', 'Yes - Unauthorized', 'Yes - Official Center'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setProbing({ ...probing, previousRepair: opt })}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${probing.previousRepair === opt ? 'bg-accent-blue border-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'border-glass-border text-text-muted hover:bg-white/5'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black text-text-muted ml-2">Basic troubleshooting done?</label>
                            <textarea className="input-field text-sm min-h-[80px]" placeholder="e.g. Tried hard reset, different charger..." value={probing.troubleshooting} onChange={e => setProbing({ ...probing, troubleshooting: e.target.value })} />
                        </div>
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

                {/* SIDEBAR PREVIEW SECTION */}
                <div className="space-y-6 lg:sticky lg:top-8 h-fit">
                    <div className="glass-card bg-white/5 border-ltt-orange/30 p-5 space-y-6 shadow-2xl">
                        <header className="flex flex-col items-center gap-1 border-b border-glass-border pb-3">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-ltt-orange">Silent Print Queue</h2>
                            <p className="text-[8px] font-bold text-text-muted uppercase italic">Hardware: P2 & PT-210</p>
                        </header>

                        {/* P2 Sticker Preview */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase text-center text-text-muted opacity-60">40x46mm Sticker (P2)</p>
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
                                        <p className="text-[9px] font-bold text-gray-800 uppercase truncate">{customer?.full_name || 'Guest'}</p>
                                        <p className="text-[8px] font-bold text-gray-500">{phone || '09XX-XXX-XXXX'}</p>
                                    </div>
                                    <div className="bg-black text-white p-1 rounded-sm text-center">
                                        <p className="text-[9px] font-black uppercase truncate">{device.brand} {device.model || 'Device'}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[7px] font-bold">
                                        <span>{device.color || 'Std'}</span>
                                        <span className="truncate max-w-[50px]">{device.serial || 'No_SN'}</span>
                                    </div>
                                </div>

                                <div className="border-t border-black/50 pt-1">
                                    <p className="text-[6px] font-black uppercase bg-gray-100 text-center leading-loose">P2-Y6015 (40x46mm)</p>
                                </div>
                            </div>
                        </div>

                        {/* PT-210 Claim Slip Preview */}
                        {(isFastTrack || customer) && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3 pt-6 border-t border-dashed border-glass-border">
                                <p className="text-[10px] font-black uppercase text-center text-accent-blue opacity-60">58mm Claim Slip (PT-210)</p>
                                <div className="flex justify-center scale-90 origin-top">
                                    <ClaimSlip
                                        ticket={{
                                            number: (Math.random() * 9000).toFixed(0),
                                            date: new Date().toLocaleDateString(),
                                            customer: customer?.full_name || 'Guest Customer',
                                            phone: phone || 'No Number',
                                            device: `${device.brand} ${device.model}`,
                                            serial: device.serial || 'DEVICE_SN',
                                            troubleshooting: csTroubleshooting,
                                            isFastTrack: isFastTrack
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-4 pt-6 border-t border-glass-border">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-black uppercase text-text-muted">Print Copies:</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setStickerCount(Math.max(1, stickerCount - 1))} className="p-2 bg-white/5 rounded-lg hover:text-ltt-orange transition-colors"><Minus size={14} /></button>
                                    <span className="text-xl font-black">{stickerCount}</span>
                                    <button onClick={() => setStickerCount(stickerCount + 1)} className="p-2 bg-white/5 rounded-lg hover:text-ltt-orange transition-colors"><Plus size={14} /></button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTerms(true)}
                                disabled={isSaving}
                                className={`w-full py-5 flex items-center justify-center gap-3 text-lg font-black shadow-lg transition-all rounded-xl ${isFastTrack ? 'bg-red-500 text-white shadow-red-500/20 hover:scale-[1.02]' : 'btn-primary shadow-ltt-orange/40'}`}
                            >
                                {isSaving ? 'Registering...' : <><Save size={24} /> {isFastTrack ? 'Confirm Drop-off' : 'Confirm Intake'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntakePage;
