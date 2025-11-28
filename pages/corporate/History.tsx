import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockService } from '../../services/mockService';
import { Inquiry } from '../../types';

// 左側列表元件
const InquiryListPanel = ({ 
  inquiries, 
  selectedId, 
  onSelect 
}: { 
  inquiries: Inquiry[], 
  selectedId: string | null, 
  onSelect: (id: string) => void 
}) => {
  return (
    <div className="w-full md:w-1/3 border-r bg-white flex flex-col h-full">
      {/* 篩選區 */}
      <div className="p-4 border-b bg-gray-50 space-y-3">
        <input type="text" placeholder="搜尋案件主旨..." className="w-full border rounded px-3 py-2 text-sm" />
        <div className="flex gap-2">
            <select className="w-1/2 border rounded text-sm p-1">
                <option>全部狀態</option>
                <option>進行中</option>
                <option>已結案</option>
            </select>
            <input type="date" className="w-1/2 border rounded text-sm p-1" />
        </div>
      </div>
      
      {/* 列表區 */}
      <div className="flex-1 overflow-y-auto">
        {inquiries.map(item => (
          <div 
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${selectedId === item.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
          >
            <div className="flex justify-between mb-1">
              <span className="font-bold text-gray-800 truncate">{item.subject}</span>
              <span className="text-xs text-gray-500">{item.createDate}</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-sm text-gray-600">
                {item.currency} {item.amount.toLocaleString()}
              </div>
              <div className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                {item.responses.length} / {item.invitedBanks} 回覆
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 右側詳情元件
const InquiryDetailPanel = ({ inquiry }: { inquiry: Inquiry | null }) => {
  const navigate = useNavigate();
  if (!inquiry) return <div className="p-10 text-center text-gray-400">請從左側選擇案件以檢視詳情</div>;

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-6">
      {/* 頂部操作列 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{inquiry.subject}</h2>
          <div className="text-sm text-gray-500 mt-1">案件編號：{inquiry.id}</div>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 text-sm border border-gray-300 bg-white rounded hover:bg-gray-50"
            onClick={() => alert('模擬 PDF 匯出下載...')}
          >
            匯出 PDF
          </button>
          <button 
            onClick={() => navigate('/corporate/create')} // 簡化：不帶參數，僅導航
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            複製建立新案件
          </button>
        </div>
      </div>

      {/* 案件基本資訊卡片 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
         <div>
            <span className="text-gray-500">幣別金額：</span>
            <span className="font-bold ml-2">{inquiry.currency} {inquiry.amount.toLocaleString()}</span>
         </div>
         <div>
            <span className="text-gray-500">日期區間：</span>
            <span className="ml-2">{inquiry.startDate} ~ {inquiry.endDate}</span>
         </div>
         <div className="col-span-2">
            <span className="text-gray-500">詢價用途：</span>
            <span className="ml-2">{inquiry.purpose}</span>
         </div>
         <div className="col-span-2">
            <span className="text-gray-500">天期需求：</span>
            <div className="flex gap-2 mt-1">
                {inquiry.tenors.map(t => <span key={t} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs">{t}</span>)}
            </div>
         </div>
      </div>

      {/* 利率比較圖表區 (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col items-center justify-center h-48 border-dashed border-gray-300">
        <div className="text-gray-400 font-bold text-lg">// 利率比較視覺化圖表區</div>
        <div className="text-gray-400 text-sm mt-2">長條圖顯示各家銀行利率高低</div>
      </div>

      {/* 各銀行回覆列表 */}
      <h3 className="font-bold text-lg text-gray-700 mb-3 border-l-4 border-blue-600 pl-3">銀行回覆列表</h3>
      <div className="space-y-4">
        {inquiry.responses.length === 0 ? (
          <div className="text-gray-500 italic p-4">目前尚無任何銀行回覆。</div>
        ) : (
          inquiry.responses.map(resp => (
            <div key={resp.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                <div className="font-bold text-gray-800">{resp.bankName}</div>
                <div className="text-xs text-gray-500">
                  {resp.updatedAt} ({resp.source})
                </div>
              </div>
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">天期</th>
                      <th className="px-4 py-2 font-medium">利率</th>
                      <th className="px-4 py-2 font-medium">備註</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {resp.details.map((d, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">{d.tenor}</td>
                        <td className="px-4 py-2 text-blue-600 font-bold">{d.rate}</td>
                        <td className="px-4 py-2 text-gray-500">{d.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 電話補登區塊 (模擬) */}
      <div className="mt-8 border-t pt-6 opacity-60 hover:opacity-100 transition">
        <h4 className="font-bold text-gray-600 mb-2">📞 電話議價補登 (模擬功能)</h4>
        <div className="flex gap-2">
            <input type="text" placeholder="銀行名稱" className="border rounded px-2 py-1 text-sm" disabled />
            <input type="text" placeholder="利率" className="border rounded px-2 py-1 text-sm w-20" disabled />
            <button className="bg-gray-200 text-gray-500 px-3 py-1 rounded text-sm" disabled>新增紀錄</button>
        </div>
      </div>
    </div>
  );
};

// 主頁面
export default function History() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // 取得 URL Query Param (例如從 Dashboard 或 Create 跳轉過來)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryId = searchParams.get('id');

  useEffect(() => {
    const data = mockService.getInquiries();
    setInquiries(data);
    
    // 如果有 query ID，優先選取；否則選取第一筆
    if (queryId) {
        setSelectedId(queryId);
    } else if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
    }
  }, [queryId]);

  const selectedInquiry = inquiries.find(i => i.id === selectedId) || null;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-[1920px] mx-auto overflow-hidden">
      <InquiryListPanel 
        inquiries={inquiries} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />
      <InquiryDetailPanel inquiry={selectedInquiry} />
    </div>
  );
}