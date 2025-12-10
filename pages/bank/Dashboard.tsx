import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ===================== Mock Icons (Replicated for Consistency) =====================
const Icons = {
  Search: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Calendar: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Filter: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Inbox: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  User: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  AlertCircle: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  CheckCircle2: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  ChevronRight: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
};

// ===================== UI Components (System Standard - Scaled Up) =====================
const Card = ({ children, className = "" }: any) => <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
const Button = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  };
  return <button className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
const Input = ({ className = "", ...props }: any) => (
  <input className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`} {...props} />
);
const Select = ({ className = "", children, ...props }: any) => (
  <select className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`} {...props}>{children}</select>
);
const Badge = ({ children, className = "" }: any) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
);

// ===================== Mock Data =====================
const mockRows = [
  {
    id: 1,
    corp: "永盛實業股份有限公司",
    subject: "2025/11/10 USD 1M 7天活存詢價",
    receivedAt: "2025/11/10 09:12",
    amount: "USD 1,000,000",
    status: "未指派",
    owner: "-",
    dueAt: "2025/11/11 12:00",
    updatedAt: "2025/11/10 09:12",
  },
  {
    id: 2,
    corp: "宏泰國際開發",
    subject: "2025/11/10 TWD 3億 30天定存詢價",
    receivedAt: "2025/11/10 09:05",
    amount: "TWD 300,000,000",
    status: "處理中",
    owner: "王小明",
    dueAt: "2025/11/10 15:00",
    updatedAt: "2025/11/10 10:02",
  },
  {
    id: 3,
    corp: "祥安投資控股",
    subject: "2025/11/09 USD 2M 14天 MM 詢價",
    receivedAt: "2025/11/09 16:20",
    amount: "USD 2,000,000",
    status: "待審核",
    owner: "林郁庭",
    dueAt: "2025/11/10 11:00",
    updatedAt: "2025/11/09 17:05",
  },
  {
    id: 4,
    corp: "大誠電子",
    subject: "2025/11/08 TWD 5億 7天活存詢價",
    receivedAt: "2025/11/08 10:30",
    amount: "TWD 500,000,000",
    status: "已回覆",
    owner: "陳怡君",
    dueAt: "2025/11/08 16:00",
    updatedAt: "2025/11/08 15:30",
  },
  {
    id: 5,
    corp: "鼎豐實業",
    subject: "2025/11/07 USD 500K 7天定存詢價",
    receivedAt: "2025/11/07 09:15",
    amount: "USD 500,000",
    status: "已逾期",
    owner: "王小明",
    dueAt: "2025/11/07 14:00",
    updatedAt: "2025/11/07 18:20",
  },
];

