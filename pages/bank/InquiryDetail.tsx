import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '../../services/mockService';
import { Inquiry, RateDetail } from '../../types';

// ===================== Local UI Components (Replicated for Consistency) =====================
const Icons = {
  ArrowLeft: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Save: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Clock: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  User: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Info: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
};

const Card = ({ children, className = "" }: any) => <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
const Button = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  };
  return <button className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// Grid Input Style for Spreadsheet look (Scaled Up)
const GridInput = ({ className = "", ...props }: any) => (
  <input className={`flex h-11 w-full border border-transparent hover:border-slate-300 rounded bg-transparent px-3 py-2 text-base placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${className}`} {...props} />
);

export default function BankInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  
  // 模擬身份狀態
  const [currentRmName, setCurrentRmName] = useState(searchParams.get('rmName') || '王大明');

  const [rateDetails, setRateDetails] = useState<RateDetail[]>([{ tenor: '', rate: '', note: '' }]);

  useEffect(() => {
    if (id) {
      const data = mockService.getInquiryById(id);
      if (data) {
        setInquiry(data);
        const latestResponse = data.responses[0];
        if (latestResponse && latestResponse.rmName === currentRmName) {
            setRateDetails(latestResponse.details.map(d => ({ ...d })));
        } else {
            setRateDetails(data.tenors.map(t => ({ tenor: t, rate: '', note: '' })));
        }
      }
    }
  }, [id, currentRmName]);

  if (!inquiry) return <div className="p-10 text-slate-500 flex justify-center text-lg">載入案件資料中...</div>;

  const latestResponse = inquiry.responses[0];
  const hasResponse = !!latestResponse;
  const isSameUser = hasResponse && latestResponse.rmName === currentRmName;

  const updateDetail = (index: number, field: keyof RateDetail, value: string) => {
    const newDetails = [...rateDetails];
    newDetails[index][field] = value;
    setRateDetails(newDetails);
  };
  const addRow = () => setRateDetails([...rateDetails, { tenor: '', rate: '', note: '' }]);

  const handleSave = () => {
    mockService.submitResponse(inquiry.id, {
        rmName: currentRmName,
        details: rateDetails
    });
    alert('回覆已成功儲存！');
    const updated = mockService.getInquiryById(inquiry.id);
    if (updated) setInquiry({...updated});
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans text-slate-900">
        {/* Unified Sticky Header */}
        <div className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 py-5 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-5">
                <Button variant="secondary" onClick={() => navigate('/bank/dashboard')} className="px-4">
                    <Icons.ArrowLeft className="mr-2 size-5" /> 返回列表
                </Button>
                <div className="hidden md:block w-px h-8 bg-slate-200"></div>
                <div className="hidden md:flex flex-col">
                    <div className="text-sm font-semibold text-slate-500 mb-0.5">銀行端詢價管理平台 / 回覆詢價案件</div>
                    <span className="text-lg font-bold text-slate-800">{inquiry.subject}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                <div className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wide">Prototype: RM Identity</div>
                <select 
                    value={currentRmName} 
                    onChange={(e) => setCurrentRmName(e.target.value)}
                    className="bg-white border border-slate-200 rounded text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="王大明">王大明 (Me)</option>
                    <option value="林小美">林小美 (Colleague)</option>
                </select>
            </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Inquiry Info (1/3) */}
            <div className="md:col-span-1 space-y-8">
                <Card className="p-0 overflow-hidden">
                    <div className="bg-slate-50 border-b p-5">
                        <h2 className="font-semibold text-slate-800 text-lg">案件資訊</h2>
                    </div>
                    <div className="p-5 space-y-5 text-base">
                        <div>
                            <div className="text-slate-500 text-sm mb-1.5">企業名稱</div>
                            <div className="font-medium text-slate-900 text-lg">{inquiry.companyName}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                             <div>
                                <div className="text-slate-500 text-sm mb-1.5">幣別</div>
                                <div className="font-mono font-medium text-lg">{inquiry.currency}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-sm mb-1.5">金額</div>
                                <div className="font-mono font-medium text-lg">{inquiry.amount.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                             <div>
                                <div className="text-slate-500 text-sm mb-1.5">起息日</div>
                                <div>{inquiry.startDate}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-sm mb-1.5">到期日</div>
                                <div>{inquiry.endDate}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm mb-1.5">用途</div>
                            <div className="text-slate-700 leading-relaxed">{inquiry.purpose}</div>
                        </div>
                    </div>
                </Card>

                {/* History Timeline */}
                {inquiry.responses.length > 0 && (
                    <Card className="p-5">
                         <div className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
                            <Icons.Clock className="size-5 text-slate-400" />
                            歷史回覆紀錄
                         </div>
                         <div className="relative pl-5 border-l-2 border-slate-100 space-y-8">
                            {inquiry.responses.map(resp => (
                                <div key={resp.id} className="relative">
                                    <div className="absolute -left-[22px] top-1.5 size-3.5 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <div className="text-sm text-slate-500 mb-2 flex justify-between">
                                        <span>{resp.updatedAt}</span>
                                        <span className="font-medium text-slate-700">{resp.rmName}</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-sm border border-slate-100 space-y-1.5">
                                         {resp.details.map((d, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span>{d.tenor}</span>
                                                <span className="font-mono font-bold text-slate-700 text-base">{d.rate}</span>
                                            </div>
                                         ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </Card>
                )}
            </div>

            {/* Right Column: Response Form (2/3) */}
            <div className="md:col-span-2">
                <Card className="p-8 border-t-4 border-t-blue-600 shadow-md">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">本行報價回覆</h2>
                            <p className="text-base text-slate-500 mt-1">請填寫各天期利率與備註</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                            {hasResponse ? (isSameUser ? '編輯我的回覆' : '新增回覆') : '首次回覆'}
                        </div>
                    </div>

                    {/* Alert for Read-Only Context */}
                    {hasResponse && !isSameUser && (
                        <div className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-5 flex gap-4">
                            <Icons.Info className="size-6 text-slate-400 shrink-0 mt-0.5" />
                            <div className="text-base text-slate-600">
                                <span className="font-semibold text-slate-800 block mb-1">最新回覆資訊</span>
                                目前顯示為 <span className="font-medium text-slate-900">{latestResponse.rmName}</span> 於 {latestResponse.updatedAt} 填寫的內容。您正在以 <strong>{currentRmName}</strong> 身份建立新的回覆。
                            </div>
                        </div>
                    )}

                    {/* Edit Grid (Spreadsheet Style) */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-10 gap-0 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                            <div className="col-span-3 px-4 py-3 border-r border-slate-200">天期</div>
                            <div className="col-span-3 px-4 py-3 border-r border-slate-200">利率 (%)</div>
                            <div className="col-span-4 px-4 py-3">備註</div>
                        </div>
                        
                        {/* Rows */}
                        <div className="bg-slate-50/30 divide-y divide-slate-100">
                        {rateDetails.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-10 gap-0 items-center group hover:bg-white transition-colors">
                                <div className="col-span-3 px-1 py-1 border-r border-slate-100">
                                    <GridInput 
                                        value={item.tenor} 
                                        onChange={(e: any) => updateDetail(idx, 'tenor', e.target.value)}
                                        placeholder="如: 30天"
                                    />
                                </div>
                                <div className="col-span-3 px-1 py-1 border-r border-slate-100">
                                    <GridInput 
                                        value={item.rate} 
                                        onChange={(e: any) => updateDetail(idx, 'rate', e.target.value)}
                                        className="font-mono font-bold text-blue-700 text-lg"
                                        placeholder="-"
                                    />
                                </div>
                                <div className="col-span-4 px-1 py-1">
                                    <GridInput 
                                        value={item.note || ''} 
                                        onChange={(e: any) => updateDetail(idx, 'note', e.target.value)}
                                        placeholder="選填"
                                        className="text-slate-500"
                                    />
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button onClick={addRow} className="text-base text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded transition">
                            <Icons.Plus className="size-5" /> 新增一列
                        </button>
                        <Button onClick={handleSave} className="pl-4 pr-6 shadow-lg shadow-blue-200 text-base py-3">
                            <Icons.Save className="mr-2 size-5" /> 
                            {hasResponse && isSameUser ? '更新回覆' : '送出報價'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
}