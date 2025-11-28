import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import CorporateDashboard from './pages/corporate/Dashboard';
import NewInquiry from './pages/corporate/NewInquiry';
import History from './pages/corporate/History';
import BankDashboard from './pages/bank/Dashboard';
import InquiryDetail from './pages/bank/InquiryDetail';

// 簡單的頂部導覽列，用於在兩個系統間切換 (方便 Demo)
const Navigation = () => {
  const location = useLocation();
  const isBankSystem = location.pathname.startsWith('/bank');
  const isCorporateSystem = location.pathname.startsWith('/corporate');

  return (
    <nav className={`shadow-md px-6 py-4 flex justify-between items-center ${isBankSystem ? 'bg-emerald-800' : 'bg-slate-800'} text-white`}>
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold tracking-wider">
          {isBankSystem ? '🏦 銀行端詢價管理平台' : '🏢 企業端本地詢價工具'}
        </div>
        {/* 系統內導覽 */}
        <div className="ml-8 space-x-4 text-sm opacity-90">
          {isCorporateSystem && (
            <>
              <Link to="/corporate/dashboard" className="hover:text-yellow-400">總覽 Dashboard</Link>
              <Link to="/corporate/inquiries" className="hover:text-yellow-400">詢價歷史</Link>
            </>
          )}
          {isBankSystem && (
            <Link to="/bank/dashboard" className="hover:text-yellow-400">案件列表</Link>
          )}
        </div>
      </div>
      
      {/* 系統切換按鈕 (Prototype 專用) */}
      <div className="text-xs flex gap-2">
        <Link to="/corporate/dashboard" className={`px-3 py-1 rounded border ${isCorporateSystem ? 'bg-white text-slate-900 font-bold' : 'border-white/30 hover:bg-white/10'}`}>
          切換至企業視角
        </Link>
        <Link to="/bank/dashboard" className={`px-3 py-1 rounded border ${isBankSystem ? 'bg-white text-emerald-900 font-bold' : 'border-white/30 hover:bg-white/10'}`}>
          切換至銀行視角
        </Link>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navigation />
        <main className="flex-1 overflow-hidden flex flex-col">
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
      </div>
    </HashRouter>
  );
}