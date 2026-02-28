import React, { useState } from 'react';
import {
    Users2,
    UserPlus,
    Search,
    Calendar,
    Clock,
    TrendingUp,
    ShieldCheck,
    UserCog,
    Briefcase,
    ChevronRight,
    AlertCircle,
    User,
    Phone,
    Mail,
    Droplets,
    MapPin,
    Heart,
    Landmark,
    Download,
    FileText,
    QrCode,
    Camera,
    Upload,
    X,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

type EmployeeRole = 'Admin' | 'HR' | 'Technician L2' | 'MasterTechnician' | 'Customer Service' | 'Operations Manager' | 'OJT/Trainee';

interface Employee {
    id: string; // Auto Generated: TSMT92526-01
    fullName: string;
    nickName: string;
    role: EmployeeRole;
    type: 'Regular' | 'Daily';
    dailyWage: number;
    joinedDate: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    phoneNumber: string;
    email: string;
    bloodType: string;
    address: string;
    birthday: string;
    emergencyContact: { name: string; number: string };
    nationality: string;
    bankInfo: { name: string; number: string };
    profilePicture?: string;
    qrCode?: string;
    restDays: string[];
}

const EmployeesPage: React.FC = () => {
    const [employees] = useState<Employee[]>([
        {
            id: 'TSMT022826-01',
            fullName: 'John Doe',
            nickName: 'Johnny',
            role: 'MasterTechnician',
            type: 'Regular',
            dailyWage: 540,
            joinedDate: '2026-02-28',
            status: 'Active',
            phoneNumber: '+63 912 345 6789',
            email: 'john@techshack.ph',
            bloodType: 'O+',
            address: 'Mandaue City, Cebu',
            birthday: '1995-05-15',
            emergencyContact: { name: 'Jane Doe', number: '0917-000-0000' },
            nationality: 'Filipino',
            bankInfo: { name: 'BDO', number: '001234567890' },
            restDays: ['Tuesday', 'Wednesday']
        },
    ]);
    const [search, setSearch] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [signupForm, setSignupForm] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'MasterTechnician',
        nickName: '',
        phone: '',
        pin: ''
    });
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupError, setSignupError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupLoading(true);
        setSignupError('');

        // Step 1: Create the secure authentication identity
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: signupForm.email,
            password: signupForm.password,
            options: { data: { full_name: signupForm.fullName } }
        });

        if (authError) {
            setSignupError(authError.message);
            setSignupLoading(false);
            return;
        }

        // Map Roles to Database IDs
        const roleMap: Record<string, number> = {
            'Admin': 1, 'HR': 2, 'Technician L2': 3, 'MasterTechnician': 4,
            'Customer Service': 5, 'Operations Manager': 6, 'OJT/Trainee': 7
        };

        // Step 2: Push their identity to the physical Staff Profile Table
        if (authData.user) {
            await supabase.from('profiles').insert({
                id: authData.user.id,
                full_name: signupForm.fullName,
                phone: signupForm.phone,
                role_id: roleMap[signupForm.role] || 7,
                kiosk_pin: signupForm.pin // Save the PIN
            });
        }

        setIsAdding(false);
        setSignupLoading(false);
        alert(`Successfully initialized ${signupForm.fullName} into the database!`);
    };

    // Note: generateEmployeeId will be used when implementing the save functionality
    /* 
    const generateEmployeeId = (role: EmployeeRole, joinedDate: string) => {
        const roleCodes: Record<EmployeeRole, string> = {
            'Admin': 'AD', 'HR': 'HR', 'Technician L2': 'L2', 'MasterTechnician': 'MT',
            'Customer Service': 'CS', 'Operations Manager': 'OM', 'OJT/Trainee': 'OT'
        };
        const dateObj = new Date(joinedDate);
        const dateStr = `${dateObj.getMonth() + 1}${dateObj.getDate()}${dateObj.getFullYear().toString().slice(-2)}`;
        const sequence = (employees.length + 1).toString().padStart(2, '0');
        return `TS${roleCodes[role]}${dateStr}-${sequence}`;
    };
    */

    const stats = [
        { label: 'Active Roster', val: employees.length, icon: <Users2 size={18} />, color: 'blue' },
        { label: 'Daily Budget', val: '₱' + employees.reduce((s, e) => s + e.dailyWage, 0).toLocaleString(), icon: <TrendingUp size={18} />, color: 'green' },
        { label: 'OJT / Trainees', val: employees.filter(e => e.role === 'OJT/Trainee').length, icon: <Briefcase size={18} />, color: 'orange' },
        { label: 'L3 Specialists', val: employees.filter(e => e.role === 'MasterTechnician').length, icon: <ShieldCheck size={18} />, color: 'red' },
    ];

    return (
        <div className="space-y-8 pb-20 p-2">
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 justify-start">
                        <div className="bg-ltt-orange p-2 rounded-xl text-white shadow-lg shadow-ltt-orange/20"><Users2 size={28} /></div>
                        Personnel Command
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2 justify-start">
                        Staff Roster <ChevronRight size={12} /> Techshack Mandaue
                    </p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                        <input
                            className="input-field pl-10 h-12 text-sm font-bold bg-black/20"
                            placeholder="Recall personnel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-ltt-orange hover:bg-ltt-orange/90 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-ltt-orange/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <UserPlus size={18} /> Enroll Staff
                    </button>
                </div>
            </header>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-5 border-l-4 border-ltt-orange/20 hover:border-ltt-orange transition-all flex items-center justify-between group"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">{stat.label}</p>
                            <h3 className="text-xl font-black font-mono">{stat.val}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-ltt-orange/10 transition-colors">
                            {stat.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* EMPLOYEE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {employees.filter(e => e.fullName.toLowerCase().includes(search.toLowerCase())).map((emp) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="glass-card overflow-hidden group hover:border-ltt-orange/30 transition-all border-glass-border relative cursor-pointer"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-bg-slate to-black rounded-2xl flex items-center justify-center border border-white/5 shadow-inner relative overflow-hidden">
                                        {emp.profilePicture ? <img src={emp.profilePicture} className="w-full h-full object-cover" /> : <UserCog size={28} className="text-text-muted opacity-40 group-hover:text-ltt-orange group-hover:opacity-100 transition-all" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">{emp.fullName}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ltt-orange">{emp.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">ID TAG</p>
                                    <p className="text-[10px] font-black font-mono bg-black/40 px-2 py-1 rounded-lg border border-white/5">{emp.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Contact</p>
                                    <p className="text-[10px] font-black text-white/80">{emp.phoneNumber}</p>
                                </div>
                                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Blood Type</p>
                                    <p className="text-[10px] font-black text-red-500 uppercase">{emp.bloodType}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-glass-border/40">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${emp.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Status: {emp.status}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted">
                                    <Clock size={12} /> Joined {new Date(emp.joinedDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* EMPLOYEE PROFILE MODAL */}
            <AnimatePresence>
                {selectedEmployee && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedEmployee(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-bg-slate w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-glass-border shadow-2xl p-8 md:p-12 relative scrollbar-thin"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedEmployee(null)} className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-text-muted"><X size={24} /></button>

                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                {/* LEFT SIDE: BIO / AVATAR */}
                                <div className="w-full md:w-1/3 space-y-8">
                                    <div className="aspect-square w-full bg-black/40 rounded-[2rem] border-4 border-glass-border flex items-center justify-center relative overflow-hidden shadow-2xl group">
                                        {selectedEmployee.profilePicture ? <img src={selectedEmployee.profilePicture} className="w-full h-full object-cover" /> : <UserCog size={80} className="text-text-muted opacity-20" />}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button className="p-4 bg-ltt-orange rounded-2xl text-white shadow-xl hover:scale-110 active:scale-90 transition-all"><Camera size={24} /></button>
                                            <button className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all"><Upload size={24} /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 bg-black/20 rounded-2xl border border-glass-border flex flex-col items-center gap-4">
                                            <QrCode size={120} className="text-white opacity-40" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic underline">Staff Identification Node</p>
                                        </div>
                                        <button className="w-full py-4 bg-white/5 border border-glass-border rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                            <Download size={18} /> Download COE
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT SIDE: DATA GRID */}
                                <div className="flex-1 space-y-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-4xl font-black tracking-tighter uppercase">{selectedEmployee.fullName}</h2>
                                            <span className="px-3 py-1 bg-ltt-orange/10 border border-ltt-orange/20 text-ltt-orange text-[10px] font-black uppercase rounded-lg tracking-widest">{selectedEmployee.role}</span>
                                        </div>
                                        <p className="text-sm font-black text-text-muted uppercase tracking-[0.4em] italic opacity-40">Personnel ID: {selectedEmployee.id}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Nickname', val: selectedEmployee.nickName, icon: <User size={14} /> },
                                            { label: 'Blood Type', val: selectedEmployee.bloodType, icon: <Droplets size={14} />, color: 'text-red-500' },
                                            { label: 'Nationality', val: selectedEmployee.nationality, icon: <MapPin size={14} /> },
                                            { label: 'Birthday', val: selectedEmployee.birthday, icon: <Calendar size={14} /> },
                                            { label: 'Contact', val: selectedEmployee.phoneNumber, icon: <Phone size={14} /> },
                                            { label: 'Email Node', val: selectedEmployee.email, icon: <Mail size={14} /> },
                                        ].map(item => (
                                            <div key={item.label} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                                <p className="text-[8px] font-black uppercase text-text-muted tracking-widest flex items-center gap-2">{item.icon} {item.label}</p>
                                                <p className={`text-xs font-black uppercase tracking-tight ${item.color || ''}`}>{item.val}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-glass-border/40">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center gap-2"><Heart size={14} className="text-red-500" /> Emergency Relay</h4>
                                            <div className="p-5 bg-white/5 rounded-2xl border border-glass-border">
                                                <p className="text-sm font-black uppercase">{selectedEmployee.emergencyContact.name}</p>
                                                <p className="text-xs font-bold font-mono text-text-muted opacity-60 mt-1">{selectedEmployee.emergencyContact.number}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center gap-2"><Landmark size={14} className="text-accent-blue" /> Financial Node</h4>
                                            <div className="p-5 bg-white/5 rounded-2xl border border-glass-border">
                                                <p className="text-sm font-black uppercase">{selectedEmployee.bankInfo.name}</p>
                                                <p className="text-xs font-bold font-mono text-text-muted opacity-60 mt-1">{selectedEmployee.bankInfo.number}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center gap-2"><FileText size={14} /> Documentation Vault</h4>
                                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                            {['Personnel Resume', 'Government ID', 'Contract Agreement', 'Certification'].map(file => (
                                                <div key={file} className="min-w-[140px] p-4 bg-black/60 rounded-2xl border border-dashed border-white/10 hover:border-ltt-orange/40 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group">
                                                    <FileText size={20} className="text-text-muted opacity-20 group-hover:text-ltt-orange group-hover:opacity-100" />
                                                    <p className="text-[9px] font-black uppercase leading-tight">{file}</p>
                                                </div>
                                            ))}
                                            <div className="min-w-[140px] p-4 bg-ltt-orange/5 rounded-2xl border border-dashed border-ltt-orange/40 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                                <Upload size={20} className="text-ltt-orange" />
                                                <p className="text-[9px] font-black uppercase text-ltt-orange">Attach More</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ENROLL STAFF MODAL - MOCK FOR FIELDS */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <div className="w-full max-w-2xl bg-bg-slate rounded-[3rem] border border-glass-border p-10 space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Personnel Intake Node</h2>
                                    <p className="text-[10px] font-black uppercase text-text-muted opacity-60 tracking-widest italic mt-1">Official Supabase Auth Provisioning</p>
                                </div>
                                <button onClick={() => setIsAdding(false)} className="p-3 bg-white/5 rounded-full"><X size={20} /></button>
                            </div>

                            <form className="space-y-6" onSubmit={handleSignup}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2">Secure Link Email</label>
                                        <input type="email" required className="input-field h-14 bg-black/40 text-sm font-bold" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} placeholder="staff@techshack.ph" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2 flex items-center gap-1"><Lock size={10} /> Access Key (Password)</label>
                                        <input type="password" required className="input-field h-14 bg-black/40 text-sm font-bold" minLength={6} value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} placeholder="••••••••" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2">Full Legal Name</label>
                                        <input required className="input-field h-14 bg-black/40 text-sm font-bold" value={signupForm.fullName} onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })} placeholder="EX: JUAN DELA CRUZ" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2">Role Classification</label>
                                        <select className="input-field h-14 bg-black/40 text-sm font-bold appearance-none" value={signupForm.role} onChange={e => setSignupForm({ ...signupForm, role: e.target.value })}>
                                            <option>MasterTechnician</option>
                                            <option>Technician L2</option>
                                            <option>HR</option>
                                            <option>Admin</option>
                                            <option>Customer Service</option>
                                            <option>Operations Manager</option>
                                            <option>OJT/Trainee</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2">Nickname</label>
                                        <input className="input-field h-12 bg-black/40 text-sm font-bold" value={signupForm.nickName} onChange={e => setSignupForm({ ...signupForm, nickName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-2">Contact (+63)</label>
                                        <input className="input-field h-12 bg-black/40 text-sm font-bold" value={signupForm.phone} onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-ltt-orange tracking-widest ml-2 flex items-center gap-2"><Lock size={12} /> Secure Kiosk Entry Pin (4 Digits)</label>
                                    <input required maxLength={4} className="input-field h-14 bg-black/40 text-2xl font-black font-mono tracking-[0.5em] text-center" value={signupForm.pin} onChange={e => setSignupForm({ ...signupForm, pin: e.target.value })} placeholder="0000" />
                                </div>

                                {signupError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-lg text-center">
                                        {signupError}
                                    </div>
                                )}

                                <p className="text-[9px] font-black uppercase text-ltt-orange italic text-center opacity-60 border-t border-glass-border/40 pt-6">The system will securely encrypt and inject this Employee into the global Active Directory.</p>

                                <button disabled={signupLoading} className="w-full py-5 bg-ltt-orange hover:bg-ltt-orange/90 disabled:opacity-50 text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-ltt-orange/40 transition-all active:scale-95">
                                    {signupLoading ? 'Executing Injection...' : 'Initialize Personnel Node'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ATTENDANCE POLICY REMINDER */}
            <div className="bg-red-500/5 border-2 border-dashed border-red-500/20 p-6 rounded-3xl flex items-start gap-4">
                <div className="bg-red-500/10 p-3 rounded-2xl text-red-500"><AlertCircle size={24} /></div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-red-500">De-minimis Protocol Active</h4>
                    <p className="text-xs text-text-muted font-medium italic leading-relaxed">System-wide rule: Daily De-minimis portion is automatically voided for Lateness, Absence, or Undertime. This ensures 100% operational efficiency.</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
