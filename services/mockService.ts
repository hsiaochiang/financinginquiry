import { Inquiry, InquiryStatus, Currency, BankContact, BankResponse } from '../types';

// 模擬的銀行名單
export const MOCK_BANKS: BankContact[] = [
  { id: 'b1', bankName: '玉山銀行', contactName: '王大明', email: 'wang@esun.com' },
  { id: 'b2', bankName: '中國信託', contactName: '李小美', email: 'lee@ctbc.com' },
  { id: 'b3', bankName: '國泰世華', contactName: '張志豪', email: 'chang@cathay.com' },
];

// 模擬的詢價案件資料庫 (存放在記憶體中，重新整理會重置)
let inquiries: Inquiry[] = [
  {
    id: 'INQ-20231025-001',
    subject: 'Q4 營運週轉金詢價',
    companyName: '台積電股份有限公司',
    createDate: '2023-10-25',
    currency: Currency.USD,
    amount: 5000000,
    tenors: ['30天', '60天', '90天'],
    startDate: '2023-11-01',
    endDate: '2024-02-01',
    purpose: '支付供應商貨款',
    status: InquiryStatus.OPEN,
    invitedBanks: 3,
    responses: [
      {
        id: 'resp-1',
        bankName: '玉山銀行',
        rmName: '王大明',
        updatedAt: '2023-10-25 14:30',
        source: 'Email',
        details: [
          { tenor: '30天', rate: '5.20%', note: '額度內' },
          { tenor: '60天', rate: '5.25%', note: '' }
        ]
      }
    ]
  },
  {
    id: 'INQ-20231020-002',
    subject: '設備採購融資',
    companyName: '鴻海精密工業',
    createDate: '2023-10-20',
    currency: Currency.TWD,
    amount: 100000000,
    tenors: ['180天'],
    startDate: '2023-10-25',
    endDate: '2024-04-25',
    purpose: '購買新竹廠區設備',
    status: InquiryStatus.CLOSED,
    invitedBanks: 5,
    responses: []
  }
];

// 模擬 API 服務
export const mockService = {
  getInquiries: () => [...inquiries],
  
  getInquiryById: (id: string) => inquiries.find(i => i.id === id),
  
  createInquiry: (data: Partial<Inquiry>) => {
    // API: 實際串接時會呼叫 POST /api/inquiries
    const newInquiry: Inquiry = {
      id: `INQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
      subject: data.subject || '未命名案件',
      companyName: '本機企業 (模擬)',
      createDate: new Date().toISOString().slice(0, 10),
      currency: data.currency || Currency.TWD,
      amount: data.amount || 0,
      tenors: data.tenors || [],
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      purpose: data.purpose || '',
      note: data.note || '',
      status: InquiryStatus.OPEN,
      invitedBanks: 3, // 假裝選了3家
      responses: []
    };
    inquiries = [newInquiry, ...inquiries];
    return newInquiry;
  },

  // 銀行端：新增或更新回覆
  submitResponse: (inquiryId: string, response: Omit<BankResponse, 'id' | 'updatedAt' | 'bankName' | 'source'>) => {
    // API: 實際串接時會呼叫 POST /api/inquiries/:id/responses
    const inquiryIndex = inquiries.findIndex(i => i.id === inquiryId);
    if (inquiryIndex === -1) return null;

    const now = new Date();
    const timeString = `${now.getFullYear()}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newResponse: BankResponse = {
      id: `resp-${Date.now()}`,
      bankName: '本行', // 模擬當前銀行
      rmName: response.rmName,
      updatedAt: timeString,
      source: 'Email',
      details: response.details
    };

    // 簡單模擬：直接將新回覆加到陣列最前面 (代表最新)
    // 實際後端可能會更新既有紀錄或新增紀錄
    inquiries[inquiryIndex].responses = [newResponse, ...inquiries[inquiryIndex].responses];
    return inquiries[inquiryIndex];
  }
};