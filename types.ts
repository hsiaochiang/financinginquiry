// 定義系統共用的資料型態

export enum Currency {
  TWD = 'TWD',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY'
}

export enum InquiryStatus {
  OPEN = '進行中',
  CLOSED = '已結案'
}

export interface RateDetail {
  tenor: string; // 天期，如 "30天"
  rate: string;  // 利率，如 "1.5%"
  note?: string; // 備註
}

export interface BankResponse {
  id: string;
  bankName: string; // 銀行名稱 (企業端看)
  rmName: string;   // 填寫人姓名 (銀行端看)
  updatedAt: string;
  details: RateDetail[];
  source: 'Email' | 'Phone'; // 來源
}

export interface Inquiry {
  id: string;
  subject: string;
  companyName: string; // 企業名稱 (銀行端看)
  createDate: string;
  currency: Currency;
  amount: number;
  tenors: string[]; // 預設需求天期
  startDate: string;
  endDate: string;
  purpose: string;
  note?: string;
  status: InquiryStatus;
  invitedBanks: number; // 送信銀行家數
  responses: BankResponse[]; // 銀行回覆列表
}

export interface BankContact {
  id: string;
  bankName: string;
  contactName: string;
  email: string;
}