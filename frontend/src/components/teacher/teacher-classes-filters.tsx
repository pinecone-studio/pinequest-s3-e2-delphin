"use client"

import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Class } from "@/lib/mock-data-types"

type FilterSelectProps = {
  icon: string
  placeholder: string
  value: string | undefined
  width?: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  scrollable?: boolean
}

export function TeacherClassesFilters(props: {
  classData: Class
  classOptions: Class[]
  examOptions: Array<{ id: string; title: string }>
  selectedExamId: string | null
  selectedSemester: string
  semesterOptions: string[]
  onClassChange: (value: string) => void
  onExamChange: (value: string) => void
  onSemesterChange: (value: string) => void
}) {
  const { classData, classOptions, examOptions, onClassChange, onExamChange, onSemesterChange, selectedExamId, selectedSemester, semesterOptions } = props
  const showExamSelect = examOptions.length > 1
  const gridClassName = showExamSelect ? "w-[608px] grid-cols-[192px_192px_192px]" : "w-[400px] grid-cols-[192px_192px]"

  return (
    <div className={`grid gap-4 ${gridClassName}`}>
      <FilterSelect
        icon="/graduation-cap.svg"
        onChange={onClassChange}
        options={classOptions.map((courseClass) => ({ value: courseClass.id, label: courseClass.name }))}
        placeholder="Ангиа сонгох"
        value={classData.id}
      />
      <FilterSelect
        icon="/a-plus.svg"
        onChange={onSemesterChange}
        options={[{ value: "all", label: "Бүх улирал" }, ...semesterOptions.map((semester) => ({ value: semester, label: semester }))]}
        placeholder="Бүх улирал"
        value={selectedSemester}
      />
      {showExamSelect ? (
        <FilterSelect
          icon="/examsIcon.svg"
          onChange={onExamChange}
          options={examOptions.map((exam) => ({ value: exam.id, label: exam.title }))}
          placeholder="Шалгалт сонгох"
          scrollable
          value={selectedExamId ?? undefined}
        />
      ) : null}
    </div>
  )
}

function FilterSelect({ icon, onChange, options, placeholder, scrollable, value, width = "192px" }: FilterSelectProps) {
  return (
    <div className="relative h-[36px]" style={{ width }}>
      <Image src={icon} alt="" width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 shrink-0" />
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="h-[36px] rounded-full border-0 bg-white/92 pl-9 pr-4 text-[#5f6f89] shadow-[0_14px_34px_rgba(170,190,225,0.16)] dark:border dark:border-[rgba(224,225,226,0.06)] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#f9fafb] dark:shadow-none dark:backdrop-blur dark:hover:bg-[linear-gradient(156deg,rgba(8,14,46,0.82)_28%,rgba(30,36,63,0.56)_91%)]" style={{ width }}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={`${scrollable ? "max-h-[200px] overflow-y-auto" : ""} dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.92)_28%,rgba(26,31,55,0.88)_91%)] dark:text-[#e6eeff] dark:shadow-[0_24px_60px_rgba(2,6,23,0.48)]`}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="dark:focus:bg-white/10 dark:focus:text-white">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
