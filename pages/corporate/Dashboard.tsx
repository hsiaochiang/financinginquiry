import React, { useMemo, useState } from "react";

// ===================== Mock Icons (Replaces lucide-react) =====================
const Icons = {
  Search: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Download: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  ChevronRight: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Mail: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Filter: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  BarChart3: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Table: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="3" y2="21"/></svg>,
  CheckCircle2: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  Clock3: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16.5 12"/></svg>,
  MailOpen: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>,
  ArrowUpDown: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>,
  ChevronDown: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
};

// ===================== Mock UI Components (Replaces shadcn/ui) =====================
const Card = ({ children, className = "" }: any) => <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }: any) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: any) => <h3 className={`font-semibold text-slate-900 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const Button = ({ children, variant = "default", size = "default", className = "", ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none";
  const variants: any = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 hover:bg-slate-100 text-slate-900",
    ghost: "hover:bg-slate-100 text-slate-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200"
  };
  const sizes: any = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    icon: "h-10 w-10"
  };
  return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = "", ...props }: any) => (
  <input className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:visible:outline-none focus:visible:ring-2 focus:visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const variants: any = {
    default: "border-transparent bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "text-slate-900"
  };
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${variants[variant]} ${className}`}>{children}</div>;
};

const Label = ({ children, htmlFor, className = "" }: any) => <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</label>;

const Switch = ({ checked, onCheckedChange, id }: any) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-slate-900' : 'bg-slate-200'}`}
  >
    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// Simple CSS Bar Chart to replace Recharts
const SimpleBarChart = ({ data }: { data: { name: string; rate: number }[] }) => {
    if (!data.length) return <div className="h-full flex items-center justify-center text-gray-400">無數據</div>;
    const maxRate = Math.max(...data.map(d => d.rate)) * 1.1; // Add some headroom
    return (
        <div className="h-full w-full flex items-end justify-around gap-2 px-4 pb-6 pt-4">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="relative w-full bg-slate-200 rounded-t-md hover:bg-blue-600 transition-colors" style={{ height: `${(d.rate / maxRate) * 100}%` }}>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {d.rate}%
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 font-medium truncate w-full text-center" title={d.name}>{d.name}</div>
                </div>
            ))}
        </div>
    );
};

// ===================== Mock Data & Types =====================
type Inquiry = {
  id: string;
  title: string;
  createdAt: string; // ISO
  sentAt: string; // ISO
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  template: string;
  owner: string;
  amount: number;
  currency: string;
  tenorDays: number;
  note?: string;
  rows: BankRow[];
};

