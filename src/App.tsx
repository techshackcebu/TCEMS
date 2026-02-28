import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import KioskTerminal from './pages/KioskTerminal';
import EmployeePortal from './pages/EmployeePortal';
import IntakePage from './pages/IntakePage';
import TicketsPage from './pages/TicketsPage';
import LoginPage from './pages/LoginPage';
import PartsBoard from './pages/PartsBoard';
import POSBoard from './pages/POSBoard';
import TrackPage from './pages/TrackPage';
import InventoryBoard from './pages/InventoryBoard';
import EmployeesPage from './pages/EmployeesPage';
import PayrollPage from './pages/PayrollPage';
import InvestorPage from './pages/InvestorPage';
import EarningsPage from './pages/EarningsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DiagnosticFlow from './components/DiagnosticFlow';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { LayoutGrid, ClipboardCheck, Users, Box, Settings, LogOut, Users2, Landmark, History, FileText, ChevronLeft, Package, CreditCard, Search, ShieldCheck, LayoutDashboard, QrCode, Smartphone, Monitor, User, PieChart } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState('Intake');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Intake', icon: <QrCode size={20} /> },
    { name: 'Repair Tickets', icon: <Smartphone size={20} /> },
    { name: 'Parts Inquiry', icon: <Search size={20} /> },
    { name: 'POS / Billing', icon: <CreditCard size={20} /> },
    { name: 'Kiosk Terminal', icon: <Monitor size={20} /> },
    { name: 'Employee Portal', icon: <User size={20} /> },
    { name: 'Track Repair', icon: <Search size={20} /> },
    { name: 'Inventory', icon: <Package size={20} /> },
    { name: 'Employees', icon: <Users2 size={20} /> },
    { name: 'Payroll', icon: <FileText size={20} /> },
    { name: 'Investors', icon: <Landmark size={20} /> },
    { name: 'Earnings', icon: <ShieldCheck size={20} /> },
    { name: 'Analytics', icon: <PieChart size={20} /> },
    { name: 'Customers', icon: <Users size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  if (!session) return <LoginPage />;

  const renderContent = () => {
    if (currentPage === 'Repair Tickets' && selectedTicketId) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedTicketId(null)}
            className="text-ltt-orange flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:-translate-x-1 transition-transform mb-4"
          >
            <ChevronLeft size={16} /> Back to Board
          </button>
          <h1 className="text-3xl font-black uppercase tracking-tight">Diagnostic & Inspection Phase</h1>
          <p className="text-text-muted mt-1 italic font-medium">Record observations and trigger parts inquiries for TKT-ID: {selectedTicketId.slice(0, 8)}</p>
          <DiagnosticFlow />
        </div>
      );
    }

    switch (currentPage) {
      case 'Dashboard': return <DashboardPage />;
      case 'Intake': return <IntakePage />;
      case 'Repair Tickets': return <TicketsPage onSelectTicket={setSelectedTicketId} />;
      case 'Parts Inquiry': return <PartsBoard />;
      case 'POS / Billing': return <POSBoard />;
      case 'Kiosk Terminal': return <KioskTerminal />;
      case 'Employee Portal': return <EmployeePortal />;
      case 'Track Repair': return <TrackPage />;
      case 'Inventory': return <InventoryBoard />;
      case 'Employees': return <EmployeesPage />;
      case 'Payroll': return <PayrollPage />;
      case 'Investors': return <InvestorPage />;
      case 'Earnings': return <EarningsPage />;
      case 'Analytics': return <AnalyticsPage />;
      default: return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-ltt-orange animate-pulse">
            <LayoutGrid size={32} />
          </div>
          <h2 className="text-2xl font-bold">Module Under Construction</h2>
          <p className="text-text-muted max-w-sm">We are currently building the {currentPage} module. Please stay tuned for technical updates.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-carbon text-text-main">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-glass-border bg-bg-slate fixed h-full p-4 flex flex-col justify-between hidden md:flex overflow-y-auto scrollbar-thin">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2 pt-4">
            <div className="w-10 h-10 bg-ltt-orange rounded-full flex items-center justify-center font-black text-xl">TS</div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">TechShack</h1>
              <p className="text-[10px] font-black tracking-widest text-text-muted uppercase italic opacity-40">Mandaue Center</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => { setCurrentPage(item.name); setSelectedTicketId(null); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-bold ${currentPage === item.name
                  ? 'bg-ltt-orange text-white shadow-lg shadow-ltt-orange/20'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-glass-border">
          <p className="text-[10px] uppercase font-black text-text-muted px-4 mb-2 truncate">{session.user.email?.split('@')[0]}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 bg-gradient-to-br from-bg-carbon to-bg-slate p-0 md:p-8">
        <div className="glass-card shadow-2xl p-4 md:p-10 border-0 md:border">
          {renderContent()}
        </div>
      </main>

      {/* MOBILE TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-slate/80 backdrop-blur-xl border-t border-glass-border flex justify-around items-center p-3 md:hidden z-50">
        {menuItems.slice(0, 4).map(item => (
          <button
            key={item.name}
            onClick={() => { setCurrentPage(item.name); setSelectedTicketId(null); }}
            className={`flex flex-col items-center gap-1 ${currentPage === item.name ? 'text-ltt-orange' : 'text-text-muted'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase">{item.name.replace(' Tickets', '')}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