export default function BankDashboard() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  const kpiData = [
    { label: "今日新進詢價", value: "8", sub: "包含 2 筆大額 USD", icon: Icons.Inbox, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "未指派案件", value: "3", sub: "建議立即分派", icon: Icons.User, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "即將逾期 / 已逾期", value: "1 / 2", sub: "需優先處理", icon: Icons.AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "本週已完成回覆", value: "24", sub: "平均回覆 3.2hr", icon: Icons.CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Unified Sticky Header */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 py-5 shadow-sm flex justify-between items-center">
        <div>
           <div className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">BR</div>
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-0.5">銀行端詢價管理平台</div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800">詢價案件列表</h1>
                </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200">
                <div className="size-8 bg-slate-300 rounded-full flex items-center justify-center text-xs text-slate-600 font-bold">RM</div>
                <div className="text-sm">
                    <span className="font-medium text-slate-700">王小明</span>
                    <span className="text-slate-400 mx-2">|</span>
                    <span className="text-slate-500">企業金融一部</span>
                </div>
            </div>
            <Button variant="outline" className="rounded-full px-4 text-sm">操作說明</Button>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpiData.map((kpi, idx) => (
                <Card key={idx} className="relative overflow-hidden p-6 flex flex-col justify-between group hover:shadow-md transition-shadow h-40">
                    <div className="relative z-10">
                        <div className="text-sm text-slate-500 font-medium">{kpi.label}</div>
                        <div className="text-4xl font-bold text-slate-900 mt-3">{kpi.value}</div>
                        <div className="text-sm text-slate-400 mt-2">{kpi.sub}</div>
                    </div>
                    {/* Watermark Icon */}
                    <div className={`absolute -right-2 -bottom-4 size-32 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform ${kpi.color}`}>
                        <kpi.icon className="w-full h-full" />
                    </div>
                    <div className={`absolute top-6 right-6 p-2 rounded-full ${kpi.bg} ${kpi.color}`}>
                         <kpi.icon className="size-6" />
                    </div>
                </Card>
            ))}
        </section>

        {/* Filter Section */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">企業名稱搜尋</label>
                        <div className="relative">
                            <Icons.Search className="absolute left-3 top-3.5 size-5 text-slate-400" />
                            <Input placeholder="輸入企業名稱或統編" className="pl-10" value={filterText} onChange={(e:any) => setFilterText(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">詢價日期區間</label>
                        <div className="relative">
                             <Icons.Calendar className="absolute left-3 top-3.5 size-5 text-slate-400" />
                             <Input placeholder="選擇日期" className="pl-10" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">案件狀態</label>
                        <Select>
                            <option>全部狀態</option>
                            <option>未指派</option>
                            <option>處理中</option>
                            <option>待審核</option>
                            <option>已回覆</option>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">承辦人員</label>
                        <Select>
                            <option>全部 (包含我的)</option>
                            <option>王小明</option>
                            <option>林郁庭</option>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline">重置</Button>
                     <Button>
                        <Icons.Filter className="mr-2 size-5" /> 篩選
                     </Button>
                </div>
            </div>
        </section>

        {/* Table Section */}
        <Card className="overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">詢價案件列表</h2>
                    <p className="text-sm text-slate-500 mt-1">顯示最近 30 天內的詢價案件</p>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" className="h-9 text-sm">匯出 Excel</Button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-medium">企業名稱 / 詢價主旨</th>
                            <th className="px-6 py-4 font-medium">收件時間</th>
                            <th className="px-6 py-4 font-medium">金額條件</th>
                            <th className="px-6 py-4 font-medium">狀態</th>
                            <th className="px-6 py-4 font-medium">承辦人</th>
                            <th className="px-6 py-4 font-medium">截止/更新</th>
                            <th className="px-6 py-4 font-medium text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-base">
                        {mockRows.map((row) => {
                             let statusColor = "bg-slate-100 text-slate-700";
                             if (row.status === "處理中") statusColor = "bg-blue-50 text-blue-700 border border-blue-100";
                             if (row.status === "待審核") statusColor = "bg-amber-50 text-amber-700 border border-amber-100";
                             if (row.status === "已回覆") statusColor = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                             if (row.status === "已逾期") statusColor = "bg-red-50 text-red-700 border border-red-100";

                             const isOverdue = row.status === "已逾期";

                             return (
                                <tr 
                                    key={row.id} 
                                    onClick={() => navigate(`/bank/inquiries/INQ-20231025-001`)}
                                    className={`group transition-all cursor-pointer hover:bg-blue-50/30 ${isOverdue ? 'bg-red-50/10' : 'bg-white'}`}
                                >
                                    <td className="px-6 py-5 max-w-[320px]">
                                        <div className="font-semibold text-slate-900 text-lg">{row.corp}</div>
                                        <div className="text-sm text-blue-600 truncate mt-1 group-hover:underline underline-offset-2">{row.subject}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-slate-600 text-sm">
                                        {row.receivedAt}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="font-medium text-slate-700 text-lg">{row.amount}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <Badge className={statusColor}>{row.status}</Badge>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-slate-700 text-sm">
                                        {row.owner}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                                        <div className={isOverdue ? "text-red-600 font-medium" : "text-slate-600"}>截: {row.dueAt}</div>
                                        <div className="text-slate-400 mt-1">更: {row.updatedAt}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                        <Icons.ChevronRight className="ml-auto size-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-between items-center">
                 <div className="text-sm text-slate-500">顯示 1 到 5 筆，共 5 筆資料</div>
                 <div className="flex gap-2">
                    <Button variant="outline" className="h-9 w-9 p-0 rounded-md">{'<'}</Button>
                    <Button variant="outline" className="h-9 w-9 p-0 rounded-md">{'>'}</Button>
                 </div>
            </div>
        </Card>
      </main>
    </div>
  );
}