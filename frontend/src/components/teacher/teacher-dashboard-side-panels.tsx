"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { useCurrentTime } from "@/hooks/use-current-time"
import { toast } from "@/hooks/use-toast"
import { classes, examResults } from "@/lib/mock-data"
import { saveDashboardAnnouncement } from "@/lib/dashboard-announcements"
import { formatIsoDate, formatTimeLabel } from "@/lib/teacher-dashboard-utils"
import { cn } from "@/lib/utils"

export function TeacherDashboardSidePanels(props: { selectedClassId: string }) {
  const { selectedClassId } = props
  const [announcementClassId, setAnnouncementClassId] = useState("all")
  const [message, setMessage] = useState("")
  const currentTime = useCurrentTime()
  const chart = useMemo(() => buildChartModel(), [])
  const activeAnnouncementClassId = selectedClassId !== "all" ? selectedClassId : announcementClassId

  const handleSendAnnouncement = () => {
    const trimmedMessage = message.trim()

    if (activeAnnouncementClassId === "all") {
      toast({
        title: "Анхааруулга",
        description: "Мэдэгдэл илгээхийн өмнө ангиа сонгоно уу.",
      })
      return
    }

    if (!trimmedMessage) {
      toast({
        title: "Анхааруулга",
        description: "Илгээх мэдэгдлийн агуулгаа оруулна уу.",
      })
      return
    }

    saveDashboardAnnouncement({ classId: activeAnnouncementClassId, message: trimmedMessage })
    setMessage("")

    const targetClass = classes.find((item) => item.id === activeAnnouncementClassId)

    toast({
      title: "Амжилттай",
      description: `${targetClass?.name ?? "Сонгосон анги"} руу мэдэгдэл амжилттай илгээгдлээ.`,
    })
  }

  return (
    <div className="flex min-w-0 w-full flex-col gap-5">
      <section className="rounded-[16px] border border-[#ededed] bg-[linear-gradient(238deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] p-5 shadow-[50px_38px_102px_rgba(120,118,148,0.14)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]">
        <h2 className="text-[20px] font-bold leading-none text-[#4c4c66] dark:text-[#e6f2ff]">Дүнгийн мэдээлэл</h2>
        <p className="mt-[6px] text-[16px] leading-none text-[#6f6c99] dark:text-[#c2c9d0]">Сурагчдын дундаж үнэлгээ.</p>
        <div className="mt-5 flex h-[273px] w-full items-center justify-center rounded-[12px] border border-[#ededed] bg-[linear-gradient(231deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] shadow-[50px_38px_102px_rgba(120,118,148,0.08)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(142deg,#060c29_28%,rgba(4,12,48,0.5)_91%)]">
          <AnalyticsChart chart={chart} />
        </div>
      </section>
      <section className="rounded-[16px] border border-[#ededed] bg-[linear-gradient(233deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] p-5 shadow-[50px_38px_102px_rgba(120,118,148,0.14)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]">
        <h2 className="text-[20px] font-bold leading-none text-[#4c4c66] dark:text-[#e6f2ff]">Мэдэгдэл илгээх</h2>
        <div className="mt-[7px] flex items-center gap-3 text-[12px] text-[#6f6c99] dark:text-[#c2c9d0]">
          <span className="flex items-center gap-1.5"><Image src="/calendar-small.svg" alt="" width={14} height={14} />{currentTime ? formatIsoDate(currentTime) : "----/--/--"}</span>
          <span className="flex items-center gap-1.5"><Image src="/clock-small.svg" alt="" width={14} height={14} />Өнөөдөр · {currentTime ? formatTimeLabel(currentTime) : "--:--"}</span>
        </div>
        <div className="relative mt-4">
          <Image src="/list-bullets-small.svg" alt="" width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <select value={activeAnnouncementClassId} onChange={(event) => setAnnouncementClassId(event.target.value)} className="h-9 w-full appearance-none rounded-[12px] border border-[#f0f3f5] bg-white px-[13px] pl-10 pr-10 text-[14px] text-[#6f6c99] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#c2c9d0]">
            <option value="all">Ангиа сонгох</option>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <Image src="/downbutton-small.svg" alt="" width={16} height={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-[14px] font-medium text-[#4c4c66] dark:text-[#e6f2ff]">Зар оруулах</p>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Улирлын шалгалт 7 хоногийн дараа авна." className="mt-2 h-[83px] w-full resize-none rounded-[12px] border border-[rgba(24,100,251,0.5)] bg-transparent px-3 py-[9px] text-[14px] text-[#4c4c66] outline-none placeholder:text-[#6f6c99] dark:border-[rgba(224,225,226,0.08)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#f9fafb] dark:placeholder:text-[#89939c]" />
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={handleSendAnnouncement} className={cn("h-9 rounded-[12px] bg-[#5b91fc] px-5 text-[14px] text-white transition hover:bg-[#4b83f5]", !message.trim() && "opacity-70")}>Илгээх</button>
        </div>
      </section>
    </div>
  )
}

function AnalyticsChart(props: { chart: ReturnType<typeof buildChartModel> }) {
  const { chart } = props
  return (
    <div className="relative h-[224px] w-full">
      <svg viewBox="0 0 400 224" className="h-[224px] w-full">
        {chart.axis.map((label, index) => <text key={label} x="4" y={14 + index * 25} fontSize="10" className="fill-[#6f6c99] dark:fill-[#89939c]">{label}</text>)}
        {chart.badges.map((badge) => <g key={badge.id} transform={`translate(${badge.x},${badge.y})`}><rect width="56" height="18.67" rx="9.33" fill="rgba(255,255,255,0.92)" /><circle cx="9.5" cy="9.33" r="2" fill={badge.dot} /><text x="14.5" y="12.2" fontSize="10" className="fill-[#6f6c99] dark:fill-[#6f7982]" fontWeight="500">{badge.text}</text></g>)}
        {chart.series.map((item) => <path key={item.color} d={item.path} fill="none" stroke={item.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${item.id})`} />)}
        <defs>{chart.series.map((item) => <filter key={item.id} id={`glow-${item.id}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>)}</defs>
      </svg>
      <div className="absolute bottom-0 left-[36px] right-[18px] grid text-[12px] text-[#6f6c99] dark:text-[#89939c]" style={{ gridTemplateColumns: `repeat(${chart.labels.length}, minmax(0, 1fr))` }}>
        {chart.labels.map((label) => <span key={label} className="text-center leading-none">{label}</span>)}
      </div>
    </div>
  )
}

function buildChartModel() {
  const labels = classes.map((item) => localizeClassLabel(item.id))
  const colors = ["#ff6db0", "#53d8ea", "#b287ff"]
  const classMetrics = classes.map((item, index) => ({ color: colors[index % colors.length], id: item.id, trend: getClassTrend(item.id), value: getClassAverage(item.id) }))
  return { axis: [100, 90, 80, 70, 60, 50, 40, 30, 20], labels, series: classMetrics.map((item) => ({ color: item.color, id: item.id, path: buildPath(item.trend) })), badges: classMetrics.filter((item) => item.value > 0).slice(0, 3).map((item, index) => ({ id: `b${index + 1}`, x: 131 + index * 36, y: 24 + index * 26, dot: item.color, text: `${item.value.toFixed(2)}%` })) }
}

const buildPath = (values: number[]) => values.map((value, index) => `${index === 0 ? "M" : "L"} ${37 + index * ((364 - 37) / Math.max(values.length - 1, 1))} ${164 - ((value - 20) / 80) * 112}`).join(" ")
const getClassAverage = (classId: string) => { const current = examResults.filter((item) => item.classId === classId); const score = current.reduce((sum, item) => sum + item.score, 0); const total = current.reduce((sum, item) => sum + item.totalPoints, 0); return total > 0 ? Math.round((score / total) * 100) : 0 }
const getClassTrend = (classId: string) => { const current = examResults.filter((item) => item.classId === classId).sort((left, right) => left.submittedAt.localeCompare(right.submittedAt)); if (current.length === 0) return [30, 32, 34, 36, 38]; const values = current.map((item, index) => { const slice = current.slice(0, index + 1); const score = slice.reduce((sum, entry) => sum + entry.score, 0); const total = slice.reduce((sum, entry) => sum + entry.totalPoints, 0); return total > 0 ? Math.round((score / total) * 100) : 0 }); return (values.length >= 5 ? values.slice(-5) : [...Array.from({ length: 5 - values.length }, () => values[0] ?? 0), ...values]).map((value, index) => Math.max(26, Math.min(value || 28 + index * 2, 96))) }
const localizeClassLabel = (value: string) => `${value.slice(0, -1)}${({ A: "а", B: "б", C: "в" } as Record<string, string>)[value.slice(-1).toUpperCase()] ?? value.slice(-1).toLowerCase()}`
