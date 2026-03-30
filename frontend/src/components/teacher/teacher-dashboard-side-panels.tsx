"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { classes, examResults } from "@/lib/mock-data"
import { saveDashboardAnnouncement } from "@/lib/dashboard-announcements"

export function TeacherDashboardSidePanels(props: { selectedClassId: string }) {
  const { selectedClassId } = props
  const [announcementClassId, setAnnouncementClassId] = useState("all")
  const [message, setMessage] = useState("")
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const chart = useMemo(() => buildChartModel(), [])
  const activeAnnouncementClassId = selectedClassId !== "all" ? selectedClassId : announcementClassId

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex h-[724px] w-[445px] max-w-[445px] flex-col gap-5">
      <section className="h-[382px] rounded-[32px] bg-[rgba(255,255,255,0.84)] px-6 pb-[15px] pt-6 shadow-[0_24px_48px_rgba(193,209,234,0.22)]">
        <h2 className="text-[20px] font-semibold leading-none text-[#515779]">Дүнгийн мэдээлэл</h2>
        <p className="mt-3 text-[16px] leading-none text-[#868db3]">Сурагчдын дундаж үнэлгээ.</p>
        <div className="mt-5 flex h-[272px] w-[400px] items-start justify-center rounded-[24px] border border-[rgba(234,239,248,0.92)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(251,253,255,0.92)_100%)] px-0 pb-0 pt-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_30px_rgba(211,224,245,0.14)]">
          <AnalyticsChart chart={chart} />
        </div>
      </section>

      <section className="relative h-[322px] rounded-[32px] border border-[#e6edf8] bg-white/80 px-5 pb-[50px] pt-5 shadow-[0_18px_40px_rgba(185,203,232,0.16)]">
        <h2 className="text-[20px] font-semibold leading-none text-[#4f5676]">Мэдэгдэл илгээх</h2>
        <div className="mt-3 flex items-center gap-3 text-[12px] text-[#8b92b0]">
          <span className="flex items-center gap-1.5"><Image src="/calendar-small.svg" alt="" width={14} height={14} />{currentTime.toLocaleDateString("sv-SE")}</span>
          <span className="flex items-center gap-1.5"><Image src="/clock-small.svg" alt="" width={14} height={14} />Өнөөдөр · {currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="relative mt-4">
          <Image src="/list-bullets-small.svg" alt="" width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <select value={activeAnnouncementClassId} onChange={(event) => setAnnouncementClassId(event.target.value)} className="h-10 w-full cursor-pointer appearance-none rounded-[12px] border border-[#e5eaf5] bg-white pl-10 pr-10 text-[14px] text-[#7c82a0] outline-none">
            <option value="all">Бүх анги</option>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <Image src="/downbutton-small.svg" alt="" width={16} height={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-[14px] font-medium text-[#666d8c]">Зар оруулах</p>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Мэдэгдлээ энд бичнэ үү." className="mt-2 h-[88px] w-full resize-none rounded-[12px] border border-[#cfe0ff] px-3 py-3 text-[14px] text-[#59607f] outline-none placeholder:text-[#a0a8bf]" />
        <div className="absolute bottom-[5px] right-5 flex justify-end">
          <button type="button" onClick={() => message.trim() && (saveDashboardAnnouncement({ classId: activeAnnouncementClassId, message }), setMessage(""))} className="h-9 cursor-pointer rounded-full bg-[#6a9cff] px-5 text-[14px] font-medium text-white transition hover:bg-[#5b8cff]">Илгээх</button>
        </div>
      </section>
    </div>
  )
}

function AnalyticsChart(props: { chart: ReturnType<typeof buildChartModel> }) {
  const { chart } = props
  return (
    <div className="relative h-[272px] w-[400px]">
      <svg viewBox="0 0 400 224" className="h-[224px] w-[400px]">
        {chart.axis.map((label, index) => <text key={label} x="18" y={22 + index * 27} fontSize="14" fill="#979fc0">{label}</text>)}
        {chart.badges.map((badge) => <g key={badge.id} transform={`translate(${badge.x},${badge.y})`}><rect width="68" height="28" rx="14" fill={badge.fill} /><circle cx="13" cy="14" r="3" fill={badge.dot} /><text x="23" y="19" fontSize="14" fill="#7e84b2" fontWeight="600">{badge.text}</text></g>)}
        {chart.series.map((item) => <path key={item.color} d={item.path} fill="none" stroke={item.color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${item.id})`} />)}
        <defs>{chart.series.map((item) => <filter key={item.id} id={`glow-${item.id}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>)}</defs>
      </svg>
      <div className="absolute bottom-[18px] left-[52px] right-[18px] grid text-[14px] text-[#8b92b0]" style={{ gridTemplateColumns: `repeat(${chart.labels.length}, minmax(0, 1fr))` }}>
        {chart.labels.map((label) => <span key={label} className="text-center leading-none">{label}</span>)}
      </div>
    </div>
  )
}

function buildChartModel() {
  const labels = classes.map((item) => localizeClassLabel(item.id))
  const colors = ["#ff6db0", "#53d8ea", "#ffb390", "#b287ff", "#82c6ff", "#ff9c6a"]
  const classMetrics = classes.map((item, index) => ({
    color: colors[index % colors.length],
    id: item.id,
    trend: getClassTrend(item.id),
    value: getClassAverage(item.id),
  }))
  const series = classMetrics.map((item) => ({ color: item.color, id: item.id, path: buildPath(item.trend) }))
  return {
    axis: [100, 90, 80, 70, 60, 50, 40, 30, 20],
    labels,
    series,
    badges: classMetrics.filter((item) => item.value > 0).slice(0, 3).map((item, index) => ({
      id: `b${index + 1}`,
      x: 148 + index * 76,
      y: 48 + (index % 2) * 54,
      fill: index === 0 ? "#fff7ef" : index === 1 ? "#eefaff" : "#fff1fb",
      dot: item.color,
      text: `${item.value.toFixed(2)}%`,
    })),
  }
}

function buildPath(values: number[]) {
  const left = 70
  const right = 376
  const bottom = 178
  const height = 142
  const step = values.length > 1 ? (right - left) / (values.length - 1) : 0
  return values.map((value, index) => `${index === 0 ? "M" : "L"} ${left + index * step} ${bottom - ((value - 20) / 80) * height}`).join(" ")
}

function getClassAverage(classId: string) {
  const current = examResults.filter((item) => item.classId === classId)
  const score = current.reduce((sum, item) => sum + item.score, 0)
  const total = current.reduce((sum, item) => sum + item.totalPoints, 0)
  return total > 0 ? Math.round((score / total) * 100) : 0
}

function getClassTrend(classId: string) {
  const current = examResults
    .filter((item) => item.classId === classId)
    .sort((left, right) => left.submittedAt.localeCompare(right.submittedAt))

  if (current.length === 0) return [30, 32, 34, 36, 38]

  const values = current.map((item, index) => {
    const slice = current.slice(0, index + 1)
    const score = slice.reduce((sum, entry) => sum + entry.score, 0)
    const total = slice.reduce((sum, entry) => sum + entry.totalPoints, 0)
    return total > 0 ? Math.round((score / total) * 100) : 0
  })

  const padded = values.length >= 5 ? values.slice(-5) : [...Array.from({ length: 5 - values.length }, () => values[0] ?? 0), ...values]
  return padded.map((value, index) => clamp(value || 28 + index * 2, 26, 96))
}

function localizeClassLabel(value: string) {
  const map: Record<string, string> = { A: "а", B: "б", C: "в", D: "г", E: "д", F: "е", G: "ё" }
  return `${value.slice(0, -1)}${map[value.slice(-1).toUpperCase()] ?? value.slice(-1).toLowerCase()}`
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
