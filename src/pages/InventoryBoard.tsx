import React, { useState, useEffect } from 'react';
import {
    Plus,
    MoreVertical,
    ChevronRight,
    Truck,
    Users,
    Wrench,
    TrendingUp,
    Layers,
    X,
    Upload,
    Package,
    Search,
    Loader2,
    MoreHorizontal,
    AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

type InventoryTab = 'Products' | 'Services';

interface Product {
    id: string;
    name: string;
    description: string;
    cost: number;
    price: number;
    stocks: number;
    minStocks: number;
    supplier: string;
    investorLinked: string;
    sku: string;
    category: string;
}

interface Service {
    id: string;
    name: string;
    description: string;
    cost: number; // Administrative/Overhead cost
    price: number; // Customer price
    technicianPayout: number; // Amount goes to technician
    category: string;
}

const InventoryBoard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<InventoryTab>('Products');
    const [search, setSearch] = useState('');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isAddingService, setIsAddingService] = useState(false);
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    const [prodForm, setProdForm] = useState({ name: '', description: '', cost: 0, price: 0, stocks: 0, minStocks: 5, supplier: '', investorLinked: 'Company Owned', sku: '', category: 'General' });
    const [srvForm, setSrvForm] = useState({ name: '', description: '', cost: 0, price: 0, technicianPayout: 0, category: 'General' });

    const fetchData = async () => {
        setLoading(true);
        const { data: prodData } = await supabase.from('inventory_products').select('*');
        const { data: srvData } = await supabase.from('inventory_services').select('*');

        if (prodData) {
            setProducts(prodData.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                cost: Number(p.cost),
                price: Number(p.price),
                stocks: p.stocks,
                minStocks: p.min_stocks,
                supplier: p.supplier,
                investorLinked: p.investor_linked,
                sku: p.sku,
                category: p.category
            })));
        }

        if (srvData) {
            setServices(srvData.map((s: any) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                cost: Number(s.cost),
                price: Number(s.price),
                technicianPayout: Number(s.technician_payout),
                category: s.category
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async () => {
        const { error } = await supabase.from('inventory_products').insert([{
            name: prodForm.name,
            description: prodForm.description,
            cost: prodForm.cost,
            price: prodForm.price,
            stocks: prodForm.stocks,
            min_stocks: prodForm.minStocks,
            supplier: prodForm.supplier,
            investor_linked: prodForm.investorLinked,
            sku: prodForm.sku,
            category: prodForm.category
        }]);

        if (!error) {
            setIsAddingProduct(false);
            fetchData();
        }
    };

    const handleAddService = async () => {
        const { error } = await supabase.from('inventory_services').insert([{
            name: srvForm.name,
            description: srvForm.description,
            cost: srvForm.cost,
            price: srvForm.price,
            technician_payout: srvForm.technicianPayout,
            category: srvForm.category
        }]);

        if (!error) {
            setIsAddingService(false);
            fetchData();
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const lowStockItems = products.filter(p => p.stocks <= p.minStocks);

    return (
        <div className="space-y-10 pb-20 p-2 text-left">
            {/* LOW STOCK ALERT HUB */}
            <AnimatePresence>
                {lowStockItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border-2 border-dashed border-red-500/20 rounded-[2rem] p-6 mb-8 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 animate-pulse">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-black uppercase tracking-tight text-white">Stock Depletion Imminent</h3>
                                <p className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest italic">{lowStockItems.length} Asset Nodes below critical threshold</p>
                            </div>
                        </div>
                        <div className="flex -space-x-2">
                            {lowStockItems.slice(0, 5).map(item => (
                                <div key={item.id} className="w-10 h-10 rounded-full border-2 border-bg-carbon bg-bg-slate flex items-center justify-center text-[8px] font-black text-white" title={item.name}>
                                    {item.name.substring(0, 2)}
                                </div>
                            ))}
                            {lowStockItems.length > 5 && (
                                <div className="w-10 h-10 rounded-full border-2 border-bg-carbon bg-ltt-orange flex items-center justify-center text-[10px] font-black text-white">
                                    +{lowStockItems.length - 5}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="bg-accent-blue p-2 rounded-xl text-white shadow-lg shadow-accent-blue/20">
                            <Layers size={28} />
                        </div>
                        Inventory Matrix
                    </h1>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
                        Central Asset Board <ChevronRight size={12} /> Techshack Mandaue
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                        <input
                            className="input-field pl-10 h-12 text-sm font-bold bg-black/20"
                            placeholder="Identify asset or labor node..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {activeTab === 'Products' ? (
                        <button
                            onClick={() => setIsAddingProduct(true)}
                            className="bg-ltt-orange hover:bg-ltt-orange/90 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-ltt-orange/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} /> Upload Product
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsAddingService(true)}
                            className="bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-accent-blue/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} /> Map Service
                        </button>
                    )}
                </div>
            </header>

            {/* TAB SELECTOR */}
            <div className="flex gap-4 border-b border-glass-border">
                {['Products', 'Services'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as InventoryTab)}
                        className={`pb-4 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-text-muted opacity-40 hover:opacity-100'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="inv-active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-ltt-orange rounded-full shadow-[0_0_10px_#f97316]" />
                        )}
                    </button>
                ))}
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-accent-blue" size={40} />
                            <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">Synchronizing Global Asset Matrix...</p>
                        </div>
                    ) : activeTab === 'Products' ? (
                        filteredProducts.map((prod, idx) => (
                            <motion.div
                                key={prod.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="glass-card p-6 border-glass-border group hover:border-ltt-orange/30 transition-all hover:bg-white/[0.02]"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-black/40 text-text-muted rounded-full border border-white/5">{prod.sku}</span>
                                            <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-ltt-orange/10 text-ltt-orange rounded-full border border-ltt-orange/20">{prod.category}</span>
                                        </div>
                                        <h3 className="text-lg font-black uppercase leading-tight group-hover:text-ltt-orange transition-colors">{prod.name}</h3>
                                        <p className="text-[10px] text-text-muted opacity-60 font-medium italic">{prod.description}</p>
                                    </div>
                                    <div className="flex gap-2"> {/* Added a div to contain multiple buttons */}
                                        <button
                                            onClick={() => alert("Procurement Intel: Full inquiry history sub-frame is currently being calculated...")}
                                            className="text-text-muted hover:text-white transition-colors"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                        <button
                                            onClick={() => alert("Asset Operations: Modification sub-routine locked for this user level.")}
                                            className="text-text-muted hover:text-white"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                                        <p className="text-[8px] font-black uppercase text-text-muted opacity-40 tracking-widest">Cost Basis</p>
                                        <p className="text-xs font-black font-mono">₱{prod.cost.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                                        <p className="text-[8px] font-black uppercase text-text-muted opacity-40 tracking-widest">Market Price</p>
                                        <p className="text-xs font-black font-mono text-green-500">₱{prod.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-glass-border/40">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-text-muted opacity-60 tracking-widest"><Truck size={12} /> Supplier: {prod.supplier}</div>
                                        <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${prod.stocks <= prod.minStocks ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-green-500/10 text-green-500'}`}>Stocks: {prod.stocks}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-text-muted opacity-60 tracking-widest"><Users size={12} /> Investor: {prod.investorLinked}</div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        filteredServices.map((srv, idx) => (
                            <motion.div
                                key={srv.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="glass-card p-6 border-glass-border group hover:border-accent-blue/30 transition-all hover:bg-white/[0.02]"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded-full border border-accent-blue/20">{srv.category}</span>
                                        <h3 className="text-lg font-black uppercase leading-tight group-hover:text-accent-blue transition-colors">{srv.name}</h3>
                                        <p className="text-[10px] text-text-muted opacity-60 font-medium italic">{srv.description}</p>
                                    </div>
                                    <Wrench size={20} className="text-text-muted opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                                        <p className="text-[7px] font-black uppercase text-text-muted opacity-40 tracking-widest mb-1">Fee</p>
                                        <p className="text-[11px] font-black font-mono">₱{srv.price.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                                        <p className="text-[7px] font-black uppercase text-text-muted opacity-40 tracking-widest mb-1">Overhead</p>
                                        <p className="text-[11px] font-black font-mono">₱{srv.cost.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-ltt-orange/10 p-3 rounded-xl border border-ltt-orange/20 text-center">
                                        <p className="text-[7px] font-black uppercase text-ltt-orange tracking-widest mb-1">Tech Cut</p>
                                        <p className="text-[11px] font-black font-mono text-ltt-orange">₱{srv.technicianPayout.toLocaleString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* PRODUCT INTAKE MODAL */}
            <AnimatePresence>
                {isAddingProduct && (
                    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <div className="w-full max-w-2xl bg-bg-slate rounded-[2.5rem] border border-glass-border p-10 space-y-8">
                            <div className="flex justify-between items-center text-left">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3"><Package size={24} className="text-ltt-orange" /> Asset Registration</h2>
                                <button onClick={() => setIsAddingProduct(false)} className="p-3 bg-white/5 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Product Descriptor</label>
                                    <input className="input-field h-14 bg-black/40 text-sm font-bold" placeholder="EX: IPHONE 15 OLED GENUINE" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Supplier Node</label>
                                    <input className="input-field h-14 bg-black/40 text-sm font-bold" placeholder="EX: KOWLOON PARTS INC." value={prodForm.supplier} onChange={e => setProdForm({ ...prodForm, supplier: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Purchase Cost (₱)</label>
                                    <input type="number" className="input-field h-14 bg-black/40 text-sm font-bold" placeholder="0.00" value={prodForm.cost} onChange={e => setProdForm({ ...prodForm, cost: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Retail Price (₱)</label>
                                    <input type="number" className="input-field h-14 bg-black/40 text-sm font-bold text-green-500" placeholder="0.00" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Initial Stock Count</label>
                                    <input type="number" className="input-field h-14 bg-black/40 text-sm font-bold" placeholder="0" value={prodForm.stocks} onChange={e => setProdForm({ ...prodForm, stocks: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Investor Linking</label>
                                    <select className="input-field h-14 bg-black/40 text-sm font-bold appearance-none" value={prodForm.investorLinked} onChange={e => setProdForm({ ...prodForm, investorLinked: e.target.value })}>
                                        <option>Company Owned (TechShack)</option>
                                        <option>Investor Alpha</option>
                                        <option>Mr. Beast (Investor B)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-8 border-2 border-dashed border-glass-border rounded-3xl flex flex-col items-center gap-4 group cursor-pointer hover:border-ltt-orange/40 transition-all text-left">
                                <Upload size={32} className="text-text-muted opacity-20 group-hover:text-ltt-orange group-hover:opacity-100" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-white">Upload Product Reference Image</p>
                            </div>

                            <button onClick={handleAddProduct} className="w-full py-5 bg-ltt-orange text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-ltt-orange/40 transition-all hover:scale-[1.02] active:scale-95"> Register Asset Node </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* SERVICE MAPPING MODAL */}
            <AnimatePresence>
                {isAddingService && (
                    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-xl bg-bg-slate rounded-[2.5rem] border border-glass-border p-10 space-y-8 shadow-2xl text-left">
                            <div className="flex justify-between items-center text-left">
                                <div className="text-left">
                                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-left"><Wrench size={24} className="text-accent-blue" /> Labor Configuration</h2>
                                    <p className="text-[10px] font-black uppercase text-text-muted opacity-40 tracking-widest mt-1 text-left">Map service fee vs technician compensation</p>
                                </div>
                                <button onClick={() => setIsAddingService(false)} className="p-3 bg-white/5 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Service Operation Name</label>
                                    <input className="input-field h-14 bg-black/40 text-sm font-bold" placeholder="EX: SCREEN REPLACEMENT LABOR" value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Administrative Cost (₱)</label>
                                        <input type="number" className="input-field h-12 bg-black/40 text-sm font-bold" placeholder="0.00" value={srvForm.cost} onChange={e => setSrvForm({ ...srvForm, cost: Number(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[9px] font-black uppercase text-text-muted tracking-widest ml-2">Customer Service Price (₱)</label>
                                        <input type="number" className="input-field h-12 bg-black/40 text-sm font-bold text-accent-blue font-black" placeholder="0.00" value={srvForm.price} onChange={e => setSrvForm({ ...srvForm, price: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2 text-left p-6 bg-ltt-orange/5 rounded-2xl border border-ltt-orange/20">
                                    <label className="text-[10px] font-black uppercase text-ltt-orange tracking-widest mb-2 flex items-center gap-2 text-left"><TrendingUp size={14} /> Technician Payout Configuration</label>
                                    <input type="number" className="input-field h-14 bg-black/40 text-xl font-black font-mono text-ltt-orange border-ltt-orange/30 focus:border-ltt-orange" placeholder="0.00" value={srvForm.technicianPayout} onChange={e => setSrvForm({ ...srvForm, technicianPayout: Number(e.target.value) })} />
                                    <p className="text-[8px] font-black uppercase text-text-muted opacity-40 tracking-[0.2em] mt-3 italic text-left">This amount will be automatically credited to the primary technician upon job completion.</p>
                                </div>
                            </div>

                            <button onClick={handleAddService} className="w-full py-5 bg-accent-blue text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-accent-blue/40 transition-all hover:scale-[1.02] active:scale-95"> Initialize Service Node </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InventoryBoard;
