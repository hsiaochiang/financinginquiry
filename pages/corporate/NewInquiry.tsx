import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Currency, Inquiry } from '../../types';
import { mockService, MOCK_BANKS } from '../../services/mockService';

export default function NewInquiry() {
  const navigate = useNavigate();
  
  // 表單狀態
  const [formData, setFormData] = useState({
    subject: '',
    currency: Currency.TWD,
    amount: '',
    startDate: '',
    endDate: '',
    purpose: '',
    note: '',
    emailBody: `親愛的銀行合作夥伴 您好：\n\n本公司近期有營運週轉需求，擬進行詢價，相關條件如下，煩請惠予報價。\n\n謝謝。`
  });

  const [tenors, setTenors] = useState<{val: string; note: string}[]>([{ val: '30天', note: '' }]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

  // 處理基本欄位變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 處理天期動態新增
  const addTenor = () => {
    setTenors([...tenors, { val: '', note: '' }]);
  };
  
  const updateTenor = (index: number, field: 'val' | 'note', value: string) => {
    const newTenors = [...tenors];
    newTenors[index][field] = value;
    setTenors(newTenors);
  };

  // 處理送出
  const handleSubmit = () => {
    if (!formData.subject || !formData.amount) {
      alert("請填寫必填欄位");
      return;
    }

    // 呼叫 Mock API 建立案件
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

    // API: 此處應呼叫寄送 Email API
    // await api.sendEmails({ inquiryId: newInquiry.id, banks: selectedBanks, body: formData.emailBody });
    console.log("寄送 Email API 呼叫模擬: ", selectedBanks);

    // 導向 A3 並選中該案件
    navigate(`/corporate/inquiries?id=${newInquiry.id}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full bg-white my-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">新建詢價案件</h1>

      <div className="space-y-6">
        {/* 1. 基本條件 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">1. 詢價基本條件</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">詢價主旨 <span className="text-red-500">*</span></label>
              <input 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                type="text" 
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="例如：2023 Q4 營運週轉金" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">幣別</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border rounded p-2 bg-white">
                <option value="TWD">TWD 新台幣</option>
                <option value="USD">USD 美金</option>
                <option value="EUR">EUR 歐元</option>
                <option value="JPY">JPY 日圓</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">金額 <span className="text-red-500">*</span></label>
              <input 
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                type="number" 
                className="w-full border rounded p-2" 
                placeholder="請輸入數字" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">預計起息日</label>
              <input name="startDate" value={formData.startDate} onChange={handleChange} type="date" className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">預計到期日</label>
              <input name="endDate" value={formData.endDate} onChange={handleChange} type="date" className="w-full border rounded p-2" />
            </div>
            
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-600 mb-1">天期需求 (可多筆)</label>
               {tenors.map((t, idx) => (
                 <div key={idx} className="flex gap-2 mb-2">
                   <input 
                    type="text" 
                    placeholder="天期 (例如 30天)" 
                    value={t.val} 
                    onChange={(e) => updateTenor(idx, 'val', e.target.value)}
                    className="w-1/3 border rounded p-2" 
                   />
                   <input 
                    type="text" 
                    placeholder="備註 (選填)" 
                    value={t.note}
                    onChange={(e) => updateTenor(idx, 'note', e.target.value)}
                    className="flex-1 border rounded p-2" 
                   />
                 </div>
               ))}
               <button onClick={addTenor} className="text-sm text-blue-600 hover:underline">+ 新增天期</button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">詢價用途</label>
              <textarea name="purpose" value={formData.purpose} onChange={handleChange} rows={2} className="w-full border rounded p-2"></textarea>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">備註 (選填)</label>
              <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className="w-full border rounded p-2"></textarea>
            </div>
          </div>
        </section>

        {/* 2. 銀行名單 */}
        <section className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">2. 選擇發送銀行</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_BANKS.map(bank => (
                <label key={bank.id} className="flex items-center gap-3 p-2 bg-white border rounded cursor-pointer hover:bg-blue-50">
                  <input 
                    type="checkbox" 
                    checked={selectedBanks.includes(bank.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBanks([...selectedBanks, bank.id]);
                      else setSelectedBanks(selectedBanks.filter(id => id !== bank.id));
                    }}
                    className="w-4 h-4 text-blue-600" 
                  />
                  <div>
                    <div className="font-bold text-gray-700">{bank.bankName}</div>
                    <div className="text-xs text-gray-500">{bank.contactName} ({bank.email})</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 信件內容 */}
        <section className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Email 內容預覽</h3>
          <textarea 
            name="emailBody"
            value={formData.emailBody}
            onChange={handleChange}
            rows={6} 
            className="w-full border rounded p-3 text-sm font-mono bg-gray-50"
          ></textarea>
        </section>

        {/* 按鈕區 */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button 
            onClick={() => navigate('/corporate/dashboard')}
            className="px-6 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            送出並建立案件
          </button>
        </div>
      </div>
    </div>
  );
}