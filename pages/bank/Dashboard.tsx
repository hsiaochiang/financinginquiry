import React from "react";
import { useNavigate } from "react-router-dom";

// 初版銀行端「詢價案件 Dashboard」Mockup
// - 以 1440px 寬度桌機畫面為設計假設
// - 僅為視覺與版面 Mockup，不含實際 API 串接

const statusBadgeClasses: Record<string, string> = {
  "未指派": "bg-slate-100 text-slate-700",
  "處理中": "bg-blue-100 text-blue-700",
  "待審核": "bg-amber-100 text-amber-700",
  "已回覆": "bg-emerald-100 text-emerald-700",
  "已逾期": "bg-red-100 text-red-700",
};

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 頂部導覽列 */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
              BR
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-slate-800">
                多銀行詢價回覆管理
              </div>
              <div className="text-xs text-slate-500">Bank-side Inquiry Reply Management Console</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-100">
              操作說明
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                RM
              </div>
              <div>
                <div className="text-xs font-medium">王小明</div>
                <div className="text-[11px] text-slate-500">企業金融一部 · RM</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主體內容 */}
      <main className="mx-auto max-w-6xl px-6 py-5">
        {/* 頂部篩選列 */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">詢價案件篩選</h2>
            <button className="text-xs text-slate-500 hover:text-slate-700">重置篩選</button>
          </div>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-500">企業名稱</label>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <span className="text-[11px] text-slate-400">🔍</span>
                <input
                  className="h-5 w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
                  placeholder="輸入企業名稱或統編關鍵字"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-500">詢價日期區間</label>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <span className="text-[11px] text-slate-400">📅</span>
                <span className="text-[11px] text-slate-500">2025/11/07</span>
                <span className="px-1 text-[10px] text-slate-400">~</span>
                <span className="text-[11px] text-slate-500">2025/11/10</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-500">案件狀態</label>
              <select className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700">
                <option>全部狀態</option>
                <option>未指派</option>
                <option>處理中</option>
                <option>待審核</option>
                <option>已回覆</option>
                <option>已逾期</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-500">承辦人</label>
              <select className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700">
                <option>全部承辦人</option>
                <option>王小明</option>
                <option>林郁庭</option>
                <option>陳怡君</option>
              </select>
            </div>
          </div>
        </section>

        {/* KPI 指標卡片 */}
        <section className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            {
              label: "今日新進詢價",
              value: "8",
              sub: "包含 2 筆大額 USD 案件",
            },
            {
              label: "未指派案件",
              value: "3",
              sub: "建議立即分派 RM",
            },
            {
              label: "即將逾期 / 已逾期",
              value: "1 / 2",
              sub: "以紅色標示於列表上方",
            },
            {
              label: "本週已完成回覆",
              value: "24",
              sub: "平均回覆時間 3.2 小時",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="text-[11px] font-medium text-slate-500">{kpi.label}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <div className="text-xl font-semibold text-slate-900">{kpi.value}</div>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">{kpi.sub}</div>
            </div>
          ))}
        </section>

        {/* 主表格區塊 */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">詢價案件列表</h2>
              <p className="text-[11px] text-slate-500">
                依收件時間排序，紅色列為已逾期案件，灰色列為尚未指派。
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50">
                匯出 Excel
              </button>
              <button className="rounded-full border border-blue-500 bg-blue-500 px-3 py-1 text-[11px] font-medium text-white shadow-sm hover:bg-blue-600">
                前往審核清單
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-t border-slate-100 text-xs">
              <thead className="bg-slate-50/80">
                <tr className="text-[11px] text-slate-500">
                  <th className="px-4 py-2 text-left font-medium">企業名稱</th>
                  <th className="px-4 py-2 text-left font-medium">詢價主旨</th>
                  <th className="px-4 py-2 text-left font-medium">收件時間</th>
                  <th className="px-4 py-2 text-left font-medium">幣別／金額</th>
                  <th className="px-4 py-2 text-left font-medium">狀態</th>
                  <th className="px-4 py-2 text-left font-medium">承辦人</th>
                  <th className="px-4 py-2 text-left font-medium">回覆截止時間</th>
                  <th className="px-4 py-2 text-left font-medium">最後更新時間</th>
                </tr>
              </thead>
              <tbody>
                {mockRows.map((row) => {
                  const badgeClass = statusBadgeClasses[row.status] ??
                    "bg-slate-100 text-slate-700";

                  const rowHighlight =
                    row.status === "已逾期"
                      ? "bg-red-50/40"
                      : row.status === "未指派"
                      ? "bg-slate-50"
                      : "bg-white";

                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/bank/inquiries/INQ-20231025-001`)}
                      className={`${rowHighlight} border-t border-slate-100 hover:bg-blue-50/40 cursor-pointer transition-colors`}
                    >
                      <td className="px-4 py-2 align-top text-xs text-slate-800">
                        <div className="font-medium">{row.corp}</div>
                      </td>
                      <td className="px-4 py-2 align-top text-xs text-blue-700 underline-offset-2 hover:underline">
                        {row.subject}
                      </td>
                      <td className="px-4 py-2 align-top text-[11px] text-slate-600">
                        {row.receivedAt}
                      </td>
                      <td className="px-4 py-2 align-top text-xs text-slate-800">
                        {row.amount}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-top text-xs text-slate-700">
                        {row.owner}
                      </td>
                      <td className="px-4 py-2 align-top text-[11px] text-slate-600">
                        {row.dueAt}
                      </td>
                      <td className="px-4 py-2 align-top text-[11px] text-slate-600">
                        {row.updatedAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[11px] text-slate-500">
            <div>共 5 筆詢價案件 · 顯示第 1–5 筆</div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50">
                ◀
              </button>
              <span>1 / 3</span>
              <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50">
                ▶
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
