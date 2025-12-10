import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Currency } from '../../types';
import { mockService, MOCK_BANKS } from '../../services/mockService';

// ===================== Local UI Components (Replicated for Consistency) =====================
const Icons = {
  ChevronLeft: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Send: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  FileText: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Plus: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Trash2: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  Check: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Building: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  Save: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

const Card = ({ children, className = "" }: any) => <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
// Scaled up Buttons
const Button = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants: any = {
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    link: "text-blue-600 hover:underline px-0"
  };
  return <button className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
// Scaled up Inputs (h-11, text-base)
const Input = ({ className = "", ...props }: any) => (
  <input className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`} {...props} />
);
const Label = ({ children, required, className = "" }: any) => (
  <label className={`text-base font-medium text-slate-700 mb-2 block ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export default function NewInquiry() {
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState({
    subject: '',
    currency: Currency.TWD,
    amount: '',
    startDate: new Date().toISOString().slice(0,10),
    endDate: '',
    purpose: '',
    note: '',
    emailBody: `親愛的銀行合作夥伴 您好：\n\n本公司近期有營運週轉需求，擬進行詢價，相關條件如下，煩請惠予報價。\n\n謝謝。`
  });

  const [tenors, setTenors] = useState<{val: string; note: string}[]>([{ val: '30天', note: '' }]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTenor = () => setTenors([...tenors, { val: '', note: '' }]);
  const removeTenor = (idx: number) => setTenors(tenors.filter((_, i) => i !== idx));
  const updateTenor = (index: number, field: 'val' | 'note', value: string) => {
    const newTenors = [...tenors];
    newTenors[index][field] = value;
    setTenors(newTenors);
  };

  const toggleBank = (id: string) => {
    if (selectedBanks.includes(id)) setSelectedBanks(selectedBanks.filter(b => b !== id));
    else setSelectedBanks([...selectedBanks, id]);
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.amount) {
      alert("請填寫主旨與金額");
      return;
    }
    const newInquiry = mockService.createInquiry({
      subject: formData.subject,
      currency: formData.currency,
      amount: Number(formData.amount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      purpose: formData.purpose,
      note: formData.note,
      tenors: tenors.map(t => t.val),
    });
    navigate(`/corporate/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      {/* Unified Sticky Header - Cleaned up */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 py-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/corporate/dashboard')} className="px-3">
            <Icons.ChevronLeft className="size-6" />
          </Button>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">企業端本地詢價工具</div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">新建詢價案件</h1>
          </div>
        </div>
        {/* Right side empty for cleanliness, actions moved to bottom */}
        <div className="w-10"></div>
      </div>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
        
        {/* Left Column: Form (7/12) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
          
          {/* 1. 基本條件 */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base">1</div>
              <h2 className="text-xl font-semibold text-slate-800">詢價基本條件</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label required>詢價主旨</Label>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="例如：2025 Q4 營運週轉金詢價" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>幣別</Label>
                  <div className="relative">
                    <select name="currency" value={formData.currency} onChange={handleChange} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                      <option value="TWD">TWD 新台幣</option>
                      <option value="USD">USD 美金</option>
                      <option value="EUR">EUR 歐元</option>
                      <option value="JPY">JPY 日圓</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none">
                      <svg className="size-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <Label required>金額</Label>
                  <Input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="輸入金額" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <Label>預計起息日</Label>
                   <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                </div>
                <div>
                   <Label>預計到期日</Label>
                   <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>天期需求</Label>
                <div className="space-y-4">
                  {tenors.map((t, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Input 
                        placeholder="天期 (如: 30天)" 
                        value={t.val} 
                        onChange={(e: any) => updateTenor(idx, 'val', e.target.value)}
                        className="w-1/3"
                      />
                      <Input 
                        placeholder="備註 (選填)" 
                        value={t.note} 
                        onChange={(e: any) => updateTenor(idx, 'note', e.target.value)}
                        className="flex-1"
                      />
                      {tenors.length > 1 && (
                        <Button variant="ghost" onClick={() => removeTenor(idx)} className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Icons.Trash2 className="size-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="link" onClick={addTenor} className="pl-1 text-blue-600 text-base">
                    <Icons.Plus className="mr-2 size-5" /> 新增天期
                  </Button>
                </div>
              </div>

              <div>
                <Label>詢價用途</Label>
                <Input name="purpose" value={formData.purpose} onChange={handleChange} placeholder="例如：支付供應商貨款" />
              </div>
            </div>
          </Card>

          {/* 2. 銀行名單 - Optimized Cards */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base">2</div>
              <h2 className="text-xl font-semibold text-slate-800">選擇發送銀行</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_BANKS.map(bank => {
                const isSelected = selectedBanks.includes(bank.id);
                return (
                  <div 
                    key={bank.id}
                    onClick={() => toggleBank(bank.id)}
                    className={`cursor-pointer rounded-xl border p-5 transition-all duration-200 flex items-center justify-between group ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-full transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Icons.Building className="size-6" />
                       </div>
                       <div>
                          <div className={`font-semibold text-base ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{bank.bankName}</div>
                          <div className="text-sm text-slate-500 mt-0.5">{bank.contactName}</div>
                       </div>
                    </div>
                    {isSelected && <Icons.Check className="text-blue-600 size-6" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Bar (Footer of Form) */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-2">
             <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                <Icons.Save className="mr-2 size-5" />
                儲存草稿
             </Button>
             <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/corporate/dashboard')} className="px-6">取消</Button>
                <Button onClick={handleSubmit} className="px-8 shadow-lg shadow-blue-900/20">
                    <Icons.Send className="mr-2 size-5" /> 送出並建立
                </Button>
             </div>
          </div>

        </div>

        {/* Right Column: Preview (5/12) */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
           <Card className="p-0 h-full flex flex-col sticky top-28 overflow-hidden shadow-lg border-slate-300">
             <div className="p-5 border-b bg-slate-50">
                 <div className="flex items-center gap-3 mb-0">
                    <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-base">3</div>
                    <h2 className="text-xl font-semibold text-slate-800">信件預覽</h2>
                  </div>
             </div>

              <div className="flex-1 flex flex-col bg-white">
                 {/* Fake Email Header */}
                 <div className="bg-slate-50 px-6 py-5 border-b text-sm space-y-3">
                    <div className="flex items-baseline">
                        <span className="text-slate-500 w-20 text-base">寄件者：</span>
                        <span className="font-medium text-slate-800 text-base">財務部 &lt;finance@company.com&gt;</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-slate-500 w-20 text-base">收件者：</span>
                        <span className="text-slate-800 text-base">{selectedBanks.length > 0 ? `${selectedBanks.length} 家銀行聯絡人` : "(請選擇銀行)"}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-slate-500 w-20 text-base">主旨：</span>
                        <span className="font-medium text-slate-900 text-base">{formData.subject || "(無主旨)"}</span>
                    </div>
                 </div>

                 {/* Email Body Editor */}
                 <div className="flex-1 p-6 relative">
                    <textarea 
                      name="emailBody"
                      value={formData.emailBody}
                      onChange={handleChange}
                      className="w-full h-full min-h-[400px] border-0 focus:ring-0 resize-none text-slate-700 leading-relaxed p-0 placeholder:text-slate-300 text-base"
                      placeholder="在此輸入信件內容..."
                    ></textarea>
                 </div>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}