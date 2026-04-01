"use client"

import Image from "next/image"
import { CalendarDays, FolderOpen } from "lucide-react"
import type { Class } from "@/lib/mock-data-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OverviewMetricCard } from "@/components/teacher/teacher-classes-overview-cards"

export function TeacherClassesHeader(props: {
  classData: Class
  classOptions: Class[]
  currentDateLabel: string
  metrics: Array<{ delta: string; deltaClassName: string; deltaColor?: string; icon?: string; label: string; stroke: string; trend: number[]; value: string }>
  onClassChange: (value: string) => void
  onSemesterChange: (value: string) => void
  selectedSemester: string
  semesterOptions: string[]
}) {
  const { classData, classOptions, currentDateLabel, metrics, onClassChange, onSemesterChange, selectedSemester, semesterOptions } = props

  return (
    <section className="px-2 py-1">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-[67px] shrink-0">
              <Image alt="Classes illustration" className="object-contain" fill priority sizes="67px" src="/teacher-greeting-illustration.svg" />
            </div>
            <div className="min-w-0 space-y-3">
              <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66]">Ангиудын мэдээлэл</h1>
              <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99]">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.8} />{currentDateLabel}</span>
                <span>/</span>
                <span className="inline-flex items-center gap-1.5"><FolderOpen className="h-[15px] w-[15px]" strokeWidth={1.8} />Хичээлийн 12-р долоо хоног</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Select onValueChange={onClassChange} value={classData.id}>
              <SelectTrigger className="h-[38px] rounded-full border-0 bg-white/92 px-4 text-[#5f6f89] shadow-[0_14px_34px_rgba(170,190,225,0.16)]">
                <SelectValue placeholder="Ангиа сонгох" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((courseClass) => (
                  <SelectItem key={courseClass.id} value={courseClass.id}>{courseClass.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={onSemesterChange} value={selectedSemester}>
              <SelectTrigger className="h-[38px] rounded-full border-0 bg-white/92 px-4 text-[#5f6f89] shadow-[0_14px_34px_rgba(170,190,225,0.16)]">
                <SelectValue placeholder="Бүх улирал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх улирал</SelectItem>
                {semesterOptions.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:min-w-[510px]">
          {metrics.map((metric) => <OverviewMetricCard key={metric.label} metric={metric} />)}
        </div>
      </div>
    </section>
  )
}
