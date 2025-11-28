import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../../services/mockService';
import { Inquiry } from '../../types';

export default function BankDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // 模擬當前銀行看到的案件列表 (基本上就是所有的 Mock Data)
  useEffect(() => {
    setInquiries(mockService.getInquiries());
  }, []);

  // 輔助函式：判斷本行是否已回覆
  const getMyResponseStatus = (inq: Inquiry) => {
    const myResp = inq.responses.find(r => r.bankName === '本行' || r.bankName === '玉山銀行'); // 假設我是玉山
    if (myResp) return { status: '已回覆', time: myResp.updatedAt };
    return { status: '未回覆', time: '-' };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
        ℹ️ 此頁為銀行內部用 Dashboard，RM 亦可從 Email 連結直接進入單一案件頁面。
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">銀行端案件管理總覽</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-red-500">
          <div className="text-gray-500 text-xs">待回覆案件</div>
          <div className="text-2xl font-bold">1</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-gray-500">
          <div className="text-gray-500 text-xs">已結案</div>
          <div className="text-2xl font-bold">5</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-blue-500">
          <div className="text-gray-500 text-xs">今日到期</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      {/* 篩選工具列 */}
      <div className="bg-white p-4 rounded-t-lg border-b flex gap-4 items-center">
        <input type="text" placeholder="搜尋企業名稱..." className="border rounded px-3 py-1.5 text-sm" />
        <select className="border rounded px-3 py-1.5 text-sm">
            <option>所有狀態</option>
            <option>未回覆</option>
            <option>已回覆</option>
        </select>
      </div>

      {/* 案件列表表格 */}
      <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                    <th className="p-4">案件主旨</th>
                    <th className="p-4">企業名稱</th>
                    <th className="p-4">金額</th>
                    <th className="p-4">詢價日期</th>
                    <th className="p-4">回覆狀態</th>
                    <th className="p-4">最後回覆時間</th>
                    <th className="p-4">操作</th>
                </tr>
            </thead>
            <tbody className="divide-y text-sm">
                {inquiries.map(inq => {
                    const statusInfo = getMyResponseStatus(inq);
                    return (
                        <tr key={inq.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-medium text-gray-800">{inq.subject}</td>
                            <td className="p-4">{inq.companyName}</td>
                            <td className="p-4">{inq.currency} {inq.amount.toLocaleString()}</td>
                            <td className="p-4">{inq.createDate}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${statusInfo.status === '已回覆' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {statusInfo.status}
                                </span>
                            </td>
                            <td className="p-4 text-gray-500">{statusInfo.time}</td>
                            <td className="p-4">
                                <button 
                                    onClick={() => navigate(`/bank/inquiries/${inq.id}`)}
                                    className="text-blue-600 hover:underline"
                                >
                                    進入案件
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
}