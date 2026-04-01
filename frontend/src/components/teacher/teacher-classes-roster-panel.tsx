"use client"

import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { CalendarDays, Clock3, Plus, X } from "lucide-react"
import type { Class } from "@/lib/mock-data-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TeacherStudentRegistrationInput } from "@/lib/teacher-student-registry"

export function TeacherClassesRosterPanel({
  classData,
  date,
  onAddStudent,
  time,
}: {
  classData: Class
  date: string
  onAddStudent: (input: TeacherStudentRegistrationInput) => Promise<void>
  time: string
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    birthDate: "",
    classLabel: classData.name,
    email: "",
    guardianPhone: "",
    name: "",
    registerNumber: "",
    school: "141-р сургууль",
    studentCode: buildNextStudentCode(classData),
  })

  const nextStudentCode = useMemo(() => buildNextStudentCode(classData), [classData])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setForm({
        birthDate: "",
        classLabel: classData.name,
        email: "",
        guardianPhone: "",
        name: "",
        registerNumber: "",
        school: "141-р сургууль",
        studentCode: nextStudentCode,
      })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedName = sanitizeMongolianName(form.name)
    const normalizedRegister = sanitizeRegisterNumber(form.registerNumber)
    const normalizedPhone = sanitizeDigits(form.guardianPhone)

    if (
      normalizedName.length === 0 ||
      !isValidRegisterNumber(normalizedRegister) ||
      normalizedPhone.length === 0
    ) {
      return
    }

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

  const handleFillDemo = () => {
    setForm({
      birthDate: "2008-03-18",
      classLabel: classData.name,
      email: `demo${nextStudentCode}@school.com`,
      guardianPhone: "99112233",
      name: "Тэнгис Оюунболд",
      registerNumber: "УК0695432",
      school: "141-р сургууль",
      studentCode: nextStudentCode,
    })
  }

  return (
    <>
      <div className="h-[724px] w-[440px] rounded-[30px] bg-white/96 px-4 py-4 shadow-[0_24px_68px_rgba(170,190,225,0.2)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#5b5b73]">
              Сурагчдын бүртгэл
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#a1acc2]">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                {date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
                Өнөөдөр - {time}
              </span>
            </div>
          </div>
          <Button
            className="h-8 rounded-full bg-[#e8eaee] px-3 text-xs font-semibold text-[#7f8796] shadow-none hover:bg-[#dde2e8]"
            onClick={() => handleOpenChange(true)}
            type="button"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Бүртгэл
          </Button>
        </div>

        <p className="mt-4 text-sm text-[#707b92]">{classData.name} ангийн сурагчид бүртгэлтэй.</p>
        <div className="mt-4 h-[592px] space-y-2 overflow-y-auto pr-1">
          {classData.students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-[38px_minmax(0,1fr)_10px] items-center gap-3 rounded-[18px] border border-[#edf2fb] bg-[#fbfdff] px-3 py-2.5"
            >
              <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#e5e9f3] bg-white text-[10px] font-semibold text-[#8d97aa]">
                {getInitials(student.name)}
              </div>
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

      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent
          className="w-[566px] max-w-[calc(100%-2rem)] rounded-[24px] border border-[#dfe6f2] bg-white p-0 shadow-[0_28px_90px_rgba(32,45,73,0.18)]"
          showCloseButton={false}
        >
          <form className="space-y-5 p-5" onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <DialogTitle className="text-[20px] font-semibold leading-none text-[#4a5672]">
                  Сурагчийн бүртгэл
                </DialogTitle>
                <DialogDescription className="text-[13px] leading-[18px] text-[#8892a7]">
                  "Сурагчийн дэлгэрэнгүй мэдээлэл оруулна уу"
                </DialogDescription>
              </div>
              <button
                aria-label="Хаах"
                className="rounded-full p-1 text-[#8e98ae] transition hover:bg-[#f3f6fb]"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field
                label="Овог/Нэр"
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: sanitizeMongolianName(value),
                  }))
                }
                placeholder="Тэнгис Оюунболд"
              />
              <Field
                label="Регистр"
                value={form.registerNumber}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    registerNumber: sanitizeRegisterNumber(value),
                  }))
                }
                placeholder="УК0695432"
              />
              <Field
                label="Төрсөн огноо"
                type="date"
                value={form.birthDate}
                onChange={(value) => setForm((current) => ({ ...current, birthDate: value }))}
              />
              <Field
                label="Сургууль"
                value={form.school}
                onChange={(value) => setForm((current) => ({ ...current, school: value }))}
                placeholder="141-р сургууль"
              />
              <Field
                label="Анги бүлэг"
                value={form.classLabel}
                onChange={(value) => setForm((current) => ({ ...current, classLabel: value }))}
                placeholder={classData.name}
              />
              <Field
                label="Сурагчийн код / ID"
                value={form.studentCode}
                onChange={(value) => setForm((current) => ({ ...current, studentCode: value }))}
                placeholder={nextStudentCode}
              />
              <Field
                label="Утас \\ Асран хамгаалагчийн утас"
                value={form.guardianPhone}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    guardianPhone: sanitizeDigits(value),
                  }))
                }
                placeholder="99112233"
              />
              <Field
                label="Имэйл"
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                placeholder="student@school.com"
              />
            </div>

            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <Button
                  className="h-[30px] rounded-full border border-[#d8e2f2] bg-white px-4 text-[13px] font-medium text-[#6f7c95] hover:bg-[#f5f8fd]"
                  onClick={handleFillDemo}
                  type="button"
                  variant="outline"
                >
                  Demo
                </Button>
                <Button
                  className="h-[30px] rounded-full bg-[#6c9dff] px-4 text-[13px] font-medium text-white hover:bg-[#5e91fb]"
                  disabled={isSubmitting || !form.name || !form.studentCode || !form.email}
                  type="submit"
                >
                  {isSubmitting ? "Бүртгэж байна" : "Бүртгэх"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  value: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-semibold text-[#687490]">{label}</Label>
      <Input
        className="h-[32px] rounded-[12px] border-[#e2e7f0] bg-white px-3 text-[13px] text-[#59657f] shadow-none placeholder:text-[#bcc5d6]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function buildNextStudentCode(classData: Class) {
  const maxNumericId = classData.students.reduce((maxValue, student) => {
    const digits = Number.parseInt(student.id.replace(/\D/g, ""), 10)
    return Number.isFinite(digits) ? Math.max(maxValue, digits) : maxValue
  }, 20245000)

  return String(maxNumericId + 1)
}

function sanitizeMongolianName(value: string) {
  return value.replace(/[^А-ЯЁӨҮа-яёөү\s]/g, "")
}

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

function sanitizeRegisterNumber(value: string) {
  const normalized = value.toUpperCase().replace(/[^А-ЯЁӨҮа-яёөү0-9]/g, "")
  const letters = normalized.replace(/[^А-ЯЁӨҮ]/g, "").slice(0, 2)
  const digits = normalized.replace(/\D/g, "").slice(0, 8)
  return `${letters}${digits}`
}

function isValidRegisterNumber(value: string) {
  return /^[А-ЯЁӨҮ]{2}\d+$/.test(value)
}
