import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import CorporateDashboard from './pages/corporate/Dashboard';
import NewInquiry from './pages/corporate/NewInquiry';
import History from './pages/corporate/History';
import BankDashboard from './pages/bank/Dashboard';
import InquiryDetail from './pages/bank/InquiryDetail';

// ===================== Icons =====================
const Icons = {
  Settings: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Building: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  Landmark: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="2" y2="2"/><line x1="3" x2="21" y1="22" y2="22"/><path d="M6 18h12"/><path d="M6 8h12"/><path d="M6 13h12"/><path d="M3 2v20"/><path d="M21 2v20"/></svg>, 
  Check: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

// ===================== Prototype Switcher (FAB) =====================
const PrototypeControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const menuSections = [
    {
      title: "企業端本地詢價工具",
      items: [
        { name: "詢價案件列表", path: "/corporate/dashboard" },
        { name: "新建詢價案件", path: "/corporate/create" },
      ]
    },
    {
      title: "銀行端詢價管理平台",
      items: [
        { name: "詢價案件列表", path: "/bank/dashboard" },
        { name: "回覆詢價案件", path: "/bank/inquiries/INQ-20231025-001" }, // Mock ID
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* Menu Options */}
      <div 
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-xl overflow-hidden min-w-[280px]">
          {menuSections.map((section, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
              <div className="px-4 py-2.5 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                {idx === 0 ? <Icons.Building className="size-3" /> : <Icons.Landmark className="size-3" />}
                {section.title}
              </div>
              <div className="py-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path.includes('/bank/inquiries') && location.pathname.includes('/bank/inquiries'));
                  return (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`block px-4 py-3 text-sm font-medium transition-colors border-l-4 hover:bg-blue-50 hover:text-blue-700 ${
                        isActive ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-transparent text-slate-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center size-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-white'
        }`}
        title="切換頁面導覽"
      >
        {isOpen ? (
           <span className="text-white text-2xl font-light">&times;</span>
        ) : (
           <Icons.Settings className="text-slate-700 size-6 group-hover:rotate-45 transition-transform duration-500" />
        )}
      </button>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
        <main className="min-h-screen flex flex-col">
          <Routes>
            {/* 預設導向企業 Dashboard */}
            <Route path="/" element={<Navigate to="/corporate/dashboard" replace />} />
            
            {/* 系統 A：企業端路由 */}
            <Route path="/corporate/dashboard" element={<CorporateDashboard />} />
            <Route path="/corporate/create" element={<NewInquiry />} />
            <Route path="/corporate/inquiries" element={<History />} />
            
            {/* 系統 B：銀行端路由 */}
            <Route path="/bank/dashboard" element={<BankDashboard />} />
            <Route path="/bank/inquiries/:id" element={<InquiryDetail />} />
          </Routes>
        </main>
        
        {/* Prototype 頁面導覽選單 */}
        <PrototypeControls />
      </div>
    </HashRouter>
  );
}