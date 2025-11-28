import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockService } from '../../services/mockService';
import { Inquiry } from '../../types';

export default function CorporateDashboard() {
  const navigate = useNavigate();
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    // API: 取得最近的詢價案件
    const data = mockService.getInquiries().slice(0, 3);
    setRecentInquiries(data);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* 頁面標題 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">詢價總覽 Dashboard</h1>
        <button
          onClick={() => navigate('/corporate/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-lg transition flex items-center gap-2"
        >
          <span>＋</span> 建立新詢價
        </button>
      </div>

      {/* 統計摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm mb-1">今日新建案件</p>
          <p className="text-3xl font-bold text-gray-800">2 <span className="text-sm font-normal text-gray-400">件</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm mb-1">進行中案件</p>
          <p className="text-3xl font-bold text-gray-800">5 <span className="text-sm font-normal text-gray-400">件</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm mb-1">已收到回覆</p>
          <p className="text-3xl font-bold text-gray-800">12 <span className="text-sm font-normal text-gray-400">家銀行</span></p>
        </div>
      </div>

      {/* 近期案件列表卡片區 */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-gray-600 pl-3">
        最近詢價案件
      </h2>
      
      {recentInquiries.length === 0 ? (
        <div className="text-center py-10 bg-white rounded shadow-sm text-gray-400">目前尚無案件</div>
      ) : (
        <div className="grid gap-4">
          {recentInquiries.map((inq) => (
            <div 
              key={inq.id}
              onClick={() => navigate(`/corporate/inquiries?id=${inq.id}`)}
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded ${inq.status === '進行中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {inq.status}
                  </span>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600">{inq.subject}</h3>
                </div>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>建立日期：{inq.createDate}</span>
                  <span>|</span>
                  <span>{inq.currency} {inq.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">已回覆 / 送信</div>
                <div className="font-mono text-xl text-blue-600 font-bold">
                  {inq.responses.length} <span className="text-gray-400 text-base font-normal">/ {inq.invitedBanks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}