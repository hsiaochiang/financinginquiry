import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '../../services/mockService';
import { Inquiry, RateDetail } from '../../types';

export default function BankInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  
  // 模擬身份：從 URL 參數獲取，若無則預設為 "王大明 (Default RM)"
  const [currentRmName, setCurrentRmName] = useState(searchParams.get('rmName') || '王大明');

  // 本地表單狀態
  const [rateDetails, setRateDetails] = useState<RateDetail[]>([{ tenor: '', rate: '', note: '' }]);

  useEffect(() => {
    if (id) {
      const data = mockService.getInquiryById(id);
      if (data) {
        setInquiry(data);
        
        // 如果有回覆，檢查邏輯
        const latestResponse = data.responses[0]; // 假設最新的在第一個
        if (latestResponse && latestResponse.rmName === currentRmName) {
            // 情境二：同一個人回來修改 -> 載入之前的資料
            setRateDetails(latestResponse.details.map(d => ({ ...d })));
        } else {
            // 情境一 (無回覆) 或 情境三 (不同人) -> 預載入詢價天期，欄位留空
            setRateDetails(data.tenors.map(t => ({ tenor: t, rate: '', note: '' })));
        }
      }
    }
  }, [id, currentRmName]); // 注意：當 RM 切換時也要重新計算

  if (!inquiry) return <div className="p-10">載入中...</div>;

  // 邏輯判斷變數
  const latestResponse = inquiry.responses[0]; // 取最新一筆
  const hasResponse = !!latestResponse;
  const isSameUser = hasResponse && latestResponse.rmName === currentRmName;

  // 處理表單變更
  const updateDetail = (index: number, field: keyof RateDetail, value: string) => {
    const newDetails = [...rateDetails];
    newDetails[index][field] = value;
    setRateDetails(newDetails);
  };
  const addRow = () => setRateDetails([...rateDetails, { tenor: '', rate: '', note: '' }]);

  // 送出儲存
  const handleSave = () => {
    mockService.submitResponse(inquiry.id, {
        rmName: currentRmName,
        details: rateDetails
    });
    alert('回覆已儲存！');
    // 重新載入資料
    const updated = mockService.getInquiryById(inquiry.id);
    if (updated) setInquiry({...updated});
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
        {/* 頂部身份模擬工具列 (Prototype Only) */}
        <div className="bg-emerald-900 text-white px-8 py-2 text-sm flex justify-between items-center">
            <span>正在檢視案件：{inquiry.id}</span>
            <div className="flex items-center gap-2">
                <span>模擬 RM 身份：</span>
                <select 
                    value={currentRmName} 
                    onChange={(e) => setCurrentRmName(e.target.value)}
                    className="bg-emerald-800 border border-emerald-600 rounded px-2 py-1 text-white"
                >
                    <option value="王大明">王大明 (原始)</option>
                    <option value="林小美">林小美 (代理人)</option>
                    <option value="陳經理">陳經理 (主管)</option>
                </select>
            </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 px-4">
            <button onClick={() => navigate('/bank/dashboard')} className="text-gray-500 hover:text-gray-700 mb-4">
                &larr; 返回案件列表
            </button>

            {/* 1. 案件基本資訊區 (唯讀) */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{inquiry.subject}</h1>
                        <p className="text-lg text-emerald-700 font-medium mt-1">{inquiry.companyName}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">詢價日期</div>
                        <div className="font-mono">{inquiry.createDate}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                        <div className="text-gray-500">幣別</div>
                        <div className="font-bold text-lg">{inquiry.currency}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">金額</div>
                        <div className="font-bold text-lg">{inquiry.amount.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">起息日</div>
                        <div>{inquiry.startDate}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">到期日</div>
                        <div>{inquiry.endDate}</div>
                    </div>
                    <div className="col-span-4">
                        <div className="text-gray-500">詢價用途</div>
                        <div>{inquiry.purpose}</div>
                    </div>
                </div>
            </div>

            {/* 2. 本行回覆區 (核心邏輯) */}
            <div className="bg-white rounded-lg shadow-lg border-t-4 border-emerald-600 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">本行回覆資訊</h2>
                
                {/* 提示文字 */}
                {hasResponse ? (
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-sm mb-4 border border-blue-200">
                        目前顯示為 <strong>{latestResponse.rmName}</strong> 於 {latestResponse.updatedAt} 填寫的最新回覆
                    </div>
                ) : (
                    <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm mb-4">
                        目前尚無回覆，請填寫報價資訊。
                    </div>
                )}

                {/* 情境三：不同人 -> 顯示唯讀的最新回覆 */}
                {hasResponse && !isSameUser && (
                    <div className="mb-8 opacity-75 pointer-events-none bg-gray-50 p-4 rounded border border-dashed border-gray-300">
                        <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">唯讀參考：前次同事回覆</div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b">
                                    <th className="text-left pb-2">天期</th>
                                    <th className="text-left pb-2">利率</th>
                                    <th className="text-left pb-2">備註</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestResponse.details.map((d, i) => (
                                    <tr key={i}>
                                        <td className="py-2">{d.tenor}</td>
                                        <td className="py-2 font-bold">{d.rate}</td>
                                        <td className="py-2">{d.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 編輯/新增區塊 */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-3">
                        {hasResponse && !isSameUser ? '您要新增的回覆：' : '編輯回覆內容：'}
                    </h3>
                    
                    <div className="space-y-3">
                        {rateDetails.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-1/4">
                                    <input 
                                        type="text" 
                                        value={item.tenor} 
                                        onChange={(e) => updateDetail(idx, 'tenor', e.target.value)}
                                        placeholder="天期" 
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>
                                <div className="w-1/4">
                                    <input 
                                        type="text" 
                                        value={item.rate} 
                                        onChange={(e) => updateDetail(idx, 'rate', e.target.value)}
                                        placeholder="利率 %" 
                                        className="w-full border rounded p-2 text-sm font-bold text-emerald-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        value={item.note || ''} 
                                        onChange={(e) => updateDetail(idx, 'note', e.target.value)}
                                        placeholder="備註 (選填)" 
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addRow} className="text-sm text-emerald-600 hover:underline mt-2">+ 新增一列</button>
                    
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="bg-emerald-600 text-white px-8 py-2 rounded shadow hover:bg-emerald-700 transition font-medium"
                        >
                            儲存回覆
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. 歷史回覆紀錄區 (展開/收合) */}
            {inquiry.responses.length > 0 && (
                <details className="bg-white rounded-lg shadow-sm border p-4">
                    <summary className="cursor-pointer font-bold text-gray-700 hover:text-emerald-600">
                        檢視歷史回覆紀錄 ({inquiry.responses.length})
                    </summary>
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                        {inquiry.responses.map(resp => (
                            <div key={resp.id} className="text-sm">
                                <div className="flex gap-2 text-gray-500 mb-1">
                                    <span className="font-bold text-gray-700">{resp.rmName}</span>
                                    <span>於 {resp.updatedAt}</span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    {resp.details.map((d, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="w-16">{d.tenor}</span>
                                            <span className="font-bold">{d.rate}</span>
                                            <span className="text-gray-400">{d.note}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    </div>
  );
}