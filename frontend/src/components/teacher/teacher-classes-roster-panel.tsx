"use client"

import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { CalendarDays, Clock3, Plus } from "lucide-react"
import type { Class } from "@/lib/mock-data-types"
import { Button } from "@/components/ui/button"
import type { TeacherStudentRegistrationInput } from "@/lib/teacher-student-registry"
import {
  isValidRegisterNumber,
  sanitizeDigits,
  sanitizeMongolianName,
  sanitizeRegisterNumber,
  TeacherStudentRegistrationDialog,
  type TeacherStudentRegistrationFormState,
} from "@/components/teacher/teacher-student-registration-dialog"

export function TeacherClassesRosterPanel(props: {
  classData: Class
  date: string
  onAddStudent: (input: TeacherStudentRegistrationInput) => Promise<void>
  time: string
}) {
  const { classData, date, onAddStudent, time } = props
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nextStudentCode = useMemo(() => buildNextStudentCode(classData), [classData])
  const [form, setForm] = useState<TeacherStudentRegistrationFormState>(() => createDefaultForm(classData, nextStudentCode))

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) setForm(createDefaultForm(classData, nextStudentCode))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = sanitizeMongolianName(form.name)
    const normalizedRegister = sanitizeRegisterNumber(form.registerNumber)
    const normalizedPhone = sanitizeDigits(form.guardianPhone)
    if (normalizedName.length === 0 || !isValidRegisterNumber(normalizedRegister) || normalizedPhone.length === 0) return

    setIsSubmitting(true)
    try {
      await onAddStudent({
        birthDate: form.birthDate,
        classId: classData.id,
        classLabel: form.classLabel || classData.name,
        email: form.email,
        guardianPhone: normalizedPhone,
        name: normalizedName,
        registerNumber: normalizedRegister,
        school: form.school,
        studentCode: form.studentCode,
      })
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFillDemo = () => setForm({
    birthDate: "2008-03-18",
    classLabel: classData.name,
    email: `demo${nextStudentCode}@school.com`,
    guardianPhone: "99112233",
    name: "Тэнгис Оюунболд",
    registerNumber: "УК0695432",
    school: "141-р сургууль",
    studentCode: nextStudentCode,
  })

  return (
    <>
      <div className="h-[724px] w-[440px] rounded-[30px] bg-white/96 px-4 py-4 shadow-[0_24px_68px_rgba(170,190,225,0.2)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#5b5b73]">Сурагчдын бүртгэл</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#a1acc2]">
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />{date}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />Өнөөдөр - {time}</span>
            </div>
          </div>
          <Button className="h-8 rounded-full bg-[#e8eaee] px-3 text-xs font-semibold text-[#7f8796] shadow-none hover:bg-[#dde2e8]" onClick={() => handleOpenChange(true)} type="button">
            <Plus className="mr-1 h-3.5 w-3.5" />
            Бүртгэл
          </Button>
        </div>

        <p className="mt-4 text-sm text-[#707b92]">{classData.name} ангийн сурагчид бүртгэлтэй.</p>
        <div className="mt-4 h-[592px] space-y-2 overflow-y-auto pr-1">
          {classData.students.map((student) => (
            <div key={student.id} className="grid grid-cols-[38px_minmax(0,1fr)_10px] items-center gap-3 rounded-[18px] border border-[#edf2fb] bg-[#fbfdff] px-3 py-2.5">
              <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#e5e9f3] bg-white text-[10px] font-semibold text-[#8d97aa]">{getInitials(student.name)}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <p className="truncate text-[13px] font-semibold text-[#4f5467]">{student.name}</p>
                  <p className="text-[11px] text-[#8b96ad]">ID: {student.id}</p>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#a3adbf]">
                  <span>{classData.name}</span>
                  <span>{student.email}</span>
                </div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#d9deea]" />
            </div>
          ))}
        </div>
      </div>

      <TeacherStudentRegistrationDialog
        classData={classData}
        form={form}
        isOpen={open}
        isSubmitting={isSubmitting}
        nextStudentCode={nextStudentCode}
        onChange={setForm}
        onClose={() => setOpen(false)}
        onDemo={handleFillDemo}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("")
}

function buildNextStudentCode(classData: Class) {
  const maxNumericId = classData.students.reduce((maxValue, student) => {
    const digits = Number.parseInt(student.id.replace(/\D/g, ""), 10)
    return Number.isFinite(digits) ? Math.max(maxValue, digits) : maxValue
  }, 20245000)
  return String(maxNumericId + 1)
}

function createDefaultForm(classData: Class, nextStudentCode: string): TeacherStudentRegistrationFormState {
  return { birthDate: "", classLabel: classData.name, email: "", guardianPhone: "", name: "", registerNumber: "", school: "141-р сургууль", studentCode: nextStudentCode }
}