type BankRow = {
  bank: string;
  sendStatus: "已寄出" | "未寄送";
  openStatus: "已開信" | "未開信";
  replyStatus: "已回覆" | "待回覆";
  rate?: number; // 利率
  repliedAt?: string; // ISO
  via?: "Email" | "電話";
  remark?: string;
  replyBody?: string; // for modal
};

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "inq-20251110-01",
    title: "2025/11/10 USD 1M 7天活存詢價",
    createdAt: "2025-11-10T09:10:00+08:00",
    sentAt: "2025-11-10T09:20:00+08:00",
    sentCount: 15,
    openedCount: 12,
    repliedCount: 8,
    template: "短期存款詢價模板 v2.1",
    owner: "Wilson",
    amount: 1_000_000,
    currency: "USD",
    tenorDays: 7,
    note: "重點關注流動性與隔夜利差。",
    rows: [
      { bank: "玉山銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.58, repliedAt: "2025-11-10T10:12:00+08:00", via: "Email", remark: "可議0.02bps", replyBody: "本行USD 7D活存可提供 3.58%，額度OK，需於當日15:30前回覆。" },
      { bank: "中國信託", sendStatus: "已寄出", openStatus: "未開信", replyStatus: "待回覆", remark: "追蹤下午致電" },
      { bank: "台新銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.62, repliedAt: "2025-11-10T10:30:00+08:00", via: "電話", remark: "電話報價", replyBody: "3.62%，名額有限，先到先得。" },
      { bank: "兆豐銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "待回覆" },
      { bank: "合作金庫", sendStatus: "已寄出", openStatus: "未開信", replyStatus: "待回覆" },
      { bank: "國泰世華", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.54, repliedAt: "2025-11-10T11:02:00+08:00", via: "Email", remark: "附上條件書PDF", replyBody: "本行報價 3.54%。附件為條件書。" },
    ],
  },
  {
    id: "inq-20251108-01",
    title: "2025/11/08 TWD 3億 14天定存詢價",
    createdAt: "2025-11-08T14:05:00+08:00",
    sentAt: "2025-11-08T14:20:00+08:00",
    sentCount: 20,
    openedCount: 18,
    repliedCount: 11,
    template: "定存詢價模板 v1.9",
    owner: "Wilson",
    amount: 300_000_000,
    currency: "TWD",
    tenorDays: 14,
    note: "需與上期續作比較。",
    rows: [
      { bank: "第一銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 2.03, repliedAt: "2025-11-08T15:01:00+08:00", via: "Email" },
      { bank: "華南銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 2.05, repliedAt: "2025-11-08T15:10:00+08:00", via: "Email" },
      { bank: "台新銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "待回覆" },
    ],
  },
  {
    id: "inq-20251106-01",
    title: "2025/11/06 USD 0.5M O/N 詢價",
    createdAt: "2025-11-06T10:00:00+08:00",
    sentAt: "2025-11-06T10:08:00+08:00",
    sentCount: 10,
    openedCount: 10,
    repliedCount: 7,
    template: "短期存款詢價模板 v2.1",
    owner: "Wilson",
    amount: 500_000,
    currency: "USD",
    tenorDays: 1,
    rows: [
      { bank: "玉山銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.45, repliedAt: "2025-11-06T10:20:00+08:00", via: "Email" },
      { bank: "兆豐銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.49, repliedAt: "2025-11-06T10:25:00+08:00", via: "Email" },
    ],
  },
  {
    id: "inq-20251104-01",
    title: "2025/11/04 USD 2M 30D 詢價",
    createdAt: "2025-11-04T11:40:00+08:00",
    sentAt: "2025-11-04T11:50:00+08:00",
    sentCount: 12,
    openedCount: 9,
    repliedCount: 5,
    template: "定存詢價模板 v1.9",
    owner: "Wilson",
    amount: 2_000_000,
    currency: "USD",
    tenorDays: 30,
    rows: [
      { bank: "國泰世華", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 3.25, repliedAt: "2025-11-04T12:20:00+08:00", via: "Email" },
    ],
  },
  {
    id: "inq-20251031-01",
    title: "2025/10/31 TWD 1億 7D 詢價",
    createdAt: "2025-10-31T09:30:00+08:00",
    sentAt: "2025-10-31T09:45:00+08:00",
    sentCount: 18,
    openedCount: 17,
    repliedCount: 9,
    template: "定存詢價模板 v1.8",
    owner: "Wilson",
    amount: 100_000_000,
    currency: "TWD",
    tenorDays: 7,
    rows: [
      { bank: "華南銀行", sendStatus: "已寄出", openStatus: "已開信", replyStatus: "已回覆", rate: 2.02, repliedAt: "2025-10-31T10:05:00+08:00", via: "Email" },
    ],
  },
];

// ===================== Helpers =====================
const fmtDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");
const comma = (n: number) => n.toLocaleString();

function statusIcon(label: string) {
  switch (label) {
    case "已回覆":
      return <Icons.CheckCircle2 className="inline-block size-4 text-emerald-600" aria-hidden />;
    case "待回覆":
      return <Icons.Clock3 className="inline-block size-4 text-amber-500" aria-hidden />;
    case "已開信":
      return <Icons.MailOpen className="inline-block size-4 text-blue-500" aria-hidden />;
    default:
      return <Icons.Mail className="inline-block size-4 text-slate-400" aria-hidden />;
  }
}

// ===================== Main Component =====================
export default function CorporateDashboard() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "completion">("createdAt");
  const [showOnlyUnreplied, setShowOnlyUnreplied] = useState(false);
  const [showOnlyTopRate, setShowOnlyTopRate] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [selectedId, setSelectedId] = useState<string>(MOCK_INQUIRIES[0].id);
  const [limit, setLimit] = useState(5);
  
  // Modal State
  const [activeModalRow, setActiveModalRow] = useState<BankRow | null>(null);

  // 導航與建立新詢價
  const handleNewInquiry = () => {
    window.location.hash = "/corporate/create";
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = MOCK_INQUIRIES.filter((i) =>
      [i.title, i.currency, new Date(i.createdAt).toLocaleDateString()].some((t) =>
        (t || "").toLowerCase().includes(q)
      )
    );

    const scored = base.map((i) => ({
      inquiry: i,
      completion: i.sentCount ? i.repliedCount / i.sentCount : 0,
    }));

    scored.sort((a, b) => {
      if (sortBy === "createdAt")
        return new Date(b.inquiry.createdAt).getTime() - new Date(a.inquiry.createdAt).getTime();
      return b.completion - a.completion;
    });

    return scored.slice(0, limit).map((x) => x.inquiry);
  }, [query, sortBy, limit]);

  const selected = filtered.find((i) => i.id === selectedId) || filtered[0] || MOCK_INQUIRIES[0];

  const rowsForView = useMemo(() => {
    if (!selected) return [] as BankRow[];
    let rows = [...selected.rows];
    if (showOnlyUnreplied) rows = rows.filter((r) => r.replyStatus === "待回覆");

    if (showOnlyTopRate) {
      const max = rows.reduce((m, r) => (r.rate && r.rate > m ? r.rate : m), -Infinity);
      if (isFinite(max)) rows = rows.filter((r) => r.rate === max);
    }
    return rows;
  }, [selected, showOnlyUnreplied, showOnlyTopRate]);

  const rateData = useMemo(
    () => rowsForView.filter((r) => typeof r.rate === "number").map((r) => ({ name: r.bank, rate: r.rate || 0 })),
    [rowsForView]
  );

  const stats = useMemo(() => {
    const total = selected?.rows.length || 0;
    const opened = selected?.rows.filter((r) => r.openStatus === "已開信").length || 0;
    const replied = selected?.rows.filter((r) => r.replyStatus === "已回覆").length || 0;
    const rates = selected?.rows.map((r) => r.rate).filter((x): x is number => typeof x === "number") || [];
    const max = rates.length ? Math.max(...rates) : undefined;
    const min = rates.length ? Math.min(...rates) : undefined;
    
    return { total, opened, replied, max, min };
  }, [selected]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 flex items-center gap-2">
            🏢 多銀行詢價通知與回覆管理 Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">以「詢價」為中心，查詢、追蹤回覆與整理報價。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block relative">
             <select 
                className="appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-slate-500 text-sm"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
             >
                <option value="createdAt">依建立時間排序</option>
                <option value="completion">依回覆完成度排序</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <Icons.ArrowUpDown className="h-4 w-4" />
             </div>
          </div>
          <Button className="rounded-2xl shadow-sm" variant="default" onClick={handleNewInquiry}>
            <Icons.Plus className="mr-2 size-4" />新建詢價
          </Button>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-12 gap-4 p-4 max-w-[1600px] mx-auto">
        {/* Left: Inquiry list (25%) */}
        <div className="col-span-12 md:col-span-3">
          <Card className="shadow-sm h-[calc(100vh-140px)] flex flex-col">
            <CardHeader className="pb-2 flex-none">
              <CardTitle className="text-base">詢價清單</CardTitle>
              <div className="relative mt-2">
                <Icons.Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="搜尋主旨 / 日期 / 幣別"
                  value={query}
                  onChange={(e: any) => setQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-2 flex-1 overflow-y-auto">
              {filtered.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelectedId(i.id)}
                  className={`w-full text-left border rounded-xl p-3 transition-all duration-200 hover:shadow-md ${
                    selectedId === i.id ? "border-slate-800 bg-slate-50 ring-1 ring-slate-800" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-slate-800 line-clamp-1 text-sm">{i.title}</div>
                    <Icons.ChevronRight className="size-4 shrink-0 text-slate-400" />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {fmtDateTime(i.createdAt).split(' ')[0]}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                    <Badge variant="secondary" className="text-[10px] px-1.5 bg-slate-100">已寄 {i.sentCount}</Badge>
                    <Badge variant="secondary" className="text-[10px] px-1.5 bg-slate-100">已開 {i.openedCount}</Badge>
                    <Badge variant={i.repliedCount > 0 ? "default" : "secondary"} className={`text-[10px] px-1.5 ${i.repliedCount > 0 ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
                        已回 {i.repliedCount}
                    </Badge>
                  </div>
                </button>
              ))}

              {/* Load more */}
              {limit < MOCK_INQUIRIES.length && (
                <Button variant="outline" className="w-full mt-1 border-dashed" onClick={() => setLimit((x) => x + 5)}>
                  載入更多
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Detail (75%) */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-y-auto pr-1">
          {/* (1) 概要 */}
          <Card className="shadow-sm flex-none">
            <CardHeader className="pb-2 py-4">
              <CardTitle className="text-base flex items-center gap-2">
                 <span>詢價概要</span>
                 <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{selected?.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Field label="主旨" value={selected?.title} className="col-span-2 md:col-span-1" />
                <Field label="金額" value={`${selected?.currency} ${comma(selected?.amount || 0)}`} />
                <Field label="幣別" value={selected?.currency} />
                <Field label="天期" value={`${selected?.tenorDays} 天`} />
              </div>
            </CardContent>
          </Card>

          {/* (3) 統計摘要區 - Moved Here */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
            <StatCard label="總寄送數" value={String(stats.total)} />
            <StatCard label="已開信數" value={String(stats.opened)} />
            <StatCard label="已回覆數" value={String(stats.replied)} highlight />
            <StatCard label="最高利率" value={stats.max?.toFixed(2) ?? "—"} suffix="%" />
            <StatCard label="最低利率" value={stats.min?.toFixed(2) ?? "—"} suffix="%" />
          </div>

          {/* (2) 銀行寄送與回覆狀態表 */}
          <Card className="shadow-sm flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between flex-wrap gap-2 py-4">
              <CardTitle className="text-base">銀行寄送與回覆狀態</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-white">
                  <Icons.Filter className="size-4 text-slate-500" />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="f1" className="text-xs whitespace-nowrap cursor-pointer">僅未回覆</Label>
                    <Switch id="f1" checked={showOnlyUnreplied} onCheckedChange={setShowOnlyUnreplied} />
                  </div>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="f2" className="text-xs whitespace-nowrap cursor-pointer">僅最高利率</Label>
                    <Switch id="f2" checked={showOnlyTopRate} onCheckedChange={setShowOnlyTopRate} />
                  </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode("table")}
                        className={`flex items-center px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Icons.Table className="mr-1 size-3" />表格
                    </button>
                    <button 
                        onClick={() => setViewMode("chart")}
                        className={`flex items-center px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'chart' ? 'bg-white shadow text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Icons.BarChart3 className="mr-1 size-3" />圖表
                    </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {viewMode === "table" ? (
                <div className="rounded-xl border overflow-hidden flex-1 relative">
                  <div className="absolute inset-0 overflow-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 font-medium">銀行名稱</th>
                          <th className="px-4 py-3 font-medium">寄送狀態</th>
                          <th className="px-4 py-3 font-medium">開信狀態</th>
                          <th className="px-4 py-3 font-medium">回覆狀態</th>
                          <th className="px-4 py-3 font-medium text-right">利率(%)</th>
                          <th className="px-4 py-3 font-medium">回覆時間</th>
                          <th className="px-4 py-3 font-medium">方式</th>
                          <th className="px-4 py-3 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rowsForView.map((r, idx) => (
                          <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">{r.bank}</td>
                            <td className="px-4 py-3 text-slate-500">{r.sendStatus}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1.5 text-slate-600">
                                {statusIcon(r.openStatus)} {r.openStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1.5 text-slate-600">
                                {statusIcon(r.replyStatus)} {r.replyStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700">
                                {typeof r.rate === "number" ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{r.rate.toFixed(2)}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">{fmtDateTime(r.repliedAt)}</td>
                            <td className="px-4 py-3 text-slate-500 text-xs">{r.via || "—"}</td>
                            <td className="px-4 py-3">
                                {r.replyStatus === "已回覆" && (
                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setActiveModalRow(r)}>
                                        查看
                                    </Button>
                                )}
                            </td>
                          </tr>
                        ))}
                        {rowsForView.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-8 text-slate-400">無符合條件的資料</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <SimpleBarChart data={rateData} />
                </div>
              )}

              {/* 匯出報表 */}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="rounded-2xl text-xs h-8">
                  <Icons.Download className="mr-2 size-3" /> 匯出比較報表（Excel / PDF）
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Detail Modal Overlay */}
      {activeModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-lg">{activeModalRow.bank} 回覆詳細內容</h3>
                    <button onClick={() => setActiveModalRow(null)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <div className="text-xs text-slate-500 mb-1">利率報價</div>
                        <div className="text-3xl font-bold text-slate-800">{activeModalRow.rate}%</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {activeModalRow.replyBody || activeModalRow.remark || "（無詳細文字內容）"}
                    </div>
                    <div className="mt-4 text-xs text-slate-400 text-right">
                        回覆時間：{fmtDateTime(activeModalRow.repliedAt)} (透過 {activeModalRow.via})
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 flex justify-end">
                    <Button variant="default" onClick={() => setActiveModalRow(null)}>關閉</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, className = "" }: { label: string; value?: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-slate-50/50 p-3 ${className}`}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-medium text-slate-800">{value ?? "—"}</div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight, suffix }: { label: string; value: string; sub?: string, highlight?: boolean, suffix?: string }) {
  return (
    <Card className={`shadow-sm border-slate-200 ${highlight ? 'border-b-4 border-b-emerald-500' : ''}`}>
      <CardContent className="p-4 flex flex-col justify-center h-full">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-semibold mt-1 text-slate-800 flex items-baseline gap-1">
            {value}
            {suffix && <span className="text-sm font-normal text-slate-400">{suffix}</span>}
        </div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}