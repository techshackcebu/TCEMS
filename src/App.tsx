import React, { useState } from 'react';
import IntakePage from './pages/IntakePage';
import TicketsPage from './pages/TicketsPage';
import { LayoutGrid, ClipboardCheck, Users, Box, Settings, LogOut, PackageSearch, Receipt, Users2, Landmark, History, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Intake');

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'Intake', icon: <ClipboardCheck size={20} /> },
    { name: 'Repair Tickets', icon: <Box size={20} /> },
    { name: 'Customers', icon: <Users size={20} /> },
    { name: 'Parts Inquiry', icon: <PackageSearch size={20} /> },
    { name: 'POS', icon: <Receipt size={20} /> },
    { name: 'Inventory', icon: <History size={20} /> },
    { name: 'Employees', icon: <Users2 size={20} /> },
    { name: 'Investors', icon: <Landmark size={20} /> },
    { name: 'Payroll', icon: <FileText size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'Intake': return <IntakePage />;
      case 'Repair Tickets': return <TicketsPage />;
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
            <h1 className="text-xl font-black tracking-tight uppercase">TechShack</h1>
          </div>

          <nav className="space-y-0.5">
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => setCurrentPage(item.name)}
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

        <button className="flex items-center gap-3 px-4 py-3 mt-6 text-text-muted hover:text-red-400 transition-colors font-medium">
          <LogOut size={20} />
          Logout
        </button>
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
            onClick={() => setCurrentPage(item.name)}
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
